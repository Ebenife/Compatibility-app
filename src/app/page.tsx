import {
  Card,
  Disclaimer,
  PrimaryButton,
  RiskMeter,
} from "@/components/ui";
import { Benefits, DetailSteps, SneakPeek } from "@/components/benefits";

/** Benefit card: gradient frame + white spotlight window, title + copy below. */
function BenefitCard({
  miniTitle,
  miniBody,
  points,
  metric,
  cta,
  title,
  body,
}: {
  miniTitle: string;
  miniBody: string;
  points: [string, string];
  metric: { k: string; v: string };
  cta: { label: string; href: string };
  title: string;
  body: string;
}) {
  return (
    <div>
      <div className="rounded-3xl bg-gradient-to-b from-emerald-700 via-emerald-600 to-emerald-800 p-4 sm:p-5">
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold text-stone-500">GenoCheck Spotlight</p>
            <div className="flex gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-stone-300" />
              <span className="h-1.5 w-1.5 rounded-full bg-stone-300" />
            </div>
          </div>
          <p className="mt-3 flex items-center gap-1.5 text-sm font-black text-stone-900">
            <span className="h-2 w-2 rounded-full bg-emerald-600" />
            {miniTitle}
          </p>
          <p className="mt-1.5 text-xs leading-5 text-stone-600">{miniBody}</p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="rounded-xl bg-stone-50 p-2.5">
              <p className="text-[10px] font-bold tracking-wide text-stone-400">HOW IT HELPS</p>
              {points.map((pt) => (
                <p key={pt} className="mt-1 text-[11px] font-semibold leading-4 text-stone-700">
                  ✓ {pt}
                </p>
              ))}
            </div>
            <div className="rounded-xl bg-stone-50 p-2.5">
              <p className="text-[10px] font-bold tracking-wide text-stone-400">AT A GLANCE</p>
              <p className="mt-1 text-[11px] text-stone-500">{metric.k}</p>
              <p className="text-sm font-black text-stone-900">{metric.v}</p>
            </div>
          </div>
          <a
            href={cta.href}
            className="mt-3 inline-block rounded-full bg-stone-900 px-4 py-1.5 text-xs font-bold text-white transition hover:bg-stone-700"
          >
            {cta.label}
          </a>
        </div>
      </div>
      <h3 className="mt-4 text-base font-black text-stone-900">{title}</h3>
      <p className="mt-1.5 text-sm leading-6 text-stone-600">{body}</p>
    </div>
  );
}

/** Hero illustration: two partners linked to a compatibility verdict. Hand-drawn inline SVG. */
function HeroGraphic() {
  return (
    <div
      aria-hidden
      className="relative mx-auto w-full max-w-md overflow-hidden rounded-3xl border border-stone-200 bg-gradient-to-b from-amber-50 via-white to-emerald-50 p-5 shadow-sm"
    >
      <svg viewBox="0 0 360 190" className="w-full">
        {/* soft background blobs */}
        <circle cx="40" cy="30" r="46" fill="#f5f0e8" />
        <circle cx="325" cy="160" r="52" fill="#e8f3ec" />
        <circle cx="320" cy="30" r="10" fill="#f3e2c7" />
        <circle cx="36" cy="162" r="8" fill="#d9e9de" />
        {/* connection arc */}
        <path
          d="M110 78 Q180 30 250 78"
          fill="none"
          stroke="#a8a29e"
          strokeWidth="2.5"
          strokeDasharray="7 6"
          strokeLinecap="round"
        />
        {/* left figure */}
        <circle cx="104" cy="92" r="30" fill="#1c1917" />
        <circle cx="104" cy="84" r="11" fill="#f2c9a4" />
        <path d="M88 112 Q104 96 120 112 L120 122 L88 122 Z" fill="#f2c9a4" />
        <path d="M88 112 Q104 96 120 112 L120 122 L88 122 Z" fill="#000" opacity="0.08" />
        {/* right figure */}
        <circle cx="256" cy="92" r="30" fill="#1c1917" />
        <circle cx="256" cy="84" r="11" fill="#8a5a3b" />
        <path d="M240 112 Q256 96 272 112 L272 122 L240 122 Z" fill="#8a5a3b" />
        {/* heart with check */}
        <g transform="translate(180,72)">
          <path
            d="M0 10 C -14 -4 -28 4 0 24 C 28 4 14 -4 0 10 Z"
            fill="#059669"
            transform="scale(1.4) translate(0,-6)"
          />
          <path
            d="M-5 8 L-1 12 L6 4"
            fill="none"
            stroke="#fff"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
        {/* genotype pills */}
        <g>
          <rect x="66" y="132" width="76" height="34" rx="17" fill="#fff" stroke="#e7e5e4" />
          <text x="104" y="147" textAnchor="middle" fontSize="13" fontWeight="800" fill="#1c1917">AS</text>
          <text x="104" y="159" textAnchor="middle" fontSize="9" fill="#78716c">YOU</text>
        </g>
        <g>
          <rect x="218" y="132" width="76" height="34" rx="17" fill="#fff" stroke="#e7e5e4" />
          <text x="256" y="147" textAnchor="middle" fontSize="13" fontWeight="800" fill="#1c1917">AA</text>
          <text x="256" y="159" textAnchor="middle" fontSize="9" fill="#78716c">PARTNER</text>
        </g>
        {/* verdict pill */}
        <g>
          <rect x="118" y="8" width="124" height="26" rx="13" fill="#1c1917" />
          <text x="180" y="25" textAnchor="middle" fontSize="11" fontWeight="700" fill="#fff">
            ✓ Compatible pairing
          </text>
        </g>
      </svg>
      <div className="mt-2">
        <RiskMeter level="compatible" />
      </div>
    </div>
  );
}

export default function Landing() {
  return (
    <>
      {/* ---- HERO ---- */}
      <section className="grid items-center gap-10 py-8 sm:py-12 lg:grid-cols-2">
        <div>
          <span className="inline-block rounded-full bg-stone-900 px-3 py-1 text-[11px] font-bold tracking-wide text-white">
            GENOTYPE + RH COMPATIBILITY · NIGERIA
          </span>
          <h1 className="mt-4 text-3xl font-black leading-tight tracking-tight text-stone-900 sm:text-4xl">
            Know your match before you plan a family
          </h1>
          <p className="mt-3 text-sm leading-6 text-stone-600 sm:text-base sm:leading-7">
            Upload your official genotype / blood-group result, get a
            plain-language read of what you&apos;re compatible with, and — if
            you want — check one specific pairing and see your options with
            real providers and costs.
          </p>
          <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
            <PrimaryButton href="/upload">Start — upload your result</PrimaryButton>
          </div>
          <p className="mt-3 text-xs text-stone-500">
            Free test build · No account · Documents deleted after reading
          </p>
        </div>
        <HeroGraphic />
      </section>

      {/* ---- HOW IT WORKS ---- */}
      {/* ---- BENEFITS WE OFFER ---- */}
      <section className="mt-14 sm:mt-16">
        <p className="text-center text-xs font-bold tracking-widest text-emerald-700">
          ● KEY BENEFITS
        </p>
        <h2 className="mt-2 text-center text-2xl font-black tracking-tight text-stone-900 sm:text-3xl">
          Benefits we offer
        </h2>
        <p className="mx-auto mt-2 max-w-md text-center text-sm leading-6 text-stone-500">
          Built for one job: clear, private answers about genotype compatibility —
          and honest next steps when they matter.
        </p>
        <div className="mx-auto mt-8 grid max-w-2xl gap-6 sm:grid-cols-2">
          <BenefitCard
            miniTitle="Answers in minutes"
            miniBody="No appointment, no waiting room — from upload to plain-language result in about five minutes."
            points={["Upload or type your result", "Plain-language read"]}
            metric={{ k: "Time needed", v: "5 min" }}
            cta={{ label: "Start now", href: "/upload" }}
            title="Fast, when timing matters"
            body="Family conversations can't wait for a hospital queue. Get your read the same day you get your lab slip."
          />
          <BenefitCard
            miniTitle="Real next steps"
            miniBody="If a pairing carries risk: your options described, real providers listed, indicative costs shown."
            points={["Options library", "Provider directory"]}
            metric={{ k: "Providers listed", v: "8" }}
            cta={{ label: "Browse consults", href: "/consult" }}
            title="Never a dead end"
            body="Every result leads somewhere useful — described, never prescribed, with dated costs to compare."
          />
        </div>
      </section>

      {/* ---- BENEFITS ---- */}
      <Benefits />

      {/* ---- DETAIL ---- */}
      <DetailSteps />

      {/* ---- WHAT A RESULT LOOKS LIKE ---- */}
      <SneakPeek />

      {/* ---- DOES / DOES NOT ---- */}
      <section className="mt-14 grid gap-4 sm:mt-16 sm:grid-cols-2">
        <Card>
          <h2 className="text-sm font-bold text-stone-900">What this tool does</h2>
          <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-6 text-stone-700">
            <li>Reads your lab-issued genotype and blood-group document.</li>
            <li>Explains in plain language what your result means.</li>
            <li>Shows which genotypes you are compatible with — with or without a partner.</li>
            <li>Optionally checks one specific pairing and lays out next steps and real costs.</li>
          </ul>
        </Card>
        <Card>
          <h2 className="text-sm font-bold text-stone-900">What it does NOT do</h2>
          <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-6 text-stone-700">
            <li>It does not test you — you need an existing lab result.</li>
            <li>It does not diagnose any condition or give medical advice.</li>
            <li>It does not replace a doctor, a repeat lab test, or a genetic counselor.</li>
            <li>It never recommends one provider over another.</li>
          </ul>
        </Card>
      </section>

      <Disclaimer />
    </>
  );
}
