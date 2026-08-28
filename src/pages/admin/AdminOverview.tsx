import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  ShoppingBag,
  Clock,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
  Package,
  Users,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { api } from '../../services/api';
import { Order, Product } from '../../types';
import { useSettings } from '../../context/SettingsContext';

interface AdminOverviewProps {
  onNavigateTab: (tab: string) => void;
}

export function AdminOverview({ onNavigateTab }: AdminOverviewProps) {
  const { settings } = useSettings();
  const [stats, setStats] = useState<any>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const [statsRes, ordersRes, productsRes] = await Promise.all([
        api.getAdminStats(),
        api.getAdminOrders(),
        api.getAdminProducts()
      ]);
      setStats(statsRes);
      setRecentOrders((ordersRes.orders || []).slice(0, 5));
      setLowStockProducts((productsRes.products || []).filter((p: Product) => p.stock <= 5).slice(0, 5));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-28 bg-neutral-900 rounded-2xl" />
          ))}
        </div>
        <div className="h-64 bg-neutral-900 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top Banner with Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-white uppercase tracking-wider">
            Studio Intelligence Overview
          </h1>
          <p className="text-xs text-neutral-400 font-mono">
            Real-time sales, order fulfillment, and inventory analytics
          </p>
        </div>
        <button
          onClick={fetchStats}
          className="flex items-center gap-2 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs rounded-lg font-mono"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-neutral-900 p-5 rounded-2xl border border-neutral-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Total Sales</span>
            <div className="p-2 bg-emerald-950 text-emerald-400 rounded-lg border border-emerald-800">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="font-mono text-2xl font-extrabold text-white">
            {settings.currencySymbol}
            {(stats?.totalRevenue || 0).toLocaleString()}
          </p>
          <p className="text-[11px] text-neutral-400 font-mono">
            {stats?.completedOrders || 0} Delivered / Completed orders
          </p>
        </div>

        {/* Total Orders */}
        <div className="bg-neutral-900 p-5 rounded-2xl border border-neutral-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Total Orders</span>
            <div className="p-2 bg-sky-950 text-sky-400 rounded-lg border border-sky-800">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <p className="font-mono text-2xl font-extrabold text-white">
            {stats?.totalOrders || 0}
          </p>
          <p className="text-[11px] text-neutral-400 font-mono">
            Across all Bangladesh districts
          </p>
        </div>

        {/* Pending Verification */}
        <div className="bg-neutral-900 p-5 rounded-2xl border border-neutral-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Pending Orders</span>
            <div className="p-2 bg-amber-950 text-amber-400 rounded-lg border border-amber-800">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="font-mono text-2xl font-extrabold text-amber-400">
            {stats?.pendingOrders || 0}
          </p>
          <button
            onClick={() => onNavigateTab('orders')}
            className="text-[11px] text-neutral-300 hover:text-white flex items-center gap-1 font-mono"
          >
            <span>Review & verify TrxIDs</span>
            <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>

        {/* Low Stock Warning */}
        <div className="bg-neutral-900 p-5 rounded-2xl border border-neutral-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Low Stock SKUs</span>
            <div className="p-2 bg-red-950 text-red-400 rounded-lg border border-red-800">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <p className="font-mono text-2xl font-extrabold text-red-400">
            {stats?.lowStockCount || 0}
          </p>
          <button
            onClick={() => onNavigateTab('inventory')}
            className="text-[11px] text-neutral-300 hover:text-white flex items-center gap-1 font-mono"
          >
            <span>Manage inventory</span>
            <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Grid: Recent Orders & Low Stock alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Orders (8 cols) */}
        <div className="lg:col-span-8 bg-neutral-900 p-6 rounded-2xl border border-neutral-800 space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
            <h3 className="font-serif text-sm font-bold text-white uppercase tracking-wider">
              Recent Customer Orders
            </h3>
            <button
              onClick={() => onNavigateTab('orders')}
              className="text-xs text-neutral-400 hover:text-white font-mono flex items-center gap-1"
            >
              <span>View all orders</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-neutral-800 text-neutral-400 font-mono uppercase">
                  <th className="py-2.5 px-3">Order #</th>
                  <th className="py-2.5 px-3">Customer</th>
                  <th className="py-2.5 px-3">Payment</th>
                  <th className="py-2.5 px-3">Amount</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60 font-mono">
                {recentOrders.map((ord) => {
                  const statusStr = (ord.orderStatus || 'Pending').toLowerCase();
                  const totalAmt = ord.total || ord.subtotal || 0;
                  return (
                    <tr key={ord.id} className="hover:bg-neutral-800/40">
                      <td className="py-3 px-3 font-bold text-white">{ord.orderNumber}</td>
                      <td className="py-3 px-3 font-sans">
                        <p className="text-white font-medium">{ord.customerName}</p>
                        <p className="text-[10px] text-neutral-400">{ord.district}</p>
                      </td>
                      <td className="py-3 px-3">
                        <span className="uppercase text-[11px] font-semibold text-neutral-300">
                          {ord.paymentMethod}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-bold text-white">
                        {settings.currencySymbol}{totalAmt.toLocaleString()}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                            statusStr === 'delivered'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : statusStr === 'pending'
                              ? 'bg-amber-950 text-amber-300 border border-amber-800'
                              : 'bg-neutral-800 text-neutral-300'
                          }`}
                        >
                          {ord.orderStatus || 'Pending'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alerts (4 cols) */}
        <div className="lg:col-span-4 bg-neutral-900 p-6 rounded-2xl border border-neutral-800 space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
            <h3 className="font-serif text-sm font-bold text-white uppercase tracking-wider">
              Stock Warnings
            </h3>
            <button
              onClick={() => onNavigateTab('inventory')}
              className="text-xs text-neutral-400 hover:text-white font-mono"
            >
              Update
            </button>
          </div>

          <div className="space-y-3">
            {lowStockProducts.length === 0 ? (
              <p className="text-xs text-neutral-500 italic py-4">All garment SKU stocks are healthy.</p>
            ) : (
              lowStockProducts.map((p) => (
                <div key={p.id} className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 flex items-center justify-between gap-3 text-xs">
                  <div className="min-w-0">
                    <p className="font-medium text-white truncate">{p.name}</p>
                    <p className="text-[10px] text-neutral-400 font-mono">SKU: {p.sku}</p>
                  </div>
                  <span className="px-2 py-1 bg-red-950 text-red-400 font-mono font-bold rounded border border-red-800 shrink-0">
                    {p.stock} left
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
