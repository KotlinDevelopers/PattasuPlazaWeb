'use client'
import { useState } from 'react'
import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { IconWhatsApp } from '@/components/shared/Firework'
import { motion } from 'framer-motion'
import { Phone, Mail, MapPin, Clock, Send, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ContactPage() {
  const [form,     setForm]     = useState({ name:'', email:'', mobile:'', subject:'', message:'' })
  const [sent,     setSent]     = useState(false)
  const [sending,  setSending]  = useState(false)

  const f = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(p => ({ ...p, [k]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.mobile || !form.message) {
      toast.error('Please fill in required fields')
      return
    }
    setSending(true)
    // In production: send to Firebase or email service
    await new Promise(r => setTimeout(r, 1200))
    setSending(false)
    setSent(true)
  }

  const CONTACT_INFO = [
    { icon:<Phone size={18}/>,   label:'Phone',     value:'+91 98765 43210',         href:'tel:+919876543210' },
    { icon:<IconWhatsApp size={18} color="#25D366"/>, label:'WhatsApp', value:'+91 98765 43210', href:'https://wa.me/919876543210' },
    { icon:<Mail size={18}/>,    label:'Email',     value:'hello@pattasuplaza.in',   href:'mailto:hello@pattasuplaza.in' },
    { icon:<MapPin size={18}/>,  label:'Address',   value:'42, Anaikuttam Main Road, Sivakasi, TN 626123', href:'#' },
    { icon:<Clock size={18}/>,   label:'Hours',     value:'Mon–Sat 9AM–9PM · Sun 10AM–6PM', href:'#' },
  ]

  return (
    <>
      <Navbar/>
      <main className="min-h-screen bg-[#FAF0DC] dark:bg-[#0A0A0A] pt-[72px]">

        {/* Header */}
        <div className="relative bg-[#0A0A0A] py-16 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none"
               style={{ background:'radial-gradient(ellipse 70% 60% at 50% 50%, #2A1200 0%, transparent 70%)' }}/>
          <div className="relative max-w-[1280px] mx-auto px-5 md:px-8">
            <div className="text-[11px] tracking-[3px] uppercase font-semibold text-[#FF6B00] mb-3">We'd love to hear from you</div>
            <h1 className="text-[#FFD700] font-extrabold text-[48px] leading-tight"
                style={{ fontFamily:'"Playfair Display", serif', fontStyle:'italic' }}>
              Get in Touch
            </h1>
            <p className="text-[#BCAAA4] text-[15px] mt-2 max-w-[500px]">
              Questions about orders, bulk pricing, or just want to say hi? We're always available.
            </p>
          </div>
        </div>

        <div className="max-w-[1280px] mx-auto px-5 md:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

            {/* Contact info */}
            <div className="lg:col-span-2 space-y-5">
              <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl p-6 border border-[#E9D9B4] dark:border-[#2A2015]">
                <h2 className="text-[20px] font-bold text-[#7B4F00] dark:text-[#FFD700] mb-5"
                    style={{ fontFamily:'"Playfair Display", serif' }}>
                  Contact Details
                </h2>
                <div className="space-y-4">
                  {CONTACT_INFO.map(c => (
                    <a key={c.label} href={c.href} target={c.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer"
                       className="flex items-start gap-3 group">
                      <span className="mt-0.5 text-[#FF6B00]">{c.icon}</span>
                      <div>
                        <div className="text-[11px] uppercase tracking-[2px] text-[#9E7A3A] font-semibold">{c.label}</div>
                        <div className="text-[14px] text-[#3D2810] dark:text-[#E8DDC9] group-hover:text-[#FF6B00] transition-colors">{c.value}</div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              {/* WhatsApp CTA */}
              <div className="rounded-2xl p-6 border border-[#25D366]/30"
                   style={{ background:'linear-gradient(135deg, #0E2A1A 0%, #0E5F2E 100%)' }}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2 h-2 rounded-full bg-[#9CE6B0] animate-pulse"/>
                  <span className="text-[11px] tracking-[2px] uppercase font-semibold text-[#9CE6B0]">Online · Replies in 5 min</span>
                </div>
                <h3 className="text-[20px] font-bold text-white mb-2"
                    style={{ fontFamily:'"Playfair Display", serif' }}>
                  Fastest response on WhatsApp
                </h3>
                <p className="text-[13px] text-white/80 mb-4">
                  For orders, bulk pricing queries, or urgent support — WhatsApp is always fastest.
                </p>
                <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer"
                   className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-white text-[#0E5F2E] font-bold text-[14px] hover:scale-[1.02] transition-transform shadow-lg">
                  <IconWhatsApp size={18} color="#25D366"/>
                  Chat on WhatsApp
                </a>
              </div>
            </div>

            {/* Contact form */}
            <div className="lg:col-span-3">
              <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl p-6 md:p-8 border border-[#E9D9B4] dark:border-[#2A2015]">
                {sent ? (
                  <motion.div
                    initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }}
                    className="text-center py-12">
                    <CheckCircle size={56} className="mx-auto text-[#1A7F3E] mb-4"/>
                    <h3 className="text-[24px] font-bold text-[#7B4F00] dark:text-[#FFD700] mb-2"
                        style={{ fontFamily:'"Playfair Display", serif' }}>
                      Message Sent!
                    </h3>
                    <p className="text-[#9E7A3A]">We'll get back to you within 24 hours.</p>
                  </motion.div>
                ) : (
                  <>
                    <h2 className="text-[22px] font-bold text-[#7B4F00] dark:text-[#FFD700] mb-6"
                        style={{ fontFamily:'"Playfair Display", serif' }}>
                      Send a Message
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                          { k:'name',   label:'Your Name *',    type:'text', ph:'Full name'       },
                          { k:'mobile', label:'Mobile Number *', type:'tel',  ph:'+91 98765 43210' },
                          { k:'email',  label:'Email',           type:'email',ph:'you@email.com'   },
                        ].map(fi => (
                          <div key={fi.k} className={fi.k === 'email' ? 'sm:col-span-2' : ''}>
                            <label className="block text-[11px] uppercase tracking-[2px] text-[#9E7A3A] font-semibold mb-1.5">{fi.label}</label>
                            <input type={fi.type} value={(form as any)[fi.k]} onChange={f(fi.k)}
                              placeholder={fi.ph}
                              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E9D9B4] dark:border-[#2A2015] bg-[#FFFDF7] dark:bg-[#0F0907] text-[14px] text-[#3D2810] dark:text-[#FFF8F0] placeholder-[#BCAAA4] focus:outline-none focus:border-[#FF6B00] focus:ring-2 focus:ring-[#FF6B00]/20 transition"/>
                          </div>
                        ))}
                      </div>

                      <div>
                        <label className="block text-[11px] uppercase tracking-[2px] text-[#9E7A3A] font-semibold mb-1.5">Subject</label>
                        <select value={form.subject} onChange={f('subject')}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#E9D9B4] dark:border-[#2A2015] bg-[#FFFDF7] dark:bg-[#0F0907] text-[14px] text-[#3D2810] dark:text-[#FFF8F0] focus:outline-none focus:border-[#FF6B00] transition">
                          <option value="">Select a topic</option>
                          <option value="order">Order enquiry</option>
                          <option value="bulk">Bulk / wholesale pricing</option>
                          <option value="track">Track my order</option>
                          <option value="return">Return / refund</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] uppercase tracking-[2px] text-[#9E7A3A] font-semibold mb-1.5">Message *</label>
                        <textarea value={form.message} onChange={f('message')} rows={5}
                          placeholder="How can we help you?"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#E9D9B4] dark:border-[#2A2015] bg-[#FFFDF7] dark:bg-[#0F0907] text-[14px] text-[#3D2810] dark:text-[#FFF8F0] placeholder-[#BCAAA4] focus:outline-none focus:border-[#FF6B00] focus:ring-2 focus:ring-[#FF6B00]/20 transition resize-none"/>
                      </div>

                      <button type="submit" disabled={sending}
                        className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-b from-[#FF8C2A] to-[#FF6B00] text-white font-bold text-[15px] shadow-[0_8px_24px_rgba(255,107,0,0.40)] hover:-translate-y-0.5 transition-all disabled:opacity-70">
                        {sending
                          ? <><span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"/>Sending…</>
                          : <><Send size={17}/> Send Message</>
                        }
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer/>
    </>
  )
}
