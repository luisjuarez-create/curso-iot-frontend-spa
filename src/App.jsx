import React, { useState, useEffect } from 'react'
import { Header } from './components/Header.jsx'
import { VariablesPanel } from './components/VariablesPanel.jsx'
import { CanvasGrid } from './components/CanvasGrid.jsx'
import { DeviceModal } from './components/DeviceModal.jsx'
import { AddWidgetModal } from './components/AddWidgetModal.jsx'
import { WidgetSettingsModal } from './components/WidgetSettingsModal.jsx'
import { MobileVariablesDrawer } from './components/MobileVariablesDrawer.jsx'
import { useMqtt } from './hooks/useMqtt.js'
import { DEFAULT_COLORS } from './lib/widgetSettings.js'
import { HelpHub } from './help/HelpHub.jsx'
import { useHashRoute, helpHash, navigate } from './help/hashRoute.js'
import { Layers, Plus, Radio } from 'lucide-react'

export default function App() {
  const route = useHashRoute()
  // Device & Broker Config (reads environment variables with fallbacks)
  const isHttps = typeof window !== 'undefined' && window.location.protocol === 'https:'
  const defaultSecureBroker = 'wss://curso-iot-broker-100-48-65-94.sslip.io'
  const defaultInsecureBroker = 'ws://100.48.65.94:9001'

  const defaultBroker = import.meta.env.VITE_MQTT_BROKER_URL || (isHttps ? defaultSecureBroker : defaultInsecureBroker)

  // El tópico se elige siempre al entrar; el último usado solo precarga el diálogo.
  const [deviceId, setDeviceId] = useState('')
  const [lastTopic] = useState(() => localStorage.getItem('cidesi_iot_device_id') || '')
  const [brokerUrl, setBrokerUrl] = useState(() => {
    const saved = localStorage.getItem('cidesi_iot_broker_url')
    if (saved) {
      // Si la página se carga sobre HTTPS y el localStorage tiene ws:// inseguro, migrar a wss://
      if (isHttps && saved.startsWith('ws://')) {
        localStorage.setItem('cidesi_iot_broker_url', defaultSecureBroker)
        return defaultSecureBroker
      }
      return saved
    }
    return defaultBroker
  })

  // Modals state
  const [isDeviceModalOpen, setIsDeviceModalOpen] = useState(true)
  const [isAddWidgetModalOpen, setIsAddWidgetModalOpen] = useState(false)
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false)
  const [settingsWidget, setSettingsWidget] = useState(null)
  const [bindingVariable, setBindingVariable] = useState(null)

  // Widgets state (persisted in localStorage). El lienzo inicia vacío.
  const [widgets, setWidgets] = useState(() => {
    try {
      const saved = localStorage.getItem('cidesi_iot_widgets_v4')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  // Persist widgets
  useEffect(() => {
    localStorage.setItem('cidesi_iot_widgets_v4', JSON.stringify(widgets))
  }, [widgets])

  // MQTT Hook
  const { status, deviceStatus, lastSeenText, variables, packetCount } = useMqtt(brokerUrl, deviceId)

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
        variableType: 'generic',
        unit: '',
        scaleMin: null,
        scaleMax: null,
        min: null,
        max: null,
        ...DEFAULT_COLORS,
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

  const openHelp = () => navigate(helpHash())

  if (route.view === 'help') {
    return <HelpHub guideId={route.guideId} stepId={route.stepId} onExit={() => navigate('#/')} />
  }

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-950 text-slate-100">
      {/* Top Header */}
      <Header
        deviceId={deviceId}
        status={status}
        deviceStatus={deviceStatus}
        lastSeenText={lastSeenText}
        packetCount={packetCount}
        onOpenDeviceModal={() => setIsDeviceModalOpen(true)}
        onOpenHelp={openHelp}
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
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Nuevo Widget</span>
        </button>
      </footer>

      {/* Modals & Drawers */}
      <DeviceModal
        isOpen={isDeviceModalOpen}
        key={isDeviceModalOpen ? 'device-modal-open' : 'device-modal-closed'}
        currentDeviceId={deviceId || lastTopic}
        currentBrokerUrl={brokerUrl}
        onSave={handleSaveDevice}
        onClose={() => setIsDeviceModalOpen(false)}
        canClose={Boolean(deviceId)}
        onOpenHelp={openHelp}
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
