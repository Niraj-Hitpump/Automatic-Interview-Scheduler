'use client'

import React, { useEffect, useState } from 'react'

export default function EmployeesAdminPage() {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [savingId, setSavingId] = useState(null)

  useEffect(() => { fetchList() }, [])

  async function fetchList() {
    setLoading(true)
    const res = await fetch('/api/admin/interviewers') // create a backend admin endpoint to list interviewers
    if (res.ok) setList(await res.json())
    setLoading(false)
  }

  async function saveCredentials(id, email, password) {
    setSavingId(id)
    await fetch(`/employee/admin/${id}/credentials`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    await fetchList()
    setSavingId(null)
  }

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <h2>Manage Employees (credentials)</h2>
      {loading ? <div>Loading…</div> : null}
      {list.map(i => (
        <EmployeeRow key={i.id} interviewer={i} onSave={saveCredentials} saving={savingId === i.id} />
      ))}
    </div>
  )
}

function EmployeeRow({ interviewer, onSave, saving }) {
  const [email, setEmail] = useState(interviewer.email || '')
  const [password, setPassword] = useState('')
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center', border: '1px solid #eef2ff', padding: 10, borderRadius: 8 }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 700 }}>{interviewer.name}</div>
        <div style={{ color: '#6b7280', fontSize: 13 }}>{interviewer.title}</div>
      </div>
      <input placeholder="email" value={email} onChange={e => setEmail(e.target.value)} />
      <input placeholder="new password" value={password} onChange={e => setPassword(e.target.value)} />
      <button onClick={() => onSave(interviewer.id, email, password)} disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
    </div>
  )
}