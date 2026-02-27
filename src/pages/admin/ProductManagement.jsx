import { PRODUCTS } from "../../data/mockData";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiPlus, FiEdit2, FiEye, FiLayers, FiPackage } from "react-icons/fi";

export default function ProductManagement() {
  const [products] = useState(PRODUCTS);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const navigate = useNavigate();

  if (selectedProduct) {
    const p = products.find((prod) => prod.id === selectedProduct);
    return (
      <>
        <div className="d-flex align-items-center gap-3 mb-4">
          <button
            className="btn btn-outline-secondary"
            style={{ fontSize: 13, padding: "8px 16px" }}
            onClick={() => setSelectedProduct(null)}
          >
            ← Back
          </button>
          <div>
            <h1 className="mb-0" style={{ fontSize: 24, fontWeight: 800 }}>
              {p.name}
            </h1>
            <p className="mb-0" style={{ fontSize: 13, opacity: 0.5 }}>
              {p.category} — v{p.version}
            </p>
          </div>
          <span className={`status-badge ${p.status.toLowerCase()} ms-2`}>
            {p.status}
          </span>
        </div>

        <div className="row g-4">
          <div className="col-lg-8">
            <div className="card mb-4">
              <div className="card-header">
                <h5>Product Details</h5>
                <button
                  className="btn btn-outline-secondary"
                  style={{ fontSize: 12, padding: "6px 14px" }}
                >
                  <FiEdit2 size={12} /> Edit
                </button>
              </div>
              <div className="card-body">
                <p style={{ fontSize: 14, lineHeight: 1.7, opacity: 0.7 }}>
                  {p.description}
                </p>
                <div className="row g-3 mt-2">
                  {[
                    { label: "Base Price", value: `$${p.basePrice}/mo` },
                    { label: "Version", value: p.version },
                    { label: "Status", value: p.status },
                    { label: "Modules", value: p.modules.length },
                  ].map((item) => (
                    <div className="col-md-3" key={item.label}>
                      <div style={{ fontSize: 12, opacity: 0.5 }}>
                        {item.label}
                      </div>
                      <div style={{ fontSize: 16, fontWeight: 700 }}>
                        {item.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h5>Modules</h5>
                <button
                  className="btn btn-warning"
                  style={{ fontSize: 12, padding: "6px 14px" }}
                >
                  <FiPlus size={12} /> Add Module
                </button>
              </div>
              <div className="card-body">
                {p.modules.map((mod) => (
                  <div
                    key={mod.id}
                    className="d-flex align-items-center gap-3 p-3 mb-2"
                    style={{
                      background: "rgba(25,43,55,0.02)",
                      borderRadius: 12,
                    }}
                  >
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 12,
                        background: "rgba(88,153,196,0.1)",
                        color: "#5899c4",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <FiPackage size={18} />
                    </div>
                    <div className="flex-fill">
                      <div style={{ fontWeight: 600, fontSize: 14 }}>
                        {mod.name}
                      </div>
                      <div style={{ fontSize: 12, opacity: 0.5 }}>
                        {mod.description}
                      </div>
                    </div>
                    <div className="d-flex gap-1">
                      {mod.intensities.map((int, i) => (
                        <span
                          key={int}
                          style={{
                            fontSize: 10,
                            padding: "3px 8px",
                            borderRadius: 6,
                            background: "rgba(25,43,55,0.04)",
                            fontWeight: 500,
                          }}
                        >
                          {int}: ${mod.prices[i]}
                        </span>
                      ))}
                    </div>
                    <button
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: 6,
                      }}
                    >
                      <FiEdit2 size={14} style={{ opacity: 0.4 }} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card">
              <div className="card-header">
                <h5>Version History</h5>
              </div>
              <div className="card-body">
                {[
                  {
                    version: p.version,
                    date: "2026-02-01",
                    change: "Current version",
                  },
                  {
                    version: (parseFloat(p.version) - 0.1).toFixed(1),
                    date: "2025-12-15",
                    change: "Added new module",
                  },
                  {
                    version: "1.0",
                    date: "2025-06-01",
                    change: "Initial release",
                  },
                ].map((v, i) => (
                  <div key={i} className="d-flex gap-3 mb-3">
                    <div
                      style={{
                        width: 2,
                        background: i === 0 ? "#ff5640" : "rgba(25,43,55,0.08)",
                        borderRadius: 1,
                        flexShrink: 0,
                      }}
                    />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>
                        v{v.version}
                      </div>
                      <div style={{ fontSize: 11, opacity: 0.5 }}>
                        {v.date} — {v.change}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="mb-4 d-flex align-items-start justify-content-between">
        <div>
          <h1>Product Management</h1>
          <p>Maintain versioned insurance products and their modules</p>
        </div>
        <button
          className="btn btn-warning d-flex align-items-center gap-2"
          style={{ fontSize: 13 }}
          onClick={() => navigate("/admin-portal/products/create")}
        >
          <FiPlus size={14} /> Create Product
        </button>
      </div>

      <div className="card">
        <div className="card-body p-0">
          <table className="table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Base Price</th>
                <th>Modules</th>
                <th>Version</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div className="d-flex align-items-center gap-3">
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 10,
                          background: "rgba(88,153,196,0.1)",
                          color: "#5899c4",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <FiLayers size={16} />
                      </div>
                      <span style={{ fontWeight: 600 }}>{p.name}</span>
                    </div>
                  </td>
                  <td style={{ fontSize: 13 }}>{p.category}</td>
                  <td style={{ fontWeight: 600 }}>${p.basePrice}/mo</td>
                  <td>{p.modules.length}</td>
                  <td style={{ fontSize: 12 }}>v{p.version}</td>
                  <td>
                    <span className={`status-badge ${p.status.toLowerCase()}`}>
                      {p.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-outline-secondary d-flex align-items-center gap-1"
                      style={{ fontSize: 11, padding: "5px 12px" }}
                      onClick={() => setSelectedProduct(p.id)}
                    >
                      <FiEye size={12} /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
