import { useState, useEffect, useCallback } from "react";
import {
  FiChevronDown,
  FiChevronUp,
  FiCheck,
  FiRotateCcw,
  FiSearch,
  FiX,
  FiAlertCircle,
  FiBell,
} from "react-icons/fi";
import {
  fetchReviewTasks,
  approveReview,
  requestRevision,
} from "../../services/underwriterReviewApi";
import useReviewNotifications from "../../hooks/useReviewNotifications";

// ─── Status Badge ────────────────────────────────────────────
const STATUS_STYLES = {
  OPEN: { background: "rgba(255,193,7,0.12)", color: "#b8860b", label: "Open" },
  APPROVED: {
    background: "rgba(45,156,91,0.12)",
    color: "#2d9c5b",
    label: "Approved",
  },
  REVISION_REQUESTED: {
    background: "rgba(212,64,59,0.12)",
    color: "#d4403b",
    label: "Revision Requested",
  },
};

function StatusBadge({ status }) {
  const s = STATUS_STYLES[status] || STATUS_STYLES.OPEN;
  return (
    <span
      style={{
        display: "inline-block",
        padding: "4px 12px",
        borderRadius: 8,
        fontSize: 12,
        fontWeight: 700,
        background: s.background,
        color: s.color,
      }}
    >
      {s.label}
    </span>
  );
}

// ─── Toast ───────────────────────────────────────────────────
function Toast({ message, type, onClose }) {
  if (!message) return null;
  const bg =
    type === "success" ? "#2d9c5b" : type === "error" ? "#d4403b" : "#5899c4";
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
        animation: "fadeIn 0.3s ease",
      }}
    >
      {type === "success" ? (
        <FiCheck size={16} />
      ) : type === "info" ? (
        <FiBell size={16} />
      ) : (
        <FiAlertCircle size={16} />
      )}
      {message}
      <FiX
        size={14}
        style={{ cursor: "pointer", opacity: 0.8, marginLeft: 8 }}
        onClick={onClose}
      />
    </div>
  );
}

// ─── Modules Section (structured rendering) ──────────────────
function ModulesSection({ modulesJson }) {
  if (!modulesJson)
    return <p className="text-muted small">No module data available.</p>;
  return (
    <div>
      <div className="row g-3 mb-3">
        <div className="col-md-6">
          <div style={{ fontSize: 12, opacity: 0.5 }}>Coverage Type</div>
          <div style={{ fontSize: 14, fontWeight: 600 }}>
            {modulesJson.coverageType || "—"}
          </div>
        </div>
        <div className="col-md-6">
          <div style={{ fontSize: 12, opacity: 0.5 }}>Sum Insured Options</div>
          <div className="d-flex gap-2 flex-wrap mt-1">
            {(modulesJson.sumInsuredOptions || []).map((v) => (
              <span
                key={v}
                style={{
                  padding: "3px 10px",
                  borderRadius: 6,
                  background: "rgba(88,153,196,0.08)",
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#5899c4",
                }}
              >
                ₹{v.toLocaleString()}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="table-responsive">
        <table className="table table-sm" style={{ fontSize: 13 }}>
          <thead>
            <tr>
              <th>Module</th>
              <th>Description</th>
              <th>Sum Insured</th>
              <th>Waiting Period</th>
              <th>Copay</th>
            </tr>
          </thead>
          <tbody>
            {(modulesJson.modules || []).map((m, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 600 }}>{m.name}</td>
                <td style={{ opacity: 0.7 }}>{m.description}</td>
                <td>₹{(m.sumInsured || 0).toLocaleString()}</td>
                <td>{m.waitingPeriod || "—"}</td>
                <td>{m.copay || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Rules Section (structured rendering) ────────────────────
function RulesSection({ rulesJson }) {
  if (!rulesJson)
    return <p className="text-muted small">No rules data available.</p>;
  return (
    <div>
      {/* Base Premium Table */}
      {rulesJson.basePremiumTable && (
        <div className="mb-4">
          <h6 style={{ fontWeight: 700, fontSize: 14, marginBottom: 10 }}>
            Base Premium Table
          </h6>
          <div className="table-responsive">
            <table className="table table-sm" style={{ fontSize: 13 }}>
              <thead>
                <tr>
                  <th>Age Group</th>
                  <th>Sum Insured</th>
                  <th>Annual Premium</th>
                </tr>
              </thead>
              <tbody>
                {rulesJson.basePremiumTable.map((r, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 600 }}>{r.ageGroup}</td>
                    <td>₹{(r.sumInsured || 0).toLocaleString()}</td>
                    <td>₹{(r.premium || 0).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Age Loading Table */}
      {rulesJson.ageLoadingTable && (
        <div className="mb-4">
          <h6 style={{ fontWeight: 700, fontSize: 14, marginBottom: 10 }}>
            Age Loading
          </h6>
          <div className="table-responsive">
            <table className="table table-sm" style={{ fontSize: 13 }}>
              <thead>
                <tr>
                  <th>Age Group</th>
                  <th>Loading %</th>
                </tr>
              </thead>
              <tbody>
                {rulesJson.ageLoadingTable.map((r, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 600 }}>{r.ageGroup}</td>
                    <td>{r.loadingPercent}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* PED Loading */}
      {rulesJson.pedLoading && (
        <div className="mb-4">
          <h6 style={{ fontWeight: 700, fontSize: 14, marginBottom: 10 }}>
            Pre-Existing Disease (PED) Loading
          </h6>
          {rulesJson.pedLoading.hasPED ? (
            <div className="row g-3">
              <div className="col-md-4">
                <div style={{ fontSize: 12, opacity: 0.5 }}>Loading</div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>
                  {rulesJson.pedLoading.loadingPercent}%
                </div>
              </div>
              <div className="col-md-4">
                <div style={{ fontSize: 12, opacity: 0.5 }}>Waiting Period</div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>
                  {rulesJson.pedLoading.waitingPeriod}
                </div>
              </div>
              <div className="col-md-4">
                <div style={{ fontSize: 12, opacity: 0.5 }}>
                  Covered Conditions
                </div>
                <div className="d-flex gap-1 flex-wrap mt-1">
                  {(rulesJson.pedLoading.conditions || []).map((c, i) => (
                    <span
                      key={i}
                      style={{
                        padding: "2px 8px",
                        borderRadius: 6,
                        background: "rgba(255,86,64,0.08)",
                        fontSize: 11,
                        fontWeight: 600,
                        color: "#ff5640",
                      }}
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-muted small mb-0">
              PED loading not applicable for this product.
            </p>
          )}
        </div>
      )}

      {/* ROP Configuration */}
      {rulesJson.ropConfig && (
        <div>
          <h6 style={{ fontWeight: 700, fontSize: 14, marginBottom: 10 }}>
            Return of Premium (ROP)
          </h6>
          {rulesJson.ropConfig.enabled ? (
            <div className="row g-3">
              <div className="col-md-3">
                <div style={{ fontSize: 12, opacity: 0.5 }}>Return %</div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>
                  {rulesJson.ropConfig.returnPercent}%
                </div>
              </div>
              <div className="col-md-3">
                <div style={{ fontSize: 12, opacity: 0.5 }}>Eligible After</div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>
                  {rulesJson.ropConfig.eligibleAfterYears} years
                </div>
              </div>
              <div className="col-md-3">
                <div style={{ fontSize: 12, opacity: 0.5 }}>
                  No Claim Required
                </div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>
                  {rulesJson.ropConfig.noClaimRequired ? "Yes" : "No"}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-muted small mb-0">
              ROP not enabled for this product.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Review Task Card ────────────────────────────────────────
function ReviewTaskCard({ task, onApprove, onRevision, submitting }) {
  const [expanded, setExpanded] = useState(false);
  const [showRevisionModal, setShowRevisionModal] = useState(false);
  const [revisionComment, setRevisionComment] = useState("");

  const pv = task.productVersion;
  const isOpen = task.status === "OPEN";

  const handleRevisionSubmit = () => {
    if (!revisionComment.trim()) return;
    onRevision(task.reviewTaskId, revisionComment);
    setShowRevisionModal(false);
    setRevisionComment("");
  };

  return (
    <div className="card border-0 mb-3" style={{ transition: "all 0.2s" }}>
      {/* Collapsed Header */}
      <div
        className="card-body d-flex align-items-center gap-3 p-4"
        style={{ cursor: "pointer" }}
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex-fill">
          <div className="d-flex align-items-center gap-2 mb-1">
            <span style={{ fontSize: 16, fontWeight: 700 }}>
              {pv.product.productName}
            </span>
            <span style={{ fontSize: 12, opacity: 0.4, fontWeight: 600 }}>
              v{pv.versionNumber}
            </span>
          </div>
          <div
            className="d-flex align-items-center gap-3"
            style={{ fontSize: 12, opacity: 0.5 }}
          >
            <span>ID: {task.reviewTaskId}</span>
            <span>•</span>
            <span>
              Assigned:{" "}
              {new Date(task.assignedAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
            {task.reviewedAt && (
              <>
                <span>•</span>
                <span>
                  Reviewed:{" "}
                  {new Date(task.reviewedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </>
            )}
          </div>
        </div>
        <StatusBadge status={task.status} />
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: "rgba(25,43,55,0.04)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {expanded ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
        </div>
      </div>

      {/* Revision Comments (if any) */}
      {task.revisionComments && (
        <div
          style={{
            margin: "0 24px 12px",
            padding: "10px 16px",
            borderRadius: 8,
            background: "rgba(212,64,59,0.06)",
            fontSize: 13,
          }}
        >
          <span style={{ fontWeight: 700, color: "#d4403b" }}>
            Revision Comments:{" "}
          </span>
          <span style={{ opacity: 0.8 }}>{task.revisionComments}</span>
        </div>
      )}

      {/* Expanded View */}
      {expanded && (
        <div style={{ borderTop: "1px solid rgba(25,43,55,0.06)" }}>
          <div className="p-4">
            {/* Modules */}
            <div className="mb-4">
              <h6
                style={{
                  fontWeight: 800,
                  fontSize: 15,
                  color: "#192b37",
                  marginBottom: 16,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <span
                  style={{
                    width: 4,
                    height: 18,
                    borderRadius: 2,
                    background: "#5899c4",
                    display: "inline-block",
                  }}
                />
                Modules Configuration
              </h6>
              <ModulesSection modulesJson={pv.modulesJson} />
            </div>

            {/* Rules */}
            <div className="mb-4">
              <h6
                style={{
                  fontWeight: 800,
                  fontSize: 15,
                  color: "#192b37",
                  marginBottom: 16,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <span
                  style={{
                    width: 4,
                    height: 18,
                    borderRadius: 2,
                    background: "#ff5640",
                    display: "inline-block",
                  }}
                />
                Rules & Pricing
              </h6>
              <RulesSection rulesJson={pv.rulesJson} />
            </div>

            {/* Action Buttons */}
            {isOpen && (
              <div
                className="d-flex gap-2 pt-3"
                style={{ borderTop: "1px solid rgba(25,43,55,0.06)" }}
              >
                <button
                  className="btn d-flex align-items-center gap-2"
                  style={{
                    background: "#2d9c5b",
                    color: "white",
                    fontWeight: 600,
                    fontSize: 13,
                    padding: "10px 24px",
                    borderRadius: 10,
                    border: "none",
                  }}
                  disabled={submitting}
                  onClick={(e) => {
                    e.stopPropagation();
                    onApprove(task.reviewTaskId);
                  }}
                >
                  <FiCheck size={14} />{" "}
                  {submitting ? "Processing..." : "Approve"}
                </button>
                <button
                  className="btn d-flex align-items-center gap-2"
                  style={{
                    background: "rgba(212,64,59,0.08)",
                    color: "#d4403b",
                    fontWeight: 600,
                    fontSize: 13,
                    padding: "10px 24px",
                    borderRadius: 10,
                    border: "none",
                  }}
                  disabled={submitting}
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowRevisionModal(true);
                  }}
                >
                  <FiRotateCcw size={14} /> Request Revision
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Revision Comment Modal */}
      {showRevisionModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            zIndex: 9998,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => setShowRevisionModal(false)}
        >
          <div
            style={{
              background: "white",
              borderRadius: 16,
              padding: 32,
              width: "100%",
              maxWidth: 500,
              boxShadow: "0 16px 48px rgba(0,0,0,0.15)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h5 style={{ fontWeight: 800, marginBottom: 4 }}>
              Request Revision
            </h5>
            <p style={{ fontSize: 13, opacity: 0.5, marginBottom: 20 }}>
              Provide comments for the product team about what needs to be
              corrected.
            </p>
            <textarea
              className="form-control mb-3"
              rows={4}
              placeholder="e.g., Waiting period logic incorrect for maternity module..."
              value={revisionComment}
              onChange={(e) => setRevisionComment(e.target.value)}
              style={{ fontSize: 13, borderRadius: 10 }}
            />
            <div className="d-flex gap-2 justify-content-end">
              <button
                className="btn btn-outline-secondary"
                style={{ fontSize: 13, padding: "8px 20px", borderRadius: 10 }}
                onClick={() => setShowRevisionModal(false)}
              >
                Cancel
              </button>
              <button
                className="btn"
                style={{
                  background: "#d4403b",
                  color: "white",
                  fontWeight: 600,
                  fontSize: 13,
                  padding: "8px 20px",
                  borderRadius: 10,
                  border: "none",
                }}
                disabled={!revisionComment.trim() || submitting}
                onClick={handleRevisionSubmit}
              >
                {submitting ? "Submitting..." : "Submit Revision"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Dashboard ──────────────────────────────────────────
export default function UnderwriterReviewDashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState({ message: "", type: "" });

  const { latestNotification } = useReviewNotifications(true, 25000);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "" }), 4000);
  };

  const loadTasks = useCallback(async () => {
    try {
      setError(null);
      const data = await fetchReviewTasks();
      setTasks(data);
    } catch (err) {
      setError(err.message || "Failed to load review tasks");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  // Real-time notification handler
  useEffect(() => {
    if (latestNotification) {
      showToast(latestNotification.message, "info");
      loadTasks();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [latestNotification]);

  const handleApprove = async (reviewTaskId) => {
    try {
      setSubmitting(true);
      await approveReview(reviewTaskId);
      showToast(
        "Product version approved and activated successfully!",
        "success",
      );
      await loadTasks();
    } catch (err) {
      showToast(err.message || "Approval failed", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRevision = async (reviewTaskId, comments) => {
    try {
      setSubmitting(true);
      await requestRevision(reviewTaskId, comments);
      showToast("Revision requested successfully!", "success");
      await loadTasks();
    } catch (err) {
      showToast(err.message || "Revision request failed", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const statuses = ["ALL", "OPEN", "APPROVED", "REVISION_REQUESTED"];
  const openCount = tasks.filter((t) => t.status === "OPEN").length;

  const filtered = tasks
    .filter((t) => filterStatus === "ALL" || t.status === filterStatus)
    .filter((t) =>
      t.productVersion.product.productName
        .toLowerCase()
        .includes(search.toLowerCase()),
    );

  // Loading state
  if (loading) {
    return (
      <div className="text-center py-5">
        <div
          className="spinner-border text-secondary"
          role="status"
          style={{ width: 48, height: 48 }}
        />
        <p className="mt-3 text-muted">Loading review tasks...</p>
      </div>
    );
  }

  return (
    <>
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: "", type: "" })}
      />

      {/* Header */}
      <div className="mb-4">
        <h1>Product Reviews</h1>
        <p>
          Review assigned product versions, verify modules & pricing rules, then
          approve or request revision
        </p>
      </div>

      {/* Stats + Filters */}
      <div className="card border-0 mb-4">
        <div className="card-body p-4">
          <div className="d-flex align-items-center gap-3 flex-wrap">
            {/* Open count badge */}
            <div className="d-flex align-items-center gap-2 me-3">
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: "rgba(255,193,7,0.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 800,
                  fontSize: 16,
                  color: "#b8860b",
                }}
              >
                {openCount}
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, opacity: 0.6 }}>
                Open Tasks
              </span>
            </div>

            {/* Search */}
            <div
              className="position-relative flex-fill"
              style={{ maxWidth: 280 }}
            >
              <FiSearch
                style={{
                  position: "absolute",
                  left: 14,
                  top: "50%",
                  transform: "translateY(-50%)",
                  opacity: 0.3,
                }}
              />
              <input
                className="form-control"
                style={{ paddingLeft: 40, borderRadius: 10, fontSize: 13 }}
                placeholder="Search by product name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Filter pills */}
            <div className="d-flex gap-2 ms-auto flex-wrap">
              {statuses.map((s) => (
                <button
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  style={{
                    padding: "7px 16px",
                    borderRadius: 10,
                    border: "none",
                    fontSize: 12,
                    fontWeight: 600,
                    background:
                      filterStatus === s ? "#192b37" : "rgba(25,43,55,0.04)",
                    color: filterStatus === s ? "white" : "#192b37",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  {s === "ALL"
                    ? "All"
                    : s === "REVISION_REQUESTED"
                      ? "Revision"
                      : s.charAt(0) + s.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div
          className="alert alert-danger d-flex align-items-center gap-2"
          role="alert"
          style={{ borderRadius: 12, fontSize: 14 }}
        >
          <FiAlertCircle size={16} /> {error}
          <button
            className="btn btn-sm btn-outline-danger ms-auto"
            onClick={loadTasks}
          >
            Retry
          </button>
        </div>
      )}

      {/* Review Cards */}
      {filtered.length === 0 ? (
        <div className="text-center py-5">
          <div style={{ fontSize: 48, marginBottom: 12 }}>📋</div>
          <h4 className="fw-semibold">No Assigned Reviews</h4>
          <p className="text-muted small">
            {search || filterStatus !== "ALL"
              ? "Try adjusting your filters or search criteria"
              : "You have no review tasks assigned at this time"}
          </p>
        </div>
      ) : (
        filtered.map((task) => (
          <ReviewTaskCard
            key={task.reviewTaskId}
            task={task}
            onApprove={handleApprove}
            onRevision={handleRevision}
            submitting={submitting}
          />
        ))
      )}
    </>
  );
}
