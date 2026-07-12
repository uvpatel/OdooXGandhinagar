CREATE TYPE "allocation_status" AS ENUM('active', 'returned', 'overdue');--> statement-breakpoint
CREATE TYPE "asset_status" AS ENUM('available', 'allocated', 'reserved', 'under_maintenance', 'lost', 'retired', 'disposed');--> statement-breakpoint
CREATE TYPE "audit_cycle_status" AS ENUM('scheduled', 'in_progress', 'closed');--> statement-breakpoint
CREATE TYPE "audit_item_result" AS ENUM('pending', 'verified', 'missing', 'damaged');--> statement-breakpoint
CREATE TYPE "booking_status" AS ENUM('upcoming', 'ongoing', 'completed', 'cancelled');--> statement-breakpoint
CREATE TYPE "condition" AS ENUM('new', 'good', 'fair', 'poor', 'damaged');--> statement-breakpoint
CREATE TYPE "maintenance_priority" AS ENUM('low', 'medium', 'high', 'critical');--> statement-breakpoint
CREATE TYPE "maintenance_status" AS ENUM('pending', 'approved', 'rejected', 'technician_assigned', 'in_progress', 'resolved');--> statement-breakpoint
CREATE TYPE "notification_type" AS ENUM('asset_assigned', 'maintenance_approved', 'maintenance_rejected', 'booking_confirmed', 'booking_cancelled', 'booking_reminder', 'transfer_approved', 'overdue_return', 'audit_discrepancy');--> statement-breakpoint
CREATE TYPE "role" AS ENUM('admin', 'asset_manager', 'department_head', 'employee');--> statement-breakpoint
CREATE TYPE "transfer_status" AS ENUM('requested', 'approved', 'rejected', 'completed');--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL UNIQUE,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY,
	"name" text NOT NULL,
	"email" text NOT NULL UNIQUE,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"last_login_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "asset_categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"name" text NOT NULL UNIQUE,
	"extra_fields_schema" jsonb DEFAULT '{}' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "departments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"name" text NOT NULL UNIQUE,
	"parent_department_id" uuid,
	"head_employee_id" uuid,
	"status" text DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "employees" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" text NOT NULL UNIQUE,
	"name" text NOT NULL,
	"email" text NOT NULL UNIQUE,
	"department_id" uuid,
	"role" "role" DEFAULT 'employee'::"role" NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "allocations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"asset_id" uuid NOT NULL,
	"employee_id" uuid,
	"department_id" uuid,
	"allocated_at" timestamp DEFAULT now() NOT NULL,
	"expected_return_date" date,
	"returned_at" timestamp,
	"return_condition_notes" text,
	"status" "allocation_status" DEFAULT 'active'::"allocation_status" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "assets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"asset_tag" text NOT NULL UNIQUE,
	"name" text NOT NULL,
	"category_id" uuid NOT NULL,
	"serial_number" text NOT NULL,
	"acquisition_date" date,
	"acquisition_cost" numeric(12,2),
	"condition" "condition" DEFAULT 'good'::"condition" NOT NULL,
	"location" text NOT NULL,
	"status" "asset_status" DEFAULT 'available'::"asset_status" NOT NULL,
	"is_bookable" boolean DEFAULT false NOT NULL,
	"department_id" uuid,
	"qr_code_value" text NOT NULL UNIQUE,
	"photo_url" text,
	"metadata" jsonb DEFAULT '{}' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "transfers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"asset_id" uuid NOT NULL,
	"from_allocation_id" uuid NOT NULL,
	"requested_by_employee_id" uuid NOT NULL,
	"to_employee_id" uuid,
	"to_department_id" uuid,
	"status" "transfer_status" DEFAULT 'requested'::"transfer_status" NOT NULL,
	"approved_by_employee_id" uuid,
	"requested_at" timestamp DEFAULT now() NOT NULL,
	"resolved_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "activity_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"actor_employee_id" uuid NOT NULL,
	"action" text NOT NULL,
	"entity_type" text NOT NULL,
	"entity_id" uuid NOT NULL,
	"metadata" jsonb DEFAULT '{}' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "audit_cycle_auditors" (
	"audit_cycle_id" uuid,
	"employee_id" uuid,
	CONSTRAINT "audit_cycle_auditors_pkey" PRIMARY KEY("audit_cycle_id","employee_id")
);
--> statement-breakpoint
CREATE TABLE "audit_cycles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"name" text NOT NULL,
	"scope_department_id" uuid,
	"scope_location" text,
	"start_date" date NOT NULL,
	"end_date" date NOT NULL,
	"status" "audit_cycle_status" DEFAULT 'scheduled'::"audit_cycle_status" NOT NULL,
	"created_by_employee_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "audit_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"audit_cycle_id" uuid NOT NULL,
	"asset_id" uuid NOT NULL,
	"result" "audit_item_result" DEFAULT 'pending'::"audit_item_result" NOT NULL,
	"notes" text,
	"checked_by_employee_id" uuid,
	"checked_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "bookings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"resource_id" uuid NOT NULL,
	"booked_by_employee_id" uuid NOT NULL,
	"department_id" uuid,
	"starts_at" timestamp with time zone NOT NULL,
	"ends_at" timestamp with time zone NOT NULL,
	"status" "booking_status" DEFAULT 'upcoming'::"booking_status" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "maintenance_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"asset_id" uuid NOT NULL,
	"raised_by_employee_id" uuid NOT NULL,
	"issue_description" text NOT NULL,
	"priority" "maintenance_priority" DEFAULT 'medium'::"maintenance_priority" NOT NULL,
	"photo_url" text,
	"status" "maintenance_status" DEFAULT 'pending'::"maintenance_status" NOT NULL,
	"reviewed_by_employee_id" uuid,
	"technician_name" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"approved_at" timestamp,
	"resolved_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"employee_id" uuid NOT NULL,
	"type" "notification_type" NOT NULL,
	"message" text NOT NULL,
	"entity_type" text NOT NULL,
	"entity_id" uuid NOT NULL,
	"is_read" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "resources" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"asset_id" uuid,
	"name" text NOT NULL,
	"type" text NOT NULL,
	"location" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "departments" ADD CONSTRAINT "departments_head_employee_id_employees_id_fkey" FOREIGN KEY ("head_employee_id") REFERENCES "employees"("id");--> statement-breakpoint
CREATE INDEX "account_user_id_idx" ON "account" ("user_id");--> statement-breakpoint
CREATE INDEX "session_user_id_idx" ON "session" ("user_id");--> statement-breakpoint
CREATE INDEX "verification_identifier_idx" ON "verification" ("identifier");--> statement-breakpoint
CREATE INDEX "employees_department_id_idx" ON "employees" ("department_id");--> statement-breakpoint
CREATE INDEX "allocations_asset_status_idx" ON "allocations" ("asset_id","status");--> statement-breakpoint
CREATE UNIQUE INDEX "allocations_one_active_asset_idx" ON "allocations" ("asset_id") WHERE status = 'active';--> statement-breakpoint
CREATE INDEX "assets_status_idx" ON "assets" ("status");--> statement-breakpoint
CREATE INDEX "assets_department_id_idx" ON "assets" ("department_id");--> statement-breakpoint
CREATE INDEX "bookings_resource_starts_at_idx" ON "bookings" ("resource_id","starts_at");--> statement-breakpoint
CREATE INDEX "notifications_employee_read_idx" ON "notifications" ("employee_id","is_read");--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "departments" ADD CONSTRAINT "departments_parent_department_id_departments_id_fkey" FOREIGN KEY ("parent_department_id") REFERENCES "departments"("id");--> statement-breakpoint
ALTER TABLE "employees" ADD CONSTRAINT "employees_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "employees" ADD CONSTRAINT "employees_department_id_departments_id_fkey" FOREIGN KEY ("department_id") REFERENCES "departments"("id");--> statement-breakpoint
ALTER TABLE "allocations" ADD CONSTRAINT "allocations_asset_id_assets_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "assets"("id");--> statement-breakpoint
ALTER TABLE "allocations" ADD CONSTRAINT "allocations_employee_id_employees_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id");--> statement-breakpoint
ALTER TABLE "allocations" ADD CONSTRAINT "allocations_department_id_departments_id_fkey" FOREIGN KEY ("department_id") REFERENCES "departments"("id");--> statement-breakpoint
ALTER TABLE "assets" ADD CONSTRAINT "assets_category_id_asset_categories_id_fkey" FOREIGN KEY ("category_id") REFERENCES "asset_categories"("id");--> statement-breakpoint
ALTER TABLE "assets" ADD CONSTRAINT "assets_department_id_departments_id_fkey" FOREIGN KEY ("department_id") REFERENCES "departments"("id");--> statement-breakpoint
ALTER TABLE "transfers" ADD CONSTRAINT "transfers_asset_id_assets_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "assets"("id");--> statement-breakpoint
ALTER TABLE "transfers" ADD CONSTRAINT "transfers_from_allocation_id_allocations_id_fkey" FOREIGN KEY ("from_allocation_id") REFERENCES "allocations"("id");--> statement-breakpoint
ALTER TABLE "transfers" ADD CONSTRAINT "transfers_requested_by_employee_id_employees_id_fkey" FOREIGN KEY ("requested_by_employee_id") REFERENCES "employees"("id");--> statement-breakpoint
ALTER TABLE "transfers" ADD CONSTRAINT "transfers_to_employee_id_employees_id_fkey" FOREIGN KEY ("to_employee_id") REFERENCES "employees"("id");--> statement-breakpoint
ALTER TABLE "transfers" ADD CONSTRAINT "transfers_to_department_id_departments_id_fkey" FOREIGN KEY ("to_department_id") REFERENCES "departments"("id");--> statement-breakpoint
ALTER TABLE "transfers" ADD CONSTRAINT "transfers_approved_by_employee_id_employees_id_fkey" FOREIGN KEY ("approved_by_employee_id") REFERENCES "employees"("id");--> statement-breakpoint
ALTER TABLE "activity_logs" ADD CONSTRAINT "activity_logs_actor_employee_id_employees_id_fkey" FOREIGN KEY ("actor_employee_id") REFERENCES "employees"("id");--> statement-breakpoint
ALTER TABLE "audit_cycle_auditors" ADD CONSTRAINT "audit_cycle_auditors_audit_cycle_id_audit_cycles_id_fkey" FOREIGN KEY ("audit_cycle_id") REFERENCES "audit_cycles"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "audit_cycle_auditors" ADD CONSTRAINT "audit_cycle_auditors_employee_id_employees_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "audit_cycles" ADD CONSTRAINT "audit_cycles_scope_department_id_departments_id_fkey" FOREIGN KEY ("scope_department_id") REFERENCES "departments"("id");--> statement-breakpoint
ALTER TABLE "audit_cycles" ADD CONSTRAINT "audit_cycles_created_by_employee_id_employees_id_fkey" FOREIGN KEY ("created_by_employee_id") REFERENCES "employees"("id");--> statement-breakpoint
ALTER TABLE "audit_items" ADD CONSTRAINT "audit_items_audit_cycle_id_audit_cycles_id_fkey" FOREIGN KEY ("audit_cycle_id") REFERENCES "audit_cycles"("id");--> statement-breakpoint
ALTER TABLE "audit_items" ADD CONSTRAINT "audit_items_asset_id_assets_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "assets"("id");--> statement-breakpoint
ALTER TABLE "audit_items" ADD CONSTRAINT "audit_items_checked_by_employee_id_employees_id_fkey" FOREIGN KEY ("checked_by_employee_id") REFERENCES "employees"("id");--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_resource_id_resources_id_fkey" FOREIGN KEY ("resource_id") REFERENCES "resources"("id");--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_booked_by_employee_id_employees_id_fkey" FOREIGN KEY ("booked_by_employee_id") REFERENCES "employees"("id");--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_department_id_departments_id_fkey" FOREIGN KEY ("department_id") REFERENCES "departments"("id");--> statement-breakpoint
ALTER TABLE "maintenance_requests" ADD CONSTRAINT "maintenance_requests_asset_id_assets_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "assets"("id");--> statement-breakpoint
ALTER TABLE "maintenance_requests" ADD CONSTRAINT "maintenance_requests_raised_by_employee_id_employees_id_fkey" FOREIGN KEY ("raised_by_employee_id") REFERENCES "employees"("id");--> statement-breakpoint
ALTER TABLE "maintenance_requests" ADD CONSTRAINT "maintenance_requests_reviewed_by_employee_id_employees_id_fkey" FOREIGN KEY ("reviewed_by_employee_id") REFERENCES "employees"("id");--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_employee_id_employees_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id");--> statement-breakpoint
ALTER TABLE "resources" ADD CONSTRAINT "resources_asset_id_assets_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "assets"("id");
--> statement-breakpoint
CREATE EXTENSION IF NOT EXISTS btree_gist;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_no_overlap" EXCLUDE USING gist ("resource_id" WITH =, tstzrange("starts_at", "ends_at", '[)') WITH &&) WHERE ("status" IN ('upcoming', 'ongoing'));
