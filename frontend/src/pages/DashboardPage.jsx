import React, { useState, useEffect } from 'react'
import { RefreshCw, Trash2, AlertTriangle, TrendingUp } from 'lucide-react'
import IncidentCard from '../components/IncidentCard'
import DemoNarrative from '../components/demo/DemoNarrative'
import SystemStatus from '../components/system-status/SystemStatus'
import DemoControls from '../components/demo/DemoControls'
import { incidentAPI } from '../services/api'

const DashboardPage = () => {
  const [incidents, setIncidents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [refreshing, setRefreshing] = useState(false)
  const [currentDemoStep, setCurrentDemoStep] = useState(0)
  const [isDemoRunning, setIsDemoRunning] = useState(false)

  const fetchIncidents = async () => {
    try {
      setError(null)
      const data = await incidentAPI.getIncidents()
      setIncidents(data)
    } catch (err) {
      setError('Failed to fetch incidents')
      console.error('Error fetching incidents:', err)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchIncidents()
  }

  const handleClearAll = async () => {
    if (window.confirm('Are you sure you want to clear all incidents? This action cannot be undone.')) {
      try {
        await incidentAPI.clearIncidents()
        setIncidents([])
      } catch (err) {
        setError('Failed to clear incidents')
        console.error('Error clearing incidents:', err)
      }
    }
  }

  const handleRunDemo = async (query) => {
    setIsDemoRunning(true)
    setCurrentDemoStep(0)
    
    // Simulate demo progression
    const steps = [
      'target-system',
      'langsmith-tracing', 
      'failure-detection',
      'diagnosis',
      'autonomous-action',
      'dashboard'
    ]
    
    for (let i = 0; i < steps.length; i++) {
      setCurrentDemoStep(i)
      await new Promise(resolve => setTimeout(resolve, 2000))
    }
    
    // Refresh incidents after demo
    await fetchIncidents()
    setIsDemoRunning(false)
  }

  const handleRunTargetSystem = async (query) => {
    setIsDemoRunning(true)
    setCurrentDemoStep(0)
    
    // Simulate target system running
    const steps = ['target-system', 'langsmith-tracing']
    for (let i = 0; i < steps.length; i++) {
      setCurrentDemoStep(i)
      await new Promise(resolve => setTimeout(resolve, 1500))
    }
    
    setIsDemoRunning(false)
  }

  useEffect(() => {
    fetchIncidents()
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchIncidents, 30000)
    return () => clearInterval(interval)
  }, [])

  const getStats = () => {
    const total = incidents.length
    const analyzed = incidents.filter(i => i.status === 'analyzed').length
    const resolved = incidents.filter(i => i.status === 'resolved').length
    const avgConfidence = incidents
      .filter(i => i.confidence_score)
      .reduce((sum, i) => sum + i.confidence_score, 0) / 
      incidents.filter(i => i.confidence_score).length || 0

    return { total, analyzed, resolved, avgConfidence }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-aha-blue"></div>
        <span className="ml-2 text-gray-600">Loading incidents...</span>
      </div>
    )
  }

  const stats = getStats()

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Autonomous AI Healing Agent (AHA)
            </h1>
            <p className="text-gray-600 mt-1">
              Real-time monitoring and autonomous healing of AI agent systems
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="btn-secondary flex items-center"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              onClick={handleClearAll}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors flex items-center"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All
            </button>
          </div>
        </div>
      </div>

      {/* Demo Narrative */}
      <DemoNarrative 
        onStepChange={setCurrentDemoStep}
        currentStep={currentDemoStep}
      />

      {/* Demo Controls */}
      <DemoControls 
        onRunDemo={handleRunDemo}
        onRunTargetSystem={handleRunTargetSystem}
        isRunning={isDemoRunning}
      />

      {/* System Status */}
      <SystemStatus />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card p-6">
          <div className="flex items-center">
            <AlertTriangle className="h-8 w-8 text-aha-red" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Incidents</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>
        
        <div className="card p-6">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-aha-green" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Analyzed</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.analyzed}</p>
            </div>
          </div>
        </div>
        
        <div className="card p-6">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-aha-blue" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Resolved</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.resolved}</p>
            </div>
          </div>
        </div>
        
        <div className="card p-6">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-aha-yellow" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Confidence</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.avgConfidence ? `${Math.round(stats.avgConfidence * 100)}%` : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Incidents List */}
      {incidents.length === 0 ? (
        <div className="text-center py-12">
          <AlertTriangle className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No incidents detected</h3>
          <p className="mt-1 text-sm text-gray-500">
            Your AI agents are running smoothly! Incidents will appear here when detected.
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {incidents.map((incident) => (
            <IncidentCard key={incident.id} incident={incident} />
          ))}
        </div>
      )}
    </div>
  )
}

export default DashboardPage
