"use client";

import Link from "next/link";
import { useCallback, useMemo, useRef, useState } from "react";

type LiveReward = {
  id: string;
  address: string;
  reward: number;
  rewardUsd: number;
  txHash?: string;
  timestamp?: string;
};

function formatNumber(value: number) {
  if (Number.isNaN(value)) return "—";
  if (Math.abs(value) >= 1_000) {
    return `${(value / 1_000).toFixed(2)}k`;
  }
  return value.toFixed(4);
}

export default function LiveRewardsTable() {
  const [rows, setRows] = useState<LiveReward[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const controllerRef = useRef<AbortController | null>(null);

  const stopStream = useCallback(() => {
    controllerRef.current?.abort();
    controllerRef.current = null;
    setIsStreaming(false);
  }, []);

  const startStream = useCallback(async () => {
    if (isStreaming) return;

    const controller = new AbortController();
    controllerRef.current = controller;
    const decoder = new TextDecoder();
    let buffer = "";

    setRows([]);
    setError(null);
    setIsStreaming(true);

    try {
      const response = await fetch("/api/validator-stream/all", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
      });

      if (!response.body) {
        throw new Error("Streaming body missing");
      }

      const reader = response.body.getReader();
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const chunks = buffer.split("\n\n");
        buffer = chunks.pop() ?? "";

        for (const chunk of chunks) {
          const dataLine = chunk
            .split("\n")
            .find((line) => line.startsWith("data:"));
          if (!dataLine) continue;

          const payloadText = dataLine.replace(/^data:\s*/, "");
          try {
            const payload = JSON.parse(payloadText);
            if (payload.type === "reward") {
              const balances =
                payload.data?.EVM?.TransactionBalances ??
                payload.data?.data?.EVM?.TransactionBalances ??
                [];
              balances.forEach((entry: any) => {
                const reward =
                  Number(entry.reward ?? entry.reward_native ?? 0) || 0;
                const rewardUsd =
                  Number(entry.reward_usd ?? entry.rewardUSD ?? 0) || 0;
                const address = entry.TokenBalance?.Address ?? "Unknown";
                const txHash = entry.Transaction?.Hash ?? "—";
                const timestamp = entry.Block?.Time;

                setRows((prev) => {
                  const next = [
                    {
                      id: crypto.randomUUID(),
                      address,
                      reward,
                      rewardUsd,
                      txHash,
                      timestamp,
                    },
                    ...prev,
                  ];
                  return next.slice(0, 25);
                });
              });
            } else if (payload.type === "error") {
              setError(payload.message ?? "Stream error.");
            }
          } catch (err) {
            console.error("Stream parse error", err);
          }
        }
      }
    } catch (err) {
      if (!(err instanceof DOMException && err.name === "AbortError")) {
        setError(
          err instanceof Error ? err.message : "Streaming error occurred.",
        );
      }
    } finally {
      controllerRef.current = null;
      setIsStreaming(false);
    }
  }, [isStreaming]);

  const statusLabel = useMemo(() => {
    return isStreaming ? "Live" : error ? "Stopped" : "Idle";
  }, [isStreaming, error]);

  return (
    <section className="rounded-3xl border border-zinc-100 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/70">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-emerald-500">
            Network-wide stream
          </p>
          <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white">
            Live validator rewards
          </h2>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-wide">
          <span
            className={`inline-flex items-center gap-2 rounded-full px-3 py-1 ${
              isStreaming
                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300"
                : "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-200"
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                isStreaming ? "bg-emerald-500" : "bg-amber-500"
              }`}
            />
            {statusLabel}
          </span>
          <button
            type="button"
            onClick={isStreaming ? stopStream : startStream}
            className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white transition ${
              isStreaming
                ? "bg-rose-500 hover:bg-rose-600"
                : "bg-emerald-600 hover:bg-emerald-700"
            }`}
          >
            {isStreaming ? "Stop stream" : "Start stream"}
          </button>
        </div>
      </div>

      {error && (
        <p className="mt-4 rounded-2xl border border-rose-200 bg-rose-50/60 px-4 py-3 text-sm text-rose-700 dark:border-rose-500/40 dark:bg-rose-500/10 dark:text-rose-200">
          {error}
        </p>
      )}

      <div className="mt-6 overflow-x-auto rounded-2xl border border-zinc-100 dark:border-zinc-800">
        <table className="min-w-full divide-y divide-zinc-100 text-sm dark:divide-zinc-800">
          <thead className="bg-zinc-50/70 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:bg-zinc-900/40">
            <tr>
              <th className="px-4 py-3">Validator</th>
              <th className="px-4 py-3">Reward (ETH)</th>
              <th className="px-4 py-3">Reward (USD)</th>
              <th className="px-4 py-3">Tx hash</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-6 text-center text-sm text-zinc-500"
                >
                  {isStreaming
                    ? "Listening for live validator rewards…"
                    : "Click start stream to begin listening."}
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id}>
                  <td className="px-4 py-3 font-mono text-xs text-zinc-600 dark:text-zinc-300">
                    {row.address}
                  </td>
                  <td className="px-4 py-3 font-semibold text-zinc-900 dark:text-white">
                    {formatNumber(row.reward)}
                  </td>
                  <td className="px-4 py-3 text-zinc-600 dark:text-zinc-300">
                    ${formatNumber(row.rewardUsd)}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-emerald-600 dark:text-emerald-300">
                    <Link href={`https://etherscan.io/tx/${row.txHash ?? ""}`} target="_blank" rel="noopener noreferrer">{row.txHash ?? "—"}</Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

