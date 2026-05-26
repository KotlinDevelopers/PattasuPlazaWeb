import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans:  ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        tamil: ['"Noto Serif Tamil"', 'serif'],
      },
      colors: {
        // ── Brand ─────────────────────────────────────
        saffron:  { DEFAULT: '#FF6B00', dark: '#D14600', light: '#FF8C2A' },
        gold:     { DEFAULT: '#FFD700', deep: '#B8860B', text: '#7B4F00', light: '#FFE680' },
        crimson:  { DEFAULT: '#8B0000', light: '#CC0000' },
        // ── Dark surfaces ──────────────────────────────
        dark:     {
          bg:      '#0A0A0A',
          surface: '#1A1A1A',
          card:    '#13100C',
          border:  '#2A2015',
          deep:    '#0F0907',
        },
        // ── Light surfaces ─────────────────────────────
        cream:    {
          DEFAULT: '#FAF0DC',
          deep:    '#F3E3BD',
          light:   '#FFFDF7',
        },
        // ── Text ───────────────────────────────────────
        ink:      {
          DEFAULT: '#3D2810',
          muted:   '#7B4F00',
          dim:     '#9E7A3A',
          faint:   '#BCAAA4',
          ghost:   '#8D6E63',
        },
        // ── Semantic ───────────────────────────────────
        success:  '#1A7F3E',
        whatsapp: '#25D366',
      },
      backgroundImage: {
        'hero-gradient':   'radial-gradient(ellipse 90% 60% at 50% 35%, #2A1200 0%, #14080A 55%, #0A0A0A 100%)',
        'saffron-gradient':'linear-gradient(to bottom, #FF8C2A, #FF6B00)',
        'gold-gradient':   'linear-gradient(to bottom right, #FFD700, #FF8C00)',
        'dark-gradient':   'linear-gradient(110deg, #FF6B00 0%, #E64500 45%, #8B0000 100%)',
        'combo-gold':      'linear-gradient(155deg, #2A1200 0%, #5B2306 50%, #8B0000 100%)',
        'combo-rose':      'linear-gradient(155deg, #1B0530 0%, #4A0A56 50%, #8B1E4A 100%)',
        'combo-green':     'linear-gradient(155deg, #0E2A1A 0%, #0E5F2E 50%, #1A7F3E 100%)',
      },
      boxShadow: {
        'saffron-sm': '0 6px 20px rgba(255,107,0,0.32)',
        'saffron-md': '0 10px 30px rgba(255,107,0,0.45)',
        'saffron-lg': '0 14px 40px rgba(255,107,0,0.60)',
        'gold-glow':  '0 0 28px rgba(255,215,0,0.25)',
        'card-cream': '0 18px 50px rgba(124,79,0,0.18)',
        'card-dark':  '0 18px 50px rgba(0,0,0,0.45)',
        'whatsapp':   '0 4px 18px rgba(37,211,102,0.35)',
      },
      animation: {
        'sparkle':      'sparkle 3s ease-in-out infinite',
        'rise-up':      'riseUp 12s linear infinite',
        'glow-pulse':   'glowPulse 2.8s ease-in-out infinite',
        'pulse-dot':    'pulseDot 1.6s ease-in-out infinite',
        'scroll-dot':   'scrollDot 2s ease-in-out infinite',
        'float':        'float 6s ease-in-out infinite',
        'shimmer':      'shimmer 2s linear infinite',
        'fade-up':      'fadeUp 0.7s cubic-bezier(.2,.8,.25,1) forwards',
        'fade-in':      'fadeIn 0.5s ease forwards',
        'scale-in':     'scaleIn 0.5s cubic-bezier(.2,.8,.25,1) forwards',
        'countdown':    'countUp 0.3s cubic-bezier(.2,.8,.25,1)',
      },
      keyframes: {
        sparkle: {
          '0%,100%': { opacity: '0', transform: 'scale(0.4)' },
          '50%':     { opacity: '1', transform: 'scale(1.4)' },
        },
        riseUp: {
          '0%':   { transform: 'translateY(0)', opacity: '0' },
          '10%':  { opacity: '0.5' },
          '88%':  { opacity: '0.5' },
          '100%': { transform: 'translateY(-100vh)', opacity: '0' },
        },
        glowPulse: {
          '0%,100%': { opacity: '0.3', transform: 'scale(0.96)' },
          '50%':     { opacity: '0.75', transform: 'scale(1.06)' },
        },
        pulseDot: {
          '0%,100%': { opacity: '0.4' },
          '50%':     { opacity: '1' },
        },
        scrollDot: {
          '0%':   { transform: 'translateX(-50%) translateY(0)', opacity: '1' },
          '60%':  { transform: 'translateX(-50%) translateY(14px)', opacity: '0.2' },
          '100%': { transform: 'translateX(-50%) translateY(0)', opacity: '1' },
        },
        float: {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%':     { transform: 'translateY(-12px)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(28px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.85)' },
          to:   { opacity: '1', transform: 'scale(1)' },
        },
        countUp: {
          from: { transform: 'translateY(-8px)', opacity: '0' },
          to:   { transform: 'translateY(0)', opacity: '1' },
        },
      },
      transitionTimingFunction: {
        'bounce-sm': 'cubic-bezier(.2,.8,.25,1)',
      },
    },
  },
  plugins: [],
}

export default config
