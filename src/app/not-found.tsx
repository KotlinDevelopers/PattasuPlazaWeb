import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { Firework } from '@/components/shared/Firework'

export default function NotFound() {
  return (
    <>
      <Navbar/>
      <main className="min-h-screen bg-[#FAF0DC] dark:bg-[#0A0A0A] pt-[72px] flex items-center justify-center px-5">
        <div className="text-center max-w-[500px] py-16">
          <div className="relative mx-auto w-48 h-48 mb-6 opacity-60">
            <Firework size={192} variant="crimson"/>
          </div>
          <h1 className="text-[80px] font-extrabold text-[#FF6B00] leading-none mb-2"
              style={{ fontFamily:'"Playfair Display", serif' }}>
            404
          </h1>
          <h2 className="text-[24px] font-bold text-[#7B4F00] dark:text-[#FFD700] mb-3"
              style={{ fontFamily:'"Playfair Display", serif' }}>
            Page not found
          </h2>
          <p className="text-[15px] text-[#9E7A3A] mb-8">
            Looks like this page went up in smoke! Let's get you back to the good stuff.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link href="/" className="px-6 py-3 rounded-xl bg-gradient-to-b from-[#FF8C2A] to-[#FF6B00] text-white font-bold text-[14px] hover:-translate-y-0.5 transition-all shadow-[0_8px_24px_rgba(255,107,0,0.35)]">
              Go Home
            </Link>
            <Link href="/shop" className="px-6 py-3 rounded-xl border border-[#E9D9B4] dark:border-[#2A2015] text-[#7B4F00] dark:text-[#BCAAA4] font-bold text-[14px] hover:border-[#FF6B00]/50 transition">
              Browse Shop
            </Link>
          </div>
        </div>
      </main>
      <Footer/>
    </>
  )
}
