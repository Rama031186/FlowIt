// ─── Admin Product API (Mock) ────────────────────────────────────────────────
// In production, replace with real axios calls.

const delay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));

let idCounter = 100;

/**
 * POST /api/admin/products
 * @param {{ productName: string, productCategory: string, isRopEnabled: boolean }} data
 * @returns {{ productId: string, productName: string, productCategory: string, isRopEnabled: boolean }}
 */
export async function createProduct(data) {
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
 * @param {string} productId
 * @param {{ modulesJson: object, rulesJson: object, effectiveFrom: string, effectiveTo: string }} data
 * @returns {{ productVersionId: string, versionNumber: number, versionStatus: string }}
 */
export async function createProductVersion(productId, data) {
  await delay(600);
  return {
    productVersionId: `PV-${++idCounter}`,
    versionNumber: 1,
    versionStatus: "DRAFT",
    productId,
    ...data,
  };
}
