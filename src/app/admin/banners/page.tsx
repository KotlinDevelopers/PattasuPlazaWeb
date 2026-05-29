'use client'
import { useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { PageHeader, Btn, Modal, ConfirmDialog, Input, Toggle, EmptyState, Spinner, Card, Select } from '@/components/admin/AdminUI'
import { useAdminBanners, saveBanner, deleteBanner } from '@/hooks/useAdmin'
import { Banner } from '@/types'
import { Plus, Pencil, Trash2, GripVertical } from 'lucide-react'
import toast from 'react-hot-toast'

const EMPTY: Partial<Banner> = { title:'', titleTamil:'', image:'', actionType:'none', actionId:'', sortOrder:0, isActive:true }

export default function BannersPage() {
  const { banners, loading } = useAdminBanners()
  const [showModal,  setShowModal]  = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [edit,       setEdit]       = useState<Partial<Banner>>(EMPTY)
  const [saving,     setSaving]     = useState(false)

  const set = (f: string, v: any) => setEdit(p => ({ ...p, [f]: v }))

  const handleSave = async () => {
    if (!edit.title) { toast.error('Title required'); return }
    setSaving(true)
    try {
      await saveBanner(edit)
      toast.success(edit.id ? 'Banner updated!' : 'Banner added!')
      setShowModal(false)
    } catch { toast.error('Save failed') }
    setSaving(false)
  }

  return (
    <AdminLayout>
      <PageHeader title="Banners" subtitle={`${banners.length} banners`}
        action={<Btn onClick={() => { setEdit({ ...EMPTY }); setShowModal(true) }}><Plus size={15}/>Add Banner</Btn>} />

      {loading ? <div className="flex justify-center py-20"><Spinner /></div>
      : banners.length === 0 ? <EmptyState icon="🖼️" title="No banners yet" />
      : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {banners.map(banner => (
            <div key={banner.id} className="bg-[#13100C] border border-[#2A2015] rounded-xl overflow-hidden">
              {banner.image ? (
                <div className="h-32 overflow-hidden bg-[#0A0A0A]">
                  <img src={banner.image} alt={banner.title} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="h-32 bg-[#0A0A0A] grid place-items-center text-4xl">🖼️</div>
              )}
              <div className="p-3">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className="text-sm font-semibold text-[#FFF8F0]">{banner.title}</p>
                  <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${banner.isActive ? 'bg-[#4CAF50]' : 'bg-[#8D6E63]'}`} />
                </div>
                <p className="text-xs text-[#8D6E63] mb-3">Sort: {banner.sortOrder} · {banner.actionType}</p>
                <div className="flex gap-1.5 justify-end">
                  <button onClick={() => { setEdit({ ...banner }); setShowModal(true) }}
                    className="w-7 h-7 rounded-lg grid place-items-center hover:bg-white/5 text-[#8D6E63] hover:text-[#FF6B00] transition">
                    <Pencil size={14}/>
                  </button>
                  <button onClick={() => { setEdit(banner); setShowDelete(true) }}
                    className="w-7 h-7 rounded-lg grid place-items-center hover:bg-[#F44336]/10 text-[#8D6E63] hover:text-[#F44336] transition">
                    <Trash2 size={14}/>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={showModal} onClose={() => setShowModal(false)} title={edit.id ? 'Edit Banner' : 'Add Banner'}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input label="Title *" value={edit.title||''} onChange={e => set('title', e.target.value)} />
            <Input label="Tamil Title" value={edit.titleTamil||''} onChange={e => set('titleTamil', e.target.value)} />
          </div>
          <Input label="Image URL" value={edit.image||''} onChange={e => set('image', e.target.value)} placeholder="https://…" />
          {edit.image && <img src={edit.image} alt="Preview" className="w-full h-28 object-cover rounded-lg border border-[#2A2015]" />}
          <div className="grid grid-cols-2 gap-3">
            <Select label="Action Type" value={edit.actionType||'none'} onChange={e => set('actionType', e.target.value)}>
              <option value="none">None</option>
              <option value="product">Product</option>
              <option value="category">Category</option>
              <option value="combo">Combo</option>
              <option value="screen">Screen</option>
            </Select>
            <Input label="Action ID" value={edit.actionId||''} onChange={e => set('actionId', e.target.value)} placeholder="product/category ID" />
          </div>
          <Input label="Sort Order" type="number" value={edit.sortOrder||0} onChange={e => set('sortOrder', +e.target.value)} />
          <Toggle label="Active" checked={!!edit.isActive} onChange={v => set('isActive', v)} />
          <div className="flex gap-3 pt-2 border-t border-[#2A2015]">
            <Btn variant="secondary" onClick={() => setShowModal(false)} className="flex-1">Cancel</Btn>
            <Btn onClick={handleSave} loading={saving} className="flex-1">Save Banner</Btn>
          </div>
        </div>
      </Modal>

      <ConfirmDialog open={showDelete} onClose={() => setShowDelete(false)}
        onConfirm={() => deleteBanner(edit.id!).then(() => toast.success('Deleted'))} danger
        title="Delete Banner?" message={`Delete "${edit.title}"?`} />
    </AdminLayout>
  )
}
