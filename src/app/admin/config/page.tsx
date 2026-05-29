'use client'
import { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { PageHeader, Btn, Input, Textarea, Toggle, Spinner, Card } from '@/components/admin/AdminUI'
import { useAdminConfig, saveConfig } from '@/hooks/useAdmin'
import { AppConfig } from '@/types'
import { Save } from 'lucide-react'
import toast from 'react-hot-toast'

const DEFAULT: AppConfig = {
  shopName:'', shopNameTamil:'', tagline:'',
  phone1:'', phone2:'', whatsapp:'', email:'',
  address:'', mapsLink:'',
  businessHours:'', minimumOrderValue:2000,
  instagram:'', facebook:'', youtube:'',
  aboutUs:'', termsAndConditions:'', privacyPolicy:'', helpText:'',
  maintenanceMode:false, maintenanceMessage:'',
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card className="overflow-hidden">
      <div className="px-5 py-3.5 border-b border-[#2A2015]">
        <h2 className="text-sm font-semibold text-[#FFD700]">{title}</h2>
      </div>
      <div className="p-5 space-y-4">{children}</div>
    </Card>
  )
}

export default function ConfigPage() {
  const { config, loading } = useAdminConfig()
  const [form,    setForm]  = useState<AppConfig>(DEFAULT)
  const [saving,  setSaving] = useState(false)

  useEffect(() => { if (config) setForm({ ...DEFAULT, ...config }) }, [config])

  const set = (f: keyof AppConfig, v: any) => setForm(p => ({ ...p, [f]: v }))

  const handleSave = async () => {
    setSaving(true)
    try {
      await saveConfig(form)
      toast.success('Configuration saved!')
    } catch { toast.error('Save failed') }
    setSaving(false)
  }

  if (loading) return <AdminLayout><div className="flex justify-center py-20"><Spinner /></div></AdminLayout>

  return (
    <AdminLayout>
      <PageHeader title="App Configuration" subtitle="Manage all shop settings"
        action={<Btn onClick={handleSave} loading={saving}><Save size={15}/>Save All</Btn>} />

      <div className="space-y-5 max-w-2xl">

        <Section title="🏪 Shop Information">
          <div className="grid grid-cols-2 gap-3">
            <Input label="Shop Name" value={form.shopName} onChange={e => set('shopName', e.target.value)} placeholder="Pattasu Plaza" />
            <Input label="Shop Name (Tamil)" value={form.shopNameTamil} onChange={e => set('shopNameTamil', e.target.value)} placeholder="பட்டாசு பிளாசா" />
          </div>
          <Input label="Tagline" value={form.tagline} onChange={e => set('tagline', e.target.value)} placeholder="Sivakasi's finest fireworks since 1995" />
        </Section>

        <Section title="📞 Contact Details">
          <div className="grid grid-cols-2 gap-3">
            <Input label="Phone 1" value={form.phone1} onChange={e => set('phone1', e.target.value)} placeholder="+91 98765 43210" />
            <Input label="Phone 2" value={form.phone2} onChange={e => set('phone2', e.target.value)} placeholder="+91 98765 43211" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="WhatsApp" value={form.whatsapp} onChange={e => set('whatsapp', e.target.value)} placeholder="+91 98765 43210" />
            <Input label="Email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="hello@pattasuplaza.in" />
          </div>
        </Section>

        <Section title="📍 Location & Hours">
          <Textarea label="Address" value={form.address} onChange={e => set('address', e.target.value)} rows={2} placeholder="Full shop address" />
          <Input label="Google Maps Link" value={form.mapsLink} onChange={e => set('mapsLink', e.target.value)} placeholder="https://maps.google.com/…" />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Business Hours" value={form.businessHours} onChange={e => set('businessHours', e.target.value)} placeholder="Mon–Sun · 9AM–9PM" />
            <Input label="Min Order Value ₹" type="number" value={form.minimumOrderValue} onChange={e => set('minimumOrderValue', +e.target.value)} />
          </div>
        </Section>

        <Section title="📱 Social Media">
          <Input label="Instagram URL" value={form.instagram} onChange={e => set('instagram', e.target.value)} placeholder="https://instagram.com/pattasuplaza" />
          <Input label="Facebook URL" value={form.facebook} onChange={e => set('facebook', e.target.value)} placeholder="https://facebook.com/pattasuplaza" />
          <Input label="YouTube URL" value={form.youtube} onChange={e => set('youtube', e.target.value)} placeholder="https://youtube.com/@pattasuplaza" />
        </Section>

        <Section title="📄 About Us">
          <Textarea label="About Us" value={form.aboutUs} onChange={e => set('aboutUs', e.target.value)} rows={5}
            placeholder="Tell customers about your shop — history, quality, trust..." />
        </Section>

        <Section title="📋 Terms & Conditions">
          <Textarea label="Terms & Conditions" value={form.termsAndConditions} onChange={e => set('termsAndConditions', e.target.value)} rows={6} />
        </Section>

        <Section title="🔒 Privacy Policy">
          <Textarea label="Privacy Policy" value={form.privacyPolicy} onChange={e => set('privacyPolicy', e.target.value)} rows={6} />
        </Section>

        <Section title="❓ Help & FAQ">
          <Textarea label="Help Text" value={form.helpText} onChange={e => set('helpText', e.target.value)} rows={4}
            placeholder="How to order, delivery info, return policy, FAQs…" />
        </Section>

        <Section title="⚙️ Maintenance Mode">
          <Toggle label="Enable Maintenance Mode" checked={form.maintenanceMode} onChange={v => set('maintenanceMode', v)}
            subtitle="Blocks customer app & website with a message" />
          {form.maintenanceMode && (
            <Textarea label="Maintenance Message" value={form.maintenanceMessage} onChange={e => set('maintenanceMessage', e.target.value)} rows={2}
              placeholder="We'll be back shortly! Upgrading for you 🎆" />
          )}
        </Section>

        <Btn onClick={handleSave} loading={saving} size="lg" className="w-full">
          <Save size={16}/> Save Configuration
        </Btn>
      </div>
    </AdminLayout>
  )
}
