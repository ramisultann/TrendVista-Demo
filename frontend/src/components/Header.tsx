'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { motion } from 'framer-motion'
import { isDemoMode } from '@/lib/demoMode'

const navigation = [
  { name: 'DASHBOARD', href: '/dashboard' },
  { name: 'TRENDS', href: '/trends' },
  { name: 'INSIGHTS', href: '/insights' },
  { name: 'COLLECT', href: '/collect' },
]

export default function Header() {
  const pathname = usePathname()
  const { isAuthenticated, logout, user } = useAuth()
  const navItems = isDemoMode ? navigation.filter((n) => n.href !== '/collect') : navigation

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/50 border-b border-white/10">
      <nav className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          <div className="flex items-center gap-12">
            <Link href="/" className="flex items-center">
              <motion.span 
                className="text-xl font-light tracking-wider"
                whileHover={{ scale: 1.05 }}
              >
                TREND<span className="font-thin">VISTA</span>
              </motion.span>
            </Link>
            {isAuthenticated && (
              <div className="hidden sm:flex sm:gap-8">
                {navItems.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="relative group"
                    >
                      <span className={`text-xs font-light tracking-widest transition-colors ${
                        isActive 
                          ? 'text-white' 
                          : 'text-white/40 hover:text-white/70'
                      }`}>
                        {item.name}
                      </span>
                      {isActive && (
                        <motion.div
                          className="absolute -bottom-1 left-0 right-0 h-px bg-white"
                          layoutId="activeTab"
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}
                      <motion.div
                        className="absolute -bottom-1 left-0 right-0 h-px bg-white/20"
                        initial={{ scaleX: 0 }}
                        whileHover={{ scaleX: 1 }}
                        transition={{ duration: 0.2 }}
                      />
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
          <div className="flex items-center gap-6">
            {isAuthenticated ? (
              <>
                <Link
                  href="/profile"
                  className="text-xs text-white/40 hover:text-white/70 font-light hidden sm:inline transition-colors"
                >
                  {user?.full_name || user?.email?.split('@')[0].toUpperCase()}
                </Link>
                <motion.button
                  onClick={logout}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-xs text-white/60 hover:text-white font-light tracking-wider transition-colors"
                >
                  EXIT
                </motion.button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-xs text-white/60 hover:text-white font-light tracking-wider transition-colors"
                >
                  ENTER
                </Link>
                {!isDemoMode && (
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link
                      href="/signup"
                      className="px-6 py-2 border border-white/20 rounded-full text-xs font-light tracking-wider hover:border-white/40 hover:bg-white/5 transition-all backdrop-blur-sm"
                    >
                      BEGIN
                    </Link>
                  </motion.div>
                )}
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  )
}
