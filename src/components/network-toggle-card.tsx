"use client";

import type { TransactionBalance } from "@/types/staking";

const DISPLAY_LIMIT = 3;

const NETWORK_LABELS: Record<"eth" | "bsc", { name: string; symbol: string }> =
  {
    eth: { name: "Ethereum", symbol: "ETH" },
    bsc: { name: "Binance Smart Chain", symbol: "BNB" },
  };

type Props = {
  topEth: TransactionBalance[];
  topBsc: TransactionBalance[];
  network: "eth" | "bsc";
  onNetworkChange: (network: "eth" | "bsc") => void;
};

export default function NetworkToggleCard({
  topEth,
  topBsc,
  network,
  onNetworkChange,
}: Props) {
  const selection = network === "eth" ? topEth : topBsc;
  const topRows = selection.slice(0, DISPLAY_LIMIT);
  const meta = NETWORK_LABELS[network];

  return (
    <div className="rounded-2xl border border-emerald-100 bg-white/80 p-4 shadow-sm dark:border-emerald-500/30 dark:bg-zinc-950/50">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-[0.3em] text-emerald-500">
          Networks
        </p>
        <div className="inline-flex overflow-hidden rounded-full border border-emerald-200 bg-white text-xs dark:border-emerald-500/50 dark:bg-zinc-900">
          {(["eth", "bsc"] as const).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => onNetworkChange(key)}
              className={`px-3 py-1 font-semibold transition ${
                network === key
                  ? "bg-emerald-500 text-white"
                  : "text-emerald-500 hover:bg-emerald-50 dark:hover:bg-zinc-800"
              }`}
            >
              {NETWORK_LABELS[key].name.replace(/ .*/, "")}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 space-y-3 text-sm">
        <div>
          <p className="text-zinc-500">Selected</p>
          <p className="text-lg font-semibold text-zinc-900 dark:text-white">
            {meta.name}
          </p>
        </div>

        <ul className="space-y-2">
          {topRows.map((item, index) => {
            const address = item.TokenBalance?.Address ?? "Unknown";
            return (
              <li
                key={`${address}-${index}`}
                className="flex items-center justify-between rounded-xl border border-zinc-100/60 bg-white/70 px-3 py-2 font-mono text-xs text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-300"
              >
                <span className="truncate">{address}</span>
                <span className="font-semibold text-zinc-900 dark:text-white">
                  {Number(item.Total_tip_native ?? 0).toFixed(4)}{" "}
                  {item.TokenBalance?.Currency?.Symbol ?? meta.symbol}
                </span>
              </li>
            );
          })}
          {topRows.length === 0 && (
            <li className="rounded-xl border border-dashed border-zinc-200 px-3 py-2 text-center text-zinc-500 dark:border-zinc-700">
              No validator data loaded.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}

