
# 🚀 AssetFlow ERP

AssetFlow is a modern, enterprise-grade Asset & Resource Management System designed to help organizations register, allocate, track, maintain, audit, and manage physical assets and shared resources through a centralized, secure, and role-based platform.

## ✨ Features & Workflows

AssetFlow is built around a comprehensive, end-to-end business workflow:

- **👑 Organization Management (Admin)**
  - Create Departments and Asset Categories.
  - Onboard Employees and assign specialized roles (`admin`, `department_head`, `asset_manager`, `employee`).

- **📦 Asset Registration & Tracking**
  - **Asset Managers** can register new assets, categorize them, and track their lifecycle.
  - Assets dynamically transition between states: `Available`, `Allocated`, `Under Maintenance`, `Missing`, etc.

- **🔄 Allocations & Transfers**
  - **Employees** can browse the Asset Catalog and request available assets.
  - If an asset is currently in use, employees can seamlessly submit a **Transfer Request** to the current holder.
  - When finished, employees can initiate **Return Requests** which are routed to admins for approval.

- **📅 Shared Resource Booking**
  - Easily book shared resources (Meeting Rooms, Vehicles, Equipment).
  - Built-in conflict detection prevents double-booking.

- **🔧 Maintenance Routing**
  - Report damages or issues by raising Maintenance Requests (complete with photo uploads and priority flags).
  - Asset Managers can approve requests, assign technicians, and track the repair progress until resolution.

- **📋 Audit Cycles**
  - Run scheduled organizational audits (e.g. "Q4 Asset Verification").
  - Admins can assign specific locations or departments to auditors.
  - Automatically flags discrepancies for missing or damaged assets.

- **📊 Insights & Notifications**
  - In-app notification system alerts users to assignments, transfer approvals, maintenance updates, and overdue returns.
  - Detailed, immutable **Activity Logs** track every action taken across the entire system.

## 🛠️ Tech Stack

AssetFlow is built with a cutting-edge, high-performance tech stack:
- **Framework:** [Next.js 16.2](https://nextjs.org/) (App Router, Turbopack)
- **Language:** TypeScript
- **Database:** PostgreSQL (Neon Serverless)
- **ORM:** [Drizzle ORM](https://orm.drizzle.team/)
- **UI & Styling:** Tailwind CSS + [shadcn/ui](https://ui.shadcn.com/) (Radix UI primitives)
- **Validation:** Zod
- **Icons:** Lucide React

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Postgres Database (Local or Cloud like Neon/Supabase)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/AssetFlow.git
   cd AssetFlow
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the root of your project and add your Postgres connection string:
   ```env
   DATABASE_URL="postgres://user:password@host:port/dbname"
   ```

4. **Initialize the Database**
   Generate and push the database schema using Drizzle:
   ```bash
   npm run db:generate
   npx drizzle-kit push
   ```

5. **Start the Development Server**
   ```bash
   npm run dev
   ```
   Navigate to `http://localhost:3000` to access the application.

## 🔒 Role-Based Access Control (RBAC)
AssetFlow leverages strict role-based access checks at both the API and UI layers:
- `admin`: Full system access, audit creation, organization management.
- `asset_manager`: Asset registration, maintenance approval, allocation overrides.
- `department_head`: Visibility over departmental assets and allocations.
- `employee`: Self-service requests, personal allocations, maintenance reporting, and resource booking.

---
Built with ❤️ by Team AssetFlow.
