"use client";

import { useState } from "react";
import Link from "next/link";
import { ProbabilityBar, VerdictBadge } from "@/components/ui";
import { barsFor } from "@/lib/bars";
import type { Genotype } from "@/lib/compatibility";

type Tab = "solo" | "partner";

const TABS: { id: Tab; label: string }[] = [
  { id: "solo", label: "On your own" },
  { id: "partner", label: "With a partner" },
];

function SoloArt() {
  return (
    <svg viewBox="0 0 120 96" className="h-24 w-28 shrink-0" aria-hidden>
      <rect x="14" y="8" width="68" height="80" rx="8" fill="#fff" stroke="#e7e5e4" strokeWidth="2" />
      <rect x="24" y="20" width="30" height="8" rx="4" fill="#1c1917" />
      <rect x="24" y="34" width="48" height="6" rx="3" fill="#e7e5e4" />
      <rect x="24" y="44" width="48" height="6" rx="3" fill="#e7e5e4" />
      <rect x="24" y="54" width="34" height="6" rx="3" fill="#e7e5e4" />
      <circle cx="88" cy="72" r="18" fill="#059669" />
      <path d="M80 72 L86 78 L97 66" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PartnerArt() {
  return (
    <svg viewBox="0 0 120 96" className="h-24 w-28 shrink-0" aria-hidden>
      <circle cx="38" cy="48" r="24" fill="#1c1917" />
      <circle cx="38" cy="42" r="9" fill="#f2c9a4" />
      <path d="M24 64 Q38 52 52 64 L52 72 L24 72 Z" fill="#f2c9a4" />
      <circle cx="84" cy="48" r="24" fill="#44403c" />
      <circle cx="84" cy="42" r="9" fill="#8a5a3b" />
      <path d="M70 64 Q84 52 98 64 L98 72 L70 72 Z" fill="#8a5a3b" />
      <path d="M56 48 h10" stroke="#059669" strokeWidth="4" strokeLinecap="round" strokeDasharray="1 5" />
    </svg>
  );
}

/** Sneak peek: guided Q&A mock — one question, one path forward. */
const PEeks: {
  id: string;
  pair: string;
  a: Genotype;
  b: Genotype;
  question: string;
  answer: string;
}[] = [
  {
    id: "aa-as",
    pair: "AA × AS",
    a: "AA",
    b: "AS",
    question: "I'm AA and my partner is AS. Are we compatible?",
    answer:
      "Yes — compatible. Only one side carries S, so no child can have sickle cell disease. About half your children would be AS carriers.",
  },
  {
    id: "aa-ss",
    pair: "AA × SS",
    a: "AA",
    b: "SS",
    question: "I'm AA and my partner is SS. What does that mean?",
    answer:
      "Caution, not alarm. No child will have sickle cell disease — but every child will be an AS carrier, so they'll need to check their own future partner.",
  },
  {
    id: "as-as",
    pair: "AS × AS",
    a: "AS",
    b: "AS",
    question: "We're both AS. Is that a problem?",
    answer:
      "High risk — with each pregnancy there's about a 1 in 4 chance of sickle cell disease. Worth a genetic counseling session before you decide anything.",
  },
];

export function SneakPeek() {
  const [active, setActive] = useState(PEeks[0]);
  return (
    <section className="mt-14 sm:mt-16">
      <div className="grid overflow-hidden rounded-3xl lg:grid-cols-2">
        {/* Left: dark statement panel */}
        <div className="relative flex flex-col justify-end bg-stone-900 p-6 sm:p-8">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{
              background:
                "radial-gradient(circle at 80% 15%, #10b98155 0, transparent 45%), radial-gradient(circle at 10% 90%, #f59e0b33 0, transparent 40%)",
            }}
          />
          <h2 className="relative text-2xl font-black leading-snug tracking-tight text-white sm:text-3xl">
            One question,
            <br />
            one path forward.
          </h2>
          <p className="relative mt-3 max-w-sm text-sm leading-6 text-stone-300">
            Not a verdict from nowhere, but the reasoning behind it — in plain
            words. This is what your result looks like.
          </p>
          <div className="relative mt-5 flex flex-wrap gap-2">
            {PEeks.map((p) => (
              <button
                key={p.id}
                onClick={() => setActive(p)}
                className={`rounded-full px-4 py-2 text-xs font-bold transition ${
                  active.id === p.id
                    ? "bg-white text-stone-900"
                    : "bg-white/10 text-stone-300 hover:bg-white/20"
                }`}
              >
                {p.pair}
              </button>
            ))}
          </div>
        </div>

        {/* Right: chat thread panel */}
        <div className="flex flex-col gap-3 bg-stone-100 p-6 sm:p-8" key={active.id}>
          <div className="flex justify-end">
            <div className="max-w-[85%] rounded-2xl rounded-br-md bg-white px-4 py-3 text-sm leading-6 text-stone-800 shadow-sm">
              {active.question}
            </div>
          </div>
          <div className="flex items-end gap-2">
            <span
              aria-hidden
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-xs font-black text-white"
            >
              G
            </span>
            <div className="max-w-[85%] rounded-2xl rounded-bl-md bg-stone-900 px-4 py-3 text-sm leading-6 text-white shadow-sm">
              {active.answer}
            </div>
          </div>
          <div className="ml-10 rounded-2xl bg-white p-4 shadow-sm">
            <div className="mb-2 flex items-center gap-2">
              <VerdictBadge
                level={
                  active.id === "aa-as"
                    ? "compatible"
                    : active.id === "aa-ss"
                      ? "caution"
                      : "high-risk"
                }
              />
              <span className="text-xs font-bold text-stone-500">{active.pair}</span>
            </div>
            <ProbabilityBar segments={barsFor(active.a, active.b)} />
          </div>
        </div>
      </div>
    </section>
  );
}
import type { ReactNode } from "react";

/** Detailed steps: clickable list, each step shows its own illustration. */
const STEPS: {
  title: string;
  body: string;
  href: string;
  cta: string;
  art: ReactNode;
}[] = [
  {
    title: "Upload your official result",
    body: "A photo or PDF of your lab slip — or just type the result in manually. Nothing is stored; documents are deleted after reading.",
    href: "/upload",
    cta: "Upload",
    art: (
      <svg viewBox="0 0 120 96" className="h-24 w-full" aria-hidden>
        <rect x="30" y="6" width="60" height="78" rx="8" fill="#fff" stroke="#e7e5e4" strokeWidth="2.5" />
        <rect x="40" y="18" width="26" height="8" rx="4" fill="#1c1917" />
        <rect x="40" y="31" width="40" height="6" rx="3" fill="#e7e5e4" />
        <rect x="40" y="41" width="40" height="6" rx="3" fill="#e7e5e4" />
        <rect x="40" y="51" width="26" height="6" rx="3" fill="#e7e5e4" />
        <circle cx="82" cy="68" r="16" fill="#059669" />
        <path d="M75 68 L80 73 L90 62" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Confirm what was read",
    body: "The system shows back every field — genotype, blood group, Rh — for you to verify or correct. Low-confidence reads are flagged, never assumed.",
    href: "/upload",
    cta: "How confirming works",
    art: (
      <svg viewBox="0 0 120 96" className="h-24 w-full" aria-hidden>
        <rect x="14" y="14" width="92" height="22" rx="8" fill="#d1fae5" />
        <path d="M24 25 L29 30 L39 19" fill="none" stroke="#059669" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="48" y="21" width="48" height="6" rx="3" fill="#065f46" opacity="0.5" />
        <rect x="14" y="42" width="92" height="22" rx="8" fill="#fef3c7" />
        <path d="M60 48 v8 M60 60 v.5" stroke="#b45309" strokeWidth="3.5" strokeLinecap="round" />
        <rect x="48" y="49" width="48" height="6" rx="3" fill="#92400e" opacity="0.4" />
      </svg>
    ),
  },
  {
    title: "See your own result",
    body: "Your plain-language genotype and Rh read, plus who you're compatible with — complete on its own, no partner required.",
    href: "/profile",
    cta: "See a result",
    art: (
      <svg viewBox="0 0 120 96" className="h-24 w-full" aria-hidden>
        <circle cx="60" cy="34" r="22" fill="#1c1917" />
        <text x="60" y="42" textAnchor="middle" fontSize="17" fontWeight="800" fill="#fff">AS</text>
        <rect x="24" y="64" width="72" height="12" rx="6" fill="#e7e5e4" />
        <rect x="24" y="64" width="36" height="12" rx="6" fill="#059669" />
      </svg>
    ),
  },
  {
    title: "Bring in a partner",
    body: "Send them a private invite link so they check on their own — or add their result on their behalf, with their permission.",
    href: "/partner",
    cta: "Partner options",
    art: (
      <svg viewBox="0 0 120 96" className="h-24 w-full" aria-hidden>
        <circle cx="40" cy="46" r="20" fill="#1c1917" />
        <circle cx="40" cy="41" r="8" fill="#f2c9a4" />
        <path d="M28 60 Q40 50 52 60 L52 66 L28 66 Z" fill="#f2c9a4" />
        <circle cx="82" cy="46" r="20" fill="#44403c" />
        <circle cx="82" cy="41" r="8" fill="#8a5a3b" />
        <path d="M70 60 Q82 50 94 60 L94 66 L70 66 Z" fill="#8a5a3b" />
        <path d="M56 46 h10" stroke="#059669" strokeWidth="4" strokeLinecap="round" strokeDasharray="1 5" />
      </svg>
    ),
  },
  {
    title: "Get the pairing read",
    body: "Compatible, caution or high-risk — with the reasoning, your options, real providers and indicative costs.",
    href: "/consult",
    cta: "Providers & costs",
    art: (
      <svg viewBox="0 0 120 96" className="h-24 w-full" aria-hidden>
        <rect x="14" y="18" width="92" height="14" rx="7" fill="#e7e5e4" />
        <rect x="14" y="18" width="30" height="14" rx="7" fill="#059669" />
        <rect x="48" y="18" width="30" height="14" rx="7" fill="#f59e0b" />
        <rect x="14" y="40" width="92" height="10" rx="5" fill="#e7e5e4" />
        <rect x="14" y="40" width="46" height="10" rx="5" fill="#059669" />
        <rect x="14" y="56" width="92" height="10" rx="5" fill="#e7e5e4" />
        <rect x="14" y="56" width="23" height="10" rx="5" fill="#dc2626" />
      </svg>
    ),
  },
];

export function DetailSteps() {
  const [open, setOpen] = useState(0);
  const step = STEPS[open];
  return (
    <section className="mt-14 sm:mt-16">
      <p className="text-xs font-bold tracking-widest text-stone-400">IN DETAIL</p>
      <h2 className="mt-1 text-xl font-bold text-stone-900">Step by step</h2>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <ol className="grid gap-2">
          {STEPS.map((s, i) => (
            <li key={s.title}>
              <button
                onClick={() => setOpen(i)}
                aria-expanded={open === i}
                className={`flex w-full items-center gap-3 rounded-2xl border p-4 text-left transition ${
                  open === i
                    ? "border-stone-900 bg-stone-900 text-white shadow-sm"
                    : "border-stone-200 bg-white text-stone-900 hover:border-stone-400"
                }`}
              >
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-black ${
                    open === i ? "bg-white text-stone-900" : "bg-stone-100 text-stone-600"
                  }`}
                >
                  {i + 1}
                </span>
                <span className="text-sm font-bold">{s.title}</span>
              </button>
            </li>
          ))}
        </ol>
        <div key={open} className="flex flex-col justify-between rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
          <div>
            <div className="rounded-xl bg-stone-50 p-3">{step.art}</div>
            <h3 className="mt-4 text-base font-bold text-stone-900">{step.title}</h3>
            <p className="mt-1.5 text-sm leading-6 text-stone-600">{step.body}</p>
          </div>
          <div className="mt-5">
            <Link
              href={step.href}
              className="inline-flex items-center justify-center rounded-xl bg-stone-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-stone-700"
            >
              {step.cta} →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Benefits() {
  const [tab, setTab] = useState<Tab>("solo");
  const idx = TABS.findIndex((t) => t.id === tab);

  function step(dir: 1 | -1) {
    const next = (idx + dir + TABS.length) % TABS.length;
    setTab(TABS[next].id);
  }

  return (
    <section className="mt-14 sm:mt-16">
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Left: light interactive card */}
        <div className="rounded-3xl bg-stone-100 p-6 sm:p-8">
          <h2 className="text-2xl font-black tracking-tight text-stone-900 sm:text-3xl">
            2 ways to check.
          </h2>
          <div className="mt-4 flex gap-2">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`rounded-full px-4 py-2 text-xs font-bold transition ${
                  tab === t.id
                    ? "bg-white text-stone-900 shadow-sm"
                    : "text-stone-400 hover:text-stone-600"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {tab === "solo" ? (
            <h3 className="mt-6 text-xl font-black leading-snug text-stone-900">
              Your own answers,
              <br />
              in five minutes.
            </h3>
          ) : (
            <h3 className="mt-6 text-xl font-black leading-snug text-stone-900">
              Bring them in,
              <br />
              without awkwardness.
            </h3>
          )}

          <div className="mt-4 flex items-stretch gap-3">
            <div className="flex items-center rounded-2xl bg-white p-2 shadow-sm">
              {tab === "solo" ? <SoloArt /> : <PartnerArt />}
            </div>
            <div className="flex-1 rounded-2xl bg-white p-4 shadow-sm">
              <p className="text-xs font-bold text-stone-400">
                {tab === "solo" ? "01" : "02"}
              </p>
              <p className="mt-1 text-xs font-bold leading-5 text-stone-900">
                {tab === "solo"
                  ? "Upload your slip or type your result — get the full read with no partner needed."
                  : "Send them a private link, or add their result yourself — you both see the pairing."}
              </p>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between">
            <div className="flex gap-1.5">
              {TABS.map((t) => (
                <span
                  key={t.id}
                  className={`h-1.5 rounded-full transition-all ${
                    tab === t.id ? "w-5 bg-stone-900" : "w-1.5 bg-stone-300"
                  }`}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => step(-1)}
                aria-label="Previous"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-sm font-bold text-stone-700 shadow-sm hover:bg-stone-200"
              >
                ‹
              </button>
              <button
                onClick={() => step(1)}
                aria-label="Next"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-sm font-bold text-stone-700 shadow-sm hover:bg-stone-200"
              >
                ›
              </button>
            </div>
          </div>
        </div>

        {/* Right: dark statement card */}
        <div className="flex flex-col justify-end rounded-3xl bg-stone-900 p-6 sm:p-8">
          <svg viewBox="0 0 200 90" className="mb-4 w-40 opacity-90" aria-hidden>
            <circle cx="60" cy="45" r="30" fill="#fff" opacity="0.12" />
            <circle cx="60" cy="38" r="11" fill="#f2c9a4" />
            <path d="M42 66 Q60 50 78 66 L78 75 L42 75 Z" fill="#f2c9a4" />
            <circle cx="140" cy="45" r="30" fill="#fff" opacity="0.12" />
            <circle cx="140" cy="38" r="11" fill="#8a5a3b" />
            <path d="M122 66 Q140 50 158 66 L158 75 L122 75 Z" fill="#8a5a3b" />
            <path
              d="M100 30 C 94 22 84 26 100 40 C 116 26 106 22 100 30 Z"
              fill="#10b981"
            />
          </svg>
          <h2 className="text-2xl font-black leading-snug tracking-tight text-white sm:text-3xl">
            Know where you stand, before the big conversation.
          </h2>
          <p className="mt-3 text-sm leading-6 text-stone-300">
            Your result, your pairing read, and your options — in plain
            language, with real providers and costs. No account, no waiting room.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <Link
              href="/upload"
              className="rounded-full bg-white px-5 py-2.5 text-sm font-bold text-stone-900 transition hover:bg-stone-200"
            >
              Start now
            </Link>
            <span className="px-2 text-xs font-semibold text-stone-400">
              5 minutes · Free test build
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
