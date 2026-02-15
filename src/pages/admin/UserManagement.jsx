import { ALL_USERS } from '../../data/mockData';
import { useState } from 'react';
import { FiSearch, FiPlus, FiEdit2, FiTrash2, FiMoreVertical, FiUserCheck, FiUserX } from 'react-icons/fi';
import { ROLE_LABELS, ROLE_COLORS } from '../../constants/roles';

export default function UserManagement() {
  const [users, setUsers] = useState(ALL_USERS);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('All');
  const [showModal, setShowModal] = useState(false);

  const roles = ['All', 'CUSTOMER', 'UNDERWRITER', 'ADMIN'];

  const filtered = users
    .filter(u => filterRole === 'All' || u.role === filterRole)
    .filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));

  const toggleStatus = (id) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: u.status === 'Active' ? 'Suspended' : 'Active' } : u));
  };

  return (
    <>
      <div className="page-header d-flex align-items-start justify-content-between">
        <div>
          <h1>User Management</h1>
          <p>Manage users, roles, and permissions</p>
        </div>
        <button className="btn-accent d-flex align-items-center gap-2" style={{ fontSize: 13 }}>
          <FiPlus size={14} /> Add User
        </button>
      </div>

      <div className="row g-4 mb-4">
        {[
          { label: 'Total Users', value: users.length, color: '#192b37' },
          { label: 'Customers', value: users.filter(u => u.role === 'CUSTOMER').length, color: '#5899c4' },
          { label: 'Underwriters', value: users.filter(u => u.role === 'UNDERWRITER').length, color: '#ff5640' },
          { label: 'Active', value: users.filter(u => u.status === 'Active').length, color: '#2d9c5b' },
        ].map(s => (
          <div className="col-md-3" key={s.label}>
            <div className="stat-card">
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
              <div style={{ height: 3, background: s.color, borderRadius: 2, marginTop: 12, opacity: 0.3 }} />
            </div>
          </div>
        ))}
      </div>

      <div className="content-card">
        <div className="card-body-custom pb-0">
          <div className="d-flex gap-3 flex-wrap mb-3">
            <div className="position-relative flex-fill" style={{ maxWidth: 320 }}>
              <FiSearch style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', opacity: 0.3 }} />
              <input className="auth-input" style={{ paddingLeft: 40 }} placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <div className="d-flex gap-2">
              {roles.map(r => (
                <button key={r} onClick={() => setFilterRole(r)} style={{
                  padding: '8px 16px', borderRadius: 10, border: 'none', fontSize: 12, fontWeight: 600,
                  background: filterRole === r ? '#192b37' : 'rgba(25,43,55,0.04)',
                  color: filterRole === r ? 'white' : '#192b37', cursor: 'pointer', transition: 'all 0.2s'
                }}>{r === 'All' ? 'All Roles' : ROLE_LABELS[r]}</button>
              ))}
            </div>
          </div>
        </div>
        <div className="card-body-custom p-0">
          <table className="modern-table">
            <thead><tr><th>User</th><th>Email</th><th>Role</th><th>Status</th><th>Last Login</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id}>
                  <td>
                    <div className="d-flex align-items-center gap-3">
                      <div style={{
                        width: 36, height: 36, borderRadius: 10,
                        background: ROLE_COLORS[u.role], color: 'white',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 700, fontSize: 12
                      }}>
                        {u.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span style={{ fontWeight: 600 }}>{u.name}</span>
                    </div>
                  </td>
                  <td style={{ fontSize: 13 }}>{u.email}</td>
                  <td><span className="status-badge info" style={{ fontSize: 11 }}>{ROLE_LABELS[u.role]}</span></td>
                  <td><span className={`status-badge ${u.status.toLowerCase()}`}>{u.status}</span></td>
                  <td style={{ fontSize: 12, opacity: 0.6 }}>{u.lastLogin}</td>
                  <td>
                    <div className="d-flex gap-1">
                      <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, borderRadius: 6, transition: 'all 0.2s' }}
                        title="Edit" onMouseEnter={e => e.target.style.background = 'rgba(25,43,55,0.04)'} onMouseLeave={e => e.target.style.background = 'none'}>
                        <FiEdit2 size={14} />
                      </button>
                      <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, borderRadius: 6, transition: 'all 0.2s' }}
                        title={u.status === 'Active' ? 'Suspend' : 'Activate'}
                        onClick={() => toggleStatus(u.id)}
                        onMouseEnter={e => e.target.style.background = 'rgba(25,43,55,0.04)'} onMouseLeave={e => e.target.style.background = 'none'}>
                        {u.status === 'Active' ? <FiUserX size={14} style={{ color: '#d4403b' }} /> : <FiUserCheck size={14} style={{ color: '#2d9c5b' }} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
