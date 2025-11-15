"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

type Props = {
  address: string;
};

type StreamLog = {
  id: string;
  message: string;
};

export default function MonitorWalletButton({ address }: Props) {
  const [isStreaming, setIsStreaming] = useState(false);
  const [logs, setLogs] = useState<StreamLog[]>([]);
  const [error, setError] = useState<string | null>(null);
  const controllerRef = useRef<AbortController | null>(null);

  const stopStream = useCallback(() => {
    controllerRef.current?.abort();
    controllerRef.current = null;
    setIsStreaming(false);
  }, []);

  useEffect(() => {
    return () => stopStream();
  }, [stopStream]);

  const startStream = async () => {
    setError(null);
    setLogs([]);
    setIsStreaming(true);

    const controller = new AbortController();
    controllerRef.current = controller;
    const decoder = new TextDecoder();
    let buffer = "";

    try {
      const response = await fetch("/api/validator-stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address }),
        signal: controller.signal,
      });

      if (!response.ok || !response.body) {
        throw new Error("Unable to start stream");
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
              setLogs((prev) => [
                {
                  id: crypto.randomUUID(),
                  message: JSON.stringify(payload.data),
                },
                ...prev,
              ]);
            } else if (payload.type === "error") {
              setError(payload.message ?? "Streaming error occurred.");
            }
          } catch {
            // ignore malformed chunk
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
  };

  return (
    <div className="space-y-4 rounded-2xl border border-zinc-200/70 bg-white/80 p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-emerald-500">
            Monitor wallet
          </p>
          <p className="text-lg font-semibold text-zinc-900 dark:text-white">
            Live streaming rewards
          </p>
        </div>
        <button
          type="button"
          onClick={isStreaming ? stopStream : startStream}
          className={`rounded-full px-5 py-2 text-sm font-semibold text-white transition ${
            isStreaming
              ? "bg-rose-500 hover:bg-rose-600"
              : "bg-emerald-600 hover:bg-emerald-700"
          }`}
        >
          {isStreaming ? "Stop monitoring" : "Monitor wallet"}
        </button>
      </div>

      {error && (
        <p className="text-sm text-rose-600 dark:text-rose-400">{error}</p>
      )}
      <Link
        href="https://ide.bitquery.io/monitor-validator-rewards/?utm_source=github&utm_medium=referral&utm_campaign=staking-dashboard"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex w-full items-center justify-center rounded-full border border-emerald-500 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-emerald-600 transition hover:bg-emerald-50 dark:border-emerald-400 dark:text-emerald-300 dark:hover:bg-emerald-400/10"
      >
        Get API
      </Link>

      <div className="max-h-64 overflow-y-auto rounded-xl border border-dashed border-zinc-200 bg-zinc-50/80 p-4 font-mono text-xs text-zinc-600 dark:border-zinc-700 dark:bg-zinc-950/40 dark:text-zinc-300">
        {logs.length === 0 ? (
          <p>No live events captured yet.</p>
        ) : (
          <ul className="space-y-2">
            {logs.map((log) => (
              <li key={log.id}>
                <span className="text-emerald-500">reward · </span>
                {log.message}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

