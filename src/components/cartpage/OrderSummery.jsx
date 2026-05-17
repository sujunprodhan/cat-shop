'use client';

import Image from 'next/image';
import { useTheme } from '@/provider/ThemeProvider';

const OrderSummery = ({ item }) => {
  const { title, image, price } = item;
  const { theme } = useTheme();
  const isDark = theme === 'night';

  const headingText = isDark ? 'text-white' : 'text-slate-900';
  const imgBg = isDark ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-200';
  const borderBot = isDark ? 'border-white/5' : 'border-slate-200';

  return (
    <div className={`w-full flex justify-between items-center py-4 border-b group ${borderBot}`}>
      <div className="flex gap-4 items-center">
        <div className={`w-12 h-12 rounded-xl border p-1 overflow-hidden shrink-0 ${imgBg}`}>
          <Image src={image} alt={title} width={48} height={48} className="rounded-lg object-contain h-full w-full group-hover:scale-110 transition-transform" />
        </div>
        <div className="space-y-1">
          <h1 className={`font-bold text-sm line-clamp-1 ${headingText}`}>{title}</h1>
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Premium Item</p>
        </div>
      </div>
      <p className="text-emerald-500 font-black text-lg">${price.toLocaleString()}</p>
    </div>
  );
};

export default OrderSummery;
