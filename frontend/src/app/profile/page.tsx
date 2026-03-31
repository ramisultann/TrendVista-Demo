'use client'

import { useEffect, useState } from 'react'
import ProtectedRoute from '@/components/ProtectedRoute'
import { motion } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import { api } from '@/lib/api'
import { isDemoMode } from '@/lib/demoMode'

interface ProfileData {
  email: string
  full_name: string
  business_name?: string
  business_type?: string
  location?: string
  notification_email?: boolean
  notification_daily?: boolean
  notification_weekly?: boolean
}

export default function ProfilePage() {
  const { user, refreshUser } = useAuth()
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [profile, setProfile] = useState<ProfileData>({
    email: user?.email || '',
    full_name: user?.full_name || '',
    business_name: '',
    business_type: '',
    location: '',
    notification_email: true,
    notification_daily: false,
    notification_weekly: true,
  })

  useEffect(() => {
    setMounted(true)
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const response = await api.getProfile()
      const profileData = response.data
      setProfile({
        email: profileData.email || user?.email || '',
        full_name: profileData.full_name || user?.full_name || '',
        business_name: profileData.business_name || '',
        business_type: profileData.business_type || '',
        location: profileData.location || '',
        notification_email: profileData.notification_email ?? true,
        notification_daily: profileData.notification_daily ?? false,
        notification_weekly: profileData.notification_weekly ?? true,
      })
    } catch (err: any) {
      console.error('Error fetching profile:', err)
      // Fallback to user data from auth context
      if (user) {
        setProfile(prev => ({
          ...prev,
          email: user.email || '',
          full_name: user.full_name || '',
        }))
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (isDemoMode) {
        setSuccess(true)
        setTimeout(() => setSuccess(false), 2000)
        return
      }

      setSaving(true)
      setError(null)
      setSuccess(false)
      
      const updateData: any = {}
      if (profile.full_name) updateData.full_name = profile.full_name
      if (profile.business_name) updateData.business_name = profile.business_name
      if (profile.business_type) updateData.business_type = profile.business_type
      if (profile.location) updateData.location = profile.location
      if (profile.notification_email !== undefined) updateData.notification_email = profile.notification_email
      if (profile.notification_daily !== undefined) updateData.notification_daily = profile.notification_daily
      if (profile.notification_weekly !== undefined) updateData.notification_weekly = profile.notification_weekly
      
      await api.updateProfile(updateData)
      
      // Refresh user data in auth context
      await refreshUser()
      
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to save profile')
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (field: keyof ProfileData, value: any) => {
    if (isDemoMode) return
    setProfile(prev => ({ ...prev, [field]: value }))
  }

  if (!mounted) return null

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-black text-white pt-16">
        {/* Ambient Background */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-gradient-to-r from-cyan-500/5 via-purple-500/5 to-pink-500/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[100px]" />
        </div>

        <div className="max-w-4xl mx-auto px-6 lg:px-8 py-12">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 20 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <h1 className="text-5xl md:text-6xl font-extralight mb-3">Profile</h1>
            <p className="text-lg text-white/40 font-light">Manage your business account settings</p>
          </motion.div>

          {isDemoMode && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-4"
            >
              <p className="text-white/60 font-light text-sm">
                Demo mode: profile edits and social connections are disabled.
              </p>
            </motion.div>
          )}

          {/* Success Message */}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 backdrop-blur-md bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4"
            >
              <p className="text-cyan-400/80 font-light text-sm">✅ Profile updated successfully</p>
            </motion.div>
          )}

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 backdrop-blur-md bg-red-500/10 border border-red-500/30 rounded-xl p-4"
            >
              <p className="text-red-400/80 font-light text-sm">Error: {error}</p>
            </motion.div>
          )}

          {/* Profile Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Account Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 20 }}
              transition={{ delay: 0.1 }}
              className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 hover:border-white/20 transition-all"
            >
              <h2 className="text-lg font-light tracking-wider text-white/80 uppercase mb-6">Account Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-light text-white/60 uppercase tracking-wider mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={profile.email}
                    disabled
                    className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white/80 font-light focus:outline-none focus:border-cyan-500/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <p className="mt-1 text-xs text-white/30 font-light">Email cannot be changed</p>
                </div>

                <div>
                  <label className="block text-xs font-light text-white/60 uppercase tracking-wider mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={profile.full_name}
                    onChange={(e) => handleChange('full_name', e.target.value)}
                    disabled={isDemoMode}
                    className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white font-light focus:outline-none focus:border-cyan-500/50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                    placeholder="Your full name"
                  />
                </div>
              </div>
            </motion.div>

            {/* Business Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 20 }}
              transition={{ delay: 0.2 }}
              className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 hover:border-white/20 transition-all"
            >
              <h2 className="text-lg font-light tracking-wider text-white/80 uppercase mb-6">Business Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-light text-white/60 uppercase tracking-wider mb-2">
                    Business Name
                  </label>
                  <input
                    type="text"
                    value={profile.business_name}
                    onChange={(e) => handleChange('business_name', e.target.value)}
                    disabled={isDemoMode}
                    className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white font-light focus:outline-none focus:border-cyan-500/50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                    placeholder="Your business or brand name"
                  />
                </div>

                <div>
                  <label className="block text-xs font-light text-white/60 uppercase tracking-wider mb-2">
                    Business Type
                  </label>
                  <select
                    value={profile.business_type}
                    onChange={(e) => handleChange('business_type', e.target.value)}
                    disabled={isDemoMode}
                    className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white font-light focus:outline-none focus:border-cyan-500/50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <option value="">Select business type</option>
                    <option value="coffee_shop">Coffee Shop / Cafe</option>
                    <option value="restaurant">Restaurant</option>
                    <option value="bakery">Bakery / Dessert Shop</option>
                    <option value="retail">Retail Store</option>
                    <option value="service">Service Business</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-light text-white/60 uppercase tracking-wider mb-2">
                    Primary Location
                  </label>
                  <select
                    value={profile.location}
                    onChange={(e) => handleChange('location', e.target.value)}
                    disabled={isDemoMode}
                    className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white font-light focus:outline-none focus:border-cyan-500/50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <option value="">Select a GTA city</option>
                    <option value="Toronto">Toronto</option>
                    <option value="Mississauga">Mississauga</option>
                    <option value="Brampton">Brampton</option>
                    <option value="Markham">Markham</option>
                    <option value="Vaughan">Vaughan</option>
                    <option value="Richmond Hill">Richmond Hill</option>
                    <option value="Oakville">Oakville</option>
                    <option value="Burlington">Burlington</option>
                    <option value="Pickering">Pickering</option>
                    <option value="Ajax">Ajax</option>
                    <option value="Whitby">Whitby</option>
                    <option value="Oshawa">Oshawa</option>
                    <option value="Aurora">Aurora</option>
                    <option value="Newmarket">Newmarket</option>
                    <option value="Halton Hills">Halton Hills</option>
                    <option value="Milton">Milton</option>
                    <option value="Georgetown">Georgetown</option>
                    <option value="Caledon">Caledon</option>
                    <option value="Orangeville">Orangeville</option>
                  </select>
                  <p className="mt-1 text-xs text-white/30 font-light">This helps us filter relevant trends for your area</p>
                </div>
              </div>
            </motion.div>

            {/* Notification Preferences */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 20 }}
              transition={{ delay: 0.3 }}
              className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 hover:border-white/20 transition-all"
            >
              <h2 className="text-lg font-light tracking-wider text-white/80 uppercase mb-6">Notification Preferences</h2>
              
              <div className="space-y-4">
                <label className="flex items-center gap-4 cursor-pointer group p-3 rounded-lg hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
                  <div className="relative flex items-center justify-center">
                    <input
                      type="checkbox"
                      checked={profile.notification_email}
                      onChange={(e) => handleChange('notification_email', e.target.checked)}
                      disabled={isDemoMode}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 rounded border-2 transition-all ${
                      profile.notification_email
                        ? 'bg-cyan-500/20 border-cyan-500/50'
                        : 'bg-black/30 border-white/20 group-hover:border-white/40'
                    }`}>
                      {profile.notification_email && (
                        <svg className="w-full h-full text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <div className="flex-1">
                    <span className="text-white font-light block">Email Notifications</span>
                    <p className="text-xs text-white/40 font-light">Receive notifications via email</p>
                  </div>
                </label>

                <label className="flex items-center gap-4 cursor-pointer group p-3 rounded-lg hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
                  <div className="relative flex items-center justify-center">
                    <input
                      type="checkbox"
                      checked={profile.notification_daily}
                      onChange={(e) => handleChange('notification_daily', e.target.checked)}
                      disabled={isDemoMode}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 rounded border-2 transition-all ${
                      profile.notification_daily
                        ? 'bg-cyan-500/20 border-cyan-500/50'
                        : 'bg-black/30 border-white/20 group-hover:border-white/40'
                    }`}>
                      {profile.notification_daily && (
                        <svg className="w-full h-full text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <div className="flex-1">
                    <span className="text-white font-light block">Daily Digest</span>
                    <p className="text-xs text-white/40 font-light">Daily summary of trends and insights</p>
                  </div>
                </label>

                <label className="flex items-center gap-4 cursor-pointer group p-3 rounded-lg hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
                  <div className="relative flex items-center justify-center">
                    <input
                      type="checkbox"
                      checked={profile.notification_weekly}
                      onChange={(e) => handleChange('notification_weekly', e.target.checked)}
                      disabled={isDemoMode}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 rounded border-2 transition-all ${
                      profile.notification_weekly
                        ? 'bg-cyan-500/20 border-cyan-500/50'
                        : 'bg-black/30 border-white/20 group-hover:border-white/40'
                    }`}>
                      {profile.notification_weekly && (
                        <svg className="w-full h-full text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <div className="flex-1">
                    <span className="text-white font-light block">Weekly Report</span>
                    <p className="text-xs text-white/40 font-light">Weekly analytics and trend report</p>
                  </div>
                </label>
              </div>
            </motion.div>

            {/* Social Media Connections */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 20 }}
              transition={{ delay: 0.4 }}
              className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 hover:border-white/20 transition-all"
            >
              <h2 className="text-lg font-light tracking-wider text-white/80 uppercase mb-6">Social Media Connections</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-black/30 border border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 flex items-center justify-center">
                      <svg className="w-5 h-5 text-purple-400/80" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    </div>
                    <div>
                      <span className="text-white font-light block">Instagram</span>
                      <span className="text-xs text-white/40 font-light">Connect your Instagram Business account</span>
                    </div>
                  </div>
                  <motion.button
                    type="button"
                    onClick={() => (isDemoMode ? null : api.connectInstagram())}
                    disabled={isDemoMode}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 border border-white/20 rounded-lg text-xs font-light tracking-wider hover:border-cyan-500/50 hover:bg-cyan-500/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:border-white/20"
                  >
                    {isDemoMode ? 'Disabled' : 'Connect'}
                  </motion.button>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-black/30 border border-white/10 opacity-50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-black/50 border border-white/10 flex items-center justify-center">
                      <svg className="w-5 h-5 text-white/30" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                      </svg>
                    </div>
                    <div>
                      <span className="text-white/40 font-light block">TikTok</span>
                      <span className="text-xs text-white/30 font-light">Coming soon</span>
                    </div>
                  </div>
                  <span className="px-4 py-2 border border-white/10 rounded-lg text-xs font-light text-white/30">
                    Coming Soon
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 20 }}
              transition={{ delay: 0.5 }}
              className="flex items-center justify-between pt-6"
            >
              <button
                type="button"
                disabled={isDemoMode}
                className="px-6 py-3 border border-white/20 rounded-lg text-xs font-light tracking-wider hover:border-white/40 hover:bg-white/5 transition-all"
              >
                Cancel
              </button>
              <motion.button
                type="submit"
                disabled={saving || isDemoMode}
                whileHover={{ scale: saving ? 1 : 1.05 }}
                whileTap={{ scale: saving ? 1 : 0.95 }}
                className="px-8 py-3 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/50 rounded-lg text-white font-light tracking-wider hover:border-cyan-500/70 hover:from-cyan-500/30 hover:to-purple-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDemoMode ? 'Demo Mode' : saving ? 'Saving...' : 'Save Changes'}
              </motion.button>
            </motion.div>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  )
}

