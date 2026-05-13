'use client';

import { handleCart } from '@/actions/server/cart';
import { Check, Loader2, ShoppingCart } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import Swal from 'sweetalert2';

const CartButton = ({ product }) => {
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
    <div>
      <button
        disabled={status === 'loading' || isLoading}
        onClick={addToCart}
        className="w-full bg-white/90 px-5 py-3 backdrop-blur text-green-700 flex items-center justify-center gap-2 rounded-xl font-semibold hover:bg-green-600 hover:text-white transition-all shadow-lg border border-green-100 disabled:opacity-70"
      >
        {isLoading ? (
          <>
            <Loader2 className="animate-spin" size={18} />
            Adding...
          </>
        ) : isSuccess ? (
          <>
            <Check size={18} />
            Added
          </>
        ) : (
          <>
            <ShoppingCart size={18} />
            Add To Cart
          </>
        )}
      </button>
    </div>
  );
};

export default CartButton;
