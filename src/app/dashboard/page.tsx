import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ApiKeyCard } from "./ApiKeyCard";
import { LogoutButton } from "./LogoutButton";

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

  return (
    <main className="container mx-auto flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center gap-8 px-4 py-8">
      <div className="space-y-2 text-center">
        <h1 className="text-4xl font-bold">Welcome to Dashboard</h1>
        <p className="text-muted-foreground">Logged in as: {user.email}</p>
      </div>

      <ApiKeyCard initialApiKey={apiKeyData?.key ?? null} />

      <LogoutButton />
    </main>
  );
}
