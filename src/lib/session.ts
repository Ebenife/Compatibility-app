// Client-side session + invite helpers (PRD §5: no accounts, token-based
// invites with no expiry; a newer invite replaces the older one).

import type { Abo, Genotype, Rh } from "./compatibility";

export interface PersonRecord {
  genotype: Genotype | "";
  abo: Abo;
  rh: Rh;
  labName: string;
  labDate: string;
  source: "upload" | "manual" | "invite";
  confidence: "high" | "low" | "manual";
  /** Free text when the document shows something outside AA/AS/AC/SS/SC. */
  rareNote: string;
}

export const emptyPerson = (): PersonRecord => ({
  genotype: "",
  abo: "unknown",
  rh: "unknown",
  labName: "",
  labDate: "",
  source: "manual",
  confidence: "manual",
  rareNote: "",
});

export interface Session {
  own: PersonRecord;
  partner: PersonRecord;
  partnerSet: boolean;
  inviteToken: string | null;
  inviteCompleted: boolean;
  acceptedRisk: boolean;
}

const KEY = "gcc.session.v1";

const DEFAULTS: Session = {
  own: emptyPerson(),
  partner: emptyPerson(),
  partnerSet: false,
  inviteToken: null,
  inviteCompleted: false,
  acceptedRisk: false,
};

export function loadSession(): Session {
  if (typeof window === "undefined") return structuredClone(DEFAULTS);
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return structuredClone(DEFAULTS);
    return { ...structuredClone(DEFAULTS), ...JSON.parse(raw) };
  } catch {
    return structuredClone(DEFAULTS);
  }
}

export function saveSession(s: Session) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    /* storage full/blocked — app still works for the session */
  }
}

export function clearSession() {
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}

export function newToken(): string {
  const bytes = new Uint8Array(12);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => b.toString(36))
    .join("")
    .replace(/[^a-z0-9]/gi, "")
    .slice(0, 16)
    .padEnd(16, "x")
    .toLowerCase();
}

/** Stateless invite link: carries the inviter's confirmed profile + token. */
export function buildInviteLink(profile: PersonRecord, token: string): string {
  const params = new URLSearchParams({
    g: profile.genotype,
    abo: profile.abo,
    rh: profile.rh,
    t: token,
  });
  const base =
    typeof window !== "undefined" ? window.location.origin : "https://example.com";
  return `${base}/invite?${params.toString()}`;
}

/** Encodes a partner result as a short share-back code for manual entry. */
export function encodeShareBack(p: PersonRecord): string {
  return `${p.genotype || "?"}|${p.rh}|${p.abo}`;
}

export function decodeShareBack(code: string): PersonRecord | null {
  const parts = code.trim().toUpperCase().split("|");
  if (parts.length !== 3) return null;
  const [g, rh, abo] = parts;
  if (!["AA", "AS", "AC", "SS", "SC"].includes(g)) return null;
  if (!["POSITIVE", "NEGATIVE", "UNKNOWN"].includes(rh)) return null;
  if (!["O", "A", "B", "AB", "UNKNOWN"].includes(abo)) return null;
  return {
    ...emptyPerson(),
    genotype: g as Genotype,
    rh: rh.toLowerCase() as Rh,
    abo: abo as Abo,
    source: "invite",
    confidence: "manual",
  };
}
