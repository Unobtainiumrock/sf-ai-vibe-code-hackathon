import React, { useState } from 'react'
import { ExternalLink, Clock, AlertCircle, CheckCircle, Eye, Brain, GitBranch, ChevronDown, ChevronRight } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

const IncidentCard = ({ incident }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  
  const getStatusIcon = (status) => {
    switch (status) {
      case 'detected':
        return <AlertCircle className="h-4 w-4 text-aha-yellow" />
      case 'analyzed':
        return <CheckCircle className="h-4 w-4 text-aha-green" />
      case 'resolved':
        return <CheckCircle className="h-4 w-4 text-aha-blue" />
      default:
        return <Eye className="h-4 w-4 text-aha-gray" />
    }
  }

  const getStatusClass = (status) => {
    switch (status) {
      case 'detected':
        return 'status-detected'
      case 'analyzed':
        return 'status-analyzed'
      case 'resolved':
        return 'status-resolved'
      default:
        return 'status-badge bg-gray-100 text-gray-800'
    }
  }

  const formatConfidenceScore = (score) => {
    if (!score) return 'N/A'
    return `${Math.round(score * 100)}%`
  }

  const getWorkflowSteps = () => [
    {
      id: 'detection',
      title: 'Failure Detected',
      description: 'AHA received webhook from LangSmith',
      status: 'completed',
      timestamp: incident.created_at,
      icon: AlertCircle
    },
    {
      id: 'analysis',
      title: 'AI Analysis',
      description: incident.diagnosis ? 'Claude analyzed the failure' : 'Analysis in progress...',
      status: incident.diagnosis ? 'completed' : 'pending',
      timestamp: incident.diagnosis ? incident.created_at : null,
      icon: Brain
    },
    {
      id: 'action',
      title: 'Autonomous Action',
      description: incident.github_issue_url ? 'GitHub issue created' : 'Action pending...',
      status: incident.github_issue_url ? 'completed' : 'pending',
      timestamp: incident.github_issue_url ? incident.created_at : null,
      icon: GitBranch
    }
  ]

  return (
    <div className="card p-6 hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-2">
          {getStatusIcon(incident.status)}
          <h3 className="text-lg font-semibold text-gray-900">
            {incident.error_type}
          </h3>
        </div>
        <div className="flex items-center space-x-2">
          <span className={getStatusClass(incident.status)}>
            {incident.status}
          </span>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-400 hover:text-gray-600"
          >
            {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Error Message */}
      <p className="text-gray-600 mb-4 line-clamp-2">
        {incident.error_message}
      </p>

      {/* Diagnosis (if available) */}
      {incident.diagnosis && (
        <div className="bg-blue-50 rounded-lg p-4 mb-4">
          <h4 className="text-sm font-medium text-blue-900 mb-2 flex items-center">
            <Brain className="h-4 w-4 mr-1" />
            AI Diagnosis
          </h4>
          <p className="text-sm text-blue-800 line-clamp-3">
            {incident.diagnosis}
          </p>
          {incident.confidence_score && (
            <div className="mt-2">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Confidence: {formatConfidenceScore(incident.confidence_score)}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Expanded Workflow */}
      {isExpanded && (
        <div className="border-t pt-4 mb-4">
          <h4 className="text-sm font-medium text-gray-900 mb-3">AHA Workflow</h4>
          <div className="space-y-3">
            {getWorkflowSteps().map((step, index) => {
              const Icon = step.icon
              const isCompleted = step.status === 'completed'
              const isPending = step.status === 'pending'
              
              return (
                <div key={step.id} className="flex items-start space-x-3">
                  <div className={`p-1 rounded-full ${
                    isCompleted ? 'bg-green-100' : isPending ? 'bg-yellow-100' : 'bg-gray-100'
                  }`}>
                    <Icon className={`h-4 w-4 ${
                      isCompleted ? 'text-green-600' : isPending ? 'text-yellow-600' : 'text-gray-400'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <h5 className="text-sm font-medium text-gray-900">{step.title}</h5>
                    <p className="text-xs text-gray-600">{step.description}</p>
                    {step.timestamp && (
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDistanceToNow(new Date(step.timestamp), { addSuffix: true })}
                      </p>
                    )}
                  </div>
                  <div className={`w-2 h-2 rounded-full ${
                    isCompleted ? 'bg-green-500' : isPending ? 'bg-yellow-500' : 'bg-gray-300'
                  }`}></div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Metadata */}
      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
        <div className="flex items-center">
          <Clock className="h-4 w-4 mr-1" />
          <span>
            {formatDistanceToNow(new Date(incident.created_at), { addSuffix: true })}
          </span>
        </div>
        <div className="text-xs font-mono">
          ID: {incident.id.slice(0, 8)}
        </div>
      </div>

      {/* Action Links */}
      <div className="flex space-x-3">
        {incident.langsmith_trace_url && (
          <a
            href={incident.langsmith_trace_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-sm text-aha-blue hover:text-blue-700"
          >
            <ExternalLink className="h-4 w-4 mr-1" />
            View Trace
          </a>
        )}
        {incident.github_issue_url && (
          <a
            href={incident.github_issue_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-sm text-aha-blue hover:text-blue-700"
          >
            <ExternalLink className="h-4 w-4 mr-1" />
            GitHub Issue
          </a>
        )}
      </div>
    </div>
  )
}

export default IncidentCard
