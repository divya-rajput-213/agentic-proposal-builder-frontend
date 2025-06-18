"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
  
    try {
      const response = await axios.post(
        `${apiUrl}auth/api/login/`,
        {
          email,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      const data = response.data;
  
      localStorage.setItem("accessToken", data.token.access);
      localStorage.setItem("refreshToken", data.token.refresh);
    
      router.push("/");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Login failed");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md relative">
        <button
          onClick={() => router.push("/")}
          className="absolute top-4 left-4 flex items-center text-gray-600 hover:text-blue-600"
        >
          <ArrowLeft className="h-5 w-5 mr-1" />
          <span className="text-sm">Back to Chatbot</span>
        </button>

        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Login</h2>

        <form onSubmit={handleLogin} className="space-y-5">
          {error && (
            <p className="text-red-600 text-sm text-center">{error}</p>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 rounded-md text-white transition ${
              loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Sign up link */}
        <p className="text-sm text-center mt-4">
          Don&apos;t have an account?{" "}
          <span
            onClick={() => router.push("/signup")}
            className="text-blue-600 hover:underline cursor-pointer"
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
}
