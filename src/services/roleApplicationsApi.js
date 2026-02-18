import { ROLE_APPLICATIONS } from "../data/mockData";

// Simulated delay to mimic real API calls
const delay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));

// In-memory copy so mutations persist during the session
let applications = [...ROLE_APPLICATIONS];

/**
 * GET /api/admin/role-applications/pending
 * Returns all applications (mock returns all, not just pending, so the UI can show stats).
 */
export async function fetchPendingApplications() {
  await delay(800);
  // Return a fresh copy so React detects changes
  return applications.map((a) => ({ ...a }));
}

/**
 * PATCH /api/admin/role-applications/{id}/approve
 */
export async function approveApplication(id) {
  await delay(500);
  const app = applications.find((a) => a.id === id);
  if (!app) throw new Error("Application not found");
  app.status = "APPROVED";
  return { ...app };
}

/**
 * PATCH /api/admin/role-applications/{id}/reject
 */
export async function rejectApplication(id) {
  await delay(500);
  const app = applications.find((a) => a.id === id);
  if (!app) throw new Error("Application not found");
  app.status = "REJECTED";
  return { ...app };
}
