'use client'
import { useState, useEffect } from 'react'
import { calcCountdown, pad2 } from '@/lib/utils'

export function useCountdown(targetISO: string) {
  const [time, setTime] = useState(() => calcCountdown(targetISO))

  useEffect(() => {
    const id = setInterval(() => setTime(calcCountdown(targetISO)), 1000)
    return () => clearInterval(id)
  }, [targetISO])

  return {
    ...time,
    dStr: pad2(time.d),
    hStr: pad2(time.h),
    mStr: pad2(time.m),
    sStr: pad2(time.s),
    expired: time.d === 0 && time.h === 0 && time.m === 0 && time.s === 0,
  }
}

export function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal')
    const io  = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('reveal-in')
          io.unobserve(e.target)
        }
      }),
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    )
    els.forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [])
}
