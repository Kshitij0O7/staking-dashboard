import type { NextRequest } from "next/server";
import { runAllValidatorRewardsStreamETH } from "staking-rewards-api";

export const runtime = "nodejs";

const textEncoder = new TextEncoder();

export async function POST(req: NextRequest) {
  const token = process.env.BITQUERY_TOKEN;

  if (!token) {
    return new Response("Bitquery token missing", { status: 500 });
  }

  let socket: WebSocket | null = null;
  let keepAlive: ReturnType<typeof setInterval> | null = null;

  const readable = new ReadableStream({
    start(controller) {
      const send = (payload: Record<string, unknown>) => {
        controller.enqueue(
          textEncoder.encode(`data: ${JSON.stringify(payload)}\n\n`),
        );
      };

      const onError = (error: unknown) => {
        send({
          type: "error",
          message:
            error instanceof Error ? error.message : "Stream error occurred.",
        });
        controller.close();
      };

      runAllValidatorRewardsStreamETH(token, {
        onData: (data) => {
          send({ type: "reward", data });
        },
        onError,
      })
        .then((ws) => {
          socket = ws;
        })
        .catch(onError);

      keepAlive = setInterval(() => {
        controller.enqueue(textEncoder.encode(": keep-alive\n\n"));
      }, 25_000);
    },
    cancel() {
      if (keepAlive) clearInterval(keepAlive);
      socket?.close();
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}

