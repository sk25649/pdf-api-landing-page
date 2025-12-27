import { NextResponse } from "next/server";
import { getAllStats, getTotalDocuments, getFunnelStats } from "@/lib/stats";

export async function GET() {
  try {
    const [stats, total, funnel] = await Promise.all([
      getAllStats(),
      getTotalDocuments(),
      getFunnelStats(),
    ]);

    return NextResponse.json({
      ...stats,
      total_documents: total,
      signup_funnel: funnel,
    });
  } catch (error) {
    console.error("Failed to fetch stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
