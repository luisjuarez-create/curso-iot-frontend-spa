import React, { useState, useEffect } from 'react'
import { Header } from './components/Header.jsx'
import { VariablesPanel } from './components/VariablesPanel.jsx'
import { CanvasGrid } from './components/CanvasGrid.jsx'
import { DeviceModal } from './components/DeviceModal.jsx'
import { AddWidgetModal } from './components/AddWidgetModal.jsx'
import { WidgetSettingsModal } from './components/WidgetSettingsModal.jsx'
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
  const [settingsWidget, setSettingsWidget] = useState(null) // widget being configured

  // Widgets state (persisted in localStorage)
  const [widgets, setWidgets] = useState(() => {
    try {
      const saved = localStorage.getItem('cidesi_iot_widgets_v3')
      if (saved) return JSON.parse(saved)

      return [
        {
          id: 'widget-kpi-temp',
          type: 'numeric',
          title: 'TEMPERATURA ACTUAL',
          variableKey: 'temperatura',
          colSpan: 1,
          rowSpan: 1,
          settings: {
            min: 18.0,
            max: 26.0,
            minColor: '#06b6d4',
            normalColor: '#10b981',
            maxColor: '#ef4444',
          },
        },
        {
          id: 'widget-gauge-hum',
          type: 'gauge',
          title: 'MEDIDOR DE HUMEDAD',
          variableKey: 'humedad',
          colSpan: 1,
          rowSpan: 1,
          settings: {
            min: 30.0,
            max: 80.0,
            minColor: '#06b6d4',
            normalColor: '#10b981',
            maxColor: '#f59e0b',
          },
        },
        {
          id: 'widget-level-bat',
          type: 'level_bar',
          title: 'NIVEL DE BATERÍA',
          variableKey: 'bateria',
          colSpan: 1,
          rowSpan: 1,
          settings: {
            min: 3.5,
            max: 4.2,
            minColor: '#ef4444',
            normalColor: '#10b981',
            maxColor: '#10b981',
          },
        },
        {
          id: 'widget-status-led',
          type: 'status_indicator',
          title: 'SUPERVISIÓN AMBIENTAL',
          variableKey: 'temperatura',
          colSpan: 1,
          rowSpan: 1,
          settings: {
            min: 15.0,
            max: 27.0,
            minColor: '#38bdf8',
            normalColor: '#10b981',
            maxColor: '#dc2626',
          },
        },
        {
          id: 'widget-chart-temp',
          type: 'line_chart',
          title: 'TENDENCIA EN TIEMPO REAL',
          variableKey: 'temperatura',
          colSpan: 2,
          rowSpan: 1,
          settings: {
            min: 19.0,
            max: 25.0,
            minColor: '#06b6d4',
            normalColor: '#22d3ee',
            maxColor: '#ef4444',
          },
        },
        {
          id: 'widget-bar-pres',
          type: 'bar_chart',
          title: 'HISTOGRAMA DE PRESIÓN',
          variableKey: 'presion',
          colSpan: 2,
          rowSpan: 1,
          settings: {
            min: 1010.0,
            max: 1018.0,
            minColor: '#06b6d4',
            normalColor: '#14b8a6',
            maxColor: '#f97316',
          },
        },
      ]
    } catch {
      return []
    }
  })

  // Persist widgets
  useEffect(() => {
    localStorage.setItem('cidesi_iot_widgets_v3', JSON.stringify(widgets))
  }, [widgets])

  // MQTT Hook
  const { status, variables, packetCount } = useMqtt(brokerUrl, deviceId)

  // Handlers
  const handleSaveDevice = ({ deviceId: newId, brokerUrl: newBroker }) => {
    setDeviceId(newId)
    setBrokerUrl(newBroker)
    localStorage.setItem('cidesi_iot_device_id', newId)
    localStorage.setItem('cidesi_iot_broker_url', newBroker)
    setIsDeviceModalOpen(false)
  }

  const handleAddWidget = (widgetType) => {
    const titles = {
      numeric: 'VALOR NUMÉRICO',
      line_chart: 'GRÁFICA TEMPORAL',
      gauge: 'MEDIDOR RADIAL',
      level_bar: 'NIVEL / BARRA',
      status_indicator: 'ESTADO / ALERTA',
      bar_chart: 'HISTOGRAMA DE BARRAS',
    }

    const defaultSpans = {
      line_chart: 2,
      bar_chart: 2,
      numeric: 1,
      gauge: 1,
      level_bar: 1,
      status_indicator: 1,
    }

    const newWidget = {
      id: `widget-${Date.now()}`,
      type: widgetType,
      title: titles[widgetType] || 'NUEVO WIDGET',
      variableKey: null,
      colSpan: defaultSpans[widgetType] || 1,
      rowSpan: 1,
      settings: {
        min: null,
        max: null,
        minColor: '#06b6d4',
        normalColor: '#10b981',
        maxColor: '#ef4444',
      },
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

  const handleReorderWidgets = (reordered) => {
    setWidgets(reordered)
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

      {/* Main Two-Panel Content: 20% Left (Variables), 80% Right (Canvas) */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left 20% Panel */}
        <VariablesPanel
          variables={variables}
          deviceId={deviceId}
          status={status}
        />

        {/* Right 80% Panel */}
        <CanvasGrid
          widgets={widgets}
          variables={variables}
          onUpdateWidget={handleUpdateWidget}
          onDeleteWidget={handleDeleteWidget}
          onReorderWidgets={handleReorderWidgets}
          onOpenAddWidgetModal={() => setIsAddWidgetModalOpen(true)}
          onOpenSettings={(w) => setSettingsWidget(w)}
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

      <WidgetSettingsModal
        isOpen={Boolean(settingsWidget)}
        widget={settingsWidget}
        onClose={() => setSettingsWidget(null)}
        onSave={handleUpdateWidget}
      />
    </div>
  )
}
