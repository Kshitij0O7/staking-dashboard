import { NextResponse } from "next/server";
import { fetchValidatorHistory } from "@/lib/staking-data";

export async function POST(request: Request) {
  const token = process.env.BITQUERY_TOKEN;
  const { address, hours = 24 } = await request.json().catch(() => ({}));

  if (!token) {
    return NextResponse.json(
      { error: "BITQUERY_TOKEN missing in environment" },
      { status: 500 },
    );
  }

  if (!address || typeof address !== "string") {
    return NextResponse.json(
      { error: "Validator address required" },
      { status: 400 },
    );
  }

  try {
    const balances = await fetchValidatorHistory(token, address, hours);
    return NextResponse.json({ balances });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to load validator data",
      },
      { status: 500 },
    );
  }
}

