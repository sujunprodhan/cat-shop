'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navlink = ({ href, children, scrolled }) => {
  const path = usePathname();

  const isHome = path === '/';
  const isActive = href === '/' ? path === '/' : path?.startsWith(href);
  const isDarkBg = isHome && !scrolled;
  const inactiveColor = isDarkBg
    ? 'text-gray-200 hover:text-white'
    : 'text-gray-600 hover:text-gray-900';

  return (
    <Link
      href={href}
      className={`${isActive ? 'text-green-500 font-bold' : `${inactiveColor} font-medium`} transition-colors duration-200`}
    >
      {children}
    </Link>
  );
};

export default Navlink;
