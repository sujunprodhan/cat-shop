'use client';

import { handleCart } from '@/actions/server/cart';
import { Check, Loader2, ShoppingCart } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import Swal from 'sweetalert2';
import { useCart } from '@/provider/CartProvider';

const CartButton = ({ product }) => {
  const { updateCartCount } = useCart();
  const { data: session, status } = useSession();

  const path = usePathname();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const isLogin = status === 'authenticated';

  const addToCart = async () => {
    setIsLoading(true);

    if (isLogin) {
      const result = await handleCart({
        product,
        inc: true,
      });

      if (result.success) {
        setIsSuccess(true);
        updateCartCount();

        setTimeout(async () => {
          await Swal.fire({
            icon: 'success',
            title: 'Added to Cart',
            text: `${product.title} added successfully`,
            timer: 1500,
            showConfirmButton: false,
          });

          setIsSuccess(false);
        }, 800);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong!',
        });
      }

      setIsLoading(false);
    } else {
      setIsLoading(false);
      router.push(`/login?callback=${path}`);
    }
  };

  return (
    <div className="w-full">
      <button
        disabled={status === 'loading' || isLoading}
        onClick={addToCart}
        className="w-full group relative bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:cursor-not-allowed text-white py-5 rounded-2xl font-black text-lg transition-all duration-300 shadow-xl shadow-emerald-950/20 active:scale-[0.98] flex items-center justify-center gap-3 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
        
        {isLoading ? (
          <div className="flex items-center gap-3">
            <Loader2 className="animate-spin" size={20} />
            <span className="uppercase tracking-widest text-sm">Processing...</span>
          </div>
        ) : isSuccess ? (
          <div className="flex items-center gap-3">
            <Check size={20} className="text-white" />
            <span className="uppercase tracking-widest text-sm">Added Successfully</span>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <ShoppingCart size={20} className="group-hover:scale-110 transition-transform" />
            <span className="uppercase tracking-widest text-sm">Add To Cart</span>
          </div>
        )}
      </button>
    </div>
  );
};

export default CartButton;
