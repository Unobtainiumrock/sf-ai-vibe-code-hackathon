import React from 'react'
import { Shield, Activity, AlertTriangle } from 'lucide-react'

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-aha-blue mr-3" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  AHA Dashboard
                </h1>
                <p className="text-sm text-gray-500">
                  Autonomous AI Healing Agent
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-sm text-gray-600">
                <Activity className="h-4 w-4 mr-1 text-aha-green" />
                <span>System Active</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}

export default Layout
