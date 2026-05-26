'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { useAuthStore } from '@/lib/store'
import { Firework, Sparkles, ParticleField, Flame } from '@/components/shared/Firework'

export default function LoginScreen({ onSuccess }: { onSuccess: () => void }) {
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')
  const setUser               = useAuthStore(s => s.setUser)

  const handleGoogleSignIn = async () => {
    setLoading(true)
    setError('')
    try {
      const provider = new GoogleAuthProvider()
      const result   = await signInWithPopup(auth, provider)
      const user     = result.user
      setUser({
        uid:         user.uid,
        email:       user.email,
        displayName: user.displayName,
        photoURL:    user.photoURL,
      })
      onSuccess()
    } catch (e: any) {
      setError('Sign in failed. Please try again.')
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9998] flex items-center justify-center overflow-hidden"
      style={{ background: 'radial-gradient(ellipse 90% 70% at 50% 35%, #2A1200 0%, #14080A 55%, #0A0A0A 100%)' }}>

      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0"
           style={{ background: 'radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.6) 100%)' }}/>
      <ParticleField count={16} seed={5}/>
      <Sparkles count={35} seed={9}/>

      <div className="relative z-10 w-full max-w-[420px] mx-auto px-5">

        {/* Logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, type: 'spring', bounce: 0.3 }}
          className="flex flex-col items-center mb-8">
          <div className="relative mb-5">
            <div className="absolute -inset-6 rounded-full pp-pulse-glow pointer-events-none"
                 style={{ background: 'radial-gradient(circle, rgba(255,215,0,0.25) 0%, transparent 70%)' }}/>
            <div className="relative w-[110px] h-[110px] rounded-[24px] grid place-items-center"
                 style={{
                   background: 'linear-gradient(160deg, #1a0f06 0%, #08060a 100%)',
                   boxShadow: '0 0 0 1px rgba(255,215,0,0.28), 0 20px 50px rgba(255,140,0,0.2)',
                 }}>
              <Firework size={90} variant="gold"/>
            </div>
          </div>

          <h1 className="text-[28px] font-extrabold text-[#FFD700] tracking-tight"
              style={{ fontFamily: '"Playfair Display", serif', fontStyle: 'italic',
                textShadow: '0 0 24px rgba(255,215,0,0.3)' }}>
            Pattasu Plaza
          </h1>
          <div className="text-[14px] text-[#FFD700]/65 mt-1"
               style={{ fontFamily: '"Noto Serif Tamil", serif' }}>
            பட்டாசு பிளாசா
          </div>
          <div className="mt-2 text-[11px] tracking-[2.5px] uppercase text-[#8D6E63] font-medium">
            Sivakasi's Finest Fireworks
          </div>
        </motion.div>

        {/* Login card */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="rounded-2xl overflow-hidden border border-[#FFD700]/15"
          style={{ background: 'linear-gradient(160deg, #1A0F06 0%, #0F0907 100%)' }}>

          <div className="p-6">
            <h2 className="text-[20px] font-bold text-[#FFD700] mb-1"
                style={{ fontFamily: '"Playfair Display", serif' }}>
              Welcome back!
            </h2>
            <p className="text-[13px] text-[#BCAAA4] mb-6">
              Sign in to place orders & track deliveries
            </p>

            {/* Google sign in button */}
            <motion.button
              onClick={handleGoogleSignIn}
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-3 py-3.5 px-5 rounded-xl bg-white hover:bg-gray-50 text-[#3D2810] font-semibold text-[15px] transition-all shadow-[0_8px_24px_rgba(0,0,0,0.4)] disabled:opacity-70">
              {loading ? (
                <div className="w-5 h-5 rounded-full border-2 border-[#FF6B00]/30 border-t-[#FF6B00] animate-spin"/>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              )}
              {loading ? 'Signing in…' : 'Continue with Google'}
            </motion.button>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 text-center text-[13px] text-red-400">
                {error}
              </motion.p>
            )}

            {/* Divider */}
            <div className="my-5 flex items-center gap-3">
              <div className="flex-1 h-px bg-[#FFD700]/10"/>
              <span className="text-[11px] text-[#8D6E63] uppercase tracking-[2px]">or</span>
              <div className="flex-1 h-px bg-[#FFD700]/10"/>
            </div>

            {/* Guest/Skip */}
            <motion.button
              onClick={onSuccess}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full py-3 rounded-xl border border-[#FFD700]/20 text-[#BCAAA4] text-[14px] font-medium hover:border-[#FFD700]/40 hover:text-[#FFD700] transition-all">
              Browse as Guest
            </motion.button>
          </div>

          {/* Bottom strip */}
          <div className="px-6 py-3 border-t border-[#FFD700]/8 text-center">
            <p className="text-[11px] text-[#8D6E63]">
              🔒 Secure sign-in · Your data is safe with us
            </p>
          </div>
        </motion.div>

        {/* Trust strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 flex items-center justify-center gap-5 text-[11px] tracking-[1.5px] uppercase text-[#8D6E63] font-medium">
          <span>100% Authentic</span>
          <span className="text-[#FF6B00]">·</span>
          <span>4500+ Families</span>
          <span className="text-[#FF6B00]">·</span>
          <span>Est. 1995</span>
        </motion.div>
      </div>
    </motion.div>
  )
}
