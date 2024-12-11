"use client";

import { verifyToken } from "@/lib/users";
import { jwtDecode } from "jwt-decode";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const [token, setToken] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const tokenData = async () => {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        const tokenPayload = await verifyToken();
        setToken(storedToken);
        setIsAdmin(tokenPayload?.isAdmin || false);
      }
    };
    tokenData();
  }, [pathname, token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    document.cookie = "token=; path=/; max-age=0;";
    setToken(null);
    toast.success("user logged out succesfully..");
    router.push("/login");
  };

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50 border-b border-gray-300">
      <div className="container mx-auto flex justify-between items-center px-8 py-4 max-w-screen-xl">
        <div className="logo flex items-center space-x-2">
          <img src="/peer-to-peer.png" alt="Lendify Logo" className="h-10" />
          <a href="/">
            <span className="text-lg font-bold text-gray-800">Lendify</span>
          </a>
        </div>

        <nav className="flex space-x-8">
          {!isAdmin && token && (
            <>
              <a
                href="/user/dashboard"
                className="text-gray-600 hover:text-blue-600 font-medium"
              >
                Dashboard
              </a>
              <a
                href="/user/applied-loans"
                className="text-gray-600 hover:text-blue-600 font-medium"
              >
                Applied Loans
              </a>
              <a
                href="/user/active-loans"
                className="text-gray-600 hover:text-blue-600 font-medium"
              >
                Active Loans
              </a>
              <a
                href="/user/pay-emi"
                className="text-gray-600 hover:text-blue-600 font-medium"
              >
                Pay EMI
              </a>

              <a
                href="/user/queries"
                className="text-gray-600 hover:text-blue-600 font-medium"
              >
                Queries
              </a>
            </>
          )}
          {isAdmin && token && (
            <>
              <a
                href="/admin/dashboard"
                className="text-gray-600 hover:text-blue-600 font-medium"
              >
                Dashboard
              </a>
              <a
                href="/admin/loan-requests"
                className="text-gray-600 hover:text-blue-600 font-medium"
              >
                Loan Requests
              </a>
              <a
                href="/admin/loans"
                className="text-gray-600 hover:text-blue-600 font-medium"
              >
                Manage Loans
              </a>
            </>
          )}

          {pathname && !token && (
            <>
              <a
                href="/user/applied-loans"
                className="text-gray-600 hover:text-blue-600 font-medium"
              >
                Career
              </a>
              <a
                href="/contact-us"
                className="text-gray-600 hover:text-blue-600 font-medium"
              >
                Contact Us
              </a>
              <a
                href="/about-us"
                className="text-gray-600 hover:text-blue-600 font-medium"
              >
                About Us
              </a>
            </>
          )}
        </nav>

        {/* Authentication or Profile */}
        <div className="auth-buttons flex items-center space-x-4">
          {pathname && token ? (
            <>
              {/* User Profile */}
              <a
                href="/profile"
                className="text-gray-600 hover:text-blue-600 font-medium"
              >
                My Profile
              </a>
              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="logout bg-blue-600 text-white px-4 py-2 rounded-full shadow-md font-medium"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              {/* Login and Sign Up (if not authenticated) */}
              <a
                href="/login"
                className="login text-gray-600 hover:text-blue-600"
              >
                Login
              </a>
              <a
                href="/signup"
                className="signup bg-blue-600 text-white hover:bg-blue-700 px-5 py-2 rounded-full shadow-md font-medium"
              >
                Sign Up
              </a>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
