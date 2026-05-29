'use client'
import { useState, useMemo, useRef } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { PageHeader, Btn, SearchBar, Modal, ConfirmDialog, Input, Textarea, Select, Toggle, EmptyState, Spinner, Card, StockBadge } from '@/components/admin/AdminUI'
import { useAdminProducts, useAdminCategories, saveProduct, deleteProduct, toggleProductField, uploadProductImage } from '@/hooks/useAdmin'
import { Product, ProductVariant } from '@/types'
import { formatPrice } from '@/lib/utils'
import { Plus, Pencil, Trash2, Star, Eye, EyeOff, Upload, X } from 'lucide-react'
import toast from 'react-hot-toast'

const EMPTY_PRODUCT: Partial<Product> = {
  name:'', nameTamil:'', categoryId:'', description:'', descriptionTamil:'',
  retailPrice:0, wholesalePrice:0, bulkPrice:0,
  retailMinQty:1, wholesaleMinQty:5, bulkMinQty:20,
  unit:'box', stock:'available', stockCount:0,
  images:[], youtubeUrl:'', isFeatured:false, isOffer:false, offerPercent:0,
  isActive:true, tags:[], hasVariants:false, variants:[],
}

export default function ProductsPage() {
  const { products, loading } = useAdminProducts()
  const { categories }        = useAdminCategories()
  const [search,     setSearch]     = useState('')
  const [catFilter,  setCatFilter]  = useState('ALL')
  const [showModal,  setShowModal]  = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [editProduct, setEditProduct] = useState<Partial<Product>>(EMPTY_PRODUCT)
  const [saving,     setSaving]     = useState(false)
  const [uploading,  setUploading]  = useState(false)
  const [newTag,     setNewTag]     = useState('')
  const [newImageUrl,setNewImageUrl]= useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const filtered = useMemo(() => {
    let list = products
    if (catFilter !== 'ALL') list = list.filter(p => p.categoryId === catFilter)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(p => p.name.toLowerCase().includes(q) || p.nameTamil?.includes(q))
    }
    return list
  }, [products, catFilter, search])

  const openAdd  = () => { setEditProduct({ ...EMPTY_PRODUCT }); setShowModal(true) }
  const openEdit = (p: Product) => { setEditProduct({ ...p }); setShowModal(true) }

  const set = (field: string, value: any) => setEditProduct(prev => ({ ...prev, [field]: value }))

  const handleSave = async () => {
    if (!editProduct.name || !editProduct.categoryId) { toast.error('Name and category required'); return }
    setSaving(true)
    try {
      await saveProduct(editProduct)
      toast.success(editProduct.id ? 'Product updated!' : 'Product added!')
      setShowModal(false)
    } catch { toast.error('Save failed') }
    setSaving(false)
  }

  const handleDelete = async () => {
    if (!editProduct.id) return
    await deleteProduct(editProduct.id)
    toast.success('Product deleted')
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return
    const pid = editProduct.id || `temp_${Date.now()}`
    setUploading(true)
    try {
      const url = await uploadProductImage(pid, file)
      set('images', [...(editProduct.images || []), url])
      toast.success('Image uploaded!')
    } catch { toast.error('Upload failed') }
    setUploading(false)
  }

  return (
    <AdminLayout>
      <PageHeader
        title="Products"
        subtitle={`${filtered.length} of ${products.length} products`}
        action={<Btn onClick={openAdd}><Plus size={15}/>Add Product</Btn>}
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <SearchBar value={search} onChange={setSearch} placeholder="Search products…" />
        <select value={catFilter} onChange={e => setCatFilter(e.target.value)}
          className="bg-[#0A0A0A] border border-[#2A2015] focus:border-[#FF6B00] rounded-lg px-3 py-2 text-sm text-[#FFF8F0] focus:outline-none min-w-[150px]">
          <option value="ALL">All Categories</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
        </select>
      </div>

      {loading ? <div className="flex justify-center py-20"><Spinner /></div>
      : filtered.length === 0 ? <EmptyState icon="📦" title="No products found" action={<Btn onClick={openAdd}><Plus size={14}/>Add Product</Btn>} />
      : (
        <Card>
          <div className="divide-y divide-[#2A2015]">
            {filtered.map(p => (
              <div key={p.id} className="flex items-center gap-3 px-4 py-3 hover:bg-white/2 transition">
                {/* Image */}
                <div className="w-12 h-12 rounded-lg bg-[#0A0A0A] border border-[#2A2015] overflow-hidden flex-shrink-0 grid place-items-center">
                  {p.images?.[0] ? <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" /> : <span className="text-xl">🎆</span>}
                </div>
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-[#FFF8F0] truncate">{p.name}</p>
                    {p.isFeatured && <Star size={12} className="text-[#FFD700] flex-shrink-0" fill="currentColor" />}
                    {p.isOffer && <span className="text-[10px] bg-[#FF6B00]/20 text-[#FF6B00] px-1.5 py-0.5 rounded-full flex-shrink-0">{p.offerPercent}% OFF</span>}
                  </div>
                  <p className="text-xs text-[#8D6E63]">{categories.find(c => c.id === p.categoryId)?.name ?? p.categoryId} · {formatPrice(p.retailPrice)}</p>
                  <div className="mt-1"><StockBadge stockCount={p.stockCount} stock={p.stock} /></div>
                </div>
                {/* Actions */}
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button onClick={() => toggleProductField(p.id, 'isActive', !p.isActive)} title={p.isActive ? 'Deactivate' : 'Activate'}
                    className="w-7 h-7 rounded-lg grid place-items-center hover:bg-white/5 text-[#8D6E63] hover:text-[#FFF8F0] transition">
                    {p.isActive ? <Eye size={14}/> : <EyeOff size={14}/>}
                  </button>
                  <button onClick={() => openEdit(p)} className="w-7 h-7 rounded-lg grid place-items-center hover:bg-white/5 text-[#8D6E63] hover:text-[#FF6B00] transition">
                    <Pencil size={14}/>
                  </button>
                  <button onClick={() => { setEditProduct(p); setShowDelete(true) }}
                    className="w-7 h-7 rounded-lg grid place-items-center hover:bg-[#F44336]/10 text-[#8D6E63] hover:text-[#F44336] transition">
                    <Trash2 size={14}/>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Product Edit Modal */}
      <Modal open={showModal} onClose={() => setShowModal(false)} title={editProduct.id ? 'Edit Product' : 'Add Product'} wide>
        <div className="space-y-4">
          {/* Basic info */}
          <div className="grid grid-cols-2 gap-3">
            <Input label="Product Name *" value={editProduct.name || ''} onChange={e => set('name', e.target.value)} placeholder="e.g. Colour Sparkler" />
            <Input label="Tamil Name" value={editProduct.nameTamil || ''} onChange={e => set('nameTamil', e.target.value)} placeholder="தமிழ் பெயர்" />
          </div>
          <Select label="Category *" value={editProduct.categoryId || ''} onChange={e => set('categoryId', e.target.value)}>
            <option value="">Select category</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
          </Select>
          <Textarea label="Description" value={editProduct.description || ''} onChange={e => set('description', e.target.value)} rows={2} />

          {/* Pricing */}
          <div className="border-t border-[#2A2015] pt-4">
            <p className="text-xs text-[#8D6E63] uppercase tracking-wider font-medium mb-3">Pricing</p>
            <div className="grid grid-cols-3 gap-3">
              <Input label="Retail Price ₹" type="number" value={editProduct.retailPrice || ''} onChange={e => set('retailPrice', +e.target.value)} />
              <Input label="Wholesale Price ₹" type="number" value={editProduct.wholesalePrice || ''} onChange={e => set('wholesalePrice', +e.target.value)} />
              <Input label="Bulk Price ₹" type="number" value={editProduct.bulkPrice || ''} onChange={e => set('bulkPrice', +e.target.value)} />
            </div>
            <div className="grid grid-cols-3 gap-3 mt-3">
              <Input label="Retail Min Qty" type="number" value={editProduct.retailMinQty || 1} onChange={e => set('retailMinQty', +e.target.value)} />
              <Input label="Wholesale Min Qty" type="number" value={editProduct.wholesaleMinQty || 5} onChange={e => set('wholesaleMinQty', +e.target.value)} />
              <Input label="Bulk Min Qty" type="number" value={editProduct.bulkMinQty || 20} onChange={e => set('bulkMinQty', +e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-3 mt-3">
              <Input label="Unit" value={editProduct.unit || 'box'} onChange={e => set('unit', e.target.value)} placeholder="box / piece / roll" />
              <Input label="Stock Count" type="number" value={editProduct.stockCount || 0} onChange={e => { const v = +e.target.value; set('stockCount', v); set('stock', v > 0 ? 'available' : 'out_of_stock') }} />
            </div>
          </div>

          {/* Toggles */}
          <div className="border-t border-[#2A2015] pt-4 space-y-3">
            <Toggle label="Active" checked={!!editProduct.isActive} onChange={v => set('isActive', v)} subtitle="Show to customers" />
            <Toggle label="Featured" checked={!!editProduct.isFeatured} onChange={v => set('isFeatured', v)} subtitle="Show in featured section" />
            <Toggle label="On Offer" checked={!!editProduct.isOffer} onChange={v => set('isOffer', v)} />
            {editProduct.isOffer && <Input label="Offer %" type="number" value={editProduct.offerPercent || 0} onChange={e => set('offerPercent', +e.target.value)} />}
          </div>

          {/* Images */}
          <div className="border-t border-[#2A2015] pt-4">
            <p className="text-xs text-[#8D6E63] uppercase tracking-wider font-medium mb-3">Images</p>
            {(editProduct.images || []).length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {editProduct.images!.map((url, i) => (
                  <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden border border-[#2A2015]">
                    <img src={url} alt="" className="w-full h-full object-cover" />
                    <button onClick={() => set('images', editProduct.images!.filter((_, j) => j !== i))}
                      className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-black/70 grid place-items-center">
                      <X size={10} className="text-white" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <input value={newImageUrl} onChange={e => setNewImageUrl(e.target.value)} placeholder="Paste image URL"
                className="flex-1 bg-[#0A0A0A] border border-[#2A2015] focus:border-[#FF6B00] rounded-lg px-3 py-1.5 text-sm text-[#FFF8F0] placeholder:text-[#8D6E63] focus:outline-none" />
              <Btn variant="secondary" size="sm" onClick={() => { if (newImageUrl.trim()) { set('images', [...(editProduct.images||[]), newImageUrl.trim()]); setNewImageUrl('') } }}>Add URL</Btn>
              <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
              <Btn variant="secondary" size="sm" loading={uploading} onClick={() => fileRef.current?.click()}><Upload size={13}/>Upload</Btn>
            </div>
          </div>

          <div className="flex gap-3 pt-2 border-t border-[#2A2015]">
            <Btn variant="secondary" onClick={() => setShowModal(false)} className="flex-1">Cancel</Btn>
            <Btn onClick={handleSave} loading={saving} className="flex-1">Save Product</Btn>
          </div>
        </div>
      </Modal>

      <ConfirmDialog open={showDelete} onClose={() => setShowDelete(false)} onConfirm={handleDelete} danger
        title="Delete Product?" message={`Delete "${editProduct.name}"? This cannot be undone.`} />
    </AdminLayout>
  )
}
