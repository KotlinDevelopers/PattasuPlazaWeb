import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = { title:'Privacy Policy' }

export default function PrivacyPage() {
  return (
    <>
      <Navbar/>
      <main className="min-h-screen bg-[#FAF0DC] dark:bg-[#0A0A0A] pt-[72px]">
        <div className="bg-[#0A0A0A] py-14">
          <div className="max-w-[1280px] mx-auto px-5 md:px-8">
            <h1 className="text-[#FFD700] font-extrabold text-[42px]" style={{ fontFamily:'"Playfair Display", serif', fontStyle:'italic' }}>Privacy Policy</h1>
            <p className="text-[#BCAAA4] mt-2 text-[14px]">Last updated: January 2025</p>
          </div>
        </div>
        <div className="max-w-[800px] mx-auto px-5 md:px-8 py-12 prose prose-stone dark:prose-invert max-w-none">
          <div className="space-y-8 text-[15px] text-[#7B4F00] dark:text-[#BCAAA4] leading-relaxed">
            {[
              { title:'Information We Collect', body:'We collect your name, mobile number, and delivery area when you place an order. We may also collect your email address if you subscribe to our newsletter. We do not collect financial information — all payments are handled offline.' },
              { title:'How We Use Your Information', body:'Your contact details are used solely to process your order and communicate its status. Your mobile number may be used to send order updates via SMS or WhatsApp. We do not sell your data to third parties.' },
              { title:'Data Storage', body:'Your order data is stored securely in our Firebase database hosted on Google Cloud infrastructure. We retain order records for up to 3 years for compliance and customer service purposes.' },
              { title:'Cookies', body:'Our website uses minimal cookies required for functionality (theme preferences, cart data). We do not use advertising cookies or cross-site tracking.' },
              { title:'Your Rights', body:'You may request deletion of your data at any time by contacting us at hello@pattasuplaza.in. We will process deletion requests within 7 business days.' },
              { title:'Contact', body:'Questions about privacy? Email hello@pattasuplaza.in or WhatsApp +91 98765 43210.' },
            ].map(s => (
              <section key={s.title}>
                <h2 className="text-[20px] font-bold text-[#3D2810] dark:text-[#FFD700] mb-3" style={{ fontFamily:'"Playfair Display", serif' }}>{s.title}</h2>
                <p>{s.body}</p>
              </section>
            ))}
          </div>
        </div>
      </main>
      <Footer/>
    </>
  )
}
