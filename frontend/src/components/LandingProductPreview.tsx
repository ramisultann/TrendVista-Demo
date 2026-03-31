'use client'

import { motion } from 'framer-motion'
import TrendChart from '@/components/TrendChart'
import SentimentChart from '@/components/SentimentChart'
import { getDemoDashboardSummary, getDemoTrendChart } from '@/demo/mockData'

export default function LandingProductPreview() {
  const summary = getDemoDashboardSummary(7)
  const chart = getDemoTrendChart(7)

  const transformedChartData =
    chart.data.map((item) => ({
      date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      sentiment: Math.round((item.sentiment + 1) * 50),
      mentions: item.mentions,
    })) || []

  const transformedTopics =
    summary.top_trends.map((trend) => ({
      keyword: trend.keyword,
      count: trend.mention_count,
      change: trend.change_percentage || 0,
    })) || []

  return (
    <div className="space-y-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-4"
      >
        <div className="relative">
          <TrendChart data={transformedChartData} compact fill height={240} />
          <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-white/5" />
        </div>
        <div className="relative">
          <SentimentChart
            positive={summary.sentiment_breakdown.positive}
            neutral={summary.sentiment_breakdown.neutral}
            negative={summary.sentiment_breakdown.negative}
            fill
            height={240}
          />
          <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-white/5" />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6, delay: 0.05 }}
        className="grid grid-cols-1 gap-4"
      >
        <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/10 hover:border-white/20 transition-all">
          <div className="flex items-end justify-between gap-4 mb-4">
            <div>
              <h3 className="text-sm font-light tracking-wider text-white/60 uppercase">Recent Insights</h3>
              <p className="mt-1 text-xs text-white/35 font-light">
                NLP-extracted insights with sentiment + keywords (demo data).
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-xs text-white/35 font-light">
              <span className="px-2 py-1 rounded-full bg-white/5 border border-white/10">Sentiment</span>
              <span className="px-2 py-1 rounded-full bg-white/5 border border-white/10">Keywords</span>
              <span className="px-2 py-1 rounded-full bg-white/5 border border-white/10">Platform</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[260px] overflow-auto pr-1">
            {summary.recent_insights.slice(0, 4).map((insight) => (
              <div
                key={insight.id}
                className="rounded-lg bg-white/5 border border-white/10 p-3 hover:bg-white/10 hover:border-white/15 transition-colors"
              >
                <div className="flex items-center gap-3 text-xs text-white/40 font-light mb-2">
                  <span className="uppercase">{insight.platform}</span>
                  <span>•</span>
                  <span>
                    {new Date(insight.timestamp).toLocaleString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                  <span
                    className={`ml-auto ${
                      insight.sentiment === 'positive'
                        ? 'text-cyan-400/80'
                        : insight.sentiment === 'neutral'
                          ? 'text-white/40'
                          : 'text-red-400/80'
                    }`}
                  >
                    {insight.sentiment.charAt(0).toUpperCase() + insight.sentiment.slice(1)}
                  </span>
                </div>
                <p className="text-sm text-white/85 font-light leading-relaxed line-clamp-3">
                  {insight.text}
                </p>
                {insight.keywords?.length ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {insight.keywords.slice(0, 4).map((k) => (
                      <span
                        key={k}
                        className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-white/55 font-light"
                      >
                        #{k}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

