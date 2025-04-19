import Link from "next/link";
import React, { ReactNode } from "react";
import LoginStatusDisplay from "../Header/login-status-display";
import SearchComponent from "./search-component";

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
              <SearchComponent />
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
              <Link href="/cart" className="hover:text-yellow-500">
                Cart
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
