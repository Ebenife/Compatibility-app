// Structured outcome segments for the stacked probability bar
// (one entry per pairing key, percentages per pregnancy).
import type { Genotype } from "./compatibility";

export interface Bar {
  label: string;
  pct: number;
  tone: "good" | "neutral" | "bad";
}

function key(a: Genotype, b: Genotype): string {
  return [a, b].sort().join("+");
}

const BARS: Record<string, Bar[]> = {
  "AA+AA": [{ label: "AA", pct: 100, tone: "good" }],
  "AA+AS": [
    { label: "AA", pct: 50, tone: "good" },
    { label: "AS carrier", pct: 50, tone: "neutral" },
  ],
  "AA+AC": [
    { label: "AA", pct: 50, tone: "good" },
    { label: "AC carrier", pct: 50, tone: "neutral" },
  ],
  "AA+SS": [{ label: "AS carrier", pct: 100, tone: "neutral" }],
  "AA+SC": [
    { label: "AS carrier", pct: 50, tone: "neutral" },
    { label: "AC carrier", pct: 50, tone: "neutral" },
  ],
  "AS+AS": [
    { label: "SS", pct: 25, tone: "bad" },
    { label: "AS carrier", pct: 50, tone: "neutral" },
    { label: "AA", pct: 25, tone: "good" },
  ],
  "AC+AS": [
    { label: "SC", pct: 25, tone: "bad" },
    { label: "AS carrier", pct: 25, tone: "neutral" },
    { label: "AC carrier", pct: 25, tone: "neutral" },
    { label: "AA", pct: 25, tone: "good" },
  ],
  "AC+AC": [
    { label: "CC", pct: 25, tone: "bad" },
    { label: "AC carrier", pct: 50, tone: "neutral" },
    { label: "AA", pct: 25, tone: "good" },
  ],
  "AS+SS": [
    { label: "SS", pct: 50, tone: "bad" },
    { label: "AS carrier", pct: 50, tone: "neutral" },
  ],
  "AS+SC": [
    { label: "SS", pct: 25, tone: "bad" },
    { label: "SC", pct: 25, tone: "bad" },
    { label: "AS carrier", pct: 25, tone: "neutral" },
    { label: "AC carrier", pct: 25, tone: "neutral" },
  ],
  "AC+SS": [
    { label: "SC", pct: 50, tone: "bad" },
    { label: "AS carrier", pct: 50, tone: "neutral" },
  ],
  "AC+SC": [
    { label: "SC", pct: 25, tone: "bad" },
    { label: "CC", pct: 25, tone: "bad" },
    { label: "AS carrier", pct: 25, tone: "neutral" },
    { label: "AC carrier", pct: 25, tone: "neutral" },
  ],
  "SS+SS": [{ label: "SS", pct: 100, tone: "bad" }],
  "SC+SS": [
    { label: "SS", pct: 50, tone: "bad" },
    { label: "SC", pct: 50, tone: "bad" },
  ],
  "SC+SC": [
    { label: "SS", pct: 25, tone: "bad" },
    { label: "SC", pct: 50, tone: "bad" },
    { label: "CC", pct: 25, tone: "bad" },
  ],
};

export function barsFor(a: Genotype, b: Genotype): Bar[] {
  return BARS[key(a, b)] ?? [];
}
