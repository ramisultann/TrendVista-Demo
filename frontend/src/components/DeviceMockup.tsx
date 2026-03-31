'use client'

import { ReactNode } from 'react'

interface DeviceMockupProps {
  children: ReactNode
  type: 'desktop' | 'tablet' | 'mobile'
  className?: string
}

export default function DeviceMockup({ children, type, className = '' }: DeviceMockupProps) {
  if (type === 'desktop') {
    return (
      <div className={`relative mx-auto ${className}`}>
        {/* Mac Frame */}
        <div className="bg-gray-800 rounded-t-lg p-2 border border-gray-700">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
        </div>
        <div className="bg-gray-900 border-x border-b border-gray-700 rounded-b-lg overflow-hidden shadow-2xl">
          {children}
        </div>
      </div>
    )
  }

  if (type === 'tablet') {
    return (
      <div className={`relative mx-auto ${className}`}>
        <div className="bg-gray-800 rounded-lg p-3 border border-gray-700 shadow-2xl">
          <div className="bg-gray-900 rounded-lg overflow-hidden">
            {children}
          </div>
        </div>
      </div>
    )
  }

  if (type === 'mobile') {
    return (
      <div className={`relative mx-auto ${className}`}>
        <div className="bg-gray-800 rounded-[2.5rem] p-3 border border-gray-700 shadow-2xl">
          <div className="bg-gray-900 rounded-[2rem] overflow-hidden">
            {/* Notch */}
            <div className="h-6 bg-gray-800 rounded-t-[2rem] flex items-center justify-center">
              <div className="w-32 h-1.5 bg-gray-700 rounded-full"></div>
            </div>
            {children}
          </div>
        </div>
      </div>
    )
  }

  return null
}
