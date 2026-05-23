'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/provider/ThemeProvider';
import { createProduct, updateProduct } from '@/actions/server/product';
import Swal from 'sweetalert2';
import { Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ProductForm({ initialData = null }) {
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === 'night';
  const isEditing = !!initialData;

  const [loading, setLoading] = useState(false);

  // Initialize state from initialData or defaults
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    category: initialData?.category || '',
    bangla: initialData?.bangla || '',
    image: initialData?.image || '',
    price: initialData?.price || 0,
    discount: initialData?.discount || 0,
    description: initialData?.description || '',
    sizes: initialData?.sizes?.join(', ') || '',
    color: initialData?.color?.join(', ') || '',
    info: initialData?.info?.join(', ') || '',
    reviews: initialData?.reviews || 0,
    sold: initialData?.sold || 0,
    ratings: initialData?.ratings || 5.0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Process array fields
      const processedData = {
        ...formData,
        price: Number(formData.price),
        discount: Number(formData.discount),
        reviews: Number(formData.reviews),
        sold: Number(formData.sold),
        ratings: Number(formData.ratings),
        sizes: formData.sizes ? formData.sizes.split(',').map(s => s.trim()).filter(Boolean) : [],
        color: formData.color ? formData.color.split(',').map(s => s.trim()).filter(Boolean) : [],
        info: formData.info ? formData.info.split(',').map(s => s.trim()).filter(Boolean) : [],
      };

      let res;
      if (isEditing) {
        res = await updateProduct(initialData._id, processedData);
      } else {
        // qna is empty by default
        processedData.qna = [];
        res = await createProduct(processedData);
      }

      if (res.success) {
        Swal.fire('Success', res.message, 'success');
        router.push('/admin/products');
        router.refresh();
      } else {
        Swal.fire('Error', res.message, 'error');
      }
    } catch (error) {
      Swal.fire('Error', 'An error occurred. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const bgCls = isDark ? 'bg-slate-900 border-white/10' : 'bg-white border-slate-200';
  const textCls = isDark ? 'text-white' : 'text-slate-900';
  const inputBg = isDark ? 'bg-slate-800 border-white/10 text-white focus:border-blue-500' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-500';
  const labelCls = isDark ? 'text-slate-300' : 'text-slate-700';

  return (
    <div className="md:w-11/12 mx-auto max-w-4xl px-6 py-10 space-y-6">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => router.back()} className={`p-2 rounded-lg transition-colors ${isDark ? 'bg-white/5 hover:bg-white/10 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-900'}`}>
          <ArrowLeft size={20} />
        </button>
        <h1 className={`text-2xl font-black ${textCls}`}>
          {isEditing ? 'Edit Product' : 'Add New Product'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className={`p-8 rounded-[2rem] border shadow-sm ${bgCls}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className={`text-xs font-bold uppercase tracking-widest ${labelCls}`}>Title</label>
            <input required type="text" name="title" value={formData.title} onChange={handleChange} className={`w-full px-4 py-3 rounded-xl outline-none border transition-colors ${inputBg}`} />
          </div>

          <div className="space-y-2">
            <label className={`text-xs font-bold uppercase tracking-widest ${labelCls}`}>Category</label>
            <input required type="text" name="category" value={formData.category} onChange={handleChange} placeholder="e.g. cat food" className={`w-full px-4 py-3 rounded-xl outline-none border transition-colors ${inputBg}`} />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className={`text-xs font-bold uppercase tracking-widest ${labelCls}`}>Bangla Title</label>
            <input required type="text" name="bangla" value={formData.bangla} onChange={handleChange} className={`w-full px-4 py-3 rounded-xl outline-none border transition-colors ${inputBg}`} />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className={`text-xs font-bold uppercase tracking-widest ${labelCls}`}>Image URL</label>
            <input required type="url" name="image" value={formData.image} onChange={handleChange} className={`w-full px-4 py-3 rounded-xl outline-none border transition-colors ${inputBg}`} />
          </div>

          <div className="space-y-2">
            <label className={`text-xs font-bold uppercase tracking-widest ${labelCls}`}>Price (TK)</label>
            <input required type="number" name="price" value={formData.price} onChange={handleChange} className={`w-full px-4 py-3 rounded-xl outline-none border transition-colors ${inputBg}`} />
          </div>

          <div className="space-y-2">
            <label className={`text-xs font-bold uppercase tracking-widest ${labelCls}`}>Discount (%)</label>
            <input required type="number" name="discount" value={formData.discount} onChange={handleChange} className={`w-full px-4 py-3 rounded-xl outline-none border transition-colors ${inputBg}`} />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className={`text-xs font-bold uppercase tracking-widest ${labelCls}`}>Description</label>
            <textarea required name="description" rows={4} value={formData.description} onChange={handleChange} className={`w-full px-4 py-3 rounded-xl outline-none border transition-colors resize-none ${inputBg}`} />
          </div>

          <div className="space-y-2">
            <label className={`text-xs font-bold uppercase tracking-widest ${labelCls}`}>Sizes (comma separated)</label>
            <input type="text" name="sizes" value={formData.sizes} onChange={handleChange} placeholder="e.g. Small, Medium" className={`w-full px-4 py-3 rounded-xl outline-none border transition-colors ${inputBg}`} />
          </div>

          <div className="space-y-2">
            <label className={`text-xs font-bold uppercase tracking-widest ${labelCls}`}>Colors (comma separated)</label>
            <input type="text" name="color" value={formData.color} onChange={handleChange} placeholder="e.g. Red, Blue" className={`w-full px-4 py-3 rounded-xl outline-none border transition-colors ${inputBg}`} />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className={`text-xs font-bold uppercase tracking-widest ${labelCls}`}>Info Bullet Points (comma separated)</label>
            <input type="text" name="info" value={formData.info} onChange={handleChange} placeholder="e.g. High protein, Aids digestion" className={`w-full px-4 py-3 rounded-xl outline-none border transition-colors ${inputBg}`} />
          </div>
        </div>

        <div className="mt-10 flex justify-end">
          <button type="submit" disabled={loading} className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest text-xs rounded-xl flex items-center gap-3 transition-colors disabled:opacity-50">
            <Save size={18} /> {loading ? 'Saving...' : 'Save Product'}
          </button>
        </div>
      </form>
    </div>
  );
}
