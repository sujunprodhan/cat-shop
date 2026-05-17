import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { redirect } from 'next/navigation';
import { Collection, dbConnect } from '@/lib/dbConnect';
import DashboardContent from './DashboardContent';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login?callbackUrl=/dashboard');

  const orderCollection = dbConnect(Collection.ORDERS);
  const userOrders = await orderCollection.find({ userEmail: session.user.email }).toArray();

  const totalOrders = userOrders.length;
  const totalSpent  = userOrders.reduce((sum, o) => sum + (o.total || 0), 0);

  return (
    <DashboardContent
      userName={session.user.name}
      totalOrders={totalOrders}
      totalSpent={totalSpent}
    />
  );
}
