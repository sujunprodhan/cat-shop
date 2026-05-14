'use server';

import { Collection, dbConnect } from '@/lib/dbConnect';
import { ObjectId } from 'mongodb';

export const getProducts = async () => {
  const products = await dbConnect(Collection.PRODUCTS).find().toArray();
  return JSON.parse(JSON.stringify(products));
};

export const getSingleProduct = async (id) => {
   if (!ObjectId.isValid(id)) {
     return null;
   }

  const query = { _id: new ObjectId(id) };
  const product = await dbConnect(Collection.PRODUCTS).findOne(query);
  if(!product){
    return null
  }
  return {...product, _id:product._id.toString()};
};
