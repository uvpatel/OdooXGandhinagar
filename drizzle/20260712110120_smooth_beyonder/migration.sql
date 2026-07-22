DROP TABLE "asset_requests";--> statement-breakpoint
ALTER TABLE "allocations" ADD COLUMN "return_requested_at" timestamp;--> statement-breakpoint
DROP TYPE "asset_request_status";