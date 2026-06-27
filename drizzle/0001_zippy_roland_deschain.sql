CREATE TABLE `invoices` (
	`id` integer PRIMARY KEY NOT NULL,
	`invoiceNumber` text NOT NULL,
	`customerName` text NOT NULL,
	`customerEmail` text,
	`issueDate` text NOT NULL,
	`dueDate` text NOT NULL,
	`amount` real NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`notes` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `invoices_invoiceNumber_unique` ON `invoices` (`invoiceNumber`);