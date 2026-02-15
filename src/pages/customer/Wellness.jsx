import { WELLNESS_DATA } from '../../data/mockData';
import { FiHeart, FiAward, FiTrendingUp, FiGift, FiActivity } from 'react-icons/fi';
import { useState } from 'react';

export default function Wellness() {
  const [activeTab, setActiveTab] = useState('earn');

  return (
    <>
      <div className="page-header">
        <h1>Wellness Center</h1>
        <p>Earn credits through healthy activities and redeem rewards</p>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <div className="stat-card text-center">
            <div className="d-flex justify-content-center mb-3">
              <div className="wellness-credit-ring">
                <span className="credit-value">{WELLNESS_DATA.totalCredits}</span>
              </div>
            </div>
            <div className="stat-label">Total Credits Available</div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(45,156,91,0.1)', color: '#2d9c5b' }}><FiTrendingUp /></div>
            <div className="stat-value">{WELLNESS_DATA.earnedThisMonth}</div>
            <div className="stat-label">Earned This Month</div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(255,86,64,0.1)', color: '#ff5640' }}><FiGift /></div>
            <div className="stat-value">{WELLNESS_DATA.redeemedThisMonth}</div>
            <div className="stat-label">Redeemed This Month</div>
          </div>
        </div>
      </div>

      <div className="content-card">
        <div className="card-header-custom">
          <div className="d-flex gap-2">
            {['earn', 'redeem', 'rewards'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '8px 18px', borderRadius: 10, border: 'none', fontSize: 13, fontWeight: 600,
                  background: activeTab === tab ? '#192b37' : 'transparent',
                  color: activeTab === tab ? 'white' : '#192b37',
                  cursor: 'pointer', transition: 'all 0.2s'
                }}
              >
                {tab === 'earn' ? '🏃 Activities' : tab === 'redeem' ? '🎁 Redeemed' : '🏆 Rewards'}
              </button>
            ))}
          </div>
        </div>
        <div className="card-body-custom">
          {activeTab === 'earn' && (
            <div>
              {WELLNESS_DATA.activities.map(a => (
                <div key={a.id} className="d-flex align-items-center gap-3 p-3 mb-2" style={{ background: 'rgba(25,43,55,0.02)', borderRadius: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(45,156,91,0.1)', color: '#2d9c5b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FiActivity size={18} />
                  </div>
                  <div className="flex-fill">
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{a.type}</div>
                    <div style={{ fontSize: 12, opacity: 0.5 }}>{a.description}</div>
                  </div>
                  <div className="text-end">
                    <div style={{ fontWeight: 700, fontSize: 16, color: '#2d9c5b' }}>+{a.credits}</div>
                    <div style={{ fontSize: 11, opacity: 0.4 }}>{a.date}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'redeem' && (
            <div>
              {WELLNESS_DATA.redemptions.map(r => (
                <div key={r.id} className="d-flex align-items-center gap-3 p-3 mb-2" style={{ background: 'rgba(25,43,55,0.02)', borderRadius: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(88,153,196,0.1)', color: '#5899c4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FiGift size={18} />
                  </div>
                  <div className="flex-fill">
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{r.item}</div>
                    <div style={{ fontSize: 12, opacity: 0.5 }}>{r.date}</div>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 16, color: '#ff5640' }}>-{r.credits}</div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'rewards' && (
            <div className="row g-3">
              {WELLNESS_DATA.rewards.map(rw => (
                <div className="col-md-6 col-lg-4" key={rw.id}>
                  <div className="module-card text-center p-4">
                    <FiAward size={28} style={{ color: '#ff5640', marginBottom: 12 }} />
                    <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{rw.name}</div>
                    <div style={{ fontSize: 12, opacity: 0.5, marginBottom: 12 }}>{rw.category}</div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: '#192b37', marginBottom: 12 }}>{rw.creditsRequired} <span style={{ fontSize: 12, fontWeight: 500, opacity: 0.5 }}>credits</span></div>
                    <button
                      className="btn-accent w-100"
                      style={{ fontSize: 12, padding: '8px' }}
                      disabled={WELLNESS_DATA.totalCredits < rw.creditsRequired}
                    >
                      {WELLNESS_DATA.totalCredits >= rw.creditsRequired ? 'Redeem Now' : 'Not Enough Credits'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
