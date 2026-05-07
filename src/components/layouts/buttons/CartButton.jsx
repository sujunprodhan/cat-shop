'use client';

import { handleCart } from '@/actions/server/cart';
import { Eye } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import Swal from 'sweetalert2';

const CartButton = ({ product }) => {
  const session = useSession();
  const path = usePathname();
  const router = useRouter();
  const isLogin = session?.status == 'authenticated';

  const addToCart = async () => {
    if (isLogin) {
      const user = session?.data?.user;
      const result = await handleCart({ product, inc: true, user });
      if (result.success) {
        Swal.fire('Product added', product.title, 'success');
      } else {
        Swal.fire('Ops', 'SomeThing Is Wrong', 'error');
      }
    } else {
      router.push(`/login?callback=${path}`);
    }
  };
  return (
    <div>
      <button
        onClick={addToCart}
        className="w-full bg-white/90 backdrop-blur text-green-700 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold hover:bg-green-600 hover:text-white transition-colors shadow-lg border border-green-100"
      >
        Add To Cart
        <Eye size={18} />
      </button>
    </div>
  );
};

export default CartButton;
