'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080'

type WeekType = 'current' | 'next' | 'nextNext'

export default function Home() {
  const router = useRouter()

  const [user, setUser] = useState<any>(null)
  const [isAuthChecking, setIsAuthChecking] = useState(true)

  const [activeTab, setActiveTab] = useState<'bookings' | 'availability'>('bookings')

  const [weekType, setWeekType] = useState<WeekType>('current')
  const [page, setPage] = useState(0)
  const [slots, setSlots] = useState<any[]>([])
  const [hasMore, setHasMore] = useState(true)
  const [isLoadingSlots, setIsLoadingSlots] = useState(false)

  const [bookings, setBookings] = useState<any[]>([])
  const [userHasBooked, setUserHasBooked] = useState(false)


  // 🔹 Auth check & Initial data load
  useEffect(() => {
    const token = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')

    if (!token || !savedUser) {
      router.push('/login')
      return
    }

    try {
      const u = JSON.parse(savedUser)
      setUser(u)
      setIsAuthChecking(false)

      // Load data using `u`, not state-based user
      fetchBookings(u.email)
      loadSlots('current', 0, true)

    } catch {
      localStorage.clear()
      router.push('/login')
    }
  }, [router])


  // 🔹 Auto-refresh bookings when user returns to tab
  useEffect(() => {
    if (!user?.email) return

    const unsub = () => fetchBookings(user.email)
    window.addEventListener("focus", unsub)
    return () => window.removeEventListener("focus", unsub)

  }, [user])



  // 🔹 Fetch Available Slots
  async function loadSlots(week: WeekType, pageNum: number, replace: boolean) {
    setIsLoadingSlots(true)
    try {
      const res = await fetch(`${API_URL}/slots?weekType=${week}&page=${pageNum}&size=20`)
      if (!res.ok) return

      const data = await res.json()
      const available = data.content || []

      // Remove already booked slots by same user
      const filtered = available.filter((s: any) =>
        !bookings.some(b => b.startAt === s.startAt)
      )

      setHasMore(!data.last)
      setSlots(prev => replace ? filtered : [...prev, ...filtered])

    } catch (e) {
      console.error("Failed to load slots", e)
    }
    setIsLoadingSlots(false)
  }



  // 🔹 Fetch Bookings
  async function fetchBookings(email: string) {
    const res = await fetch(`${API_URL}/bookings?candidateEmail=${encodeURIComponent(email)}`)
    if (!res.ok) return

    const list = await res.json()
    setBookings(list)

    const active = list.some((b: any) => b.status === "scheduled")
    setUserHasBooked(active)
  }



  const handleLogout = () => {
    localStorage.clear()
    router.push('/login')
  }


  // 🔹 Book Slot
  async function handleBook(slotId: number) {
    if (!user) return
    if (userHasBooked) return alert("You already have a scheduled interview.")

    const ok = confirm("Confirm booking for this interview slot?")
    if (!ok) return

    const res = await fetch(`${API_URL}/slots/${slotId}/book`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ candidateName: user.name, candidateEmail: user.email })
    })

    if (!res.ok) return alert(await res.text())

    alert("Booking Confirmed!")
    fetchBookings(user.email)
    setPage(0)
    loadSlots(weekType, 0, true)
    setActiveTab("bookings")
  }



  // 🔹 Cancel Booking
  async function handleCancel(id: number) {
    const ok = confirm("Cancel and free this slot?")
    if (!ok) return

    const res = await fetch(`${API_URL}/bookings/${id}`, { method: 'DELETE' })
    if (res.ok) {
      fetchBookings(user.email)
      loadSlots(weekType, 0, true)
    }
  }


  const formatDate = (s: string) => {
    const d = new Date(s)
    return {
      date: d.toLocaleDateString(undefined, {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      }),
      time: d.toLocaleTimeString(undefined, {
        hour: 'numeric',
        minute: '2-digit'
      })
    }
  }

  if (isAuthChecking)
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>


  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : "U"  


  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">

      {/* ========= HEADER ========= */}
      <header className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto h-16 flex items-center justify-between px-6">
          <strong className="text-lg font-semibold text-indigo-600">
            Automatic Interview Scheduler
          </strong>

          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-indigo-600 text-white flex items-center justify-center rounded-full font-bold text-sm">
              {userInitial}
            </div>

            <div className="text-right leading-tight">
              <div className="font-semibold">{user?.name}</div>
              <div className="text-xs text-slate-500">{user?.email}</div>
              <span className="text-[10px] px-2 py-0.5 mt-1 inline-block rounded bg-indigo-100 text-indigo-600 uppercase font-bold tracking-wide">
                {user?.role}
              </span>
            </div>

            <button onClick={handleLogout}
              className="text-sm text-red-600 hover:text-red-700 border px-3 py-1 rounded-md">
              Sign Out
            </button>
          </div>
        </div>
      </header>


      {/* ====================== MAIN CONTENT ====================== */}
      <main className="max-w-5xl mx-auto px-6 py-8">

        {/* Tabs */}
        <div className="flex gap-6 border-b mb-8 pb-3">
          {["bookings", "availability"].map(tab => (
            <button key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`pb-2 text-sm font-medium border-b-2 ${
                activeTab === tab
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}>
              {tab === "bookings" ? "My Bookings" : "Available Slots"}
            </button>
          ))}
        </div>


        {/* ================= BOOKINGS TAB ================= */}
        {activeTab === "bookings" && (
          <div className="space-y-4">
            {bookings.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-xl shadow-sm">
                <p className="text-lg font-semibold">No interviews yet</p>
                <button onClick={() => setActiveTab("availability")}
                  className="mt-4 px-5 py-2 bg-indigo-600 text-white rounded-lg">
                  Find Slot
                </button>
              </div>
            ) : bookings.map(b => {
              const { date, time } = formatDate(b.startAt)
              return (
                <div key={b.id}
                  className="p-5 bg-white border rounded-lg shadow-sm flex justify-between">
                  
                  <div>
                    <strong>Technical Interview</strong>
                    <div className="text-sm">{date} – {time}</div>

                    {/* Status Badge */}
                    <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs uppercase border ${
                      b.status === "scheduled"
                        ? "bg-blue-50 text-blue-600 border-blue-100"
                        : b.status === "completed"
                          ? "bg-green-50 text-green-600 border-green-200"
                          : "bg-red-50 text-red-600 border-red-100"
                    }`}>
                      {b.status}
                    </span>
                  </div>

                  {b.status === "scheduled" && (
                    <button onClick={() => handleCancel(b.id)}
                      className="px-4 py-1 text-sm text-red-600 border rounded-lg hover:bg-red-50">
                      Cancel
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        )}


        {/* ================= AVAILABILITY TAB ================= */}
        {activeTab === "availability" && (
          <>
            {userHasBooked && (
              <div className="mb-5 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-700">
                You already booked a slot. Cancel the current appointment to book again.
              </div>
            )}

            {/* Week filter */}
            <div className="flex gap-2 mb-6">
              {[
                { id: 'current', label: 'Current Week' },
                { id: 'next', label: 'Next Week' },
                { id: 'nextNext', label: 'Next-Next Week' }
              ].map(w => (
                <button key={w.id}
                  onClick={() => {
                    setWeekType(w.id as WeekType)
                    setPage(0)
                    loadSlots(w.id as WeekType, 0, true)
                  }}
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    weekType === w.id
                      ? 'bg-slate-900 text-white'
                      : 'bg-white border text-slate-600 hover:bg-slate-50'
                  }`}>
                  {w.label}
                </button>
              ))}
            </div>

            {/* Slots */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {slots.length === 0 && !isLoadingSlots ? (
                <div className="col-span-full text-center text-slate-400 py-10">
                  No slots available
                </div>
              ) : slots.map(s => {
                const { date, time } = formatDate(s.startAt)
                return (
                    <div
                        key={s.id}
                        className="p-5 bg-white border rounded-xl shadow-sm flex flex-col"
                    >
                        <strong className="text-lg">{date}</strong>
                        <span className="text-sm">{time}</span>
                        <div className="mt-2 text-xs text-gray-600">
                            <p className="font-medium text-gray-800">
                                {s.interviewer?.name}
                            </p>
                            <p className="text-gray-500">
                                {s.interviewer?.email}
                            </p>
                        </div>

                        <button
                            disabled={userHasBooked}
                            onClick={() => handleBook(s.id)}
                            className={`mt-4 py-2 rounded-lg text-sm font-medium ${
                                userHasBooked
                                    ? "bg-slate-100 text-slate-400"
                                    : "bg-indigo-600 text-white hover:bg-indigo-700"
                            }`}
                        >
                            {userHasBooked ? "Booked Already" : "Book"}
                        </button>
                    </div>
                );
              })}
            </div>

            {/* Load More */}
            <div className="mt-6 text-center">
              {isLoadingSlots && (
                <span className="text-slate-500 text-sm">Loading...</span>
              )}
              {!isLoadingSlots && hasMore && (
                <button
                  onClick={() => {
                    const nextPage = page + 1
                    setPage(nextPage)
                    loadSlots(weekType, nextPage, false)
                  }}
                  className="px-6 py-2 border border-indigo-600 text-indigo-600 rounded-full text-sm font-medium hover:bg-indigo-50">
                  Load More
                </button>
              )}
            </div>
          </>
        )}

      </main>
    </div>
  )
}
