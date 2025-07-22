'use client'

import { Mail, Lock } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'
export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = () => {
    // handle login logic
    console.log({ email, password })
  }

  return (
    <div className="flex min-h-screen">
      {/* Left Panel */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-b from-blue-500 to-blue-800 flex-col justify-center items-center text-white p-8">
        <div className="flex flex-col items-center space-y-4">
          <img src="/logo.png" alt="logo" className="w-48 h-auto" />
          <h1 className="text-2xl font-bold">สำนักงานธนานุเคราะห์</h1>
          <p className="text-sm">โรงรับจำนำรัฐบาล</p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 px-8">
        <div className="w-full max-w-sm space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800 text-center">สำนักงานธนานุเคราะห์</h2>
          <p className="text-center text-sm text-gray-500">เข้าสู่ระบบ</p>

          <div className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 text-gray-400" size={18} />
              <input
                type="email"
                placeholder="Email Address"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-3.5 text-gray-400" size={18} />
              <input
                type="password"
                placeholder="Password"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <Link href="/home">
            <button
              onClick={handleLogin}
              className="w-full bg-blue-600 text-white py-3 rounded-full hover:bg-blue-700 transition"
            >
              เข้าสู่ระบบ
            </button>
            </Link>
            <p className="text-center text-sm text-gray-500 hover:underline cursor-pointer">
              ลืมรหัสผ่าน?
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
