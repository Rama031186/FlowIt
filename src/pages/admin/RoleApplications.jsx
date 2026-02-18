import { useState, useEffect, useRef, useCallback } from "react";
import {
  FiUserCheck,
  FiUserX,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiRefreshCw,
  FiInbox,
} from "react-icons/fi";
import { ROLE_LABELS } from "../../constants/roles";
import {
  fetchPendingApplications,
  approveApplication,
  rejectApplication,
} from "../../services/roleApplicationsApi";
import useRoleApplicationsSocket from "../../hooks/useRoleApplicationsSocket";

// ─── Helpers ──────────────────────────────────────────────────

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function statusBadgeClass(status) {
  switch (status) {
    case "APPROVED":
      return "approved";
    case "REJECTED":
      return "rejected";
    default:
      return "pending";
  }
}

// ─── Toast Component ──────────────────────────────────────────

function Toast({ show, message, variant = "success", onClose }) {
  useEffect(() => {
    if (show) {
      const t = setTimeout(onClose, 3500);
      return () => clearTimeout(t);
    }
  }, [show, onClose]);

  if (!show) return null;
  return (
    <div
      style={{
        position: "fixed",
        top: 24,
        right: 24,
        zIndex: 9999,
        minWidth: 320,
        animation: "fadeInUp 0.3s ease",
      }}
    >
      <div
        className={`alert alert-${variant} alert-dismissible d-flex align-items-center gap-2 shadow-lg mb-0`}
        role="alert"
        style={{ borderRadius: 12, fontSize: 14, fontWeight: 500 }}
      >
        {variant === "success" ? (
          <FiCheckCircle size={18} />
        ) : (
          <FiXCircle size={18} />
        )}
        {message}
        <button
          type="button"
          className="btn-close"
          onClick={onClose}
          style={{ fontSize: 10 }}
        />
      </div>
    </div>
  );
}

// ─── Reject Modal ─────────────────────────────────────────────

function RejectModal({ show, applicantName, onConfirm, onCancel, loading }) {
  if (!show) return null;
  return (
    <>
      <div className="modal-backdrop fade show" style={{ zIndex: 1050 }} />
      <div
        className="modal fade show d-block"
        tabIndex="-1"
        style={{ zIndex: 1055 }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div
            className="modal-content border-0 shadow"
            style={{ borderRadius: 16 }}
          >
            <div className="modal-header border-0 pb-0">
              <h5 className="modal-title d-flex align-items-center gap-2">
                <FiAlertCircle size={20} style={{ color: "#d4403b" }} />
                Reject Application
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={onCancel}
                disabled={loading}
              />
            </div>
            <div className="modal-body" style={{ fontSize: 14 }}>
              Are you sure you want to reject the application from{" "}
              <strong>{applicantName}</strong>? This action cannot be undone.
            </div>
            <div className="modal-footer border-0 pt-0">
              <button
                className="btn btn-light"
                onClick={onCancel}
                disabled={loading}
                style={{ borderRadius: 10, fontSize: 13, fontWeight: 600 }}
              >
                Cancel
              </button>
              <button
                className="btn btn-danger d-flex align-items-center gap-2"
                onClick={onConfirm}
                disabled={loading}
                style={{ borderRadius: 10, fontSize: 13, fontWeight: 600 }}
              >
                {loading ? (
                  <span className="spinner-border spinner-border-sm" />
                ) : (
                  <FiXCircle size={14} />
                )}
                Reject
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Loading Skeleton ─────────────────────────────────────────

function TableSkeleton() {
  return (
    <div className="card-body p-0">
      <table className="table mb-0">
        <thead>
          <tr>
            <th>Full Name</th>
            <th>Email</th>
            <th>Requested Role</th>
            <th>Experience</th>
            <th>Submitted At</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {[1, 2, 3, 4].map((i) => (
            <tr key={i}>
              {[1, 2, 3, 4, 5, 6, 7].map((j) => (
                <td key={j}>
                  <div className="placeholder-glow">
                    <span
                      className="placeholder col-10"
                      style={{ borderRadius: 6, height: 16 }}
                    />
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────

export default function RoleApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null); // id of application being acted on
  const [toast, setToast] = useState({
    show: false,
    message: "",
    variant: "success",
  });
  const [rejectModal, setRejectModal] = useState({
    show: false,
    id: null,
    name: "",
  });
  const [highlightId, setHighlightId] = useState(null);
  const highlightTimeout = useRef(null);

  // WebSocket simulation
  const { latestMessage } = useRoleApplicationsSocket(true);

  // ─── Fetch ──────────────────────────────────────────────────

  const loadApplications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchPendingApplications();
      setApplications(data);
    } catch {
      setError("Failed to load applications. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadApplications();
  }, [loadApplications]);

  // ─── WebSocket: auto-add new applications ───────────────────

  useEffect(() => {
    if (!latestMessage) return;
    setApplications((prev) => {
      if (prev.find((a) => a.id === latestMessage.id)) return prev;
      return [latestMessage, ...prev];
    });
    // Highlight flash
    setHighlightId(latestMessage.id);
    if (highlightTimeout.current) clearTimeout(highlightTimeout.current);
    highlightTimeout.current = setTimeout(() => setHighlightId(null), 2500);
  }, [latestMessage]);

  // ─── Approve Handler ───────────────────────────────────────

  const handleApprove = async (id) => {
    setActionLoading(id);
    try {
      const updated = await approveApplication(id);
      setApplications((prev) => prev.map((a) => (a.id === id ? updated : a)));
      setToast({
        show: true,
        message: `Application approved successfully!`,
        variant: "success",
      });
    } catch {
      setToast({
        show: true,
        message: "Failed to approve application.",
        variant: "danger",
      });
    } finally {
      setActionLoading(null);
    }
  };

  // ─── Reject Handler ────────────────────────────────────────

  const handleRejectConfirm = async () => {
    const { id } = rejectModal;
    setActionLoading(id);
    try {
      const updated = await rejectApplication(id);
      setApplications((prev) => prev.map((a) => (a.id === id ? updated : a)));
      setToast({
        show: true,
        message: `Application rejected.`,
        variant: "warning",
      });
    } catch {
      setToast({
        show: true,
        message: "Failed to reject application.",
        variant: "danger",
      });
    } finally {
      setActionLoading(null);
      setRejectModal({ show: false, id: null, name: "" });
    }
  };

  // ─── Stats ──────────────────────────────────────────────────

  const stats = [
    {
      label: "Total Applications",
      value: applications.length,
      color: "#192b37",
    },
    {
      label: "Pending",
      value: applications.filter((a) => a.status === "PENDING").length,
      color: "#ff5640",
    },
    {
      label: "Approved",
      value: applications.filter((a) => a.status === "APPROVED").length,
      color: "#2d9c5b",
    },
    {
      label: "Rejected",
      value: applications.filter((a) => a.status === "REJECTED").length,
      color: "#d4403b",
    },
  ];

  // ─── Render ─────────────────────────────────────────────────

  return (
    <>
      {/* Toast */}
      <Toast
        show={toast.show}
        message={toast.message}
        variant={toast.variant}
        onClose={() => setToast({ ...toast, show: false })}
      />

      {/* Reject Confirmation Modal */}
      <RejectModal
        show={rejectModal.show}
        applicantName={rejectModal.name}
        onConfirm={handleRejectConfirm}
        onCancel={() => setRejectModal({ show: false, id: null, name: "" })}
        loading={actionLoading === rejectModal.id}
      />

      {/* Page Header */}
      <div className="mb-4 d-flex align-items-start justify-content-between">
        <div>
          <h1>Role Applications</h1>
          <p className="text-muted mb-0">
            Review and manage pending role upgrade requests
          </p>
        </div>
        <button
          className="btn btn-outline-secondary d-flex align-items-center gap-2"
          onClick={loadApplications}
          disabled={loading}
          style={{ fontSize: 13, borderRadius: 10, fontWeight: 600 }}
        >
          <FiRefreshCw size={14} className={loading ? "spin" : ""} /> Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="row g-4 mb-4">
        {stats.map((s) => (
          <div className="col-md-3 col-6" key={s.label}>
            <div className="card border-0 h-100">
              <div className="fw-bold mb-1" style={{ fontSize: 24 }}>
                {s.value}
              </div>
              <div className="text-muted small">{s.label}</div>
              <div
                style={{
                  height: 3,
                  background: s.color,
                  borderRadius: 2,
                  marginTop: 12,
                  opacity: 0.3,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Error State */}
      {error && (
        <div
          className="alert alert-danger d-flex align-items-center gap-2"
          role="alert"
          style={{ borderRadius: 12, fontSize: 14 }}
        >
          <FiAlertCircle size={18} />
          {error}
          <button
            className="btn btn-sm btn-outline-danger ms-auto"
            onClick={loadApplications}
            style={{ borderRadius: 8, fontSize: 12, fontWeight: 600 }}
          >
            Retry
          </button>
        </div>
      )}

      {/* Table Card */}
      <div className="card border-0">
        {loading ? (
          <TableSkeleton />
        ) : applications.length === 0 ? (
          /* Empty State */
          <div className="card-body text-center py-5">
            <FiInbox size={48} style={{ opacity: 0.15, marginBottom: 16 }} />
            <h5 className="text-muted fw-normal">No role applications found</h5>
            <p className="text-muted small">
              New applications will appear here in real time
            </p>
          </div>
        ) : (
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <thead>
                  <tr>
                    <th>Full Name</th>
                    <th>Email</th>
                    <th>Requested Role</th>
                    <th>Experience</th>
                    <th>Submitted At</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app) => (
                    <tr
                      key={app.id}
                      style={{
                        transition: "background 0.5s ease",
                        background:
                          highlightId === app.id
                            ? "rgba(88,153,196,0.08)"
                            : "transparent",
                      }}
                    >
                      <td>
                        <div className="d-flex align-items-center gap-3">
                          <div
                            style={{
                              width: 36,
                              height: 36,
                              borderRadius: 10,
                              background: "#5899c4",
                              color: "white",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontWeight: 700,
                              fontSize: 12,
                              flexShrink: 0,
                            }}
                          >
                            {app.fullName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>
                          <span style={{ fontWeight: 600 }}>
                            {app.fullName}
                          </span>
                        </div>
                      </td>
                      <td style={{ fontSize: 13 }}>{app.email}</td>
                      <td>
                        <span
                          className="status-badge info"
                          style={{ fontSize: 11 }}
                        >
                          {ROLE_LABELS[app.requestedRole] || app.requestedRole}
                        </span>
                      </td>
                      <td style={{ fontWeight: 600 }}>
                        {app.experienceYears} yrs
                      </td>
                      <td style={{ fontSize: 12, opacity: 0.6 }}>
                        {formatDate(app.submittedAt)}
                      </td>
                      <td>
                        <span
                          className={`status-badge ${statusBadgeClass(app.status)}`}
                        >
                          {app.status.charAt(0) +
                            app.status.slice(1).toLowerCase()}
                        </span>
                      </td>
                      <td>
                        {app.status === "PENDING" ? (
                          <div className="d-flex gap-1">
                            <button
                              className="btn btn-sm btn-outline-success d-flex align-items-center gap-1"
                              style={{
                                borderRadius: 8,
                                fontSize: 12,
                                fontWeight: 600,
                              }}
                              disabled={actionLoading === app.id}
                              onClick={() => handleApprove(app.id)}
                              title="Approve"
                            >
                              {actionLoading === app.id ? (
                                <span className="spinner-border spinner-border-sm" />
                              ) : (
                                <FiUserCheck size={14} />
                              )}
                              Approve
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1"
                              style={{
                                borderRadius: 8,
                                fontSize: 12,
                                fontWeight: 600,
                              }}
                              disabled={actionLoading === app.id}
                              onClick={() =>
                                setRejectModal({
                                  show: true,
                                  id: app.id,
                                  name: app.fullName,
                                })
                              }
                              title="Reject"
                            >
                              <FiUserX size={14} /> Reject
                            </button>
                          </div>
                        ) : (
                          <span
                            className="text-muted"
                            style={{ fontSize: 12, fontStyle: "italic" }}
                          >
                            —{" "}
                            {app.status === "APPROVED"
                              ? "Approved"
                              : "Rejected"}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Inline CSS for spinner animation */}
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .spin { animation: spin 1s linear infinite; }
      `}</style>
    </>
  );
}
