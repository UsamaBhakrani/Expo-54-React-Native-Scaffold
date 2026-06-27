CREATE TABLE `companies` (
	`id` integer PRIMARY KEY NOT NULL,
	`type` integer NOT NULL,
	`company` text NOT NULL,
	`address` text,
	`ntn` text,
	`salesTaxNo` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `companies_company_unique` ON `companies` (`company`);