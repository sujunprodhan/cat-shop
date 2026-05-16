'use server';

import { authOptions } from '@/lib/authOptions';
import { Collection, dbConnect } from '@/lib/dbConnect';
import { ObjectId } from 'mongodb';
import { getServerSession } from 'next-auth';
import { cache } from 'react';

export const toggleFavorite = async (productId) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return { success: false, message: 'You must be logged in to add favorites' };
    }

    const favoriteCollection = dbConnect(Collection.FAVORITES);
    const query = { email: session.user.email, productId: productId };
    
    const existing = await favoriteCollection.findOne(query);

    if (existing) {
      // Remove from favorites
      await favoriteCollection.deleteOne(query);
      return { success: true, added: false, message: 'Removed from favorites' };
    } else {
      // Add to favorites
      await favoriteCollection.insertOne({
        email: session.user.email,
        productId: productId,
        createdAt: new Date()
      });
      return { success: true, added: true, message: 'Added to favorites' };
    }
  } catch (error) {
    console.error('Error toggling favorite:', error);
    return { success: false, message: 'Failed to update favorites' };
  }
};

export const getFavorites = cache(async () => {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) return [];

    const favoriteCollection = dbConnect(Collection.FAVORITES);
    const productCollection = dbConnect(Collection.PRODUCTS);

    const favorites = await favoriteCollection.find({ email: session.user.email }).toArray();
    
    if (favorites.length === 0) return [];

    const productIds = favorites.map(f => new ObjectId(f.productId));
    const products = await productCollection.find({ _id: { $in: productIds } }).toArray();

    return JSON.parse(JSON.stringify(products));
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return [];
  }
});

export const getFavoriteIds = cache(async () => {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) return [];

    const favoriteCollection = dbConnect(Collection.FAVORITES);
    const favorites = await favoriteCollection.find({ email: session.user.email }).toArray();
    
    return favorites.map(f => f.productId);
  } catch (error) {
    return [];
  }
});

export const clearFavorites = async () => {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) return { success: false, message: 'Unauthorized' };

    const favoriteCollection = dbConnect(Collection.FAVORITES);
    await favoriteCollection.deleteMany({ email: session.user.email });

    return { success: true, message: 'Favorites cleared' };
  } catch (error) {
    console.error('Error clearing favorites:', error);
    return { success: false, message: 'Failed to clear favorites' };
  }
};
