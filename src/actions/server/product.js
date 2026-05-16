'use server';

import { Collection, dbConnect } from '@/lib/dbConnect';
import { ObjectId } from 'mongodb';
import { authOptions } from '@/lib/authOptions';
import { getServerSession } from 'next-auth';

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
    sortQuery = { _id: -1 };
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
  return JSON.parse(JSON.stringify(product));
};

export const addProductReview = async (productId, reviewData) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return { success: false, message: 'You must be logged in to post a review' };
    }

    const collection = dbConnect(Collection.PRODUCTS);
    const { rating, comment } = reviewData;

    const product = await collection.findOne({ _id: new ObjectId(productId) });
    if (!product) return { success: false, message: 'Product not found' };

    const newReview = {
      name: session.user.name,
      image: session.user.image,
      email: session.user.email,
      rating: Number(rating),
      comment,
      createdAt: new Date(),
    };

    // If 'reviews' is a number (legacy), we convert it to an empty array or handle it
    const currentReviews = Array.isArray(product.reviews) ? product.reviews : [];
    const updatedReviews = [...currentReviews, newReview];
    
    // Calculate new average rating
    const totalRating = updatedReviews.reduce((acc, r) => acc + r.rating, 0);
    const newAverageRating = (totalRating / updatedReviews.length).toFixed(1);

    const result = await collection.updateOne(
      { _id: new ObjectId(productId) },
      { 
        $set: { 
          reviews: updatedReviews,
          ratings: parseFloat(newAverageRating)
        }
      }
    );

    if (result.acknowledged) {
      return { success: true, message: 'Review added successfully' };
    }
    return { success: false, message: 'Failed to update product' };
  } catch (error) {
    console.error('Error adding review:', error);
    return { success: false, message: 'An internal error occurred' };
  }
};
