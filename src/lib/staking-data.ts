import {
  getTopValidatorsETH,
  getTopValidatorsBSC,
  getValidatorRewardsETH,
  getValidatorRewardsBSC,
} from "staking-rewards-api";
import type { TransactionBalance, ApiResponse } from "@/types/staking";
import type { DashboardNetworkData } from "@/types/dashboard";

type Network = "eth" | "bsc";

const extractList = (result: ApiResponse | null): TransactionBalance[] =>
  result?.data?.EVM?.TransactionBalances ?? [];

async function fetchNetworkData(
  token: string,
  network: Network,
): Promise<DashboardNetworkData> {
  const [topResponse, rewardFn] =
    network === "eth"
      ? [await getTopValidatorsETH(token, 24, 8), getValidatorRewardsETH]
      : [await getTopValidatorsBSC(token, 24, 8), getValidatorRewardsBSC];

  const top = extractList(topResponse);
  let spotlight = top[0];

  const address = spotlight?.TokenBalance?.Address;
  if (address) {
    const rewards = await rewardFn(token, address, 24).catch(() => null);
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
  const [eth, bsc] = await Promise.all([
    fetchNetworkData(token, "eth"),
    fetchNetworkData(token, "bsc"),
  ]);
  return { eth, bsc };
}

export async function fetchValidatorHistory(
  token: string,
  address: string,
  network: Network,
  hours = 72,
) {
  const rewards =
    network === "eth"
      ? await getValidatorRewardsETH(token, address, hours)
      : await getValidatorRewardsBSC(token, address, hours);

  return rewards?.data?.EVM?.TransactionBalances ?? [];
}

