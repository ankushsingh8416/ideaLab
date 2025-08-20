import React from "react";
import Image from "next/image";
import { Menu, Twitter } from "lucide-react";
import Link from "next/link";

const Navbar = () => {
  return (
    <div className="fixed top-1 w-full z-50 px-4 sm:px-8 md:px-16 lg:px-24 py-4">
      <nav className="bg-white rounded-full px-6 py-3 flex items-center justify-between shadow-md mx-auto">

        {/* Logo */}
        <div className="cursor-pointer flex items-center">
          <Image
            src="/images/logo.png"
            width={40}
            height={40}
            alt="logo"
            className="hover:rotate-12 transition-transform duration-300"
          />
          <span className="font-bold text-black text-lg ml-2">
            <span className="text-2xl bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-amber-600">
              i
            </span>
            deaLab
          </span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-8 items-center">

          <Link
            href="/sources"
            className="text-black hover:text-amber-600 font-medium cursor-pointer"
          >
            Sources
          </Link>
          <Link
            href="/chat"
            className="text-black hover:text-amber-600 font-medium cursor-pointer"
          >
            Chat
          </Link>
          <a
            href="#workspace"
            className="text-black hover:text-amber-600 font-medium cursor-pointer"
          >
            Workspace
          </a>
          <a
            href="#features"
            className="text-black hover:text-amber-600 font-medium cursor-pointer"
          >
            Features
          </a>
          <a
            href="#subscription"
            className="text-black hover:text-amber-600 font-medium cursor-pointer"
          >
            Subscription
          </a>

          <a href="https://x.com/AnkushRajp80867?t=I0PxUl2n7dSK09BllQX-3g&s=09" className="flex gap-2 items-center justify-center bg-gradient-to-r from-amber-400 to-amber-500 cursor-pointer hover:from-amber-500 hover:to-amber-600 text-gray-900 px-6 py-2.5 rounded-full font-semibold shadow-lg">
            <span>Twitter</span>  <Twitter />
          </a>
        </div>

        {/* Mobile Menu Icon */}
        <div className="md:hidden text-gray-800 p-2 rounded-full hover:bg-amber-50 cursor-pointer">
          <Menu />
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
