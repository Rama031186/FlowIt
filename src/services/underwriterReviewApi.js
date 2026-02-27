// ─── Mock Review Tasks for Underwriter Dashboard ─────────────────────────────
// In production, replace with real axios calls to the backend API.

const delay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));

// Realistic mock data matching the backend response contract
const MOCK_REVIEW_TASKS = [
  {
    reviewTaskId: "RT-001",
    status: "OPEN",
    reviewedAt: null,
    assignedAt: "2026-02-25T09:30:00",
    productVersion: {
      productVersionId: "PV-101",
      versionNumber: 2,
      versionStatus: "DRAFT",
      modulesJson: {
        coverageType: "Individual",
        sumInsuredOptions: [300000, 500000, 1000000, 2000000],
        modules: [
          {
            name: "In-Patient Hospitalization",
            description:
              "Covers room rent, ICU, surgery, and nursing expenses during hospital stay",
            sumInsured: 500000,
            waitingPeriod: "30 days",
            copay: "10%",
          },
          {
            name: "Day Care Procedures",
            description:
              "Covers 540+ day care procedures that do not require 24-hour hospitalization",
            sumInsured: 500000,
            waitingPeriod: "30 days",
            copay: "0%",
          },
          {
            name: "Pre & Post Hospitalization",
            description:
              "Covers medical expenses 60 days before and 90 days after hospitalization",
            sumInsured: 500000,
            waitingPeriod: "30 days",
            copay: "0%",
          },
          {
            name: "Ambulance Cover",
            description:
              "Covers ambulance charges up to specified limit per hospitalization",
            sumInsured: 5000,
            waitingPeriod: "None",
            copay: "0%",
          },
        ],
      },
      rulesJson: {
        basePremiumTable: [
          { ageGroup: "18-25", sumInsured: 300000, premium: 4500 },
          { ageGroup: "18-25", sumInsured: 500000, premium: 6800 },
          { ageGroup: "26-35", sumInsured: 300000, premium: 5500 },
          { ageGroup: "26-35", sumInsured: 500000, premium: 8200 },
          { ageGroup: "36-45", sumInsured: 300000, premium: 7800 },
          { ageGroup: "36-45", sumInsured: 500000, premium: 11500 },
          { ageGroup: "46-55", sumInsured: 300000, premium: 12000 },
          { ageGroup: "46-55", sumInsured: 500000, premium: 17500 },
        ],
        ageLoadingTable: [
          { ageGroup: "18-25", loadingPercent: 0 },
          { ageGroup: "26-35", loadingPercent: 5 },
          { ageGroup: "36-45", loadingPercent: 15 },
          { ageGroup: "46-55", loadingPercent: 30 },
          { ageGroup: "56-65", loadingPercent: 50 },
        ],
        pedLoading: {
          hasPED: true,
          loadingPercent: 25,
          waitingPeriod: "48 months",
          conditions: ["Diabetes", "Hypertension", "Cardiac disorders"],
        },
        ropConfig: {
          enabled: true,
          returnPercent: 50,
          eligibleAfterYears: 5,
          noClaimRequired: true,
        },
      },
      product: { productName: "EndaSure Health Protect Plus" },
    },
  },
  {
    reviewTaskId: "RT-002",
    status: "OPEN",
    reviewedAt: null,
    assignedAt: "2026-02-24T14:15:00",
    productVersion: {
      productVersionId: "PV-102",
      versionNumber: 1,
      versionStatus: "DRAFT",
      modulesJson: {
        coverageType: "Family Floater",
        sumInsuredOptions: [500000, 1000000, 1500000],
        modules: [
          {
            name: "In-Patient Hospitalization",
            description:
              "Shared coverage for all family members during hospitalization",
            sumInsured: 1000000,
            waitingPeriod: "30 days",
            copay: "5%",
          },
          {
            name: "Maternity Benefit",
            description: "Covers normal and C-section delivery expenses",
            sumInsured: 75000,
            waitingPeriod: "9 months",
            copay: "0%",
          },
          {
            name: "New Born Cover",
            description: "Covers new born baby from day 1 for 90 days",
            sumInsured: 50000,
            waitingPeriod: "None",
            copay: "0%",
          },
        ],
      },
      rulesJson: {
        basePremiumTable: [
          { ageGroup: "18-25", sumInsured: 500000, premium: 8500 },
          { ageGroup: "26-35", sumInsured: 500000, premium: 10200 },
          { ageGroup: "36-45", sumInsured: 500000, premium: 14500 },
          { ageGroup: "26-35", sumInsured: 1000000, premium: 16800 },
          { ageGroup: "36-45", sumInsured: 1000000, premium: 22000 },
        ],
        ageLoadingTable: [
          { ageGroup: "18-25", loadingPercent: 0 },
          { ageGroup: "26-35", loadingPercent: 5 },
          { ageGroup: "36-45", loadingPercent: 20 },
          { ageGroup: "46-55", loadingPercent: 35 },
        ],
        pedLoading: {
          hasPED: true,
          loadingPercent: 30,
          waitingPeriod: "36 months",
          conditions: ["Asthma", "Thyroid disorders"],
        },
        ropConfig: { enabled: false },
      },
      product: { productName: "EndaSure Family Shield" },
    },
  },
  {
    reviewTaskId: "RT-003",
    status: "APPROVED",
    reviewedAt: "2026-02-22T11:00:00",
    assignedAt: "2026-02-20T08:45:00",
    productVersion: {
      productVersionId: "PV-100",
      versionNumber: 1,
      versionStatus: "ACTIVE",
      modulesJson: {
        coverageType: "Individual",
        sumInsuredOptions: [200000, 500000],
        modules: [
          {
            name: "In-Patient Hospitalization",
            description: "Standard hospitalization cover",
            sumInsured: 500000,
            waitingPeriod: "30 days",
            copay: "15%",
          },
          {
            name: "Critical Illness",
            description:
              "Lump-sum payout on diagnosis of 36 critical illnesses",
            sumInsured: 500000,
            waitingPeriod: "90 days",
            copay: "0%",
          },
        ],
      },
      rulesJson: {
        basePremiumTable: [
          { ageGroup: "18-25", sumInsured: 200000, premium: 3200 },
          { ageGroup: "26-35", sumInsured: 200000, premium: 4500 },
          { ageGroup: "36-45", sumInsured: 500000, premium: 9800 },
        ],
        ageLoadingTable: [
          { ageGroup: "18-25", loadingPercent: 0 },
          { ageGroup: "26-35", loadingPercent: 5 },
          { ageGroup: "36-45", loadingPercent: 15 },
        ],
        pedLoading: { hasPED: false },
        ropConfig: {
          enabled: true,
          returnPercent: 100,
          eligibleAfterYears: 7,
          noClaimRequired: true,
        },
      },
      product: { productName: "EndaSure Basic Health" },
    },
  },
  {
    reviewTaskId: "RT-004",
    status: "REVISION_REQUESTED",
    reviewedAt: "2026-02-23T16:30:00",
    assignedAt: "2026-02-21T10:00:00",
    revisionComments:
      "Waiting period logic incorrect for maternity module. Also, PED loading should not apply to members under 18.",
    productVersion: {
      productVersionId: "PV-103",
      versionNumber: 3,
      versionStatus: "DRAFT",
      modulesJson: {
        coverageType: "Senior Citizen",
        sumInsuredOptions: [300000, 500000],
        modules: [
          {
            name: "In-Patient Hospitalization",
            description: "Enhanced room rent for senior citizens",
            sumInsured: 500000,
            waitingPeriod: "30 days",
            copay: "20%",
          },
          {
            name: "Domiciliary Treatment",
            description:
              "Covers treatment at home when hospitalization is not possible",
            sumInsured: 100000,
            waitingPeriod: "60 days",
            copay: "0%",
          },
          {
            name: "AYUSH Treatment",
            description:
              "Covers Ayurveda, Yoga, Unani, Siddha, Homeopathy treatments",
            sumInsured: 50000,
            waitingPeriod: "30 days",
            copay: "0%",
          },
        ],
      },
      rulesJson: {
        basePremiumTable: [
          { ageGroup: "56-65", sumInsured: 300000, premium: 18000 },
          { ageGroup: "56-65", sumInsured: 500000, premium: 26000 },
          { ageGroup: "66-75", sumInsured: 300000, premium: 28000 },
          { ageGroup: "66-75", sumInsured: 500000, premium: 38000 },
        ],
        ageLoadingTable: [
          { ageGroup: "56-65", loadingPercent: 50 },
          { ageGroup: "66-75", loadingPercent: 75 },
          { ageGroup: "76-80", loadingPercent: 100 },
        ],
        pedLoading: {
          hasPED: true,
          loadingPercent: 40,
          waitingPeriod: "24 months",
          conditions: ["Diabetes", "Hypertension", "Arthritis", "COPD"],
        },
        ropConfig: { enabled: false },
      },
      product: { productName: "EndaSure Senior Care" },
    },
  },
];

// In-memory copy for session mutation
let reviewTasks = MOCK_REVIEW_TASKS.map((t) => ({ ...t }));

/**
 * GET /api/underwriter/reviews
 */
export async function fetchReviewTasks() {
  await delay(800);
  return reviewTasks.map((t) => ({ ...t }));
}

/**
 * POST /api/underwriter/reviews/{reviewTaskId}/approve
 */
export async function approveReview(reviewTaskId) {
  await delay(600);
  const task = reviewTasks.find((t) => t.reviewTaskId === reviewTaskId);
  if (!task) throw new Error("Review task not found");
  if (task.status !== "OPEN")
    throw new Error("Only OPEN tasks can be approved");
  task.status = "APPROVED";
  task.reviewedAt = new Date().toISOString();
  task.productVersion.versionStatus = "ACTIVE";
  return { ...task };
}

/**
 * POST /api/underwriter/reviews/{reviewTaskId}/revision
 */
export async function requestRevision(reviewTaskId, comments) {
  await delay(600);
  const task = reviewTasks.find((t) => t.reviewTaskId === reviewTaskId);
  if (!task) throw new Error("Review task not found");
  if (task.status !== "OPEN")
    throw new Error("Only OPEN tasks can have revision requested");
  task.status = "REVISION_REQUESTED";
  task.reviewedAt = new Date().toISOString();
  task.revisionComments = comments;
  return { ...task };
}
