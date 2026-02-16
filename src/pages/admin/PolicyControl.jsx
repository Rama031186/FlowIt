import { POLICIES } from '../../data/mockData';
import { useState } from 'react';
import { FiSearch, FiEye, FiXCircle, FiShield, FiRefreshCw } from 'react-icons/fi';

export default function PolicyControl() {
  const [policies, setPolicies] = useState(POLICIES);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  const statuses = ['All', 'Active', 'Expiring Soon', 'Cancelled'];

  const filtered = policies
    .filter(p => filterStatus === 'All' || p.status === filterStatus)
    .filter(p => p.customerName.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase()));

  const cancelPolicy = (id) => {
    setPolicies(prev => prev.map(p => p.id === id ? { ...p, status: 'Cancelled', cancelledDate: new Date().toISOString().split('T')[0], cancelReason: 'Admin cancelled' } : p));
  };

  return (
    <>
      <div className="mb-4">
        <h1>Policy Control</h1>
        <p>View and manage all policies across the system</p>
      </div>

      <div className="row g-4 mb-4">
        {[
          { label: 'Total Policies', value: policies.length, color: '#192b37', icon: FiShield },
          { label: 'Active', value: policies.filter(p => p.status === 'Active').length, color: '#2d9c5b', icon: FiShield },
          { label: 'Expiring Soon', value: policies.filter(p => p.status === 'Expiring Soon').length, color: '#ff5640', icon: FiRefreshCw },
          { label: 'Cancelled', value: policies.filter(p => p.status === 'Cancelled').length, color: '#d4403b', icon: FiXCircle },
        ].map(s => (
          <div className="col-md-3" key={s.label}>
            <div className="card border-0 h-100">
              <div className="d-flex align-items-center justify-content-center rounded-3 mb-3" style={{ background: `${s.color}12`, color: s.color }}><s.icon /></div>
              <div className="fw-bold mb-1">{s.value}</div>
              <div className="text-muted small">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-body pb-0">
          <div className="d-flex gap-3 flex-wrap mb-3">
            <div className="position-relative flex-fill" style={{ maxWidth: 320 }}>
              <FiSearch style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', opacity: 0.3 }} />
              <input className="form-control" style={{ paddingLeft: 40 }} placeholder="Search policies..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <div className="d-flex gap-2">
              {statuses.map(s => (
                <button key={s} onClick={() => setFilterStatus(s)} style={{
                  padding: '8px 16px', borderRadius: 10, border: 'none', fontSize: 12, fontWeight: 600,
                  background: filterStatus === s ? '#192b37' : 'rgba(25,43,55,0.04)',
                  color: filterStatus === s ? 'white' : '#192b37', cursor: 'pointer', transition: 'all 0.2s'
                }}>{s}</button>
              ))}
            </div>
          </div>
        </div>
        <div className="card-body p-0">
          <table className="table">
            <thead><tr><th>Policy ID</th><th>Customer</th><th>Product</th><th>Premium</th><th>Period</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id}>
                  <td style={{ fontWeight: 600 }}>{p.id}</td>
                  <td>{p.customerName}</td>
                  <td>{p.productName}</td>
                  <td style={{ fontWeight: 600 }}>${p.premium}/mo</td>
                  <td style={{ fontSize: 12, opacity: 0.6 }}>{p.startDate} — {p.endDate}</td>
                  <td><span className={`status-badge ${p.status.toLowerCase().replace(/\s+/g, '-')}`}>{p.status}</span></td>
                  <td>
                    <div className="d-flex gap-1">
                      {p.status !== 'Cancelled' && (
                        <button className="d-flex align-items-center gap-1" style={{
                          fontSize: 11, padding: '5px 12px', borderRadius: 8,
                          background: 'rgba(212,64,59,0.08)', color: '#d4403b',
                          border: 'none', cursor: 'pointer', fontWeight: 600
                        }} onClick={() => cancelPolicy(p.id)}>
                          <FiXCircle size={12} /> Cancel
                        </button>
                      )}
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
