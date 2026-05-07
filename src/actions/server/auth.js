'use server';

import { Collection, dbConnect } from '@/lib/dbConnect';
import bcrypt from 'bcryptjs';

export const postUser = async (payload) => {
  const { email, password, name } = payload;
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
