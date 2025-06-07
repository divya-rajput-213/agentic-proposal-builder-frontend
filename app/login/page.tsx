// app/login/page.tsx
"use client";

import { useState } from "react";
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();
  
    const handleLogin = (e: React.FormEvent) => {
      e.preventDefault();
      console.log('Email:', email);
      console.log('Password:', password);
      // Add login logic here (API call, validation, etc.)
    };
  
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md relative">
          {/* Back to Chatbot Button */}
          <button
            onClick={() => router.push('/')}
            className="absolute top-4 left-4 flex items-center text-gray-600 hover:text-blue-600"
          >
            <ArrowLeft className="h-5 w-5 mr-1" />
            <span className="text-sm">Back to Chatbot</span>
          </button>
  
          <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Login</h2>
          <form onSubmit={handleLogin} className="space-y-5">
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
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }
  
