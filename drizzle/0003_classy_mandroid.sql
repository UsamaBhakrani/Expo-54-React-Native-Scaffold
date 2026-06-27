CREATE TABLE `customers` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text,
	`phone` text,
	`address` text,
	`notes` text
);
--> statement-breakpoint
CREATE TABLE `expenses` (
	`id` integer PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`category` text,
	`amount` real NOT NULL,
	`expenseDate` text,
	`notes` text
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`sku` text,
	`price` real,
	`stock` integer,
	`notes` text
);
--> statement-breakpoint
CREATE TABLE `suppliers` (
	`id` integer PRIMARY KEY NOT NULL,
	`companyName` text NOT NULL,
	`contactName` text,
	`email` text,
	`phone` text,
	`address` text,
	`notes` text
);
