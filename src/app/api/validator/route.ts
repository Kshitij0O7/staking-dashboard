import { NextResponse } from "next/server";
import { fetchValidatorHistory } from "@/lib/staking-data";

export async function POST(request: Request) {
  const { token, address, network, hours = 72 } = await request
    .json()
    .catch(() => ({}));

  if (!token || typeof token !== "string") {
    return NextResponse.json(
      { error: "Bitquery token required" },
      { status: 400 },
    );
  }

  if (!address || typeof address !== "string") {
    return NextResponse.json(
      { error: "Validator address required" },
      { status: 400 },
    );
  }

  const resolvedNetwork = network === "bsc" ? "bsc" : "eth";

  try {
    const balances = await fetchValidatorHistory(
      token,
      address,
      resolvedNetwork,
      hours,
    );
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

