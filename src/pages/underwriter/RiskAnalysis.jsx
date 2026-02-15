import { APPLICATIONS } from '../../data/mockData';
import { FiActivity, FiAlertTriangle, FiCheckCircle, FiTrendingUp } from 'react-icons/fi';

export default function RiskAnalysis() {
  const sortedByRisk = [...APPLICATIONS].sort((a, b) => b.riskScore - a.riskScore);
  const avgRisk = Math.round(APPLICATIONS.reduce((s, a) => s + a.riskScore, 0) / APPLICATIONS.length);
  const highRisk = APPLICATIONS.filter(a => a.riskScore > 70).length;
  const mediumRisk = APPLICATIONS.filter(a => a.riskScore > 35 && a.riskScore <= 70).length;
  const lowRisk = APPLICATIONS.filter(a => a.riskScore <= 35).length;

  return (
    <>
      <div className="page-header">
        <h1>Risk Analysis</h1>
        <p>Analyze risk scores across all applications and identify patterns</p>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <div className="stat-card text-center">
            <div className="stat-icon mx-auto" style={{ background: 'rgba(25,43,55,0.08)', color: '#192b37' }}><FiActivity /></div>
            <div className="stat-value">{avgRisk}</div>
            <div className="stat-label">Average Risk Score</div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="stat-card text-center">
            <div className="stat-icon mx-auto" style={{ background: 'rgba(45,156,91,0.1)', color: '#2d9c5b' }}><FiCheckCircle /></div>
            <div className="stat-value">{lowRisk}</div>
            <div className="stat-label">Low Risk</div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="stat-card text-center">
            <div className="stat-icon mx-auto" style={{ background: 'rgba(255,86,64,0.1)', color: '#ff5640' }}><FiTrendingUp /></div>
            <div className="stat-value">{mediumRisk}</div>
            <div className="stat-label">Medium Risk</div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="stat-card text-center">
            <div className="stat-icon mx-auto" style={{ background: 'rgba(212,64,59,0.1)', color: '#d4403b' }}><FiAlertTriangle /></div>
            <div className="stat-value">{highRisk}</div>
            <div className="stat-label">High Risk</div>
          </div>
        </div>
      </div>

      {/* Risk Distribution Bar */}
      <div className="content-card mb-4">
        <div className="card-header-custom">
          <h5>Risk Distribution</h5>
        </div>
        <div className="card-body-custom">
          <div className="d-flex" style={{ height: 32, borderRadius: 8, overflow: 'hidden' }}>
            <div style={{ width: `${(lowRisk / APPLICATIONS.length) * 100}%`, background: '#2d9c5b', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 11, fontWeight: 700, transition: 'width 0.6s' }}>
              {lowRisk > 0 && `${Math.round((lowRisk / APPLICATIONS.length) * 100)}%`}
            </div>
            <div style={{ width: `${(mediumRisk / APPLICATIONS.length) * 100}%`, background: '#ff5640', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 11, fontWeight: 700, transition: 'width 0.6s' }}>
              {mediumRisk > 0 && `${Math.round((mediumRisk / APPLICATIONS.length) * 100)}%`}
            </div>
            <div style={{ width: `${(highRisk / APPLICATIONS.length) * 100}%`, background: '#d4403b', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 11, fontWeight: 700, transition: 'width 0.6s' }}>
              {highRisk > 0 && `${Math.round((highRisk / APPLICATIONS.length) * 100)}%`}
            </div>
          </div>
          <div className="d-flex gap-4 mt-3 justify-content-center">
            {[
              { label: 'Low Risk (≤35)', color: '#2d9c5b' },
              { label: 'Medium Risk (36-70)', color: '#ff5640' },
              { label: 'High Risk (>70)', color: '#d4403b' },
            ].map(l => (
              <div key={l.label} className="d-flex align-items-center gap-2" style={{ fontSize: 12 }}>
                <div style={{ width: 10, height: 10, borderRadius: 3, background: l.color }} />
                {l.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Applications sorted by risk */}
      <div className="content-card">
        <div className="card-header-custom">
          <h5>Applications by Risk Score</h5>
        </div>
        <div className="card-body-custom p-0">
          <table className="modern-table">
            <thead><tr><th>ID</th><th>Customer</th><th>Product</th><th>Risk Score</th><th>Status</th></tr></thead>
            <tbody>
              {sortedByRisk.map(app => (
                <tr key={app.id}>
                  <td style={{ fontWeight: 600 }}>{app.id}</td>
                  <td>{app.customerName}</td>
                  <td>{app.productName}</td>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <span className={`risk-score ${app.riskScore <= 35 ? 'low' : app.riskScore <= 70 ? 'medium' : 'high'}`}>{app.riskScore}</span>
                      <div style={{ flex: 1, maxWidth: 120 }}>
                        <div style={{ height: 6, background: 'rgba(25,43,55,0.06)', borderRadius: 3, overflow: 'hidden' }}>
                          <div style={{
                            width: `${app.riskScore}%`, height: '100%', borderRadius: 3,
                            background: app.riskScore <= 35 ? '#2d9c5b' : app.riskScore <= 70 ? '#ff5640' : '#d4403b',
                            transition: 'width 0.6s'
                          }} />
                        </div>
                      </div>
                    </div>
                  </td>
                  <td><span className={`status-badge ${app.status.toLowerCase().replace(/\s+/g, '-')}`}>{app.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
