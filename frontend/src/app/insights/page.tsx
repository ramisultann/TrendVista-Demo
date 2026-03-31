'use client'

import { useEffect, useState } from 'react'
import ProtectedRoute from '@/components/ProtectedRoute'
import { motion } from 'framer-motion'
import { api, Insight } from '@/lib/api'
import { isDemoMode } from '@/lib/demoMode'

const sentimentColors = {
  positive: { border: 'border-cyan-500/40', text: 'text-cyan-400/80', bg: 'bg-cyan-500/10' },
  neutral: { border: 'border-white/20', text: 'text-white/40', bg: 'bg-white/5' },
  negative: { border: 'border-red-500/40', text: 'text-red-400/80', bg: 'bg-red-500/10' },
}

export default function InsightsPage() {
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [insights, setInsights] = useState<Insight[]>([])
  const [page, setPage] = useState(0)
  const [nlpStatus, setNlpStatus] = useState<{ unprocessed_posts: number } | null>(null)
  const [sentimentFilter, setSentimentFilter] = useState<string>('all')
  const [platformFilter, setPlatformFilter] = useState<string>('all')
  const limit = 20

  useEffect(() => {
    setMounted(true)
    fetchInsights()
    fetchNlpStatus()
  }, [page, sentimentFilter, platformFilter])

  const fetchNlpStatus = async () => {
    try {
      const response = await api.getProcessingStatus()
      setNlpStatus(response.data)
    } catch (err) {
      console.error('Error fetching NLP status:', err)
    }
  }

  const fetchInsights = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await api.getInsights({
        skip: page * limit,
        limit: limit,
        sentiment: sentimentFilter !== 'all' ? sentimentFilter : undefined,
        platform: platformFilter !== 'all' ? platformFilter : undefined,
      })
      
      setInsights(response.data)
    } catch (err: any) {
      console.error('Error fetching insights:', err)
      setError(err.response?.data?.detail || 'Failed to load insights')
    } finally {
      setLoading(false)
    }
  }

  const handleProcessPosts = async () => {
    if (isDemoMode) return
    try {
      setProcessing(true)
      setError(null)
      const response = await api.triggerProcessing(100)
      const processed = response.data?.result?.processed_successfully || 0
      alert(`✅ Processed ${processed} posts! Refreshing insights...`)
      await fetchNlpStatus()
      await fetchInsights()
    } catch (err: any) {
      console.error('Processing error:', err)
      setError(err.response?.data?.detail || err.message || 'Processing failed')
    } finally {
      setProcessing(false)
    }
  }

  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-black text-white pt-16">
        {/* Ambient Background */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-gradient-to-r from-cyan-500/5 via-purple-500/5 to-pink-500/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[100px]" />
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 20 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-5xl md:text-6xl font-extralight mb-3">Recent Insights</h1>
                <p className="text-lg text-white/40 font-light">Latest social media posts and mentions</p>
              </div>
              {nlpStatus && nlpStatus.unprocessed_posts > 0 && (
                <motion.button
                  onClick={handleProcessPosts}
                  disabled={processing}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/50 rounded-lg text-white font-light transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  {processing ? 'Processing...' : `✨ Process ${nlpStatus.unprocessed_posts} Posts`}
                </motion.button>
              )}
            </div>
            
            {/* Filters */}
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <label className="text-xs text-white/60 font-light uppercase tracking-wider">Sentiment:</label>
                <select
                  value={sentimentFilter}
                  onChange={(e) => {
                    setSentimentFilter(e.target.value)
                    setPage(0)
                  }}
                  className="px-3 py-2 bg-black/50 border border-white/10 rounded-lg text-xs font-light text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
                >
                  <option value="all">All</option>
                  <option value="positive">Positive</option>
                  <option value="neutral">Neutral</option>
                  <option value="negative">Negative</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-xs text-white/60 font-light uppercase tracking-wider">Platform:</label>
                <select
                  value={platformFilter}
                  onChange={(e) => {
                    setPlatformFilter(e.target.value)
                    setPage(0)
                  }}
                  className="px-3 py-2 bg-black/50 border border-white/10 rounded-lg text-xs font-light text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
                >
                  <option value="all">All</option>
                  <option value="instagram">Instagram</option>
                  <option value="tiktok">TikTok</option>
                  <option value="reddit">Reddit</option>
                </select>
              </div>
              {nlpStatus && nlpStatus.unprocessed_posts > 0 && (
                <div className="ml-auto px-3 py-2 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                  <span className="text-xs text-yellow-400/80 font-light">
                    {nlpStatus.unprocessed_posts} posts pending processing
                  </span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500/50"></div>
              <p className="mt-4 text-white/40 font-light">Loading insights...</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="backdrop-blur-md bg-red-500/10 border border-red-500/30 rounded-xl p-6 mb-6"
            >
              <p className="text-red-400/80 font-light">Error: {error}</p>
              <button
                onClick={fetchInsights}
                className="mt-4 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg text-red-400/80 font-light transition-all"
              >
                Retry
              </button>
            </motion.div>
          )}

          {/* Insights List */}
          {!loading && !error && (
            <div className="space-y-4">
              {insights.length > 0 ? (
                insights.map((insight, index) => {
                  const sentiment = insight.sentiment_label.toLowerCase()
                  const colors = sentimentColors[sentiment as keyof typeof sentimentColors] || sentimentColors.neutral
                  const text = insight.post?.content || insight.post?.title || 'No content'
                  const keywords = insight.keywords?.map(k => k.keyword) || []
                  
                  return (
                    <motion.div
                      key={insight.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 20 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ x: 4 }}
                      className={`backdrop-blur-md bg-white/5 border-l-4 ${colors.border} border-r border-t border-b border-white/10 rounded-lg p-6 hover:bg-white/10 hover:border-white/20 transition-all`}
                    >
                      <p className="text-base text-white/90 font-light mb-4 leading-relaxed">
                        "{text.length > 200 ? text.substring(0, 200) + '...' : text}"
                      </p>
                      <div className="flex flex-wrap items-center gap-4 text-xs">
                        <span className="text-white/40 font-light uppercase tracking-wider">{insight.post?.platform || 'Unknown'}</span>
                        <span className="text-white/30">•</span>
                        <span className="text-white/40 font-light">{formatTimeAgo(insight.processed_at)}</span>
                        <span className={`ml-auto px-3 py-1 rounded-full font-light ${colors.bg} ${colors.text} border ${colors.border}`}>
                          {sentiment.charAt(0).toUpperCase() + sentiment.slice(1)}
                        </span>
                        {keywords.length > 0 && (
                          <div className="flex flex-wrap gap-2 w-full mt-2">
                            {keywords.slice(0, 5).map((keyword) => (
                              <span
                                key={keyword}
                                className="px-3 py-1 bg-white/5 text-white/60 rounded-full text-xs font-light border border-white/10"
                              >
                                #{keyword}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )
                })
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-12 backdrop-blur-md bg-white/5 border border-white/10 rounded-xl"
                >
                  <p className="text-white/60 font-light mb-2">No insights available</p>
                  <p className="text-white/40 font-light text-sm">Collect and process some posts to see insights here</p>
                </motion.div>
              )}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}
