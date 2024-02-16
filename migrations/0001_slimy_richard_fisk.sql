CREATE TABLE `backlinks` (
	`source` text,
	`target` text,
	PRIMARY KEY(`source`, `target`)
);
--> statement-breakpoint
ALTER TABLE notes ADD `r2_key` text;--> statement-breakpoint
ALTER TABLE `notes` DROP COLUMN `content`;--> statement-breakpoint
ALTER TABLE `notes` DROP COLUMN `created_at`;--> statement-breakpoint
ALTER TABLE `notes` DROP COLUMN `updated_at`;