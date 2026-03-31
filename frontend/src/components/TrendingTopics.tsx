'use client'

import { motion } from 'framer-motion'

interface TrendingTopic {
  keyword: string
  count: number
  change: number
}

interface TrendingTopicsProps {
  topics: TrendingTopic[]
}

export default function TrendingTopics({ topics }: TrendingTopicsProps) {
  if (!topics || topics.length === 0) {
    return (
      <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 hover:border-white/20 transition-all">
        <h3 className="text-sm font-light tracking-wider text-white/60 uppercase mb-6">Top Trending Topics</h3>
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <p className="text-white/40 font-light text-sm mb-1">No trends yet</p>
          <p className="text-white/30 font-light text-xs">Collect and process data to see trending topics</p>
        </div>
      </div>
    )
  }

  return (
    <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 hover:border-white/20 transition-all">
      <h3 className="text-sm font-light tracking-wider text-white/60 uppercase mb-6">Top Trending Topics</h3>
      <div className="space-y-4">
        {topics.map((topic, index) => (
          <motion.div
            key={topic.keyword}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ x: 4 }}
            className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all border border-white/5 hover:border-white/10 cursor-pointer group"
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <span className="text-xs font-light text-white/30 w-6 flex-shrink-0">#{index + 1}</span>
              <span className="font-light text-white truncate group-hover:text-cyan-400/80 transition-colors">{topic.keyword}</span>
            </div>
            <div className="flex items-center gap-4 flex-shrink-0">
              <span className="text-xs text-white/40 font-light">{topic.count} mentions</span>
              {topic.change !== null && topic.change !== undefined && (
                <span
                  className={`text-xs font-light px-2 py-1 rounded ${
                    topic.change >= 0 
                      ? 'text-cyan-400/80 bg-cyan-500/10 border border-cyan-500/20' 
                      : 'text-red-400/80 bg-red-500/10 border border-red-500/20'
                  }`}
                >
                  {topic.change >= 0 ? '+' : ''}
                  {topic.change}%
                </span>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
