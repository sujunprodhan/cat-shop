'use client';

import React from 'react';
import { useTheme } from '@/provider/ThemeProvider';
import { Search, SlidersHorizontal, Sparkles } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getSuggestions } from '@/actions/server/product';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

const ProductHero = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchContainerRef = useRef(null);
  const { theme } = useTheme();
  const isDark = theme === 'night';

  const [searchValue, setSearchValue] = useState(searchParams.get('search') || '');
  const [sortValue, setSortValue] = useState(searchParams.get('sort') || '');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const updateUrl = (search, sort) => {
    const params = new URLSearchParams(searchParams);
    if (search) params.set('search', search); else params.delete('search');
    if (sort) params.set('sort', sort); else params.delete('sort');
    params.set('page', '1');
    router.push(`/products?${params.toString()}`);
  };

  useEffect(() => { setSearchValue(searchParams.get('search') || ''); }, [searchParams]);

  useEffect(() => {
    const handler = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) setShowSuggestions(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const isFirstRender = useRef(true);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchValue.trim() === '' && searchParams.get('search')) {
        updateUrl('', sortValue); setSuggestions([]); setShowSuggestions(false); return;
      }
      if (isFirstRender.current) { isFirstRender.current = false; return; }
      if (searchValue.trim().length > 1) {
        try {
          const data = await getSuggestions(searchValue);
          const filtered = data.filter(s => s.title.toLowerCase() !== searchValue.toLowerCase());
          const sorted = filtered.sort((a, b) => {
            const q = searchValue.toLowerCase();
            const aS = a.title.toLowerCase().startsWith(q);
            const bS = b.title.toLowerCase().startsWith(q);
            if (aS && !bS) return -1; if (!aS && bS) return 1; return 0;
          });
          setSuggestions(sorted);
          if (document.activeElement === document.getElementById('product-search') && sorted.length > 0)
            setShowSuggestions(true);
          else setShowSuggestions(false);
        } catch {}
      } else { setSuggestions([]); setShowSuggestions(false); }
    };
    const t = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(t);
  }, [searchValue]);

  const handleSearch = (e) => { e?.preventDefault(); setShowSuggestions(false); updateUrl(searchValue, sortValue); };
  const handleSuggestionClick = (s) => { setSearchValue(s); setShowSuggestions(false); updateUrl(s, sortValue); };
  const handleSortChange = (v) => { setSortValue(v); updateUrl(searchValue, v); };

  /* ── Theme tokens ── */
  const heading  = isDark ? 'text-white' : 'text-slate-900';
  const badgeBg  = isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-100 border-slate-200 text-slate-700';
  const inputBg  = isDark
    ? 'bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:ring-emerald-500/10 focus:border-emerald-500/50'
    : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:ring-emerald-500/10 focus:border-emerald-400';
  const dropBg   = isDark ? 'bg-slate-900/90 border-white/10' : 'bg-white border-slate-200 shadow-xl';
  const dropItem = isDark ? 'text-slate-300 hover:text-white hover:bg-white/5 border-white/5' : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50 border-slate-100';
  const dropFoot = isDark ? 'bg-white/5 text-slate-400' : 'bg-slate-50 text-slate-500';
  const imgThumb = isDark ? 'bg-slate-800 border-white/10 group-hover:border-emerald-500/50' : 'bg-slate-100 border-slate-200 group-hover:border-emerald-400';
  const selectBg = isDark
    ? 'bg-white/5 border-white/10 text-white focus:ring-emerald-500/10 focus:border-emerald-500/50'
    : 'bg-white border-slate-200 text-slate-900 focus:ring-emerald-500/10 focus:border-emerald-400';
  const optBg    = isDark ? 'bg-slate-900' : 'bg-white';

  return (
    <section className="relative pt-10 pb-20 overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 blur-[120px] rounded-full -mr-64 -mt-64" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-500/5 blur-[100px] rounded-full -ml-32 -mb-32" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center text-center space-y-8">

          {/* Badge */}
          <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-full backdrop-blur-xl border font-black uppercase tracking-[0.3em] text-[10px] ${badgeBg}`}>
            <Sparkles size={14} className="text-emerald-400" /> Professional Grade
          </div>

          {/* Title */}
          <h1 className={`text-6xl lg:text-8xl font-black tracking-tighter leading-[0.9] ${heading}`}>
            The Premium <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400">Collection</span>
          </h1>

          {/* Search & Filter */}
          <div className="w-full max-w-4xl flex flex-col lg:flex-row items-center gap-4 pt-8">
            <div ref={searchContainerRef} className="relative flex-1 w-full">
              <form onSubmit={handleSearch} className="relative group w-full">
                <Search className={`absolute left-6 top-1/2 -translate-y-1/2 group-focus-within:text-emerald-400 transition-colors ${isDark ? 'text-slate-500' : 'text-slate-400'}`} size={20} />
                <input
                  id="product-search"
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onFocus={() => searchValue.length > 1 && setShowSuggestions(true)}
                  placeholder="Search premium products..."
                  className={`w-full border rounded-2xl px-16 py-5 outline-none focus:ring-4 transition-all font-medium ${inputBg}`}
                />
                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-white font-black uppercase tracking-widest text-[10px] transition-all shadow-lg shadow-emerald-500/20">
                  Search
                </button>
              </form>

              {/* Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className={`absolute top-full left-0 w-full mt-2 p-2 backdrop-blur-2xl border rounded-3xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300 ${dropBg}`}>
                  <div className="py-2">
                    {suggestions.map((product, i) => (
                      <button
                        key={i}
                        onClick={() => handleSuggestionClick(product.title)}
                        className={`w-full flex items-center gap-5 px-6 py-4 text-left transition-all group border-b last:border-0 ${dropItem}`}
                      >
                        <div className={`relative w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 border transition-all ${imgThumb}`}>
                          <Image src={product.image} alt={product.title} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-black text-sm tracking-tight truncate group-hover:text-emerald-400 transition-colors">{product.title}</h4>
                          <p className="text-emerald-500 font-black text-xs mt-1">${product.price}</p>
                        </div>
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all ${isDark ? 'bg-white/5' : 'bg-slate-100'}`}>
                          <Search size={14} className="text-emerald-400" />
                        </div>
                      </button>
                    ))}
                  </div>
                  <div className={`p-4 ${dropFoot}`}>
                    <p className="text-[10px] font-bold italic">Press Enter to see all results</p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-4 w-full lg:w-auto">
              <div className="relative group w-full lg:w-64">
                <SlidersHorizontal className={`absolute left-5 top-1/2 -translate-y-1/2 pointer-events-none ${isDark ? 'text-slate-500' : 'text-slate-400'}`} size={18} />
                <select
                  value={sortValue}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className={`w-full border rounded-2xl pl-14 pr-6 py-5 outline-none focus:ring-4 transition-all font-bold appearance-none cursor-pointer text-sm ${selectBg}`}
                >
                  <option value=""       className={optBg}>Default Sorting</option>
                  <option value="price_asc"  className={optBg}>Price: Low to High</option>
                  <option value="price_desc" className={optBg}>Price: High to Low</option>
                </select>
                <div className={`absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>↓</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductHero;
