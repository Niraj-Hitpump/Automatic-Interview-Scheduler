'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'

export default function EmployeeLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<{ name?: string; email?: string; avatar?: string } | null>(null)

  useEffect(() => {
    const u = localStorage.getItem('user')
    if (u) {
      try { setUser(JSON.parse(u)) } catch { setUser(null) }
    }
  }, [])

  const initials = user?.name
    ? user.name.split(' ').map(s => s[0]).slice(0, 2).join('')
    : (user?.email ? user.email.charAt(0).toUpperCase() : 'I')

  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/'
  }

  const container: React.CSSProperties = { fontFamily: 'Inter, system-ui, Arial', padding: 20, background: '#f6f8fb', minHeight: '100vh' }
  const header: React.CSSProperties = { display: 'flex', gap: 20, alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, maxWidth: 1200, marginLeft: 'auto', marginRight: 'auto' }
  const left: React.CSSProperties = { display: 'flex', gap: 12, alignItems: 'center' }
  const brandBox: React.CSSProperties = { width: 56, height: 56, borderRadius: 12, overflow: 'hidden', background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }
  const titleWrap: React.CSSProperties = { display: 'flex', flexDirection: 'column', lineHeight: 1 }
  const nav: React.CSSProperties = { display: 'flex', gap: 12, alignItems: 'center' }
  const profileCard: React.CSSProperties = { display: 'flex', gap: 12, alignItems: 'center', background: 'white', padding: '10px 14px', borderRadius: 12, boxShadow: '0 6px 18px rgba(2,6,23,0.06)' }

  return (
    <div style={container}>
      <main style={{ maxWidth: 1200, marginLeft: 'auto', marginRight: 'auto' }}>
        {children}
      </main>
    </div>
  )
}