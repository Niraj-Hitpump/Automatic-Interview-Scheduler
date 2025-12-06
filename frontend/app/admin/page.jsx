'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080'

export default function AdminPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)

  const [stats, setStats] = useState({
    scheduled: 0,
    pendingFeedback: 0,
    activeCandidates: 0,
    openSlots: 0,
  })
  const [upcoming, setUpcoming] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const raw = localStorage.getItem('user')
    const t = localStorage.getItem('token')
    setToken(t)

    if (!raw || !t) {
      router.replace('/login')
      return
    }

    try {
      const u = JSON.parse(raw)
      if (u.role !== 'admin') {
        router.replace('/login')
        return
      }

      setUser(u)
      fetchDashboardData()
    } catch {
      router.replace('/login')
    }
  }, [router])

  async function fetchDashboardData() {
    try {
      setLoading(true)
      const res = await fetch(`${API_URL}/admin/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      setStats(data.stats)
      setUpcoming(data.upcoming)
    } catch (e) {
      console.error('Dashboard fetch failed:', e)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.clear()
    router.push('/login')
  }

  function formatFriendlyDate(isoString) {
    const d = new Date(isoString)
    const now = new Date()

    const isToday = d.toDateString() === now.toDateString()
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)

    const time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    if (isToday) return `Today ${time}`
    if (d.toDateString() === tomorrow.toDateString()) return `Tomorrow ${time}`
    return `${d.toLocaleDateString([], { month: 'short', day: 'numeric' })} ${time}`
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {/* ===== HEADER ===== */}
      <header style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: 10
      }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 20 }}>Admin Dashboard</h1>
          <div style={{ color: '#6b7280', fontSize: 13 }}>
            Welcome back, {user?.name}
          </div>
        </div>

        <button
          onClick={handleLogout}
          style={{
            background: '#ef4444', color: 'white',
            padding: '8px 12px', borderRadius: 8,
            cursor: 'pointer', border: 'none'
          }}
        >
          Sign out
        </button>
      </header>

      {/* ===== STATS ===== */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))',
        gap: 12,
      }}>
        <StatCard title="Scheduled Interviews" value={loading ? '-' : stats.scheduled} />
        <StatCard title="Pending Feedback" value={loading ? '-' : stats.pendingFeedback} />
        <StatCard title="Active Candidates" value={loading ? '-' : stats.activeCandidates} />
        <StatCard title="Open Slots" value={loading ? '-' : stats.openSlots} />
      </section>

      {/* ===== UPCOMING INTERVIEW LIST ===== */}
      <section style={{
        marginTop: 8, background: 'white',
        padding: 16, borderRadius: 10,
        boxShadow: '0 6px 18px rgba(15,23,42,0.04)',
      }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', marginBottom: 12,
        }}>
          <h3 style={{ margin: 0 }}>Upcoming Interviews</h3>

          <button
            onClick={fetchDashboardData}
            style={{ fontSize: 12, background: 'none', border: 'none', color: '#6366f1' }}
          >
            Refresh
          </button>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', color: '#6b7280', fontSize: 13 }}>
              <th style={th}>Time</th>
              <th style={th}>Candidate</th>
              <th style={th}>Interviewer</th>
              <th style={th}>Stage</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr><td colSpan={4} style={{ ...td, textAlign: 'center' }}>Loading...</td></tr>
            ) : upcoming.length === 0 ? (
              <tr><td colSpan={4} style={{ ...td, textAlign: 'center' }}>No upcoming interviews</td></tr>
            ) : (
              upcoming.map((b) => (
                <tr key={b.id}>
                  <td style={td}>{formatFriendlyDate(b.startAt)}</td>
                  <td style={td}>{b.candidateName}</td>
                  <td style={td}>{b.interviewer?.name ?? 'Unknown'}</td>
                  <td style={td}><Tag color="#bfdbfe">Technical</Tag></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>
    </div>
  )
}

function StatCard({ title, value }) {
  return (
    <div style={{
      background: 'white', padding: 16,
      borderRadius: 10, boxShadow: '0 6px 18px rgba(15,23,42,0.04)',
    }}>
      <div style={{ color: '#6b7280', fontSize: 13 }}>{title}</div>
      <div style={{ fontSize: 24, fontWeight: 700, marginTop: 8 }}>{value}</div>
    </div>
  )
}

function Tag({ children, color }) {
  return (
    <span style={{
      display: 'inline-block', background: color,
      padding: '6px 10px', borderRadius: 8, fontSize: 12
    }}>
      {children}
    </span>
  )
}

const th = { padding: '8px 6px' }
const td = {
  padding: '10px 6px',
  borderTop: '1px solid #eef2ff',
  fontSize: 14,
}
