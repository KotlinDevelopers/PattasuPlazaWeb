import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = { title:'Terms & Conditions' }

export default function TermsPage() {
  return (
    <>
      <Navbar/>
      <main className="min-h-screen bg-[#FAF0DC] dark:bg-[#0A0A0A] pt-[72px]">
        <div className="bg-[#0A0A0A] py-14">
          <div className="max-w-[1280px] mx-auto px-5 md:px-8">
            <h1 className="text-[#FFD700] font-extrabold text-[42px]" style={{ fontFamily:'"Playfair Display", serif', fontStyle:'italic' }}>Terms & Conditions</h1>
            <p className="text-[#BCAAA4] mt-2 text-[14px]">Last updated: January 2025</p>
          </div>
        </div>
        <div className="max-w-[800px] mx-auto px-5 md:px-8 py-12">
          <div className="space-y-8 text-[15px] text-[#7B4F00] dark:text-[#BCAAA4] leading-relaxed">
            {[
              { title:'Order Process', body:'All orders are enquiries confirmed via phone or WhatsApp. Placing an order online does not constitute a binding purchase until confirmed by our team. We reserve the right to decline orders due to stock availability or delivery constraints.' },
              { title:'Pricing', body:'Prices displayed are indicative and subject to change. Final pricing is confirmed at time of order confirmation. Wholesale and bulk prices apply to minimum quantities as stated on each product page.' },
              { title:'Delivery', body:'We use CCOE-licensed logistics partners for all deliveries. Delivery timelines (4–7 days) are estimates and may vary. We are not liable for delays caused by logistics partners or regulatory checks.' },
              { title:'Safety & Liability', body:'All fireworks must be used by adults aged 18+. Products must be used as per instructions. We are not liable for injuries or damages resulting from improper use. All products are CCOE certified and comply with applicable regulations.' },
              { title:'Returns & Refunds', body:'Damaged goods on delivery must be reported within 24 hours with photographic proof. We do not accept returns on opened or used products. Refunds are processed within 7 business days of approval.' },
              { title:'Governing Law', body:'These terms are governed by the laws of India. Disputes shall be subject to the exclusive jurisdiction of courts in Virudhunagar, Tamil Nadu.' },
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
