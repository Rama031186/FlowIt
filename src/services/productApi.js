// ─── Application Service API ─────────────────────────────────────────────────
// Endpoints for Product Management, Product Versions, Underwriter Reviews,
// and Customer Product Browsing.
//
// To connect to real backend:
//   1. Uncomment the axios calls
//   2. Remove mock implementations
//   3. Configure API base URL via environment variable
//
// import axios from 'axios';
// const API = axios.create({ baseURL: '/api' });
// API.interceptors.request.use((cfg) => {
//   const token = localStorage.getItem('jwt_token');
//   if (token) cfg.headers.Authorization = `Bearer ${token}`;
//   return cfg;
// });

const delay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));
let idCounter = 100;

// ──────────────────────────────────────────────────────────────
// Admin Products  (ProductSummaryDto)
// ──────────────────────────────────────────────────────────────

/**
 * GET /api/admin/products
 * Returns: ProductSummaryDto[]
 */
export async function getAllProducts() {
  // const res = await API.get('/admin/products');
  // return res.data;
  await delay(400);
  return []; // mock — use PRODUCTS from mockData.js instead
}

/**
 * POST /api/admin/products
 * Payload: { productName, productCategory, isRopEnabled }
 * Returns: ProductSummaryDto
 */
export async function createProduct(data) {
  // const res = await API.post('/admin/products', data);
  // return res.data;
  await delay(800);
  return {
    productId: `PROD-${++idCounter}`,
    productName: data.productName,
    productCategory: data.productCategory,
    status: "ACTIVE",
    isRopEnabled: data.isRopEnabled,
    totalVersions: 0,
    activeVersionNumber: null,
    createdAt: new Date().toISOString(),
  };
}

/**
 * PUT /api/admin/products/{productId}
 * Payload: { productName?, productCategory?, isRopEnabled?, status? }
 * Returns: Product
 */
export async function updateProduct(productId, data) {
  // const res = await API.put(`/admin/products/${productId}`, data);
  // return res.data;
  await delay(600);
  return { productId, ...data };
}

/**
 * DELETE /api/admin/products/{productId}
 */
export async function archiveProduct(productId) {
  // await API.delete(`/admin/products/${productId}`);
  await delay(400);
}

// ──────────────────────────────────────────────────────────────
// Product Versions  (ProductVersionDetailsDto / ProductVersionSummaryDto)
// ──────────────────────────────────────────────────────────────

/**
 * GET /api/admin/products/{productId}/versions
 * Returns: ProductVersionSummaryDto[]
 */
export async function getVersionSummaries(productId) {
  // const res = await API.get(`/admin/products/${productId}/versions`);
  // return res.data;
  await delay(400);
  return [];
}

/**
 * GET /api/admin/products/{productId}/versions/{productVersionId}
 * Returns: ProductVersionDetailsDto
 */
export async function getProductVersionDetails(productVersionId) {
  // const res = await API.get(`/admin/products/_/versions/${productVersionId}`);
  // return res.data;
  await delay(400);
  return null;
}

/**
 * POST /api/admin/products/{productId}/versions
 * Payload (CreateProductVersionRequest):
 * {
 *   "modulesJson": { ... },          // JsonNode
 *   "rulesJson":   { ... },          // JsonNode
 *   "effectiveFrom": "2026-04-01",   // LocalDate (YYYY-MM-DD)
 *   "effectiveTo":   "2031-06-01"    // LocalDate (optional, nullable)
 * }
 * Returns: ProductVersionDetailsDto
 */
export async function createProductVersion(productId, data) {
  // const res = await API.post(`/admin/products/${productId}/versions`, data);
  // return res.data;
  await delay(600);
  return {
    productVersionId: `PV-${++idCounter}`,
    productId,
    versionNumber: 1,
    versionStatus: "DRAFT",
    isActive: false,
    modules: data.modulesJson,
    rules: data.rulesJson,
    createdBy: "current-user",
    createdAt: new Date().toISOString(),
    effectiveFrom: data.effectiveFrom,
    effectiveTo: data.effectiveTo || null,
  };
}

// ──────────────────────────────────────────────────────────────
// Underwriter Reviews  (ProductReviewTaskDto)
// ──────────────────────────────────────────────────────────────

/**
 * GET /api/underwriter/reviews
 * Returns: ProductReviewTaskDto[]
 */
export async function getMyReviews() {
  // const res = await API.get('/underwriter/reviews');
  // return res.data;
  await delay(400);
  return [];
}

/**
 * GET /api/underwriter/reviews/{versionId}
 * Returns: ProductVersionDetailsDto
 */
export async function getReviewDetails(versionId) {
  // const res = await API.get(`/underwriter/reviews/${versionId}`);
  // return res.data;
  await delay(400);
  return null;
}

/**
 * POST /api/underwriter/reviews/{reviewTaskId}/approve
 */
export async function approveReview(reviewTaskId) {
  // await API.post(`/underwriter/reviews/${reviewTaskId}/approve`);
  await delay(600);
}

/**
 * POST /api/underwriter/reviews/{reviewTaskId}/revision
 * Payload: { comments: string }
 */
export async function requestRevision(reviewTaskId, comments) {
  // await API.post(`/underwriter/reviews/${reviewTaskId}/revision`, { comments });
  await delay(600);
}

// ──────────────────────────────────────────────────────────────
// Customer Products  (CustomerProductDto)
// ──────────────────────────────────────────────────────────────

/**
 * GET /api/products
 * Returns: CustomerProductDto[]
 * { productId, productName, productCategory, isRopEnabled,
 *   activeVersionNumber, effectiveFrom, effectiveTo, modules, rules }
 */
export async function browseProducts() {
  // const res = await API.get('/products');
  // return res.data;
  await delay(400);
  return []; // mock — use PRODUCTS from mockData.js instead
}
