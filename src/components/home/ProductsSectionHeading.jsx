'use client';

import { useTheme } from '@/provider/ThemeProvider';

const ProductsSectionHeading = () => {
  const { theme } = useTheme();
  const isDark = theme === 'night';

  return (
    <div className="space-y-4">
      <p className="text-emerald-400 font-black uppercase tracking-[0.4em] text-xs">
        Premium selection
      </p>
      <h2 className={`text-5xl lg:text-6xl font-black tracking-tighter ${isDark ? 'text-white' : 'text-slate-900'}`}>
        Featured{' '}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400">
          Products
        </span>
      </h2>
    </div>
  );
};

export default ProductsSectionHeading;
