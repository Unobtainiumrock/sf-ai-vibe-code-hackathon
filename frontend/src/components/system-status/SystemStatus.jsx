import React, { useState, useEffect } from 'react'
import { Activity, Server, Database, Zap, CheckCircle, XCircle, Clock } from 'lucide-react'

const SystemStatus = () => {
  const [systems, setSystems] = useState([
    {
      id: 'zypher-agent',
      name: 'Zypher Research Agent',
      status: 'running',
      description: 'CoreSpeed framework with Anthropic Claude',
      lastActivity: '2 minutes ago',
      metrics: {
        requests: 12,
        successRate: 95,
        avgResponseTime: '1.2s'
      }
    },
    {
      id: 'langsmith',
      name: 'LangSmith Tracing',
      status: 'monitoring',
      description: 'Real-time observability platform',
      lastActivity: 'Just now',
      metrics: {
        traces: 45,
        events: 1200,
        errors: 3
      }
    },
    {
      id: 'aha-backend',
      name: 'AHA Backend',
      status: 'running',
      description: 'Autonomous healing agent API',
      lastActivity: '1 minute ago',
      metrics: {
        incidents: 3,
        diagnoses: 2,
        githubIssues: 1
      }
    },
    {
      id: 'aha-frontend',
      name: 'AHA Dashboard',
      status: 'running',
      description: 'Real-time incident monitoring',
      lastActivity: 'Just now',
      metrics: {
        activeUsers: 1,
        pageViews: 15,
        refreshRate: '30s'
      }
    }
  ])

  const getStatusIcon = (status) => {
    switch (status) {
      case 'running':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'monitoring':
        return <Activity className="h-5 w-5 text-blue-500" />
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <Clock className="h-5 w-5 text-yellow-500" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'running':
        return 'bg-green-100 text-green-800'
      case 'monitoring':
        return 'bg-blue-100 text-blue-800'
      case 'error':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-yellow-100 text-yellow-800'
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">System Status</h2>
        <div className="flex items-center text-sm text-gray-500">
          <Activity className="h-4 w-4 mr-1" />
          Live monitoring
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {systems.map((system) => (
          <div key={system.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                {getStatusIcon(system.status)}
                <h3 className="ml-2 font-semibold text-gray-900">{system.name}</h3>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(system.status)}`}>
                {system.status}
              </span>
            </div>
            
            <p className="text-sm text-gray-600 mb-3">{system.description}</p>
            
            <div className="text-xs text-gray-500 mb-3">
              Last activity: {system.lastActivity}
            </div>
            
            <div className="grid grid-cols-3 gap-2 text-xs">
              {Object.entries(system.metrics).map(([key, value]) => (
                <div key={key} className="text-center">
                  <div className="font-semibold text-gray-900">{value}</div>
                  <div className="text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1')}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SystemStatus
