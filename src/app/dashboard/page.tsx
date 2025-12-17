import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getPlanLimit } from "@/lib/plans";
import { ApiKeyCard } from "./ApiKeyCard";
import { UsageCard } from "./UsageCard";
import { BillingCard } from "./BillingCard";
import { LogoutButton } from "./LogoutButton";

function getFirstDayOfMonth(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}-01`;
}

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch user's API key
  const { data: apiKeyData } = await supabase
    .from("api_keys")
    .select("key")
    .eq("user_id", user.id)
    .is("revoked_at", null)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  // Fetch current month's usage
  const firstDayOfMonth = getFirstDayOfMonth();
  const { data: usageData } = await supabase
    .from("usage_monthly")
    .select("count")
    .eq("user_id", user.id)
    .eq("month", firstDayOfMonth)
    .single();

  // Fetch user's plan and stripe customer id
  const { data: planData } = await supabase
    .from("user_plans")
    .select("plan, stripe_customer_id")
    .eq("user_id", user.id)
    .single();

  const currentUsage = usageData?.count ?? 0;
  const currentPlan = planData?.plan ?? "free";
  const stripeCustomerId = planData?.stripe_customer_id ?? null;
  const planLimit = getPlanLimit(currentPlan);

  return (
    <main className="container mx-auto flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center gap-8 px-4 py-8">
      <div className="space-y-2 text-center">
        <h1 className="text-4xl font-bold">Welcome to Dashboard</h1>
        <p className="text-muted-foreground">Logged in as: {user.email}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <ApiKeyCard initialApiKey={apiKeyData?.key ?? null} />
        <UsageCard current={currentUsage} limit={planLimit} plan={currentPlan} />
        <BillingCard plan={currentPlan} stripeCustomerId={stripeCustomerId} />
      </div>

      <LogoutButton />
    </main>
  );
}
