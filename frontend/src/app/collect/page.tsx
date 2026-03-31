'use client'

import { useState } from 'react'
import ProtectedRoute from '@/components/ProtectedRoute'
import { motion } from 'framer-motion'
import { api } from '@/lib/api'
import { isDemoMode } from '@/lib/demoMode'

const { triggerProcessing } = api

export default function CollectPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [platform, setPlatform] = useState('instagram')
  const [method, setMethod] = useState('hashtag')
  const [limit, setLimit] = useState(25)

  if (isDemoMode) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-black text-white pt-16">
          <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-gradient-to-r from-cyan-500/5 via-purple-500/5 to-pink-500/5 rounded-full blur-[120px]" />
            <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px]" />
          </div>
          <div className="max-w-3xl mx-auto px-6 lg:px-8 py-16">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-10">
              <h1 className="text-3xl md:text-4xl font-extralight mb-3">Data Collection (Private)</h1>
              <p className="text-white/50 font-light leading-relaxed">
                This public demo is intentionally <span className="text-white/70">read-only</span>. Live ingestion (connectors, collectors, and platform-specific logic)
                is part of the private commercial codebase.
              </p>
              <p className="mt-4 text-white/40 font-light text-sm">
                Tip: use <span className="text-white/60">Dashboard</span>, <span className="text-white/60">Trends</span>, and <span className="text-white/60">Insights</span> to explore the product experience.
              </p>
            </motion.div>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  const handleCollect = async () => {
    try {
      setLoading(true)
      setError(null)
      setResult(null)

      const response = await api.triggerCollection({
        platform,
        method,
        limit,
      })

      setResult(response.data)
    } catch (err: any) {
      console.error('Collection error:', err)
      setError(err.response?.data?.detail || err.message || 'Collection failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-black text-white pt-16">
        {/* Ambient Background */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-gradient-to-r from-cyan-500/5 via-purple-500/5 to-pink-500/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px]" />
        </div>

        <div className="max-w-4xl mx-auto px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <h1 className="text-5xl md:text-6xl font-extralight mb-3">Collect Data</h1>
            <p className="text-lg text-white/40 font-light">Trigger data collection from social media platforms</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-8"
          >
            <div className="space-y-6">
              {/* Platform Selection */}
              <div>
                <label className="block text-sm font-light text-white/60 uppercase tracking-wider mb-3">
                  Platform
                </label>
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
                >
                  <option value="instagram">Instagram</option>
                  <option value="tiktok" disabled>TikTok (Coming Soon)</option>
                </select>
              </div>

              {/* Method Selection */}
              <div>
                <label className="block text-sm font-light text-white/60 uppercase tracking-wider mb-3">
                  Collection Method
                </label>
                <select
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
                >
                  <option value="account">Your Account (Works Now!)</option>
                  <option value="hashtag">Hashtag Search (Requires App Review)</option>
                  <option value="location">Location Search (Requires App Review)</option>
                  <option value="both">Both (Requires App Review)</option>
                </select>
                <p className="mt-2 text-xs text-white/40 font-light">
                  {method === "account" 
                    ? "✅ Collects posts from your Instagram account - works in development mode!"
                    : "⚠️ Requires app review for public content access"}
                </p>
              </div>

              {/* Limit */}
              <div>
                <label className="block text-sm font-light text-white/60 uppercase tracking-wider mb-3">
                  Limit (Number of Posts)
                </label>
                <input
                  type="number"
                  value={limit}
                  onChange={(e) => setLimit(parseInt(e.target.value) || 25)}
                  min={1}
                  max={100}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
                />
              </div>

              {/* Collect Button */}
              <button
                onClick={handleCollect}
                disabled={loading}
                className="w-full bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 rounded-lg px-6 py-4 text-white font-light transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Collecting...' : 'Start Collection'}
              </button>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-500/10 border border-red-500/30 rounded-lg p-4"
                >
                  <p className="text-red-400/80 font-light">Error: {error}</p>
                </motion.div>
              )}

              {/* Result */}
              {result && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-6"
                >
                  <h3 className="text-lg font-light mb-4 text-cyan-400/80">Collection Results</h3>
                  <div className="space-y-2 text-sm font-light">
                    <p><span className="text-white/60">Collected:</span> <span className="text-white">{result.collected || 0}</span> posts</p>
                    <p><span className="text-white/60">Stored:</span> <span className="text-white">{result.stored || 0}</span> posts</p>
                    <p><span className="text-white/60">Skipped:</span> <span className="text-white">{result.skipped || 0}</span> posts</p>
                    <p><span className="text-white/60">Errors:</span> <span className="text-white">{result.errors || 0}</span></p>
                    {result.success_rate !== undefined && (
                      <p><span className="text-white/60">Success Rate:</span> <span className="text-white">{result.success_rate.toFixed(1)}%</span></p>
                    )}
                  </div>
                  <p className="mt-4 text-xs text-white/40 font-light">
                    {result.message || 'Collection completed successfully!'}
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>

              {/* Process NLP Button */}
          {result && result.stored > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-6"
            >
              <button
                onClick={async () => {
                  try {
                    setLoading(true)
                    setError(null)
                    const response = await api.triggerProcessing(100)
                    alert(`✅ Processed ${response.data?.result?.processed_successfully || 0} posts with NLP! Check Insights page to see results.`)
                    window.location.href = '/insights'
                  } catch (err: any) {
                    setError(err.response?.data?.detail || err.message || 'NLP processing failed')
                  } finally {
                    setLoading(false)
                  }
                }}
                disabled={loading}
                className="w-full bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/50 rounded-lg px-6 py-4 text-white font-light transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : '✨ Process Posts with NLP (Generate Insights)'}
              </button>
            </motion.div>
          )}

          {/* Instructions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8 backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-6"
          >
            <h3 className="text-sm font-light text-white/60 uppercase tracking-wider mb-4">Next Steps</h3>
            <ol className="space-y-2 text-sm font-light text-white/60 list-decimal list-inside">
              <li>After collection, go to <span className="text-white">Dashboard</span> to see collected posts</li>
              <li>Click <span className="text-white">"Process Posts with NLP"</span> button above (if visible) to generate insights</li>
              <li>View insights in the <span className="text-white">Insights</span> page</li>
              <li>Check trends in the <span className="text-white">Trends</span> page</li>
            </ol>
          </motion.div>
        </div>
      </div>
    </ProtectedRoute>
  )
}

