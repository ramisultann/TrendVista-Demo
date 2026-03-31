'use client'

import { useEffect, useState, useRef } from 'react'
import ProtectedRoute from '@/components/ProtectedRoute'
import MetricCard from '@/components/MetricCard'
import TrendChart from '@/components/TrendChart'
import TrendingTopics from '@/components/TrendingTopics'
import SentimentChart from '@/components/SentimentChart'
import { motion } from 'framer-motion'
import { api, DashboardSummary, TrendChartData } from '@/lib/api'

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dashboardData, setDashboardData] = useState<DashboardSummary | null>(null)
  const [chartData, setChartData] = useState<TrendChartData | null>(null)
  const [days, setDays] = useState(7)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const datePickerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
    fetchDashboardData()
  }, [days])

  // Close date picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setShowDatePicker(false)
      }
    }
    if (showDatePicker) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showDatePicker])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const [summaryResponse, chartResponse] = await Promise.all([
        api.getDashboardSummary(days),
        api.getTrendChart(days),
      ])
      
      setDashboardData(summaryResponse.data)
      setChartData(chartResponse.data)
    } catch (err: any) {
      console.error('Error fetching dashboard data:', err)
      setError(err.response?.data?.detail || 'Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const handleExport = () => {
    if (!dashboardData) return
    
    // Create CSV content
    const csvRows = [
      ['Metric', 'Value'],
      ['Total Mentions', dashboardData.total_mentions.toString()],
      ['Total Trends', dashboardData.total_trends.toString()],
      ['Overall Sentiment', dashboardData.overall_sentiment?.toFixed(2) || 'N/A'],
      ['Growth Rate', dashboardData.growth_rate?.toFixed(2) + '%' || 'N/A'],
      ['Positive Sentiment', dashboardData.sentiment_breakdown.positive.toString()],
      ['Neutral Sentiment', dashboardData.sentiment_breakdown.neutral.toString()],
      ['Negative Sentiment', dashboardData.sentiment_breakdown.negative.toString()],
    ]
    
    const csvContent = csvRows.map(row => row.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `trendvista-dashboard-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  // Transform chart data for TrendChart component
  const transformedChartData = chartData?.data.map(item => ({
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    sentiment: Math.round((item.sentiment + 1) * 50), // Convert -1 to 1 range to 0-100
    mentions: item.mentions,
  })) || []

  // Transform topics for TrendingTopics component
  const transformedTopics = dashboardData?.top_trends.map(trend => ({
    keyword: trend.keyword,
    count: trend.mention_count,
    change: trend.change_percentage || 0,
  })) || []

  // Format sentiment for metric card (0-100 scale)
  const overallSentiment = dashboardData && dashboardData.overall_sentiment !== null
    ? Math.round((dashboardData.overall_sentiment + 1) * 50)
    : 0

  // Calculate growth rate percentage
  const growthRate = dashboardData && dashboardData.growth_rate !== null
    ? `${dashboardData.growth_rate > 0 ? '+' : ''}${dashboardData.growth_rate.toFixed(1)}%`
    : '0%'

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-black text-white pt-16">
        {/* Ambient Background */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-gradient-to-r from-cyan-500/5 via-purple-500/5 to-pink-500/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px]" />
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
            {/* Page Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 20 }}
                transition={{ duration: 0.6 }}
                className="mb-12 flex justify-between items-start"
              >
                <div>
                  <h1 className="text-5xl md:text-6xl font-extralight mb-3">Dashboard</h1>
                  <p className="text-lg text-white/40 font-light">Overview of insights and trends</p>
                </div>
                <div className="flex items-center gap-3">
                  {/* Date Range Selector */}
                  <div className="relative" ref={datePickerRef}>
                    <button
                      onClick={() => setShowDatePicker(!showDatePicker)}
                      className="px-4 py-2 border border-white/20 rounded-lg text-xs font-light tracking-wider hover:border-white/40 hover:bg-white/5 transition-all flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {days === 1 ? 'Today' : days === 7 ? 'Last 7 days' : days === 30 ? 'Last 30 days' : `${days} days`}
                    </button>
                    {showDatePicker && (
                      <div className="absolute right-0 mt-2 w-48 backdrop-blur-md bg-black/90 border border-white/20 rounded-lg p-2 z-10">
                        {[1, 7, 30, 90, 365].map((day) => (
                          <button
                            key={day}
                            onClick={() => {
                              setDays(day)
                              setShowDatePicker(false)
                            }}
                            className={`w-full text-left px-3 py-2 rounded text-xs font-light transition-colors ${
                              days === day
                                ? 'bg-cyan-500/20 text-cyan-400'
                                : 'text-white/60 hover:bg-white/10 hover:text-white'
                            }`}
                          >
                            {day === 1 ? 'Today' : day === 7 ? 'Last 7 days' : day === 30 ? 'Last 30 days' : day === 90 ? 'Last 90 days' : 'Last year'}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* Export Button */}
                  <motion.button
                    onClick={handleExport}
                    disabled={!dashboardData}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 border border-white/20 rounded-lg text-xs font-light tracking-wider hover:border-cyan-500/50 hover:bg-cyan-500/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Export
                  </motion.button>
                </div>
              </motion.div>

          {/* Loading State */}
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500/50"></div>
              <p className="mt-4 text-white/40 font-light">Loading dashboard data...</p>
            </motion.div>
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
                onClick={fetchDashboardData}
                className="mt-4 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg text-red-400/80 font-light transition-all"
              >
                Retry
              </button>
            </motion.div>
          )}

          {/* Metrics Grid */}
          {!loading && !error && dashboardData && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-12">
              <MetricCard
                title="Overall Sentiment"
                value={overallSentiment.toString()}
                change={dashboardData.sentiment_breakdown ? Math.round((dashboardData.sentiment_breakdown.positive_percent - 50)) : 0}
                changeLabel="from last week"
                icon={
                  <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">
                    <svg className="w-5 h-5 text-cyan-400/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                }
              />
              <MetricCard
                title="Total Mentions"
                value={dashboardData.total_mentions.toLocaleString()}
                change={dashboardData.growth_rate ? Math.round(dashboardData.growth_rate) : 0}
                changeLabel="from last week"
                icon={
                  <div className="w-8 h-8 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-400/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                    </svg>
                  </div>
                }
              />
              <MetricCard
                title="Trending Topics"
                value={dashboardData.total_trends.toString()}
                change={dashboardData.top_trends.length > 0 ? Math.round((dashboardData.top_trends[0]?.change_percentage || 0)) : 0}
                changeLabel="new this week"
                icon={
                  <div className="w-8 h-8 rounded-full bg-pink-500/20 border border-pink-500/30 flex items-center justify-center">
                    <svg className="w-5 h-5 text-pink-400/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                }
              />
              <MetricCard
                title="Growth Rate"
                value={growthRate}
                change={dashboardData.growth_rate ? Math.round(dashboardData.growth_rate) : 0}
                changeLabel="from last week"
                icon={
                  <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">
                    <svg className="w-5 h-5 text-cyan-400/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                }
              />
            </div>
          )}

          {/* Charts Grid */}
          {!loading && !error && dashboardData && (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
                <TrendChart data={transformedChartData.length > 0 ? transformedChartData : []} />
                <SentimentChart
                  positive={dashboardData.sentiment_breakdown?.positive || 0}
                  neutral={dashboardData.sentiment_breakdown?.neutral || 0}
                  negative={dashboardData.sentiment_breakdown?.negative || 0}
                />
              </div>

              {/* Trending Topics and Recent Insights */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <TrendingTopics topics={transformedTopics} />
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 20 }}
                  transition={{ delay: 0.3 }}
                  className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 hover:border-white/20 transition-all"
                >
                  <h3 className="text-sm font-light tracking-wider text-white/60 uppercase mb-6">Recent Insights</h3>
                  <div className="space-y-4">
                    {dashboardData.recent_insights && dashboardData.recent_insights.length > 0 ? (
                      dashboardData.recent_insights.map((insight, idx) => {
                        const timeAgo = new Date(insight.timestamp).toLocaleString('en-US', {
                          hour: 'numeric',
                          minute: '2-digit',
                          day: 'numeric',
                          month: 'short',
                        })
                        return (
                          <motion.div
                            key={insight.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: mounted ? 1 : 0, x: mounted ? 0 : -20 }}
                            transition={{ delay: 0.4 + idx * 0.1 }}
                            className="border-l-2 border-cyan-500/30 pl-4 py-2 hover:border-cyan-500/50 transition-colors"
                          >
                            <p className="text-sm text-white/80 font-light mb-2 leading-relaxed">
                              "{insight.text}"
                            </p>
                            <div className="flex items-center gap-4 text-xs text-white/40 font-light">
                              <span className="uppercase">{insight.platform}</span>
                              <span>•</span>
                              <span>{timeAgo}</span>
                              <span className={`ml-auto ${
                                insight.sentiment === 'positive' ? 'text-cyan-400/80' :
                                insight.sentiment === 'neutral' ? 'text-white/40' : 'text-red-400/80'
                              }`}>
                                {insight.sentiment ? (insight.sentiment.charAt(0).toUpperCase() + insight.sentiment.slice(1)) : 'N/A'}
                              </span>
                            </div>
                          </motion.div>
                        )
                      })
                    ) : (
                      <p className="text-white/40 font-light text-sm">No insights yet. Collect some data first!</p>
                    )}
                  </div>
                </motion.div>
              </div>
            </>
          )}

          {/* Empty State */}
          {!loading && !error && dashboardData && dashboardData.total_mentions === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12 backdrop-blur-md bg-white/5 border border-white/10 rounded-xl"
            >
              <p className="text-white/60 font-light mb-4">No data available yet</p>
              <p className="text-white/40 font-light text-sm">Start collecting data to see insights here</p>
            </motion.div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}
