'use client';

import React, { useState } from 'react';
import { CheckCircle, Clock, Package, User, MapPin } from 'lucide-react';
import { updateOrderStatus } from '@/actions/server/order';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/provider/ThemeProvider';

export default function AdminOrderList({ orders: initialOrders }) {
  const [orders, setOrders]     = useState(initialOrders);
  const [loadingId, setLoadingId] = useState(null);
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === 'night';

  const handleConfirm = async (orderId) => {
    setLoadingId(orderId);
    try {
      const result = await updateOrderStatus(orderId, 'confirmed');
      if (result.success) {
        Swal.fire({ icon: 'success', title: 'Order Confirmed!', text: 'The user and admin have been notified via email.', confirmButtonColor: '#10b981' });
        setOrders(orders.map(o => o._id === orderId ? { ...o, status: 'confirmed' } : o));
        router.refresh();
      } else {
        Swal.fire('Error', result.message, 'error');
      }
    } catch {
      Swal.fire('Error', 'Something went wrong', 'error');
    }
    setLoadingId(null);
  };

  /* ── Theme tokens ── */
  const heading  = isDark ? 'text-white'    : 'text-slate-900';
  const subText  = isDark ? 'text-slate-400' : 'text-slate-500';
  const muted    = isDark ? 'text-slate-500' : 'text-slate-400';
  const cardBg   = isDark ? 'bg-white/5 border-white/10 hover:bg-white/10'          : 'bg-white border-slate-200 hover:bg-slate-50 shadow-sm';
  const iconBg   = isDark ? 'bg-slate-800 text-slate-400'                            : 'bg-slate-100 text-slate-500';
  const infoBadge = isDark ? 'bg-slate-950/50 border-white/5'                        : 'bg-slate-100 border-slate-200';
  const borderT  = isDark ? 'border-white/5'   : 'border-slate-200';
  const itemBg   = isDark ? 'bg-slate-900/50 border-white/5' : 'bg-slate-100 border-slate-200';
  const itemImg  = isDark ? 'bg-slate-800 border-white/10'   : 'bg-slate-200 border-slate-200';

  if (orders.length === 0) {
    return (
      <div className="text-center py-20 opacity-60">
        <Package size={48} className={`mx-auto mb-4 ${muted}`} />
        <h3 className={`text-xl font-bold mb-2 ${heading}`}>No Orders Found</h3>
        <p className={subText}>There are currently no orders in the system.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div
          key={order._id}
          className={`transition-colors border rounded-2xl p-6 flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center ${cardBg}`}
        >
          {/* Order Details */}
          <div className="space-y-4 flex-1">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-inner ${iconBg}`}>
                <Package size={20} />
              </div>
              <div>
                <h3 className={`font-bold text-lg ${heading}`}>Order #{order._id.slice(-6).toUpperCase()}</h3>
                <p className={`text-xs font-bold uppercase tracking-widest ${muted}`}>
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 text-sm">
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${infoBadge}`}>
                <User size={14} className="text-blue-400" />
                <span className={`font-medium ${subText}`}>{order.customer?.name} ({order.customer?.email})</span>
              </div>
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${infoBadge}`}>
                <MapPin size={14} className="text-rose-400" />
                <span className={`font-medium ${subText}`}>{order.shipping?.city}, {order.shipping?.zip}</span>
              </div>
            </div>

            <p className={`text-sm ${subText}`}>
              <span className={`font-bold ${heading}`}>Payment Method:</span> {order.paymentMethod || 'Cash on Delivery'}
            </p>

            {order.items?.length > 0 && (
              <div className={`mt-4 pt-4 border-t space-y-2 ${borderT}`}>
                <p className={`text-[10px] font-black uppercase tracking-widest mb-2 ${muted}`}>
                  Purchased Items ({order.items.length})
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {order.items.map((item, idx) => (
                    <div key={idx} className={`flex items-center gap-3 p-2.5 rounded-xl border ${itemBg}`}>
                      {item.image && (
                        <div className={`w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 border ${itemImg}`}>
                          <img src={item.image} alt={item.title || 'Product'} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-bold truncate ${heading}`}>{item.title || 'Unknown Product'}</p>
                        <p className={`text-[10px] font-medium mt-0.5 ${subText}`}>Qty: {item.quantity || 1} × ${item.price || 0}</p>
                      </div>
                      <div className="text-right pr-2">
                        <p className="text-blue-500 text-xs font-black">${((item.quantity || 1) * (item.price || 0)).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Pricing & Actions */}
          <div className={`flex flex-col lg:items-end gap-4 w-full lg:w-auto border-t lg:border-t-0 pt-4 lg:pt-0 ${borderT}`}>
            <div className="text-left lg:text-right">
              <p className={`text-[10px] font-black uppercase tracking-[0.2em] mb-1 ${muted}`}>Total Amount</p>
              <p className="text-3xl font-black text-emerald-500">${order.total?.toLocaleString()}</p>
            </div>

            <div className="flex items-center gap-3 w-full lg:w-auto">
              <div className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest border flex items-center gap-2 flex-1 justify-center ${
                order.status === 'confirmed'
                  ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                  : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
              }`}>
                {order.status === 'confirmed' ? <CheckCircle size={14} /> : <Clock size={14} />}
                {order.status || 'pending'}
              </div>

              {(!order.status || order.status === 'pending') && (
                <button
                  onClick={() => handleConfirm(order._id)}
                  disabled={loadingId === order._id}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-xl text-sm font-bold transition-colors disabled:opacity-50 flex items-center gap-2 justify-center flex-1"
                >
                  {loadingId === order._id ? 'Confirming...' : 'Confirm Order'}
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
