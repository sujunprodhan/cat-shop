'use server';

import { Collection, dbConnect } from '@/lib/dbConnect';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

export const sendChatMessage = async (
  content,
  receiverEmail = 'admin',
  attachment = null   // { url, name, isImage }
) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) return { success: false, message: 'Unauthorized' };

    // Prevent Admin from sending a message to 'admin' (i.e. pretending to be a user sending to support)
    if (session.role === 'admin' && receiverEmail === 'admin') {
      return { success: false, message: 'Admins cannot send messages to the user support channel.' };
    }

    const chatCollection = dbConnect(Collection.CHATS);

    const message = {
      senderEmail: session.user.email,
      senderName:  session.user.name,
      senderImage: session.user.image,
      receiverEmail,
      content,
      createdAt: new Date(),
      status: 'unread',
      chatId: receiverEmail === 'admin' ? session.user.email : receiverEmail,
      // Attachment fields (only saved when a file is attached)
      ...(attachment?.url  && { attachmentUrl:     attachment.url }),
      ...(attachment?.name && { attachmentName:    attachment.name }),
      ...(attachment       && { attachmentIsImage: attachment.isImage ?? false }),
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

export const markMessagesAsRead = async (chatId) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) return;

    const chatCollection = dbConnect(Collection.CHATS);
    
    if (session.role === 'admin') {
      await chatCollection.updateMany(
        { chatId, receiverEmail: 'admin', status: 'unread' },
        { $set: { status: 'read' } }
      );
    } else {
      await chatCollection.updateMany(
        { chatId, receiverEmail: session.user.email, status: 'unread' },
        { $set: { status: 'read' } }
      );
    }
  } catch (error) {
    console.error('Mark as read error:', error);
  }
};

export const getAllConversations = async () => {
  try {
    const session = await getServerSession(authOptions);
    if (session?.role !== 'admin') return [];

    const chatCollection = dbConnect(Collection.CHATS);

    const conversations = await chatCollection.aggregate([
      { $match: { chatId: { $exists: true, $ne: null } } },
      { $sort: { createdAt: 1 } },
      {
        $group: {
          _id: '$chatId',
          // Most recent message for preview
          lastMessage: { $last: '$content' },
          lastActiveAt: { $last: '$createdAt' },
          unreadCount: {
            $sum: { 
              $cond: [
                { $and: [
                    { $eq: ['$status', 'unread'] },
                    { $eq: ['$receiverEmail', 'admin'] }
                  ]
                }, 
                1, 
                0
              ] 
            },
          },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: 'email',
          as: 'userInfo'
        }
      },
      {
        $unwind: {
          path: '$userInfo',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          _id: 1,
          lastMessage: 1,
          lastActiveAt: 1,
          unreadCount: 1,
          senderName: { $ifNull: ['$userInfo.name', '$_id'] },
          senderEmail: '$_id',
          senderImage: '$userInfo.image'
        }
      },
      { $sort: { lastActiveAt: -1 } }, // newest conversation on top
    ]).toArray();

    return JSON.parse(JSON.stringify(conversations));
  } catch (error) {
    return [];
  }
};
