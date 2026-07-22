CREATE TYPE "asset_request_status" AS ENUM('pending', 'approved', 'rejected');--> statement-breakpoint
ALTER TYPE "notification_type" ADD VALUE 'transfer_rejected' BEFORE 'overdue_return';--> statement-breakpoint
ALTER TYPE "notification_type" ADD VALUE 'audit_assigned';--> statement-breakpoint
ALTER TYPE "notification_type" ADD VALUE 'system_alert';--> statement-breakpoint
CREATE TABLE "asset_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"asset_id" uuid NOT NULL,
	"employee_id" uuid NOT NULL,
	"status" "asset_request_status" DEFAULT 'pending'::"asset_request_status" NOT NULL,
	"requested_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "asset_requests" ADD CONSTRAINT "asset_requests_asset_id_assets_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "assets"("id");--> statement-breakpoint
ALTER TABLE "asset_requests" ADD CONSTRAINT "asset_requests_employee_id_employees_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id");