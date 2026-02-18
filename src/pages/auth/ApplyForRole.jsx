import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiBriefcase,
  FiCalendar,
  FiFileText,
  FiUpload,
  FiArrowRight,
  FiCheckCircle,
  FiShield,
  FiAlertCircle,
} from "react-icons/fi";
import { ROLE_LABELS } from "../../constants/roles";

const REQUESTABLE_ROLES = [
  { value: "UNDERWRITER", label: "Underwriter" },
  { value: "ADMIN", label: "Administrator" },
];

export default function ApplyForRole() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    dob: "",
    requestedRole: "",
    experienceYears: "",
    justification: "",
  });
  const [document, setDocument] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, document: "File must be under 5MB" }));
        return;
      }
      setDocument(file);
      if (errors.document) setErrors((prev) => ({ ...prev, document: "" }));
    }
  };

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = "Full name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      e.email = "Invalid email address";
    if (!form.phone.trim()) e.phone = "Phone number is required";
    if (!form.dob) e.dob = "Date of birth is required";
    if (!form.requestedRole) e.requestedRole = "Please select a role";
    if (!form.experienceYears) e.experienceYears = "Experience is required";
    else if (Number(form.experienceYears) < 0)
      e.experienceYears = "Must be 0 or more";
    if (!form.justification.trim())
      e.justification = "Justification is required";
    if (!document) e.document = "Please upload a supporting document";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    if (!validate()) return;

    setSubmitting(true);
    try {
      // Mock API call — simulated delay
      await new Promise((resolve) => setTimeout(resolve, 1200));
      setSubmitted(true);
    } catch {
      setSubmitError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // ─── Success State ────────────────────────────────────────

  if (submitted) {
    return (
      <div className="auth-page">
        <div className="auth-form-panel">
          <div className="auth-form-container text-center">
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                background: "rgba(45,156,91,0.1)",
                color: "#2d9c5b",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 24px",
                fontSize: 36,
              }}
            >
              <FiCheckCircle />
            </div>
            <h1 style={{ fontSize: 26 }}>Application Submitted!</h1>
            <p className="lead" style={{ opacity: 0.7 }}>
              Your role application has been submitted successfully. Our admin
              team will review it and get back to you shortly.
            </p>
            <Link
              to="/login"
              className="btn btn-primary d-inline-flex align-items-center gap-2 mt-3"
              style={{
                borderRadius: 12,
                fontWeight: 600,
                padding: "10px 28px",
              }}
            >
              Go to Login <FiArrowRight />
            </Link>
          </div>
        </div>
        <div className="auth-brand-panel d-none d-lg-flex">
          <div className="auth-brand-content">
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: 24,
                margin: "0 auto 24px",
                background:
                  "linear-gradient(135deg, rgba(255,86,64,0.2), rgba(255,128,102,0.1))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 32,
                fontWeight: 800,
                color: "white",
              }}
            >
              <FiShield />
            </div>
            <h2>Welcome Aboard!</h2>
            <p style={{ margin: "0 auto" }}>
              We're reviewing your application. You'll receive an email
              notification once it's processed.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ─── Form ─────────────────────────────────────────────────

  const inputStyle = (field) => ({
    paddingLeft: 40,
    borderColor: errors[field] ? "#d4403b" : undefined,
  });

  const iconStyle = {
    position: "absolute",
    left: 14,
    top: "50%",
    transform: "translateY(-50%)",
    opacity: 0.4,
  };

  return (
    <div className="auth-page">
      <div className="auth-form-panel" style={{ overflowY: "auto" }}>
        <div className="auth-form-container" style={{ maxWidth: 480 }}>
          {/* Branding */}
          <div className="d-flex align-items-center gap-2 mb-4">
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                background: "linear-gradient(135deg, #ff5640, #ff8066)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontWeight: 800,
                fontSize: 16,
              }}
            >
              IN
            </div>
            <span style={{ fontWeight: 700, fontSize: 20 }}>InsureFlow</span>
          </div>

          <h1 style={{ fontSize: 26 }}>Apply for a Role</h1>
          <p className="lead">
            Submit your application to join as an Underwriter or Administrator
          </p>

          {submitError && (
            <div
              className="alert alert-danger d-flex align-items-center gap-2 py-2 px-3"
              style={{ fontSize: 13 }}
            >
              <FiAlertCircle /> {submitError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {/* Full Name */}
            <div className="mb-3">
              <label
                className="form-label"
                style={{ fontSize: 13, fontWeight: 600 }}
              >
                Full Name *
              </label>
              <div className="position-relative">
                <FiUser style={iconStyle} />
                <input
                  type="text"
                  name="fullName"
                  className="form-control"
                  style={inputStyle("fullName")}
                  placeholder="Enter your full name"
                  value={form.fullName}
                  onChange={handleChange}
                />
              </div>
              {errors.fullName && (
                <div
                  className="text-danger"
                  style={{ fontSize: 12, marginTop: 4 }}
                >
                  {errors.fullName}
                </div>
              )}
            </div>

            {/* Email & Phone — side by side */}
            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <label
                  className="form-label"
                  style={{ fontSize: 13, fontWeight: 600 }}
                >
                  Email *
                </label>
                <div className="position-relative">
                  <FiMail style={iconStyle} />
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    style={inputStyle("email")}
                    placeholder="you@email.com"
                    value={form.email}
                    onChange={handleChange}
                  />
                </div>
                {errors.email && (
                  <div
                    className="text-danger"
                    style={{ fontSize: 12, marginTop: 4 }}
                  >
                    {errors.email}
                  </div>
                )}
              </div>
              <div className="col-md-6">
                <label
                  className="form-label"
                  style={{ fontSize: 13, fontWeight: 600 }}
                >
                  Phone *
                </label>
                <div className="position-relative">
                  <FiPhone style={iconStyle} />
                  <input
                    type="tel"
                    name="phone"
                    className="form-control"
                    style={inputStyle("phone")}
                    placeholder="+1 234 567 890"
                    value={form.phone}
                    onChange={handleChange}
                  />
                </div>
                {errors.phone && (
                  <div
                    className="text-danger"
                    style={{ fontSize: 12, marginTop: 4 }}
                  >
                    {errors.phone}
                  </div>
                )}
              </div>
            </div>

            {/* DOB */}
            <div className="mb-3">
              <label
                className="form-label"
                style={{ fontSize: 13, fontWeight: 600 }}
              >
                Date of Birth *
              </label>
              <div className="position-relative">
                <FiCalendar style={iconStyle} />
                <input
                  type="date"
                  name="dob"
                  className="form-control"
                  style={inputStyle("dob")}
                  value={form.dob}
                  onChange={handleChange}
                />
              </div>
              {errors.dob && (
                <div
                  className="text-danger"
                  style={{ fontSize: 12, marginTop: 4 }}
                >
                  {errors.dob}
                </div>
              )}
            </div>

            {/* Role & Experience — side by side */}
            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <label
                  className="form-label"
                  style={{ fontSize: 13, fontWeight: 600 }}
                >
                  Requested Role *
                </label>
                <div className="position-relative">
                  <FiBriefcase style={iconStyle} />
                  <select
                    name="requestedRole"
                    className="form-select"
                    style={{ ...inputStyle("requestedRole"), paddingLeft: 40 }}
                    value={form.requestedRole}
                    onChange={handleChange}
                  >
                    <option value="">Select a role</option>
                    {REQUESTABLE_ROLES.map((r) => (
                      <option key={r.value} value={r.value}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.requestedRole && (
                  <div
                    className="text-danger"
                    style={{ fontSize: 12, marginTop: 4 }}
                  >
                    {errors.requestedRole}
                  </div>
                )}
              </div>
              <div className="col-md-6">
                <label
                  className="form-label"
                  style={{ fontSize: 13, fontWeight: 600 }}
                >
                  Experience (years) *
                </label>
                <div className="position-relative">
                  <FiBriefcase style={iconStyle} />
                  <input
                    type="number"
                    name="experienceYears"
                    className="form-control"
                    style={inputStyle("experienceYears")}
                    placeholder="e.g. 5"
                    min="0"
                    max="50"
                    value={form.experienceYears}
                    onChange={handleChange}
                  />
                </div>
                {errors.experienceYears && (
                  <div
                    className="text-danger"
                    style={{ fontSize: 12, marginTop: 4 }}
                  >
                    {errors.experienceYears}
                  </div>
                )}
              </div>
            </div>

            {/* Justification */}
            <div className="mb-3">
              <label
                className="form-label"
                style={{ fontSize: 13, fontWeight: 600 }}
              >
                Justification *
              </label>
              <textarea
                name="justification"
                className="form-control"
                rows="3"
                style={{
                  borderColor: errors.justification ? "#d4403b" : undefined,
                }}
                placeholder="Explain why you'd be a great fit for this role..."
                value={form.justification}
                onChange={handleChange}
              />
              {errors.justification && (
                <div
                  className="text-danger"
                  style={{ fontSize: 12, marginTop: 4 }}
                >
                  {errors.justification}
                </div>
              )}
            </div>

            {/* Document Upload */}
            <div className="mb-4">
              <label
                className="form-label"
                style={{ fontSize: 13, fontWeight: 600 }}
              >
                Supporting Document *
              </label>
              <div
                className="border rounded-3 p-3 text-center"
                style={{
                  borderStyle: "dashed !important",
                  borderColor: errors.document
                    ? "#d4403b"
                    : "rgba(25,43,55,0.15)",
                  background: "rgba(25,43,55,0.02)",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onClick={() =>
                  window.document.getElementById("doc-upload").click()
                }
              >
                <input
                  type="file"
                  id="doc-upload"
                  className="d-none"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                />
                {document ? (
                  <div className="d-flex align-items-center justify-content-center gap-2">
                    <FiFileText size={18} style={{ color: "#2d9c5b" }} />
                    <span style={{ fontSize: 13, fontWeight: 600 }}>
                      {document.name}
                    </span>
                    <span className="text-muted" style={{ fontSize: 11 }}>
                      ({(document.size / 1024).toFixed(0)} KB)
                    </span>
                  </div>
                ) : (
                  <>
                    <FiUpload
                      size={24}
                      style={{ opacity: 0.3, marginBottom: 8 }}
                    />
                    <div
                      style={{ fontSize: 13, fontWeight: 500, opacity: 0.6 }}
                    >
                      Click to upload — PDF, DOC, or image (max 5MB)
                    </div>
                  </>
                )}
              </div>
              {errors.document && (
                <div
                  className="text-danger"
                  style={{ fontSize: 12, marginTop: 4 }}
                >
                  {errors.document}
                </div>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary btn-lg w-100 d-flex align-items-center justify-content-center gap-2"
              style={{ borderRadius: 12, fontWeight: 600 }}
            >
              {submitting ? (
                <>
                  <span className="spinner-border spinner-border-sm" />{" "}
                  Submitting...
                </>
              ) : (
                <>
                  Submit Application <FiArrowRight />
                </>
              )}
            </button>
          </form>

          <p
            className="text-center mt-4"
            style={{ fontSize: 13, opacity: 0.6 }}
          >
            Already have an account?{" "}
            <Link
              to="/login"
              style={{
                color: "#192b37",
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>

      {/* Brand Panel */}
      <div className="auth-brand-panel d-none d-lg-flex">
        <div className="auth-brand-content">
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: 24,
              margin: "0 auto 24px",
              background:
                "linear-gradient(135deg, rgba(255,86,64,0.2), rgba(255,128,102,0.1))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 32,
              fontWeight: 800,
              color: "white",
            }}
          >
            <FiShield />
          </div>
          <h2>Join Our Team</h2>
          <p style={{ margin: "0 auto" }}>
            Apply to become an Underwriter or Administrator and help us deliver
            exceptional insurance services.
          </p>
          <div className="role-selector-demo mt-4">
            <div className="role-chip">🔍 Underwriter</div>
            <div className="role-chip">⚙️ Administrator</div>
          </div>
        </div>
      </div>
    </div>
  );
}
