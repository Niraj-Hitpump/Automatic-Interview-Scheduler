'use client'

import React, { useEffect, useState } from 'react'
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080'

export default function ShortlistPage() {
  const [candidates, setCandidates] = useState([])
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState(null)
  const [token, setToken] = useState(null)

  useEffect(() => {
    const t = localStorage.getItem('token')
    if (t) setToken(t)
    fetchList()
  }, [])

  function authHeaders(extra = {}) {
    const headers = { 'Content-Type': 'application/json', ...extra }
    const t = token || localStorage.getItem('token')
    if (t) headers['Authorization'] = `Bearer ${t}`
    return headers
  }

  async function fetchList() {
    const res = await fetch(`${API_URL}/admin/candidates`, { headers: authHeaders() })
    if (res.status === 401) {
      // token invalid or missing: send user to login
      window.location.href = 'http://localhost:3000/login'
      return
    }
    if (res.ok) setCandidates(await res.json())
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setMsg(null)
    try {
      const payload = { name, email, password }
      let res
      if (editingId) {
        res = await fetch(`${API_URL}/admin/candidates/${editingId}`, {
          method: 'PUT',
          headers: authHeaders(),
          body: JSON.stringify(payload),
        })
      } else {
        res = await fetch(`${API_URL}/admin/candidates`, {
          method: 'POST',
          headers: authHeaders(),
          body: JSON.stringify(payload),
        })
      }

      if (res.status === 401) {
        window.location.href = 'http://localhost:3000/login'
        return
      }
      if (res.status === 409) throw new Error('Email already exists')
      if (!res.ok) throw new Error('Save failed')

      setName(''); setEmail(''); setPassword(''); setEditingId(null)
      await fetchList()
      setMsg('Saved')
    } catch (err) {
      setMsg(err.message)
    } finally { setLoading(false) }
  }

  async function handleEdit(c) {
    setEditingId(c.id)
    setName(c.name)
    setEmail(c.email)
    setPassword(c.password || '')
    setMsg(null)
    // show modal here if needed (existing code)
  }

  async function handleDelete(id) {
    if (!confirm('Delete candidate?')) return
    const res = await fetch(`${API_URL}/admin/candidates/${id}`, { method: 'DELETE', headers: authHeaders() })
    if (res.status === 401) {
      window.location.href = 'http://localhost:3000/login'
      return
    }
    if (res.ok) {
      setMsg('Deleted')
      fetchList()
    } else {
      setMsg('Delete failed')
    }
  }

  return (
    <div style={{ padding: 12 }}>
      <h2>Shortlisted candidates</h2>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 8, maxWidth: 640, marginBottom: 12 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <input required placeholder="Name" value={name} onChange={e => setName(e.target.value)} style={{ flex: 1, padding: 8 }} />
          <input required placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} style={{ flex: 1, padding: 8 }} />
          <input required placeholder="Password" type="text" value={password} onChange={e => setPassword(e.target.value)} style={{ width: 220, padding: 8 }} />
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button type="submit" disabled={loading} style={{ padding: '8px 12px', background: '#2563eb', color: 'white', border: 'none', borderRadius: 6 }}>
            {editingId ? 'Update' : 'Create'}
          </button>
          {editingId && <button type="button" onClick={() => { setEditingId(null); setName(''); setEmail(''); setPassword(''); }} style={{ padding: '8px 12px' }}>Cancel</button>}
          <div style={{ marginLeft: 'auto', color: msg && msg.startsWith('Saved') ? 'green' : 'crimson', alignSelf: 'center' }}>{msg}</div>
        </div>
      </form>

      <div style={{ maxWidth: 900, background: 'white', borderRadius: 8, padding: 8, boxShadow: '0 6px 18px rgba(0,0,0,0.04)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ textAlign: 'left', color: '#6b7280' }}>
            <tr><th style={{ padding: 8 }}>Name</th><th style={{ padding: 8 }}>Email</th><th style={{ padding: 8 }}>Actions</th></tr>
          </thead>
          <tbody>
            {candidates.map(c => (
              <tr key={c.id} style={{ borderTop: '1px solid #eef2ff' }}>
                <td style={{ padding: 8 }}>{c.name}</td>
                <td style={{ padding: 8 }}>{c.email}</td>
                <td style={{ padding: 8 }}>
                  <button onClick={() => handleEdit(c)} style={{ marginRight: 8 }}>Edit</button>
                  <button onClick={() => handleDelete(c.id)} style={{ color: 'crimson' }}>Delete</button>
                </td>
              </tr>
            ))}
            {candidates.length === 0 && <tr><td colSpan="3" style={{ padding: 12, color: '#6b7280' }}>No candidates yet</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}