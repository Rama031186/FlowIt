import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { ROLES } from "../../constants/roles";
import {
  POLICIES,
  APPLICATIONS,
  WELLNESS_DATA,
  NOTIFICATIONS,
  ALL_USERS,
  PRODUCTS,
} from "../../data/mockData";
import {
  FiFileText,
  FiShield,
  FiHeart,
  FiUsers,
  FiActivity,
  FiClipboard,
  FiLayers,
  FiSettings,
  FiTrendingUp,
  FiTrendingDown,
  FiArrowRight,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { PieChart } from "@mui/x-charts/PieChart";
import { fetchUserStats } from "../../services/userStatsApi";

function StatCard({
  icon: Icon,
  label,
  value,
  change,
  changeType,
  color,
  onClick,
}) {
  return (
    <div
      className="card border-0 h-100"
      onClick={onClick}
      style={{
        cursor: onClick ? "pointer" : "default",
        transition: "all 0.3s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(25,43,55,0.1)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "";
        e.currentTarget.style.boxShadow = "";
      }}
    >
      <div className="card-body p-4">
        <div
          className="d-flex align-items-center justify-content-center rounded-3 mb-3"
          style={{
            width: 48,
            height: 48,
            background: `${color}15`,
            color,
            fontSize: 22,
          }}
        >
          <Icon />
        </div>
        <div
          className="fw-bold mb-1"
          style={{ fontSize: 28, letterSpacing: -0.5 }}
        >
          {value}
        </div>
        <div className="text-muted small fw-medium">{label}</div>
        {change && (
          <span
            className={`badge mt-2 ${changeType === "positive" ? "text-bg-success" : "text-bg-danger"}`}
            style={{ fontSize: 12, fontWeight: 600, opacity: 0.85 }}
          >
            {changeType === "positive" ? (
              <FiTrendingUp size={12} />
            ) : (
              <FiTrendingDown size={12} />
            )}{" "}
            {change}
          </span>
        )}
      </div>
    </div>
  );
}

function CustomerDashboardContent() {
  const navigate = useNavigate();
  const activePolicies = POLICIES.filter((p) => p.status === "Active").length;
  const pendingApps = APPLICATIONS.filter((a) =>
    ["Pending Review", "Under Review"].includes(a.status),
  ).length;

  return (
    <>
      <div className="row g-4 mb-4">
        <div className="col-md-6 col-xl-3">
          <StatCard
            icon={FiFileText}
            label="Active Policies"
            value={activePolicies}
            change="+1 this month"
            changeType="positive"
            color="#2d9c5b"
            onClick={() => navigate("/policies")}
          />
        </div>
        <div className="col-md-6 col-xl-3">
          <StatCard
            icon={FiClipboard}
            label="Pending Applications"
            value={pendingApps}
            color="#ff5640"
            onClick={() => navigate("/apply")}
          />
        </div>
        <div className="col-md-6 col-xl-3">
          <StatCard
            icon={FiHeart}
            label="Wellness Credits"
            value={WELLNESS_DATA.totalCredits.toLocaleString()}
            change="+320 this month"
            changeType="positive"
            color="#5899c4"
            onClick={() => navigate("/wellness")}
          />
        </div>
        <div className="col-md-6 col-xl-3">
          <StatCard
            icon={FiUsers}
            label="Family Members"
            value="3"
            color="#192b37"
            onClick={() => navigate("/family-pool")}
          />
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card">
            <div className="card-header">
              <h5>My Policies</h5>
              <button
                className="btn btn-outline-secondary btn-sm"
                style={{ fontSize: 12, padding: "6px 14px" }}
                onClick={() => navigate("/policies")}
              >
                View All <FiArrowRight size={12} />
              </button>
            </div>
            <div className="card-body p-0">
              <table className="table">
                <thead>
                  <tr>
                    <th>Policy</th>
                    <th>Product</th>
                    <th>Premium</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {POLICIES.slice(0, 3).map((p) => (
                    <tr key={p.id}>
                      <td style={{ fontWeight: 600 }}>{p.id}</td>
                      <td>{p.productName}</td>
                      <td>${p.premium}/mo</td>
                      <td>
                        <span
                          className={`status-badge ${p.status.toLowerCase().replace(/\s+/g, "-")}`}
                        >
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="card">
            <div className="card-header">
              <h5>Recent Notifications</h5>
            </div>
            <div className="card-body">
              {NOTIFICATIONS.slice(0, 3).map((n) => (
                <div
                  key={n.id}
                  className="d-flex gap-3 mb-3 pb-3"
                  style={{ borderBottom: "1px solid rgba(25,43,55,0.04)" }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      flexShrink: 0,
                      background:
                        n.type === "warning"
                          ? "rgba(255,86,64,0.1)"
                          : n.type === "success"
                            ? "rgba(45,156,91,0.1)"
                            : "rgba(88,153,196,0.1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 14,
                      color:
                        n.type === "warning"
                          ? "#ff5640"
                          : n.type === "success"
                            ? "#2d9c5b"
                            : "#5899c4",
                    }}
                  >
                    {n.type === "warning"
                      ? "⚠"
                      : n.type === "success"
                        ? "✓"
                        : "ℹ"}
                  </div>
                  <div>
                    <div
                      style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}
                    >
                      {n.title}
                    </div>
                    <div style={{ fontSize: 11, opacity: 0.5 }}>{n.date}</div>
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

function UnderwriterDashboardContent() {
  const navigate = useNavigate();
  const pending = APPLICATIONS.filter(
    (a) => a.status === "Pending Review",
  ).length;
  const underReview = APPLICATIONS.filter(
    (a) => a.status === "Under Review",
  ).length;
  const approved = APPLICATIONS.filter((a) => a.status === "Approved").length;
  const avgRisk = Math.round(
    APPLICATIONS.reduce((s, a) => s + a.riskScore, 0) / APPLICATIONS.length,
  );

  return (
    <>
      <div className="row g-4 mb-4">
        <div className="col-md-6 col-xl-3">
          <StatCard
            icon={FiClipboard}
            label="Pending Review"
            value={pending}
            color="#ff5640"
            onClick={() => navigate("/applications")}
          />
        </div>
        <div className="col-md-6 col-xl-3">
          <StatCard
            icon={FiActivity}
            label="Under Review"
            value={underReview}
            color="#5899c4"
            onClick={() => navigate("/applications")}
          />
        </div>
        <div className="col-md-6 col-xl-3">
          <StatCard
            icon={FiShield}
            label="Approved"
            value={approved}
            change="+2 this week"
            changeType="positive"
            color="#2d9c5b"
          />
        </div>
        <div className="col-md-6 col-xl-3">
          <StatCard
            icon={FiActivity}
            label="Avg. Risk Score"
            value={avgRisk}
            color="#192b37"
          />
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h5>Recent Applications</h5>
          <button
            className="btn btn-warning btn-sm"
            style={{ fontSize: 12, padding: "8px 16px" }}
            onClick={() => navigate("/applications")}
          >
            Review All
          </button>
        </div>
        <div className="card-body p-0">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Customer</th>
                <th>Product</th>
                <th>Risk Score</th>
                <th>Status</th>
                <th>Submitted</th>
              </tr>
            </thead>
            <tbody>
              {APPLICATIONS.map((app) => (
                <tr key={app.id}>
                  <td style={{ fontWeight: 600 }}>{app.id}</td>
                  <td>{app.customerName}</td>
                  <td>{app.productName}</td>
                  <td>
                    <span
                      className={`risk-score ${app.riskScore <= 35 ? "low" : app.riskScore <= 70 ? "medium" : "high"}`}
                    >
                      {app.riskScore}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`status-badge ${app.status.toLowerCase().replace(/\s+/g, "-")}`}
                    >
                      {app.status}
                    </span>
                  </td>
                  <td style={{ fontSize: 12, opacity: 0.6 }}>
                    {app.submittedDate}
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

function AdminDashboardContent() {
  const navigate = useNavigate();
  const [userStats, setUserStats] = useState(null);

  useEffect(() => {
    fetchUserStats().then(setUserStats);
  }, []);

  const totalUsers = userStats?.totalUsers ?? ALL_USERS.length;
  const activeUsers =
    userStats?.activeUsers ??
    ALL_USERS.filter((u) => u.status === "Active").length;
  const activePolicies = POLICIES.filter((p) => p.status === "Active").length;
  const pendingApps = APPLICATIONS.filter((a) =>
    ["Pending Review", "Under Review"].includes(a.status),
  ).length;

  // Chart data
  const statusData = userStats
    ? [
        {
          id: 0,
          value: userStats.activeUsers,
          label: "Active",
          color: "#5899c4",
        },
        {
          id: 1,
          value: userStats.inactiveUsers,
          label: "Inactive",
          color: "#90a4ae",
        },
        {
          id: 2,
          value: userStats.suspendedUsers,
          label: "Suspended",
          color: "#ff8a65",
        },
      ]
    : [
        {
          id: 0,
          value: ALL_USERS.filter((u) => u.status === "Active").length,
          label: "Active",
          color: "#5899c4",
        },
        {
          id: 1,
          value: ALL_USERS.filter((u) => u.status === "Inactive").length,
          label: "Inactive",
          color: "#90a4ae",
        },
        {
          id: 2,
          value: ALL_USERS.filter((u) => u.status === "Suspended").length,
          label: "Suspended",
          color: "#ff8a65",
        },
      ];

  const roleData = userStats
    ? [
        {
          id: 0,
          value: userStats.adminCount,
          label: "Admins",
          color: "#192b37",
        },
        {
          id: 1,
          value: userStats.customerCount,
          label: "Customers",
          color: "#5899c4",
        },
      ]
    : [
        {
          id: 0,
          value: ALL_USERS.filter((u) => u.role === "ADMIN").length,
          label: "Admins",
          color: "#192b37",
        },
        {
          id: 1,
          value: ALL_USERS.filter((u) => u.role === "CUSTOMER").length,
          label: "Customers",
          color: "#5899c4",
        },
      ];

  return (
    <>
      {/* Section 1 — KPI Cards */}
      <div className="row g-4 mb-4">
        <div className="col-md-6 col-xl-3">
          <StatCard
            icon={FiUsers}
            label="Total Users"
            value={totalUsers}
            change={
              userStats
                ? `+${userStats.newUsersThisMonth} this month`
                : "+3 this month"
            }
            changeType="positive"
            color="#192b37"
            onClick={() => navigate("/admin/users")}
          />
        </div>
        <div className="col-md-6 col-xl-3">
          <StatCard
            icon={FiActivity}
            label="Active Users"
            value={activeUsers}
            color="#5899c4"
            onClick={() => navigate("/admin/users")}
          />
        </div>
        <div className="col-md-6 col-xl-3">
          <StatCard
            icon={FiFileText}
            label="Active Policies"
            value={activePolicies}
            change="+5 this month"
            changeType="positive"
            color="#2d9c5b"
            onClick={() => navigate("/admin/policies")}
          />
        </div>
        <div className="col-md-6 col-xl-3">
          <StatCard
            icon={FiClipboard}
            label="Pending Applications"
            value={pendingApps}
            color="#ff5640"
          />
        </div>
      </div>

      {/* Section 2 — Charts Row */}
      <div className="row g-4 mb-4">
        <div className="col-lg-6">
          <div className="card border-0 h-100">
            <div className="card-header">
              <h5>User Status Distribution</h5>
            </div>
            <div
              className="card-body d-flex align-items-center justify-content-center"
              style={{ minHeight: 280 }}
            >
              <PieChart
                series={[
                  {
                    data: statusData,
                    highlightScope: { fade: "global", highlight: "item" },
                    faded: {
                      innerRadius: 0,
                      additionalRadius: -4,
                      color: "gray",
                    },
                  },
                ]}
                slotProps={{
                  legend: {
                    direction: "column",
                    position: { vertical: "middle", horizontal: "right" },
                    labelStyle: {
                      fontSize: 13,
                      fontWeight: 600,
                      fill: "#4a5568",
                    },
                    itemMarkWidth: 12,
                    itemMarkHeight: 12,
                    markGap: 8,
                    itemGap: 10,
                  },
                }}
                width={400}
                height={240}
              />
            </div>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="card border-0 h-100">
            <div className="card-header">
              <h5>Role Distribution</h5>
            </div>
            <div
              className="card-body d-flex align-items-center justify-content-center"
              style={{ minHeight: 280 }}
            >
              <PieChart
                series={[
                  {
                    data: roleData,
                    innerRadius: 60,
                    outerRadius: 100,
                    paddingAngle: 3,
                    cornerRadius: 6,
                    highlightScope: { fade: "global", highlight: "item" },
                    faded: { additionalRadius: -4, color: "gray" },
                  },
                ]}
                slotProps={{
                  legend: {
                    direction: "column",
                    position: { vertical: "middle", horizontal: "right" },
                    labelStyle: {
                      fontSize: 13,
                      fontWeight: 600,
                      fill: "#4a5568",
                    },
                    itemMarkWidth: 12,
                    itemMarkHeight: 12,
                    markGap: 8,
                    itemGap: 10,
                  },
                }}
                width={400}
                height={240}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Section 3 — Quick Actions (Full Width) */}
      <div className="row g-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5>Quick Actions</h5>
            </div>
            <div className="card-body">
              <div className="row g-2">
                {[
                  {
                    icon: FiUsers,
                    label: "Manage Users",
                    path: "/admin/users",
                    color: "#192b37",
                  },
                  {
                    icon: FiLayers,
                    label: "Manage Products",
                    path: "/admin/products",
                    color: "#5899c4",
                  },
                  {
                    icon: FiSettings,
                    label: "Business Rules",
                    path: "/admin/rules",
                    color: "#ff5640",
                  },
                  {
                    icon: FiShield,
                    label: "Policy Control",
                    path: "/admin/policies",
                    color: "#2d9c5b",
                  },
                ].map((action) => (
                  <div key={action.path} className="col-md-6 col-xl-3">
                    <div
                      className="d-flex align-items-center gap-3 p-3"
                      style={{
                        borderRadius: 12,
                        cursor: "pointer",
                        transition: "all 0.2s",
                        border: "1px solid rgba(25,43,55,0.04)",
                      }}
                      onClick={() => navigate(action.path)}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background =
                          "rgba(88,153,196,0.04)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "transparent")
                      }
                    >
                      <div
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 12,
                          background: `${action.color}12`,
                          color: action.color,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <action.icon size={18} />
                      </div>
                      <span style={{ fontWeight: 600, fontSize: 14 }}>
                        {action.label}
                      </span>
                      <FiArrowRight
                        size={14}
                        style={{ marginLeft: "auto", opacity: 0.3 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function Dashboard() {
  const { user } = useAuth();

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <>
      <div className="mb-4">
        <h1>
          {greeting()}, {user?.name?.split(" ")[0]} 👋
        </h1>
        <p>Here's what's happening with your insurance today</p>
      </div>

      {user?.role === ROLES.CUSTOMER && <CustomerDashboardContent />}
      {user?.role === ROLES.UNDERWRITER && <UnderwriterDashboardContent />}
      {user?.role === ROLES.ADMIN && <AdminDashboardContent />}
    </>
  );
}
