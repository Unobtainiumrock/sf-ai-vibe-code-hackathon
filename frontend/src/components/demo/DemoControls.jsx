import React, { useState } from 'react'
import { Play, Square, RotateCcw, Zap, Brain, GitBranch } from 'lucide-react'

const DemoControls = ({ onRunDemo, onRunTargetSystem, isRunning = false }) => {
  const [selectedScenario, setSelectedScenario] = useState('ai-trends')

  const scenarios = [
    {
      id: 'ai-trends',
      name: 'AI Trends Research',
      description: 'Research latest AI trends in healthcare',
      query: 'Research AI trends in healthcare automation'
    },
    {
      id: 'json-handling',
      name: 'JSON Error Handling',
      description: 'Demonstrate malformed JSON processing',
      query: 'Demo malformed JSON handling in AI systems'
    },
    {
      id: 'enterprise-automation',
      name: 'Enterprise Automation',
      description: 'Analyze enterprise automation trends',
      query: 'AI trends in enterprise automation 2024'
    }
  ]

  const handleRunDemo = () => {
    const scenario = scenarios.find(s => s.id === selectedScenario)
    onRunDemo(scenario.query)
  }

  const handleRunTargetSystem = () => {
    const scenario = scenarios.find(s => s.id === selectedScenario)
    onRunTargetSystem(scenario.query)
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Demo Controls</h2>
        <div className="flex items-center text-sm text-gray-500">
          <Zap className="h-4 w-4 mr-1" />
          Interactive Demo
        </div>
      </div>

      {/* Scenario Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Select Demo Scenario
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {scenarios.map((scenario) => (
            <div
              key={scenario.id}
              onClick={() => setSelectedScenario(scenario.id)}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                selectedScenario === scenario.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <h3 className="font-semibold text-gray-900 mb-1">{scenario.name}</h3>
              <p className="text-sm text-gray-600">{scenario.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4">
        <button
          onClick={handleRunTargetSystem}
          disabled={isRunning}
          className="btn-primary flex items-center"
        >
          <Brain className="h-4 w-4 mr-2" />
          Run Target System
        </button>
        
        <button
          onClick={handleRunDemo}
          disabled={isRunning}
          className="btn-secondary flex items-center"
        >
          <Play className="h-4 w-4 mr-2" />
          Run Full Demo
        </button>
        
        <button
          onClick={() => window.open('https://github.com/unobtainiumrock/aha-incidents', '_blank')}
          className="btn-outline flex items-center"
        >
          <GitBranch className="h-4 w-4 mr-2" />
          View GitHub Issues
        </button>
      </div>

      {isRunning && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
            <span className="text-sm text-blue-800">Demo is running...</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default DemoControls
