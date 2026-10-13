import { IotIntroStep } from './steps/IotIntroStep.jsx'
import { MqttIntroStep } from './steps/MqttIntroStep.jsx'
import { ArduinoSetupStep } from './steps/ArduinoSetupStep.jsx'
import { PermissionsQosStep } from './steps/PermissionsQosStep.jsx'

// Registro del material de apoyo. Para agregar un diagrama nuevo:
//   1. Fuente en iot-dashboard/archify/<nombre>.<tipo>.json
//   2. HTML generado con archify en iot-dashboard/public/archify/<nombre>.html
//   3. Un paso { kind: 'archify', src: '/archify/<nombre>.html' } en una guía.
//      Se abre en modo presentación; usa present: false para la vista normal.
// Los pasos de tipo 'component' renderizan un componente React propio.
export const GUIDES = [
  {
    id: 'conectar-dispositivo',
    title: 'Conectar tu dispositivo',
    description: 'Qué es IoT, qué es MQTT, código Arduino, cómo viaja el mensaje y buenas prácticas.',
    steps: [
      {
        id: 'que-es-iot',
        title: '¿Qué es IoT?',
        kind: 'component',
        component: IotIntroStep,
      },
      {
        id: 'que-es-mqtt',
        title: '¿Qué es MQTT?',
        kind: 'component',
        component: MqttIntroStep,
      },
      {
        id: 'codigo-arduino',
        title: 'Código Arduino',
        kind: 'component',
        component: ArduinoSetupStep,
      },
      {
        id: 'enlace-mqtt',
        title: 'Cómo viaja el mensaje',
        kind: 'archify',
        src: '/archify/enlace-mqtt.html',
      },
      {
        id: 'permisos-qos',
        title: 'Permisos y QoS',
        kind: 'component',
        component: PermissionsQosStep,
      },
    ],
  },
]

// Lista plana de pasos para navegar con flechas entre guías.
export const ALL_STEPS = GUIDES.flatMap((guide) =>
  guide.steps.map((step) => ({ guide, step }))
)

export function findStep(guideId, stepId) {
  const index = ALL_STEPS.findIndex(
    ({ guide, step }) => guide.id === guideId && (!stepId || step.id === stepId)
  )
  return index === -1 ? 0 : index
}
