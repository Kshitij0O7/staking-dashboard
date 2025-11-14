"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

type TokenFormProps = {
  initialToken?: string;
  onTokenSave: (token: string) => void;
};

export default function TokenForm({
  initialToken = "",
  onTokenSave,
}: TokenFormProps) {
  const [token, setToken] = useState(initialToken);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const cleaned = token.trim();
    if (!cleaned) {
      setError("Please enter a valid Bitquery access token.");
      return;
    }

    localStorage.setItem("bitquery_token", cleaned);
    onTokenSave(cleaned);
  };

  return (
    <form
      onSubmit={onSubmit}
      className="w-full max-w-xl space-y-4 rounded-3xl border border-zinc-200/80 bg-white/80 p-8 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/70"
    >
      <div>
        <p className="text-xs uppercase tracking-[0.4em] text-emerald-500">
          Bitquery Access
        </p>
        <h2 className="mt-3 text-2xl font-semibold text-zinc-900 dark:text-white">
          Provide your Bitquery token
        </h2>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
          Your token is stored locally in this browser (LocalStorage) and used to
          authenticate requests to Bitquery for this session.
        </p>
      </div>
      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-200">
        Access token
        <input
          type="password"
          value={token}
          onChange={(event) => setToken(event.target.value)}
          placeholder="ory_at_..."
          className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white/80 px-4 py-3 font-mono text-sm text-zinc-900 shadow-sm focus:border-emerald-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
        />
      </label>
      {error && <p className="text-sm text-rose-500">{error}</p>}
      <div className="space-y-3">
        <button
          type="submit"
          className="w-full rounded-full bg-emerald-600 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
        >
          Save token & continue
        </button>
        <Link
          href="https://account.bitquery.io/user/api_v2/access_tokens/?utm_source=github&utm_medium=referral&utm_campaign=staking-dashboard"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-full items-center justify-center rounded-full border border-emerald-600 px-4 py-3 text-sm font-semibold text-emerald-600 transition hover:bg-emerald-50 dark:border-emerald-400 dark:text-emerald-300 dark:hover:bg-emerald-400/10"
        >
          Get Your Bitquery Token
        </Link>
      </div>
    </form>
  );
}

