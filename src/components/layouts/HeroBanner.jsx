import React from 'react';

const HeroBanner = () => {
  return (
    <div className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1600585154340-be6161a56a26?q=80&w=2070')",
          // Replace with your own high-quality background image URL
        }}
      >
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center h-full py-20">
        {/* Left Side - Content */}
        <div className="space-y-8 text-white">
          <div className="space-y-4">
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
              Premium Quality <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                Products
              </span>
            </h1>

            <p className="text-xl text-gray-200 max-w-lg">
              Discover exceptional products crafted with precision and care. Elevate your lifestyle
              with premium quality and timeless design.
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <button className="px-8 py-4 bg-white text-black font-semibold rounded-xl hover:bg-gray-100 transition-all duration-300 flex items-center gap-2 text-lg shadow-lg hover:shadow-xl">
              Shop Now
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7-7 7"
                />
              </svg>
            </button>

            <button className="px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-black transition-all duration-300 text-lg">
              Learn More
            </button>
          </div>

          {/* Trust signals */}
          <div className="flex items-center gap-8 text-sm pt-6">
            <div className="flex items-center gap-2">
              <span className="text-green-400">✓</span>
              <span>Free Shipping</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-400">✓</span>
              <span>30-Day Guarantee</span>
            </div>
          </div>
        </div>

        {/* Right Side - Product Image */}
        <div className="relative flex justify-center lg:justify-end">
          <div className="relative">
            {/* Main Product Image */}
            <img
              src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070"
              alt="Premium Product"
              className="w-full max-w-[520px] h-auto rounded-3xl shadow-2xl object-contain drop-shadow-2xl"
            />

            {/* Decorative floating elements */}
            <div className="absolute -top-6 -right-6 bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/20 shadow-xl">
              <p className="text-white font-medium">⭐ 4.9</p>
              <p className="text-xs text-gray-300">1,245 reviews</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
