import type { DashboardSummary, Insight, Trend, TrendChartData } from '@/lib/api'

function daysAgo(n: number) {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d
}

export function getDemoTrendChart(days: number = 7): TrendChartData {
  const points = Array.from({ length: days }, (_, idx) => {
    const d = daysAgo(days - 1 - idx)
    const mentions = Math.round(60 + 18 * Math.sin(idx / 1.6) + (idx % 3) * 7)
    const sentiment = Math.max(-1, Math.min(1, 0.25 + 0.12 * Math.sin(idx / 1.8)))
    return {
      date: d.toISOString().slice(0, 10),
      mentions,
      sentiment,
    }
  })

  return {
    data: points,
    period_start: daysAgo(days).toISOString(),
    period_end: new Date().toISOString(),
  }
}

export function getDemoTopTrends(): Array<{
  keyword: string
  mention_count: number
  change_percentage: number | null
  sentiment_avg: number | null
  platform: string | null
}> {
  return [
    { keyword: 'Matcha', mention_count: 128, change_percentage: 34.2, sentiment_avg: 0.48, platform: 'instagram' },
    { keyword: 'Croffle', mention_count: 96, change_percentage: 18.6, sentiment_avg: 0.32, platform: 'tiktok' },
    { keyword: 'Basque Cheesecake', mention_count: 84, change_percentage: 22.1, sentiment_avg: 0.21, platform: 'reddit' },
    { keyword: 'Pistachio Latte', mention_count: 73, change_percentage: 12.9, sentiment_avg: 0.55, platform: 'instagram' },
    { keyword: 'Ube', mention_count: 61, change_percentage: -6.3, sentiment_avg: 0.09, platform: 'tiktok' },
  ]
}

export function getDemoDashboardSummary(days: number = 7): DashboardSummary {
  const chart = getDemoTrendChart(days)
  const totalMentions = chart.data.reduce((acc, p) => acc + (p.mentions || 0), 0)

  const sentimentBreakdown = {
    positive: Math.round(totalMentions * 0.64),
    neutral: Math.round(totalMentions * 0.21),
    negative: Math.max(0, totalMentions - Math.round(totalMentions * 0.64) - Math.round(totalMentions * 0.21)),
    total: totalMentions,
    positive_percent: 64.0,
    neutral_percent: 21.0,
    negative_percent: 15.0,
  }

  const topTrends = getDemoTopTrends()

  const recentInsights = [
    {
      id: 9001,
      text: '“Matcha is everywhere this week — customers love the less-sweet options.”',
      platform: 'instagram',
      sentiment: 'positive',
      timestamp: new Date().toISOString(),
      keywords: ['matcha', 'latte', 'toronto'],
    },
    {
      id: 9002,
      text: '“Basque cheesecake is trending again, especially mini portions.”',
      platform: 'tiktok',
      sentiment: 'neutral',
      timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      keywords: ['basque cheesecake', 'dessert'],
    },
    {
      id: 9003,
      text: '“A few comments mention long waits on weekends — consider pre-batching.”',
      platform: 'reddit',
      sentiment: 'negative',
      timestamp: new Date(Date.now() - 1000 * 60 * 95).toISOString(),
      keywords: ['wait time', 'weekend', 'service'],
    },
    {
      id: 9004,
      text: '“Croffles are getting shared a lot — great for short-form content.”',
      platform: 'tiktok',
      sentiment: 'positive',
      timestamp: new Date(Date.now() - 1000 * 60 * 140).toISOString(),
      keywords: ['croffle', 'dessert'],
    },
    {
      id: 9005,
      text: '“Pistachio latte mentions are up — highlight it as a seasonal special.”',
      platform: 'instagram',
      sentiment: 'positive',
      timestamp: new Date(Date.now() - 1000 * 60 * 210).toISOString(),
      keywords: ['pistachio latte', 'seasonal'],
    },
  ]

  return {
    total_mentions: totalMentions,
    total_trends: topTrends.length,
    overall_sentiment: 0.31,
    growth_rate: 15.4,
    sentiment_breakdown: sentimentBreakdown,
    top_trends: topTrends,
    recent_insights: recentInsights,
    platform_breakdown: { instagram: 312, tiktok: 268, reddit: 191 },
    period_start: chart.period_start,
    period_end: chart.period_end,
  }
}

export function getDemoInsights(params?: {
  skip?: number
  limit?: number
  sentiment?: string
  platform?: string
}): Insight[] {
  const base: Insight[] = [
    {
      id: 101,
      post_id: 5001,
      sentiment_label: 'positive',
      sentiment_score: 0.78,
      sentiment_confidence: 0.91,
      keywords: [{ keyword: 'matcha', score: 0.92 }, { keyword: 'latte', score: 0.71 }],
      topics: ['beverage', 'cafe'],
      processed_at: new Date().toISOString(),
      post: {
        id: 5001,
        title: null,
        content: 'Obsessed with the matcha latte right now. Smooth, not too sweet — perfect afternoon pick-me-up.',
        platform: 'instagram',
        author: 'trendvista_demo',
        posted_at: new Date().toISOString(),
        likes: 432,
        comments: 19,
      },
    },
    {
      id: 102,
      post_id: 5002,
      sentiment_label: 'neutral',
      sentiment_score: 0.06,
      sentiment_confidence: 0.73,
      keywords: [{ keyword: 'basque cheesecake', score: 0.86 }],
      topics: ['dessert'],
      processed_at: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
      post: {
        id: 5002,
        title: null,
        content: 'Tried the basque cheesecake. Pretty decent overall — would get it again if I’m nearby.',
        platform: 'reddit',
        author: 'trendvista_demo',
        posted_at: new Date(Date.now() - 1000 * 60 * 48).toISOString(),
        likes: 78,
        comments: 12,
      },
    },
    {
      id: 103,
      post_id: 5003,
      sentiment_label: 'negative',
      sentiment_score: -0.41,
      sentiment_confidence: 0.84,
      keywords: [{ keyword: 'ube', score: 0.81 }],
      topics: ['dessert'],
      processed_at: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
      post: {
        id: 5003,
        title: null,
        content: 'Ube was mid. For the price, expected better texture and less sweetness.',
        platform: 'tiktok',
        author: 'trendvista_demo',
        posted_at: new Date(Date.now() - 1000 * 60 * 110).toISOString(),
        likes: 120,
        comments: 31,
      },
    },
  ]

  let filtered = base
  if (params?.sentiment) filtered = filtered.filter((i) => i.sentiment_label === params.sentiment)
  if (params?.platform) filtered = filtered.filter((i) => i.post?.platform === params.platform)

  const skip = params?.skip ?? 0
  const limit = params?.limit ?? 20
  return filtered.slice(skip, skip + limit)
}

export function getDemoTrends(): { trends: Trend[]; total: number; page: number; page_size: number; total_pages: number } {
  const trends: Trend[] = getDemoTopTrends().map((t, idx) => ({
    id: 200 + idx,
    keyword: t.keyword,
    platform: t.platform,
    category: 'food',
    mention_count: t.mention_count,
    sentiment_avg: t.sentiment_avg,
    sentiment_distribution: { positive: Math.round(t.mention_count * 0.6), neutral: Math.round(t.mention_count * 0.25), negative: Math.round(t.mention_count * 0.15) },
    engagement_avg: 210.3,
    change_percentage: t.change_percentage,
    sentiment_change: 0.07,
    period_start: daysAgo(7).toISOString(),
    period_end: new Date().toISOString(),
    computed_at: new Date().toISOString(),
    is_active: true,
  }))
  return { trends, total: trends.length, page: 1, page_size: trends.length, total_pages: 1 }
}

