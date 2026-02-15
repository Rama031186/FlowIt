# InsureFlow — Microservice Boundary Design

## Overview

The InsureFlow platform is designed with a **modular microservice architecture**, enabling independent scaling, deployment, and development of each business domain. Each service owns its data, exposes a REST API, and communicates via asynchronous events where needed.

---

## Architecture Diagram

```
┌──────────────────────────────────────────────────────────────────┐
│                        API Gateway / BFF                         │
│                  (Routing, Auth, Rate Limiting)                   │
└────────┬────────┬────────┬────────┬────────┬────────┬────────────┘
         │        │        │        │        │        │
    ┌────▼──┐ ┌───▼───┐ ┌─▼────┐ ┌▼─────┐ ┌▼─────┐ ┌▼──────────┐
    │ Auth  │ │ User  │ │Prod- │ │Under-│ │Policy│ │ Family    │
    │Service│ │Service│ │uct   │ │writ- │ │Serv- │ │ Pool      │
    │       │ │       │ │Serv. │ │ing   │ │ice   │ │ Service   │
    └───────┘ └───────┘ └──────┘ └──────┘ └──────┘ └───────────┘
                                    │         │
                              ┌─────▼─────────▼──────┐
                              │   Notification Svc    │
                              └───────────────────────┘
                              ┌───────────────────────┐
                              │   Wellness Service    │
                              └───────────────────────┘
                              ┌───────────────────────┐
                              │   Audit Service       │
                              └───────────────────────┘
```

---

## Service Definitions

### 1. Auth Service
| Aspect | Detail |
|---|---|
| **Responsibility** | User authentication, JWT token issuance, password reset |
| **Use Cases** | UC_01 (Register), UC_02 (Login), UC_03 (Reset Password) |
| **Data Owned** | Credentials, sessions, tokens, password history |
| **Tech Stack** | Spring Boot / Node.js + JWT + BCrypt |
| **API Prefix** | `/api/v1/auth` |

### 2. User Service
| Aspect | Detail |
|---|---|
| **Responsibility** | User profiles, role management, admin user CRUD |
| **Use Cases** | UC_04 (Profile Management), UC_05 (User & Role Admin) |
| **Data Owned** | User profiles, role assignments, user metadata |
| **API Prefix** | `/api/v1/users` |

### 3. Product Service
| Aspect | Detail |
|---|---|
| **Responsibility** | Product catalog, module definitions, versioning, business rules |
| **Use Cases** | UC_06 (Versioned Products), UC_07 (Business Rules), UC_08 (Browse), UC_09 (Select Modules) |
| **Data Owned** | Products, modules, intensity levels, pricing, versions, rules |
| **API Prefix** | `/api/v1/products`, `/api/v1/rules` |

### 4. Underwriting Service
| Aspect | Detail |
|---|---|
| **Responsibility** | Application intake, risk scoring, risk explanation, review, proposals |
| **Use Cases** | UC_10 (Medical Disclosure), UC_11 (Risk Score), UC_12 (Risk Explanation), UC_13 (Review App), UC_14 (Conditional Approval), UC_15 (Accept Proposal), UC_16 (Apply for Policy) |
| **Data Owned** | Applications, risk scores, medical disclosures, underwriting decisions |
| **Events Published** | `ApplicationApproved`, `ApplicationRejected`, `RiskScoreGenerated` |
| **API Prefix** | `/api/v1/underwriting` |

### 5. Policy Service
| Aspect | Detail |
|---|---|
| **Responsibility** | Policy issuance, document generation, renewal, cancellation, expiry |
| **Use Cases** | UC_17 (Issue Policy), UC_18 (Policy Documents), UC_24 (Renew), UC_25 (Cancel), UC_26 (Expire) |
| **Data Owned** | Policies, policy documents, coverage details, policy lifecycle |
| **Events Consumed** | `ApplicationApproved` → Issue policy |
| **Events Published** | `PolicyIssued`, `PolicyCancelled`, `PolicyExpiring` |
| **API Prefix** | `/api/v1/policies` |

### 6. Family Pool Service
| Aspect | Detail |
|---|---|
| **Responsibility** | Family pool creation, coverage allocation, family risk tracking |
| **Use Cases** | UC_19 (Create Pool), UC_20 (Allocate Coverage), UC_21 (Track Family Risk) |
| **Data Owned** | Pools, members, allocations, family risk aggregates |
| **API Prefix** | `/api/v1/family-pools` |

### 7. Wellness Service
| Aspect | Detail |
|---|---|
| **Responsibility** | Credit earning via activities, credit redemption, rewards catalog |
| **Use Cases** | UC_22 (Earn Credits), UC_23 (Redeem Credits) |
| **Data Owned** | Credit balances, activity logs, redemption history, rewards |
| **API Prefix** | `/api/v1/wellness` |

### 8. Notification Service
| Aspect | Detail |
|---|---|
| **Responsibility** | Event-driven notifications (email, in-app, SMS) |
| **Use Cases** | UC_27 (Notify Policy Events) |
| **Events Consumed** | `PolicyIssued`, `PolicyExpiring`, `ApplicationApproved`, `RiskScoreGenerated` |
| **Data Owned** | Notification templates, delivery logs, user preferences |
| **API Prefix** | `/api/v1/notifications` |

### 9. Audit Service
| Aspect | Detail |
|---|---|
| **Responsibility** | Immutable action logging for compliance and governance |
| **Use Cases** | UC_28 (Audit Actions) |
| **Events Consumed** | All domain events |
| **Data Owned** | Audit logs (append-only) |
| **API Prefix** | `/api/v1/audit` |

---

## Cross-Cutting Concerns

| Concern | Approach |
|---|---|
| **API Gateway** | Single entry point, JWT validation, rate limiting, request routing |
| **Authentication** | JWT tokens issued by Auth Service, validated at Gateway |
| **Authorization** | Role-based guards at Gateway + service level |
| **Event Bus** | RabbitMQ or Kafka for async communication |
| **Service Discovery** | Eureka / Consul for dynamic service registration |
| **Config Management** | Spring Cloud Config / Vault for secrets |
| **Monitoring** | Prometheus + Grafana + centralized logging (ELK) |
| **Data Isolation** | Each service owns its database (Database-per-Service pattern) |

---

## Data Flow: Policy Application Lifecycle

```
Customer → [Auth Svc] → Login
Customer → [Product Svc] → Browse & Select Modules
Customer → [Underwriting Svc] → Submit Application + Medical Disclosure
System → [Underwriting Svc] → Generate Risk Score (UC_11)
Underwriter → [Underwriting Svc] → Review Application (UC_13)
Underwriter → [Underwriting Svc] → Approve/Reject/Conditional (UC_14)
Event: ApplicationApproved → [Policy Svc] → Issue Policy (UC_17)
Event: PolicyIssued → [Notification Svc] → Notify Customer (UC_27)
Event: * → [Audit Svc] → Log Action (UC_28)
```

---

## Future Considerations

### Claims Processing (Not Yet Implemented)
When ready, a **Claims Service** would handle:
- Submit Claim
- Validate Claim
- Approve / Reject Claim
- Process Settlement / Payout
- Fraud Detection

This would consume `PolicyIssued` events and publish `ClaimApproved`, `ClaimRejected`, `PayoutProcessed` events.
