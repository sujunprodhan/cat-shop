'use server';

import { Collection, dbConnect } from '@/lib/dbConnect';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

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
      // chatId always = the user's email (for grouping)
      chatId: receiverEmail === 'admin' ? session.user.email : receiverEmail,
    };

    await chatCollection.insertOne(message);
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

    // Admin can see any user's messages, users only see their own
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

    /*
      Sort ASCENDING first so that $first always picks the OLDEST message.
      The oldest message in any conversation is always from the USER (not admin),
      so senderName / senderImage will correctly show the user's profile.
      $last picks the MOST RECENT message for the preview & timestamp.
    */
    const conversations = await chatCollection.aggregate([
      { $sort: { createdAt: 1 } },
      {
        $group: {
          _id: '$chatId',
          // Oldest message is always from the user → user's profile info
          senderName: { $first: '$senderName' },
          senderImage: { $first: '$senderImage' },
          senderEmail: { $first: '$senderEmail' },
          // Most recent message for preview
          lastMessage: { $last: '$content' },
          lastActiveAt: { $last: '$createdAt' },
          unreadCount: {
            $sum: { $cond: [{ $eq: ['$status', 'unread'] }, 1, 0] },
          },
        },
      },
      { $sort: { lastActiveAt: -1 } }, // newest conversation on top
    ]).toArray();

    return JSON.parse(JSON.stringify(conversations));
  } catch (error) {
    return [];
  }
};
