'use server';

import { authOptions } from '@/lib/authOptions';
import { Collection, dbConnect } from '@/lib/dbConnect';
import { sendEmail } from '@/lib/sendEmail';
import { getServerSession } from 'next-auth';
import { generateInvoiceHTML } from '@/lib/invoiceTemplate';

const orderCollection = dbConnect(Collection.ORDERS);
const cartCollection = dbConnect(Collection.CART);

export const createOrder = async (orderData) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return { success: false, message: 'You must be logged in to place an order' };
    }

    const { name, email, phone, address, city, zip, items, total } = orderData;

    const newOrder = {
      customer: {
        name,
        email,
        phone,
      },
      shipping: {
        address,
        city,
        zip,
      },
      items,
      total,
      status: 'pending',
      createdAt: new Date(),
      userEmail: session.user.email,
    };

    const result = await orderCollection.insertOne(newOrder);

    if (result.acknowledged) {
      // invoice template ekhane
      const orderForInvoice = {
        orderId: result.insertedId.toString(),
        items,
        total,
        customerEmail: email,
      };
      const invoiceTemplate = generateInvoiceHTML(orderForInvoice);

      // email ekhane
      await sendEmail({
        to: email,
        subject: 'Your Order Invoice - Cat Shop',
        html: invoiceTemplate,
      });

      await cartCollection.deleteMany({ email: session.user.email });
      return {
        success: true,
        message: 'Order placed successfully!',
        orderId: result.insertedId.toString(),
      };
    }

    return { success: false, message: 'Failed to place order' };
  } catch (error) {
    console.error('Error creating order:', error);
    return { success: false, message: 'An internal error occurred' };
  }
};
