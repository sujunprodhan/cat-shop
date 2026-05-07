'use server';

import { Collection, dbConnect } from '@/lib/dbConnect';
import { ObjectId } from 'mongodb';

export const getProducts = async () => {
  const products = await dbConnect(Collection.PRODUCTS).find().toArray();
  return JSON.parse(JSON.stringify(products));
};

export const getSingleProduct = async (id) => {
  if (id.length != 24) {
    return {};
  }

  const query = { _id: new ObjectId(id) };
  const product = await dbConnect(Collection.PRODUCTS).findOne(query);
  return {...product, _id:product._id.toString()};
};
