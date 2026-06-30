CREATE TABLE `customer` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`email` text,
	`phone` text,
	`address` text,
	`notes` text
);
--> statement-breakpoint
CREATE TABLE `expense` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`category` text,
	`amount` real NOT NULL,
	`expense_date` text,
	`notes` text
);
--> statement-breakpoint
CREATE TABLE `invoice` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`invoice_number` text NOT NULL,
	`customer_id` integer,
	`customer_name` text NOT NULL,
	`customer_email` text,
	`issue_date` text NOT NULL,
	`due_date` text NOT NULL,
	`amount` real NOT NULL,
	`status` text NOT NULL,
	`notes` text
);
--> statement-breakpoint
CREATE TABLE `product` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`sku` text,
	`price` real,
	`stock` real,
	`supplier_id` integer,
	`notes` text
);
--> statement-breakpoint
CREATE TABLE `supplier_transaction` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`supplier_id` integer NOT NULL,
	`date` text NOT NULL,
	`narration` text NOT NULL,
	`debit` real,
	`credit` real,
	`balance` real NOT NULL
);
--> statement-breakpoint
CREATE TABLE `supplier` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`company_name` text NOT NULL,
	`contact_name` text,
	`email` text,
	`phone` text,
	`address` text,
	`notes` text
);
