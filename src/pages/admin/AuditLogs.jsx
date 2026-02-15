import { AUDIT_LOGS } from '../../data/mockData';
import { FiSearch, FiFilter, FiBook } from 'react-icons/fi';
import { useState } from 'react';

const actionColors = {
  USER_LOGIN: '#5899c4',
  POLICY_ISSUED: '#2d9c5b',
  APPLICATION_REVIEWED: '#ff5640',
  PRODUCT_UPDATED: '#192b37',
  POLICY_CANCELLED: '#d4403b',
  RISK_SCORE_GENERATED: '#5899c4',
  RULE_MODIFIED: '#ff5640',
};

export default function AuditLogs() {
  const [search, setSearch] = useState('');
  const [filterAction, setFilterAction] = useState('All');

  const actions = ['All', ...new Set(AUDIT_LOGS.map(l => l.action))];

  const filtered = AUDIT_LOGS
    .filter(l => filterAction === 'All' || l.action === filterAction)
    .filter(l => l.actor.toLowerCase().includes(search.toLowerCase()) || l.details.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      <div className="page-header">
        <h1>Audit Logs</h1>
        <p>Track all system actions and modifications for compliance</p>
      </div>

      <div className="content-card">
        <div className="card-body-custom pb-0">
          <div className="d-flex gap-3 flex-wrap mb-3">
            <div className="position-relative flex-fill" style={{ maxWidth: 320 }}>
              <FiSearch style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', opacity: 0.3 }} />
              <input className="auth-input" style={{ paddingLeft: 40 }} placeholder="Search logs..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <select
              className="auth-input"
              style={{ width: 'auto', minWidth: 180 }}
              value={filterAction}
              onChange={e => setFilterAction(e.target.value)}
            >
              {actions.map(a => (
                <option key={a} value={a}>{a === 'All' ? 'All Actions' : a.replace(/_/g, ' ')}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="card-body-custom p-0">
          <table className="modern-table">
            <thead><tr><th>Timestamp</th><th>Action</th><th>Actor</th><th>Role</th><th>Details</th></tr></thead>
            <tbody>
              {filtered.map(log => (
                <tr key={log.id}>
                  <td style={{ fontSize: 12, opacity: 0.6, whiteSpace: 'nowrap' }}>{log.timestamp}</td>
                  <td>
                    <span style={{
                      padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600,
                      background: `${actionColors[log.action] || '#192b37'}12`,
                      color: actionColors[log.action] || '#192b37'
                    }}>
                      {log.action.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td style={{ fontWeight: 600, fontSize: 13 }}>{log.actor}</td>
                  <td>
                    <span className={`status-badge ${log.role === 'SYSTEM' ? 'info' : log.role === 'ADMIN' ? 'draft' : log.role === 'UNDERWRITER' ? 'pending' : 'active'}`} style={{ fontSize: 10 }}>
                      {log.role}
                    </span>
                  </td>
                  <td style={{ fontSize: 12, opacity: 0.7, maxWidth: 300 }}>{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
