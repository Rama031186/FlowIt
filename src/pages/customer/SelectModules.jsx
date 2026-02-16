import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PRODUCTS } from '../../data/mockData';
import { FiCheck, FiArrowRight, FiArrowLeft, FiShoppingCart } from 'react-icons/fi';

export default function SelectModules() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const product = PRODUCTS.find(p => p.id === productId) || PRODUCTS[0];
  const [selected, setSelected] = useState({});

  const toggleModule = (moduleId, intensity, price) => {
    setSelected(prev => {
      const copy = { ...prev };
      if (copy[moduleId]?.intensity === intensity) {
        delete copy[moduleId];
      } else {
        copy[moduleId] = { intensity, price };
      }
      return copy;
    });
  };

  const totalPrice = product.basePrice + Object.values(selected).reduce((s, v) => s + v.price, 0);
  const selectedCount = Object.keys(selected).length;

  return (
    <>
      <div className="d-flex align-items-center gap-3 mb-4">
        <button className="btn btn-outline-secondary d-flex align-items-center gap-1" style={{ fontSize: 13, padding: '8px 16px' }} onClick={() => navigate('/products')}>
          <FiArrowLeft size={14} /> Back
        </button>
        <div>
          <h1 className="mb-0" style={{ fontSize: 24, fontWeight: 800 }}>{product.name}</h1>
          <p className="mb-0" style={{ fontSize: 13, opacity: 0.5 }}>Select modules and intensity levels</p>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          {product.modules.map(mod => (
            <div key={mod.id} className="card mb-3">
              <div className="card-body">
                <div className="d-flex align-items-start justify-content-between mb-3">
                  <div>
                    <h5 style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{mod.name}</h5>
                    <p style={{ fontSize: 13, opacity: 0.5, margin: 0 }}>{mod.description}</p>
                  </div>
                  {selected[mod.id] && (
                    <span className="status-badge active"><FiCheck size={12} /> Selected</span>
                  )}
                </div>
                <div className="d-flex gap-2 flex-wrap">
                  {mod.intensities.map((intensity, i) => {
                    const isSelected = selected[mod.id]?.intensity === intensity;
                    return (
                      <button
                        key={intensity}
                        className={`module-card ${isSelected ? 'selected' : ''}`}
                        onClick={() => toggleModule(mod.id, intensity, mod.prices[i])}
                        style={{ minWidth: 140, textAlign: 'center' }}
                      >
                        <div style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, opacity: 0.5, marginBottom: 4 }}>{intensity}</div>
                        <div style={{ fontSize: 22, fontWeight: 800 }}>${mod.prices[i]}</div>
                        <div style={{ fontSize: 11, opacity: 0.4 }}>per month</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="col-lg-4">
          <div className="card" style={{ position: 'sticky', top: 92 }}>
            <div className="card-header">
              <h5><FiShoppingCart size={16} /> Summary</h5>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between mb-2" style={{ fontSize: 13 }}>
                <span>Base Premium</span>
                <span style={{ fontWeight: 600 }}>${product.basePrice}/mo</span>
              </div>
              {Object.entries(selected).map(([modId, { intensity, price }]) => {
                const mod = product.modules.find(m => m.id === modId);
                return (
                  <div key={modId} className="d-flex justify-content-between mb-2" style={{ fontSize: 13 }}>
                    <span>{mod?.name} ({intensity})</span>
                    <span style={{ fontWeight: 600 }}>+${price}/mo</span>
                  </div>
                );
              })}
              <hr />
              <div className="d-flex justify-content-between" style={{ fontSize: 16, fontWeight: 800 }}>
                <span>Total</span>
                <span>${totalPrice}/mo</span>
              </div>

              <button
                className="btn btn-warning w-100 mt-3 d-flex align-items-center justify-content-center gap-2"
                disabled={selectedCount === 0}
                onClick={() => navigate('/apply')}
              >
                Continue to Apply <FiArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
