'use client'
import { useMemo } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { StatCard, Card, StatusBadge, Spinner } from '@/components/admin/AdminUI'
import { useAdminOrders, useAdminProducts, useAdminCategories, useAdminCombos, useDashboardStats } from '@/hooks/useAdmin'
import { formatPrice } from '@/lib/utils'
import { ShoppingBag, Package, Tag, Gift, TrendingUp, AlertTriangle, Clock, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  const { orders,     loading: lo } = useAdminOrders()
  const { products,   loading: lp } = useAdminProducts()
  const { categories, loading: lc } = useAdminCategories()
  const { combos,     loading: lcb } = useAdminCombos()

  const stats = useDashboardStats(products, orders, categories, combos)
  const loading = lo || lp || lc || lcb

  const recentOrders = useMemo(
    () => [...orders].sort((a, b) => b.timestamp - a.timestamp).slice(0, 8),
    [orders]
  )
  const lowStockProducts = useMemo(
    () => products.filter(p => p.stockCount > 0 && p.stockCount <= 10).slice(0, 5),
    [products]
  )

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <Spinner className="w-8 h-8" />
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-[#FFF8F0]">Dashboard</h1>
          <p className="text-sm text-[#8D6E63] mt-0.5">Welcome back! Here's what's happening.</p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard label="Total Orders"    value={stats.totalOrders}    icon={<ShoppingBag size={18}/>} color="#FF6B00" sub={`${stats.todayOrders} today`} />
          <StatCard label="Pending"         value={stats.pendingOrders}  icon={<Clock size={18}/>}        color="#FF9800" />
          <StatCard label="Total Revenue"   value={formatPrice(stats.totalRevenue)} icon={<TrendingUp size={18}/>} color="#4CAF50" sub={`${formatPrice(stats.todayRevenue)} today`} />
          <StatCard label="Low Stock"       value={stats.lowStockCount}  icon={<AlertTriangle size={18}/>} color="#F44336" />
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard label="Products"   value={stats.totalProducts}    icon={<Package size={18}/>} color="#9C27B0" sub={`${stats.activeProducts} active`} />
          <StatCard label="Categories" value={stats.totalCategories}  icon={<Tag size={18}/>}     color="#2196F3" />
          <StatCard label="Combos"     value={stats.totalCombos}      icon={<Gift size={18}/>}    color="#00BCD4" />
          <StatCard label="Confirmed"  value={stats.confirmedOrders}  icon={<CheckCircle2 size={18}/>} color="#4CAF50" />
        </div>

        {/* Order status breakdown */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {(['PENDING','CONTACTED','CONFIRMED','DISPATCHED','DELIVERED','CANCELLED'] as const).map(s => (
            <Link key={s} href={`/admin/orders?status=${s}`}>
              <div className="bg-[#13100C] border border-[#2A2015] rounded-xl p-3 text-center hover:border-[#FF6B00]/40 transition cursor-pointer">
                <p className="text-lg font-bold text-[#FFF8F0]">{orders.filter(o => o.status === s).length}</p>
                <p className="text-[10px] text-[#8D6E63] mt-0.5 uppercase tracking-wide">{s.slice(0,4)}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <Card>
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#2A2015]">
              <h2 className="font-semibold text-[#FFF8F0] text-sm">Recent Orders</h2>
              <Link href="/admin/orders" className="text-xs text-[#FF6B00] hover:underline">View all</Link>
            </div>
            <div className="divide-y divide-[#2A2015]">
              {recentOrders.length === 0 && (
                <p className="text-sm text-[#8D6E63] text-center py-8">No orders yet</p>
              )}
              {recentOrders.map(order => (
                <div key={order.id} className="flex items-center justify-between px-5 py-3 hover:bg-white/2 transition">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[#FFF8F0] truncate">{order.customerName || '—'}</p>
                    <p className="text-xs text-[#8D6E63]">{order.mobileNumber} · {formatPrice(order.totalAmount)}</p>
                  </div>
                  <StatusBadge status={order.status} />
                </div>
              ))}
            </div>
          </Card>

          {/* Low Stock */}
          <Card>
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#2A2015]">
              <h2 className="font-semibold text-[#FFF8F0] text-sm">Low Stock Alert</h2>
              <Link href="/admin/stock" className="text-xs text-[#FF6B00] hover:underline">Manage stock</Link>
            </div>
            <div className="divide-y divide-[#2A2015]">
              {lowStockProducts.length === 0 && (
                <p className="text-sm text-[#8D6E63] text-center py-8">All products well stocked ✓</p>
              )}
              {lowStockProducts.map(p => (
                <div key={p.id} className="flex items-center justify-between px-5 py-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[#FFF8F0] truncate">{p.name}</p>
                    <p className="text-xs text-[#8D6E63]">{p.categoryId}</p>
                  </div>
                  <span className="text-xs font-bold text-[#FF9800] bg-[#FF9800]/15 px-2 py-0.5 rounded-full">
                    {p.stockCount} left
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}
