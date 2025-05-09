"use client";
import Link from "next/link";
import React, { ReactNode, Suspense, useState } from "react";
import LoginStatusDisplay from "./login-status-display";
import SearchComponent from "./search-component";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import MenuIcon from "@mui/icons-material/Menu";
import CartStatusDisplay from "./cart-status-display";
import { Menu } from "@mui/material";
import { Close } from "@mui/icons-material";

const Layout = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  return (
    <>
      <div>
        <nav className="bg-gray-900 p-4">
          <div className="container mx-auto flex items-center justify-between">
            <div className="text-white text-2xl font-bold">
              <a href="/">E-Shop</a>
            </div>

            <Suspense fallback={<p>Loading...</p>}>
              <SearchComponent />
            </Suspense>

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
                <CartStatusDisplay />
              </Link>
              <LoginStatusDisplay />
            </div>

            {/* Mobile Hamburger Icon */}
            <div className="md:hidden text-white ">
              <button onClick={toggleMenu}>
                {menuOpen ? <Close /> : <MenuIcon />}
              </button>
            </div>
          </div>

          {/* Mobile Menu Dropdown */}
          {menuOpen && (
            <div className="md:hidden bg-gray-900 text-white space-y-4 p-4">
              <Link
                href="/"
                className="block hover:text-yellow-500"
                onClick={toggleMenu}
              >
                Home
              </Link>
              {/* <Link
                href="/shop"
                className="block hover:text-yellow-500"
                onClick={toggleMenu}
              >
                Shop
              </Link>
              <Link
                href="/about"
                className="block hover:text-yellow-500"
                onClick={toggleMenu}
              >
                About
              </Link>
              <Link
                href="/contact"
                className="block hover:text-yellow-500"
                onClick={toggleMenu}
              >
                Contact
              </Link> */}
              <Link
                href="/cart"
                className="block hover:text-yellow-500"
                onClick={toggleMenu}
              >
                Cart
              </Link>
              <LoginStatusDisplay />
            </div>
          )}
        </nav>
      </div>
    </>
  );
};

export default Layout;
