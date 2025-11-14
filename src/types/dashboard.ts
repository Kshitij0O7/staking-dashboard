import type { TransactionBalance } from "./staking";

export type DashboardNetworkData = {
  top: TransactionBalance[];
  spotlight?: TransactionBalance;
};

export type DashboardData = DashboardNetworkData;

