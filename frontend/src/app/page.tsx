'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { isDemoMode } from '@/lib/demoMode'
import LandingProductPreview from '@/components/LandingProductPreview'

export default function Home() {
  const [mounted, setMounted] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const { scrollY } = useScroll()
  
  const opacity = useTransform(scrollY, [0, 300], [1, 0])
  const scale = useTransform(scrollY, [0, 300], [1, 0.95])
  const y = useTransform(scrollY, [0, 300], [0, 50])

  useEffect(() => {
    setMounted(true)
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Ambient Background Effects */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-[600px] h-[600px] bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 rounded-full blur-[120px]"
          animate={{
            x: mousePosition.x * 0.05,
            y: mousePosition.y * 0.05,
          }}
          transition={{ type: "spring", stiffness: 50, damping: 20 }}
        />
        <motion.div
          className="absolute top-1/2 right-1/4 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px]"
          animate={{
            x: mousePosition.x * -0.03,
            y: mousePosition.y * -0.03,
          }}
          transition={{ type: "spring", stiffness: 30, damping: 20 }}
        />
      </div>

      {/* Floating Particles */}
      {mounted && (
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/20 rounded-full"
              initial={{
                x: typeof window !== 'undefined' ? Math.random() * window.innerWidth : 0,
                y: typeof window !== 'undefined' ? Math.random() * window.innerHeight : 0,
              }}
              animate={{
                y: typeof window !== 'undefined' ? [null, Math.random() * window.innerHeight] : 0,
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                ease: "linear",
                delay: Math.random() * 5,
              }}
            />
          ))}
        </div>
      )}

      {/* Minimal Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : -20 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 left-0 right-0 z-50 px-8 py-6"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="text-xl font-light tracking-wider"
          >
            TREND
            <span className="font-thin">VISTA</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: mounted ? 1 : 0 }}
            transition={{ delay: 0.5 }}
            className="flex items-center gap-6"
          >
            <Link
              href="/login"
              className="text-sm text-white/60 hover:text-white transition-colors font-light"
            >
              {isDemoMode ? 'LIVE DEMO' : 'ENTER'}
            </Link>
            {!isDemoMode && (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/signup"
                  className="px-6 py-2 border border-white/20 rounded-full text-sm font-light hover:border-white/40 hover:bg-white/5 transition-all backdrop-blur-sm"
                >
                  BEGIN
                </Link>
              </motion.div>
            )}
          </motion.div>
        </div>
      </motion.header>

      {/* Hero Section - Mysterious & Minimal */}
      <main className="relative">
        <motion.section
          style={{ opacity, scale, y }}
          className="min-h-screen flex items-center justify-center px-8 pt-32 pb-20"
        >
          <div className="max-w-6xl mx-auto text-center space-y-12">
            {/* Main Headline - Revealed Gradually */}
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 30 }}
                transition={{ duration: 1, delay: 0.3 }}
                className="overflow-hidden"
              >
                <h1 className="text-7xl md:text-9xl font-extralight tracking-tight leading-none">
                  WHAT'S
                </h1>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 30 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="overflow-hidden"
              >
                <h1 className="text-7xl md:text-9xl font-extralight tracking-tight leading-none">
                  <span className="bg-gradient-to-r from-white via-white/80 to-white/60 bg-clip-text text-transparent">
                    BREWING
                  </span>
                </h1>
              </motion.div>
            </div>

            {/* Subtle Tagline - Appears Later */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: mounted ? 1 : 0 }}
              transition={{ duration: 1.5, delay: 1 }}
              className="text-lg md:text-xl text-white/40 font-light tracking-wide max-w-2xl mx-auto"
            >
              Uncover hidden patterns. Discover tomorrow's trends today.
            </motion.p>

            {/* Mysterious CTA - Glassmorphism */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 20 }}
              transition={{ duration: 1, delay: 1.2 }}
              className="pt-8"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/login"
                  className="group relative inline-block px-12 py-4 border border-white/20 rounded-full backdrop-blur-md bg-white/5 hover:bg-white/10 transition-all overflow-hidden"
                >
                  <span className="relative z-10 text-sm font-light tracking-widest">
                    {isDemoMode ? 'ENTER LIVE DEMO' : 'EXPLORE'}
                  </span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.6 }}
                  />
                </Link>
              </motion.div>
            </motion.div>

            {/* Scroll Indicator - Subtle */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: mounted ? 1 : 0 }}
              transition={{ delay: 1.5 }}
              className="absolute bottom-20 left-1/2 transform -translate-x-1/2"
            >
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-6 h-10 border border-white/20 rounded-full flex items-start justify-center p-2"
              >
                <motion.div
                  animate={{ y: [0, 12, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-1 h-3 bg-white/40 rounded-full"
                />
              </motion.div>
            </motion.div>
          </div>
        </motion.section>

        {/* Revealed Features - Scroll Triggered */}
        <section className="relative min-h-screen py-32 px-8">
          <div className="max-w-7xl mx-auto space-y-48">
            
            {/* Feature 1 - Asymmetric */}
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1 }}
              className="grid grid-cols-1 lg:grid-cols-[1fr_1.15fr] gap-14 items-center"
            >
              <div className="lg:pr-16 space-y-8">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="text-sm text-white/30 font-light tracking-widest mb-4">
                    01 / PERCEPTION
                  </div>
                  <h2 className="text-5xl md:text-6xl font-extralight leading-tight mb-6">
                    See what others
                    <br />
                    <span className="text-white/60">can't</span>
                  </h2>
                </motion.div>
                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                  className="text-lg text-white/40 font-light leading-relaxed"
                >
                  TrendVista turns social chatter into a dashboard your team can act on:
                  sentiment shifts, rising topics, and concrete “what to do next” signals.
                </motion.p>
                <div className="space-y-3 text-sm text-white/45 font-light">
                  <div className="flex gap-3">
                    <span className="text-cyan-400/70">•</span>
                    <span>Real-time sentiment trend + breakdown</span>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-cyan-400/70">•</span>
                    <span>Top trending topics (rising/falling)</span>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-cyan-400/70">•</span>
                    <span>Insights feed with keywords and context</span>
                  </div>
                </div>
              </div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="relative rounded-2xl overflow-hidden border border-white/10 backdrop-blur-sm bg-white/5 p-4 max-w-[720px] lg:justify-self-end"
              >
                <LandingProductPreview />
              </motion.div>
            </motion.div>

            {/* Feature 2 - Reversed */}
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="relative rounded-2xl overflow-hidden border border-white/10 backdrop-blur-sm bg-white/5 lg:order-1 p-8"
              >
                <div className="space-y-5">
                  <div className="text-xs text-white/35 font-light tracking-widest uppercase">How it works</div>
                  <div className="space-y-3">
                    {[
                      { t: 'Collect signals', d: 'From multiple platforms (demo uses curated data).' },
                      { t: 'Analyze with NLP', d: 'Sentiment + keywords + topic clustering.' },
                      { t: 'Surface actions', d: 'Trends and insights your team can use immediately.' },
                    ].map((x) => (
                      <div key={x.t} className="p-4 rounded-xl bg-white/5 border border-white/10">
                        <div className="text-white/80 font-light">{x.t}</div>
                        <div className="text-sm text-white/40 font-light mt-1">{x.d}</div>
                      </div>
                    ))}
                  </div>
                  <div className="pt-2 text-xs text-white/35 font-light">
                    Public demo is read-only by design. Private repo contains ingestion and production integrations.
                  </div>
                </div>
              </motion.div>
              <div className="lg:pl-16 space-y-8 lg:order-2">
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="text-sm text-white/30 font-light tracking-widest mb-4">
                    02 / PREDICTION
                  </div>
                  <h2 className="text-5xl md:text-6xl font-extralight leading-tight mb-6">
                    Tomorrow's trends,
                    <br />
                    <span className="text-white/60">today</span>
                  </h2>
                </motion.div>
                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                  className="text-lg text-white/40 font-light leading-relaxed"
                >
                  Built to answer the questions operators actually ask:
                  what’s rising, what’s polarizing, and what to promote or adjust this week.
                </motion.p>
              </div>
            </motion.div>

            {/* Feature 3 - Minimal CTA */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="text-center space-y-12 py-32 border-t border-white/10"
            >
              <div className="space-y-6">
                <h2 className="text-5xl md:text-6xl font-extralight">
                  Ready to see
                  <br />
                  <span className="text-white/60">what's next?</span>
                </h2>
                <p className="text-lg text-white/40 font-light max-w-xl mx-auto">
                  The future of trends. Hidden in plain sight.
                </p>
              </div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href={isDemoMode ? "/login" : "/signup"}
                  className="group relative inline-block px-12 py-4 border border-white/20 rounded-full backdrop-blur-md bg-white/5 hover:bg-white/10 transition-all overflow-hidden"
                >
                  <span className="relative z-10 text-sm font-light tracking-widest">
                    {isDemoMode ? 'ENTER LIVE DEMO' : 'BEGIN JOURNEY'}
                  </span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.6 }}
                  />
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Minimal Footer */}
      <footer className="border-t border-white/10 py-12 px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-sm text-white/30 font-light">
          <div>© 2025 TRENDVISTA</div>
          <div className="flex gap-8 mt-4 md:mt-0">
            <Link href="/login" className="hover:text-white/60 transition-colors">
              {isDemoMode ? 'LIVE DEMO' : 'ENTER'}
            </Link>
            {!isDemoMode && (
              <Link href="/signup" className="hover:text-white/60 transition-colors">
                BEGIN
              </Link>
            )}
          </div>
        </div>
      </footer>
    </div>
  )
}
