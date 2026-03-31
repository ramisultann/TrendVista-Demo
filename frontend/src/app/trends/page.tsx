'use client'

import { useEffect, useState } from 'react'
import ProtectedRoute from '@/components/ProtectedRoute'
import TrendingTopics from '@/components/TrendingTopics'
import TrendChart from '@/components/TrendChart'
import { motion } from 'framer-motion'
import { api, TrendChartData } from '@/lib/api'

export default function TrendsPage() {
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [chartData, setChartData] = useState<TrendChartData | null>(null)
  const [topTrends, setTopTrends] = useState<Array<{ keyword: string; mention_count: number; change_percentage: number | null }>>([])

  useEffect(() => {
    setMounted(true)
    fetchTrendsData()
  }, [])

  const fetchTrendsData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const [chartResponse, trendsResponse] = await Promise.all([
        api.getTrendChart(7),
        api.getTopTrends(10, 7),
      ])
      
      setChartData(chartResponse.data)
      setTopTrends(trendsResponse.data)
    } catch (err: any) {
      console.error('Error fetching trends data:', err)
      setError(err.response?.data?.detail || 'Failed to load trends data')
    } finally {
      setLoading(false)
    }
  }

  // Transform chart data
  const transformedChartData = chartData?.data.map(item => ({
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    sentiment: Math.round((item.sentiment + 1) * 50), // Convert -1 to 1 range to 0-100
    mentions: item.mentions,
  })) || []

  // Transform topics
  const transformedTopics = topTrends.map(trend => ({
    keyword: trend.keyword,
    count: trend.mention_count,
    change: trend.change_percentage || 0,
  }))

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-black text-white pt-16">
        {/* Ambient Background */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-gradient-to-r from-purple-500/5 via-pink-500/5 to-cyan-500/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px]" />
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 20 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <h1 className="text-5xl md:text-6xl font-extralight mb-3">Trending Topics</h1>
            <p className="text-lg text-white/40 font-light">Discover what's emerging in your industry</p>
          </motion.div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500/50"></div>
              <p className="mt-4 text-white/40 font-light">Loading trends data...</p>
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
                onClick={fetchTrendsData}
                className="mt-4 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg text-red-400/80 font-light transition-all"
              >
                Retry
              </button>
            </motion.div>
          )}

          {/* Trends Content */}
          {!loading && !error && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 20 }}
                transition={{ delay: 0.2 }}
                className="lg:col-span-2"
              >
                <TrendChart data={transformedChartData.length > 0 ? transformedChartData : []} />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 20 }}
                transition={{ delay: 0.3 }}
              >
                <TrendingTopics topics={transformedTopics} />
              </motion.div>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && transformedTopics.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12 backdrop-blur-md bg-white/5 border border-white/10 rounded-xl"
            >
              <p className="text-white/60 font-light mb-2">No trends available yet</p>
              <p className="text-white/40 font-light text-sm">Collect and process data to see trending topics</p>
            </motion.div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}
