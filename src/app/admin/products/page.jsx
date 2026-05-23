'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { useTheme } from '@/provider/ThemeProvider';
import { getProducts, deleteProduct } from '@/actions/server/product';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';

export default function AdminProductsPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === 'night';
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await getProducts(page, 10, search);
      setProducts(res.products || []);
      setTotalPages(res.pages || 1);
    } catch (error) {
      Swal.fire('Error', 'Failed to load products', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, search]);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      const res = await deleteProduct(id);
      if (res.success) {
        Swal.fire('Deleted!', res.message, 'success');
        fetchProducts();
      } else {
        Swal.fire('Error!', res.message, 'error');
      }
    }
  };

  const bgCls = isDark ? 'bg-slate-900 border-white/10' : 'bg-white border-slate-200';
  const textCls = isDark ? 'text-white' : 'text-slate-900';
  const textMuted = isDark ? 'text-slate-400' : 'text-slate-500';
  const inputBg = isDark ? 'bg-slate-800 border-white/10 text-white placeholder:text-slate-500' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400';
  const tableHead = isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-50 text-slate-600';
  const tableBorder = isDark ? 'border-white/5' : 'border-slate-100';

  return (
    <div className="md:w-11/12 mx-auto px-6 py-10 space-y-6">
      <button 
        onClick={() => router.back()} 
        className={`flex items-center gap-2 mb-4 w-fit px-4 py-2 rounded-lg font-semibold transition-colors ${isDark ? 'bg-white/5 hover:bg-white/10 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-900'}`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
        Back
      </button>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className={`text-2xl font-black ${textCls}`}>Manage Products</h1>
        <Link href="/admin/products/new" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors w-full sm:w-auto">
          <Plus size={18} /> Add Product
        </Link>
      </div>

      <div className={`p-6 rounded-[2rem] border shadow-sm ${bgCls}`}>
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 ${textMuted}`} size={18} />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className={`w-full pl-10 pr-4 py-2 rounded-xl outline-none border focus:border-blue-500 transition-colors ${inputBg}`}
            />
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-white/5">
          <table className="w-full min-w-[800px] text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className={tableHead}>
                <th className="p-4 font-semibold text-sm">Product</th>
                <th className="p-4 font-semibold text-sm">Category</th>
                <th className="p-4 font-semibold text-sm">Price</th>
                <th className="p-4 font-semibold text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className={`p-8 text-center ${textMuted}`}>Loading products...</td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan="4" className={`p-8 text-center ${textMuted}`}>No products found.</td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product._id} className={`border-b last:border-0 ${tableBorder} hover:bg-black/5`}>
                    <td className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                          <Image src={product.image} alt={product.title} fill className="object-cover" />
                        </div>
                        <p className={`font-semibold text-sm line-clamp-1 max-w-[200px] ${textCls}`}>{product.title}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-3 py-1 bg-blue-500/10 text-blue-500 rounded-full text-xs font-bold uppercase tracking-wider">
                        {product.category}
                      </span>
                    </td>
                    <td className={`p-4 font-bold ${textCls}`}>${product.price}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Link href={`/admin/products/${product._id}`} className="p-2 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white rounded-lg transition-colors">
                          <Edit size={16} />
                        </Link>
                        <button onClick={() => handleDelete(product._id)} className="p-2 bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white rounded-lg transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors ${page === 1 ? 'opacity-50 cursor-not-allowed bg-slate-800 text-slate-500' : 'bg-slate-800 text-white hover:bg-slate-700'}`}
            >
              Prev
            </button>
            <span className={`px-4 py-2 font-bold ${textCls}`}>{page} / {totalPages}</span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors ${page === totalPages ? 'opacity-50 cursor-not-allowed bg-slate-800 text-slate-500' : 'bg-slate-800 text-white hover:bg-slate-700'}`}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
