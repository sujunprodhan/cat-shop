'use client';
import { Menu, X, Search, ShoppingCart } from 'lucide-react';
import Navlink from './buttons/NavLink';
import { useState } from 'react';
import Link from 'next/link';
import AuthButton from './buttons/AuthButton';

const Navbar = () => {
  const [open, setOpen] = useState(false);

  const navItems = (
    <>
      <li>
        <Navlink href="/">Home</Navlink>
      </li>
      <li>
        <Navlink href="/about">About</Navlink>
      </li>
      <li>
        <Navlink href="/products">Products</Navlink>
      </li>
      <li>
        <Navlink href="/contact">Contact</Navlink>
      </li>
    </>
  );

  return (
    <nav className="w-full shadow-md bg-white">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="text-3xl font-bold text-green-600">
          CAT<span className="text-gray-600">SHOP</span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 list-none">
          <div className="flex gap-6">{navItems}</div>
          <Link href="/cart">
            <ShoppingCart size={18} className="text-green-500" />
          </Link>
          {/* Search Icon */}
          <Search className="w-5 h-5 cursor-pointer items-center text-gray-600 hover:text-black" />

          {/* Auth Buttons */}
          <div>
            <AuthButton></AuthButton>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden px-4 pb-4 space-y-4 list-none">
          <div className="flex flex-col gap-3 items-center">{navItems}</div>

          <div className="flex items-center gap-4">
            <Search className="w-5 h-5 text-gray-600" />
            <span className="text-gray-600 items-center">Search</span>
          </div>

          <div className="flex flex-col gap-2">
            <Link
              href="/login"
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Register
            </Link>
            <Link
              href="/register"
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Register
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
