'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { motion } from 'framer-motion'
import { isDemoMode } from '@/lib/demoMode'

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { signup } = useAuth()
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    if (isDemoMode) {
      router.replace('/login')
    }
  }, [])

  // Prevent a flash of the signup form in the public demo.
  if (isDemoMode) return null

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    try {
      await signup({
        email: formData.email,
        password: formData.password,
        full_name: formData.name || undefined,
      })
      // Clear password from memory after successful signup
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
      })
      router.push('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed')
      // Clear password fields on error for security
      setFormData(prev => ({
        ...prev,
        password: '',
        confirmPassword: '',
      }))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Ambient Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-cyan-500/10 rounded-full blur-[120px]"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="min-h-screen flex flex-col justify-center py-12 px-6 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 20 }}
          transition={{ duration: 0.6 }}
          className="sm:mx-auto sm:w-full sm:max-w-md"
        >
          {/* Logo */}
          <div className="text-center mb-12">
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: mounted ? 1 : 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl font-light tracking-wider mb-4"
            >
              TREND<span className="font-thin">VISTA</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: mounted ? 1 : 0 }}
              transition={{ delay: 0.3 }}
              className="text-sm text-white/40 font-light tracking-wider"
            >
              BEGIN YOUR JOURNEY
            </motion.p>
          </div>

          {/* Form Card - Glassmorphism */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 30 }}
            transition={{ delay: 0.4 }}
            className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl"
          >
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label htmlFor="name" className="block text-xs font-light tracking-wider text-white/60 uppercase">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg placeholder-white/30 text-white focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all font-light"
                  placeholder="John Doe"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="block text-xs font-light tracking-wider text-white/60 uppercase">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg placeholder-white/30 text-white focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all font-light"
                  placeholder="you@example.com"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-xs font-light tracking-wider text-white/60 uppercase">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg placeholder-white/30 text-white focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all font-light"
                  placeholder="••••••••"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="block text-xs font-light tracking-wider text-white/60 uppercase">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg placeholder-white/30 text-white focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all font-light"
                  placeholder="••••••••"
                />
              </div>

              <div className="flex items-start gap-2 text-xs text-white/40 font-light">
                <input
                  type="checkbox"
                  required
                  className="w-4 h-4 mt-0.5 bg-white/5 border-white/10 rounded focus:ring-white/20"
                />
                <label>
                  I agree to the{' '}
                  <Link href="#" className="text-white/60 hover:text-white underline underline-offset-4">
                    Terms
                  </Link>{' '}
                  and{' '}
                  <Link href="#" className="text-white/60 hover:text-white underline underline-offset-4">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-lg bg-red-500/10 border border-red-500/20 p-4"
                >
                  <div className="text-sm text-red-400 font-light">{error}</div>
                </motion.div>
              )}

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                className="w-full px-6 py-3 border border-white/20 rounded-full text-sm font-light tracking-widest hover:border-white/40 hover:bg-white/10 transition-all backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
              >
                <span className="relative z-10">
                  {loading ? 'CREATING...' : 'BEGIN'}
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-cyan-500/20"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.6 }}
                />
              </motion.button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-xs text-white/40 font-light">
                Already have access?{' '}
                <Link href="/login" className="text-white/60 hover:text-white transition-colors font-light underline underline-offset-4">
                  Enter here
                </Link>
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
