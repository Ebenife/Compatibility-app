import Link from "next/link";
import type { ReactNode } from "react";
import {
  CLINICAL_REVIEW_NOTE,
  DISCLAIMER_SHORT,
  DOC_NOTICE,
  LISTING_NOTE,
} from "@/lib/content";
import type { VerdictLevel } from "@/lib/compatibility";

export function Container({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-10 sm:py-14">{children}</div>
  );
}

export function TopBar() {
  return (
    <header className="border-b border-stone-200 bg-white">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-3">
        <Link href="/" className="text-sm font-bold tracking-tight text-stone-900">
          GenoCheck <span className="font-normal text-stone-500">· Nigeria</span>
        </Link>
        <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-semibold text-amber-900">
          Test build
        </span>
      </div>
    </header>
  );
}

const STEPS = ["Upload", "Confirm", "Your result", "Partner", "Pairing"];

export function Stepper({ active }: { active: number }) {
  return (
    <ol className="mb-8 flex flex-wrap gap-1.5" aria-label="Progress">
      {STEPS.map((label, i) => {
        const done = i < active;
        const current = i === active;
        return (
          <li
            key={label}
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              current
                ? "bg-stone-900 text-white"
                : done
                  ? "bg-emerald-100 text-emerald-900"
                  : "bg-stone-100 text-stone-500"
            }`}
          >
            {i + 1}. {label}
          </li>
        );
      })}
    </ol>
  );
}

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6 ${className}`}>
      {children}
    </div>
  );
}

export function PageTitle({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="mb-8">
      <h1 className="text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
        {title}
      </h1>
      {sub && <p className="mt-2.5 text-sm leading-7 text-stone-600">{sub}</p>}
    </div>
  );
}

export function BackLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="mb-6 inline-flex items-center gap-1 text-xs font-semibold text-stone-500 transition hover:text-stone-900"
    >
      <span aria-hidden>←</span> {label}
    </Link>
  );
}

export function PrimaryButton({
  children,
  disabled,
  onClick,
  href,
  type,
}: {
  children: ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  href?: string;
  type?: "submit" | "button";
}) {
  const cls =
    "inline-flex items-center justify-center rounded-xl bg-stone-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-stone-700 disabled:cursor-not-allowed disabled:opacity-40";
  if (href && !disabled)
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  return (
    <button type={type ?? "button"} disabled={disabled} onClick={onClick} className={cls}>
      {children}
    </button>
  );
}

export function SecondaryButton({
  children,
  onClick,
  href,
}: {
  children: ReactNode;
  onClick?: () => void;
  href?: string;
}) {
  const cls =
    "inline-flex items-center justify-center rounded-xl border border-stone-300 bg-white px-5 py-3 text-sm font-semibold text-stone-800 transition hover:bg-stone-50";
  if (href)
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  return (
    <button type="button" onClick={onClick} className={cls}>
      {children}
    </button>
  );
}

export function Disclaimer() {
  return (
    <p className="mt-6 rounded-xl bg-stone-100 p-4 text-xs leading-5 text-stone-600">
      <span className="font-semibold text-stone-800">Please note: </span>
      {DISCLAIMER_SHORT}
    </p>
  );
}

export function DocNotice() {
  return (
    <p className="mt-4 flex gap-2 rounded-xl bg-emerald-50 p-4 text-xs leading-5 text-emerald-900">
      <span aria-hidden>🔒</span>
      <span>{DOC_NOTICE}</span>
    </p>
  );
}

export function ReviewPending() {
  return (
    <p className="mt-4 rounded-xl border border-amber-300 bg-amber-50 p-4 text-xs leading-5 text-amber-900">
      <span className="font-semibold">Before launch: </span>
      {CLINICAL_REVIEW_NOTE}
    </p>
  );
}

export function ListingNote() {
  return (
    <p className="mt-4 rounded-xl bg-stone-100 p-4 text-xs leading-5 text-stone-600">
      {LISTING_NOTE}
    </p>
  );
}

const VERDICT_STYLE: Record<VerdictLevel, string> = {
  compatible: "bg-emerald-100 text-emerald-900 border-emerald-300",
  caution: "bg-amber-100 text-amber-900 border-amber-300",
  "high-risk": "bg-red-100 text-red-900 border-red-300",
};

export function VerdictBadge({ level }: { level: VerdictLevel }) {
  const label =
    level === "compatible" ? "Compatible" : level === "caution" ? "Caution" : "High risk";
  return (
    <span
      className={`inline-block rounded-full border px-4 py-1.5 text-sm font-bold ${VERDICT_STYLE[level]}`}
    >
      {label}
    </span>
  );
}

export function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-semibold text-stone-800">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-stone-500">{hint}</span>}
    </label>
  );
}

export const inputCls =
  "w-full rounded-xl border border-stone-300 bg-white px-3 py-2.5 text-sm text-stone-900 outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900";

/* ---- Mobbin-informed additions ---- */

/** Three-band risk meter with a marker on the active level. */
export function RiskMeter({ level }: { level: VerdictLevel }) {
  const bands: { id: VerdictLevel; label: string; bar: string }[] = [
    { id: "compatible", label: "Compatible", bar: "bg-emerald-500" },
    { id: "caution", label: "Caution", bar: "bg-amber-400" },
    { id: "high-risk", label: "High risk", bar: "bg-red-500" },
  ];
  return (
    <div aria-label={`Risk level: ${level}`}>
      <div className="flex h-2.5 gap-1 overflow-hidden rounded-full">
        {bands.map((b) => (
          <div
            key={b.id}
            className={`h-full flex-1 ${b.id === level ? b.bar : "bg-stone-200"}`}
          />
        ))}
      </div>
      <div className="mt-1.5 flex text-[11px] font-semibold">
        {bands.map((b) => (
          <span
            key={b.id}
            className={`flex-1 ${b.id === level ? "text-stone-900" : "text-stone-400"}`}
          >
            {b.label}
          </span>
        ))}
      </div>
    </div>
  );
}

const BAR_TONE: Record<string, string> = {
  good: "bg-emerald-500",
  neutral: "bg-stone-400",
  bad: "bg-red-500",
};

/** Stacked per-pregnancy probability bar with legend. */
export function ProbabilityBar({
  segments,
}: {
  segments: { label: string; pct: number; tone: "good" | "neutral" | "bad" }[];
}) {
  return (
    <div>
      <div className="flex h-4 gap-0.5 overflow-hidden rounded-full bg-stone-100">
        {segments.map((s) => (
          <div
            key={s.label}
            className={`${BAR_TONE[s.tone]}`}
            style={{ width: `${s.pct}%` }}
            title={`${s.label}: ${s.pct}%`}
          />
        ))}
      </div>
      <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
        {segments.map((s) => (
          <li key={s.label} className="flex items-center gap-1.5 text-xs text-stone-600">
            <span className={`h-2.5 w-2.5 rounded-sm ${BAR_TONE[s.tone]}`} />
            {s.label} · {s.pct}%
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Numbered step card (01 / 02 / 03 pattern). */
export function StepCard({
  n,
  title,
  body,
}: {
  n: string;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
      <p className="text-xs font-bold tracking-widest text-stone-400">{n}</p>
      <h3 className="mt-1 text-sm font-bold text-stone-900">{title}</h3>
      <p className="mt-1.5 text-sm leading-6 text-stone-600">{body}</p>
    </div>
  );
}

/** Per-field verification row with a status pill. */
export function VerifyRow({
  label,
  value,
  status,
  children,
}: {
  label: string;
  value: string;
  status: "clear" | "check" | "missing";
  children: ReactNode;
}) {
  const pill =
    status === "clear"
      ? "bg-emerald-100 text-emerald-900"
      : status === "check"
        ? "bg-amber-100 text-amber-900"
        : "bg-stone-200 text-stone-600";
  const pillText =
    status === "clear" ? "Looks clear" : status === "check" ? "Please check" : "Missing";
  return (
    <div className="rounded-xl border border-stone-200 p-3.5">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-semibold text-stone-800">{label}</p>
        <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${pill}`}>
          {pillText}
        </span>
      </div>
      {value && <p className="mt-0.5 text-xs text-stone-500">Read as “{value}”</p>}
      <div className="mt-2">{children}</div>
    </div>
  );
}
