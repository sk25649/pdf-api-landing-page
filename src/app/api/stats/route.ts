import { NextResponse } from "next/server";
import { getAllStats, getTotalDocuments } from "@/lib/stats";

export async function GET() {
  try {
    const [stats, total] = await Promise.all([
      getAllStats(),
      getTotalDocuments(),
    ]);

    return NextResponse.json({
      ...stats,
      total_documents: total,
    });
  } catch (error) {
    console.error("Failed to fetch stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
