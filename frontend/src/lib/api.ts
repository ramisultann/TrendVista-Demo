import axios from 'axios'
import { isDemoMode } from '@/lib/demoMode'
import { getDemoDashboardSummary, getDemoInsights, getDemoTrendChart, getDemoTrends, getDemoTopTrends } from '@/demo/mockData'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('trendvista_token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Add response interceptor to handle auth errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('trendvista_token')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

// Types
export interface DashboardSummary {
  total_mentions: number
  total_trends: number
  overall_sentiment: number | null
  growth_rate: number | null
  sentiment_breakdown: {
    positive: number
    neutral: number
    negative: number
    total: number
    positive_percent: number
    neutral_percent: number
    negative_percent: number
  }
  top_trends: Array<{
    keyword: string
    mention_count: number
    change_percentage: number | null
    sentiment_avg: number | null
    platform: string | null
  }>
  recent_insights: Array<{
    id: number
    text: string
    platform: string
    sentiment: string
    timestamp: string
    keywords: string[]
  }>
  platform_breakdown: Record<string, number>
  period_start: string
  period_end: string
}

export interface TrendChartData {
  data: Array<{
    date: string
    sentiment: number
    mentions: number
  }>
  period_start: string
  period_end: string
}

export interface Insight {
  id: number
  post_id: number
  sentiment_label: string
  sentiment_score: number
  sentiment_confidence: number | null
  keywords: Array<{ keyword: string; score: number }> | null
  topics: string[] | null
  processed_at: string
  post?: {
    id: number
    title: string | null
    content: string
    platform: string
    author: string | null
    posted_at: string
    likes: number
    comments: number
  }
}

export interface Trend {
  id: number
  keyword: string
  platform: string | null
  category: string | null
  mention_count: number
  sentiment_avg: number | null
  sentiment_distribution: Record<string, number> | null
  engagement_avg: number | null
  change_percentage: number | null
  sentiment_change: number | null
  period_start: string
  period_end: string
  computed_at: string
  is_active: boolean
}

// API functions
export const api = {
  // Health check
  health: () => (isDemoMode ? Promise.resolve({ data: { status: 'healthy' } } as any) : apiClient.get('/health')),
  
  // Dashboard
  getDashboardSummary: (days: number = 7) =>
    isDemoMode
      ? Promise.resolve({ data: getDemoDashboardSummary(days) } as any)
      : apiClient.get<DashboardSummary>(`/api/v1/dashboard/summary?days=${days}`),
  
  getTrendChart: (days: number = 7) =>
    isDemoMode
      ? Promise.resolve({ data: getDemoTrendChart(days) } as any)
      : apiClient.get<TrendChartData>(`/api/v1/dashboard/trend-chart?days=${days}`),
  
  // Insights
  getInsights: (params?: {
    skip?: number
    limit?: number
    sentiment?: string
    days?: number
    platform?: string
  }) => {
    const queryParams = new URLSearchParams()
    if (params?.skip) queryParams.append('skip', params.skip.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    if (params?.sentiment) queryParams.append('sentiment', params.sentiment)
    if (params?.days) queryParams.append('days', params.days.toString())
    if (params?.platform) queryParams.append('platform', params.platform)
    
    if (isDemoMode) {
      return Promise.resolve({
        data: getDemoInsights({
          skip: params?.skip,
          limit: params?.limit,
          sentiment: params?.sentiment,
          platform: params?.platform,
        }),
      } as any)
    }

    return apiClient.get<Insight[]>(`/api/v1/insights?${queryParams.toString()}`)
  },
  
  getInsightById: (id: number) =>
    isDemoMode
      ? Promise.resolve({ data: getDemoInsights({ limit: 50 }).find((i) => i.id === id) } as any)
      : apiClient.get<Insight>(`/api/v1/insights/${id}`),
  
  // Trends
  getTrends: (params?: {
    skip?: number
    limit?: number
    platform?: string
    category?: string
    days?: number
    active_only?: boolean
    sort_by?: string
  }) => {
    const queryParams = new URLSearchParams()
    if (params?.skip) queryParams.append('skip', params.skip.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    if (params?.platform) queryParams.append('platform', params.platform)
    if (params?.category) queryParams.append('category', params.category)
    if (params?.days) queryParams.append('days', params.days.toString())
    if (params?.active_only !== undefined) queryParams.append('active_only', params.active_only.toString())
    if (params?.sort_by) queryParams.append('sort_by', params.sort_by)
    
    return isDemoMode
      ? Promise.resolve({ data: getDemoTrends() } as any)
      : apiClient.get<{
          trends: Trend[]
          total: number
          page: number
          page_size: number
          total_pages: number
        }>(`/api/v1/trends?${queryParams.toString()}`)
  },
  
  getTrendById: (id: number) =>
    isDemoMode
      ? Promise.resolve({ data: getDemoTrends().trends.find((t) => t.id === id) } as any)
      : apiClient.get<Trend>(`/api/v1/trends/${id}`),
  
  getTopTrends: (limit: number = 10, days: number = 7, platform?: string) => {
    const queryParams = new URLSearchParams()
    queryParams.append('limit', limit.toString())
    queryParams.append('days', days.toString())
    if (platform) queryParams.append('platform', platform)
    
    return isDemoMode
      ? Promise.resolve({ data: getDemoTopTrends().slice(0, limit) } as any)
      : apiClient.get<Array<{
          keyword: string
          mention_count: number
          change_percentage: number | null
          sentiment_avg: number | null
          platform: string | null
        }>>(`/api/v1/trends/summary/top?${queryParams.toString()}`)
  },
  
  // NLP Processing
  triggerProcessing: (limit?: number) => {
    const params = limit ? `?limit=${limit}` : ''
    return isDemoMode ? Promise.resolve({ data: { result: { processed_successfully: 0 } } } as any) : apiClient.post(`/api/v1/nlp/process${params}`)
  },
  
  getProcessingStatus: () =>
    isDemoMode ? Promise.resolve({ data: { unprocessed_posts: 0 } } as any) : apiClient.get('/api/v1/nlp/status'),
  
  // Data Collection
  triggerCollection: (data: {
    platform: string
    method?: string
    limit?: number
  }) =>
    isDemoMode ? Promise.resolve({ data: { status: 'demo' } } as any) : apiClient.post('/api/v1/data/collect', data),
  
  getCollectionStatus: () =>
    isDemoMode ? Promise.resolve({ data: { status: 'demo' } } as any) : apiClient.get('/api/v1/data/status'),
  
  // Profile
  getProfile: () =>
    isDemoMode
      ? Promise.resolve({
          data: {
            email: 'demo@trendvista.dev',
            full_name: 'Demo User',
            business_name: 'Demo Cafe',
            business_type: 'Coffee shop',
            location: 'Toronto, ON',
            notification_email: true,
            notification_daily: false,
            notification_weekly: true,
          },
        } as any)
      : apiClient.get<{
      email: string
      full_name: string | null
      business_name: string | null
      business_type: string | null
      location: string | null
      notification_email: boolean
      notification_daily: boolean
      notification_weekly: boolean
    }>('/api/v1/profile/me'),
  
  updateProfile: (data: {
    full_name?: string
    business_name?: string
    business_type?: string
    location?: string
    notification_email?: boolean
    notification_daily?: boolean
    notification_weekly?: boolean
  }) =>
    isDemoMode ? Promise.resolve({ data } as any) : apiClient.put('/api/v1/profile/me', data),
  
  // Instagram Connection
  // SECURITY: Client ID is safe to expose, but secrets must never be in frontend
  // The actual OAuth flow should be handled server-side to protect client secrets
  connectInstagram: () => {
    // SECURITY NOTE: Only client ID is exposed here (safe per OAuth2 spec)
    // Client secret MUST remain server-side only
    // This endpoint should trigger a server-side OAuth flow
    const redirectUri = `${window.location.origin}/auth/instagram/callback`
    // Client ID can be public, but we should get it from a server endpoint
    // to avoid exposing it in the frontend bundle
    if (isDemoMode) return

    apiClient.post('/api/v1/auth/instagram/connect', {
      redirect_uri: redirectUri
    }).then((response) => {
      // Server returns the OAuth URL
      if (response.data.auth_url) {
        window.location.href = response.data.auth_url
      }
    }).catch((error) => {
      console.error('Failed to initiate Instagram OAuth:', error)
      throw error
    })
  },
}

