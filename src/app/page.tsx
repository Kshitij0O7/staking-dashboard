"use client";

import { useEffect, useState } from "react";
import DashboardShell from "@/components/dashboard-shell";
import TokenForm from "@/components/token-form";
import type { DashboardData } from "@/types/dashboard";

export default function Home() {
  const [token, setToken] = useState<string | null>(null);
  const [tokenReady, setTokenReady] = useState(false);
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("bitquery_token");
    if (stored) {
      setToken(stored);
    }
    setTokenReady(true);
  }, []);

  useEffect(() => {
    if (!token) {
      setData(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch("/api/dashboard", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
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
  }, [token]);

  const handleTokenSave = (value: string) => {
    setToken(value);
  };

  const handleTokenReset = () => {
    localStorage.removeItem("bitquery_token");
    setToken(null);
    setData(null);
  };

  if (!tokenReady) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-zinc-50 via-white to-zinc-100 px-6 py-16 font-sans text-zinc-900 dark:from-black dark:via-zinc-950 dark:to-black dark:text-white">
        <p className="text-sm text-zinc-500">Initializing dashboard…</p>
      </main>
    );
  }

  if (!token) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-zinc-50 via-white to-zinc-100 px-6 py-16 font-sans text-zinc-900 dark:from-black dark:via-zinc-950 dark:to-black dark:text-white">
        <TokenForm onTokenSave={handleTokenSave} />
      </main>
    );
  }

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
                onClick={() => setToken(null)}
                className="underline"
              >
                re-enter token
              </button>
            </p>
          )}
        </div>
      </main>
    );
  }

  return <DashboardShell data={data} onResetToken={handleTokenReset} />;
}
