'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080'

// Types
type User = { id: number; name: string; email: string; role: string }
type Availability = { id?: number; dayOfWeek: number; startTime: string; endTime: string; saved?: boolean }
type Booking = { id?: number; candidateName: string; candidateEmail: string; startAt: string; endAt: string; status?: string }

export default function EmployeePage() {
  const router = useRouter()
  
  // State for the logged-in user
  const [user, setUser] = useState<User | null>(null)
  
  // Data states
  const [availability, setAvailability] = useState<Availability[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [stats, setStats] = useState<{ scheduled?: number; completed?: number; cancelled?: number }>({})
  const [saving, setSaving] = useState(false)
  const [dirty, setDirty] = useState(false)

  // 1. Load User on Mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const uStr = localStorage.getItem('user')
      if (uStr) {
        try {
          const u = JSON.parse(uStr)
          setUser(u)
        } catch (e) {
          console.error("Failed to parse user", e)
          router.push('/') // Redirect if data is corrupt
        }
      } else {
        router.push('/') // Redirect if not logged in
      }
    }
  }, [router])

  // 2. Fetch Data when User is set
  useEffect(() => {
    if (user?.id) {
      fetchAvailability(user.id)
      fetchBookings(user.id)
      // Stats are calculated inside fetchBookings
    }
  }, [user])

  function handleLogout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('userId')
    router.push('/') 
  }

  function authHeaders() {
    const headers: any = { 'Content-Type': 'application/json' }
    const t = localStorage.getItem('token')
    if (t) headers['Authorization'] = `Bearer ${t}`
    return headers
  }

  // --- Time Helpers ---
  function isValidTime(value: string) {
    return /^([01]\d|2[0-3]):([0-5]\d)$/.test(value)
  }

  function clampTime(value: string) {
    if (!value) return '00:00'
    const parts = value.split(':')
    let hh = parseInt(parts[0] ?? '0', 10)
    let mm = parseInt(parts[1] ?? '0', 10)
    if (isNaN(hh)) hh = 0; if (isNaN(mm)) mm = 0
    if (mm > 59) mm = 59; if (mm < 0) mm = 0
    if (hh > 23) hh = 23; if (hh < 0) hh = 0
    return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`
  }

  // --- API Calls ---

  async function fetchAvailability(userId: number) {
    const res = await fetch(`${API_URL}/employee/${userId}/availability`, { headers: authHeaders() })
    if (res.ok) {
      const arr = await res.json()
      setAvailability(arr.map((a: any) => ({ ...a, saved: true })))
      setDirty(false)
    }
  }

  async function saveAvailability() {
    if (!user?.id) return

    // Validation
    for (let i = 0; i < availability.length; i++) {
      const s = availability[i]
      if (!isValidTime(s.startTime) || !isValidTime(s.endTime)) {
        alert(`Invalid time format for slot ${i + 1}.`)
        return
      }
      const [sh, sm] = s.startTime.split(':').map(Number)
      const [eh, em] = s.endTime.split(':').map(Number)
      if (eh < sh || (eh === sh && em <= sm)) {
        alert(`End time must be after start time for slot ${i + 1}.`)
        return
      }
    }

    setSaving(true)
    try {
      const payload = availability.map(({ saved, ...rest }) => rest)
      const res = await fetch(`${API_URL}/employee/${user.id}/availability`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(payload)
      })
      if (res.ok) {
        const savedList = await res.json()
        setAvailability(savedList.map((a: any) => ({ ...a, saved: true })))
        setDirty(false)
      } else {
        const p = await res.json().catch(() => ({}))
        alert(p?.message || 'Failed to save availability')
      }
    } finally {
      setSaving(false)
    }
  }

  function addSlot() {
    setAvailability(v => [...v, { dayOfWeek: 1, startTime: '09:00', endTime: '10:00', saved: false }])
    setDirty(true)
  }

  function updateSlot(idx: number, patch: Partial<Availability>) {
    setAvailability(v => v.map((s, i) => i === idx ? {
      ...s, ...patch,
      startTime: patch.startTime ? clampTime(patch.startTime) : s.startTime,
      endTime: patch.endTime ? clampTime(patch.endTime) : s.endTime,
      saved: false
    } : s))
    setDirty(true)
  }

  async function removeSavedSlot(idx: number) {
    setAvailability(availability.filter((_, i) => i !== idx))
    setDirty(true)
  }

  // UPDATED: fetch bookings and compute stats client-side
  async function fetchBookings(userId: number) {
    const res = await fetch(`${API_URL}/employee/${userId}/bookings`, { headers: authHeaders() })
    if (res.ok) {
      const data: Booking[] = await res.json()
      setBookings(data)

      const scheduled = data.filter(b => b.status === 'scheduled').length
      const completed = data.filter(b => b.status === 'completed').length
      const cancelled = data.filter(b => b.status === 'cancelled').length

      setStats({ scheduled, completed, cancelled })
    }
  }

async function updateBookingStatus(bookingId: number | undefined, action: 'complete' | 'cancel') {
  if (!bookingId || !user?.id) return

  const res = await fetch(`${API_URL}/employee/${user.id}/bookings/${bookingId}?action=${action}`, {
    method: 'PATCH',
    headers: authHeaders()
  })

  if (res.ok) {
    await fetchBookings(user.id)
  } else {
    const errorText = await res.text()
    alert("Failed: " + errorText)
  }
}


  // --- Helpers ---
  const days = ["", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  
  // Get initials from user name
  const initials = user?.name 
    ? user.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() 
    : 'U';

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-20">
      
      {/* HEADER */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
             <div className="bg-indigo-600 text-white p-2 rounded-lg">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
             </div>
             <div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">Interviewer Dashboard</h1>
                <p className="text-xs text-slate-500 font-medium">Manage availability & sessions</p>
             </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
               <div className="text-right hidden sm:block">
                  <div className="text-sm font-bold text-slate-900">{user?.name || 'Loading...'}</div>
                  <div className="text-xs text-slate-500">{user?.email || '...'}</div>
               </div>
               <div className="h-10 w-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold text-sm border-2 border-white shadow-sm">
                 {initials}
               </div>
               
               <button 
                 onClick={handleLogout}
                 className="text-xs font-medium text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors ml-2"
               >
                 Logout
               </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-500">Scheduled</p>
                    <p className="text-3xl font-bold text-indigo-600 mt-1">{stats.scheduled ?? 0}</p>
                </div>
                <div className="p-3 bg-indigo-50 rounded-xl text-indigo-500">
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-500">Completed</p>
                    <p className="text-3xl font-bold text-emerald-600 mt-1">{stats.completed ?? 0}</p>
                </div>
                <div className="p-3 bg-emerald-50 rounded-xl text-emerald-500">
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-500">Cancelled</p>
                    <p className="text-3xl font-bold text-rose-500 mt-1">{stats.cancelled ?? 0}</p>
                </div>
                <div className="p-3 bg-rose-50 rounded-xl text-rose-500">
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* LEFT: Availability */}
          <div className="xl:col-span-2 space-y-6">
             <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div>
                        <h3 className="text-lg font-bold text-slate-800">Weekly Availability</h3>
                        <p className="text-sm text-slate-500">Set your recurring open slots</p>
                    </div>
                    <button onClick={addSlot} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors shadow-sm">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        Add Slot
                    </button>
                </div>

                <div className="p-6">
                    {availability.length === 0 && (
                        <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                            <p className="text-slate-500">No availability configured.</p>
                            <button onClick={addSlot} className="mt-2 text-indigo-600 font-medium hover:underline">Add your first slot</button>
                        </div>
                    )}

                    <div className="space-y-3">
                        {availability.map((s, i) => (
                        <div key={i} className="group flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all bg-white">
                            <div className="w-full sm:w-32">
                                <label className="block text-xs text-slate-400 mb-1 sm:hidden">Day</label>
                                <select 
                                    value={s.dayOfWeek} 
                                    onChange={e => updateSlot(i, { dayOfWeek: Number(e.target.value) })}
                                    className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 font-medium"
                                >
                                {days.map((d, idx) => idx > 0 && <option key={idx} value={idx}>{d}</option>)}
                                </select>
                            </div>

                            <div className="flex items-center gap-2 flex-1 w-full sm:w-auto">
                                <div className="flex-1">
                                    <input
                                        type="time"
                                        value={s.startTime}
                                        onChange={e => updateSlot(i, { startTime: e.target.value })}
                                        onBlur={e => updateSlot(i, { startTime: clampTime(e.target.value) })}
                                        className="bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                                    />
                                </div>
                                <span className="text-slate-400 font-medium">to</span>
                                <div className="flex-1">
                                    <input
                                        type="time"
                                        value={s.endTime}
                                        onChange={e => updateSlot(i, { endTime: e.target.value })}
                                        onBlur={e => updateSlot(i, { endTime: clampTime(e.target.value) })}
                                        className="bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                                    />
                                </div>
                            </div>

                            {s.saved && (
                                <button 
                                    onClick={() => removeSavedSlot(i)}
                                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors ml-auto sm:ml-0"
                                    title="Remove slot"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                </button>
                            )}
                        </div>
                        ))}
                    </div>

                    <div className="mt-8 flex justify-end pt-6 border-t border-slate-100">
                        <button
                            onClick={saveAvailability}
                            disabled={saving || !dirty}
                            className={`
                                flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all shadow-sm
                                ${saving || !dirty 
                                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200'}
                            `}
                        >
                            {saving ? (
                                <><svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Saving...</>
                            ) : (
                                'Save Changes'
                            )}
                        </button>
                    </div>
                </div>
             </div>
          </div>

          {/* RIGHT: Bookings */}
          <div className="xl:col-span-1">
             <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden h-full flex flex-col">
                <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
                    <h3 className="text-lg font-bold text-slate-800">Upcoming Bookings</h3>
                </div>
                
                <div className="p-0 flex-1 overflow-y-auto max-h-[600px]">
                    {bookings.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-48 text-slate-400">
                            <svg className="w-12 h-12 mb-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            <p className="text-sm">No bookings yet</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-100">
                            {bookings.map(b => (
                            <div key={b.id} className="p-5 hover:bg-slate-50 transition-colors">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h4 className="font-bold text-slate-900">{b.candidateName}</h4>
                                        <p className="text-xs text-slate-500">{b.candidateEmail}</p>
                                    </div>
                                    <span className={`
                                        px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide
                                        ${b.status === 'cancelled' ? 'bg-red-100 text-red-600' : 
                                          b.status === 'completed' ? 'bg-emerald-100 text-emerald-600' : 
                                          'bg-blue-100 text-blue-600'}
                                    `}>
                                        {b.status}
                                    </span>
                                </div>
                                
                                <div className="flex items-center gap-2 text-sm text-slate-600 mb-4 bg-slate-100/50 p-2 rounded-lg">
                                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    {new Date(b.startAt).toLocaleString(undefined, { month:'short', day:'numeric', hour:'numeric', minute:'2-digit' })}
                                </div>

                                {b.status === 'scheduled' && (
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => updateBookingStatus(b.id, 'complete')}
                                            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium py-2 rounded-lg transition-colors"
                                        >
                                            Complete
                                        </button>
                                        <button 
                                            onClick={() => updateBookingStatus(b.id, 'cancel')}
                                            className="flex-1 bg-white border border-slate-200 hover:border-red-300 hover:text-red-600 text-slate-600 text-xs font-medium py-2 rounded-lg transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                )}
                            </div>
                            ))}
                        </div>
                    )}
                </div>
             </div>
          </div>

        </div>
      </main>
    </div>
  )
}