CREATE TABLE `backlinks` (
	`source` text,
	`target` text,
	`target_text` text,
	`context` text,
	PRIMARY KEY(`source`, `target`)
);
--> statement-breakpoint
CREATE TABLE `notes` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text,
	`r2_key` text,
	`created_at` integer,
	`updated_at` integer
);
