import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiPlus,
  FiTrash2,
  FiCheck,
  FiArrowRight,
  FiArrowLeft,
  FiAlertCircle,
  FiX,
} from "react-icons/fi";
import { createProduct, createProductVersion } from "../../services/productApi";

const CATEGORIES = ["INDIVIDUAL", "FAMILY_FLOATER", "SENIOR_CITIZEN", "GROUP"];

const DEFAULT_MODULE = {
  code: "",
  name: "",
  mandatory: true,
  waitingPeriodMonths: 0,
};
const DEFAULT_AGE_LOADING = { minAge: 0, maxAge: 0, loadingPercent: 0 };

// ─── Toast ───────────────────────────────────────────────────
function Toast({ message, type, onClose }) {
  if (!message) return null;
  const bg = type === "success" ? "#2d9c5b" : "#d4403b";
  return (
    <div
      style={{
        position: "fixed",
        top: 24,
        right: 24,
        zIndex: 9999,
        padding: "14px 24px",
        borderRadius: 12,
        background: bg,
        color: "white",
        fontWeight: 600,
        fontSize: 14,
        boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
        display: "flex",
        alignItems: "center",
        gap: 10,
      }}
    >
      {type === "success" ? <FiCheck size={16} /> : <FiAlertCircle size={16} />}
      {message}
      <FiX
        size={14}
        style={{ cursor: "pointer", opacity: 0.8, marginLeft: 8 }}
        onClick={onClose}
      />
    </div>
  );
}

// ─── Step Indicator ──────────────────────────────────────────
function StepIndicator({ current, steps }) {
  return (
    <div className="d-flex align-items-center gap-2 mb-4">
      {steps.map((label, i) => (
        <div key={i} className="d-flex align-items-center gap-2">
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 13,
              fontWeight: 700,
              background: i <= current ? "#192b37" : "rgba(25,43,55,0.06)",
              color: i <= current ? "white" : "#192b37",
              transition: "all 0.3s",
            }}
          >
            {i < current ? <FiCheck size={14} /> : i + 1}
          </div>
          <span
            style={{
              fontSize: 13,
              fontWeight: i === current ? 700 : 500,
              opacity: i === current ? 1 : 0.5,
            }}
          >
            {label}
          </span>
          {i < steps.length - 1 && (
            <div
              style={{
                width: 40,
                height: 2,
                background: i < current ? "#192b37" : "rgba(25,43,55,0.08)",
                borderRadius: 1,
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Step 1: Product Basics ──────────────────────────────────
function Step1({ data, onChange }) {
  return (
    <div className="card border-0">
      <div className="card-header">
        <h5>Product Basics</h5>
      </div>
      <div className="card-body">
        <div className="row g-4">
          <div className="col-md-6">
            <label
              className="form-label"
              style={{ fontSize: 13, fontWeight: 600 }}
            >
              Product Name *
            </label>
            <input
              className="form-control"
              style={{ borderRadius: 10 }}
              placeholder="e.g., EndaSure Health Protect Plus"
              value={data.productName}
              onChange={(e) =>
                onChange({ ...data, productName: e.target.value })
              }
            />
          </div>
          <div className="col-md-6">
            <label
              className="form-label"
              style={{ fontSize: 13, fontWeight: 600 }}
            >
              Product Category *
            </label>
            <select
              className="form-select"
              style={{ borderRadius: 10 }}
              value={data.productCategory}
              onChange={(e) =>
                onChange({ ...data, productCategory: e.target.value })
              }
            >
              <option value="">Select category...</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c.replace(/_/g, " ")}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-6">
            <label
              className="form-label"
              style={{ fontSize: 13, fontWeight: 600 }}
            >
              Return of Premium (ROP)
            </label>
            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                role="switch"
                id="ropSwitch"
                checked={data.isRopEnabled}
                onChange={(e) =>
                  onChange({ ...data, isRopEnabled: e.target.checked })
                }
              />
              <label
                className="form-check-label"
                htmlFor="ropSwitch"
                style={{ fontSize: 13 }}
              >
                {data.isRopEnabled ? "Enabled" : "Disabled"}
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Step 2: Version Configuration ───────────────────────────
function Step2({ version, onChange, isRopEnabled }) {
  const updateField = (path, value) => {
    const next = JSON.parse(JSON.stringify(version));
    const keys = path.split(".");
    let obj = next;
    keys.slice(0, -1).forEach((k) => {
      obj = obj[k];
    });
    obj[keys[keys.length - 1]] = value;
    onChange(next);
  };

  // ── Coverage & Age Range ──
  const addSumInsured = () => {
    const val = prompt("Enter sum insured amount (e.g., 500000):");
    if (val && !isNaN(val)) {
      updateField("modulesJson.sumInsuredOptions", [
        ...version.modulesJson.sumInsuredOptions,
        Number(val),
      ]);
    }
  };
  const removeSumInsured = (idx) => {
    updateField(
      "modulesJson.sumInsuredOptions",
      version.modulesJson.sumInsuredOptions.filter((_, i) => i !== idx),
    );
  };

  // ── Modules ──
  const addModule = () => {
    updateField("modulesJson.modules", [
      ...version.modulesJson.modules,
      { ...DEFAULT_MODULE },
    ]);
  };
  const removeModule = (idx) => {
    updateField(
      "modulesJson.modules",
      version.modulesJson.modules.filter((_, i) => i !== idx),
    );
  };
  const updateModule = (idx, field, value) => {
    const mods = version.modulesJson.modules.map((m, i) =>
      i === idx ? { ...m, [field]: value } : m,
    );
    updateField("modulesJson.modules", mods);
  };

  // ── Base Premium ──
  const addPremiumEntry = () => {
    const si = prompt("Sum Insured (e.g., 500000):");
    if (si && !isNaN(si)) {
      updateField("rulesJson.basePremiumBySumInsured", {
        ...version.rulesJson.basePremiumBySumInsured,
        [si]: 0,
      });
    }
  };
  const removePremiumEntry = (key) => {
    const next = { ...version.rulesJson.basePremiumBySumInsured };
    delete next[key];
    updateField("rulesJson.basePremiumBySumInsured", next);
  };
  const updatePremiumEntry = (key, val) => {
    updateField("rulesJson.basePremiumBySumInsured", {
      ...version.rulesJson.basePremiumBySumInsured,
      [key]: Number(val),
    });
  };

  // ── Age Loading ──
  const addAgeLoading = () => {
    updateField("rulesJson.ageLoading", [
      ...version.rulesJson.ageLoading,
      { ...DEFAULT_AGE_LOADING },
    ]);
  };
  const removeAgeLoading = (idx) => {
    updateField(
      "rulesJson.ageLoading",
      version.rulesJson.ageLoading.filter((_, i) => i !== idx),
    );
  };
  const updateAgeLoading = (idx, field, value) => {
    const rows = version.rulesJson.ageLoading.map((r, i) =>
      i === idx ? { ...r, [field]: Number(value) } : r,
    );
    updateField("rulesJson.ageLoading", rows);
  };

  return (
    <div className="d-flex flex-column gap-4">
      {/* Coverage & Age Range */}
      <div className="card border-0">
        <div className="card-header">
          <h5>Coverage Configuration</h5>
        </div>
        <div className="card-body">
          <div className="row g-4">
            <div className="col-md-4">
              <label
                className="form-label"
                style={{ fontSize: 13, fontWeight: 600 }}
              >
                Coverage Type
              </label>
              <select
                className="form-select"
                style={{ borderRadius: 10 }}
                value={version.modulesJson.coverageType}
                onChange={(e) =>
                  updateField("modulesJson.coverageType", e.target.value)
                }
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-4">
              <label
                className="form-label"
                style={{ fontSize: 13, fontWeight: 600 }}
              >
                Min Entry Age
              </label>
              <input
                type="number"
                className="form-control"
                style={{ borderRadius: 10 }}
                value={version.modulesJson.eligibleAgeRange.minAge}
                onChange={(e) =>
                  updateField(
                    "modulesJson.eligibleAgeRange.minAge",
                    Number(e.target.value),
                  )
                }
              />
            </div>
            <div className="col-md-4">
              <label
                className="form-label"
                style={{ fontSize: 13, fontWeight: 600 }}
              >
                Max Entry Age
              </label>
              <input
                type="number"
                className="form-control"
                style={{ borderRadius: 10 }}
                value={version.modulesJson.eligibleAgeRange.maxAge}
                onChange={(e) =>
                  updateField(
                    "modulesJson.eligibleAgeRange.maxAge",
                    Number(e.target.value),
                  )
                }
              />
            </div>
            <div className="col-12">
              <label
                className="form-label"
                style={{ fontSize: 13, fontWeight: 600 }}
              >
                Sum Insured Options
              </label>
              <div className="d-flex gap-2 flex-wrap align-items-center">
                {version.modulesJson.sumInsuredOptions.map((v, i) => (
                  <span
                    key={i}
                    className="d-flex align-items-center gap-1"
                    style={{
                      padding: "4px 12px",
                      borderRadius: 8,
                      background: "rgba(88,153,196,0.08)",
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#5899c4",
                    }}
                  >
                    ₹{v.toLocaleString()}
                    <FiX
                      size={12}
                      style={{ cursor: "pointer", opacity: 0.6 }}
                      onClick={() => removeSumInsured(i)}
                    />
                  </span>
                ))}
                <button
                  className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1"
                  style={{ fontSize: 12, borderRadius: 8 }}
                  onClick={addSumInsured}
                >
                  <FiPlus size={12} /> Add
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modules */}
      <div className="card border-0">
        <div className="card-header">
          <h5>Modules</h5>
          <button
            className="btn btn-warning btn-sm d-flex align-items-center gap-1"
            style={{ fontSize: 12 }}
            onClick={addModule}
          >
            <FiPlus size={12} /> Add Module
          </button>
        </div>
        <div className="card-body p-0">
          {version.modulesJson.modules.length === 0 ? (
            <div className="text-center py-4 text-muted small">
              No modules added yet. Click "Add Module" to start.
            </div>
          ) : (
            <table className="table mb-0" style={{ fontSize: 13 }}>
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Module Name</th>
                  <th>Mandatory</th>
                  <th>Waiting (months)</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {version.modulesJson.modules.map((m, i) => (
                  <tr key={i}>
                    <td>
                      <input
                        className="form-control form-control-sm"
                        style={{ borderRadius: 8, fontSize: 13 }}
                        placeholder="e.g., HOSPITALIZATION"
                        value={m.code}
                        onChange={(e) =>
                          updateModule(i, "code", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        className="form-control form-control-sm"
                        style={{ borderRadius: 8, fontSize: 13 }}
                        placeholder="e.g., Hospitalization Cover"
                        value={m.name}
                        onChange={(e) =>
                          updateModule(i, "name", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={m.mandatory}
                          onChange={(e) =>
                            updateModule(i, "mandatory", e.target.checked)
                          }
                        />
                      </div>
                    </td>
                    <td>
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        style={{ borderRadius: 8, fontSize: 13, width: 80 }}
                        value={m.waitingPeriodMonths}
                        onChange={(e) =>
                          updateModule(
                            i,
                            "waitingPeriodMonths",
                            Number(e.target.value),
                          )
                        }
                      />
                    </td>
                    <td>
                      <button
                        className="btn btn-sm"
                        style={{ color: "#d4403b" }}
                        onClick={() => removeModule(i)}
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Pricing Rules */}
      <div className="card border-0">
        <div className="card-header">
          <h5>Pricing Rules</h5>
        </div>
        <div className="card-body">
          {/* Base Premium by Sum Insured */}
          <h6 style={{ fontWeight: 700, fontSize: 14, marginBottom: 12 }}>
            Base Premium by Sum Insured
          </h6>
          <div className="table-responsive mb-4">
            <table className="table table-sm" style={{ fontSize: 13 }}>
              <thead>
                <tr>
                  <th>Sum Insured (₹)</th>
                  <th>Annual Premium (₹)</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(version.rulesJson.basePremiumBySumInsured).map(
                  ([si, premium]) => (
                    <tr key={si}>
                      <td style={{ fontWeight: 600 }}>
                        ₹{Number(si).toLocaleString()}
                      </td>
                      <td>
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          style={{ borderRadius: 8, fontSize: 13, width: 140 }}
                          value={premium}
                          onChange={(e) =>
                            updatePremiumEntry(si, e.target.value)
                          }
                        />
                      </td>
                      <td>
                        <button
                          className="btn btn-sm"
                          style={{ color: "#d4403b" }}
                          onClick={() => removePremiumEntry(si)}
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
            <button
              className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1"
              style={{ fontSize: 12, borderRadius: 8 }}
              onClick={addPremiumEntry}
            >
              <FiPlus size={12} /> Add Premium Entry
            </button>
          </div>

          {/* Age Loading */}
          <h6 style={{ fontWeight: 700, fontSize: 14, marginBottom: 12 }}>
            Age Loading
          </h6>
          <div className="table-responsive mb-4">
            <table className="table table-sm" style={{ fontSize: 13 }}>
              <thead>
                <tr>
                  <th>Min Age</th>
                  <th>Max Age</th>
                  <th>Loading %</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {version.rulesJson.ageLoading.map((r, i) => (
                  <tr key={i}>
                    <td>
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        style={{ borderRadius: 8, width: 80, fontSize: 13 }}
                        value={r.minAge}
                        onChange={(e) =>
                          updateAgeLoading(i, "minAge", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        style={{ borderRadius: 8, width: 80, fontSize: 13 }}
                        value={r.maxAge}
                        onChange={(e) =>
                          updateAgeLoading(i, "maxAge", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        style={{ borderRadius: 8, width: 80, fontSize: 13 }}
                        value={r.loadingPercent}
                        onChange={(e) =>
                          updateAgeLoading(i, "loadingPercent", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <button
                        className="btn btn-sm"
                        style={{ color: "#d4403b" }}
                        onClick={() => removeAgeLoading(i)}
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1"
              style={{ fontSize: 12, borderRadius: 8 }}
              onClick={addAgeLoading}
            >
              <FiPlus size={12} /> Add Age Loading Rule
            </button>
          </div>

          {/* PED & Copay */}
          <div className="row g-4">
            <div className="col-md-4">
              <label
                className="form-label"
                style={{ fontSize: 13, fontWeight: 600 }}
              >
                PED Loading %
              </label>
              <input
                type="number"
                className="form-control"
                style={{ borderRadius: 10 }}
                value={version.rulesJson.pedLoadingPercent}
                onChange={(e) =>
                  updateField(
                    "rulesJson.pedLoadingPercent",
                    Number(e.target.value),
                  )
                }
              />
            </div>
            <div className="col-md-4">
              <label
                className="form-label"
                style={{ fontSize: 13, fontWeight: 600 }}
              >
                Co-Payment %
              </label>
              <input
                type="number"
                className="form-control"
                style={{ borderRadius: 10 }}
                value={version.rulesJson.coPaymentPercent}
                onChange={(e) =>
                  updateField(
                    "rulesJson.coPaymentPercent",
                    Number(e.target.value),
                  )
                }
              />
            </div>
            <div className="col-md-4">
              <label
                className="form-label"
                style={{ fontSize: 13, fontWeight: 600 }}
              >
                Min / Max Entry Age
              </label>
              <div className="d-flex gap-2">
                <input
                  type="number"
                  className="form-control"
                  style={{ borderRadius: 10 }}
                  placeholder="Min"
                  value={version.rulesJson.minEntryAge}
                  onChange={(e) =>
                    updateField("rulesJson.minEntryAge", Number(e.target.value))
                  }
                />
                <input
                  type="number"
                  className="form-control"
                  style={{ borderRadius: 10 }}
                  placeholder="Max"
                  value={version.rulesJson.maxEntryAge}
                  onChange={(e) =>
                    updateField("rulesJson.maxEntryAge", Number(e.target.value))
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ROP & Dates */}
      <div className="card border-0">
        <div className="card-header">
          <h5>ROP & Effective Dates</h5>
        </div>
        <div className="card-body">
          <div className="row g-4">
            {isRopEnabled && (
              <>
                <div className="col-md-12 mb-2">
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="ropVersionEnabled"
                      checked={version.rulesJson.rop.enabled}
                      onChange={(e) =>
                        updateField("rulesJson.rop.enabled", e.target.checked)
                      }
                    />
                    <label
                      className="form-check-label"
                      htmlFor="ropVersionEnabled"
                      style={{ fontSize: 13, fontWeight: 600 }}
                    >
                      Enable ROP for this version
                    </label>
                  </div>
                </div>
                {version.rulesJson.rop.enabled && (
                  <>
                    <div className="col-md-4">
                      <label
                        className="form-label"
                        style={{ fontSize: 13, fontWeight: 600 }}
                      >
                        Return %
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        style={{ borderRadius: 10 }}
                        value={version.rulesJson.rop.returnPercent || ""}
                        onChange={(e) =>
                          updateField(
                            "rulesJson.rop.returnPercent",
                            Number(e.target.value),
                          )
                        }
                      />
                    </div>
                    <div className="col-md-4">
                      <label
                        className="form-label"
                        style={{ fontSize: 13, fontWeight: 600 }}
                      >
                        Eligible After (Years)
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        style={{ borderRadius: 10 }}
                        value={version.rulesJson.rop.eligibleAfterYears || ""}
                        onChange={(e) =>
                          updateField(
                            "rulesJson.rop.eligibleAfterYears",
                            Number(e.target.value),
                          )
                        }
                      />
                    </div>
                    <div className="col-md-4">
                      <label
                        className="form-label"
                        style={{ fontSize: 13, fontWeight: 600 }}
                      >
                        No Claim Required
                      </label>
                      <div className="form-check form-switch mt-1">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={
                            version.rulesJson.rop.noClaimRequired || false
                          }
                          onChange={(e) =>
                            updateField(
                              "rulesJson.rop.noClaimRequired",
                              e.target.checked,
                            )
                          }
                        />
                      </div>
                    </div>
                  </>
                )}
              </>
            )}
            {!isRopEnabled && (
              <div className="col-12">
                <p className="text-muted small mb-0">
                  ROP is disabled for this product. Enable it in Step 1 to
                  configure.
                </p>
              </div>
            )}
            <div className="col-md-6">
              <label
                className="form-label"
                style={{ fontSize: 13, fontWeight: 600 }}
              >
                Effective From *
              </label>
              <input
                type="datetime-local"
                className="form-control"
                style={{ borderRadius: 10 }}
                value={version.effectiveFrom}
                onChange={(e) =>
                  onChange({ ...version, effectiveFrom: e.target.value })
                }
              />
            </div>
            <div className="col-md-6">
              <label
                className="form-label"
                style={{ fontSize: 13, fontWeight: 600 }}
              >
                Effective To *
              </label>
              <input
                type="datetime-local"
                className="form-control"
                style={{ borderRadius: 10 }}
                value={version.effectiveTo}
                onChange={(e) =>
                  onChange({ ...version, effectiveTo: e.target.value })
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Step 3: Review & Submit ─────────────────────────────────
function Step3({ product, version, isRopEnabled }) {
  return (
    <div className="d-flex flex-column gap-4">
      {/* Product Summary */}
      <div className="card border-0">
        <div className="card-header">
          <h5>Product Summary</h5>
        </div>
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-4">
              <div style={{ fontSize: 12, opacity: 0.5 }}>Product Name</div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>
                {product.productName || "—"}
              </div>
            </div>
            <div className="col-md-4">
              <div style={{ fontSize: 12, opacity: 0.5 }}>Category</div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>
                {(product.productCategory || "—").replace(/_/g, " ")}
              </div>
            </div>
            <div className="col-md-4">
              <div style={{ fontSize: 12, opacity: 0.5 }}>ROP</div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>
                {product.isRopEnabled ? "Enabled" : "Disabled"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Version Summary */}
      <div className="card border-0">
        <div className="card-header">
          <h5>Version Configuration</h5>
        </div>
        <div className="card-body">
          <div className="row g-3 mb-3">
            <div className="col-md-3">
              <div style={{ fontSize: 12, opacity: 0.5 }}>Coverage Type</div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>
                {(version.modulesJson.coverageType || "—").replace(/_/g, " ")}
              </div>
            </div>
            <div className="col-md-3">
              <div style={{ fontSize: 12, opacity: 0.5 }}>Age Range</div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>
                {version.modulesJson.eligibleAgeRange.minAge}–
                {version.modulesJson.eligibleAgeRange.maxAge}
              </div>
            </div>
            <div className="col-md-3">
              <div style={{ fontSize: 12, opacity: 0.5 }}>
                Sum Insured Options
              </div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>
                {version.modulesJson.sumInsuredOptions.length} options
              </div>
            </div>
            <div className="col-md-3">
              <div style={{ fontSize: 12, opacity: 0.5 }}>Modules</div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>
                {version.modulesJson.modules.length} modules
              </div>
            </div>
          </div>

          {/* Modules table */}
          {version.modulesJson.modules.length > 0 && (
            <div className="table-responsive mb-3">
              <table className="table table-sm" style={{ fontSize: 13 }}>
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Name</th>
                    <th>Mandatory</th>
                    <th>Waiting</th>
                  </tr>
                </thead>
                <tbody>
                  {version.modulesJson.modules.map((m, i) => (
                    <tr key={i}>
                      <td>
                        <code style={{ fontSize: 12 }}>{m.code}</code>
                      </td>
                      <td style={{ fontWeight: 600 }}>{m.name}</td>
                      <td>{m.mandatory ? "✓" : "—"}</td>
                      <td>{m.waitingPeriodMonths} months</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pricing summary */}
          <div className="row g-3">
            <div className="col-md-3">
              <div style={{ fontSize: 12, opacity: 0.5 }}>Premium Tiers</div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>
                {Object.keys(version.rulesJson.basePremiumBySumInsured).length}
              </div>
            </div>
            <div className="col-md-3">
              <div style={{ fontSize: 12, opacity: 0.5 }}>
                Age Loading Rules
              </div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>
                {version.rulesJson.ageLoading.length}
              </div>
            </div>
            <div className="col-md-3">
              <div style={{ fontSize: 12, opacity: 0.5 }}>PED Loading</div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>
                {version.rulesJson.pedLoadingPercent}%
              </div>
            </div>
            <div className="col-md-3">
              <div style={{ fontSize: 12, opacity: 0.5 }}>Co-Payment</div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>
                {version.rulesJson.coPaymentPercent}%
              </div>
            </div>
          </div>

          {/* ROP */}
          {isRopEnabled && version.rulesJson.rop.enabled && (
            <div className="row g-3 mt-2">
              <div className="col-md-4">
                <div style={{ fontSize: 12, opacity: 0.5 }}>ROP Return</div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>
                  {version.rulesJson.rop.returnPercent}%
                </div>
              </div>
              <div className="col-md-4">
                <div style={{ fontSize: 12, opacity: 0.5 }}>Eligible After</div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>
                  {version.rulesJson.rop.eligibleAfterYears} years
                </div>
              </div>
            </div>
          )}

          {/* Dates */}
          <div className="row g-3 mt-2">
            <div className="col-md-6">
              <div style={{ fontSize: 12, opacity: 0.5 }}>Effective From</div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>
                {version.effectiveFrom
                  ? new Date(version.effectiveFrom).toLocaleDateString()
                  : "—"}
              </div>
            </div>
            <div className="col-md-6">
              <div style={{ fontSize: 12, opacity: 0.5 }}>Effective To</div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>
                {version.effectiveTo
                  ? new Date(version.effectiveTo).toLocaleDateString()
                  : "—"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main: Create Product Wizard ─────────────────────────────
export default function CreateProduct() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "" });

  const [product, setProduct] = useState({
    productName: "",
    productCategory: "",
    isRopEnabled: false,
  });

  const [version, setVersion] = useState({
    modulesJson: {
      coverageType: "INDIVIDUAL",
      eligibleAgeRange: { minAge: 18, maxAge: 65 },
      sumInsuredOptions: [],
      modules: [],
    },
    rulesJson: {
      basePremiumBySumInsured: {},
      ageLoading: [],
      pedLoadingPercent: 0,
      coPaymentPercent: 0,
      maxEntryAge: 65,
      minEntryAge: 18,
      rop: { enabled: false },
    },
    effectiveFrom: "",
    effectiveTo: "",
  });

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "" }), 4000);
  };

  const validateStep1 = () => {
    if (!product.productName.trim()) {
      showToast("Product name is required", "error");
      return false;
    }
    if (!product.productCategory) {
      showToast("Product category is required", "error");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (version.modulesJson.modules.length === 0) {
      showToast("Add at least one module", "error");
      return false;
    }
    if (version.modulesJson.sumInsuredOptions.length === 0) {
      showToast("Add at least one sum insured option", "error");
      return false;
    }
    if (!version.effectiveFrom || !version.effectiveTo) {
      showToast("Effective dates are required", "error");
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (step === 0 && !validateStep1()) return;
    if (step === 1 && !validateStep2()) return;
    setStep(step + 1);
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      const created = await createProduct(product);
      await createProductVersion(created.productId, {
        modulesJson: version.modulesJson,
        rulesJson: version.rulesJson,
        effectiveFrom: new Date(version.effectiveFrom).toISOString(),
        effectiveTo: new Date(version.effectiveTo).toISOString(),
      });
      showToast("Product created successfully! Version submitted as DRAFT.");
      setTimeout(() => navigate("/admin-portal/products"), 1500);
    } catch (err) {
      showToast(err.message || "Failed to create product", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const steps = ["Product Basics", "Version Configuration", "Review & Submit"];

  return (
    <>
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: "", type: "" })}
      />

      {/* Header */}
      <div className="d-flex align-items-center gap-3 mb-4">
        <button
          className="btn btn-outline-secondary"
          style={{ fontSize: 13, padding: "8px 16px" }}
          onClick={() => navigate("/admin-portal/products")}
        >
          ← Back
        </button>
        <div>
          <h1 className="mb-0" style={{ fontSize: 24, fontWeight: 800 }}>
            Create Product
          </h1>
          <p className="mb-0" style={{ fontSize: 13, opacity: 0.5 }}>
            Set up a new insurance product with its initial version
          </p>
        </div>
      </div>

      <StepIndicator current={step} steps={steps} />

      {/* Step Content */}
      {step === 0 && <Step1 data={product} onChange={setProduct} />}
      {step === 1 && (
        <Step2
          version={version}
          onChange={setVersion}
          isRopEnabled={product.isRopEnabled}
        />
      )}
      {step === 2 && (
        <Step3
          product={product}
          version={version}
          isRopEnabled={product.isRopEnabled}
        />
      )}

      {/* Navigation */}
      <div className="d-flex justify-content-between mt-4">
        <button
          className="btn btn-outline-secondary d-flex align-items-center gap-2"
          style={{
            fontSize: 13,
            padding: "10px 20px",
            borderRadius: 10,
            visibility: step === 0 ? "hidden" : "visible",
          }}
          onClick={() => setStep(step - 1)}
        >
          <FiArrowLeft size={14} /> Previous
        </button>

        {step < 2 ? (
          <button
            className="btn d-flex align-items-center gap-2"
            style={{
              background: "#192b37",
              color: "white",
              fontSize: 13,
              fontWeight: 600,
              padding: "10px 24px",
              borderRadius: 10,
              border: "none",
            }}
            onClick={handleNext}
          >
            Next <FiArrowRight size={14} />
          </button>
        ) : (
          <button
            className="btn d-flex align-items-center gap-2"
            style={{
              background: "#2d9c5b",
              color: "white",
              fontSize: 13,
              fontWeight: 600,
              padding: "10px 24px",
              borderRadius: 10,
              border: "none",
            }}
            disabled={submitting}
            onClick={handleSubmit}
          >
            <FiCheck size={14} />{" "}
            {submitting ? "Creating..." : "Create Product"}
          </button>
        )}
      </div>
    </>
  );
}
