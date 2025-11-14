declare module "staking-rewards-api" {
  type Network = "ETHEREUM" | "BSC";

  export type TransactionBalance = {
    TokenBalance?: {
      Address?: string;
      Currency?: {
        Name?: string;
        Symbol?: string;
      };
    };
    Total_tip_native?: string;
    Total_tip_usd?: string;
    number_of_tips?: number;
    Pre?: string;
    Post?: string;
  };

  export type QueryResponse = {
    data?: {
      EVM?: {
        TransactionBalances?: TransactionBalance[];
      };
    };
  };

  export type StreamOptions = {
    onData?: (payload: unknown) => void;
    onError?: (err: unknown) => void;
    autoCloseMs?: number;
  };

  export function getTopValidatorsETH(
    token: string,
    hoursAgo?: number,
    limit?: number,
  ): Promise<QueryResponse>;

  export function getTopValidatorsBSC(
    token: string,
    hoursAgo?: number,
    limit?: number,
  ): Promise<QueryResponse>;

  export function getValidatorRewardsETH(
    token: string,
    address: string,
    hoursAgo?: number,
  ): Promise<QueryResponse>;

  export function getValidatorRewardsBSC(
    token: string,
    address: string,
    hoursAgo?: number,
  ): Promise<QueryResponse>;

  export function runValidatorRewardsStreamETH(
    token: string,
    address: string,
    options?: StreamOptions,
  ): Promise<WebSocket>;

  export function runValidatorRewardsStreamBSC(
    token: string,
    address: string,
    options?: StreamOptions,
  ): Promise<WebSocket>;

  export function runMultipleValidatorRewardsStreamETH(
    token: string,
    addresses: string[],
    options?: StreamOptions,
  ): Promise<WebSocket>;

  export function runMultipleValidatorRewardsStreamBSC(
    token: string,
    addresses: string[],
    options?: StreamOptions,
  ): Promise<WebSocket>;

  export function runAllValidatorRewardsStreamETH(
    token: string,
    options?: StreamOptions,
  ): Promise<WebSocket>;

  export function runAllValidatorRewardsStreamBSC(
    token: string,
    options?: StreamOptions,
  ): Promise<WebSocket>;
}

