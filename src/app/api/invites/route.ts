import { NextResponse } from "next/server";

// Best-effort invite token store for this test build (PRD §5).
// Single-instance in-memory map: valid on one server instance, which is fine
// for local dev. The primary invite mechanism is stateless (profile + token
// encoded in the link URL), so pairing works even when this store is
// unreachable — this API only powers "superseded / already completed" states.
// For multi-instance production, replace with the minimal Supabase table
// described in PRD §10 (token, status, created_at).

type Status = "valid" | "superseded" | "completed";
const store = new Map<string, Status>();

declare global {
  // eslint-disable-next-line no-var
  var __gccInvites: Map<string, Status> | undefined;
}
const invites =
  globalThis.__gccInvites ?? (globalThis.__gccInvites = new Map<string, Status>());
void store;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token") ?? "";
  const status = invites.get(token);
  if (!status) return NextResponse.json({ status: "unknown" });
  return NextResponse.json({ status });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const { action, token, previousToken } = body as {
    action?: string;
    token?: string;
    previousToken?: string;
  };
  if (typeof token !== "string" || token.length < 8) {
    return NextResponse.json({ error: "bad token" }, { status: 400 });
  }
  if (action === "create") {
    // A new invite supersedes the previous one (PRD §3/§6).
    if (typeof previousToken === "string" && invites.has(previousToken)) {
      invites.set(previousToken, "superseded");
    }
    invites.set(token, "valid");
    return NextResponse.json({ status: "valid" });
  }
  if (action === "complete") {
    if (invites.get(token) === "valid") invites.set(token, "completed");
    return NextResponse.json({ status: invites.get(token) ?? "unknown" });
  }
  return NextResponse.json({ error: "unknown action" }, { status: 400 });
}
