import { POLICIES } from '../../data/mockData';
import { FiFileText, FiDownload, FiCalendar, FiDollarSign } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

export default function PolicyDocuments() {
  const navigate = useNavigate();

  return (
    <>
      <div className="mb-4">
        <h1>My Policies</h1>
        <p>View and manage your active insurance policies</p>
      </div>

      <div className="row g-4">
        {POLICIES.map(policy => (
          <div className="col-md-6" key={policy.id}>
            <div className="card" style={{ transition: 'all 0.3s' }}>
              <div className="card-body">
                <div className="d-flex align-items-start justify-content-between mb-3">
                  <div>
                    <div style={{ fontSize: 12, opacity: 0.4, fontWeight: 600, marginBottom: 4 }}>{policy.id}</div>
                    <h5 style={{ fontWeight: 700, fontSize: 18, marginBottom: 4 }}>{policy.productName}</h5>
                    <span className={`status-badge ${policy.status.toLowerCase().replace(/\s+/g, '-')}`}>{policy.status}</span>
                  </div>
                  <div style={{
                    width: 48, height: 48, borderRadius: 14,
                    background: policy.status === 'Active' ? 'rgba(45,156,91,0.1)' : policy.status === 'Cancelled' ? 'rgba(212,64,59,0.1)' : 'rgba(255,86,64,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: policy.status === 'Active' ? '#2d9c5b' : policy.status === 'Cancelled' ? '#d4403b' : '#ff5640'
                  }}>
                    <FiFileText size={20} />
                  </div>
                </div>

                <div className="d-flex flex-wrap gap-3 mb-3" style={{ fontSize: 13 }}>
                  <div className="d-flex align-items-center gap-2">
                    <FiDollarSign size={14} style={{ opacity: 0.4 }} />
                    <span><strong>${policy.premium}</strong>/mo</span>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <FiCalendar size={14} style={{ opacity: 0.4 }} />
                    <span>{policy.startDate} — {policy.endDate}</span>
                  </div>
                </div>

                <div className="d-flex gap-1 flex-wrap mb-3">
                  {policy.modules.map((m, i) => (
                    <span key={i} style={{ fontSize: 11, padding: '3px 10px', borderRadius: 6, background: 'rgba(25,43,55,0.04)', fontWeight: 500 }}>{m}</span>
                  ))}
                </div>

                <div className="d-flex gap-2">
                  <button className="btn btn-outline-secondary flex-fill d-flex align-items-center justify-content-center gap-1" style={{ fontSize: 12, padding: '8px' }}>
                    <FiDownload size={12} /> Download
                  </button>
                  {policy.status === 'Active' && (
                    <button className="btn btn-primary flex-fill" style={{ fontSize: 12, padding: '8px' }} onClick={() => navigate('/policies/renew')}>
                      Renew
                    </button>
                  )}
                  {policy.status !== 'Cancelled' && (
                    <button className="btn btn-outline-secondary flex-fill" style={{ fontSize: 12, padding: '8px', color: '#d4403b', borderColor: '#d4403b22' }} onClick={() => navigate('/policies/cancel')}>
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
