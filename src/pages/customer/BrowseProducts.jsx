import { PRODUCTS } from "../../data/mockData";
import { useNavigate } from "react-router-dom";
import {
  FiArrowRight,
  FiPackage,
  FiUsers,
  FiHeart,
  FiShield,
} from "react-icons/fi";

const categoryConfig = {
  INDIVIDUAL: { label: "Individual", color: "#192b37", icon: FiShield },
  FAMILY_FLOATER: { label: "Family Floater", color: "#5899c4", icon: FiUsers },
  FAMILY_POOL: { label: "Family Pool", color: "#2d9c5b", icon: FiUsers },
  SENIOR_CITIZEN: { label: "Senior Citizen", color: "#ff5640", icon: FiHeart },
  GROUP: { label: "Group", color: "#b8860b", icon: FiUsers },
};

export default function BrowseProducts() {
  const navigate = useNavigate();
  const activeProducts = PRODUCTS.filter((p) => p.status === "Active");

  return (
    <>
      <div className="mb-4">
        <h1>Browse Health Plans</h1>
        <p>
          Explore our health insurance plans, choose your sum insured, and
          customize your coverage
        </p>
      </div>

      <div className="row g-4">
        {activeProducts.map((product) => {
          const v = product.latestVersion;
          const rules = v?.rulesJson;
          const modules = v?.modulesJson;
          const cfg =
            categoryConfig[product.productCategory] ||
            categoryConfig.INDIVIDUAL;
          const Icon = cfg.icon;

          // Lowest premium from basePremiumBySumInsured
          const premiums = rules?.basePremiumBySumInsured
            ? Object.values(rules.basePremiumBySumInsured)
            : [];
          const startingPremium =
            premiums.length > 0 ? Math.min(...premiums) : 0;

          return (
            <div className="col-md-6 col-xl-3" key={product.id}>
              <div className="card border-0 h-100 p-4">
                {/* Icon + Category */}
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 14,
                      background: `${cfg.color}12`,
                      color: cfg.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icon size={22} />
                  </div>
                  <div>
                    <span
                      className="small fw-semibold text-uppercase"
                      style={{
                        color: cfg.color,
                        fontSize: 11,
                        letterSpacing: 0.5,
                      }}
                    >
                      {cfg.label}
                    </span>
                    {product.isRopEnabled && (
                      <span
                        style={{
                          fontSize: 10,
                          padding: "2px 6px",
                          borderRadius: 4,
                          background: "rgba(45,156,91,0.08)",
                          color: "#2d9c5b",
                          fontWeight: 600,
                          marginLeft: 6,
                        }}
                      >
                        ROP
                      </span>
                    )}
                  </div>
                </div>

                {/* Product Name & Description */}
                <div className="fw-bold fs-5 mb-2">{product.productName}</div>
                <div
                  className="text-muted small mb-3"
                  style={{ lineHeight: 1.5 }}
                >
                  {product.description}
                </div>

                {/* Age Range */}
                {modules?.eligibleAgeRange && (
                  <div
                    className="d-flex align-items-center gap-2 mb-2"
                    style={{ fontSize: 12, opacity: 0.5 }}
                  >
                    <span>
                      Age: {modules.eligibleAgeRange.minAge}–
                      {modules.eligibleAgeRange.maxAge} years
                    </span>
                    <span>•</span>
                    <span>{modules.modules?.length || 0} Modules</span>
                  </div>
                )}

                {/* Sum Insured Options */}
                {modules?.sumInsuredOptions && (
                  <div className="d-flex gap-1 flex-wrap mb-3">
                    {modules.sumInsuredOptions.map((si) => (
                      <span
                        key={si}
                        style={{
                          fontSize: 10,
                          padding: "3px 8px",
                          borderRadius: 6,
                          background: "rgba(88,153,196,0.06)",
                          fontWeight: 600,
                          color: "#5899c4",
                        }}
                      >
                        ₹{(si / 100000).toFixed(0)}L
                      </span>
                    ))}
                  </div>
                )}

                {/* Price + CTA */}
                <div
                  className="d-flex align-items-end justify-content-between mt-auto pt-3"
                  style={{ borderTop: "1px solid rgba(25,43,55,0.06)" }}
                >
                  <div>
                    <div style={{ fontSize: 11, opacity: 0.4 }}>
                      Starting from
                    </div>
                    <div className="fw-bold fs-5">
                      ₹{startingPremium.toLocaleString()}
                      <span style={{ fontSize: 12, opacity: 0.5 }}>/yr</span>
                    </div>
                  </div>
                  <button
                    className="btn btn-warning d-flex align-items-center gap-1"
                    style={{ fontSize: 12, padding: "8px 16px" }}
                    onClick={() => navigate(`/products/${product.id}`)}
                  >
                    View Plan <FiArrowRight size={12} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
