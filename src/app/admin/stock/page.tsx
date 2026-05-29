'use client'
import { useState, useMemo } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { PageHeader, SearchBar, EmptyState, Spinner, Card, StockBadge } from '@/components/admin/AdminUI'
import { useAdminProducts, updateStock } from '@/hooks/useAdmin'
import { AlertTriangle, Check, X } from 'lucide-react'
import toast from 'react-hot-toast'

export default function StockPage() {
  const { products, loading } = useAdminProducts()
  const [search, setSearch] = useState('')
  const [editing, setEditing] = useState<Record<string, string>>({})

  const sorted = useMemo(() => {
    let list = products
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(p => p.name.toLowerCase().includes(q) || p.nameTamil?.includes(q))
    }
    return [...list].sort((a, b) => {
      const aOut = a.stockCount === 0 || a.stock === 'out_of_stock'
      const bOut = b.stockCount === 0 || b.stock === 'out_of_stock'
      const aLow = a.stockCount > 0 && a.stockCount <= 10
      const bLow = b.stockCount > 0 && b.stockCount <= 10
      if (aOut && !bOut) return -1
      if (!aOut && bOut) return 1
      if (aLow && !bLow) return -1
      if (!aLow && bLow) return 1
      return a.name.localeCompare(b.name)
    })
  }, [products, search])

  const lowCount = products.filter(p => p.stockCount > 0 && p.stockCount <= 10).length
  const outCount = products.filter(p => p.stockCount === 0 || p.stock === 'out_of_stock').length

  const handleSave = async (id: string) => {
    const val = parseInt(editing[id] ?? '')
    if (isNaN(val) || val < 0) { toast.error('Enter valid stock count'); return }
    try {
      await updateStock(id, val)
      toast.success('Stock updated!')
      setEditing(p => { const n = { ...p }; delete n[id]; return n })
    } catch { toast.error('Update failed') }
  }

  return (
    <AdminLayout>
      <PageHeader title="Stock Management" subtitle={`${products.length} products`} />

      {(outCount > 0 || lowCount > 0) && (
        <div className="flex gap-3 mb-5 flex-wrap">
          {outCount > 0 && (
            <div className="flex items-center gap-2 bg-[#F44336]/10 border border-[#F44336]/25 rounded-xl px-4 py-2.5">
              <AlertTriangle size={15} className="text-[#F44336]" />
              <span className="text-sm font-semibold text-[#F44336]">{outCount} out of stock</span>
            </div>
          )}
          {lowCount > 0 && (
            <div className="flex items-center gap-2 bg-[#FF9800]/10 border border-[#FF9800]/25 rounded-xl px-4 py-2.5">
              <AlertTriangle size={15} className="text-[#FF9800]" />
              <span className="text-sm font-semibold text-[#FF9800]">{lowCount} low stock</span>
            </div>
          )}
        </div>
      )}

      <div className="mb-5">
        <SearchBar value={search} onChange={setSearch} placeholder="Search products…" />
      </div>

      {loading ? <div className="flex justify-center py-20"><Spinner /></div>
      : sorted.length === 0 ? <EmptyState icon="📦" title="No products found" />
      : (
        <Card>
          <div className="divide-y divide-[#2A2015]">
            {sorted.map(p => {
              const isEditing = editing[p.id] !== undefined
              return (
                <div key={p.id} className="flex items-center gap-3 px-4 py-3 hover:bg-white/2 transition">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#FFF8F0] truncate">{p.name}</p>
                    {p.nameTamil && <p className="text-xs text-[#8D6E63]">{p.nameTamil}</p>}
                    <div className="mt-1"><StockBadge stockCount={p.stockCount} stock={p.stock} /></div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {isEditing ? (
                      <>
                        <input
                          type="number" min={0}
                          value={editing[p.id]}
                          onChange={e => setEditing(prev => ({ ...prev, [p.id]: e.target.value }))}
                          className="w-20 bg-[#0A0A0A] border border-[#FF6B00] rounded-lg px-2 py-1.5 text-sm text-[#FFF8F0] text-center focus:outline-none"
                          autoFocus
                        />
                        <button onClick={() => handleSave(p.id)} className="w-7 h-7 rounded-lg grid place-items-center bg-[#4CAF50]/20 text-[#4CAF50] hover:bg-[#4CAF50]/30 transition">
                          <Check size={14}/>
                        </button>
                        <button onClick={() => setEditing(prev => { const n = { ...prev }; delete n[p.id]; return n })}
                          className="w-7 h-7 rounded-lg grid place-items-center bg-[#F44336]/10 text-[#F44336] hover:bg-[#F44336]/20 transition">
                          <X size={14}/>
                        </button>
                      </>
                    ) : (
                      <>
                        <span className={`text-lg font-bold ${
                          p.stockCount === 0 ? 'text-[#F44336]' :
                          p.stockCount <= 10 ? 'text-[#FF9800]' : 'text-[#FFF8F0]'
                        }`}>{p.stockCount}</span>
                        <span className="text-xs text-[#8D6E63]">units</span>
                        <button
                          onClick={() => setEditing(prev => ({ ...prev, [p.id]: String(p.stockCount) }))}
                          className="text-xs text-[#FF6B00] hover:underline ml-1">
                          Edit
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      )}
    </AdminLayout>
  )
}
