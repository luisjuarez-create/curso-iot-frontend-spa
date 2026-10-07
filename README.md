# CIDESI IoT - Dashboard en Tiempo Real (Frontend)

Aplicación web desarrollada en React + Vite + Tailwind CSS para el monitoreo interactivo de dispositivos IoT con soporte de **Drag & Drop** y conexión directa a **MQTT sobre WebSockets** (`ws://...:9001`).

---

## 🚀 Características

- **Conexión Nativa MQTT WebSockets:** Se conecta directamente al broker Eclipse Mosquitto en el puerto `9001` sin requerir backends intermedios.
- **Detección Automática de Variables:** Al conectarse a un dispositivo (`devices/{device_id}/#`), analiza el payload JSON en tiempo real y extrae dinámicamente todas las variables disponibles.
- **Panel Izquierdo (30%):** Muestra las variables detectadas con sus valores en vivo, estampas de tiempo, unidades sugeridas (°C, %, hPa, V) y soporte para arrastrar (`draggable`).
- **Lienzo Principal (70%):** Cuadrícula responsiva donde el usuario puede:
  - Crear widgets numéricos.
  - Ajustar el tamaño del widget (`1x`, `2x`, `3x`, `4x` columnas).
  - Arrastrar variables desde el panel izquierdo y soltarlas sobre el widget para vincularlas.
- **Persistencia en LocalStorage:** La configuración de widgets y el ID del dispositivo se guardan en el navegador del usuario.

---

## 🛠️ Desarrollo Local

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`.

---

## 🐳 Despliegue en Dokploy / Docker

Este proyecto incluye `Dockerfile` multi-stage y `nginx.conf` optimizado para servirse como contenedor ultraligero (~15 MB de RAM).

### Pasos para conectar a Dokploy:
1. Sube este repositorio a tu cuenta de GitHub.
2. En tu panel de Dokploy, entra al proyecto **Curso IoT**.
3. Selecciona **Crear Aplicación (Application)**.
4. Selecciona tu repositorio de GitHub, rama `main`.
5. Dokploy detectará el `Dockerfile` y compilará la imagen automáticamente.
6. Asigna el puerto de salida `80` o configúrale un dominio con SSL gratuito vía Traefik.
