'use server';

import { Collection, dbConnect } from '@/lib/dbConnect';
import { ObjectId } from 'mongodb';

export const getProducts = async (page = 1, limit = 6, search = '', sort = '') => {
  const skip = (page - 1) * limit;
  const collection = dbConnect(Collection.PRODUCTS);
  
  // Build query
  const query = {};
  if (search) {
    query.title = { $regex: search, $options: 'i' };
  }

  // Build sort
  let sortQuery = {};
  if (sort === 'price_asc') {
    sortQuery = { price: 1 };
  } else if (sort === 'price_desc') {
    sortQuery = { price: -1 };
  } else {
    sortQuery = { _id: -1 }; // Default sort (newest)
  }

  const products = await collection.find(query).sort(sortQuery).skip(skip).limit(limit).toArray();
  const total = await collection.countDocuments(query);
  
  return {
    products: JSON.parse(JSON.stringify(products)),
    total,
    pages: Math.ceil(total / limit)
  };
};

export const getSuggestions = async (query = '') => {
  if (!query) return [];
  const collection = dbConnect(Collection.PRODUCTS);
  const products = await collection
    .find({ title: { $regex: query, $options: 'i' } })
    .limit(5)
    .toArray();
  
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
