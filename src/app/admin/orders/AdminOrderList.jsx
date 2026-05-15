'use client';
import React, { useState } from 'react';
import { CheckCircle, Clock, Package, User, MapPin } from 'lucide-react';
import { updateOrderStatus } from '@/actions/server/order';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';

export default function AdminOrderList({ orders: initialOrders }) {
  const [orders, setOrders] = useState(initialOrders);
  const [loadingId, setLoadingId] = useState(null);
  const router = useRouter();

  const handleConfirm = async (orderId) => {
    setLoadingId(orderId);
    try {
      const result = await updateOrderStatus(orderId, 'confirmed');
      if (result.success) {
        Swal.fire({
          icon: 'success',
          title: 'Order Confirmed!',
          text: 'The user and admin have been notified via email.',
          confirmButtonColor: '#10b981',
        });
        
        // Update local state to reflect change instantly
        setOrders(orders.map(o => o._id === orderId ? { ...o, status: 'confirmed' } : o));
        router.refresh();
      } else {
        Swal.fire('Error', result.message, 'error');
      }
    } catch (error) {
      Swal.fire('Error', 'Something went wrong', 'error');
    }
    setLoadingId(null);
  };

  if (orders.length === 0) {
    return (
      <div className="text-center py-20 opacity-60">
        <Package size={48} className="mx-auto text-slate-500 mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">No Orders Found</h3>
        <p className="text-slate-400">There are currently no orders in the system.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div key={order._id} className="bg-white/5 hover:bg-white/10 transition-colors border border-white/10 rounded-2xl p-6 flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center">
          
          {/* Order Details */}
          <div className="space-y-4 flex-1">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 shadow-inner">
                <Package size={20} />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">Order #{order._id.slice(-6).toUpperCase()}</h3>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4 text-sm text-slate-300">
              <div className="flex items-center gap-2 bg-slate-950/50 px-3 py-1.5 rounded-lg border border-white/5">
                <User size={14} className="text-blue-400" />
                <span className="font-medium">{order.customer?.name} ({order.customer?.email})</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-950/50 px-3 py-1.5 rounded-lg border border-white/5">
                <MapPin size={14} className="text-rose-400" />
                <span className="font-medium">{order.shipping?.city}, {order.shipping?.zip}</span>
              </div>
            </div>
            
            <p className="text-slate-400 text-sm">
              <span className="font-bold text-white">Payment Method:</span> {order.paymentMethod || 'Cash on Delivery'}
            </p>

            {/* Product Items Summary */}
            {order.items && order.items.length > 0 && (
              <div className="mt-4 pt-4 border-t border-white/5 space-y-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Purchased Items ({order.items.length})</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 bg-slate-900/50 p-2.5 rounded-xl border border-white/5">
                      {item.image && (
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-800 flex-shrink-0 border border-white/10">
                          <img src={item.image} alt={item.title || 'Product'} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-xs font-bold truncate">{item.title || 'Unknown Product'}</p>
                        <p className="text-slate-400 text-[10px] font-medium mt-0.5">Qty: {item.quantity || 1} × ${item.price || 0}</p>
                      </div>
                      <div className="text-right pr-2">
                        <p className="text-blue-400 text-xs font-black">${((item.quantity || 1) * (item.price || 0)).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Pricing & Actions */}
          <div className="flex flex-col lg:items-end gap-4 w-full lg:w-auto border-t lg:border-t-0 border-white/5 pt-4 lg:pt-0">
            <div className="text-left lg:text-right">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1">Total Amount</p>
              <p className="text-3xl font-black text-emerald-400">${order.total?.toLocaleString()}</p>
            </div>

            <div className="flex items-center gap-3 w-full lg:w-auto">
              <div className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest border flex items-center gap-2 flex-1 justify-center ${
                order.status === 'confirmed' 
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
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
