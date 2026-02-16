import { NOTIFICATIONS } from '../../data/mockData';
import { FiBell, FiCheck, FiAlertCircle, FiInfo, FiCheckCircle } from 'react-icons/fi';
import { useState } from 'react';

export default function Notifications() {
  const [notifs, setNotifs] = useState(NOTIFICATIONS);

  const markAllRead = () => {
    setNotifs(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notifs.filter(n => !n.read).length;

  const typeConfig = {
    warning: { icon: FiAlertCircle, bg: 'rgba(255,86,64,0.08)', color: '#ff5640', border: 'rgba(255,86,64,0.12)' },
    success: { icon: FiCheckCircle, bg: 'rgba(45,156,91,0.08)', color: '#2d9c5b', border: 'rgba(45,156,91,0.12)' },
    info: { icon: FiInfo, bg: 'rgba(88,153,196,0.08)', color: '#5899c4', border: 'rgba(88,153,196,0.12)' },
  };

  return (
    <>
      <div className="mb-4 d-flex align-items-start justify-content-between">
        <div>
          <h1>Notifications</h1>
          <p>{unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}</p>
        </div>
        {unreadCount > 0 && (
          <button className="btn btn-outline-secondary d-flex align-items-center gap-2" style={{ fontSize: 13 }} onClick={markAllRead}>
            <FiCheck size={14} /> Mark all as read
          </button>
        )}
      </div>

      <div className="d-flex flex-column gap-3">
        {notifs.map(n => {
          const config = typeConfig[n.type] || typeConfig.info;
          const Icon = config.icon;
          return (
            <div
              key={n.id}
              className="card"
              style={{
                borderLeft: `3px solid ${config.color}`,
                opacity: n.read ? 0.65 : 1,
                transition: 'all 0.3s'
              }}
            >
              <div className="card-body d-flex align-items-start gap-3">
                <div style={{
                  width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                  background: config.bg, color: config.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <Icon size={20} />
                </div>
                <div className="flex-fill">
                  <div className="d-flex justify-content-between align-items-start">
                    <h6 style={{ fontWeight: 700, fontSize: 14, margin: 0 }}>{n.title}</h6>
                    {!n.read && <span style={{ width: 8, height: 8, borderRadius: '50%', background: config.color, flexShrink: 0 }} />}
                  </div>
                  <p style={{ fontSize: 13, opacity: 0.7, margin: '6px 0 0', lineHeight: 1.5 }}>{n.message}</p>
                  <span style={{ fontSize: 11, opacity: 0.4 }}>{n.date}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
