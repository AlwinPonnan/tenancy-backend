import { randomBytes } from "crypto";

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function generateSlug(name: string): string {
  const base = slugify(name);

  const id = randomBytes(6).toString("hex"); // 12 chars

  return `${base}-${id}`;
}