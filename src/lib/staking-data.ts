import { getTopValidatorsETH, getValidatorRewardsETH } from "staking-rewards-api";
import type { TransactionBalance, ApiResponse } from "@/types/staking";
import type { DashboardNetworkData } from "@/types/dashboard";

const extractList = (result: ApiResponse | null): TransactionBalance[] =>
  result?.data?.EVM?.TransactionBalances ?? [];

async function fetchNetworkData(token: string): Promise<DashboardNetworkData> {
  const topResponse = await getTopValidatorsETH(token, 24, 8);

  const top = extractList(topResponse);
  let spotlight = top[0];

  const address = spotlight?.TokenBalance?.Address;
  if (address) {
    const rewards = await getValidatorRewardsETH(token, address, 24).catch(
      () => null,
    );
    const firstReward =
      rewards?.data?.EVM?.TransactionBalances?.[0] ?? undefined;
    if (firstReward) {
      spotlight = {
        ...spotlight,
        ...firstReward,
        TokenBalance: spotlight.TokenBalance,
      };
    }
  }

  return { top, spotlight };
}

export async function fetchDashboardData(token: string) {
  return fetchNetworkData(token);
}

export async function fetchValidatorHistory(
  token: string,
  address: string,
  hours = 72,
) {
  const rewards = await getValidatorRewardsETH(token, address, hours);
  return rewards?.data?.EVM?.TransactionBalances ?? [];
}

