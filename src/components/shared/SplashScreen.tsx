'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Firework, Sparkles, ParticleField } from '@/components/shared/Firework'

export default function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<'enter' | 'show' | 'exit'>('enter')

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('show'), 600)
    const t2 = setTimeout(() => setPhase('exit'), 2800)
    const t3 = setTimeout(() => onComplete(), 3500)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [onComplete])

  return (
    <AnimatePresence>
      {phase !== 'exit' ? (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.7, ease: [0.2, 0.8, 0.25, 1] }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
          style={{ background: 'radial-gradient(ellipse 90% 70% at 50% 40%, #2A1200 0%, #14080A 55%, #0A0A0A 100%)' }}>

          {/* Particles */}
          <ParticleField count={20} seed={7}/>
          <Sparkles count={40} seed={13}/>

          {/* Glow ring */}
          <div className="absolute w-[400px] h-[400px] rounded-full pp-pulse-glow pointer-events-none"
               style={{ background: 'radial-gradient(circle, rgba(255,215,0,0.18) 0%, rgba(255,107,0,0.08) 50%, transparent 70%)' }}/>

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center">

            {/* Firework icon */}
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: phase === 'show' ? 1 : 0.8, rotate: 0 }}
              transition={{ duration: 0.7, type: 'spring', bounce: 0.4 }}
              className="relative mb-6">
              <div className="absolute -inset-8 rounded-full pp-pulse-glow pointer-events-none"
                   style={{ background: 'radial-gradient(circle, rgba(255,215,0,0.3) 0%, transparent 70%)' }}/>
              <div className="relative w-[160px] h-[160px] rounded-[32px] grid place-items-center"
                   style={{
                     background: 'linear-gradient(160deg, #1a0f06 0%, #08060a 100%)',
                     boxShadow: '0 0 0 1px rgba(255,215,0,0.3), 0 20px 60px rgba(255,140,0,0.25), inset 0 1px 0 rgba(255,215,0,0.12)',
                   }}>
                <Firework size={130} variant="gold"/>
              </div>
            </motion.div>

            {/* Logo text */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: phase === 'show' ? 1 : 0, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-center">
              <h1 className="text-[36px] font-extrabold text-[#FFD700] tracking-tight"
                  style={{ fontFamily: '"Playfair Display", serif', fontStyle: 'italic',
                    textShadow: '0 0 30px rgba(255,215,0,0.4)' }}>
                Pattasu Plaza
              </h1>
              <div className="text-[16px] text-[#FFD700]/70 mt-1"
                   style={{ fontFamily: '"Noto Serif Tamil", serif' }}>
                பட்டாசு பிளாசா
              </div>
              <div className="mt-3 flex items-center justify-center gap-3 text-[11px] tracking-[3px] uppercase text-[#8D6E63] font-medium">
                <span className="h-px w-8 bg-[#FF6B00]/50"/>
                EST. 1995 · SIVAKASI
                <span className="h-px w-8 bg-[#FF6B00]/50"/>
              </div>
            </motion.div>

            {/* Loading bar */}
            <motion.div
              className="mt-8 w-[160px] h-[2px] rounded-full bg-[#FFD700]/10 overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: phase === 'show' ? 1 : 0 }}
              transition={{ delay: 0.5 }}>
              <motion.div
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg, #FF6B00, #FFD700)' }}
                initial={{ width: '0%' }}
                animate={{ width: phase === 'show' ? '100%' : '0%' }}
                transition={{ delay: 0.6, duration: 1.8, ease: 'easeInOut' }}/>
            </motion.div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
