import React, { useState, useEffect } from 'react'
import { Header } from './components/Header.jsx'
import { VariablesPanel } from './components/VariablesPanel.jsx'
import { CanvasGrid } from './components/CanvasGrid.jsx'
import { DeviceModal } from './components/DeviceModal.jsx'
import { AddWidgetModal } from './components/AddWidgetModal.jsx'
import { useMqtt } from './hooks/useMqtt.js'

export default function App() {
  // Device & Broker Config
  const [deviceId, setDeviceId] = useState(() => {
    return localStorage.getItem('cidesi_iot_device_id') || '002130123'
  })
  const [brokerUrl, setBrokerUrl] = useState(() => {
    return localStorage.getItem('cidesi_iot_broker_url') || 'ws://100.48.65.94:9001'
  })

  // Modals state
  const [isDeviceModalOpen, setIsDeviceModalOpen] = useState(() => {
    return !localStorage.getItem('cidesi_iot_device_id')
  })
  const [isAddWidgetModalOpen, setIsAddWidgetModalOpen] = useState(false)

  // Widgets state (persisted in localStorage)
  const [widgets, setWidgets] = useState(() => {
    try {
      const saved = localStorage.getItem('cidesi_iot_widgets')
      return saved
        ? JSON.parse(saved)
        : [
            // Widgets default iniciales para tener algo listo de prueba
            {
              id: 'widget-1',
              type: 'numeric',
              title: 'TEMPERATURA',
              variableKey: 'temperatura',
              colSpan: 1,
            },
            {
              id: 'widget-2',
              type: 'numeric',
              title: 'HUMEDAD AMBIENTE',
              variableKey: 'humedad',
              colSpan: 1,
            },
            {
              id: 'widget-3',
              type: 'numeric',
              title: 'PRESIÓN BAROMÉTRICA',
              variableKey: 'presion',
              colSpan: 2,
            },
          ]
    } catch {
      return []
    }
  })

  // Persist widgets
  useEffect(() => {
    localStorage.setItem('cidesi_iot_widgets', JSON.stringify(widgets))
  }, [widgets])

  // MQTT Hook
  const { status, variables, packetCount, lastPacketTime } = useMqtt(brokerUrl, deviceId)

  // Handlers
  const handleSaveDevice = ({ deviceId: newId, brokerUrl: newBroker }) => {
    setDeviceId(newId)
    setBrokerUrl(newBroker)
    localStorage.setItem('cidesi_iot_device_id', newId)
    localStorage.setItem('cidesi_iot_broker_url', newBroker)
    setIsDeviceModalOpen(false)
  }

  const handleAddWidget = (widgetType) => {
    const newWidget = {
      id: `widget-${Date.now()}`,
      type: widgetType,
      title: 'NUEVO WIDGET',
      variableKey: null,
      colSpan: 1,
    }
    setWidgets((prev) => [...prev, newWidget])
  }

  const handleUpdateWidget = (id, updates) => {
    setWidgets((prev) =>
      prev.map((w) => (w.id === id ? { ...w, ...updates } : w))
    )
  }

  const handleDeleteWidget = (id) => {
    setWidgets((prev) => prev.filter((w) => w.id !== id))
  }

  const handleClearAll = () => {
    if (window.confirm('¿Deseas eliminar todos los widgets del lienzo?')) {
      setWidgets([])
    }
  }

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-950 text-slate-100">
      {/* Top Header */}
      <Header
        deviceId={deviceId}
        status={status}
        packetCount={packetCount}
        onOpenDeviceModal={() => setIsDeviceModalOpen(true)}
        onOpenAddWidgetModal={() => setIsAddWidgetModalOpen(true)}
      />

      {/* Main Two-Panel Content: 30% Left (Variables), 70% Right (Canvas) */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left 30% Panel */}
        <VariablesPanel
          variables={variables}
          deviceId={deviceId}
          status={status}
        />

        {/* Right 70% Panel */}
        <CanvasGrid
          widgets={widgets}
          variables={variables}
          onUpdateWidget={handleUpdateWidget}
          onDeleteWidget={handleDeleteWidget}
          onOpenAddWidgetModal={() => setIsAddWidgetModalOpen(true)}
          onClearAll={handleClearAll}
        />
      </div>

      {/* Modals */}
      <DeviceModal
        isOpen={isDeviceModalOpen}
        currentDeviceId={deviceId}
        currentBrokerUrl={brokerUrl}
        onSave={handleSaveDevice}
        onClose={() => setIsDeviceModalOpen(false)}
        canClose={Boolean(deviceId)}
      />

      <AddWidgetModal
        isOpen={isAddWidgetModalOpen}
        onClose={() => setIsAddWidgetModalOpen(false)}
        onAddWidget={handleAddWidget}
      />
    </div>
  )
}
