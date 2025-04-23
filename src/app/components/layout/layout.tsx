import Link from "next/link";
import React, { ReactNode, Suspense } from "react";
import LoginStatusDisplay from "../Header/login-status-display";
import SearchComponent from "./search-component";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const Layout = () => {
  return (
    <>
      <div>
        <nav className="bg-gray-900 p-4">
          <div className="container mx-auto flex items-center justify-between">
            <div className="text-white text-2xl font-bold">
              <a href="/">E-Shop</a>
            </div>

            <div className="flex items-center space-x-2 w-1/3">
              <Suspense fallback={<p>Loading...</p>}>
                <SearchComponent />
              </Suspense>
            </div>

            <div className="hidden md:flex space-x-8 text-white">
              <Link href="/" className="hover:text-yellow-500">
                Home
              </Link>
              {/* <Link href="/shop" className="hover:text-yellow-500">
                Shop
              </Link>
              <Link href="/about" className="hover:text-yellow-500">
                About
              </Link>
              <Link href="/contact" className="hover:text-yellow-500">
                Contact
              </Link> */}
              <Link href="/cart" className="relative hover:text-yellow-500">
                <div className="relative flex pr-2">
                  Cart
                  <ShoppingCartIcon/>
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full -mt-2 -mr-2">
                    3
                  </span>
                </div>
              </Link>
              <LoginStatusDisplay />
            </div>
          </div>
        </nav>

        <div className="md:hidden bg-gray-900 text-white space-y-4 p-4">
          <a href="/" className="block">
            Home
          </a>
          <a href="/shop" className="block">
            Shop
          </a>
          <a href="/about" className="block">
            About
          </a>
          <a href="/contact" className="block">
            Contact
          </a>
          <a href="/cart" className="block">
            Cart
          </a>
        </div>
      </div>
    </>
  );
};

export default Layout;
