'use server';

import { Collection, dbConnect } from '@/lib/dbConnect';
import bcrypt from 'bcryptjs';

export const postUser = async (payload) => {
  const { email, password, name, image } = payload;
  //check payload
  if (!email || !password || !name) {
    return {
      success: false,
    };
  }

  //check user
  const isExist = await dbConnect(Collection.USERS).findOne({ email });
  if (isExist) {
    return {
      success: false,
    };
  }

  //create user
  const hashPassword = await bcrypt.hash(password, 10);
  const newUser = {
    provider: 'credentials',
    name,
    email,
    password: hashPassword,
    image: image || '',
    role: 'user',
  };

  //insert user

  const result = await dbConnect(Collection.USERS).insertOne(newUser);
  if (result.acknowledged) {
    return {
      ...result,
      insertedId: result.insertedId.toString(),
    };
  }
};

export const loginUser = async (payload) => {
  try {
    const { email, password } = payload;
    if (!email || !password) return null;
    const user = await dbConnect(Collection.USERS).findOne({ email });

    if (!user) {
      return null;
    }
    const isMatched = await bcrypt.compare(password, user.password);
    if (isMatched) {
      return user;
    }
  } catch (error) {
    console.log(error, 'error message');
    return null;
  }
};

export const updateUser = async (payload) => {
  const { email, name, image, password } = payload;

  if (!email) return { success: false, error: 'User email is required' };

  try {
    const updateData = {};
    if (name) updateData.name = name;
    if (image) updateData.image = image;
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    if (Object.keys(updateData).length === 0) {
      return { success: false, error: 'No data to update' };
    }

    const result = await dbConnect(Collection.USERS).updateOne({ email }, { $set: updateData });

    return {
      success: result.acknowledged,
      modifiedCount: result.modifiedCount,
    };
  } catch (error) {
    console.error('Update user error:', error);
    return { success: false, error: 'Failed to update profile' };
  }
};
