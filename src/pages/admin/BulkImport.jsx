import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import {
  FiDownload,
  FiUploadCloud,
  FiCheck,
  FiX,
  FiArrowLeft,
  FiArrowRight,
  FiAlertCircle,
  FiFileText,
  FiLoader,
  FiCheckCircle,
  FiXCircle,
  FiPackage,
} from "react-icons/fi";
import { createProduct, createProductVersion } from "../../services/productApi";

// ─── Constants ───────────────────────────────────────────────
const VALID_CATEGORIES = [
  "INDIVIDUAL",
  "FAMILY_POOL",
  "SENIOR_CITIZEN",
  "CRITICAL_ILLNESS",
];
const STEPS = ["Upload Template", "Preview & Validate", "Import"];

// ─── Excel Template Generator ────────────────────────────────
function generateTemplate() {
  const wb = XLSX.utils.book_new();

  // 1. Products sheet
  const productsData = [
    [
      "productName*",
      "category*",
      "ropEnabled (Y/N)",
      "coverageType",
      "minAge*",
      "maxAge*",
      "sumInsuredOptions* (comma-sep)",
      "effectiveFrom* (YYYY-MM-DD)",
      "effectiveTo (YYYY-MM-DD)",
    ],
    [
      "EndaSure Health Protect Plus",
      "INDIVIDUAL",
      "Y",
      "INDIVIDUAL",
      18,
      65,
      "300000,500000,1000000",
      "2026-04-01",
      "2030-12-31",
    ],
    [
      "EndaSure Senior Care Secure",
      "SENIOR_CITIZEN",
      "N",
      "INDIVIDUAL",
      60,
      80,
      "300000,500000,1000000",
      "2026-05-01",
      "2030-05-01",
    ],
  ];
  const wsProducts = XLSX.utils.aoa_to_sheet(productsData);
  wsProducts["!cols"] = [
    { wch: 30 },
    { wch: 18 },
    { wch: 15 },
    { wch: 15 },
    { wch: 8 },
    { wch: 8 },
    { wch: 30 },
    { wch: 22 },
    { wch: 22 },
  ];
  XLSX.utils.book_append_sheet(wb, wsProducts, "Products");

  // 2. Modules sheet
  const modulesData = [
    [
      "productName*",
      "moduleCode*",
      "moduleName*",
      "mandatory (Y/N)",
      "waitingPeriodMonths",
    ],
    [
      "EndaSure Health Protect Plus",
      "HOSPITALIZATION",
      "Hospitalization Cover",
      "Y",
      0,
    ],
    ["EndaSure Health Protect Plus", "DAY_CARE", "Day Care Procedures", "Y", 0],
    ["EndaSure Health Protect Plus", "AMBULANCE", "Ambulance Cover", "N", 0],
    [
      "EndaSure Senior Care Secure",
      "HOSPITALIZATION",
      "Hospitalization Cover",
      "Y",
      0,
    ],
    [
      "EndaSure Senior Care Secure",
      "PRE_EXISTING_DISEASE",
      "Pre-Existing Disease Cover",
      "Y",
      24,
    ],
  ];
  const wsModules = XLSX.utils.aoa_to_sheet(modulesData);
  wsModules["!cols"] = [
    { wch: 30 },
    { wch: 22 },
    { wch: 28 },
    { wch: 15 },
    { wch: 20 },
  ];
  XLSX.utils.book_append_sheet(wb, wsModules, "Modules");

  // 3. Base Premium sheet
  const premiumData = [
    ["productName*", "sumInsured*", "premiumAmount*"],
    ["EndaSure Health Protect Plus", 300000, 4500],
    ["EndaSure Health Protect Plus", 500000, 6800],
    ["EndaSure Health Protect Plus", 1000000, 11500],
    ["EndaSure Senior Care Secure", 300000, 12000],
    ["EndaSure Senior Care Secure", 500000, 18000],
    ["EndaSure Senior Care Secure", 1000000, 28000],
  ];
  const wsPremium = XLSX.utils.aoa_to_sheet(premiumData);
  wsPremium["!cols"] = [{ wch: 30 }, { wch: 15 }, { wch: 15 }];
  XLSX.utils.book_append_sheet(wb, wsPremium, "Base Premium");

  // 4. Age Loading sheet
  const ageData = [
    ["productName*", "minAge*", "maxAge*", "loadingPercent*"],
    ["EndaSure Health Protect Plus", 18, 25, 0],
    ["EndaSure Health Protect Plus", 26, 35, 5],
    ["EndaSure Health Protect Plus", 36, 45, 15],
    ["EndaSure Senior Care Secure", 60, 65, 10],
    ["EndaSure Senior Care Secure", 66, 70, 20],
    ["EndaSure Senior Care Secure", 71, 80, 35],
  ];
  const wsAge = XLSX.utils.aoa_to_sheet(ageData);
  wsAge["!cols"] = [{ wch: 30 }, { wch: 10 }, { wch: 10 }, { wch: 15 }];
  XLSX.utils.book_append_sheet(wb, wsAge, "Age Loading");

  // 5. General Rules sheet
  const rulesData = [
    [
      "productName*",
      "pedLoadingPercent",
      "coPaymentPercent",
      "ropEnabled (Y/N)",
    ],
    ["EndaSure Health Protect Plus", 25, 10, "Y"],
    ["EndaSure Senior Care Secure", 30, 20, "N"],
  ];
  const wsRules = XLSX.utils.aoa_to_sheet(rulesData);
  wsRules["!cols"] = [{ wch: 30 }, { wch: 18 }, { wch: 18 }, { wch: 15 }];
  XLSX.utils.book_append_sheet(wb, wsRules, "General Rules");

  XLSX.writeFile(wb, "EndaSure_Product_Import_Template.xlsx");
}

// ─── Excel Parser ────────────────────────────────────────────
function parseExcel(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const wb = XLSX.read(e.target.result, { type: "array" });

        const getSheet = (name) => {
          const ws = wb.Sheets[name];
          if (!ws) return [];
          return XLSX.utils.sheet_to_json(ws, { defval: "" });
        };

        const products = getSheet("Products");
        const modules = getSheet("Modules");
        const basePremium = getSheet("Base Premium");
        const ageLoading = getSheet("Age Loading");
        const generalRules = getSheet("General Rules");

        resolve({ products, modules, basePremium, ageLoading, generalRules });
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsArrayBuffer(file);
  });
}

// ─── Header Key Normaliser ──────────────────────────────────
// Excel headers have asterisks and descriptions — strip them
function h(row, key) {
  const keys = Object.keys(row);
  const match = keys.find((k) => k.toLowerCase().startsWith(key.toLowerCase()));
  return match ? row[match] : undefined;
}

// ─── Assemble Products ──────────────────────────────────────
function assembleProducts(data) {
  const { products, modules, basePremium, ageLoading, generalRules } = data;

  return products.map((pRow) => {
    const name = h(pRow, "productName") || "";
    const errors = [];

    // Product fields
    const category = (h(pRow, "category") || "").toUpperCase().trim();
    const ropEnabled =
      (h(pRow, "ropEnabled") || "").toString().toUpperCase() === "Y";
    const coverageType = (h(pRow, "coverageType") || category)
      .toUpperCase()
      .trim();
    const minAge = Number(h(pRow, "minAge")) || 0;
    const maxAge = Number(h(pRow, "maxAge")) || 0;
    const siRaw = (h(pRow, "sumInsuredOptions") || "").toString();
    const sumInsuredOptions = siRaw
      .split(",")
      .map((s) => Number(s.trim()))
      .filter((n) => n > 0);
    const effectiveFrom = (h(pRow, "effectiveFrom") || "").toString().trim();
    const effectiveTo =
      (h(pRow, "effectiveTo") || "").toString().trim() || null;

    // Validation
    if (!name) errors.push("Product name is required");
    if (!VALID_CATEGORIES.includes(category))
      errors.push(`Invalid category: "${category}"`);
    if (minAge <= 0 || maxAge <= 0) errors.push("Age range is required");
    if (minAge >= maxAge) errors.push("minAge must be less than maxAge");
    if (sumInsuredOptions.length === 0)
      errors.push("At least one sum insured option required");
    if (!effectiveFrom) errors.push("effectiveFrom is required");

    // Modules for this product
    const productModules = modules
      .filter((m) => (h(m, "productName") || "") === name)
      .map((m) => ({
        code: (h(m, "moduleCode") || "").toUpperCase().trim(),
        name: h(m, "moduleName") || "",
        mandatory: (h(m, "mandatory") || "").toString().toUpperCase() === "Y",
        waitingPeriodMonths: Number(h(m, "waitingPeriodMonths")) || 0,
      }));

    if (productModules.length === 0)
      errors.push("At least one module is required");

    // Base premiums
    const premiumRows = basePremium.filter(
      (r) => (h(r, "productName") || "") === name,
    );
    const basePremiumBySumInsured = {};
    premiumRows.forEach((r) => {
      const si = Number(h(r, "sumInsured"));
      const amt = Number(h(r, "premiumAmount"));
      if (si > 0 && amt > 0) basePremiumBySumInsured[String(si)] = amt;
    });

    if (Object.keys(basePremiumBySumInsured).length === 0)
      errors.push("At least one base premium row is required");

    // Age loading
    const ageRows = ageLoading.filter(
      (r) => (h(r, "productName") || "") === name,
    );
    const ageLoadingArr = ageRows.map((r) => ({
      minAge: Number(h(r, "minAge")) || 0,
      maxAge: Number(h(r, "maxAge")) || 0,
      loadingPercent: Number(h(r, "loadingPercent")) || 0,
    }));

    // General rules
    const rulesRow = generalRules.find(
      (r) => (h(r, "productName") || "") === name,
    );
    const pedLoadingPercent = rulesRow
      ? Number(h(rulesRow, "pedLoadingPercent")) || 0
      : 0;
    const coPaymentPercent = rulesRow
      ? Number(h(rulesRow, "coPaymentPercent")) || 0
      : 0;
    const ropRule = rulesRow
      ? (h(rulesRow, "ropEnabled") || "").toString().toUpperCase() === "Y"
      : ropEnabled;

    return {
      productName: name,
      productCategory: category,
      isRopEnabled: ropEnabled,
      modulesJson: {
        coverageType,
        eligibleAgeRange: { minAge, maxAge },
        sumInsuredOptions,
        modules: productModules,
      },
      rulesJson: {
        basePremiumBySumInsured,
        ageLoading: ageLoadingArr,
        pedLoadingPercent,
        coPaymentPercent,
        rop: { enabled: ropRule },
      },
      effectiveFrom,
      effectiveTo,
      errors,
      isValid: errors.length === 0,
    };
  });
}

// ═════════════════════════════════════════════════════════════
// Component
// ═════════════════════════════════════════════════════════════
export default function BulkImport() {
  const navigate = useNavigate();
  const fileRef = useRef(null);

  const [step, setStep] = useState(0);
  const [fileName, setFileName] = useState("");
  const [parsedProducts, setParsedProducts] = useState([]);
  const [expandedRow, setExpandedRow] = useState(null);
  const [importing, setImporting] = useState(false);
  const [importResults, setImportResults] = useState([]);
  const [dragOver, setDragOver] = useState(false);

  // ── File handling ──
  const handleFile = useCallback(async (file) => {
    if (!file) return;
    if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
      alert("Please upload an Excel file (.xlsx or .xls)");
      return;
    }
    setFileName(file.name);
    try {
      const data = await parseExcel(file);
      const assembled = assembleProducts(data);
      setParsedProducts(assembled);
      setStep(1);
    } catch (err) {
      alert("Failed to parse Excel file: " + err.message);
    }
  }, []);

  const onDrop = useCallback(
    (e) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer?.files?.[0];
      handleFile(file);
    },
    [handleFile],
  );

  // ── Import ──
  const handleImport = async () => {
    setImporting(true);
    setStep(2);
    const results = [];

    for (let i = 0; i < parsedProducts.length; i++) {
      const p = parsedProducts[i];
      if (!p.isValid) {
        results.push({
          name: p.productName,
          status: "skipped",
          error: "Validation errors",
        });
        setImportResults([...results]);
        continue;
      }

      results.push({ name: p.productName, status: "importing" });
      setImportResults([...results]);

      try {
        // Step 1: Create product
        const product = await createProduct({
          productName: p.productName,
          productCategory: p.productCategory,
          isRopEnabled: p.isRopEnabled,
        });

        // Step 2: Create version
        await createProductVersion(product.productId, {
          modulesJson: p.modulesJson,
          rulesJson: p.rulesJson,
          effectiveFrom: p.effectiveFrom,
          effectiveTo: p.effectiveTo,
        });

        results[i] = { name: p.productName, status: "success" };
        setImportResults([...results]);
      } catch (err) {
        results[i] = {
          name: p.productName,
          status: "failed",
          error: err.message || "Unknown error",
        };
        setImportResults([...results]);
      }
    }
    setImporting(false);
  };

  const validCount = parsedProducts.filter((p) => p.isValid).length;
  const errorCount = parsedProducts.length - validCount;
  const successCount = importResults.filter(
    (r) => r.status === "success",
  ).length;
  const failedCount = importResults.filter(
    (r) => r.status === "failed" || r.status === "skipped",
  ).length;

  return (
    <>
      {/* Header */}
      <div className="d-flex align-items-center gap-3 mb-4">
        <button
          className="btn btn-outline-secondary d-flex align-items-center gap-1"
          style={{ fontSize: 13, padding: "8px 16px" }}
          onClick={() => navigate("/admin-portal/products")}
        >
          <FiArrowLeft size={14} /> Back
        </button>
        <div>
          <h1 className="mb-0" style={{ fontSize: 24, fontWeight: 800 }}>
            Bulk Import Products
          </h1>
          <p className="mb-0" style={{ fontSize: 13, opacity: 0.5 }}>
            Upload an Excel template to create multiple products at once
          </p>
        </div>
      </div>

      {/* Stepper */}
      <div className="d-flex align-items-center gap-2 mb-4">
        {STEPS.map((label, i) => (
          <div key={label} className="d-flex align-items-center gap-2">
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 13,
                fontWeight: 700,
                background: i <= step ? "#192b37" : "rgba(25,43,55,0.08)",
                color: i <= step ? "white" : "rgba(25,43,55,0.4)",
                transition: "all 0.3s",
              }}
            >
              {i < step ? <FiCheck size={14} /> : i + 1}
            </div>
            <span
              style={{
                fontSize: 13,
                fontWeight: i === step ? 700 : 400,
                opacity: i === step ? 1 : 0.5,
              }}
            >
              {label}
            </span>
            {i < STEPS.length - 1 && (
              <div
                style={{
                  width: 40,
                  height: 2,
                  background: i < step ? "#192b37" : "rgba(25,43,55,0.08)",
                  margin: "0 4px",
                }}
              />
            )}
          </div>
        ))}
      </div>

      {/* ── STEP 0: Upload ── */}
      {step === 0 && (
        <div className="row g-4">
          <div className="col-lg-8">
            <div
              className="card border-0"
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={onDrop}
              style={{
                border: dragOver
                  ? "2px dashed #192b37"
                  : "2px dashed rgba(25,43,55,0.1)",
                borderRadius: 16,
                transition: "all 0.2s",
                background: dragOver ? "rgba(25,43,55,0.02)" : "transparent",
              }}
            >
              <div
                className="card-body d-flex flex-column align-items-center justify-content-center"
                style={{ minHeight: 300 }}
              >
                <div
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: "50%",
                    background: "rgba(25,43,55,0.04)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 20,
                  }}
                >
                  <FiUploadCloud size={32} style={{ opacity: 0.4 }} />
                </div>
                <div
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    marginBottom: 8,
                  }}
                >
                  Drop your Excel file here
                </div>
                <div
                  style={{
                    fontSize: 13,
                    opacity: 0.5,
                    marginBottom: 20,
                  }}
                >
                  or click to browse — .xlsx files only
                </div>
                <input
                  ref={fileRef}
                  type="file"
                  accept=".xlsx,.xls"
                  style={{ display: "none" }}
                  onChange={(e) => handleFile(e.target.files?.[0])}
                />
                <button
                  className="btn btn-warning d-flex align-items-center gap-2"
                  onClick={() => fileRef.current?.click()}
                >
                  <FiUploadCloud size={14} /> Choose File
                </button>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card border-0">
              <div className="card-header">
                <h5>
                  <FiFileText size={16} /> Template
                </h5>
              </div>
              <div className="card-body">
                <p style={{ fontSize: 13, lineHeight: 1.7, opacity: 0.7 }}>
                  Download the Excel template, fill in your product data across
                  5 sheets, then upload it here.
                </p>
                <div style={{ fontSize: 12, marginBottom: 12 }}>
                  <strong>Sheets:</strong>
                </div>
                {[
                  "Products — product basics, age range, sum insured",
                  "Modules — module codes, mandatory flags, waiting periods",
                  "Base Premium — premium amount per sum insured tier",
                  "Age Loading — loading % per age bracket",
                  "General Rules — PED loading, co-payment, ROP",
                ].map((s) => (
                  <div
                    key={s}
                    className="d-flex align-items-start gap-2 mb-2"
                    style={{ fontSize: 12 }}
                  >
                    <FiCheck
                      size={12}
                      style={{
                        color: "#2d9c5b",
                        marginTop: 2,
                        flexShrink: 0,
                      }}
                    />
                    <span>{s}</span>
                  </div>
                ))}
                <button
                  className="btn btn-outline-secondary w-100 mt-3 d-flex align-items-center justify-content-center gap-2"
                  style={{ fontSize: 13 }}
                  onClick={generateTemplate}
                >
                  <FiDownload size={14} /> Download Template
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── STEP 1: Preview ── */}
      {step === 1 && (
        <>
          {/* Summary bar */}
          <div className="d-flex align-items-center gap-3 mb-3">
            <span
              style={{
                fontSize: 13,
                padding: "6px 14px",
                borderRadius: 8,
                background: "rgba(25,43,55,0.04)",
                fontWeight: 600,
              }}
            >
              <FiFileText size={12} /> {fileName}
            </span>
            <span style={{ fontSize: 13 }}>
              <strong>{parsedProducts.length}</strong> products found
            </span>
            {validCount > 0 && (
              <span
                style={{
                  fontSize: 12,
                  color: "#2d9c5b",
                  fontWeight: 600,
                }}
              >
                ✓ {validCount} valid
              </span>
            )}
            {errorCount > 0 && (
              <span
                style={{
                  fontSize: 12,
                  color: "#ff5640",
                  fontWeight: 600,
                }}
              >
                ✗ {errorCount} with errors
              </span>
            )}
          </div>

          {/* Product table */}
          <div className="card border-0 mb-4">
            <div className="card-body p-0">
              <table className="table mb-0" style={{ fontSize: 13 }}>
                <thead>
                  <tr
                    style={{
                      background: "rgba(25,43,55,0.02)",
                      fontSize: 11,
                      textTransform: "uppercase",
                      letterSpacing: 0.5,
                    }}
                  >
                    <th style={{ width: 40 }}></th>
                    <th>Product Name</th>
                    <th>Category</th>
                    <th>ROP</th>
                    <th>Modules</th>
                    <th>Sum Insured</th>
                    <th>Effective From</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {parsedProducts.map((p, i) => (
                    <>
                      <tr
                        key={i}
                        onClick={() =>
                          setExpandedRow(expandedRow === i ? null : i)
                        }
                        style={{
                          cursor: "pointer",
                          background: !p.isValid
                            ? "rgba(255,86,64,0.03)"
                            : "transparent",
                        }}
                      >
                        <td>
                          <FiPackage size={14} style={{ opacity: 0.3 }} />
                        </td>
                        <td style={{ fontWeight: 600 }}>
                          {p.productName || "(empty)"}
                        </td>
                        <td>
                          <span
                            style={{
                              fontSize: 10,
                              padding: "2px 8px",
                              borderRadius: 4,
                              background: "rgba(25,43,55,0.04)",
                              fontWeight: 600,
                            }}
                          >
                            {p.productCategory}
                          </span>
                        </td>
                        <td>{p.isRopEnabled ? "Yes" : "No"}</td>
                        <td>{p.modulesJson.modules.length}</td>
                        <td>
                          {p.modulesJson.sumInsuredOptions
                            .map((si) => `₹${(si / 100000).toFixed(0)}L`)
                            .join(", ")}
                        </td>
                        <td>{p.effectiveFrom}</td>
                        <td>
                          {p.isValid ? (
                            <span
                              className="d-flex align-items-center gap-1"
                              style={{
                                color: "#2d9c5b",
                                fontWeight: 600,
                                fontSize: 12,
                              }}
                            >
                              <FiCheckCircle size={12} /> Valid
                            </span>
                          ) : (
                            <span
                              className="d-flex align-items-center gap-1"
                              style={{
                                color: "#ff5640",
                                fontWeight: 600,
                                fontSize: 12,
                              }}
                            >
                              <FiXCircle size={12} /> {p.errors.length} error
                              {p.errors.length > 1 ? "s" : ""}
                            </span>
                          )}
                        </td>
                      </tr>
                      {expandedRow === i && (
                        <tr key={`detail-${i}`}>
                          <td colSpan={8} style={{ padding: 0 }}>
                            <div
                              style={{
                                padding: "16px 24px",
                                background: "rgba(25,43,55,0.015)",
                              }}
                            >
                              {/* Errors */}
                              {p.errors.length > 0 && (
                                <div className="mb-3">
                                  {p.errors.map((err, ei) => (
                                    <div
                                      key={ei}
                                      className="d-flex align-items-center gap-2 mb-1"
                                      style={{
                                        fontSize: 12,
                                        color: "#ff5640",
                                      }}
                                    >
                                      <FiAlertCircle size={12} /> {err}
                                    </div>
                                  ))}
                                </div>
                              )}

                              <div className="row g-3">
                                {/* Modules */}
                                <div className="col-md-6">
                                  <div
                                    style={{
                                      fontSize: 11,
                                      fontWeight: 700,
                                      textTransform: "uppercase",
                                      letterSpacing: 0.5,
                                      opacity: 0.5,
                                      marginBottom: 8,
                                    }}
                                  >
                                    Modules ({p.modulesJson.modules.length})
                                  </div>
                                  {p.modulesJson.modules.map((m, mi) => (
                                    <div
                                      key={mi}
                                      className="d-flex align-items-center gap-2 mb-1"
                                      style={{ fontSize: 12 }}
                                    >
                                      <FiCheck
                                        size={10}
                                        style={{ color: "#2d9c5b" }}
                                      />
                                      <span>{m.name}</span>
                                      {m.mandatory && (
                                        <span
                                          style={{
                                            fontSize: 9,
                                            opacity: 0.4,
                                          }}
                                        >
                                          (Required)
                                        </span>
                                      )}
                                      {m.waitingPeriodMonths > 0 && (
                                        <span
                                          style={{
                                            fontSize: 9,
                                            opacity: 0.4,
                                          }}
                                        >
                                          {m.waitingPeriodMonths}mo wait
                                        </span>
                                      )}
                                    </div>
                                  ))}
                                </div>

                                {/* Pricing */}
                                <div className="col-md-6">
                                  <div
                                    style={{
                                      fontSize: 11,
                                      fontWeight: 700,
                                      textTransform: "uppercase",
                                      letterSpacing: 0.5,
                                      opacity: 0.5,
                                      marginBottom: 8,
                                    }}
                                  >
                                    Base Premiums
                                  </div>
                                  {Object.entries(
                                    p.rulesJson.basePremiumBySumInsured,
                                  ).map(([si, premium]) => (
                                    <div
                                      key={si}
                                      className="d-flex justify-content-between mb-1"
                                      style={{ fontSize: 12 }}
                                    >
                                      <span>
                                        ₹{(Number(si) / 100000).toFixed(0)}L
                                      </span>
                                      <span style={{ fontWeight: 600 }}>
                                        ₹{Number(premium).toLocaleString()}
                                        /yr
                                      </span>
                                    </div>
                                  ))}
                                  <div
                                    className="mt-2"
                                    style={{ fontSize: 11, opacity: 0.5 }}
                                  >
                                    PED: {p.rulesJson.pedLoadingPercent}% •
                                    Co-pay: {p.rulesJson.coPaymentPercent}% •
                                    ROP:{" "}
                                    {p.rulesJson.rop.enabled ? "Yes" : "No"}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Actions */}
          <div className="d-flex gap-3">
            <button
              className="btn btn-outline-secondary d-flex align-items-center gap-2"
              onClick={() => {
                setStep(0);
                setParsedProducts([]);
                setFileName("");
              }}
            >
              <FiArrowLeft size={14} /> Re-upload
            </button>
            <button
              className="btn btn-warning d-flex align-items-center gap-2"
              onClick={handleImport}
              disabled={validCount === 0}
            >
              Import {validCount} Product{validCount !== 1 ? "s" : ""} as Draft{" "}
              <FiArrowRight size={14} />
            </button>
            {errorCount > 0 && (
              <div
                className="d-flex align-items-center gap-2"
                style={{ fontSize: 12, color: "#ff5640" }}
              >
                <FiAlertCircle size={14} /> {errorCount} product
                {errorCount > 1 ? "s" : ""} will be skipped
              </div>
            )}
          </div>
        </>
      )}

      {/* ── STEP 2: Import Progress ── */}
      {step === 2 && (
        <>
          <div className="card border-0 mb-4">
            <div className="card-header">
              <h5>
                {importing ? (
                  <>
                    <FiLoader
                      size={16}
                      style={{ animation: "spin 1s linear infinite" }}
                    />{" "}
                    Importing…
                  </>
                ) : (
                  <>
                    <FiCheckCircle size={16} style={{ color: "#2d9c5b" }} />{" "}
                    Import Complete
                  </>
                )}
              </h5>
            </div>
            <div className="card-body">
              {/* Progress bar */}
              <div
                style={{
                  width: "100%",
                  height: 8,
                  borderRadius: 4,
                  background: "rgba(25,43,55,0.06)",
                  marginBottom: 20,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${(importResults.length / parsedProducts.length) * 100}%`,
                    height: "100%",
                    borderRadius: 4,
                    background: "#192b37",
                    transition: "width 0.3s",
                  }}
                />
              </div>

              {/* Result rows */}
              {importResults.map((r, i) => (
                <div
                  key={i}
                  className="d-flex align-items-center gap-3 mb-2"
                  style={{
                    padding: "10px 16px",
                    borderRadius: 10,
                    background:
                      r.status === "success"
                        ? "rgba(45,156,91,0.04)"
                        : r.status === "failed" || r.status === "skipped"
                          ? "rgba(255,86,64,0.04)"
                          : "rgba(25,43,55,0.02)",
                  }}
                >
                  {r.status === "importing" && (
                    <FiLoader
                      size={14}
                      style={{ animation: "spin 1s linear infinite" }}
                    />
                  )}
                  {r.status === "success" && (
                    <FiCheckCircle size={14} style={{ color: "#2d9c5b" }} />
                  )}
                  {(r.status === "failed" || r.status === "skipped") && (
                    <FiXCircle size={14} style={{ color: "#ff5640" }} />
                  )}
                  <span style={{ fontWeight: 600, fontSize: 13, flex: 1 }}>
                    {r.name}
                  </span>
                  <span
                    style={{
                      fontSize: 12,
                      opacity: 0.6,
                      fontWeight: 500,
                    }}
                  >
                    {r.status === "importing" && "Creating…"}
                    {r.status === "success" && "Created as DRAFT"}
                    {r.status === "failed" && `Failed: ${r.error}`}
                    {r.status === "skipped" && "Skipped (validation errors)"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          {!importing && (
            <div className="d-flex gap-3">
              <div
                style={{
                  padding: "12px 20px",
                  borderRadius: 10,
                  background: "rgba(45,156,91,0.06)",
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                ✅ {successCount} created
              </div>
              {failedCount > 0 && (
                <div
                  style={{
                    padding: "12px 20px",
                    borderRadius: 10,
                    background: "rgba(255,86,64,0.06)",
                    fontSize: 14,
                    fontWeight: 600,
                  }}
                >
                  ❌ {failedCount} failed/skipped
                </div>
              )}
              <button
                className="btn btn-warning d-flex align-items-center gap-2 ms-auto"
                onClick={() => navigate("/admin-portal/products")}
              >
                Go to Products <FiArrowRight size={14} />
              </button>
            </div>
          )}
        </>
      )}

      {/* Spin animation */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
}
