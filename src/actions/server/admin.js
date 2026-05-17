'use server';

import { authOptions } from '@/lib/authOptions';
import { Collection, dbConnect } from '@/lib/dbConnect';
import { ObjectId } from 'mongodb';
import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';

export const getAllUsers = async () => {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.role !== 'admin') {
      return { success: false, message: 'Unauthorized' };
    }

    const userCollection = dbConnect(Collection.USERS);
    const users = await userCollection.find({}).sort({ createdAt: -1 }).toArray();

    return {
      success: true,
      data: JSON.parse(JSON.stringify(users))
    };
  } catch (error) {
    console.error('Error fetching users:', error);
    return { success: false, message: 'Failed to fetch users' };
  }
};

export const updateUserRole = async (userId, newRole) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.role !== 'admin') {
      return { success: false, message: 'Unauthorized' };
    }

    // Prevent admin from demoting themselves (optional but recommended)
    if (session.user.email === (await dbConnect(Collection.USERS).findOne({ _id: new ObjectId(userId) }))?.email) {
    }

    const userCollection = dbConnect(Collection.USERS);
    const result = await userCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { role: newRole } }
    );

    if (result.modifiedCount > 0) {
      revalidatePath('/admin/users');
      return { success: true, message: `User role updated to ${newRole}` };
    }

    return { success: false, message: 'No changes made' };
  } catch (error) {
    console.error('Error updating user role:', error);
    return { success: false, message: 'Failed to update user role' };
  }
};
