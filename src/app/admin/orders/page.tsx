'use client'
import { useState, useMemo, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import AdminLayout from '@/components/admin/AdminLayout'
import {
  PageHeader, Btn, StatusBadge, SearchBar, Modal, ConfirmDialog,
  Input, Textarea, Select, EmptyState, Spinner, Card, StatCard
} from '@/components/admin/AdminUI'
import { useAdminOrders, useAdminProducts, updateOrderStatus, deleteOrder, placeManualOrder } from '@/hooks/useAdmin'
import { ORDER_STATUS_LABELS, OrderStatus, Order, OrderItem } from '@/types'
import { formatPrice } from '@/lib/utils'
import { Plus, Trash2, ChevronRight, Phone, MapPin, Package, Clock } from 'lucide-react'
import toast from 'react-hot-toast'

function OrdersContent() {
  const searchParams                    = useSearchParams()
  const initStatus                      = searchParams.get('status') as OrderStatus | null
  const { orders, loading }             = useAdminOrders()
  const { products }                    = useAdminProducts()
  const [search,       setSearch]       = useState('')
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'ALL'>(initStatus ?? 'ALL')
  const [selectedOrder, setSelected]    = useState<Order | null>(null)
  const [showDetail,   setShowDetail]   = useState(false)
  const [showManual,   setShowManual]   = useState(false)
  const [showDelete,   setShowDelete]   = useState(false)
  const [updating,     setUpdating]     = useState(false)

  // Detail form state
  const [newStatus,   setNewStatus]    = useState<OrderStatus>('PENDING')
  const [adminNotes,  setAdminNotes]   = useState('')
  const [tracking,    setTracking]     = useState('')
  const [estDelivery, setEstDelivery]  = useState('')

  // Manual order state
  const [manualName,    setManualName]    = useState('')
  const [manualMobile,  setManualMobile]  = useState('')
  const [manualArea,    setManualArea]    = useState('')
  const [manualNotes,   setManualNotes]   = useState('')
  const [manualType,    setManualType]    = useState('RETAIL')
  const [manualItems,   setManualItems]   = useState<OrderItem[]>([])
  const [productSearch, setProductSearch] = useState('')
  const [submitting,    setSubmitting]    = useState(false)

  const filtered = useMemo(() => {
    let list = orders
    if (statusFilter !== 'ALL') list = list.filter(o => o.status === statusFilter)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(o =>
        o.customerName.toLowerCase().includes(q) ||
        o.mobileNumber.includes(q) ||
        o.id.toLowerCase().includes(q)
      )
    }
    return list
  }, [orders, statusFilter, search])

  const openDetail = (order: Order) => {
    setSelected(order)
    setNewStatus(order.status)
    setAdminNotes(order.adminNotes || '')
    setTracking(order.trackingInfo || '')
    setEstDelivery(order.estimatedDelivery || '')
    setShowDetail(true)
  }

  const handleUpdate = async () => {
    if (!selectedOrder) return
    setUpdating(true)
    try {
      await updateOrderStatus(selectedOrder.id, newStatus, adminNotes, tracking, estDelivery)
      toast.success('Order updated!')
      setShowDetail(false)
    } catch { toast.error('Update failed') }
    setUpdating(false)
  }

  const handleDelete = async () => {
    if (!selectedOrder) return
    await deleteOrder(selectedOrder.id)
    toast.success('Order deleted')
    setShowDetail(false)
  }

  const handleManualOrder = async () => {
    if (!manualName || !manualMobile || manualItems.length === 0) {
      toast.error('Fill name, mobile and add at least one product')
      return
    }
    setSubmitting(true)
    try {
      const total = manualItems.reduce((s, i) => s + i.price * i.quantity, 0)
      await placeManualOrder({
        customerName: manualName, mobileNumber: manualMobile,
        deliveryArea: manualArea, notes: manualNotes,
        orderType: manualType, items: manualItems,
        totalAmount: total, status: 'CONFIRMED',
        timestamp: Date.now(), updatedAt: Date.now(),
        adminNotes: 'Manual order by admin', trackingInfo: '', estimatedDelivery: '',
      } as any)
      toast.success('Manual order placed!')
      setShowManual(false)
      setManualName(''); setManualMobile(''); setManualArea('')
      setManualNotes(''); setManualItems([])
    } catch { toast.error('Failed to place order') }
    setSubmitting(false)
  }

  const addManualItem = (product: { id: string; name: string; retailPrice: number; unit: string }) => {
    const price = manualType === 'BULK' ? (products.find(p => p.id === product.id)?.bulkPrice ?? product.retailPrice)
               : manualType === 'WHOLESALE' ? (products.find(p => p.id === product.id)?.wholesalePrice ?? product.retailPrice)
               : product.retailPrice
    setManualItems(prev => {
      const exists = prev.find(i => i.productId === product.id)
      if (exists) return prev.map(i => i.productId === product.id ? { ...i, quantity: i.quantity + 1 } : i)
      return [...prev, { productId: product.id, productName: product.name, productNameTamil: '', variantDesc: '', categoryId: '', quantity: 1, price, tier: manualType, isCombo: false }]
    })
    setProductSearch('')
  }

  const filteredProductsForManual = products.filter(p =>
    p.isActive && productSearch.trim() &&
    p.name.toLowerCase().includes(productSearch.toLowerCase())
  ).slice(0, 6)

  return (
    <AdminLayout>
      <PageHeader
        title="Orders"
        subtitle={`${filtered.length} of ${orders.length} orders`}
        action={<Btn onClick={() => setShowManual(true)}><Plus size={15}/>New Order</Btn>}
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <SearchBar value={search} onChange={setSearch} placeholder="Search by name, mobile, ID…" />
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value as any)}
          className="bg-[#0A0A0A] border border-[#2A2015] focus:border-[#FF6B00] rounded-lg px-3 py-2 text-sm text-[#FFF8F0] focus:outline-none min-w-[140px]"
        >
          <option value="ALL">All Status</option>
          {Object.entries(ORDER_STATUS_LABELS).map(([k, v]) => (
            <option key={k} value={k}>{v.en}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner /></div>
      ) : filtered.length === 0 ? (
        <EmptyState icon="📦" title="No orders found" subtitle="Try changing your filters" />
      ) : (
        <Card>
          <div className="divide-y divide-[#2A2015]">
            {filtered.map(order => (
              <div key={order.id}
                className="flex items-center gap-3 px-4 py-3.5 hover:bg-white/2 cursor-pointer transition"
                onClick={() => openDetail(order)}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-sm font-semibold text-[#FFF8F0] truncate">{order.customerName || '—'}</p>
                    <span className="text-xs text-[#8D6E63] hidden sm:block">#{order.id.slice(-6).toUpperCase()}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-[#8D6E63]">
                    <span className="flex items-center gap-1"><Phone size={10}/>{order.mobileNumber}</span>
                    {order.deliveryArea && <span className="flex items-center gap-1 hidden sm:flex"><MapPin size={10}/>{order.deliveryArea}</span>}
                    <span>{order.items?.length ?? 0} items</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-bold text-[#FF6B00]">{formatPrice(order.totalAmount)}</p>
                    <p className="text-xs text-[#8D6E63]">{order.orderType}</p>
                  </div>
                  <StatusBadge status={order.status} />
                  <ChevronRight size={16} className="text-[#8D6E63]" />
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Order Detail Modal */}
      <Modal open={showDetail} onClose={() => setShowDetail(false)} title="Order Detail" wide>
        {selectedOrder && (
          <div className="space-y-5">
            {/* Customer info */}
            <div className="bg-[#0A0A0A] rounded-xl p-4 space-y-2">
              <p className="text-xs text-[#8D6E63] uppercase tracking-wider font-medium mb-3">Customer</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><span className="text-[#8D6E63]">Name: </span><span className="text-[#FFF8F0] font-medium">{selectedOrder.customerName || '—'}</span></div>
                <div><span className="text-[#8D6E63]">Mobile: </span><span className="text-[#FFF8F0] font-medium">{selectedOrder.mobileNumber}</span></div>
                <div><span className="text-[#8D6E63]">Area: </span><span className="text-[#FFF8F0]">{selectedOrder.deliveryArea || '—'}</span></div>
                <div><span className="text-[#8D6E63]">Type: </span><span className="text-[#FFF8F0]">{selectedOrder.orderType}</span></div>
              </div>
              {selectedOrder.notes && <p className="text-xs text-[#8D6E63] mt-2 pt-2 border-t border-[#2A2015]">Note: {selectedOrder.notes}</p>}
            </div>

            {/* Items */}
            <div>
              <p className="text-xs text-[#8D6E63] uppercase tracking-wider font-medium mb-2">Items ({selectedOrder.items?.length})</p>
              <div className="space-y-1.5">
                {selectedOrder.items?.map((item, i) => (
                  <div key={i} className="flex items-center justify-between bg-[#0A0A0A] rounded-lg px-3 py-2">
                    <div>
                      <p className="text-sm text-[#FFF8F0] font-medium">{item.productName}</p>
                      {item.variantDesc && <p className="text-xs text-[#8D6E63]">{item.variantDesc}</p>}
                      <p className="text-xs text-[#8D6E63]">{item.tier} · ×{item.quantity}</p>
                    </div>
                    <p className="text-sm font-bold text-[#FF6B00]">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center mt-3 pt-3 border-t border-[#2A2015]">
                <p className="text-sm font-semibold text-[#FFF8F0]">Total</p>
                <p className="text-lg font-bold text-[#FF6B00]">{formatPrice(selectedOrder.totalAmount)}</p>
              </div>
            </div>

            {/* Update status */}
            <div className="border-t border-[#2A2015] pt-4 space-y-3">
              <p className="text-xs text-[#8D6E63] uppercase tracking-wider font-medium">Update Status</p>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                {(Object.keys(ORDER_STATUS_LABELS) as OrderStatus[]).map(s => (
                  <button key={s}
                    onClick={() => setNewStatus(s)}
                    className={`text-xs font-medium py-1.5 rounded-lg border transition ${
                      newStatus === s
                        ? 'border-[#FF6B00] bg-[#FF6B00]/15 text-[#FF6B00]'
                        : 'border-[#2A2015] text-[#8D6E63] hover:border-[#FF6B00]/40'
                    }`}
                  >
                    {ORDER_STATUS_LABELS[s].en}
                  </button>
                ))}
              </div>
              <Input label="Admin Notes" value={adminNotes} onChange={e => setAdminNotes(e.target.value)} placeholder="Internal notes…" />
              <div className="grid grid-cols-2 gap-3">
                <Input label="Tracking Info" value={tracking} onChange={e => setTracking(e.target.value)} placeholder="Transport / tracking no." />
                <Input label="Est. Delivery" value={estDelivery} onChange={e => setEstDelivery(e.target.value)} placeholder="e.g. 2-3 days" />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Btn variant="danger" onClick={() => { setShowDelete(true) }} className="flex-shrink-0">
                <Trash2 size={14} />
              </Btn>
              <Btn variant="secondary" onClick={() => setShowDetail(false)} className="flex-1">Cancel</Btn>
              <Btn onClick={handleUpdate} loading={updating} className="flex-1">Update Order</Btn>
            </div>
          </div>
        )}
      </Modal>

      {/* Manual Order Modal */}
      <Modal open={showManual} onClose={() => setShowManual(false)} title="New Manual Order" wide>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input label="Customer Name *" value={manualName} onChange={e => setManualName(e.target.value)} placeholder="Full name" />
            <Input label="Mobile Number *" value={manualMobile} onChange={e => setManualMobile(e.target.value)} placeholder="10-digit number" />
          </div>
          <Input label="Delivery Area" value={manualArea} onChange={e => setManualArea(e.target.value)} placeholder="City / area" />
          <Textarea label="Notes" value={manualNotes} onChange={e => setManualNotes(e.target.value)} placeholder="Any special instructions" rows={2} />

          <div>
            <label className="block text-xs font-medium text-[#BCAAA4] mb-1">Order Type</label>
            <div className="flex gap-2">
              {['RETAIL','WHOLESALE','BULK'].map(t => (
                <button key={t} onClick={() => setManualType(t)}
                  className={`flex-1 text-xs font-medium py-2 rounded-lg border transition ${
                    manualType === t ? 'border-[#FF6B00] bg-[#FF6B00]/15 text-[#FF6B00]' : 'border-[#2A2015] text-[#8D6E63]'
                  }`}
                >{t}</button>
              ))}
            </div>
          </div>

          {/* Items */}
          {manualItems.length > 0 && (
            <div className="space-y-1.5">
              {manualItems.map((item, i) => (
                <div key={i} className="flex items-center justify-between bg-[#0A0A0A] rounded-lg px-3 py-2">
                  <div className="flex-1">
                    <p className="text-sm text-[#FFF8F0]">{item.productName}</p>
                    <p className="text-xs text-[#8D6E63]">{formatPrice(item.price)} × {item.quantity} = {formatPrice(item.price * item.quantity)}</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => setManualItems(p => p.map((it, j) => j === i ? { ...it, quantity: Math.max(1, it.quantity - 1) } : it))}
                      className="w-6 h-6 rounded-full bg-[#2A2015] text-[#FFF8F0] text-xs grid place-items-center hover:bg-[#FF6B00]/20">−</button>
                    <span className="text-xs text-[#FFF8F0] w-5 text-center">{item.quantity}</span>
                    <button onClick={() => setManualItems(p => p.map((it, j) => j === i ? { ...it, quantity: it.quantity + 1 } : it))}
                      className="w-6 h-6 rounded-full bg-[#2A2015] text-[#FFF8F0] text-xs grid place-items-center hover:bg-[#FF6B00]/20">+</button>
                    <button onClick={() => setManualItems(p => p.filter((_, j) => j !== i))} className="w-6 h-6 rounded-full hover:bg-[#F44336]/20 text-[#F44336] grid place-items-center ml-1">×</button>
                  </div>
                </div>
              ))}
              <div className="flex justify-between text-sm font-bold pt-1">
                <span className="text-[#8D6E63]">Total</span>
                <span className="text-[#FF6B00]">{formatPrice(manualItems.reduce((s, i) => s + i.price * i.quantity, 0))}</span>
              </div>
            </div>
          )}

          {/* Product search */}
          <div>
            <Input label="Add Product" value={productSearch} onChange={e => setProductSearch(e.target.value)} placeholder="Search products…" />
            {filteredProductsForManual.length > 0 && (
              <div className="mt-1.5 space-y-1">
                {filteredProductsForManual.map(p => (
                  <button key={p.id} onClick={() => addManualItem(p)}
                    className="w-full flex items-center justify-between bg-[#0A0A0A] border border-[#2A2015] hover:border-[#FF6B00]/40 rounded-lg px-3 py-2 transition text-left">
                    <span className="text-sm text-[#FFF8F0]">{p.name}</span>
                    <span className="text-xs text-[#FF6B00]">{formatPrice(p.retailPrice)}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-2 border-t border-[#2A2015]">
            <Btn variant="secondary" onClick={() => setShowManual(false)} className="flex-1">Cancel</Btn>
            <Btn onClick={handleManualOrder} loading={submitting} className="flex-1">Place Order</Btn>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={showDelete} onClose={() => setShowDelete(false)}
        onConfirm={handleDelete} danger
        title="Delete Order?"
        message={`Delete order #${selectedOrder?.id.slice(-6).toUpperCase()}? This cannot be undone.`}
      />
    </AdminLayout>
  )
}

export default function OrdersPage() {
  return <Suspense fallback={<AdminLayout><div className="flex justify-center py-20"><Spinner /></div></AdminLayout>}><OrdersContent /></Suspense>
}
