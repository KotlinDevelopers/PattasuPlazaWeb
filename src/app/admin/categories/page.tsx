'use client'
import { useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { PageHeader, Btn, Modal, ConfirmDialog, Input, Textarea, Toggle, EmptyState, Spinner, Card } from '@/components/admin/AdminUI'
import { useAdminCategories, saveCategory, deleteCategory } from '@/hooks/useAdmin'
import { Category } from '@/types'
import { Plus, Pencil, Trash2, GripVertical } from 'lucide-react'
import toast from 'react-hot-toast'

const EMPTY: Partial<Category> = { name:'', nameTamil:'', description:'', icon:'🎆', sortOrder:0, isActive:true }

export default function CategoriesPage() {
  const { categories, loading } = useAdminCategories()
  const [showModal,  setShowModal]  = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [edit,       setEdit]       = useState<Partial<Category>>(EMPTY)
  const [saving,     setSaving]     = useState(false)

  const set = (f: string, v: any) => setEdit(p => ({ ...p, [f]: v }))

  const handleSave = async () => {
    if (!edit.name) { toast.error('Name required'); return }
    setSaving(true)
    try {
      await saveCategory(edit)
      toast.success(edit.id ? 'Category updated!' : 'Category added!')
      setShowModal(false)
    } catch { toast.error('Save failed') }
    setSaving(false)
  }

  return (
    <AdminLayout>
      <PageHeader title="Categories" subtitle={`${categories.length} categories`}
        action={<Btn onClick={() => { setEdit({ ...EMPTY }); setShowModal(true) }}><Plus size={15}/>Add Category</Btn>} />

      {loading ? <div className="flex justify-center py-20"><Spinner /></div>
      : categories.length === 0 ? <EmptyState icon="🏷️" title="No categories yet" />
      : (
        <Card>
          <div className="divide-y divide-[#2A2015]">
            {categories.map(cat => (
              <div key={cat.id} className="flex items-center gap-3 px-4 py-3 hover:bg-white/2 transition">
                <GripVertical size={16} className="text-[#2A2015] flex-shrink-0" />
                <div className="w-10 h-10 rounded-xl bg-[#FF6B00]/10 grid place-items-center text-xl flex-shrink-0">
                  {cat.icon || '🎆'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#FFF8F0]">{cat.name}</p>
                  <p className="text-xs text-[#8D6E63]">{cat.nameTamil} · Order: {cat.sortOrder}</p>
                </div>
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${cat.isActive ? 'bg-[#4CAF50]' : 'bg-[#8D6E63]'}`} />
                <div className="flex items-center gap-1.5">
                  <button onClick={() => { setEdit({ ...cat }); setShowModal(true) }}
                    className="w-7 h-7 rounded-lg grid place-items-center hover:bg-white/5 text-[#8D6E63] hover:text-[#FF6B00] transition">
                    <Pencil size={14}/>
                  </button>
                  <button onClick={() => { setEdit(cat); setShowDelete(true) }}
                    className="w-7 h-7 rounded-lg grid place-items-center hover:bg-[#F44336]/10 text-[#8D6E63] hover:text-[#F44336] transition">
                    <Trash2 size={14}/>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Modal open={showModal} onClose={() => setShowModal(false)} title={edit.id ? 'Edit Category' : 'Add Category'}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input label="Name *" value={edit.name||''} onChange={e => set('name', e.target.value)} placeholder="e.g. Sparklers" />
            <Input label="Tamil Name" value={edit.nameTamil||''} onChange={e => set('nameTamil', e.target.value)} placeholder="மத்தாப்பு" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Icon (emoji)" value={edit.icon||''} onChange={e => set('icon', e.target.value)} placeholder="✨" />
            <Input label="Sort Order" type="number" value={edit.sortOrder||0} onChange={e => set('sortOrder', +e.target.value)} />
          </div>
          <Textarea label="Description" value={edit.description||''} onChange={e => set('description', e.target.value)} rows={2} />
          <Toggle label="Active" checked={!!edit.isActive} onChange={v => set('isActive', v)} />
          <div className="flex gap-3 pt-2 border-t border-[#2A2015]">
            <Btn variant="secondary" onClick={() => setShowModal(false)} className="flex-1">Cancel</Btn>
            <Btn onClick={handleSave} loading={saving} className="flex-1">Save Category</Btn>
          </div>
        </div>
      </Modal>

      <ConfirmDialog open={showDelete} onClose={() => setShowDelete(false)}
        onConfirm={() => deleteCategory(edit.id!).then(() => toast.success('Deleted'))} danger
        title="Delete Category?" message={`Delete "${edit.name}"?`} />
    </AdminLayout>
  )
}
