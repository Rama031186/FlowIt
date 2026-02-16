import { BUSINESS_RULES } from '../../data/mockData';
import { useState } from 'react';
import { FiPlus, FiEdit2, FiSave, FiX, FiSettings } from 'react-icons/fi';

export default function BusinessRules() {
  const [rules, setRules] = useState(BUSINESS_RULES);
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');

  const categories = ['All', ...new Set(rules.map(r => r.category))];
  const [filterCat, setFilterCat] = useState('All');

  const filtered = rules.filter(r => filterCat === 'All' || r.category === filterCat);

  const startEdit = (rule) => {
    setEditingId(rule.id);
    setEditValue(rule.value);
  };

  const saveEdit = (id) => {
    setRules(prev => prev.map(r => r.id === id ? { ...r, value: editValue, lastModified: new Date().toISOString().split('T')[0] } : r));
    setEditingId(null);
  };

  const toggleStatus = (id) => {
    setRules(prev => prev.map(r => r.id === id ? { ...r, status: r.status === 'Active' ? 'Inactive' : 'Active' } : r));
  };

  return (
    <>
      <div className="mb-4 d-flex align-items-start justify-content-between">
        <div>
          <h1>Business Rules</h1>
          <p>Configure system-wide business rules and thresholds</p>
        </div>
        <button className="btn btn-warning d-flex align-items-center gap-2" style={{ fontSize: 13 }}>
          <FiPlus size={14} /> Add Rule
        </button>
      </div>

      <div className="d-flex gap-2 mb-4 flex-wrap">
        {categories.map(c => (
          <button key={c} onClick={() => setFilterCat(c)} style={{
            padding: '8px 16px', borderRadius: 10, border: 'none', fontSize: 12, fontWeight: 600,
            background: filterCat === c ? '#192b37' : 'rgba(25,43,55,0.04)',
            color: filterCat === c ? 'white' : '#192b37', cursor: 'pointer', transition: 'all 0.2s'
          }}>{c}</button>
        ))}
      </div>

      <div className="d-flex flex-column gap-3">
        {filtered.map(rule => (
          <div key={rule.id} className="card">
            <div className="card-body d-flex align-items-center gap-4">
              <div style={{
                width: 48, height: 48, borderRadius: 14, flexShrink: 0,
                background: rule.status === 'Active' ? 'rgba(45,156,91,0.1)' : 'rgba(25,43,55,0.06)',
                color: rule.status === 'Active' ? '#2d9c5b' : '#192b37',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <FiSettings size={20} />
              </div>
              <div className="flex-fill">
                <div className="d-flex align-items-center gap-2 mb-1">
                  <span style={{ fontWeight: 700, fontSize: 15 }}>{rule.name}</span>
                  <span className={`status-badge ${rule.status.toLowerCase()}`} style={{ fontSize: 10 }}>{rule.status}</span>
                </div>
                <div style={{ fontSize: 13, opacity: 0.5 }}>{rule.description}</div>
                <div className="d-flex gap-3 mt-2" style={{ fontSize: 11, opacity: 0.4 }}>
                  <span>Category: {rule.category}</span>
                  <span>Modified: {rule.lastModified}</span>
                </div>
              </div>
              <div className="d-flex align-items-center gap-3">
                {editingId === rule.id ? (
                  <div className="d-flex align-items-center gap-2">
                    <input className="form-control" style={{ width: 100, padding: '8px 12px', fontSize: 14, fontWeight: 700, textAlign: 'center' }} value={editValue} onChange={e => setEditValue(e.target.value)} />
                    <button onClick={() => saveEdit(rule.id)} style={{ background: 'rgba(45,156,91,0.1)', border: 'none', borderRadius: 8, padding: 8, cursor: 'pointer', color: '#2d9c5b' }}><FiSave size={16} /></button>
                    <button onClick={() => setEditingId(null)} style={{ background: 'rgba(212,64,59,0.1)', border: 'none', borderRadius: 8, padding: 8, cursor: 'pointer', color: '#d4403b' }}><FiX size={16} /></button>
                  </div>
                ) : (
                  <>
                    <div style={{ fontSize: 24, fontWeight: 800, minWidth: 60, textAlign: 'center' }}>{rule.value}</div>
                    <button onClick={() => startEdit(rule)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, opacity: 0.4 }}><FiEdit2 size={16} /></button>
                  </>
                )}
                <button
                  onClick={() => toggleStatus(rule.id)}
                  style={{
                    width: 44, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer',
                    background: rule.status === 'Active' ? '#2d9c5b' : 'rgba(25,43,55,0.15)',
                    position: 'relative', transition: 'all 0.3s'
                  }}
                >
                  <div style={{
                    width: 18, height: 18, borderRadius: '50%', background: 'white',
                    position: 'absolute', top: 3,
                    left: rule.status === 'Active' ? 23 : 3,
                    transition: 'all 0.3s', boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                  }} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
