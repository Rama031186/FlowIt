import { PRODUCTS } from '../../data/mockData';
import { useNavigate } from 'react-router-dom';
import { FiArrowRight, FiStar, FiPackage } from 'react-icons/fi';

const categoryColors = {
  'Life Insurance': '#192b37',
  'Family Insurance': '#5899c4',
  'Health & Wellness': '#2d9c5b',
  'Return of Premium': '#ff5640',
};

export default function BrowseProducts() {
  const navigate = useNavigate();

  return (
    <>
      <div className="mb-4">
        <h1>Browse Products</h1>
        <p>Explore our modular insurance products and build your custom coverage</p>
      </div>

      <div className="row g-4">
        {PRODUCTS.map((product) => {
          const color = categoryColors[product.category] || '#192b37';
          return (
            <div className="col-md-6 col-xl-3" key={product.id}>
              <div className="card border-0 h-100 p-4">
                <div style={{
                  width: 48, height: 48, borderRadius: 14,
                  background: `${color}12`, color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: 16
                }}>
                  <FiPackage size={22} />
                </div>
                <div className="small fw-semibold text-uppercase mb-1" style={{ color }}>{product.category}</div>
                <div className="fw-bold fs-5 mb-2">{product.name}</div>
                <div className="text-muted small">{product.description}</div>

                <div className="d-flex align-items-center gap-2 mt-3 mb-2" style={{ fontSize: 12, opacity: 0.5 }}>
                  <FiStar size={12} />
                  <span>v{product.version}</span>
                  <span className={`status-badge ms-auto ${product.status.toLowerCase()}`} style={{ fontSize: 10, padding: '2px 8px' }}>
                    {product.status}
                  </span>
                </div>

                <div className="d-flex align-items-end justify-content-between mt-2">
                  <div className="fw-bold fs-4">
                    ${product.basePrice}<span>/mo</span>
                  </div>
                  <button
                    className="btn btn-warning d-flex align-items-center gap-1"
                    style={{ fontSize: 12, padding: '8px 16px' }}
                    onClick={() => navigate(`/products/${product.id}`)}
                  >
                    Configure <FiArrowRight size={12} />
                  </button>
                </div>

                <div className="mt-3 pt-3" style={{ borderTop: '1px solid rgba(25,43,55,0.06)' }}>
                  <div style={{ fontSize: 11, opacity: 0.4, marginBottom: 6 }}>{product.modules.length} Modules Available</div>
                  <div className="d-flex gap-1 flex-wrap">
                    {product.modules.map(m => (
                      <span key={m.id} style={{
                        fontSize: 10, padding: '3px 8px', borderRadius: 6,
                        background: 'rgba(25,43,55,0.04)', fontWeight: 500
                      }}>{m.name}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
