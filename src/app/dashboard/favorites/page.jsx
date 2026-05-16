'use client';

import React, { useEffect, useState } from 'react';
import { Heart, ShoppingBag, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { getFavorites, clearFavorites } from '@/actions/server/favorite';
import ProductCard from '@/components/productcard/ProductCard';
import { useFavorites } from '@/provider/FavoriteProvider';
import Swal from 'sweetalert2';

export default function FavoritesPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { favoriteCount, updateFavorites } = useFavorites();

  const handleClearAll = async () => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#334155',
      confirmButtonText: 'Yes, clear all!',
      background: '#0f172a',
      color: '#fff',
    });

    if (result.isConfirmed) {
      const res = await clearFavorites();
      if (res.success) {
        updateFavorites();
        Swal.fire({
          title: 'Cleared!',
          text: 'Your wishlist has been cleared.',
          icon: 'success',
          background: '#0f172a',
          color: '#fff',
          confirmButtonColor: '#10b981'
        });
      }
    }
  };

  useEffect(() => {
    const fetchFavorites = async () => {
      const data = await getFavorites();
      setProducts(data);
      setLoading(false);
    };
    fetchFavorites();
  }, [favoriteCount]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="w-12 h-12 text-rose-500 animate-spin" />
        <p className="text-slate-400 font-medium animate-pulse">Loading your favorites...</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight mb-2 flex items-center gap-3">
            My <span className="text-rose-500">Favorites</span>
          </h2>
          <p className="text-slate-400 text-sm">Products you've saved for later</p>
        </div>
        
        <div className="flex items-center gap-4">
          {products.length > 0 && (
            <>
              <div className="bg-rose-500/10 px-4 py-2 rounded-2xl border border-rose-500/20 text-rose-400 font-bold text-sm">
                {products.length} Items Saved
              </div>
              <button 
                onClick={handleClearAll}
                className="px-4 py-2 rounded-2xl bg-slate-900 border border-white/5 text-slate-400 hover:text-rose-400 hover:border-rose-500/30 transition-all font-bold text-sm"
              >
                Clear All
              </button>
            </>
          )}
        </div>
      </div>

      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[450px] text-center p-12 bg-slate-900/30 backdrop-blur-xl rounded-[2.5rem] border border-white/5 relative overflow-hidden group">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-rose-500/10 rounded-full blur-[80px]"></div>
          
          <div className="relative">
            <div className="w-24 h-24 bg-rose-500/10 rounded-3xl flex items-center justify-center mb-8 rotate-3 border border-rose-500/20 shadow-2xl">
              <Heart className="text-rose-500 fill-rose-500/20" size={48} />
            </div>
            
            <h2 className="text-3xl font-bold text-white mb-4">Your wishlist is empty</h2>
            <p className="text-slate-400 max-w-sm mx-auto mb-10 leading-relaxed">
              Found something you love? Tap the heart icon on any product to save it here for later.
            </p>
            
            <Link 
              href="/products" 
              className="inline-flex items-center gap-3 px-8 py-4 bg-white text-slate-950 rounded-2xl font-black transition-all hover:scale-105 active:scale-95 shadow-xl"
            >
              BROWSE STORE
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
