import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PRODUCTS } from "../../data/mockData";
import {
  FiCheck,
  FiArrowRight,
  FiArrowLeft,
  FiShoppingCart,
  FiLock,
  FiClock,
  FiAlertCircle,
} from "react-icons/fi";

export default function SelectModules() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const product = PRODUCTS.find((p) => p.id === productId) || PRODUCTS[0];

  const v = product.latestVersion;
  const modules = v?.modulesJson || {};
  const rules = v?.rulesJson || {};
  const sumInsuredOptions = modules.sumInsuredOptions || [];
  const moduleList = modules.modules || [];

  // State
  const [selectedSI, setSelectedSI] = useState(sumInsuredOptions[0] || 0);
  const [selectedModules, setSelectedModules] = useState(() => {
    // Pre-select mandatory modules
    const init = {};
    moduleList.forEach((m) => {
      if (m.mandatory) init[m.code] = true;
    });
    return init;
  });

  const toggleModule = (code, mandatory) => {
    if (mandatory) return; // Can't deselect mandatory
    setSelectedModules((prev) => {
      const copy = { ...prev };
      if (copy[code]) delete copy[code];
      else copy[code] = true;
      return copy;
    });
  };

  const basePremium = rules.basePremiumBySumInsured?.[String(selectedSI)] || 0;
  const selectedCount = Object.keys(selectedModules).length;
  const selectedModuleNames = moduleList.filter((m) => selectedModules[m.code]);

  return (
    <>
      {/* Header */}
      <div className="d-flex align-items-center gap-3 mb-4">
        <button
          className="btn btn-outline-secondary d-flex align-items-center gap-1"
          style={{ fontSize: 13, padding: "8px 16px" }}
          onClick={() => navigate("/products")}
        >
          <FiArrowLeft size={14} /> Back
        </button>
        <div>
          <h1 className="mb-0" style={{ fontSize: 24, fontWeight: 800 }}>
            {product.productName}
          </h1>
          <p className="mb-0" style={{ fontSize: 13, opacity: 0.5 }}>
            {(modules.coverageType || "").replace(/_/g, " ")} • Ages{" "}
            {modules.eligibleAgeRange?.minAge}–
            {modules.eligibleAgeRange?.maxAge}
          </p>
        </div>
      </div>

      <div className="row g-4">
        {/* Left Panel */}
        <div className="col-lg-8">
          {/* Sum Insured Selection */}
          <div className="card border-0 mb-4">
            <div className="card-header">
              <h5>Choose Sum Insured</h5>
            </div>
            <div className="card-body">
              <div className="d-flex gap-3 flex-wrap">
                {sumInsuredOptions.map((si) => {
                  const isSelected = selectedSI === si;
                  const premium =
                    rules.basePremiumBySumInsured?.[String(si)] || 0;
                  return (
                    <button
                      key={si}
                      onClick={() => setSelectedSI(si)}
                      style={{
                        padding: "16px 24px",
                        borderRadius: 14,
                        border: isSelected
                          ? "2px solid #192b37"
                          : "2px solid rgba(25,43,55,0.08)",
                        background: isSelected
                          ? "rgba(25,43,55,0.04)"
                          : "white",
                        cursor: "pointer",
                        textAlign: "center",
                        minWidth: 140,
                        transition: "all 0.2s",
                      }}
                    >
                      <div
                        style={{
                          fontSize: 20,
                          fontWeight: 800,
                          color: "#192b37",
                        }}
                      >
                        ₹{(si / 100000).toFixed(0)}L
                      </div>
                      <div style={{ fontSize: 12, opacity: 0.5 }}>
                        ₹{premium.toLocaleString()}/yr
                      </div>
                      {isSelected && (
                        <div className="mt-1">
                          <FiCheck size={14} style={{ color: "#2d9c5b" }} />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Modules */}
          <div className="card border-0 mb-4">
            <div className="card-header">
              <h5>Modules</h5>
            </div>
            <div className="card-body p-0">
              {moduleList.map((mod) => {
                const isSelected = !!selectedModules[mod.code];
                return (
                  <div
                    key={mod.code}
                    className="d-flex align-items-center gap-3 p-3"
                    style={{
                      borderBottom: "1px solid rgba(25,43,55,0.04)",
                      cursor: mod.mandatory ? "default" : "pointer",
                      background: isSelected
                        ? "rgba(25,43,55,0.015)"
                        : "transparent",
                      transition: "background 0.2s",
                    }}
                    onClick={() => toggleModule(mod.code, mod.mandatory)}
                  >
                    {/* Checkbox */}
                    <div
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: 8,
                        flexShrink: 0,
                        border: isSelected
                          ? "none"
                          : "2px solid rgba(25,43,55,0.15)",
                        background: isSelected ? "#192b37" : "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {isSelected && (
                        <FiCheck size={14} style={{ color: "white" }} />
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-fill">
                      <div className="d-flex align-items-center gap-2">
                        <span style={{ fontWeight: 600, fontSize: 14 }}>
                          {mod.name}
                        </span>
                        {mod.mandatory && (
                          <span
                            className="d-flex align-items-center gap-1"
                            style={{
                              fontSize: 10,
                              padding: "2px 8px",
                              borderRadius: 4,
                              background: "rgba(25,43,55,0.04)",
                              fontWeight: 600,
                              opacity: 0.5,
                            }}
                          >
                            <FiLock size={9} /> Required
                          </span>
                        )}
                      </div>
                      <code style={{ fontSize: 11, opacity: 0.4 }}>
                        {mod.code}
                      </code>
                    </div>

                    {/* Waiting Period */}
                    {mod.waitingPeriodMonths > 0 && (
                      <span
                        className="d-flex align-items-center gap-1"
                        style={{
                          fontSize: 11,
                          opacity: 0.5,
                          whiteSpace: "nowrap",
                        }}
                      >
                        <FiClock size={11} /> {mod.waitingPeriodMonths}mo
                        waiting
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Rules Info */}
          <div className="card border-0">
            <div className="card-header">
              <h5>Plan Details</h5>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-3">
                  <div style={{ fontSize: 12, opacity: 0.5 }}>Co-Payment</div>
                  <div style={{ fontSize: 16, fontWeight: 700 }}>
                    {rules.coPaymentPercent || 0}%
                  </div>
                </div>
                <div className="col-md-3">
                  <div style={{ fontSize: 12, opacity: 0.5 }}>PED Loading</div>
                  <div style={{ fontSize: 16, fontWeight: 700 }}>
                    {rules.pedLoadingPercent || 0}%
                  </div>
                </div>
                <div className="col-md-3">
                  <div style={{ fontSize: 12, opacity: 0.5 }}>Entry Age</div>
                  <div style={{ fontSize: 16, fontWeight: 700 }}>
                    {rules.minEntryAge}–{rules.maxEntryAge}
                  </div>
                </div>
                <div className="col-md-3">
                  <div style={{ fontSize: 12, opacity: 0.5 }}>ROP</div>
                  <div style={{ fontSize: 16, fontWeight: 700 }}>
                    {rules.rop?.enabled ? "Available" : "Not Available"}
                  </div>
                </div>
              </div>

              {/* Age Loading */}
              {rules.ageLoading && rules.ageLoading.length > 0 && (
                <div className="mt-3">
                  <div style={{ fontSize: 12, opacity: 0.5, marginBottom: 8 }}>
                    Age Loading
                  </div>
                  <div className="d-flex gap-2 flex-wrap">
                    {rules.ageLoading.map((al, i) => (
                      <span
                        key={i}
                        style={{
                          fontSize: 11,
                          padding: "4px 10px",
                          borderRadius: 6,
                          background: "rgba(25,43,55,0.04)",
                          fontWeight: 500,
                        }}
                      >
                        {al.minAge}–{al.maxAge}yrs: +{al.loadingPercent}%
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Panel — Summary */}
        <div className="col-lg-4">
          <div
            className="card border-0"
            style={{ position: "sticky", top: 92 }}
          >
            <div className="card-header">
              <h5>
                <FiShoppingCart size={16} /> Plan Summary
              </h5>
            </div>
            <div className="card-body">
              {/* Sum Insured */}
              <div
                className="d-flex justify-content-between mb-2"
                style={{ fontSize: 13 }}
              >
                <span>Sum Insured</span>
                <span style={{ fontWeight: 700, color: "#192b37" }}>
                  ₹{selectedSI.toLocaleString()}
                </span>
              </div>

              {/* Base Premium */}
              <div
                className="d-flex justify-content-between mb-2"
                style={{ fontSize: 13 }}
              >
                <span>Base Premium</span>
                <span style={{ fontWeight: 600 }}>
                  ₹{basePremium.toLocaleString()}/yr
                </span>
              </div>

              <hr />

              {/* Selected Modules */}
              <div style={{ fontSize: 12, opacity: 0.5, marginBottom: 6 }}>
                Selected Modules ({selectedCount})
              </div>
              {selectedModuleNames.map((m) => (
                <div
                  key={m.code}
                  className="d-flex align-items-center gap-2 mb-2"
                  style={{ fontSize: 13 }}
                >
                  <FiCheck size={12} style={{ color: "#2d9c5b" }} />
                  <span>{m.name}</span>
                  {m.mandatory && (
                    <span style={{ fontSize: 9, opacity: 0.4 }}>
                      (Required)
                    </span>
                  )}
                </div>
              ))}

              <hr />

              {/* Co-Payment Note */}
              {rules.coPaymentPercent > 0 && (
                <div
                  className="d-flex align-items-start gap-2 mb-3"
                  style={{
                    fontSize: 12,
                    background: "rgba(255,193,7,0.06)",
                    padding: "8px 12px",
                    borderRadius: 8,
                  }}
                >
                  <FiAlertCircle
                    size={14}
                    style={{ color: "#b8860b", flexShrink: 0, marginTop: 1 }}
                  />
                  <span>
                    This plan has a <strong>{rules.coPaymentPercent}%</strong>{" "}
                    co-payment clause
                  </span>
                </div>
              )}

              {/* Total */}
              <div
                className="d-flex justify-content-between"
                style={{ fontSize: 18, fontWeight: 800 }}
              >
                <span>Total</span>
                <span>₹{basePremium.toLocaleString()}/yr</span>
              </div>

              <button
                className="btn btn-warning w-100 mt-3 d-flex align-items-center justify-content-center gap-2"
                disabled={selectedCount === 0}
                onClick={() => navigate("/apply")}
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
