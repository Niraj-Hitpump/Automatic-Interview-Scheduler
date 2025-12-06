export default function AdminLayout({ children }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#f3f6fb', fontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial" }}>
      <aside style={{ width: 260, background: '#0f172a', color: 'white', padding: 24, boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
          <div style={{ width: 44, height: 44, borderRadius: 10, background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0f172a', fontWeight: 700 }}>
            IS
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700 }}>Interview Scheduler</div>
            <div style={{ fontSize: 12, opacity: 0.8 }}>Admin</div>
          </div>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <a style={navLinkStyle} href="/admin">Dashboard</a>
          <a style={navLinkStyle} href="/admin/candidate/shortlist">Candidates</a>
          <a style={navLinkStyle} href="/admin/employee">Employee</a>
          <a style={navLinkStyle} href="/admin/settings">Settings</a>
        </nav>

        <div style={{ marginTop: 'auto', fontSize: 12, opacity: 0.85 }}>
          <div style={{ marginBottom: 8 }}>Version 0.1.0</div>
          <div>© {new Date().getFullYear()}</div>
        </div>
      </aside>

      <section style={{ flex: 1, padding: 28, boxSizing: 'border-box' }}>
        {children}
      </section>
    </div>
  )
}

const navLinkStyle = {
  display: 'block',
  padding: '10px 12px',
  borderRadius: 8,
  color: 'rgba(255,255,255,0.92)',
  textDecoration: 'none',
  fontSize: 14,
}