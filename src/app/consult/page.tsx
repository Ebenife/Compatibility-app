"use client";

import { useState } from "react";
import {
  BackLink,
  Card,
  Disclaimer,
  ListingNote,
  PageTitle,
  ReviewPending,
} from "@/components/ui";
import {
  CONTENT_AS_OF,
  COST_RANGES,
  PROVIDERS,
} from "@/lib/content";
import type { ProviderArea, ProviderPath } from "@/lib/content";

const PATH_LABEL: Record<ProviderPath | "all", string> = {
  all: "All paths",
  counseling: "Genetic counseling",
  fertility: "Fertility / PGD-IVF",
  hematology: "Haematology / SCD care",
};

const AREAS: (ProviderArea | "All")[] = ["All", "Lagos", "Abuja", "Ibadan", "General"];

export default function ConsultPage() {
  const [path, setPath] = useState<ProviderPath | "all">("all");
  const [area, setArea] = useState<ProviderArea | "All">("All");
  const [query, setQuery] = useState("");

  const q = query.trim().toLowerCase();
  const filtered = PROVIDERS.filter(
    (p) =>
      (path === "all" || p.paths.includes(path)) &&
      (area === "All" || p.area === area) &&
      (!q || `${p.name} ${p.detail}`.toLowerCase().includes(q))
  );

  return (
    <>
      <BackLink href="/" label="Home" />
      <PageTitle
        title="Consults & costs"
        sub="Hand-picked starting points in your general area — several options per path, never a single recommendation. Contact them yourself and compare."
      />

      <div className="mb-4 flex flex-wrap gap-2">
        {(Object.keys(PATH_LABEL) as (ProviderPath | "all")[]).map((k) => (
          <button
            key={k}
            onClick={() => setPath(k)}
            className={`rounded-full px-4 py-2 text-xs font-semibold ${
              path === k
                ? "bg-stone-900 text-white"
                : "border border-stone-300 bg-white text-stone-700"
            }`}
          >
            {PATH_LABEL[k]}
          </button>
        ))}
      </div>
      <div className="mb-6 flex flex-wrap gap-2">
        {AREAS.map((a) => (
          <button
            key={a}
            onClick={() => setArea(a)}
            className={`rounded-full px-4 py-2 text-xs font-semibold ${
              area === a
                ? "bg-stone-900 text-white"
                : "border border-stone-300 bg-white text-stone-700"
            }`}
          >
            {a === "All" ? "All areas" : a}
          </button>
        ))}
      </div>

      <div className="mb-4">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by keyword — e.g. sickle cell, IVF, Ibadan…"
          className="w-full rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900"
        />
      </div>

      <p className="mb-3 text-xs font-semibold text-stone-500">
        {filtered.length} {filtered.length === 1 ? "provider" : "providers"} found
        {area !== "All" ? ` in ${area}` : ""}
      </p>

      {filtered.length === 0 ? (
        <Card>
          <p className="text-sm leading-6 text-stone-700">
            We don&apos;t have listings for this area yet — a hematologist or
            fertility clinic at the nearest teaching hospital is the right starting
            point. Ask your doctor for a referral.
          </p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filtered.map((p) => (
            <Card key={p.name}>
              <div className="flex items-start gap-3">
                <span
                  aria-hidden
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-stone-900 text-sm font-bold text-white"
                >
                  {p.name.charAt(0)}
                </span>
                <div className="min-w-0">
                  <h2 className="text-sm font-bold text-stone-900">{p.name}</h2>
                  <p className="mt-0.5 text-xs font-semibold text-stone-500">{p.area}</p>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {p.paths.map((x) => (
                      <span
                        key={x}
                        className="rounded-full bg-stone-100 px-2 py-0.5 text-[11px] font-semibold text-stone-700"
                      >
                        {PATH_LABEL[x]}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <p className="mt-3 text-sm leading-6 text-stone-700">{p.detail}</p>
            </Card>
          ))}
        </div>
      )}

      <h2 className="mb-3 mt-8 text-base font-bold text-stone-900">
        Indicative cost ranges
      </h2>
      <Card>
        <ul className="divide-y divide-stone-200">
          {COST_RANGES.map((c) => (
            <li key={c.path} className="py-3 first:pt-0 last:pb-0">
              <p className="text-sm font-semibold text-stone-900">{c.path}</p>
              <p className="mt-0.5 text-sm font-bold text-stone-800">{c.range}</p>
              <p className="mt-0.5 text-xs leading-5 text-stone-500">{c.note}</p>
            </li>
          ))}
        </ul>
        <p className="mt-4 rounded-xl bg-amber-50 p-3 text-xs leading-5 text-amber-900">
          <span className="font-semibold">As of {CONTENT_AS_OF} — confirm directly with provider. </span>
          These are indicative ranges, never quotes. Prices change; always get a
          written breakdown before committing.
        </p>
      </Card>

      <ListingNote />
      <ReviewPending />
      <Disclaimer />
    </>
  );
}
