import React from 'react'
import { Package, Server, Tag, Code2, Braces } from 'lucide-react'
import { CodeBlock } from '../CodeBlock.jsx'
import { Section } from '../Section.jsx'

const BROKER_HOST = '100.48.65.94'
const BROKER_PORT = 1883

const LIBRARIES = [
  { name: 'WiFi.h', author: 'Incluida en el core ESP32 de Espressif', note: 'No se instala aparte.' },
  { name: 'PubSubClient', author: "Nick O'Leary", note: 'Cliente MQTT: conecta, publica y suscribe.' },
  { name: 'ArduinoJson', author: 'Benoît Blanchon (versión 7)', note: 'Arma el mensaje en formato JSON.' },
]

const CONNECTION_ROWS = [
  { label: 'Broker', value: BROKER_HOST, hint: 'Servidor Mosquitto del curso' },
  { label: 'Puerto', value: String(BROKER_PORT), hint: 'MQTT por TCP, sin cifrado' },
  { label: 'Tópico base', value: 'devices/', hint: 'Todos los dispositivos publican debajo de esta ruta' },
  { label: 'Telemetría', value: 'devices/<tu-id>/telemetry', hint: 'Lecturas de sensores en JSON' },
  { label: 'Estado', value: 'devices/<tu-id>/status', hint: 'ONLINE / OFFLINE (última voluntad)' },
  { label: 'El dashboard escucha', value: 'devices/<tu-id>/#', hint: '# = todo lo que cuelga de tu id' },
]

const SKETCH = `#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>

// 1. Red WiFi (2.4 GHz)
const char* WIFI_SSID     = "TU_RED_WIFI";
const char* WIFI_PASSWORD = "TU_PASSWORD";

// 2. Broker MQTT del curso
const char* MQTT_BROKER = "${BROKER_HOST}";
const int   MQTT_PORT   = ${BROKER_PORT};

// 3. Tu identificador: minúsculas, números y guion medio.
//    Es el mismo nombre que escribirás en el dashboard.
const char* DEVICE_ID = "tu-nombre-01";

String topicTelemetry = String("devices/") + DEVICE_ID + "/telemetry";
String topicStatus    = String("devices/") + DEVICE_ID + "/status";

WiFiClient espClient;
PubSubClient mqtt(espClient);
unsigned long lastPublish = 0;

void connectWiFi() {
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Conectando a WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.print("\\nIP asignada: ");
  Serial.println(WiFi.localIP());
}

void connectMQTT() {
  while (!mqtt.connected()) {
    String clientId = String("esp32-") + DEVICE_ID + "-" + String(random(0xffff), HEX);
    String offline  = String("{\\"device_id\\":\\"") + DEVICE_ID + "\\",\\"estado\\":\\"OFFLINE\\"}";

    // Última voluntad (LWT): si el ESP32 se desconecta, el broker publica OFFLINE
    if (mqtt.connect(clientId.c_str(), topicStatus.c_str(), 1, true, offline.c_str())) {
      String online = String("{\\"device_id\\":\\"") + DEVICE_ID + "\\",\\"estado\\":\\"ONLINE\\"}";
      mqtt.publish(topicStatus.c_str(), online.c_str(), true);
      Serial.println("MQTT conectado");
    } else {
      Serial.print("Fallo MQTT, rc=");
      Serial.println(mqtt.state());
      delay(3000);
    }
  }
}

void setup() {
  Serial.begin(115200);
  connectWiFi();
  mqtt.setServer(MQTT_BROKER, MQTT_PORT);
  mqtt.setBufferSize(512);  // mensajes JSON de más de 256 bytes
}

void loop() {
  if (WiFi.status() != WL_CONNECTED) connectWiFi();
  if (!mqtt.connected()) connectMQTT();
  mqtt.loop();

  if (millis() - lastPublish >= 3000) {
    lastPublish = millis();

    JsonDocument doc;
    doc["device_id"]   = DEVICE_ID;
    doc["temperatura"] = 20.0 + random(0, 100) / 10.0;  // reemplaza con tu sensor
    doc["humedad"]     = 40.0 + random(0, 200) / 10.0;

    char payload[256];
    serializeJson(doc, payload);
    mqtt.publish(topicTelemetry.c_str(), payload);
    Serial.println(payload);
  }
}
`

const PAYLOAD = `{
  "device_id": "tu-nombre-01",
  "temperatura": 24.3,
  "humedad": 51.8
}`

export function ArduinoSetupStep() {
  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-7">
      <p className="text-sm text-slate-300 leading-relaxed">
        Para que tu ESP32 aparezca en el dashboard necesita tres cosas: conectarse a una red WiFi,
        conectarse al broker MQTT del curso y publicar sus lecturas en un tópico con tu identificador.
      </p>

      <Section icon={Package} title="Librerías necesarias">
        <div className="grid sm:grid-cols-3 gap-2.5">
          {LIBRARIES.map((lib) => (
            <div key={lib.name} className="p-3 rounded-xl border border-slate-800 bg-slate-900/70">
              <span className="block font-mono text-sm font-bold text-emerald-300">{lib.name}</span>
              <span className="block text-[11px] text-slate-400 mt-0.5">{lib.author}</span>
              <span className="block text-xs text-slate-300 mt-1.5">{lib.note}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-400">
          Instálalas desde <span className="text-slate-200">Herramientas → Administrar bibliotecas</span> del Arduino IDE.
          La placa se agrega con el paquete <span className="font-mono text-slate-200">esp32</span> de Espressif en el Gestor de tarjetas.
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

      <Section icon={Tag} title="Elige tu identificador">
        <p className="text-sm text-slate-300 leading-relaxed">
          El identificador es lo que va después de <span className="font-mono text-cyan-300">devices/</span>.
          Usa solo minúsculas, números y guion medio, por ejemplo{' '}
          <span className="font-mono text-emerald-300">juan-perez-01</span>. Los tópicos distinguen mayúsculas:
          <span className="font-mono text-slate-200"> Juan</span> y <span className="font-mono text-slate-200">juan</span> son tópicos distintos.
          Escribe exactamente el mismo identificador en el firmware y en el dashboard.
        </p>
      </Section>

      <Section icon={Code2} title="Sketch de ejemplo">
        <CodeBlock code={SKETCH} title="conexion_iot.ino" />
      </Section>

      <Section icon={Braces} title="Qué recibe el dashboard">
        <p className="text-sm text-slate-300 leading-relaxed">
          Cada campo del JSON se convierte en una variable que puedes arrastrar a un widget.
          El campo <span className="font-mono text-slate-200">device_id</span> se ignora.
        </p>
        <CodeBlock code={PAYLOAD} title="devices/tu-nombre-01/telemetry" />
      </Section>
    </div>
  )
}
