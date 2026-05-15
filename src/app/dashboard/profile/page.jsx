'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { User, Mail, Lock, Camera, Loader2, Save } from 'lucide-react';
import Swal from 'sweetalert2';
import { updateUser } from '@/actions/server/auth';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
    if (session?.user) {
      setValue('name', session.user.name || '');
      setValue('email', session.user.email || ''); // Email should typically be readonly
      if (session.user.image) {
        setPreview(session.user.image);
      }
    }
  }, [session, status, router, setValue]);

  const uploadImageToImgbb = async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY || '801df07212c14c5c7db6a2aee813d11b'; 
    try {
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) return data.data.url;
    } catch (error) {
      console.error('Image upload failed', error);
    }
    return null;
  };

  const onSubmit = async (data) => {
    try {
      let imageUrl = session?.user?.image || '';
      
      if (imageFile) {
        setIsUploading(true);
        const uploadedUrl = await uploadImageToImgbb(imageFile);
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        }
        setIsUploading(false);
      }

      const updatePayload = {
        email: session.user.email, // Use session email to find the user
        name: data.name,
        image: imageUrl,
      };

      if (data.password) {
        updatePayload.password = data.password;
      }

      const result = await updateUser(updatePayload);

      if (result.success) {
        // Force session update in next-auth to reflect changes immediately
        await update({ name: data.name, image: imageUrl });
        
        Swal.fire({
          icon: 'success',
          title: 'Profile Updated!',
          text: 'Your profile has been successfully updated.',
          confirmButtonColor: '#3b82f6',
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Update Failed',
          text: result.error || 'Could not update your profile.',
          confirmButtonColor: '#ef4444',
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'An unexpected error occurred.',
        confirmButtonColor: '#ef4444',
      });
      setIsUploading(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-[2rem] p-8 overflow-hidden relative shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px]"></div>
        
        <div className="relative z-10 mb-8">
          <h2 className="text-3xl font-black text-white mb-2">My Profile</h2>
          <p className="text-slate-400">Update your personal information and settings.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="relative z-10 space-y-8">
          
          {/* Profile Picture Section */}
          <div className="flex flex-col sm:flex-row items-center gap-6 pb-8 border-b border-white/5">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-slate-800 bg-slate-800 relative shadow-2xl">
                {preview ? (
                  <img src={preview} alt="Profile Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-800">
                    <User className="w-12 h-12 text-slate-500" />
                  </div>
                )}
                
                {/* Upload Overlay */}
                <label className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer backdrop-blur-sm">
                  <Camera className="w-8 h-8 text-white mb-1" />
                  <span className="text-[10px] text-white font-bold uppercase tracking-wider">Change</span>
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setImageFile(e.target.files[0]);
                        setPreview(URL.createObjectURL(e.target.files[0]));
                      }
                    }}
                  />
                </label>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-1">Profile Picture</h3>
              <p className="text-sm text-slate-400 mb-4 max-w-sm">
                We support PNG, JPG or WEBP. Max size of 5MB. Click on the image to change it.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Name Field */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <User size={14} className="text-blue-400" /> Full Name
              </label>
              <input
                type="text"
                {...register('name', { required: 'Name is required' })}
                className="w-full bg-slate-800/50 border border-white/10 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 rounded-xl px-5 py-3.5 outline-none transition-all duration-300 text-white placeholder:text-slate-600 font-medium"
                placeholder="John Doe"
              />
              {errors.name && <p className="text-rose-400 text-xs font-medium mt-1">{errors.name.message}</p>}
            </div>

            {/* Email Field (Readonly) */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Mail size={14} className="text-blue-400" /> Email Address
              </label>
              <input
                type="email"
                {...register('email')}
                disabled
                className="w-full bg-slate-900/80 border border-white/5 rounded-xl px-5 py-3.5 text-slate-500 font-medium cursor-not-allowed"
                title="Email cannot be changed"
              />
            </div>

            {/* New Password Field */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Lock size={14} className="text-blue-400" /> New Password (Optional)
              </label>
              <input
                type="password"
                {...register('password', { minLength: { value: 6, message: 'Minimum 6 characters' }})}
                className="w-full bg-slate-800/50 border border-white/10 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 rounded-xl px-5 py-3.5 outline-none transition-all duration-300 text-white placeholder:text-slate-600 font-medium"
                placeholder="Leave blank to keep current password"
              />
              {errors.password && <p className="text-rose-400 text-xs font-medium mt-1">{errors.password.message}</p>}
            </div>
          </div>

          <div className="pt-6 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting || isUploading}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white px-8 py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-blue-900/20 active:scale-95"
            >
              {(isSubmitting || isUploading) ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Save className="w-5 h-5" />
              )}
              {isUploading ? 'Uploading Image...' : isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
