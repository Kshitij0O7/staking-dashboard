"use client";

import Link from "next/link";
import type { TransactionBalance } from "@/types/staking";
import type { DashboardData } from "@/types/dashboard";
import LiveRewardsTable from "@/components/live-rewards-table";

type DashboardProps = {
  data: DashboardData;
  onReload?: () => void;
  isLoading?: boolean;
};

function formatNumber(value?: string, digits = 2) {
  if (!value) return "—";
  const num = Number(value);
  if (Number.isNaN(num)) return value;
  if (num > 1000) return `${(num / 1000).toFixed(digits)}k`;
  return num.toFixed(digits);
}

function ValidatorTable({ items }: { items: TransactionBalance[] }) {
  return (
    <section className="rounded-2xl border border-zinc-100 bg-white/70 p-6 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/70">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-wide text-zinc-500">
            Network
          </p>
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
            Ethereum · Top Validators
          </h2>
        </div>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300">
          Live data
        </span>
      </div>
      <div className="mt-6 overflow-hidden rounded-xl border border-zinc-100 dark:border-zinc-800">
        <table className="min-w-full divide-y divide-zinc-100 text-sm dark:divide-zinc-800">
          <thead className="bg-zinc-50/70 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:bg-zinc-900/40">
            <tr>
              <th className="px-4 py-3">Validator</th>
              <th className="px-4 py-3">Tips (Native)</th>
              <th className="px-4 py-3">Tips (USD)</th>
              <th className="px-4 py-3 text-right">Blocks</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {items.map((item, idx) => (
              <tr key={`${item.TokenBalance?.Address}-${idx}`}>
                <td className="px-4 py-3 font-mono text-xs text-zinc-600 dark:text-zinc-300">
                  {item.TokenBalance?.Address ? (
                    <Link
                      href={`/validator/${item.TokenBalance.Address}`}
                      className="text-emerald-600 underline-offset-4 hover:underline dark:text-emerald-300"
                    >
                      {item.TokenBalance.Address}
                    </Link>
                  ) : (
                    "Unknown"
                  )}
                </td>
                <td className="px-4 py-3 font-semibold text-zinc-900 dark:text-white">
                  {formatNumber(item.Total_tip_native, 4)}{" "}
                  {item.TokenBalance?.Currency?.Symbol ?? ""}
                </td>
                <td className="px-4 py-3 text-zinc-600 dark:text-zinc-300">
                  ${formatNumber(item.Total_tip_usd)}
                </td>
                <td className="px-4 py-3 text-right font-medium text-zinc-900 dark:text-white">
                  {item.number_of_tips ?? "—"}
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-6 text-center text-sm text-zinc-500"
                >
                  No data available. Ensure BITQUERY_TOKEN is configured on the server.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default function DashboardShell({
  data,
  onReload,
  isLoading,
}: DashboardProps) {
  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-50 via-white to-zinc-100 px-6 py-12 font-sans text-zinc-900 dark:from-black dark:via-zinc-950 dark:to-black dark:text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <header className="rounded-3xl border border-zinc-100/80 bg-white/70 p-8 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/70">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm uppercase tracking-[0.3em] text-emerald-500">
              Staking Rewards
            </p>
            <div className="flex gap-3">
              {onReload && (
                <button
                  type="button"
                  onClick={onReload}
                  className="rounded-full border border-emerald-500 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-emerald-600 transition hover:bg-emerald-50 dark:border-emerald-400 dark:text-emerald-300 dark:hover:bg-emerald-400/10"
                >
                  {isLoading ? "Refreshing…" : "Load latest data"}
                </button>
              )}
              <Link
                href="https://ide.bitquery.io/top-validators-by-total-tips-in-last-24-hrs/?utm_source=github&utm_medium=referral&utm_campaign=staking-dashboard"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-emerald-500 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-emerald-600 transition hover:bg-emerald-50 dark:border-emerald-400 dark:text-emerald-300 dark:hover:bg-emerald-400/10"
              >
                Get API
              </Link>
            </div>
          </div>
          <h1 className="mt-3 text-4xl font-bold tracking-tight">
            Real-time validator intelligence dashboard
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-zinc-600 dark:text-zinc-300">
            Powered by the{" "}
            <Link
              href="https://github.com/Kshitij0O7/staking-rewards-api"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-emerald-600 underline-offset-4 hover:underline dark:text-emerald-300"
            >
              staking-rewards-api
            </Link>{" "}
            SDK. Monitor leaderboards, earnings, and validator performance on
            Ethereum for past 24 hours using Bitquery&apos;s Transaction Balance API.
          </p>
          <div className="mt-6">
            <LiveRewardsTable />
          </div>
        </header>

        {data.spotlight && (
          <section className="grid gap-6 rounded-3xl border border-zinc-100 bg-gradient-to-br from-emerald-50 via-white to-white p-8 shadow-sm dark:border-zinc-800 dark:from-emerald-500/10 dark:via-zinc-900 dark:to-zinc-900">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-emerald-500">
                Spotlight validator · Ethereum
              </p>
              <h2 className="mt-2 text-2xl font-semibold">
                {data.spotlight.TokenBalance?.Address ?? "Top performer"}
              </h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <article className="rounded-2xl border border-emerald-100 bg-white/80 p-4 text-sm shadow-sm dark:border-emerald-500/30 dark:bg-zinc-900">
                <p className="text-zinc-500">Total tips (native)</p>
                <p className="mt-2 text-3xl font-semibold text-zinc-900 dark:text-white">
                  {formatNumber(data.spotlight.Total_tip_native, 4)}{" "}
                  {data.spotlight.TokenBalance?.Currency?.Symbol}
                </p>
              </article>
              <article className="rounded-2xl border border-emerald-100 bg-white/80 p-4 text-sm shadow-sm dark:border-emerald-500/30 dark:bg-zinc-900">
                <p className="text-zinc-500">Total tips (USD)</p>
                <p className="mt-2 text-3xl font-semibold text-zinc-900 dark:text-white">
                  ${formatNumber(data.spotlight.Total_tip_usd, 2)}
                </p>
              </article>
              <article className="rounded-2xl border border-emerald-100 bg-white/80 p-4 text-sm shadow-sm dark:border-emerald-500/30 dark:bg-zinc-900">
                <p className="text-zinc-500">Blocks rewarded</p>
                <p className="mt-2 text-3xl font-semibold text-zinc-900 dark:text-white">
                  {data.spotlight.number_of_tips ?? "—"}
                </p>
              </article>
            </div>
          </section>
        )}

        <ValidatorTable items={data.top} />
      </div>
    </main>
  );
}

