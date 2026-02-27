import {
  FiHome,
  FiShoppingBag,
  FiFileText,
  FiUsers,
  FiHeart,
  FiShield,
  FiSettings,
  FiClipboard,
  FiActivity,
  FiUser,
  FiBell,
  FiLayers,
  FiBook,
  FiAlertCircle,
  FiUserCheck,
} from "react-icons/fi";
import { ROLES } from "../constants/roles";

const sidebarConfig = [
  {
    section: "Main",
    items: [
      {
        label: "Dashboard",
        icon: FiHome,
        path: "/admin-portal/dashboard",
        allowedRoles: [ROLES.UNDERWRITER, ROLES.ADMIN],
      },
    ],
  },
  {
    section: "Underwriting",
    items: [
      {
        label: "Applications",
        icon: FiClipboard,
        path: "/admin-portal/applications",
        allowedRoles: [ROLES.UNDERWRITER],
      },
      {
        label: "Risk Analysis",
        icon: FiActivity,
        path: "/admin-portal/risk-analysis",
        allowedRoles: [ROLES.UNDERWRITER],
      },
      {
        label: "Product Reviews",
        icon: FiFileText,
        path: "/admin-portal/product-reviews",
        allowedRoles: [ROLES.UNDERWRITER],
      },
    ],
  },
  {
    section: "Administration",
    items: [
      {
        label: "User Management",
        icon: FiUsers,
        path: "/admin-portal/users",
        allowedRoles: [ROLES.ADMIN],
      },
      {
        label: "Product Management",
        icon: FiLayers,
        path: "/admin-portal/products",
        allowedRoles: [ROLES.ADMIN],
      },
      {
        label: "Business Rules",
        icon: FiSettings,
        path: "/admin-portal/rules",
        allowedRoles: [ROLES.ADMIN],
      },
      {
        label: "Policy Control",
        icon: FiShield,
        path: "/admin-portal/policies",
        allowedRoles: [ROLES.ADMIN],
      },
      {
        label: "Audit Logs",
        icon: FiBook,
        path: "/admin-portal/audit",
        allowedRoles: [ROLES.ADMIN],
      },
      {
        label: "Role Applications",
        icon: FiUserCheck,
        path: "/admin-portal/role-applications",
        allowedRoles: [ROLES.ADMIN],
      },
    ],
  },
  {
    section: "Account",
    items: [
      {
        label: "My Profile",
        icon: FiUser,
        path: "/admin-portal/profile",
        allowedRoles: [ROLES.UNDERWRITER, ROLES.ADMIN],
      },
      {
        label: "Notifications",
        icon: FiBell,
        path: "/admin-portal/notifications",
        allowedRoles: [ROLES.UNDERWRITER, ROLES.ADMIN],
        badge: true,
      },
    ],
  },
];

export default sidebarConfig;
