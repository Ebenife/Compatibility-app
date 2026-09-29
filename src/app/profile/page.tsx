"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Card,
  Disclaimer,
  DocNotice,
  PageTitle,
  PrimaryButton,
  SecondaryButton,
  Stepper,
  VerdictBadge,
} from "@/components/ui";
import { getSingleProfile, singleRhNote } from "@/lib/compatibility";
import type { Genotype } from "@/lib/compatibility";
import { loadSession } from "@/lib/session";

function ProfileInner() {
  const router = useRouter();
  const params = useSearchParams();
  const [ready, setReady] = useState(false);
  const [own, setOwn] = useState(loadSession().own);

  useEffect(() => {
    const s = loadSession();
    if (!s.own.genotype && !params.get("unsupported")) {
      router.replace("/upload");
      return;
    }
    setOwn(s.own);
    setReady(true);
  }, [router, params]);

  if (!ready) return <p className="text-sm text-stone-500">Loading…</p>;

  if (!own.genotype) {
    return (
      <>
        <Stepper active={2} />
        <PageTitle title="Your result isn't covered here" />
        <Card>
          <p className="text-sm leading-6 text-stone-700">
            Your slip shows{" "}
            <span className="font-semibold">
              {own.rareNote ? `“${own.rareNote}”` : "something outside AA, AS, AC, SS and SC"}
            </span>
            . This tool only covers those five genotypes, so it cannot give you a
            verdict — and it won&apos;t guess. Please take your original slip to a
            haematologist or genetic counselor, who can interpret rare variants
            properly.
          </p>
          <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
            <SecondaryButton href="/consult">Find a specialist to talk to</SecondaryButton>
            <SecondaryButton href="/upload">Start over</SecondaryButton>
          </div>
        </Card>
        <DocNotice />
        <Disclaimer />
      </>
    );
  }

  const profile = getSingleProfile(own.genotype as Genotype);
  const rhLabel =
    own.rh === "unknown" ? "not recorded" : own.rh === "positive" ? "Rh-positive" : "Rh-negative";
  const aboLabel = own.abo === "unknown" ? "" : `Blood group ${own.abo} · `;

  return (
    <>
      <Stepper active={2} />
      <PageTitle
        title={`Your result: ${own.genotype}`}
        sub={`${aboLabel}${rhLabel}${own.labName ? ` · ${own.labName}` : ""}${own.labDate ? ` · ${own.labDate}` : ""}`}
      />

      <Card>
        <VerdictBadge level={own.genotype === "AA" ? "compatible" : own.genotype === "SS" || own.genotype === "SC" ? "caution" : "compatible"} />
        <h2 className="mt-3 text-base font-bold text-stone-900">{profile.heading}</h2>
        <p className="mt-2 text-sm leading-6 text-stone-700">{profile.meaning}</p>
        <h3 className="mt-4 text-sm font-bold text-stone-900">Who you&apos;re compatible with</h3>
        <p className="mt-1 text-sm leading-6 text-stone-700">{profile.compatibleWith}</p>
        <p className="mt-3 rounded-xl bg-stone-100 p-4 text-sm leading-6 text-stone-700">{profile.note}</p>
      </Card>

      <Card className="mt-4">
        <h2 className="text-sm font-bold text-stone-900">Your Rh note</h2>
        <p className="mt-1 text-sm leading-6 text-stone-700">{singleRhNote(own.rh)}</p>
      </Card>

      <Card className="mt-4">
        <h2 className="text-sm font-bold text-stone-900">That&apos;s the full single-person result</h2>
        <p className="mt-1 text-sm leading-6 text-stone-700">
          Nothing past this point is required. If you have a partner in mind, you can
          check that specific pairing next — either by inviting them to upload their
          own document, or by adding their result on their behalf.
        </p>
        <div className="mt-4 flex flex-col gap-2.5 sm:flex-row">
          <PrimaryButton href="/partner">Bring in a partner (optional)</PrimaryButton>
          <SecondaryButton href="/consult">Browse consults &amp; costs</SecondaryButton>
        </div>
      </Card>

      <DocNotice />
      <Disclaimer />
    </>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<p className="text-sm text-stone-500">Loading…</p>}>
      <ProfileInner />
    </Suspense>
  );
}
