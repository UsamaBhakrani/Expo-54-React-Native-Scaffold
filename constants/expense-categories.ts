/**
 * Structured expense categories with subcategories.
 * Mirrors the hierarchy: Category → Subcategory
 */

export type ExpenseCategory = {
  category: string;
  subcategories: string[];
};

export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  {
    category: "Rent",
    subcategories: [],
  },
  {
    category: "Entertainment",
    subcategories: [],
  },
  {
    category: "Utilities",
    subcategories: ["Electricity", "Water", "Gas"],
  },
];

/** Flatten into a single list of full category paths like "Utilities / Electricity" */
export function getCategoryPath(category: string, subcategory?: string): string {
  if (subcategory) return `${category} / ${subcategory}`;
  return category;
}

/** Split a stored path back into category and optional subcategory */
export function parseCategoryPath(path: string): { category: string; subcategory?: string } {
  const parts = path.split(" / ");
  return { category: parts[0], subcategory: parts[1] };
}
