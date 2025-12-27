import { kv } from "@vercel/kv";

export type StatKey =
  | "pdfs_generated"
  | "screenshots_generated"
  | "invoices_created"
  | "og_images_generated"
  | "resumes_created";

export type FunnelEventKey =
  | "signup_page_view"
  | "signup_form_start"
  | "signup_submit"
  | "signup_success"
  | "signup_error"
  | "signup_github_click";

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

/**
 * Track a funnel event
 */
export async function trackFunnelEvent(key: FunnelEventKey): Promise<number> {
  try {
    const newCount = await kv.incr(key);
    return newCount;
  } catch (error) {
    console.error(`Failed to track funnel event ${key}:`, error);
    return -1;
  }
}

/**
 * Get all funnel stats
 */
export async function getFunnelStats(): Promise<Record<FunnelEventKey, number>> {
  try {
    const [pageView, formStart, submit, success, error, githubClick] =
      await Promise.all([
        kv.get<number>("signup_page_view"),
        kv.get<number>("signup_form_start"),
        kv.get<number>("signup_submit"),
        kv.get<number>("signup_success"),
        kv.get<number>("signup_error"),
        kv.get<number>("signup_github_click"),
      ]);

    return {
      signup_page_view: pageView ?? 0,
      signup_form_start: formStart ?? 0,
      signup_submit: submit ?? 0,
      signup_success: success ?? 0,
      signup_error: error ?? 0,
      signup_github_click: githubClick ?? 0,
    };
  } catch (error) {
    console.error("Failed to get funnel stats:", error);
    return {
      signup_page_view: 0,
      signup_form_start: 0,
      signup_submit: 0,
      signup_success: 0,
      signup_error: 0,
      signup_github_click: 0,
    };
  }
}
