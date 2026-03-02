// ─── Admin Product API ───────────────────────────────────────────────────────
// Currently uses mock data. To connect to real backend, uncomment the axios
// calls and remove the mock implementations.
//
// import axios from 'axios';
// const API = axios.create({ baseURL: '/api/admin' });
// API.interceptors.request.use((cfg) => {
//   const token = localStorage.getItem('jwt_token');
//   if (token) cfg.headers.Authorization = `Bearer ${token}`;
//   return cfg;
// });

const delay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));

let idCounter = 100;

/**
 * POST /api/admin/products
 *
 * Payload: { productName, productCategory, isRopEnabled }
 * Response: { productId, productName, productCategory, isRopEnabled }
 */
export async function createProduct(data) {
  // ── Real API ──
  // const res = await API.post('/products', data);
  // return res.data;

  // ── Mock ──
  await delay(800);
  const productId = `PROD-${++idCounter}`;
  return {
    productId,
    productName: data.productName,
    productCategory: data.productCategory,
    isRopEnabled: data.isRopEnabled,
  };
}

/**
 * POST /api/admin/products/{productId}/versions
 *
 * Payload (matches CreateProductVersionRequest):
 * {
 *   "modulesJson": { ... },          // JsonNode — sent as-is
 *   "rulesJson":   { ... },          // JsonNode — sent as-is
 *   "effectiveFrom": "2026-04-01",   // LocalDate (YYYY-MM-DD)
 *   "effectiveTo":   "2031-06-01"    // LocalDate (optional, nullable)
 * }
 */
export async function createProductVersion(productId, data) {
  // ── Real API ──
  // const res = await API.post(`/products/${productId}/versions`, data);
  // return res.data;

  // ── Mock ──
  await delay(600);
  return {
    productVersionId: `PV-${++idCounter}`,
    versionNumber: 1,
    versionStatus: "DRAFT",
    productId,
    ...data,
  };
}
