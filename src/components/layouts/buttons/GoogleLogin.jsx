'use client';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { signIn } from 'next-auth/react';
import Swal from 'sweetalert2';
import { useSearchParams } from 'next/navigation';

const GoogleLogin = () => {
  const params = useSearchParams();
  const handleSignIn = async () => {
    const result = await signIn('google', {
      redirect: false,
      callbackUrl: params.get('callback') || '/',
    });
    

    if (result.ok) {
      Swal.fire('success', 'welcome to catshop', 'success');
    } else {
      Swal.error('error', 'please log in here', 'error');
    }
  };

  return (
    <div>
      <motion.button
        type="button"
        onClick={handleSignIn}
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.02 }}
        className="w-full flex items-center justify-center gap-2 bg-white text-black py-3 rounded-lg font-semibold hover:bg-gray-200 transition mt-2"
      >
        <Image
          width={20}
          height={20}
          src="https://www.svgrepo.com/show/475656/google-color.svg"
          alt="Google"
          className="w-5 h-5"
        />
        Continue with Google
      </motion.button>
    </div>
  );
};

export default GoogleLogin;
