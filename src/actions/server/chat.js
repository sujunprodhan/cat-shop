'use server';

import { Collection, dbConnect } from '@/lib/dbConnect';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { ObjectId } from 'mongodb';

export const sendChatMessage = async (content, receiverEmail = 'admin') => {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) return { success: false, message: 'Unauthorized' };

    const chatCollection = dbConnect(Collection.CHATS);
    
    const message = {
      senderEmail: session.user.email,
      senderName: session.user.name,
      senderImage: session.user.image,
      receiverEmail,
      content,
      createdAt: new Date(),
      status: 'unread',
      // For grouping conversations
      chatId: receiverEmail === 'admin' ? session.user.email : receiverEmail
    };

    const result = await chatCollection.insertOne(message);
    return { success: true, message: JSON.parse(JSON.stringify(message)) };
  } catch (error) {
    console.error('Chat Error:', error);
    return { success: false };
  }
};

export const getMessages = async (userEmail) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) return [];

    const chatCollection = dbConnect(Collection.CHATS);
    
    // Admin can see any user's messages, users only see their own with admin
    const query = session.role === 'admin' 
      ? { chatId: userEmail }
      : { chatId: session.user.email };

    const messages = await chatCollection.find(query).sort({ createdAt: 1 }).toArray();
    return JSON.parse(JSON.stringify(messages));
  } catch (error) {
    return [];
  }
};

export const getAllConversations = async () => {
  try {
    const session = await getServerSession(authOptions);
    if (session?.role !== 'admin') return [];

    const chatCollection = dbConnect(Collection.CHATS);
    
    // Group by chatId and get the last message for each
    const conversations = await chatCollection.aggregate([
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: "$chatId",
          lastMessage: { $first: "$content" },
          senderName: { $first: "$senderName" },
          senderImage: { $first: "$senderImage" },
          senderEmail: { $first: "$senderEmail" },
          createdAt: { $first: "$createdAt" },
          unreadCount: {
            $sum: { $cond: [{ $eq: ["$status", "unread"] }, 1, 0] }
          }
        }
      },
      { $sort: { createdAt: -1 } }
    ]).toArray();

    return JSON.parse(JSON.stringify(conversations));
  } catch (error) {
    return [];
  }
};
