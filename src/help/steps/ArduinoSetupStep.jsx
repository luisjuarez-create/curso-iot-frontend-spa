import React from 'react'
import { Package, Server, Code2, Braces, Send, Download, Wifi, Tag } from 'lucide-react'
import { CodeBlock } from '../CodeBlock.jsx'
import { Section } from '../Section.jsx'

const BROKER_HOST = '100.48.65.94'
const BROKER_PORT = 1883
const DEVICE_ID = 'unoq-xxxxxxxx'
const EXAMPLE_DEVICE_ID = 'unoq-0fb74d07'
const PROJECT_ZIP_NAME = 'IoT-MQTT.zip'
const PROJECT_ZIP = `/downloads/${PROJECT_ZIP_NAME}`

const LIBRARIES = [
  { name: 'PubSubClient', author: "Nick O'Leary", note: 'Cliente MQTT: conecta, publica y suscribe.' },
  { name: 'ArduinoJson', author: 'Benoît Blanchon (versión 7)', note: 'Lee los comandos y arma la telemetría en JSON.' },
  { name: 'Arduino_RouterBridge', author: 'Incluida por App Lab', note: 'BridgeTCPClient: el sketch usa el WiFi del lado Linux.' },
  { name: 'Arduino_LED_Matrix', author: 'Incluida en el core del UNO Q', note: 'Dibuja en la matriz de 8 × 13 LEDs.' },
]

const CONNECTION_ROWS = [
  { label: 'Broker', value: BROKER_HOST, hint: 'Servidor Mosquitto del curso' },
  { label: 'Puerto', value: String(BROKER_PORT), hint: 'MQTT por TCP, sin cifrado' },
  { label: 'Identificador', value: DEVICE_ID, hint: 'Lo calcula tu placa con su número de serie y lo imprime en el monitor serial' },
  { label: 'Placa de ejemplo', value: EXAMPLE_DEVICE_ID, hint: 'Siempre conectada: úsala para probar el dashboard' },
  { label: 'Telemetría', value: `devices/${DEVICE_ID}/telemetry`, hint: 'Lecturas de sensores en JSON' },
  { label: 'Estado', value: `devices/${DEVICE_ID}/status`, hint: 'ONLINE / OFFLINE (última voluntad)' },
  { label: 'Comandos', value: `devices/${DEVICE_ID}/cmd`, hint: 'Órdenes del dashboard hacia la placa (interruptor, color y matriz)' },
]

const WIFI_STEPS = [
  {
    title: '1. Ver las redes disponibles',
    code: 'nmcli device wifi list',
  },
  {
    title: '2. Conectarse a una red',
    code: 'sudo nmcli device wifi connect "NOMBRE_DE_LA_RED" password "CONTRASEÑA"',
  },
  {
    title: '3. Comprobar la conexión',
    code: 'nmcli device status',
  },
]

const UNO_Q_SKETCH_YAML = `profiles:
  default:
    platforms:
      - platform: arduino:zephyr
    libraries:
      - PubSubClient (2.8.0)
      - ArduinoJson (7.4.3)
default_profile: default
`

const UNO_Q_SKETCH = `#include <Arduino_RouterBridge.h>
#include <Arduino_LED_Matrix.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>

// 1. Broker MQTT del curso
const char* MQTT_BROKER = "${BROKER_HOST}";
const int   MQTT_PORT   = ${BROKER_PORT};

// 2. Identificador único de la placa: se calcula con el número de serie
//    del microcontrolador (96 bits) y se imprime en el monitor serial.
String chipId() {
  const volatile uint32_t* uid = (const volatile uint32_t*)0x0BFA0700;  // UID del STM32U585
  uint32_t hash = 2166136261UL;
  for (int i = 0; i < 3; i++) {
    uint32_t word = uid[i];
    for (int b = 0; b < 4; b++) {
      hash ^= (word >> (8 * b)) & 0xFF;
      hash *= 16777619UL;
    }
  }
  char buf[16];
  snprintf(buf, sizeof(buf), "unoq-%08lx", (unsigned long)hash);
  return String(buf);
}

String DEVICE_ID = chipId();

String topicTelemetry = String("devices/") + DEVICE_ID + "/telemetry";
String topicStatus    = String("devices/") + DEVICE_ID + "/status";
String topicCmd       = String("devices/") + DEVICE_ID + "/cmd";

// El WiFi lo tiene el lado Linux de la placa: el socket TCP viaja por el Bridge
BridgeTCPClient<> net(Bridge);
PubSubClient mqtt(net);
Arduino_LED_Matrix matrix;

// Matriz de 8 x 13 = 104 LEDs azules (1 = encendido, 0 = apagado)
const int FILAS = 8;
const int COLUMNAS = 13;
uint8_t frame[FILAS * COLUMNAS];

String color = "#000000";
bool publishNow = false;
unsigned long lastPublish = 0;
unsigned long lastAttempt = 0;

bool matrixOn() {
  for (int i = 0; i < FILAS * COLUMNAS; i++) {
    if (frame[i]) return true;
  }
  return false;
}

// Interruptor del dashboard: {"led": true} enciende toda la matriz
void fillMatrix(uint8_t value) {
  for (int i = 0; i < FILAS * COLUMNAS; i++) frame[i] = value;
  matrix.draw(frame);
}

// Dibujo del dashboard: {"matrix": ["0001100011000", ...]}
// 8 filas de 13 caracteres, '1' = LED encendido
bool drawRows(JsonArray rows) {
  if (rows.size() != FILAS) return false;
  for (int r = 0; r < FILAS; r++) {
    const char* row = rows[r] | "";
    if (strlen(row) != COLUMNAS) return false;
  }
  for (int r = 0; r < FILAS; r++) {
    const char* row = rows[r];
    for (int c = 0; c < COLUMNAS; c++) {
      frame[r * COLUMNAS + c] = row[c] == '1' ? 1 : 0;
    }
  }
  matrix.draw(frame);
  return true;
}

bool isHexColor(const char* s) {
  if (strlen(s) != 7 || s[0] != '#') return false;
  for (int i = 1; i < 7; i++) {
    if (!isxdigit(s[i])) return false;
  }
  return true;
}

// Color del dashboard: {"color": "#ff0080"}
void setRgb(const char* hex) {
  long v = strtol(hex + 1, nullptr, 16);
  int r = (v >> 16) & 0xFF;
  int g = (v >> 8) & 0xFF;
  int b = v & 0xFF;

  // LED 3 tiene PWM: mezcla cualquier color
  analogWrite(LED3_R, r);
  analogWrite(LED3_G, g);
  analogWrite(LED3_B, b);

  // LED 4 solo enciende o apaga cada canal y es activo en LOW
  digitalWrite(LED4_R, r > 127 ? LOW : HIGH);
  digitalWrite(LED4_G, g > 127 ? LOW : HIGH);
  digitalWrite(LED4_B, b > 127 ? LOW : HIGH);

  color = hex;
  color.toLowerCase();
}

void onMessage(char* topic, byte* payload, unsigned int length) {
  JsonDocument doc;
  if (deserializeJson(doc, payload, length)) {
    Monitor.println("Comando ignorado, no es JSON");
    return;
  }

  if (doc["led"].is<bool>()) {
    fillMatrix(doc["led"] ? 1 : 0);
    publishNow = true;
  }

  const char* hex = doc["color"] | "";
  if (isHexColor(hex)) {
    setRgb(hex);
    publishNow = true;
  }

  if (doc["matrix"].is<JsonArray>() && drawRows(doc["matrix"].as<JsonArray>())) {
    publishNow = true;
  }
}

bool connectMQTT() {
  // BridgeTCPClient devuelve 0 al conectar (no 1 como WiFiClient):
  // abrimos el socket primero y PubSubClient lo reutiliza
  if (!net.connected() && net.connect(MQTT_BROKER, MQTT_PORT) < 0) {
    Monitor.println("No se pudo abrir el socket al broker");
    return false;
  }

  String clientId = String("unoq-") + DEVICE_ID + "-" + String(random(0xffff), HEX);
  String offline  = String("{\\"device_id\\":\\"") + DEVICE_ID + "\\",\\"estado\\":\\"OFFLINE\\"}";

  // Última voluntad (LWT): si la placa se desconecta, el broker publica OFFLINE
  if (!mqtt.connect(clientId.c_str(), topicStatus.c_str(), 1, true, offline.c_str())) {
    Monitor.print("Fallo MQTT, rc=");
    Monitor.println(mqtt.state());
    net.stop();
    return false;
  }

  String online = String("{\\"device_id\\":\\"") + DEVICE_ID + "\\",\\"estado\\":\\"ONLINE\\"}";
  mqtt.publish(topicStatus.c_str(), online.c_str(), true);
  mqtt.subscribe(topicCmd.c_str(), 1);
  Monitor.print("MQTT conectado. Escribe en el dashboard: ");
  Monitor.println(DEVICE_ID);
  publishNow = true;
  return true;
}

void publishTelemetry() {
  JsonDocument doc;
  doc["device_id"]   = DEVICE_ID;
  doc["temperatura"] = 20.0 + random(0, 100) / 10.0;  // reemplaza con tu sensor
  doc["humedad"]     = 40.0 + random(0, 200) / 10.0;

  // Estado real de la placa: así el dashboard confirma cada comando
  doc["led"]   = matrixOn();
  doc["color"] = color;
  JsonArray rows = doc["matrix"].to<JsonArray>();
  for (int r = 0; r < FILAS; r++) {
    char row[COLUMNAS + 1];
    for (int c = 0; c < COLUMNAS; c++) row[c] = frame[r * COLUMNAS + c] ? '1' : '0';
    row[COLUMNAS] = '\\0';
    rows.add(row);
  }

  char payload[400];
  serializeJson(doc, payload);
  mqtt.publish(topicTelemetry.c_str(), payload);
}

void setup() {
  Bridge.begin();
  net.begin();
  Monitor.begin(115200);
  Monitor.print("Tu identificador: ");
  Monitor.println(DEVICE_ID);

  matrix.begin();
  matrix.setGrayscaleBits(1);
  fillMatrix(0);

  pinMode(LED4_R, OUTPUT);
  pinMode(LED4_G, OUTPUT);
  pinMode(LED4_B, OUTPUT);
  setRgb("#000000");

  mqtt.setServer(MQTT_BROKER, MQTT_PORT);
  mqtt.setBufferSize(512);  // la telemetría con la matriz pasa de 256 bytes
  mqtt.setCallback(onMessage);
}

void loop() {
  if (!mqtt.connected()) {
    if (millis() - lastAttempt >= 5000) {
      lastAttempt = millis();
      connectMQTT();
    }
    return;
  }
  mqtt.loop();

  if (publishNow || millis() - lastPublish >= 3000) {
    publishNow = false;
    lastPublish = millis();
    publishTelemetry();
  }
}
`

const MONITOR_OUTPUT = `Tu identificador: ${EXAMPLE_DEVICE_ID}
MQTT conectado. Escribe en el dashboard: ${EXAMPLE_DEVICE_ID}`

const PAYLOAD = `{
  "device_id": "${DEVICE_ID}",
  "temperatura": 24.3,
  "humedad": 51.8,
  "led": true,
  "color": "#ff0080",
  "matrix": [
    "0001100011000",
    "0011110111100",
    "0011111111100",
    "0011111111100",
    "0001111111000",
    "0000111110000",
    "0000011100000",
    "0000001000000"
  ]
}`

const COMMANDS = [
  { widget: 'Interruptor ON/OFF', payload: '{"led": true}', effect: 'Enciende o apaga toda la matriz de LEDs.' },
  { widget: 'Color RGB', payload: '{"color": "#ff0080"}', effect: 'LED 3 muestra el color exacto; LED 4 una aproximación (7 colores).' },
  { widget: 'Matriz LED', payload: '{"matrix": ["0001100011000", …]}', effect: '8 filas de 13 caracteres; cada "1" enciende un LED de la matriz.' },
]

export function ArduinoSetupStep() {
  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-7">
      <p className="text-sm text-slate-300 leading-relaxed">
        El ejemplo es una App de Arduino App Lab para el <span className="text-slate-100 font-semibold">Arduino UNO Q</span>,
        programada por completo en el sketch: se conecta al broker MQTT del curso, publica sus lecturas y recibe los
        comandos para la matriz y los LEDs RGB.
      </p>

      <Section icon={Download} title="Proyecto de ejemplo">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/5">
          <div className="flex-1 min-w-0">
            <span className="block font-mono text-sm font-bold text-emerald-300">{PROJECT_ZIP_NAME}</span>
            <span className="block text-xs text-slate-300 mt-0.5">
              Impórtalo en App Lab y presiona <span className="text-slate-100 font-semibold">Run</span>. Ya trae el sketch y
              las librerías declaradas; no tienes que cambiar nada.
            </span>
          </div>
          <a
            href={PROJECT_ZIP}
            download
            className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs font-bold shadow-lg shadow-emerald-500/20 active:scale-95 transition shrink-0"
          >
            <Download className="w-4 h-4" />
            Descargar .zip
          </a>
        </div>
      </Section>

      <Section icon={Wifi} title="Conexión WiFi de la placa">
        <p className="text-sm text-slate-300 leading-relaxed">
          El UNO Q necesita estar conectado a una red WiFi con salida a internet; el WiFi se configura en la placa, no en el
          código. Abre la terminal de la placa desde Arduino App Lab y ejecuta:
        </p>
        <div className="space-y-2.5">
          {WIFI_STEPS.map((step) => (
            <CodeBlock key={step.title} code={step.code} title={step.title} />
          ))}
        </div>
        <p className="text-xs text-slate-400">
          Escribe el nombre de la red tal como aparece en la lista (respeta mayúsculas) y entre comillas. La placa recuerda
          la red y se vuelve a conectar sola al encender. En <span className="font-mono text-slate-200">nmcli device status</span>{' '}
          la interfaz <span className="font-mono text-slate-200">wlan0</span> debe aparecer como{' '}
          <span className="font-mono text-emerald-300">connected</span>.
        </p>
      </Section>

      <Section icon={Tag} title="Tu identificador">
        <p className="text-sm text-slate-300 leading-relaxed">
          Cada placa calcula su propio identificador a partir del número de serie de su microcontrolador, así que nunca se
          repite entre compañeros. Al presionar Run, ábrelo en el monitor serial de App Lab y escríbelo en el dashboard:
        </p>
        <CodeBlock code={MONITOR_OUTPUT} title="Monitor serial" />
        <p className="text-xs text-slate-400">
          Siempre es el mismo para tu placa: aunque la reinicies o cargues otra versión del sketch, no cambia.
        </p>
      </Section>

      <Section icon={Server} title="Datos de conexión">
        <div className="rounded-xl border border-slate-800 overflow-hidden divide-y divide-slate-800">
          {CONNECTION_ROWS.map((row) => (
            <div key={row.label} className="grid grid-cols-[120px_1fr] sm:grid-cols-[170px_1fr] gap-3 px-3.5 py-2.5 bg-slate-900/50">
              <span className="text-xs text-slate-400">{row.label}</span>
              <div className="min-w-0">
                <span className="block font-mono text-sm text-cyan-300 break-all">{row.value}</span>
                <span className="block text-[11px] text-slate-500">{row.hint}</span>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section icon={Package} title="Librerías">
        <div className="grid sm:grid-cols-2 gap-2.5">
          {LIBRARIES.map((lib) => (
            <div key={lib.name} className="p-3 rounded-xl border border-slate-800 bg-slate-900/70">
              <span className="block font-mono text-sm font-bold text-emerald-300">{lib.name}</span>
              <span className="block text-[11px] text-slate-400 mt-0.5">{lib.author}</span>
              <span className="block text-xs text-slate-300 mt-1.5">{lib.note}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-400">
          No instalas nada a mano: PubSubClient y ArduinoJson están declaradas en{' '}
          <span className="font-mono text-slate-200">sketch/sketch.yaml</span> y App Lab las descarga al presionar Run.
        </p>
      </Section>

      <Section icon={Code2} title="Código de la App">
        <p className="text-sm text-slate-300 leading-relaxed">
          Es el mismo código que trae el .zip. Si prefieres crear la App a mano, reemplaza estos dos archivos de la carpeta{' '}
          <span className="font-mono text-slate-200">sketch</span>; <span className="font-mono text-slate-200">python/main.py</span>{' '}
          se queda como lo crea App Lab.
        </p>
        <CodeBlock code={UNO_Q_SKETCH_YAML} title="sketch/sketch.yaml" collapsible />
        <CodeBlock code={UNO_Q_SKETCH} title="sketch/sketch.ino" collapsible />
      </Section>

      <Section icon={Send} title="Comandos desde el dashboard">
        <p className="text-sm text-slate-300 leading-relaxed">
          Agrega los widgets <span className="text-slate-100 font-semibold">Interruptor ON/OFF</span>,{' '}
          <span className="text-slate-100 font-semibold">Color RGB</span> y{' '}
          <span className="text-slate-100 font-semibold">Matriz LED</span>. Cada uno publica un JSON en{' '}
          <span className="font-mono text-cyan-300">devices/{DEVICE_ID}/cmd</span>. La placa aplica el cambio y lo
          reporta en su telemetría; cuando el valor regresa, el widget lo marca como confirmado.
        </p>
        <div className="rounded-xl border border-slate-800 overflow-hidden divide-y divide-slate-800">
          {COMMANDS.map((c) => (
            <div key={c.widget} className="grid sm:grid-cols-[150px_190px_1fr] gap-1 sm:gap-3 px-3.5 py-2.5 bg-slate-900/50">
              <span className="text-xs text-slate-400">{c.widget}</span>
              <span className="font-mono text-sm text-cyan-300 break-all">{c.payload}</span>
              <span className="text-xs text-slate-300">{c.effect}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section icon={Braces} title="Qué recibe el dashboard">
        <p className="text-sm text-slate-300 leading-relaxed">
          Cada campo del JSON se convierte en una variable que puedes arrastrar a un widget. El campo{' '}
          <span className="font-mono text-slate-200">device_id</span> se ignora. Los campos{' '}
          <span className="font-mono text-slate-200">led</span>, <span className="font-mono text-slate-200">color</span> y{' '}
          <span className="font-mono text-slate-200">matrix</span> son los que confirman los comandos.
        </p>
        <CodeBlock code={PAYLOAD} title={`devices/${DEVICE_ID}/telemetry`} />
      </Section>
    </div>
  )
}
