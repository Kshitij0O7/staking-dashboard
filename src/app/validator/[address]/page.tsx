'use client';

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import MonitorWalletButton from "@/components/monitor-wallet-button";
import type { TransactionBalance } from "@/types/staking";

function formatNumber(value?: string, digits = 4) {
  if (!value) return "—";
  const num = Number(value);
  if (Number.isNaN(num)) return value;
  return num.toFixed(digits);
}

function summarizeRewards(list: TransactionBalance[]) {
  return list.reduce(
    (acc, item) => {
      acc.totalNative += Number(item.Total_tip_native ?? 0);
      acc.totalUsd += Number(item.Total_tip_usd ?? 0);
      acc.blocks += Number(item.number_of_tips ?? 0);
      return acc;
    },
    { totalNative: 0, totalUsd: 0, blocks: 0 },
  );
}

export default function ValidatorDetail() {
  const params = useParams<{ address?: string }>();

  const address = params?.address ?? "";

  const [balances, setBalances] = useState<TransactionBalance[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reloadFlag, setReloadFlag] = useState(0);

  useEffect(() => {
    if (!address) {
      return;
    }

    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/validator", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ address }),
        });

        if (!response.ok) {
          const payload = await response.json().catch(() => ({}));
          throw new Error(payload.error ?? "Failed to load validator data.");
        }

        const payload = await response.json();
        if (!cancelled) {
          setBalances(payload.balances ?? []);
        }
      } catch (err) {
        if (!cancelled) {
          setBalances([]);
          setError(
            err instanceof Error ? err.message : "Failed to load validator data.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [address, reloadFlag]);

  const latest = balances[0];
  const summary = useMemo(() => summarizeRewards(balances), [balances]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-50 via-white to-zinc-100 px-6 py-12 font-sans text-zinc-900 dark:from-black dark:via-zinc-950 dark:to-black dark:text-white">
      <div className="mx-auto flex max-w-5xl flex-col gap-8">
        <header className="rounded-3xl border border-zinc-100/80 bg-white/70 p-8 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/70">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-emerald-500">
                Validator overview
              </p>
              <h1 className="mt-3 text-2xl font-semibold">{address}</h1>
              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                Network · Ethereum
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setReloadFlag((prev) => prev + 1)}
                className="rounded-full border border-emerald-500 px-4 py-2 text-sm font-semibold text-emerald-600 transition hover:bg-emerald-50 dark:border-emerald-400 dark:text-emerald-300 dark:hover:bg-emerald-400/10"
              >
                {loading ? "Refreshing…" : "Load latest data"}
              </button>
              <Link
                href="/"
                className="rounded-full border border-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-600 transition hover:border-zinc-400 hover:text-zinc-900 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-500 dark:hover:text-white"
              >
                ← Back to dashboard
              </Link>
              <Link
                href="https://ide.bitquery.io/total-tips-received-by-a-validator-in-last-24-hrs_1/?utm_source=github&utm_medium=referral&utm_campaign=staking-dashboard"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-emerald-500 px-4 py-2 text-sm font-semibold text-emerald-600 transition hover:bg-emerald-50 dark:border-emerald-400 dark:text-emerald-300 dark:hover:bg-emerald-400/10"
              >
                Get API
              </Link>
            </div>
            {/*
            <Link
              href="/"
              className="rounded-full border border-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-600 transition hover:border-zinc-400 hover:text-zinc-900 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-500 dark:hover:text-white"
            >
              ← Back to dashboard
            </Link>
            <Link
              href="https://ide.bitquery.io/total-tips-received-by-a-validator-in-last-24-hrs_1/?utm_source=github&utm_medium=referral&utm_campaign=staking-dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-emerald-500 px-4 py-2 text-sm font-semibold text-emerald-600 transition hover:bg-emerald-50 dark:border-emerald-400 dark:text-emerald-300 dark:hover:bg-emerald-400/10"
            >
              Get API
            </Link> */}
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-zinc-100 bg-white/80 p-4 text-sm shadow-sm dark:border-zinc-800 dark:bg-zinc-950/50">
              <p className="text-zinc-500">Total tips (native)</p>
              <p className="mt-2 text-2xl font-semibold">
                {summary.totalNative.toFixed(4)}
              </p>
            </div>
            <div className="rounded-2xl border border-zinc-100 bg-white/80 p-4 text-sm shadow-sm dark:border-zinc-800 dark:bg-zinc-950/50">
              <p className="text-zinc-500">Total tips (USD)</p>
              <p className="mt-2 text-2xl font-semibold">
                ${summary.totalUsd.toFixed(2)}
              </p>
            </div>
            <div className="rounded-2xl border border-zinc-100 bg-white/80 p-4 text-sm shadow-sm dark:border-zinc-800 dark:bg-zinc-950/50">
              <p className="text-zinc-500">Blocks rewarded</p>
              <p className="mt-2 text-2xl font-semibold">{summary.blocks}</p>
            </div>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-zinc-100 bg-white/70 p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/70">
            <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
              Latest reward
            </p>
            {loading ? (
              <p className="mt-4 text-sm text-zinc-500">Loading rewards…</p>
            ) : latest ? (
              <div className="mt-4 space-y-3 text-sm">
                <div>
                  <p className="text-zinc-500">Native tips</p>
                  <p className="text-2xl font-semibold text-zinc-900 dark:text-white">
                    {formatNumber(latest.Total_tip_native, 6)}
                  </p>
                </div>
                <div>
                  <p className="text-zinc-500">USD tips</p>
                  <p className="text-2xl font-semibold text-zinc-900 dark:text-white">
                    ${formatNumber(latest.Total_tip_usd, 2)}
                  </p>
                </div>
                <div className="rounded-2xl border border-zinc-100 bg-zinc-50/70 p-4 text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-zinc-300">
                  <p className="font-semibold text-zinc-900 dark:text-white">
                    Balance shift
                  </p>
                  <p>Pre: {formatNumber(latest.Pre)}</p>
                  <p>Post: {formatNumber(latest.Post)}</p>
                </div>
              </div>
            ) : (
              <p className="mt-4 text-sm text-zinc-500">
                {error
                  ? `Unable to load rewards: ${error}`
                  : "No historical rewards captured for this validator in the selected timeframe."}
              </p>
            )}
          </div>

          <MonitorWalletButton address={address} />
        </section>

        <section className="rounded-3xl border border-zinc-100 bg-white/70 p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/70">
          <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
            Reward history
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full divide-y divide-zinc-100 text-sm dark:divide-zinc-800">
              <thead className="bg-zinc-50/70 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:bg-zinc-900/40">
                <tr>
                  <th className="px-4 py-3">Native</th>
                  <th className="px-4 py-3">USD</th>
                  <th className="px-4 py-3">Pre</th>
                  <th className="px-4 py-3">Post</th>
                  <th className="px-4 py-3 text-right">Tips</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {loading ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-6 text-center text-sm text-zinc-500"
                    >
                      Loading rewards…
                    </td>
                  </tr>
                ) : balances.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-6 text-center text-sm text-zinc-500"
                    >
                      {error
                        ? `Unable to load data: ${error}`
                        : "No reward events found for this validator."}
                    </td>
                  </tr>
                ) : (
                  balances.slice(0, 20).map((item, idx) => (
                    <tr key={`${item.Post}-${idx}`}>
                      <td className="px-4 py-3 font-semibold text-zinc-900 dark:text-white">
                        {formatNumber(item.Total_tip_native, 6)}
                      </td>
                      <td className="px-4 py-3 text-zinc-600 dark:text-zinc-300">
                        ${formatNumber(item.Total_tip_usd, 2)}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-zinc-500">
                        {formatNumber(item.Pre, 4)}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-zinc-500">
                        {formatNumber(item.Post, 4)}
                      </td>
                      <td className="px-4 py-3 text-right font-medium">
                        {item.number_of_tips ?? "—"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}

