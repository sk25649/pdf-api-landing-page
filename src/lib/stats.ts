import { kv } from "@vercel/kv";

export type StatKey =
  | "pdfs_generated"
  | "screenshots_generated"
  | "invoices_created"
  | "og_images_generated"
  | "resumes_created";

/**
 * Increment a stat counter
 * Returns the new count
 */
export async function incrementStat(key: StatKey): Promise<number> {
  try {
    const newCount = await kv.incr(key);
    return newCount;
  } catch (error) {
    // Log error but don't break the main flow
    console.error(`Failed to increment stat ${key}:`, error);
    return -1;
  }
}

/**
 * Get current count for a stat
 */
export async function getStat(key: StatKey): Promise<number> {
  try {
    const count = await kv.get<number>(key);
    return count ?? 0;
  } catch (error) {
    console.error(`Failed to get stat ${key}:`, error);
    return 0;
  }
}

/**
 * Get all stats at once
 */
export async function getAllStats(): Promise<Record<StatKey, number>> {
  try {
    const [pdfs, screenshots, invoices, ogImages, resumes] = await Promise.all([
      kv.get<number>("pdfs_generated"),
      kv.get<number>("screenshots_generated"),
      kv.get<number>("invoices_created"),
      kv.get<number>("og_images_generated"),
      kv.get<number>("resumes_created"),
    ]);

    return {
      pdfs_generated: pdfs ?? 0,
      screenshots_generated: screenshots ?? 0,
      invoices_created: invoices ?? 0,
      og_images_generated: ogImages ?? 0,
      resumes_created: resumes ?? 0,
    };
  } catch (error) {
    console.error("Failed to get all stats:", error);
    return {
      pdfs_generated: 0,
      screenshots_generated: 0,
      invoices_created: 0,
      og_images_generated: 0,
      resumes_created: 0,
    };
  }
}

/**
 * Get total documents generated (all types combined)
 */
export async function getTotalDocuments(): Promise<number> {
  const stats = await getAllStats();
  return (
    stats.pdfs_generated +
    stats.screenshots_generated +
    stats.invoices_created +
    stats.og_images_generated +
    stats.resumes_created
  );
}
