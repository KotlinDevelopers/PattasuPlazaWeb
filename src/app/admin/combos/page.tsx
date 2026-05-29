'use client'
import { useState, useMemo } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { PageHeader, Btn, Modal, ConfirmDialog, Input, Textarea, Toggle, EmptyState, Spinner, Card, SearchBar } from '@/components/admin/AdminUI'
import { useAdminCombos, useAdminProducts, saveCombo, deleteCombo } from '@/hooks/useAdmin'
import { Combo, ComboItem } from '@/types'
import { formatPrice } from '@/lib/utils'
import { Plus, Pencil, Trash2, X, Search } from 'lucide-react'
import toast from 'react-hot-toast'

const EMPTY: Partial<Combo> = {
  name:'', nameTamil:'', description:'', retailPrice:0, wholesalePrice:0, bulkPrice:0,
  items:[], isFeatured:false, isActive:true, tag:'',
}

export default function CombosPage() {
  const { combos,   loading } = useAdminCombos()
  const { products }          = useAdminProducts()
  const [showModal,  setShowModal]  = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [edit,       setEdit]       = useState<Partial<Combo>>(EMPTY)
  const [saving,     setSaving]     = useState(false)
  const [prodSearch, setProdSearch] = useState('')

  const set = (f: string, v: any) => setEdit(p => ({ ...p, [f]: v }))

  const filteredProds = useMemo(() =>
    products.filter(p => p.isActive && prodSearch.trim() &&
      p.name.toLowerCase().includes(prodSearch.toLowerCase())).slice(0, 6),
    [products, prodSearch]
  )

  const addItem = (p: typeof products[0]) => {
    const exists = edit.items?.find(i => i.productId === p.id)
    if (exists) return
    set('items', [...(edit.items||[]), { productId: p.id, quantity: 1, name: p.name }])
    setProdSearch('')
  }

  const removeItem = (idx: number) =>
    set('items', edit.items?.filter((_, i) => i !== idx))

  const updateQty = (idx: number, qty: number) =>
    set('items', edit.items?.map((it, i) => i === idx ? { ...it, quantity: Math.max(1, qty) } : it))

  const handleSave = async () => {
    if (!edit.name || !edit.retailPrice) { toast.error('Name and retail price required'); return }
    if (!edit.items?.length) { toast.error('Add at least one product'); return }
    setSaving(true)
    try {
      await saveCombo(edit)
      toast.success(edit.id ? 'Combo updated!' : 'Combo added!')
      setShowModal(false)
    } catch { toast.error('Save failed') }
    setSaving(false)
  }

  return (
    <AdminLayout>
      <PageHeader title="Combos" subtitle={`${combos.length} combos`}
        action={<Btn onClick={() => { setEdit({ ...EMPTY, items:[] }); setShowModal(true) }}><Plus size={15}/>Add Combo</Btn>} />

      {loading ? <div className="flex justify-center py-20"><Spinner /></div>
      : combos.length === 0 ? <EmptyState icon="🎁" title="No combos yet" />
      : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {combos.map(combo => (
            <div key={combo.id} className="bg-[#13100C] border border-[#2A2015] rounded-xl p-4 flex flex-col gap-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-bold text-[#FFF8F0]">{combo.name}</p>
                  {combo.nameTamil && <p className="text-xs text-[#8D6E63]">{combo.nameTamil}</p>}
                  {combo.tag && <span className="text-[10px] bg-[#FF6B00]/15 text-[#FF6B00] px-2 py-0.5 rounded-full mt-1 inline-block">{combo.tag}</span>}
                </div>
                <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${combo.isActive ? 'bg-[#4CAF50]' : 'bg-[#8D6E63]'}`} />
              </div>
              {combo.description && <p className="text-xs text-[#8D6E63] line-clamp-2">{combo.description}</p>}
              <div className="space-y-1">
                {combo.items?.map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <span className="text-[#BCAAA4]">• {item.name}</span>
                    <span className="text-[#8D6E63]">×{item.quantity}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-[#2A2015]">
                <div>
                  <p className="text-sm font-bold text-[#FF6B00]">{formatPrice(combo.retailPrice)}</p>
                  <p className="text-xs text-[#8D6E63]">retail</p>
                </div>
                <div className="flex gap-1.5">
                  <button onClick={() => { setEdit({ ...combo }); setShowModal(true) }}
                    className="w-7 h-7 rounded-lg grid place-items-center hover:bg-white/5 text-[#8D6E63] hover:text-[#FF6B00] transition">
                    <Pencil size={14}/>
                  </button>
                  <button onClick={() => { setEdit(combo); setShowDelete(true) }}
                    className="w-7 h-7 rounded-lg grid place-items-center hover:bg-[#F44336]/10 text-[#8D6E63] hover:text-[#F44336] transition">
                    <Trash2 size={14}/>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={showModal} onClose={() => setShowModal(false)} title={edit.id ? 'Edit Combo' : 'Add Combo'} wide>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input label="Combo Name *" value={edit.name||''} onChange={e => set('name', e.target.value)} />
            <Input label="Tamil Name" value={edit.nameTamil||''} onChange={e => set('nameTamil', e.target.value)} />
          </div>
          <Textarea label="Description" value={edit.description||''} onChange={e => set('description', e.target.value)} rows={2} />
          <Input label="Tag (optional)" value={edit.tag||''} onChange={e => set('tag', e.target.value)} placeholder="e.g. Best Seller, New" />

          {/* Pricing */}
          <div className="grid grid-cols-3 gap-3">
            <Input label="Retail Price ₹ *" type="number" value={edit.retailPrice||''} onChange={e => set('retailPrice', +e.target.value)} />
            <Input label="Wholesale Price ₹" type="number" value={edit.wholesalePrice||''} onChange={e => set('wholesalePrice', +e.target.value)} />
            <Input label="Bulk Price ₹" type="number" value={edit.bulkPrice||''} onChange={e => set('bulkPrice', +e.target.value)} />
          </div>

          {/* Items */}
          <div className="border-t border-[#2A2015] pt-4">
            <p className="text-xs text-[#8D6E63] uppercase tracking-wider font-medium mb-3">Combo Items</p>
            {edit.items?.map((item, i) => (
              <div key={i} className="flex items-center gap-2 mb-2">
                <p className="flex-1 text-sm text-[#FFF8F0] bg-[#0A0A0A] rounded-lg px-3 py-1.5 border border-[#2A2015]">{item.name}</p>
                <input type="number" min={1} value={item.quantity}
                  onChange={e => updateQty(i, +e.target.value)}
                  className="w-16 bg-[#0A0A0A] border border-[#2A2015] rounded-lg px-2 py-1.5 text-sm text-[#FFF8F0] text-center focus:outline-none focus:border-[#FF6B00]" />
                <button onClick={() => removeItem(i)} className="w-7 h-7 grid place-items-center text-[#F44336] hover:bg-[#F44336]/10 rounded-lg">
                  <X size={14}/>
                </button>
              </div>
            ))}
            <div className="relative mt-2">
              <input value={prodSearch} onChange={e => setProdSearch(e.target.value)}
                placeholder="Search & add product…"
                className="w-full bg-[#0A0A0A] border border-[#2A2015] focus:border-[#FF6B00] rounded-lg pl-8 pr-3 py-2 text-sm text-[#FFF8F0] placeholder:text-[#8D6E63] focus:outline-none" />
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#8D6E63]" />
            </div>
            {filteredProds.length > 0 && (
              <div className="mt-1.5 space-y-1">
                {filteredProds.map(p => (
                  <button key={p.id} onClick={() => addItem(p)}
                    className="w-full flex items-center justify-between bg-[#0A0A0A] border border-[#2A2015] hover:border-[#FF6B00]/40 rounded-lg px-3 py-2 transition text-left">
                    <span className="text-sm text-[#FFF8F0]">{p.name}</span>
                    <span className="text-xs text-[#FF6B00]">{formatPrice(p.retailPrice)}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <Toggle label="Featured" checked={!!edit.isFeatured} onChange={v => set('isFeatured', v)} />
            <Toggle label="Active" checked={!!edit.isActive} onChange={v => set('isActive', v)} />
          </div>

          <div className="flex gap-3 pt-2 border-t border-[#2A2015]">
            <Btn variant="secondary" onClick={() => setShowModal(false)} className="flex-1">Cancel</Btn>
            <Btn onClick={handleSave} loading={saving} className="flex-1">Save Combo</Btn>
          </div>
        </div>
      </Modal>

      <ConfirmDialog open={showDelete} onClose={() => setShowDelete(false)}
        onConfirm={() => deleteCombo(edit.id!).then(() => toast.success('Deleted'))} danger
        title="Delete Combo?" message={`Delete "${edit.name}"?`} />
    </AdminLayout>
  )
}
