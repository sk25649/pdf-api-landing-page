export const PLANS = {
  free: 100,
  starter: 1000,
  pro: 5000,
  business: 20000,
} as const;

export const PLAN_PRICES = {
  free: 0,
  starter: 19,
  pro: 49,
  business: 99,
} as const;

export const PLAN_FEATURES = {
  free: ["100 calls/month", "Community support"],
  starter: ["1,000 calls/month", "Email support"],
  pro: ["5,000 calls/month", "Priority support"],
  business: ["20,000 calls/month", "Dedicated support"],
} as const;

export type PlanName = keyof typeof PLANS;

export function getPlanLimit(plan: string): number {
  const normalizedPlan = plan.toLowerCase() as PlanName;
  return PLANS[normalizedPlan] ?? PLANS.free;
}

export function getPlanPrice(plan: string): number {
  const normalizedPlan = plan.toLowerCase() as PlanName;
  return PLAN_PRICES[normalizedPlan] ?? PLAN_PRICES.free;
}

export function getPlanFeatures(plan: string): readonly string[] {
  const normalizedPlan = plan.toLowerCase() as PlanName;
  return PLAN_FEATURES[normalizedPlan] ?? PLAN_FEATURES.free;
}

export function formatPlanName(plan: string): string {
  return plan.charAt(0).toUpperCase() + plan.slice(1).toLowerCase();
}
