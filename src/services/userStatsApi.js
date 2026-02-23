import { ALL_USERS } from "../data/mockData";

// Simulated delay to mimic real API calls
const delay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * GET /api/admin/users/stats
 * Returns user statistics matching the backend UserStatsResponse DTO.
 * Currently uses mock data; swap the body for a real axios call when the backend is ready.
 */
export async function fetchUserStats() {
  await delay(600);

  // Build stats from mock data (mirrors UserStatsResponse DTO)
  const totalUsers = ALL_USERS.length;
  const activeUsers = ALL_USERS.filter((u) => u.status === "Active").length;
  const inactiveUsers = ALL_USERS.filter((u) => u.status === "Inactive").length;
  const suspendedUsers = ALL_USERS.filter(
    (u) => u.status === "Suspended",
  ).length;
  const adminCount = ALL_USERS.filter((u) => u.role === "ADMIN").length;
  const customerCount = ALL_USERS.filter((u) => u.role === "CUSTOMER").length;

  // Simulated "new this month" count
  const newUsersThisMonth = 3;

  return {
    totalUsers,
    activeUsers,
    inactiveUsers,
    suspendedUsers,
    newUsersThisMonth,
    adminCount,
    customerCount,
  };
}
