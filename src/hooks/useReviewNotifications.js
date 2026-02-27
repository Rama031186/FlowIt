import { useEffect, useState, useRef } from "react";

const PRODUCT_NAMES = [
  "EndaSure Health Protect Max",
  "EndaSure Critical Care",
  "EndaSure Family Floater Pro",
  "EndaSure Super Top-Up",
];

function generateFakeNotification() {
  const product =
    PRODUCT_NAMES[Math.floor(Math.random() * PRODUCT_NAMES.length)];
  return {
    id: `NOTIF-${Date.now()}`,
    type: "NEW_REVIEW_ASSIGNED",
    message: `New review assigned: ${product} v${Math.floor(Math.random() * 5) + 1}`,
    productName: product,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Simulates WebSocket notifications for underwriter review tasks.
 *
 * In production, replace the setInterval logic with:
 *   client.subscribe('/user/queue/notifications', msg => { ... });
 *
 * @param {boolean} enabled
 * @param {number} intervalMs - default 20s
 * @returns {{ latestNotification: object|null }}
 */
export default function useReviewNotifications(
  enabled = true,
  intervalMs = 20000,
) {
  const [latestNotification, setLatestNotification] = useState(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!enabled) return;

    intervalRef.current = setInterval(() => {
      setLatestNotification(generateFakeNotification());
    }, intervalMs);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [enabled, intervalMs]);

  return { latestNotification };
}
