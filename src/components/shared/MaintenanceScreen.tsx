'use client'
import { Firework, Sparkles } from '@/components/shared/Firework'
import { IconWhatsApp } from '@/components/shared/Firework'

export default function MaintenanceScreen({ message }: { message?: string }) {
  return (
    <div className="fixed inset-0 z-[9998] flex flex-col items-center justify-center text-center px-5"
         style={{ background:'radial-gradient(ellipse 90% 70% at 50% 40%, #2A1200 0%, #14080A 55%, #0A0A0A 100%)' }}>
      <Sparkles count={30} seed={9}/>
      <div className="relative z-10">
        <div className="relative mx-auto w-36 h-36 mb-6 opacity-80">
          <Firework size={144} variant="gold"/>
        </div>
        <h1 className="text-[#FFD700] font-extrabold text-[36px] mb-2"
            style={{ fontFamily:'"Playfair Display", serif', fontStyle:'italic' }}>
          Pattasu Plaza
        </h1>
        <div className="text-[14px] text-[#BCAAA4] mb-4 max-w-[400px] leading-relaxed">
          {message || "We're upgrading things to make your Diwali shopping even better! We'll be back shortly. 🎆"}
        </div>
        <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer"
           className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#25D366] hover:bg-[#1FB958] text-white font-bold text-[14px] transition shadow-[0_8px_24px_rgba(37,211,102,0.35)]">
          <IconWhatsApp size={18}/> Contact us on WhatsApp
        </a>
      </div>
    </div>
  )
}
