import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { redirect } from 'next/navigation';
import { dbConnect, Collection } from '@/lib/dbConnect';
import BillingContent from './BillingContent';

export default async function BillingPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login?callbackUrl=/dashboard/billing');

  const orderCollection = dbConnect(Collection.ORDERS);
  const userOrders = await orderCollection
    .find({ userEmail: session.user.email })
    .sort({ _id: -1 })
    .limit(5)
    .toArray();

  const serializedOrders = userOrders.map(o => ({
    _id: o._id.toString(),
    total: o.total,
    date: o.date || o.createdAt || null,
  }));

  return (
    <BillingContent
      userName={session.user.name}
      userEmail={session.user.email}
      orders={serializedOrders}
    />
  );
}
