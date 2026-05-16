'use server';

import { Collection, dbConnect } from '@/lib/dbConnect';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { sendEmail } from '@/lib/sendEmail';

export const submitContactForm = async (formData) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return { success: false, message: 'You must be logged in to send a message.' };
    }

    const { name, email, subject, message } = formData;

    // Security check: Ensure name and email match session
    if (name !== session.user.name || email !== session.user.email) {
      return { success: false, message: 'Invalid user data. Please use your account information.' };
    }

    if (!message) {
      return { success: false, message: 'Please write your message.' };
    }

    const contactCollection = dbConnect(Collection.CONTACTS);
    
    const newMessage = {
      name,
      email,
      subject: subject || 'No Subject',
      message,
      createdAt: new Date(),
      status: 'unread'
    };

    const result = await contactCollection.insertOne(newMessage);

    if (result.acknowledged) {
      // 1. Professional Email to User (Confirmation)
      await sendEmail({
        to: email,
        subject: `We've Received Your Message - CatShop Support`,
        html: `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
            <div style="background-color: #059669; padding: 40px 20px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.025em;">CAT<span style="color: #34d399;">SHOP</span></h1>
              <p style="color: #d1fae5; margin-top: 8px; font-size: 14px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.1em;">Premium Pet Experience</p>
            </div>
            <div style="padding: 40px 30px; color: #1e293b; line-height: 1.6;">
              <h2 style="font-size: 20px; font-weight: 700; margin-bottom: 16px; color: #0f172a;">Hello ${name},</h2>
              <p style="margin-bottom: 24px; font-size: 16px;">Thank you for reaching out to us. We've successfully received your inquiry and our team is already reviewing it. You can expect a response from one of our experts within 24 hours.</p>
              
              <div style="background-color: #f8fafc; border-radius: 12px; padding: 24px; border: 1px solid #f1f5f9; margin-bottom: 32px;">
                <h3 style="font-size: 12px; font-weight: 800; text-transform: uppercase; color: #64748b; margin-bottom: 12px; letter-spacing: 0.05em;">Message Summary</h3>
                <p style="margin: 0 0 8px 0; font-size: 14px;"><strong>Subject:</strong> ${subject}</p>
                <p style="margin: 0; font-size: 14px; color: #475569;">${message}</p>
              </div>

              <p style="margin-bottom: 0; font-size: 15px;">Best regards,<br><strong>The CatShop Support Team</strong></p>
            </div>
            <div style="background-color: #f1f5f9; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0; color: #94a3b8; font-size: 12px;">&copy; ${new Date().getFullYear()} CatShop Inc. All rights reserved.</p>
              <p style="margin: 4px 0 0 0; color: #94a3b8; font-size: 12px;">123 Feline Lane, Pet City, PC 5678</p>
            </div>
          </div>
        `
      });

      // 2. Professional Email to Admin (Notification)
      await sendEmail({
        to: process.env.EMAIL_USER,
        subject: `[ACTION REQUIRED] New Inquiry from ${name}`,
        html: `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #fdfdfd; border-radius: 16px; border: 2px solid #2563eb;">
            <div style="background-color: #2563eb; padding: 20px; color: white; border-radius: 13px 13px 0 0;">
              <h3 style="margin: 0; font-size: 14px; text-transform: uppercase; letter-spacing: 0.1em; opacity: 0.8;">Admin Notification</h3>
              <h2 style="margin: 4px 0 0 0; font-size: 20px; font-weight: 800;">New Customer Message</h2>
            </div>
            <div style="padding: 30px; color: #1e293b;">
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 13px; font-weight: 600; width: 100px;">Customer:</td>
                  <td style="padding: 8px 0; color: #0f172a; font-size: 14px; font-weight: 700;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 13px; font-weight: 600;">Email:</td>
                  <td style="padding: 8px 0; color: #2563eb; font-size: 14px; font-weight: 700;">${email}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #64748b; font-size: 13px; font-weight: 600;">Subject:</td>
                  <td style="padding: 8px 0; color: #0f172a; font-size: 14px; font-weight: 700;">${subject}</td>
                </tr>
              </table>
              
              <div style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; box-shadow: inset 0 2px 4px rgba(0,0,0,0.02);">
                <h4 style="margin: 0 0 10px 0; color: #0f172a; font-size: 13px; font-weight: 800; text-transform: uppercase;">Message Body:</h4>
                <p style="margin: 0; font-size: 15px; color: #334155; white-space: pre-wrap;">${message}</p>
              </div>
              
              <div style="margin-top: 30px; text-align: center;">
                <a href="mailto:${email}" style="display: inline-block; background-color: #2563eb; color: #ffffff; padding: 14px 28px; border-radius: 10px; text-decoration: none; font-weight: 700; font-size: 14px;">Reply to Customer</a>
              </div>
            </div>
          </div>
        `
      });

      return { success: true, message: 'Your message has been sent successfully!' };
    }

    return { success: false, message: 'Failed to send message.' };
  } catch (error) {
    console.error('Error submitting contact form:', error);
    return { success: false, message: 'An internal server error occurred.' };
  }
};
