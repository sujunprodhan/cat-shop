import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { redirect } from 'next/navigation';
import { dbConnect, Collection } from '@/lib/dbConnect';
import AdminOrderList from './AdminOrderList';

export default async function AdminOrdersPage() {
  const session = await getServerSession(authOptions);
  
  // Protect route - Only allow admins
  if (!session || session.role !== 'admin') {
    redirect('/dashboard');
  }

  const orderCollection = dbConnect(Collection.ORDERS);
  const allOrders = await orderCollection.find({}).sort({ createdAt: -1 }).toArray();

  // Convert MongoDB ObjectIds to strings so they can be passed to Client Components
  const serializedOrders = allOrders.map(order => ({
    ...order,
    _id: order._id.toString(),
  }));

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-[var(--page-heading,inherit)]">
              Admin <span className="text-blue-500">Orders Panel</span>
            </h1>
            <p className="text-slate-400 mt-2 font-medium">Manage and confirm pending orders from your customers.</p>
          </div>
          <div className="px-4 py-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 font-bold rounded-xl text-sm">
            Total Orders: {serializedOrders.length}
          </div>
        </div>

        <div className="backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 sm:p-10 shadow-2xl overflow-hidden bg-white/5">
          <AdminOrderList orders={serializedOrders} />
        </div>
      </div>
    </div>
  );
}
