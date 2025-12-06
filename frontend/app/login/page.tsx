'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!res.ok) throw new Error("Invalid credentials")

      const data = await res.json()
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      if (data.user?.id) localStorage.setItem("userId", String(data.user.id))

      const role = data.user?.role
      if (role === "admin") router.push("/admin")
      else if (role === "employee") router.push("/employee")
      else router.push("/")
    } catch (err: any) {
      setError(err.message || "Login failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex overflow-hidden bg-gradient-to-br from-indigo-600 via-blue-600 to-sky-500 text-white">
      
      {/* LEFT PANEL — Branding */}
      <aside className="hidden md:flex flex-col justify-center px-16 max-w-lg">
        <h1 className="text-5xl font-extrabold leading-tight drop-shadow-md">
          Automatic Interview Scheduler
        </h1>
        <p className="mt-5 text-lg opacity-90">
          Your journey starts here. Book interviews, track progress, and achieve greatness.
        </p>
      </aside>

      {/* RIGHT PANEL — Login Box */}
      <section className="flex-1 bg-white text-slate-900 flex items-center justify-center px-6 py-10 rounded-tl-[60px] shadow-2xl">
        <div className="w-full max-w-md space-y-7">
          
          <div className="text-center space-y-2">
            <div className="mx-auto w-14 h-14 flex items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-2xl font-black shadow-md">
              IS
            </div>
            <h2 className="text-2xl font-bold">Welcome Back</h2>
            <p className="text-sm text-slate-500">Sign in to continue scheduling</p>
          </div>

          {error && (
            <div className="px-4 py-3 bg-red-50 text-red-600 text-sm font-medium rounded-lg shadow">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Email</label>
              <input
                required
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mt-1 px-4 py-3 rounded-lg border border-slate-300 text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Password</label>
              <input
                required
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mt-1 px-4 py-3 rounded-lg border border-slate-300 text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold shadow-md hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Login"}
            </button>
          </form>

        </div>
      </section>
    </div>
  )
}
