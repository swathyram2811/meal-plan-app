"use client"

import { SignedIn, SignedOut, SignOutButton, useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";



const Navbar = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  if (!isLoaded) return <p>...Loading </p>;
  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Brand / Logo */}
        <Link href="/">
          <Image
            className="text-xl font-bold text-blue-700 cursor-pointer"
            src="/logo.png" // Ensure this path is correct or replace with your logo path
            width={60}
            height={60}
            alt="Logo"
          />
        </Link>

        {/* Navigation Links */}
        <div className="space-x-6 flex items-center">
          {/* Authentication Buttons */}
          <SignedIn>
            <Link
              href="/mealplan"
              className="text-gray-700 hover:text-blue-500 transition-colors"
            >
              Mealplan
            </Link>
            {/* Profile Picture */}
            {user?.imageUrl ? (
              <Link href="/profile">
                <Image
                  src={user.imageUrl}
                  alt="Profile Picture"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              </Link>
            ) : (
              // Placeholder for users without a profile picture
              <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
            )}

            {/* Sign Out Button */}
            <SignOutButton>
              <button className="ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
                Sign Out
              </button>
            </SignOutButton>
          </SignedIn>

          <SignedOut>
            <Link
              href="/"
              className="text-gray-700 hover:text-blue-500 transition-colors"
            >
              Home
            </Link>
            <Link
              href={isSignedIn ? "/subscribe" : "/sign-up"}
              className="text-gray-700 hover:text-blue-500 transition-colors"
            >
              Subscribe
            </Link>

            <Link
              href="/sign-up"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              Sign Up
            </Link>
          </SignedOut>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;