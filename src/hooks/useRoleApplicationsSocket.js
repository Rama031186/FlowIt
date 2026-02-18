import { useEffect, useState, useRef } from "react";

// Random names pool for simulated incoming applications
const RANDOM_NAMES = [
  "Ava Williams",
  "Noah Brown",
  "Sophia Davis",
  "Ethan Miller",
  "Isabella Wilson",
  "Mason Taylor",
  "Mia Anderson",
  "Lucas Thomas",
  "Charlotte Jackson",
  "Aiden White",
  "Amelia Harris",
  "Logan Martin",
];

const ROLES = ["UNDERWRITER", "ADMIN"];

function generateFakeApplication() {
  const name = RANDOM_NAMES[Math.floor(Math.random() * RANDOM_NAMES.length)];
  const role = ROLES[Math.floor(Math.random() * ROLES.length)];
  const id = `RA${Date.now()}`;
  return {
    id,
    fullName: name,
    email: `${name.toLowerCase().replace(/\s/g, ".")}@email.com`,
    requestedRole: role,
    experienceYears: Math.floor(Math.random() * 10) + 1,
    submittedAt: new Date().toISOString(),
    status: "PENDING",
  };
}

/**
 * Custom hook that simulates WebSocket messages for role applications.
 *
 * In production, replace the setInterval logic with:
 *   const client = new Client({ brokerURL: '/ws', ... });
 *   client.subscribe('/topic/admin/role-applications', msg => { ... });
 *
 * @param {boolean} enabled - Whether the simulation is active
 * @param {number} intervalMs - How often to generate a new application (default 15s)
 * @returns {{ latestMessage: object|null }}
 */
export default function useRoleApplicationsSocket(
  enabled = true,
  intervalMs = 15000,
) {
  const [latestMessage, setLatestMessage] = useState(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!enabled) return;

    intervalRef.current = setInterval(() => {
      const app = generateFakeApplication();
      setLatestMessage(app);
    }, intervalMs);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [enabled, intervalMs]);

  return { latestMessage };
}
