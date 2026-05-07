'use server';

import { authOptions } from '@/lib/authOptions';
import { Collection, dbConnect } from '@/lib/dbConnect';
import { getServerSession } from 'next-auth';

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
      image: product?.image,
      username: user?.name,
    };
    console.log(newData, 'Cart JS');

    const result = await cartCollection.insertOne(newData);
    return {
      success: result.acknowledged,
    };
  }
};
