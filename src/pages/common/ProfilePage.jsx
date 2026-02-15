import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { FiUser, FiMail, FiPhone, FiMapPin, FiEdit2, FiSave, FiShield } from 'react-icons/fi';
import { ROLE_LABELS, ROLE_COLORS } from '../../constants/roles';

export default function ProfilePage() {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '+1 555-0123',
    address: '123 Main Street, New York, NY 10001',
    dob: '1990-05-15',
  });

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || '??';

  return (
    <>
      <div className="page-header">
        <h1>My Profile</h1>
        <p>Manage your personal information and account settings</p>
      </div>

      <div className="row g-4">
        <div className="col-lg-4">
          <div className="content-card text-center">
            <div className="card-body-custom">
              <div style={{
                width: 96, height: 96, borderRadius: 24, margin: '0 auto 16px',
                background: ROLE_COLORS[user?.role] || '#192b37',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontSize: 32, fontWeight: 800
              }}>
                {initials}
              </div>
              <h4 style={{ fontWeight: 800, marginBottom: 4 }}>{user?.name}</h4>
              <span className="status-badge info">{ROLE_LABELS[user?.role]}</span>

              <div className="mt-4 pt-3" style={{ borderTop: '1px solid rgba(25,43,55,0.06)' }}>
                <div className="d-flex align-items-center gap-2 mb-3" style={{ fontSize: 13 }}>
                  <FiMail size={14} style={{ opacity: 0.4 }} />
                  <span>{user?.email}</span>
                </div>
                <div className="d-flex align-items-center gap-2 mb-3" style={{ fontSize: 13 }}>
                  <FiPhone size={14} style={{ opacity: 0.4 }} />
                  <span>{profile.phone}</span>
                </div>
                <div className="d-flex align-items-center gap-2" style={{ fontSize: 13 }}>
                  <FiMapPin size={14} style={{ opacity: 0.4 }} />
                  <span>{profile.address}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-8">
          <div className="content-card">
            <div className="card-header-custom">
              <h5>Personal Information</h5>
              <button
                className={editing ? 'btn-accent' : 'btn-outline-custom'}
                style={{ fontSize: 12, padding: '6px 16px' }}
                onClick={() => setEditing(!editing)}
              >
                {editing ? <><FiSave size={12} /> Save</> : <><FiEdit2 size={12} /> Edit</>}
              </button>
            </div>
            <div className="card-body-custom">
              <div className="row g-3">
                {[
                  { label: 'Full Name', key: 'name', icon: FiUser },
                  { label: 'Email Address', key: 'email', icon: FiMail, type: 'email' },
                  { label: 'Phone Number', key: 'phone', icon: FiPhone },
                  { label: 'Date of Birth', key: 'dob', type: 'date' },
                  { label: 'Address', key: 'address', icon: FiMapPin, full: true },
                ].map(field => (
                  <div className={field.full ? 'col-12' : 'col-md-6'} key={field.key}>
                    <label className="form-label" style={{ fontSize: 13, fontWeight: 600 }}>{field.label}</label>
                    <input
                      type={field.type || 'text'}
                      className="auth-input"
                      value={profile[field.key]}
                      onChange={e => setProfile(prev => ({ ...prev, [field.key]: e.target.value }))}
                      disabled={!editing}
                      style={{ opacity: editing ? 1 : 0.7 }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="content-card mt-4">
            <div className="card-header-custom">
              <h5><FiShield size={16} /> Security</h5>
            </div>
            <div className="card-body-custom">
              <div className="d-flex align-items-center justify-content-between p-3 mb-2" style={{ background: 'rgba(25,43,55,0.02)', borderRadius: 12 }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>Password</div>
                  <div style={{ fontSize: 12, opacity: 0.5 }}>Last changed 30 days ago</div>
                </div>
                <button className="btn-outline-custom" style={{ fontSize: 12, padding: '6px 16px' }}>Change Password</button>
              </div>
              <div className="d-flex align-items-center justify-content-between p-3" style={{ background: 'rgba(25,43,55,0.02)', borderRadius: 12 }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>Two-Factor Authentication</div>
                  <div style={{ fontSize: 12, opacity: 0.5 }}>Add an extra layer of security</div>
                </div>
                <button className="btn-outline-custom" style={{ fontSize: 12, padding: '6px 16px' }}>Enable</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
