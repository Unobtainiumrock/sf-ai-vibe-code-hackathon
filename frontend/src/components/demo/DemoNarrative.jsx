import React, { useState } from 'react'
import { Play, Pause, RotateCcw, CheckCircle, AlertTriangle, Brain, GitBranch, Eye } from 'lucide-react'

const DemoNarrative = ({ onStepChange, currentStep = 0 }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  
  const steps = [
    {
      id: 'target-system',
      title: 'Target System (Zypher Agent)',
      description: 'CoreSpeed Zypher framework running AI research tasks',
      icon: Brain,
      color: 'blue',
      status: 'active'
    },
    {
      id: 'langsmith-tracing',
      title: 'LangSmith Observability',
      description: 'Real-time tracing and monitoring of agent actions',
      icon: Eye,
      color: 'green',
      status: 'monitoring'
    },
    {
      id: 'failure-detection',
      title: 'Failure Detection',
      description: 'AHA detects errors and triggers analysis',
      icon: AlertTriangle,
      color: 'yellow',
      status: 'detected'
    },
    {
      id: 'diagnosis',
      title: 'AI Diagnosis',
      description: 'Claude analyzes the failure and provides root cause',
      icon: Brain,
      color: 'purple',
      status: 'analyzing'
    },
    {
      id: 'autonomous-action',
      title: 'Autonomous Action',
      description: 'AHA creates GitHub issues and tracks resolution',
      icon: GitBranch,
      color: 'red',
      status: 'acting'
    },
    {
      id: 'dashboard',
      title: 'Incident Dashboard',
      description: 'Real-time visibility into all system health',
      icon: CheckCircle,
      color: 'green',
      status: 'complete'
    }
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-blue-600 bg-blue-100'
      case 'monitoring': return 'text-green-600 bg-green-100'
      case 'detected': return 'text-yellow-600 bg-yellow-100'
      case 'analyzing': return 'text-purple-600 bg-purple-100'
      case 'acting': return 'text-red-600 bg-red-100'
      case 'complete': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">AHA Demo Flow</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="btn-primary flex items-center"
          >
            {isPlaying ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
            {isPlaying ? 'Pause' : 'Play'} Demo
          </button>
          <button
            onClick={() => onStepChange(0)}
            className="btn-secondary flex items-center"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {steps.map((step, index) => {
          const Icon = step.icon
          const isActive = index === currentStep
          const isCompleted = index < currentStep
          
          return (
            <div
              key={step.id}
              onClick={() => onStepChange(index)}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                isActive 
                  ? 'border-blue-500 bg-blue-50' 
                  : isCompleted 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center mb-2">
                <div className={`p-2 rounded-full ${getStatusColor(step.status)}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  isActive ? 'text-blue-900' : isCompleted ? 'text-green-900' : 'text-gray-700'
                }`}>
                  {step.title}
                </span>
              </div>
              <p className="text-xs text-gray-600">
                {step.description}
              </p>
              {isActive && (
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-1">
                    <div className="bg-blue-500 h-1 rounded-full animate-pulse" style={{width: '60%'}}></div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default DemoNarrative
