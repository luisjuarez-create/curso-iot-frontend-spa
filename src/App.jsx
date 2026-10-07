import React, { useState, useEffect } from 'react'
import { Header } from './components/Header.jsx'
import { VariablesPanel } from './components/VariablesPanel.jsx'
import { CanvasGrid } from './components/CanvasGrid.jsx'
import { DeviceModal } from './components/DeviceModal.jsx'
import { AddWidgetModal } from './components/AddWidgetModal.jsx'
import { WidgetSettingsModal } from './components/WidgetSettingsModal.jsx'
import { MobileVariablesDrawer } from './components/MobileVariablesDrawer.jsx'
import { useMqtt } from './hooks/useMqtt.js'
import { Layers, Plus, Radio } from 'lucide-react'

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
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false)
  const [settingsWidget, setSettingsWidget] = useState(null)
  const [bindingVariable, setBindingVariable] = useState(null)

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

  const handleBindVariableToWidget = (widgetId, varKey) => {
    handleUpdateWidget(widgetId, {
      variableKey: varKey,
      title: varKey.toUpperCase(),
    })
  }

  const handleStartBinding = (varKey) => {
    setBindingVariable(varKey)
    setIsMobileDrawerOpen(false)
  }

  const handleCancelBinding = () => {
    setBindingVariable(null)
  }

  const handleSelectWidgetForBinding = (widgetId) => {
    if (bindingVariable) {
      handleBindVariableToWidget(widgetId, bindingVariable)
      setBindingVariable(null)
    }
  }

  const handleClearAll = () => {
    if (window.confirm('¿Deseas eliminar todos los widgets del lienzo?')) {
      setWidgets([])
    }
  }

  const variablesCount = Object.keys(variables).length

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-950 text-slate-100">
      {/* Top Header */}
      <Header
        deviceId={deviceId}
        status={status}
        packetCount={packetCount}
        onOpenDeviceModal={() => setIsDeviceModalOpen(true)}
        onOpenMobileDrawer={() => setIsMobileDrawerOpen(true)}
        variablesCount={variablesCount}
      />

      {/* Main Two-Panel Content: 25% Left (Desktop), 75% Right (Canvas) */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        {/* Left 25% Panel (Only visible on Desktop) */}
        <VariablesPanel
          variables={variables}
          deviceId={deviceId}
          status={status}
        />

        {/* Right 75% Panel (Full width on Mobile) */}
        <CanvasGrid
          widgets={widgets}
          variables={variables}
          onUpdateWidget={handleUpdateWidget}
          onDeleteWidget={handleDeleteWidget}
          onReorderWidgets={handleReorderWidgets}
          onOpenAddWidgetModal={() => setIsAddWidgetModalOpen(true)}
          onOpenSettings={(w) => setSettingsWidget(w)}
          onClearAll={handleClearAll}
          bindingVariable={bindingVariable}
          onCancelBinding={handleCancelBinding}
          onSelectForBinding={handleSelectWidgetForBinding}
        />
      </div>

      {/* Docked Bottom Footer Bar for Mobile Devices (No overlap with widgets) */}
      <footer className="lg:hidden h-14 bg-slate-900 border-t border-slate-800 px-4 flex items-center justify-between shrink-0 z-20 shadow-2xl">
        <button
          onClick={() => setIsMobileDrawerOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700/80 transition active:scale-95 shadow-inner"
        >
          <Layers className="w-4 h-4 text-emerald-400" />
          <span>Ver Variables</span>
          <span className="font-mono text-[11px] px-1.5 py-0.2 rounded-full bg-slate-950 text-emerald-400">
            {variablesCount}
          </span>
        </button>

        <button
          onClick={() => setIsAddWidgetModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 text-xs font-bold shadow-lg shadow-emerald-500/20 active:scale-95 transition"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>+ Widget</span>
        </button>
      </footer>

      {/* Modals & Drawers */}
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

      {/* Mobile Bottom Sheet Drawer with One-Tap Vincular */}
      <MobileVariablesDrawer
        isOpen={isMobileDrawerOpen}
        onClose={() => setIsMobileDrawerOpen(false)}
        variables={variables}
        deviceId={deviceId}
        onStartBinding={handleStartBinding}
      />
    </div>
  )
}
