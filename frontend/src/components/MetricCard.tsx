'use client'

import { motion } from 'framer-motion'

interface MetricCardProps {
  title: string
  value: string | number
  change?: number
  changeLabel?: string
  icon?: React.ReactNode
}

export default function MetricCard({ title, value, change, changeLabel, icon }: MetricCardProps) {
  const isPositive = change !== undefined && change >= 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 hover:border-white/20 transition-all"
    >
      <div className="flex items-start justify-between mb-4">
        {icon && (
          <div className="opacity-60">
            {icon}
          </div>
        )}
        {change !== undefined && (
          <div className={`flex items-center gap-1 text-xs font-light ${
            isPositive ? 'text-cyan-400/80' : 'text-red-400/80'
          }`}>
            {isPositive ? (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
            <span>{Math.abs(change)}%</span>
          </div>
        )}
      </div>
      <div>
        <div className="text-xs font-light tracking-wider text-white/40 uppercase mb-2">
          {title}
        </div>
        <div className="text-3xl font-extralight text-white">
          {value}
        </div>
        {changeLabel && (
          <div className="text-xs text-white/30 font-light mt-2">
            {changeLabel}
          </div>
        )}
      </div>
    </motion.div>
  )
}
