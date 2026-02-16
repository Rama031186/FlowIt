import { FAMILY_POOLS } from '../../data/mockData';
import { FiUsers, FiPlus, FiEdit2, FiShield } from 'react-icons/fi';
import { useState } from 'react';

export default function FamilyPool() {
  const [pool] = useState(FAMILY_POOLS[0]);
  const usedPercent = Math.round((pool.allocatedCoverage / pool.totalCoverage) * 100);

  return (
    <>
      <div className="mb-4 d-flex align-items-start justify-content-between">
        <div>
          <h1>Family Pool</h1>
          <p>Manage your family coverage pool and allocate benefits to members</p>
        </div>
        <button className="btn btn-warning d-flex align-items-center gap-2" style={{ fontSize: 13 }}>
          <FiPlus size={14} /> Add Member
        </button>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <div className="card border-0 h-100">
            <div className="d-flex align-items-center justify-content-center rounded-3 mb-3" style={{ background: 'rgba(25,43,55,0.08)', color: '#192b37' }}><FiShield /></div>
            <div className="fw-bold mb-1">${(pool.totalCoverage / 1000).toFixed(0)}K</div>
            <div className="text-muted small">Total Coverage</div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 h-100">
            <div className="d-flex align-items-center justify-content-center rounded-3 mb-3" style={{ background: 'rgba(45,156,91,0.1)', color: '#2d9c5b' }}><FiUsers /></div>
            <div className="fw-bold mb-1">${(pool.allocatedCoverage / 1000).toFixed(0)}K</div>
            <div className="text-muted small">Allocated Coverage</div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 h-100">
            <div className="d-flex align-items-center justify-content-center rounded-3 mb-3" style={{ background: 'rgba(88,153,196,0.1)', color: '#5899c4' }}><FiUsers /></div>
            <div className="fw-bold mb-1">{pool.members.length}</div>
            <div className="text-muted small">Family Members</div>
          </div>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-header">
          <h5>Coverage Allocation</h5>
          <span style={{ fontSize: 12, opacity: 0.5 }}>{usedPercent}% allocated</span>
        </div>
        <div className="card-body">
          <div style={{ height: 8, background: 'rgba(25,43,55,0.06)', borderRadius: 4, overflow: 'hidden', marginBottom: 24 }}>
            <div style={{ width: `${usedPercent}%`, height: '100%', background: 'linear-gradient(90deg, #2d9c5b, #5899c4)', borderRadius: 4, transition: 'width 0.6s ease' }} />
          </div>

          {pool.members.map((member, i) => {
            const memberPercent = Math.round((member.allocation / pool.totalCoverage) * 100);
            return (
              <div key={i} className="d-flex align-items-center gap-3 p-3 mb-2" style={{ background: 'rgba(25,43,55,0.02)', borderRadius: 12 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: i === 0 ? '#192b37' : i === 1 ? '#5899c4' : '#ff5640',
                  color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontSize: 14
                }}>
                  {member.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-fill">
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{member.name}</div>
                  <div style={{ fontSize: 12, opacity: 0.5 }}>{member.relation}</div>
                </div>
                <div className="text-end">
                  <div style={{ fontWeight: 700, fontSize: 16 }}>${(member.allocation / 1000).toFixed(0)}K</div>
                  <div style={{ fontSize: 11, opacity: 0.4 }}>{memberPercent}%</div>
                </div>
                <button style={{ background: 'none', border: 'none', cursor: 'pointer', opacity: 0.3, transition: 'opacity 0.2s' }}
                  onMouseEnter={e => e.target.style.opacity = 1}
                  onMouseLeave={e => e.target.style.opacity = 0.3}
                >
                  <FiEdit2 size={14} />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
