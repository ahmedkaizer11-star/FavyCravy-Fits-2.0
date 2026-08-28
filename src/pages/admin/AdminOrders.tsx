import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Eye,
  CheckCircle2,
  Clock,
  Truck,
  Printer,
  X,
  Phone,
  MessageCircle,
  AlertCircle
} from 'lucide-react';
import { api } from '../../services/api';
import { Order } from '../../types';
import { useSettings } from '../../context/SettingsContext';
import { useToast } from '../../context/ToastContext';
import { handleImageFallback, DEFAULT_PRODUCT_IMAGE } from '../../utils/imageFallback';

export function AdminOrders() {
  const { settings } = useSettings();
  const { showToast } = useToast();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');

  // Order Details Modal
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.getAdminOrders({
        status: statusFilter !== 'all' ? statusFilter : undefined,
        paymentMethod: paymentFilter !== 'all' ? paymentFilter : undefined,
        search: search.trim() || undefined
      });
      setOrders(res.orders || []);
    } catch (err) {
      console.error(err);
      showToast('Failed to load orders', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter, paymentFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrders();
  };

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      await api.updateOrderStatus(orderId, { status: newStatus as any });
      showToast(`Order status set to ${newStatus}`, 'success');
      setOrders(orders.map((o) => (o.id === orderId ? { ...o, orderStatus: newStatus as any } : o)));
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, orderStatus: newStatus as any });
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to update order status', 'error');
    }
  };

  const handleVerifyPayment = async (orderId: string) => {
    try {
      await api.updateOrderStatus(orderId, { paymentStatus: 'verified', status: 'Confirmed' });
      showToast('Payment verified! Order marked as Confirmed.', 'success');
      setOrders(
        orders.map((o) =>
          o.id === orderId ? { ...o, paymentStatus: 'verified', orderStatus: 'Confirmed' } : o
        )
      );
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, paymentStatus: 'verified', orderStatus: 'Confirmed' });
      }
    } catch (err: any) {
      showToast('Failed to verify payment', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-white uppercase tracking-wider">
            Order Fulfillment & Ledger
          </h1>
          <p className="text-xs text-neutral-400 font-mono">
            {orders.length} Customer orders recorded
          </p>
        </div>
      </div>

      {/* Search & Filters Toolbar */}
      <div className="bg-neutral-900 p-4 rounded-2xl border border-neutral-800 space-y-3">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-3 text-neutral-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Order # (e.g. FCF-2026-XXXX) or Customer Phone..."
              className="w-full bg-neutral-800 border border-neutral-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-white text-neutral-950 font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-neutral-200"
          >
            Search
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-3 text-xs pt-2 border-t border-neutral-800">
          <div className="flex items-center gap-2">
            <span className="font-mono text-neutral-400 uppercase text-[10px]">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-neutral-800 text-white rounded-lg px-2.5 py-1.5 border border-neutral-700 font-mono text-xs"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="processing">Processing</option>
              <option value="packed">Packed</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-mono text-neutral-400 uppercase text-[10px]">Payment:</span>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="bg-neutral-800 text-white rounded-lg px-2.5 py-1.5 border border-neutral-700 font-mono text-xs"
            >
              <option value="all">All Payment Methods</option>
              <option value="bkash">bKash Personal</option>
              <option value="nagad">Nagad Personal</option>
              <option value="cod">Cash on Delivery (COD)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-neutral-900 rounded-2xl border border-neutral-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-neutral-800 text-neutral-400 font-mono uppercase bg-neutral-950/60">
                <th className="py-3 px-4">Order # & Date</th>
                <th className="py-3 px-4">Customer & District</th>
                <th className="py-3 px-4">Payment & TrxID</th>
                <th className="py-3 px-4">Total</th>
                <th className="py-3 px-4">Status & Action</th>
                <th className="py-3 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60">
              {orders.map((ord) => {
                const isPendingVerification =
                  (ord.paymentMethod === 'bkash' || ord.paymentMethod === 'nagad') &&
                  ord.paymentStatus !== 'verified';
                const statusStr = (ord.orderStatus || 'Pending').toLowerCase();
                const totalAmount = ord.total || ord.subtotal || 0;

                return (
                  <tr key={ord.id} className="hover:bg-neutral-800/40 transition-colors">
                    <td className="py-3 px-4 font-mono">
                      <p className="font-bold text-white text-sm">{ord.orderNumber}</p>
                      <p className="text-[10px] text-neutral-400">
                        {new Date(ord.createdAt).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </td>

                    <td className="py-3 px-4">
                      <p className="font-semibold text-white">{ord.customerName}</p>
                      <p className="text-[11px] text-neutral-400 font-mono">{ord.phone}</p>
                      <p className="text-[10px] text-neutral-500">{ord.district}</p>
                    </td>

                    <td className="py-3 px-4 font-mono">
                      <div className="flex items-center gap-1.5">
                        <span className="uppercase font-bold text-white">{ord.paymentMethod}</span>
                        <span
                          className={`px-1.5 py-0.5 rounded text-[9px] uppercase font-bold ${
                            ord.paymentStatus === 'verified'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : 'bg-amber-950 text-amber-300 border border-amber-800'
                          }`}
                        >
                          {ord.paymentStatus}
                        </span>
                      </div>
                      {ord.transactionId && (
                        <p className="text-[10px] text-emerald-400 mt-0.5 font-bold">
                          TrxID: {ord.transactionId}
                        </p>
                      )}
                      {ord.senderPhone && (
                        <p className="text-[10px] text-neutral-400">Sender: {ord.senderPhone}</p>
                      )}

                      {/* Quick Verify button */}
                      {isPendingVerification && (
                        <button
                          onClick={() => handleVerifyPayment(ord.id)}
                          className="mt-1 px-2 py-0.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded text-[10px] font-bold"
                        >
                          Verify & Confirm
                        </button>
                      )}
                    </td>

                    <td className="py-3 px-4 font-mono font-bold text-white">
                      {settings.currencySymbol}
                      {totalAmount.toLocaleString()}
                    </td>

                    <td className="py-3 px-4">
                      <select
                        value={ord.orderStatus || 'Pending'}
                        onChange={(e) => handleUpdateStatus(ord.id, e.target.value)}
                        className={`text-xs font-mono font-bold px-2 py-1 rounded-lg border focus:outline-none ${
                          statusStr === 'delivered'
                            ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                            : statusStr === 'cancelled'
                            ? 'bg-red-950 text-red-400 border-red-800'
                            : statusStr === 'shipped'
                            ? 'bg-sky-950 text-sky-400 border-sky-800'
                            : 'bg-neutral-800 text-neutral-200 border-neutral-700'
                        }`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Processing">Processing</option>
                        <option value="Packed">Packed</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedOrder(ord)}
                        className="p-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition-colors"
                        title="View Full Invoice & Items"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Invoice Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-xs" onClick={() => setSelectedOrder(null)} />

          <div className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 z-10 text-neutral-100 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase text-neutral-400">Order Invoice</span>
                <h3 className="font-mono text-xl font-bold text-white tracking-wider">
                  {selectedOrder.orderNumber}
                </h3>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-neutral-950 p-4 rounded-xl border border-neutral-800">
              <div className="space-y-1">
                <p className="font-bold text-white uppercase font-sans">Customer</p>
                <p className="text-neutral-300 font-medium">{selectedOrder.customerName}</p>
                <p className="text-neutral-400 font-mono">{selectedOrder.phone}</p>
                {selectedOrder.email && <p className="text-neutral-400">{selectedOrder.email}</p>}
              </div>

              <div className="space-y-1">
                <p className="font-bold text-white uppercase font-sans">Delivery Address</p>
                <p className="text-neutral-300">{selectedOrder.address}</p>
                <p className="text-neutral-400">
                  {selectedOrder.thanaArea ? `${selectedOrder.thanaArea}, ` : ''}
                  {selectedOrder.district}, Bangladesh
                </p>
                {selectedOrder.customerNotes && (
                  <p className="text-amber-400 text-[11px] pt-1">Note: "{selectedOrder.customerNotes}"</p>
                )}
              </div>
            </div>

            {/* Items List */}
            <div className="space-y-3">
              <h4 className="font-bold text-white uppercase tracking-wider text-xs font-sans">
                Purchased Menswear
              </h4>
              <div className="divide-y divide-neutral-800/80 border border-neutral-800 rounded-xl overflow-hidden">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="p-3 bg-neutral-950/40 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-10 h-12 object-cover object-top rounded bg-neutral-800"
                          referrerPolicy="no-referrer"
                          onError={(e) => handleImageFallback(e, DEFAULT_PRODUCT_IMAGE)}
                        />
                      )}
                      <div>
                        <p className="font-semibold text-white">{item.name}</p>
                        <p className="text-[10px] text-neutral-400 font-mono">
                          Size: {item.selectedSize} • Color: {item.selectedColor} • Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-white">
                      {settings.currencySymbol}
                      {(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Financials */}
            <div className="flex justify-between items-baseline pt-4 border-t border-neutral-800 text-sm">
              <span className="font-bold text-white">Total Order Value:</span>
              <span className="font-mono text-xl font-bold text-white">
                {settings.currencySymbol}
                {(selectedOrder.total || selectedOrder.subtotal || 0).toLocaleString()}
              </span>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-4 border-t border-neutral-800">
              <a
                href={`https://wa.me/${(selectedOrder.phone || '').replace(/^0/, '880').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${selectedOrder.customerName}, this is Favy Cravy Fits 2.0 regarding your Order #${selectedOrder.orderNumber}.`)}`}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold uppercase flex items-center gap-2"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Contact Customer on WhatsApp</span>
              </a>

              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-xs font-medium flex items-center gap-2"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Invoice</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
