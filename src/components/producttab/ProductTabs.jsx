'use client';

import { useState, useTransition } from 'react';
import { Star, MessageSquare, Info, User, Calendar, Send } from 'lucide-react';
import { addProductReview } from '@/actions/server/product';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

const ProductTabs = ({ productId, description, reviews = [] }) => {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('description');
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  // Handle case where reviews might be a number (legacy) or an array
  const reviewsArray = Array.isArray(reviews) ? reviews : [];
  const reviewCount = reviewsArray.length;

  const [formData, setFormData] = useState({
    rating: 5,
    comment: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!session) {
      Swal.fire('Please Login', 'You must be logged in to post a review.', 'warning');
      return;
    }

    startTransition(async () => {
      const res = await addProductReview(productId, formData);
      if (res.success) {
        Swal.fire({
          icon: 'success',
          title: 'Review Submitted!',
          text: 'Thank you for your feedback.',
          background: '#0f172a',
          color: '#fff',
          confirmButtonColor: '#10b981'
        });
        
        setFormData({ rating: 5, comment: '' });
        router.refresh();
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: res.message,
          background: '#0f172a',
          color: '#fff',
        });
      }
    });
  };

  const tabs = [
    { id: 'description', label: 'Description', icon: Info },
    { id: 'reviews', label: `Reviews (${reviewCount})`, icon: MessageSquare },
  ];

  return (
    <div className="mt-16 bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
      {/* Tab Navigation */}
      <div className="flex border-b border-white/5 px-4 md:px-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative flex items-center gap-2 px-6 py-6 font-bold text-sm transition-all duration-300 ${
              activeTab === tab.id ? 'text-emerald-400' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <tab.icon size={18} />
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full"></div>
            )}
          </button>
        ))}
      </div>

      <div className="p-8 md:p-12">
        {/* Description Tab */}
        {activeTab === 'description' && (
          <div className="animate-in fade-in slide-in-from-left-4 duration-500">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              Product <span className="text-emerald-400">Details</span>
            </h3>
            <div className="text-slate-400 leading-relaxed text-lg space-y-4 max-w-4xl">
              {description ? (
                description.split('\n').map((para, i) => (
                  <p key={i}>{para}</p>
                ))
              ) : (
                <p>No detailed description available for this premium feline friend.</p>
              )}
            </div>
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="grid lg:grid-cols-12 gap-12">
              {/* Review List */}
              <div className="lg:col-span-7 space-y-6">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-bold text-white">Customer Feedback</h3>
                  <div className="flex items-center gap-2 bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20">
                    <Star className="w-4 h-4 text-emerald-400 fill-emerald-400" />
                    <span className="text-sm font-bold text-emerald-400">
                      {reviewCount > 0 
                        ? (reviewsArray.reduce((acc, r) => acc + r.rating, 0) / reviewCount).toFixed(1)
                        : '0.0'}
                    </span>
                  </div>
                </div>

                {reviewCount > 0 ? (
                  <div className="space-y-6 max-h-[600px] overflow-y-auto pr-4 custom-scrollbar">
                    {reviewsArray.map((review, index) => (
                      <div key={index} className="p-6 bg-white/5 border border-white/5 rounded-2xl hover:border-white/10 transition-colors group">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center border border-white/10 overflow-hidden bg-slate-800">
                              {review.image ? (
                                <Image src={review.image} alt={review.name} width={40} height={40} className="w-full h-full object-cover" />
                              ) : (
                                <User size={18} className="text-slate-300" />
                              )}
                            </div>
                            <div>
                              <h4 className="font-bold text-white text-sm">{review.name || 'Premium Buyer'}</h4>
                              <div className="flex items-center gap-2 text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-0.5">
                                <Calendar size={10} />
                                {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : 'Recent'}
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                size={12} 
                                className={`${i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-slate-700'}`} 
                              />
                            ))}
                          </div>
                        </div>

                        <p className="text-slate-400 text-sm leading-relaxed group-hover:text-slate-300 transition-colors">
                          {review.comment || 'No specific comment provided.'}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 bg-white/5 border border-dashed border-white/10 rounded-3xl text-center">
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                      <MessageSquare className="text-slate-600" size={32} />
                    </div>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No reviews yet. Be the first!</p>
                  </div>
                )}
              </div>

              {/* Review Form */}
              <div className="lg:col-span-5">
                <div className="bg-gradient-to-br from-emerald-500/5 to-blue-500/5 border border-white/10 rounded-3xl p-8 sticky top-8">
                  {session ? (
                    <>
                      <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 rounded-2xl overflow-hidden border border-emerald-500/30 bg-slate-800">
                          {session.user.image ? (
                            <Image src={session.user.image} alt={session.user.name} width={48} height={48} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-emerald-400">
                              <User size={20} />
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-white leading-none">Hi, {session.user.name.split(' ')[0]}!</h3>
                          <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest mt-1">Posting as Verified Buyer</p>
                        </div>
                      </div>

                      <form onSubmit={handleSubmit} className="space-y-6">

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Select Rating</label>
                      <div className="relative">
                        <select
                          name="rating"
                          value={formData.rating}
                          onChange={handleChange}
                          className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-4 text-sm text-white focus:border-emerald-500/50 outline-none appearance-none transition-all"
                        >
                          <option value={5}>★★★★★ (Perfect)</option>
                          <option value={4}>★★★★☆ (Very Good)</option>
                          <option value={3}>★★★☆☆ (Good)</option>
                          <option value={2}>★★☆☆☆ (Fair)</option>
                          <option value={1}>★☆☆☆☆ (Poor)</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                          <Star size={16} className="text-emerald-500" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Detailed Review</label>
                      <textarea
                        name="comment"
                        value={formData.comment}
                        onChange={handleChange}
                        rows={4}
                        placeholder="Tell us what you loved about this cat..."
                        className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-4 text-sm text-white focus:border-emerald-500/50 outline-none transition-all resize-none"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isPending}
                      className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-4 rounded-xl font-black text-sm uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-950/40"
                    >
                      {isPending ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      ) : (
                        <>
                          Submit Review
                          <Send size={16} />
                        </>
                      )}
                    </button>
                  </form>
                    </>
                  ) : (
                    <div className="text-center py-10">
                      <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6 text-slate-500">
                        <Lock size={32} />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">Login to Review</h3>
                      <p className="text-slate-500 text-sm mb-8 px-4">Only verified users can share their experience with our products.</p>
                      <button 
                        onClick={() => router.push('/login')}
                        className="w-full bg-white text-slate-950 py-4 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-emerald-400 transition-colors shadow-xl"
                      >
                        Sign In Now
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductTabs;
