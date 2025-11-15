import { NextResponse } from "next/server";
import { fetchDashboardData } from "@/lib/staking-data";

export async function POST() {
  const token = process.env.BITQUERY_TOKEN;

  if (!token) {
    return NextResponse.json(
      { error: "BITQUERY_TOKEN missing in environment" },
      { status: 500 },
    );
  }

  try {
    const data = await fetchDashboardData(token);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to load dashboard data",
      },
      { status: 500 },
    );
  }
}

