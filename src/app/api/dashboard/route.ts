import { NextResponse } from "next/server";
import { fetchDashboardData } from "@/lib/staking-data";

export async function POST(request: Request) {
  const { token } = await request.json().catch(() => ({}));
  if (!token || typeof token !== "string") {
    return NextResponse.json(
      { error: "Bitquery token required" },
      { status: 400 },
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

