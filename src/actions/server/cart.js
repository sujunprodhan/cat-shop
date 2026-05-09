'use server';

import { authOptions } from '@/lib/authOptions';
import { Collection, dbConnect } from '@/lib/dbConnect';
import { ObjectId } from 'mongodb';
import { getServerSession } from 'next-auth';
import { cache } from 'react';

const cartCollection = dbConnect(Collection.CART);
export const handleCart = async ({ product, inc }) => {
  const session = (await getServerSession(authOptions)) || {};
  const user = session?.user;
  if (!user)
    return {
      success: false,
    };

  // Get cart Item > user.email && ProductId
  const query = { email: user?.email, productId: product?._id };
  const isAdded = await cartCollection.findOne(query);

  if (isAdded) {
    // if Exist  Update Cart
    const updateData = {
      $inc: {
        quantity: inc ? 1 : -1,
      },
    };
    const result = await cartCollection.updateOne(query, updateData);
    return { success: Boolean(result.modifiedCount) };
  } else {
    //Not Exist and Insert Cart
    const newData = {
      productId: product?._id,
      email: user?.email,
      title: product?.title,
      quantity: 1,
      price: product?.price,
      image: product?.image,
      username: user?.name,
    };

    const result = await cartCollection.insertOne(newData);
    return {
      success: result.acknowledged,
    };
  }
};

export const getCart = cache(async () => {
  const user = await getServerSession(authOptions);
  if (!user) {
    return [];
  }
  const query = { email: user?.email };
  const result = await cartCollection.find(query).toArray();
  return result;
});

export const deleteItemCart = async (id) => {
  const { user } = (await getServerSession(authOptions)) || {};
  if (!user)
    return {
      success: false,
    };
  if (id?.length != 24) {
    return {
      success: false,
    };
  }
  const query = { _id: new ObjectId(id) };
  const result = await cartCollection.deleteOne(query);

  return {
    success: Boolean(result.deletedCount),
  };
};

// increase item and decrease item function

export const increaseItemDb = async (id, quantity) => {
  const { user } = (await getServerSession(authOptions)) || {};
  if (!user)
    return {
      success: false,
    };

  if (quantity > 10) {
    return {
      success: false,
      message: 'You cant added 10 products at a time',
    };
  }
  const updateData = {
    $inc: {
      quantity: 1,
    },
  };
  const query = {
    _id: new ObjectId(id),
  };
  const result = await cartCollection.updateOne(query, updateData);
  return {
    success: Boolean(result.modifiedCount),
  };
};
