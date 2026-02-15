import { APPLICATIONS } from '../../data/mockData';
import { useState } from 'react';
import { FiSearch, FiFilter, FiEye, FiCheck, FiX, FiAlertCircle } from 'react-icons/fi';

export default function ReviewApplication() {
  const [apps, setApps] = useState(APPLICATIONS);
  const [selectedApp, setSelectedApp] = useState(null);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  const statuses = ['All', 'Pending Review', 'Under Review', 'Conditionally Approved', 'Approved', 'Rejected'];

  const filtered = apps
    .filter(a => filterStatus === 'All' || a.status === filterStatus)
    .filter(a => a.customerName.toLowerCase().includes(search.toLowerCase()) || a.id.toLowerCase().includes(search.toLowerCase()));

  const handleStatusChange = (appId, newStatus) => {
    setApps(prev => prev.map(a => a.id === appId ? { ...a, status: newStatus } : a));
    setSelectedApp(null);
  };

  if (selectedApp) {
    const app = apps.find(a => a.id === selectedApp);
    return (
      <>
        <div className="d-flex align-items-center gap-3 mb-4">
          <button className="btn-outline-custom" style={{ fontSize: 13, padding: '8px 16px' }} onClick={() => setSelectedApp(null)}>← Back</button>
          <div>
            <h1 className="mb-0" style={{ fontSize: 24, fontWeight: 800 }}>Application {app.id}</h1>
            <p className="mb-0" style={{ fontSize: 13, opacity: 0.5 }}>Review application details and make a decision</p>
          </div>
        </div>

        <div className="row g-4">
          <div className="col-lg-8">
            <div className="content-card mb-4">
              <div className="card-header-custom"><h5>Applicant Details</h5></div>
              <div className="card-body-custom">
                <div className="row g-3">
                  {[
                    { label: 'Customer', value: app.customerName },
                    { label: 'Product', value: app.productName },
                    { label: 'Submitted', value: app.submittedDate },
                    { label: 'Total Premium', value: `$${app.totalPremium}/mo` },
                    { label: 'Medical Disclosure', value: app.medicalDisclosure ? 'Completed' : 'Not submitted' },
                  ].map(item => (
                    <div className="col-md-6" key={item.label}>
                      <div style={{ fontSize: 12, opacity: 0.5 }}>{item.label}</div>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>{item.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="content-card mb-4">
              <div className="card-header-custom"><h5>Selected Modules</h5></div>
              <div className="card-body-custom">
                <div className="d-flex gap-2 flex-wrap">
                  {app.selectedModules.map((m, i) => (
                    <span key={i} style={{ padding: '6px 14px', borderRadius: 8, background: 'rgba(25,43,55,0.04)', fontSize: 13, fontWeight: 500 }}>{m}</span>
                  ))}
                </div>
              </div>
            </div>

            {app.conditions && (
              <div className="content-card mb-4">
                <div className="card-header-custom"><h5>Conditions</h5></div>
                <div className="card-body-custom">
                  {app.conditions.map((c, i) => (
                    <div key={i} className="d-flex align-items-center gap-2 mb-2" style={{ fontSize: 13 }}>
                      <FiAlertCircle size={14} style={{ color: '#ff5640' }} /> {c}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="col-lg-4">
            <div className="content-card mb-4">
              <div className="card-body-custom text-center">
                <div style={{
                  width: 80, height: 80, borderRadius: '50%', margin: '0 auto 12px',
                  background: `conic-gradient(${app.riskScore <= 35 ? '#2d9c5b' : app.riskScore <= 70 ? '#ff5640' : '#d4403b'} 0% ${app.riskScore}%, rgba(25,43,55,0.06) ${app.riskScore}% 100%)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative'
                }}>
                  <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: 20, fontWeight: 800, color: app.riskScore <= 35 ? '#2d9c5b' : app.riskScore <= 70 ? '#ff5640' : '#d4403b' }}>{app.riskScore}</span>
                  </div>
                </div>
                <div style={{ fontWeight: 700 }}>Risk Score</div>
                <span className={`status-badge ${app.riskScore <= 35 ? 'active' : app.riskScore <= 70 ? 'pending' : 'rejected'} mt-2`}>
                  {app.riskScore <= 35 ? 'Low Risk' : app.riskScore <= 70 ? 'Medium Risk' : 'High Risk'}
                </span>
              </div>
            </div>

            <div className="content-card">
              <div className="card-header-custom"><h5>Decision</h5></div>
              <div className="card-body-custom">
                <div className="d-flex flex-column gap-2">
                  <button className="btn-accent w-100 d-flex align-items-center justify-content-center gap-2" onClick={() => handleStatusChange(app.id, 'Approved')}>
                    <FiCheck /> Approve
                  </button>
                  <button className="btn-outline-custom w-100 d-flex align-items-center justify-content-center gap-2" onClick={() => handleStatusChange(app.id, 'Conditionally Approved')}>
                    <FiAlertCircle size={14} /> Conditional Approval
                  </button>
                  <button className="w-100 d-flex align-items-center justify-content-center gap-2" style={{ background: 'rgba(212,64,59,0.08)', color: '#d4403b', border: 'none', padding: '10px', borderRadius: 10, fontWeight: 600, fontSize: 13, cursor: 'pointer' }}
                    onClick={() => handleStatusChange(app.id, 'Rejected')}>
                    <FiX /> Reject
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="page-header">
        <h1>Review Applications</h1>
        <p>Review and manage insurance applications submitted by customers</p>
      </div>

      <div className="content-card mb-4">
        <div className="card-body-custom">
          <div className="d-flex gap-3 flex-wrap">
            <div className="position-relative flex-fill" style={{ maxWidth: 320 }}>
              <FiSearch style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', opacity: 0.3 }} />
              <input className="auth-input" style={{ paddingLeft: 40 }} placeholder="Search by name or ID..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <div className="d-flex gap-2 flex-wrap">
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
      </div>

      <div className="content-card">
        <div className="card-body-custom p-0">
          <table className="modern-table">
            <thead><tr><th>ID</th><th>Customer</th><th>Product</th><th>Risk Score</th><th>Premium</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {filtered.map(app => (
                <tr key={app.id}>
                  <td style={{ fontWeight: 600 }}>{app.id}</td>
                  <td>{app.customerName}</td>
                  <td>{app.productName}</td>
                  <td><span className={`risk-score ${app.riskScore <= 35 ? 'low' : app.riskScore <= 70 ? 'medium' : 'high'}`}>{app.riskScore}</span></td>
                  <td>${app.totalPremium}/mo</td>
                  <td><span className={`status-badge ${app.status.toLowerCase().replace(/\s+/g, '-')}`}>{app.status}</span></td>
                  <td>
                    <button className="btn-outline-custom d-flex align-items-center gap-1" style={{ fontSize: 11, padding: '5px 12px' }} onClick={() => setSelectedApp(app.id)}>
                      <FiEye size={12} /> Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <h4>No Applications Found</h4>
              <p>Try adjusting your filters or search criteria</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
