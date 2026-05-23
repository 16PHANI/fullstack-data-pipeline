# Full-Stack Data Pipeline

> React.js · Node.js · Express.js · MySQL · Docker · CI/CD (GitHub Actions)

A production-ready full-stack customer analytics dashboard demonstrating OOP design patterns, REST API development, SQL data handling, schema validation, and containerised deployment.

---

## Tech Stack

| Layer       | Technology                              |
|-------------|-----------------------------------------|
| Frontend    | React 18, Recharts, Vite                |
| Backend     | Node.js, Express.js, OOP architecture  |
| Database    | MySQL 8, Views, Indexes, Schema checks |
| DevOps      | Docker, Docker Compose, Nginx           |
| CI/CD       | GitHub Actions (test → build → deploy) |
| Validation  | express-validator, server-side schema  |
| Testing     | Jest, Supertest (mocked DB)            |

---

## Architecture

```
frontend/          React 18 SPA (Vite)
  ├── components/  Analytics, CustomerTable, AddCustomer
  ├── hooks/       useCustomers (state management)
  └── services/    api.js (Axios client)

backend/           Node.js REST API
  ├── models/      Customer (domain class, toJSON, riskLabel)
  ├── repositories/CustomerRepository (all SQL here)
  ├── services/    CustomerService (business logic, risk scoring)
  ├── controllers/ CustomerController (request/response)
  ├── routes/      /api/customers
  └── middleware/  validation.js, errorHandler.js

database/
  └── init.sql     Schema + 50 seed records + Views + Indexes
```

---

## Quick Start

### Option A — Docker Compose (recommended)

```bash
git clone https://github.com/16PHANI/fullstack-data-pipeline.git
cd fullstack-data-pipeline
docker compose up --build
```

Open http://localhost — dashboard loads with 50 seed customers.

### Option B — Local development

**Prerequisites:** Node.js 20+, MySQL 8

```bash
# 1. Database
mysql -u root -p < database/init.sql

# 2. Backend
cd backend
cp .env.example .env          # edit DB credentials
npm install
npm run dev                   # http://localhost:5000

# 3. Frontend (new terminal)
cd frontend
npm install
npm run dev                   # http://localhost:3000
```

---

## API Reference

| Method | Endpoint                        | Description              |
|--------|---------------------------------|--------------------------|
| GET    | /health                         | Health check             |
| GET    | /api/customers                  | Paginated list + filters |
| GET    | /api/customers/:id              | Single customer          |
| POST   | /api/customers                  | Create customer          |
| PUT    | /api/customers/:id              | Update customer          |
| DELETE | /api/customers/:id              | Delete customer          |
| GET    | /api/customers/analytics        | KPIs + charts data       |

**Query params:** `page`, `limit`, `region`, `plan`, `churn`, `search`

---

## Running Tests

```bash
cd backend
npm test
# or with coverage
npm run test:coverage
```

---

## CI/CD Pipeline

GitHub Actions runs on every push to `main`:

1. **Backend Tests** — Jest unit tests with mocked DB
2. **Frontend Build** — Vite production build + artifact upload
3. **Integration** — Docker Compose smoke tests against real API

---

## Key Design Decisions

- **OOP patterns throughout:** `Customer` model (domain object), `CustomerRepository` (data access), `CustomerService` (business logic), `CustomerController` (HTTP layer)
- **Schema validation:** express-validator on all inputs; MySQL CHECK constraints + UNIQUE keys
- **Zero-downtime queries:** connection pool (10 connections), indexed columns (region, plan, churn, risk_score)
- **Risk scoring:** heuristic engine in `CustomerService._computeRisk()` — extensible to ML model
