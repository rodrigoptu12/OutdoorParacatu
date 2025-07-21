// components/Header.jsx
import React from "react";
import Image from "next/image";
import Link from "next/link";
import Logo from "@/assets/Logo.png";
const Header = () => {
  return (
    // <header className="w-full bg-slate-300/50 py-4 flex justify-center items-center">
    <header className="sticky top-0 w-full bg-slate-300/50 backdrop-blur-sm py-4 flex justify-center items-center z-50 transition-all duration-300">
      <Link
        href="/"
        className="flex items-center justify-center text-gray-800 hover:text-green-600 transition duration-300"
      >
        <div className="relative">
          <Image
            src={Logo}
            alt="Logo Multi Mídia Outdoor"
            width={120}
            height={45}
            className="w-32 h-auto"
          />
        </div>
        <span className="text-3xl font-bold text-green-600 ml-2">
          Midia outdoor
        </span>
      </Link>
    </header>
  );
};

export default Header;
