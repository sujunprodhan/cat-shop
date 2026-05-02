'use client';

import { useState, useTransition } from 'react';
import { Star } from 'lucide-react';

const ProductTabs = ({ productId, description, reviews = [] }) => {
  const [activeTab, setActiveTab] = useState('description');
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState('');

  const [formData, setFormData] = useState({
    name: '',
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

    startTransition(async () => {
      try {
        await addProductReview(productId, formData);

        setMessage(' Review submitted successfully!');
        setActiveTab('reviews');

        setFormData({
          name: '',
          rating: 5,
          comment: '',
        });

        // message auto hide
        setTimeout(() => setMessage(''), 3000);
      } catch (error) {
        setMessage('❌ Failed to submit review');
      }
    });
  };

  return (
    <div className="bg-white shadow-xl overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-gray-400">
        <button
          onClick={() => setActiveTab('description')}
          className={`px-4 py-2  text-gray-900 font-semibold transition ${
            activeTab === 'description'
              ? 'bg-green-500 text-white border-b-2 border-green-600'
              : 'text-gray-500 hover:text-black'
          }`}
        >
          Product Description
        </button>

        <button
          onClick={() => setActiveTab('reviews')}
          className={`px-6 py-4 font-semibold transition ${
            activeTab === 'reviews'
              ? 'bg-green-500 text-white border-b-2 border-green-600'
              : 'text-gray-500 hover:text-black'
          }`}
        >
          Product Reviews
        </button>
      </div>

      <div className="p-8">
        {/* Message */}
        {message && (
          <div className="mb-4 p-3 rounded-lg bg-green-100 text-green-700 text-sm font-medium">
            {message}
          </div>
        )}

        {/* Description */}
        {activeTab === 'description' && (
          <p className="text-gray-600 leading-8 text-lg">
            {description || 'No description available.'}
          </p>
        )}

        {/* Reviews */}
        {activeTab === 'reviews' && (
          <div className="grid lg:grid-cols-2 gap-10">
            {/* Review List */}
            <div className="space-y-4">
              {reviews.length > 0 ? (
                reviews.map((review, index) => (
                  <div key={index} className="p-5 border rounded-xl bg-gray-50">
                    <div className="flex justify-between mb-2">
                      <h3 className="font-semibold">{review.name || 'Anonymous'}</h3>

                      <div className="flex text-yellow-500">
                        {Array.from({
                          length: Number(review.rating) || 0,
                        }).map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-current" />
                        ))}
                      </div>
                    </div>

                    <p className="text-gray-600">{review.comment || 'No comment'}</p>
                  </div>
                ))
              ) : (
                <div className="p-6 border rounded-xl text-center text-gray-500">
                  No reviews yet. Be the first one!
                </div>
              )}
            </div>

            {/* Review Form */}
            <form
              onSubmit={handleSubmit}
              className="space-y-4 border rounded-2xl p-6 border-gray-200 bg-gray-50"
            >
              <h3 className="text-xl font-bold mb-2">Write a Review</h3>

              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your Name"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 outline-none"
                required
              />

              <select
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 outline-none"
              >
                <option value={5}>⭐⭐⭐⭐⭐ </option>
                <option value={4}>⭐⭐⭐⭐ </option>
                <option value={3}>⭐⭐⭐ </option>
                <option value={2}>⭐⭐ </option>
                <option value={1}>⭐ </option>
              </select>

              <textarea
                name="comment"
                value={formData.comment}
                onChange={handleChange}
                rows={4}
                placeholder="Write your review..."
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 outline-none"
                required
              />

              <button
                type="submit"
                disabled={isPending}
                className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-bold transition active:scale-95"
              >
                {isPending ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductTabs;
