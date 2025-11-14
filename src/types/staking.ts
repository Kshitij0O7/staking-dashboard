export type TransactionBalance = {
  TokenBalance?: {
    Address?: string;
    Currency?: {
      Symbol?: string;
      Name?: string;
    };
  };
  Total_tip_native?: string;
  Total_tip_usd?: string;
  number_of_tips?: number;
  Pre?: string;
  Post?: string;
};

export type ApiResponse = {
  data?: {
    EVM?: {
      TransactionBalances?: TransactionBalance[];
    };
  };
};

