"use client";

import { useEffect, useState } from "react";
import DashboardShell from "@/components/dashboard-shell";
import type { DashboardData } from "@/types/dashboard";

export default function Home() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reloadFlag, setReloadFlag] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch("/api/dashboard", {
      method: "POST",
    })
      .then(async (response) => {
        if (!response.ok) {
          const message = await response.json().catch(() => ({}));
          throw new Error(message.error ?? "Unable to load dashboard data.");
        }
        return response.json();
      })
      .then((payload: DashboardData) => {
        if (!cancelled) {
          setData(payload);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : String(err));
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [reloadFlag]);

  if (loading || !data) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-zinc-50 via-white to-zinc-100 px-6 py-16 font-sans text-zinc-900 dark:from-black dark:via-zinc-950 dark:to-black dark:text-white">
        <div className="rounded-3xl border border-zinc-200/80 bg-white/80 p-10 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-900/70">
          <p className="text-sm uppercase tracking-[0.3em] text-emerald-500">
            Loading
          </p>
          <p className="mt-3 text-lg text-zinc-600 dark:text-zinc-300">
            Fetching live validator data…
          </p>
          {error && (
            <p className="mt-4 text-sm text-rose-500">
              {error} —{" "}
              <button
                type="button"
                onClick={() => setReloadFlag((prev) => prev + 1)}
                className="underline"
              >
                retry
              </button>
            </p>
          )}
        </div>
      </main>
    );
  }

  return (
    <DashboardShell
      data={data}
      onReload={() => setReloadFlag((prev) => prev + 1)}
      isLoading={loading}
    />
  );
}
