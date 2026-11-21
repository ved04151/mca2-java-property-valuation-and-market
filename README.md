# PropValuate NCR - Enterprise Property Valuation & Market Analysis Tool

A professional, SaaS frontend built with **React.js + Vite (JavaScript)** designed for commercial & residential property valuation, micro-market analytics, and appraisal certificate generation across **Delhi NCR** (Gurugram, Noida, Ghaziabad, South Delhi).

---

## 🛠 Tech Stack
- **Framework:** React 18 + Vite
- **Styling:** Tailwind CSS + Custom Dark Theme (Navy `#070b14` background, Blue accents)
- **Routing:** React Router DOM (v7)
- **Data & State:** TanStack React Query + Axios + LocalStorage persistence
- **Charts & Visualizations:** Recharts (Area, Bar, Pie, Line charts)
- **Forms & Validation:** React Hook Form + Zod
- **Icons & Alerts:** Lucide React + Sonner toasts
- **PDF Export:** jsPDF + jspdf-autotable

---

## 🚀 Running the Application Locally

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

3. **Build for Production:**
   ```bash
   npm run build
   ```

---

## 👥 Demo Credentials

The application includes two pre-configured demo roles with instant login one-click buttons on the Login page:

| Role | Email | Password | Scope |
|---|---|---|---|
| **Admin** | `admin@propval.in` | `admin123` | Full access including User & Personnel Management |
| **Surveyor User** | `priya@propval.in` | `user123` | Property CRUD, Valuations, Analysis & Reports |

---

## 🧭 Pages & Features Overview

1. **Login Page (`/login`)**:
   - Modern split card layout with dark glassmorphism.
   - Quick one-click demo login buttons for both Admin and Surveyor roles.
   - Session validation with redirect logic.

2. **Dashboard (`/dashboard`)**:
   - High-level KPIs: Total properties, valuation volume, average price per sq.ft, accuracy score.
   - Multi-year NCR price trajectory chart (`Recharts` Area chart).
   - Regional corridor inquiry distribution (`Recharts` Pie chart).
   - Recent properties and appraisal feed.

3. **Properties Directory (`/properties`)**:
   - Search by title, locality, or sector.
   - Filter by NCR City (Gurugram, Noida, Ghaziabad, Delhi NCR) and Property Type (Apartment, Penthouse, Villa, Office).
   - Sorting by newest, price, area, or sq.ft rate.
   - Pagination, verified badges, and quick delete confirmation dialogs.

4. **Add / Edit Property (`/properties/new`, `/properties/:id/edit`)**:
   - Full Zod schema validation for INR prices, super areas, and 6-digit Indian PIN codes.
   - Image upload manager with local preview and web image URL support.
   - Interactive society amenities checklist.

5. **Property Details (`/properties/:id`)**:
   - High-resolution gallery preview with thumbnail carousel.
   - Complete architectural specifications (carpet area, BHK, age, floor, facing, parking).
   - Direct shortcut into the Valuation Engine with pre-filled property parameters.

6. **Valuation Calculator (`/valuation`)**:
   - Multi-parameter algorithmic real estate valuation engine.
   - Adjusts for micro-market circle rates, building condition, amenities tier, age depreciation, and highrise floor level.
   - Visual step-by-step breakdown of base value and adjustments.
   - Save appraisal certificate directly into Valuation History.

7. **Valuation History (`/history`)**:
   - Tabular audit log of all completed valuations.
   - Search by client, property, or surveyor officer.
   - Delete records with confirmation.

8. **Market Analysis (`/market-analysis`)**:
   - Micro-market directory comparing capital rates and YoY growth.
   - Interactive Bar chart comparing rates per sq.ft across Delhi NCR sectors.
   - Deep-dive panel displaying rental yield, inventory absorption, and quarterly appreciation curves.

9. **Reports & Export (`/reports`)**:
   - Formal institutional-grade appraisal certificate preview.
   - **One-click high-resolution PDF download** powered by `jsPDF` and `jspdf-autotable`.

10. **User Management [Admin Only] (`/admin/users`)**:
    - Manage surveyor personnel, roles (Admin / User), and contact details.
    - Toggle account status between `ACTIVE` and `SUSPENDED`.
    - Protected route accessible only to Admin role.

11. **Profile & Settings (`/settings`)**:
    - Update user legal name, professional title, and phone number.
    - Password change form.
    - Future Spring Boot backend integration specifications.

---

## ☕ Spring Boot 3.x Backend Integration Contract

All services in `src/services/` are architected to seamlessly map to a future Spring Boot 3.x REST API:

- **Centralized Axios Client:** [apiClient.js](file:///d:/HCL/src/services/apiClient.js) automatically injects JWT Bearer tokens and handles `401 Unauthorized`.
- **Property Service:** [propertyService.js](file:///d:/HCL/src/services/propertyService.js) documents:
  - `GET /api/properties` (pagination, filters, search)
  - `GET /api/properties/{id}`
  - `POST /api/properties`
  - `PUT /api/properties/{id}`
  - `DELETE /api/properties/{id}`
- **Valuation Service:** [valuationService.js](file:///d:/HCL/src/services/valuationService.js) documents:
  - `POST /api/valuations/calculate`
  - `GET /api/valuations`
  - `POST /api/valuations`
  - `GET /api/market-analysis/benchmarks`
- **Auth & User Service:** [authService.js](file:///d:/HCL/src/services/authService.js) documents:
  - `POST /api/auth/login`
  - `GET /api/users`
  - `POST /api/users`
  - `PUT /api/users/{id}`
  - `DELETE /api/users/{id}`
