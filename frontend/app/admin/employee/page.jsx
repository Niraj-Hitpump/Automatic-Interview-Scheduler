'use client'

import React, { useEffect, useState } from 'react'

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080'

function authHeaders() {
  const headers = { 'Content-Type': 'application/json' }
  const t = localStorage.getItem('token')
  if (t) headers['Authorization'] = `Bearer ${t}`
  return headers
}

export default function AdminEmployeePage() {
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [savingId, setSavingId] = useState(null)
  const [creating, setCreating] = useState(false)
  const [newName, setNewName] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [newPassword, setNewPassword] = useState('') // 👈 NEW FIELD
  const [error, setError] = useState('')

  useEffect(() => { fetchEmployees() }, [])

  async function fetchEmployees() {
    setLoading(true)
    try {
      const res = await fetch(`${API}/employee`, { headers: authHeaders() })
      if (!res.ok) throw new Error('Failed to load')
      const data = await res.json()
      setEmployees(data.map(e => ({
        ...e,
        editEmail: e.email || '',
        password: '',        // for updates only
        enabled: e.enabled ?? true
      })))
    } catch (err) {
      console.error(err)
      setError('Could not load employees')
    } finally {
      setLoading(false)
    }
  }

  async function createEmployee() {
    setError('')
    if (!newName.trim() || !newEmail.trim() || !newPassword.trim()) {
      setError('Name, Email & Password are required.')
      return
    }
    setCreating(true)
    try {
      const payload = {
        name: newName,
        email: newEmail,
        password: newPassword, // 👈 SEND PASSWORD
        enabled: true
      }
      const res = await fetch(`${API}/employee`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(payload)
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.message || 'Create failed')
      }
      setNewName('')
      setNewEmail('')
      setNewPassword('')
      await fetchEmployees()
    } catch (err) {
      console.error(err)
      setError(err.message)
    } finally {
      setCreating(false)
    }
  }

  async function saveCredentials(id) {
    const item = employees.find(e => e.id === id)
    if (!item) return
    setError('')
    setSavingId(id)
    try {
      const body = {
        name: item.name || null,
        email: item.editEmail || null,
        password: item.password || null,
        enabled: item.enabled
      }
      const res = await fetch(`${API}/employee/admin/${id}/credentials`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(body)
      })
      if (!res.ok) {
        const payload = await res.json().catch(() => ({}))
        throw new Error(payload.message || 'Save failed')
      }
      await fetchEmployees()
    } catch (err) {
      console.error(err)
      setError(err.message)
    } finally {
      setSavingId(null)
    }
  }

  async function removeEmployee(id) {
    setError('')
    if (!confirm('Delete this employee?')) return
    try {
      const res = await fetch(`${API}/employee/${id}`, {
        method: 'DELETE',
        headers: authHeaders()
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.message || 'Delete failed')
      }
      setEmployees(prev => prev.filter(p => p.id !== id))
    } catch (err) {
      console.error(err)
      setError(err.message)
    }
  }

  function updateLocal(id, patch) {
    setEmployees(prev => prev.map(e => e.id === id ? { ...e, ...patch } : e))
  }

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0 }}>Manage Employees</h2>
        <div style={{ color: '#6b7280', fontSize: 13 }}>
          Create, set credentials and enable/disable employees
        </div>
      </div>

      {error && <div style={{ color: 'red' }}>{error}</div>}

      <section style={{ background: 'white', padding: 16, borderRadius: 10 }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <input placeholder="Name" value={newName} onChange={e => setNewName(e.target.value)} style={inputStyle} />
          <input placeholder="Email" value={newEmail} onChange={e => setNewEmail(e.target.value)} style={inputStyle} />
          <input placeholder="Password" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} style={inputStyle} /> {/* 👈 Added */}
          <button onClick={createEmployee} disabled={creating} style={{ padding: '8px 12px', borderRadius: 8 }}>
            {creating ? 'Creating...' : 'Create'}
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '1px solid #eef2ff' }}>
                <th style={th}>Name</th>
                <th style={th}>Email</th>
                <th style={th}>New password</th>
                <th style={th}>Enabled</th>
                <th style={th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} style={{ padding: 16 }}>Loading…</td></tr>
              ) : employees.length === 0 ? (
                <tr><td colSpan={5} style={{ padding: 16, color: '#6b7280' }}>No employees</td></tr>
              ) : employees.map(emp => (
                <tr key={emp.id} style={{ borderBottom: '1px solid #f3f6fb' }}>
                  <td style={td}>
                    <input value={emp.name || ''} onChange={e => updateLocal(emp.id, { name: e.target.value })} style={{ ...inputStyle, width: '100%' }} />
                  </td>

                  <td style={td}>
                    <input value={emp.editEmail} onChange={e => updateLocal(emp.id, { editEmail: e.target.value })} style={{ ...inputStyle, width: '100%' }} />
                  </td>

                  <td style={td}>
                    <input placeholder="leave empty to keep" type="password" value={emp.password} onChange={e => updateLocal(emp.id, { password: e.target.value })} style={inputStyle} />
                  </td>

                  <td style={{ ...td, width: 120 }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <input type="checkbox" checked={!!emp.enabled} onChange={e => updateLocal(emp.id, { enabled: e.target.checked })} />
                      <span style={{ color: '#6b7280' }}>{emp.enabled ? 'Active' : 'Disabled'}</span>
                    </label>
                  </td>

                  <td style={{ ...td, width: 240 }}>
                    <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                      <button onClick={() => saveCredentials(emp.id)} disabled={savingId === emp.id} style={actionBtn}>
                        {savingId === emp.id ? 'Saving...' : 'Save'}
                      </button>

                      <button onClick={() => removeEmployee(emp.id)} style={{ ...actionBtn, background: '#ef4444', color: 'white' }}>
                        Remove
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

const inputStyle = {
  padding: '8px 10px',
  borderRadius: 8,
  border: '1px solid #e6e9ef'
}

const th = { padding: '10px 8px', fontSize: 13, color: '#374151' }
const td = { padding: '10px 8px', verticalAlign: 'middle' }
const actionBtn = { padding: '8px 10px', borderRadius: 8, border: '1px solid #e6e9ef', background: 'white', cursor: 'pointer' }
