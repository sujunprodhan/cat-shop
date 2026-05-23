'use server';

import { authOptions } from '@/lib/authOptions';
import { Collection, dbConnect } from '@/lib/dbConnect';
import { sendEmail } from '@/lib/sendEmail';
import { getServerSession } from 'next-auth';
import { generateInvoiceHTML } from '@/lib/invoiceTemplate';
import { ObjectId } from 'mongodb';

const orderCollection = dbConnect(Collection.ORDERS);
const cartCollection = dbConnect(Collection.CART);
const productCollection = dbConnect(Collection.PRODUCTS);

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
      // Increment item
      for (const item of items) {
        if (item.productId) {
          await productCollection.updateOne(
            { _id: new ObjectId(item.productId) },
            { $inc: { sold: item.quantity || 1 } }
          );
        }
      }

      // invoice template
      const orderForInvoice = {
        orderId: result.insertedId.toString(),
        items,
        total,
        customerEmail: email,
      };
      const invoiceTemplate = generateInvoiceHTML(orderForInvoice);

      // send email
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

export const getUserOrders = async () => {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return { success: false, message: 'Unauthorized' };
    }

    const orders = await orderCollection
      .find({ userEmail: session.user.email })
      .sort({ createdAt: -1 })
      .toArray();

    return {
      success: true,
      data: JSON.parse(JSON.stringify(orders)),
    };
  } catch (error) {
    console.error('Error fetching user orders:', error);
    return { success: false, message: 'Failed to fetch orders' };
  }
};

export const updateOrderStatus = async (orderId, status) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.role !== 'admin') {
      return { success: false, message: 'Unauthorized. Admins only.' };
    }

    const result = await orderCollection.updateOne(
      { _id: new ObjectId(orderId) },
      { $set: { status } }
    );

    if (result.modifiedCount > 0) {
      if (status === 'confirmed') {
        const order = await orderCollection.findOne({ _id: new ObjectId(orderId) });
        
        // Generate Items HTML
        const itemsHtml = (order.items || []).map(item => `
          <tr>
            <td style="padding: 16px 0; border-bottom: 1px solid #334155; width: 60px;">
              <img src="${item.image}" alt="${item.title}" style="width: 55px; height: 55px; border-radius: 10px; object-fit: cover; border: 1px solid #475569;" />
            </td>
            <td style="padding: 16px 15px; border-bottom: 1px solid #334155;">
              <p style="margin: 0; color: #f8fafc; font-size: 15px; font-weight: 600;">${item.title || 'Product'}</p>
              <p style="margin: 4px 0 0 0; color: #94a3b8; font-size: 12px;">Qty: ${item.quantity || 1} <span style="margin: 0 5px;">|</span> $${item.price || 0}</p>
            </td>
            <td style="padding: 16px 0; border-bottom: 1px solid #334155; text-align: right; color: #f8fafc; font-weight: bold; font-size: 15px;">
              $${((item.quantity || 1) * (item.price || 0)).toLocaleString()}
            </td>
          </tr>
        `).join('');

        // 1. Email to User
        await sendEmail({
          to: order.customer.email,
          subject: 'Your Order is Confirmed! 🚚 - Cat Shop',
          html: `
            <div style="font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #020617; padding: 0; border-radius: 20px; overflow: hidden; border: 1px solid #1e293b;">
              <!-- Header -->
              <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 20px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 900; letter-spacing: 3px;">CAT SHOP</h1>
                <div style="margin-top: 15px; display: inline-block; background: rgba(255,255,255,0.2); padding: 6px 16px; border-radius: 20px;">
                  <p style="color: #ffffff; margin: 0; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px;">Order Confirmed</p>
                </div>
              </div>
              
              <!-- Body -->
              <div style="padding: 40px 30px;">
                <h2 style="color: #f8fafc; margin-top: 0; font-size: 24px; font-weight: 800;">Hello ${order.customer.name},</h2>
                <p style="color: #94a3b8; font-size: 16px; line-height: 1.6; margin-bottom: 35px;">
                  We're excited to let you know that your order <strong>#${orderId.slice(-6).toUpperCase()}</strong> has been successfully confirmed. Our team is now preparing your items for shipment.
                </p>
                
                <!-- Order Summary -->
                <div style="background-color: #0f172a; border-radius: 16px; padding: 25px; margin-bottom: 35px; border: 1px solid #1e293b;">
                  <div style="display: flex; justify-content: space-between; margin-bottom: 20px; border-bottom: 1px solid #1e293b; padding-bottom: 15px;">
                    <div>
                      <p style="color: #64748b; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 5px 0;">Order ID</p>
                      <p style="color: #f8fafc; font-size: 16px; font-weight: bold; margin: 0;">#${orderId.slice(-6).toUpperCase()}</p>
                    </div>
                    <div style="text-align: right;">
                      <p style="color: #64748b; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 5px 0;">Total Amount</p>
                      <p style="color: #10b981; font-size: 16px; font-weight: bold; margin: 0;">$${order.total?.toLocaleString() || 0}</p>
                    </div>
                  </div>

                  <h3 style="color: #e2e8f0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 10px 0; border-bottom: 1px solid #1e293b; padding-bottom: 10px;">Purchased Items</h3>
                  <table style="width: 100%; border-collapse: collapse;">
                    ${itemsHtml}
                  </table>
                  
                  <div style="margin-top: 20px; text-align: right;">
                    <p style="margin: 0; color: #94a3b8; font-size: 14px;">Total Paid: <strong style="color: #10b981; font-size: 18px; margin-left: 10px;">$${order.total?.toLocaleString() || 0}</strong></p>
                  </div>
                </div>

                <div style="text-align: center; margin: 40px 0 10px 0;">
                  <a href="#" style="background: #10b981; color: #ffffff; text-decoration: none; padding: 16px 35px; border-radius: 12px; font-weight: bold; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; display: inline-block;">View Order Status</a>
                </div>
              </div>
              
              <!-- Footer -->
              <div style="background-color: #0b0f19; padding: 30px; text-align: center; border-top: 1px solid #1e293b;">
                <p style="color: #64748b; font-size: 12px; margin: 0; font-weight: bold;">© ${new Date().getFullYear()} Cat Shop Premium.</p>
                <p style="color: #475569; font-size: 11px; margin: 8px 0 0 0;">This is an automated notification. Please do not reply.</p>
              </div>
            </div>
          `,
        });
        
        // 2. Email to Admin
        await sendEmail({
          to: process.env.EMAIL_USER, // Admin's own email address
          subject: `[Admin Alert] Order #${orderId.slice(-6).toUpperCase()} Confirmed`,
          html: `
            <div style="font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #020617; padding: 0; border-radius: 16px; overflow: hidden; border: 1px solid #1e293b;">
              <div style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); padding: 25px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 18px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px;">Admin Action Log</h1>
              </div>
              <div style="padding: 35px 30px;">
                <p style="color: #f8fafc; font-size: 16px; margin-top: 0; margin-bottom: 25px;">You have successfully confirmed an order. Here are the details:</p>
                
                <div style="background-color: #0f172a; padding: 25px; border-radius: 12px; margin-bottom: 25px; border: 1px solid #1e293b;">
                  <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                    <tr>
                      <td style="padding-bottom: 10px;"><strong style="color: #64748b; font-size: 12px; text-transform: uppercase;">Order ID</strong><br/><span style="color: #f8fafc; font-size: 15px;">#${orderId.slice(-6).toUpperCase()}</span></td>
                      <td style="padding-bottom: 10px; text-align: right;"><strong style="color: #64748b; font-size: 12px; text-transform: uppercase;">Amount</strong><br/><span style="color: #10b981; font-weight: 900; font-size: 16px;">$${order.total?.toLocaleString() || 0}</span></td>
                    </tr>
                    <tr>
                      <td colspan="2" style="padding-top: 10px; border-top: 1px solid #1e293b;"><strong style="color: #64748b; font-size: 12px; text-transform: uppercase;">Customer</strong><br/><span style="color: #f8fafc; font-size: 15px;">${order.customer.name}</span> <span style="color: #94a3b8; font-size: 13px;">(${order.customer.email})</span></td>
                    </tr>
                  </table>
                  
                  <h3 style="color: #e2e8f0; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 10px 0; border-bottom: 1px solid #1e293b; padding-bottom: 10px;">Ordered Items</h3>
                  <table style="width: 100%; border-collapse: collapse;">
                    ${itemsHtml}
                  </table>
                </div>
                <p style="color: #64748b; font-size: 13px; font-style: italic; text-align: center;">A confirmation email has been dispatched to the customer.</p>
              </div>
            </div>
          `,
        });
      }
      return { success: true, message: 'Order status updated successfully.' };
    }
    return { success: false, message: 'Order not found or status is already set.' };
  } catch (error) {
    console.error('Error updating order:', error);
    return { success: false, message: 'An internal error occurred while updating order.' };
  }
};
