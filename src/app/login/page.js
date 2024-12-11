"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { handleUserLogin, verifyToken } from "@/lib/users";
import { toast } from "react-hot-toast";



const Login = () => {
  const [formData, setFormData] = useState({ userName: "", password: "" });
  const [captcha, setCaptcha] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const [captchaError, setCaptchaError] = useState(false);
  const router = useRouter();

  // Generate CAPTCHA
  const generateCaptcha = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const captchaLength = 6;
    let captchaString = "";
    for (let i = 0; i < captchaLength; i++) {
      captchaString += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptcha(captchaString);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

   
    if (captchaInput !== captcha) {
      setCaptchaError(true);
      return;
    }

    setCaptchaError(false);

    try {
      
      const responseData = await handleUserLogin(formData);

      
      if (responseData) {
        toast.success("User logged in successfully");
      } else {
        toast.error("Username or password is incorrect");
        return;
      }

      const decoded = await verifyToken();
      
      if (decoded.isAdmin) {
        router.push("/admin/dashboard");
      } else {
        router.push("/user/dashboard");
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center pt-10">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-xl">
        <h2 className="text-3xl font-bold text-center text-blue-600">
          Welcome to Lending App
        </h2>
        <p className="text-2xl font-bold text-center text-gray-800 mt-2">
          Login
        </p>

        <form onSubmit={handleLogin} className="mt-6 space-y-6">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Login ID / Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              value={formData.userName}
              onChange={(e) =>
                setFormData({ ...formData, userName: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter username"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter password"
            />
          </div>

         
          <div>
            <label
              htmlFor="captcha"
              className="block text-sm font-medium text-gray-700"
            >
              Enter CAPTCHA
            </label>
            <div className="flex items-center mt-2 space-x-4">
              <div className="p-3 text-lg font-bold bg-gray-200 border border-gray-400 rounded">
                {captcha}
              </div>
              <button
                type="button"
                onClick={generateCaptcha}
                className="px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Refresh
              </button>
            </div>
            <input
              id="captcha"
              name="captcha"
              type="text"
              required
              value={captchaInput}
              onChange={(e) => setCaptchaInput(e.target.value)}
              className="w-full px-3 py-2 mt-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter CAPTCHA here"
            />
            {captchaError && (
              <p className="mt-2 text-sm text-red-600">
                Invalid CAPTCHA. Please try again.
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;