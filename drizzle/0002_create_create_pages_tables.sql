CREATE TABLE `customers` (
  `id` integer PRIMARY KEY,
  `name` text NOT NULL,
  `email` text,
  `phone` text,
  `address` text,
  `notes` text
);

CREATE TABLE `suppliers` (
  `id` integer PRIMARY KEY,
  `companyName` text NOT NULL,
  `contactName` text,
  `email` text,
  `phone` text,
  `address` text,
  `notes` text
);

CREATE TABLE `products` (
  `id` integer PRIMARY KEY,
  `name` text NOT NULL,
  `sku` text,
  `price` real,
  `stock` integer,
  `notes` text
);

CREATE TABLE `expenses` (
  `id` integer PRIMARY KEY,
  `title` text NOT NULL,
  `category` text,
  `amount` real NOT NULL,
  `expenseDate` text,
  `notes` text
);
