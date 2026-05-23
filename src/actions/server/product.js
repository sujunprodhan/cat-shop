'use server';

import { Collection, dbConnect } from '@/lib/dbConnect';
import { ObjectId } from 'mongodb';
import { authOptions } from '@/lib/authOptions';
import { getServerSession } from 'next-auth';

export const getProducts = async (page = 1, limit = 6, search = '', sort = '', category = '') => {
  const skip = (page - 1) * limit;
  const collection = dbConnect(Collection.PRODUCTS);
  
  // Build query
  const query = {};
  if (search) {
    query.title = { $regex: search, $options: 'i' };
  }
  if (category) {
    query.category = category;
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

export const getCategories = async () => {
  const defaultCategories = ["cat food", "accessories", "beds & mats", "interactive"];
  try {
    const collection = dbConnect(Collection.PRODUCTS);
    const categories = await collection.distinct('category');
    return categories && categories.length > 0 ? categories : defaultCategories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return defaultCategories;
  }
};

export const getCategoryCounts = async () => {
  try {
    const collection = dbConnect(Collection.PRODUCTS);
    const counts = await collection.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } }
    ]).toArray();
    
    const countMap = {};
    counts.forEach(c => {
      if (c._id) {
        countMap[c._id.toLowerCase()] = c.count;
      }
    });
    return countMap;
  } catch (error) {
    console.error('Error fetching category counts:', error);
    return {};
  }
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

export const getRelatedProducts = async (productId, category = '') => {
  try {
    const collection = dbConnect(Collection.PRODUCTS);
    
    let query = { 
      _id: { $ne: new ObjectId(productId) } 
    };

    if (category) {
      query.category = category;
    }

    // Try to find products in same category first
    let relatedProducts = await collection.find(query).limit(4).toArray();

    // If not enough related products found, fill with others
    if (relatedProducts.length < 4) {
      const moreProducts = await collection
        .find({ _id: { $ne: new ObjectId(productId), $nin: relatedProducts.map(p => p._id) } })
        .limit(4 - relatedProducts.length)
        .toArray();
      relatedProducts = [...relatedProducts, ...moreProducts];
    }

    return JSON.parse(JSON.stringify(relatedProducts));
  } catch (error) {
    console.error('Error fetching related products:', error);
    return [];
  }
};

export const createProduct = async (productData) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.role !== 'admin') {
      return { success: false, message: 'Unauthorized' };
    }
    const collection = dbConnect(Collection.PRODUCTS);
    const result = await collection.insertOne(productData);
    if (result.acknowledged) {
      return { success: true, message: 'Product created successfully' };
    }
    return { success: false, message: 'Failed to create product' };
  } catch (error) {
    console.error('Error creating product:', error);
    return { success: false, message: 'An internal error occurred' };
  }
};

export const updateProduct = async (id, productData) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.role !== 'admin') {
      return { success: false, message: 'Unauthorized' };
    }
    const collection = dbConnect(Collection.PRODUCTS);
    const { _id, ...updateData } = productData;
    const result = await collection.updateOne({ _id: new ObjectId(id) }, { $set: updateData });
    if (result.acknowledged) {
      return { success: true, message: 'Product updated successfully' };
    }
    return { success: false, message: 'Failed to update product' };
  } catch (error) {
    console.error('Error updating product:', error);
    return { success: false, message: 'An internal error occurred' };
  }
};

export const deleteProduct = async (id) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.role !== 'admin') {
      return { success: false, message: 'Unauthorized' };
    }
    const collection = dbConnect(Collection.PRODUCTS);
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    if (result.acknowledged) {
      return { success: true, message: 'Product deleted successfully' };
    }
    return { success: false, message: 'Failed to delete product' };
  } catch (error) {
    console.error('Error deleting product:', error);
    return { success: false, message: 'An internal error occurred' };
  }
};
