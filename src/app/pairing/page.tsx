"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
import { getPairing, getRhNote, looksLikeDuplicate } from "@/lib/compatibility";
import type { Genotype } from "@/lib/compatibility";
import { loadSession } from "@/lib/session";

export default function PairingPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [own, setOwn] = useState(loadSession().own);
  const [partner, setPartner] = useState(loadSession().partner);

  useEffect(() => {
    const s = loadSession();
    if (!s.own.genotype || !s.partnerSet || !s.partner.genotype) {
      router.replace("/partner");
      return;
    }
    setOwn(s.own);
    setPartner(s.partner);
    setReady(true);
  }, [router]);

  if (!ready) return <p className="text-sm text-stone-500">Loading…</p>;

  const pairing = getPairing(own.genotype as Genotype, partner.genotype as Genotype);
  const rhNote = getRhNote(own.rh, partner.rh);
  const duplicate = looksLikeDuplicate(
    { genotype: own.genotype, rh: own.rh, abo: own.abo },
    { genotype: partner.genotype, rh: partner.rh, abo: partner.abo }
  );
  const needsRiskPath = pairing.level === "caution" || pairing.level === "high-risk";

  return (
    <>
      <Stepper active={4} />
      <PageTitle
        title={`Pairing: ${own.genotype} × ${partner.genotype}`}
        sub="Your specific result, with the actual mechanism in plain terms."
      />
      {duplicate && (
        <div className="mb-4 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
          <span className="font-bold">Possible duplicate: </span>
          both records look identical. If the same document was entered twice, this
          result is meaningless — go back and check.
        </div>
      )}
      <Card>
        <VerdictBadge level={pairing.level} />
        <h2 className="mt-3 text-base font-bold text-stone-900">{pairing.title}</h2>
        <p className="mt-2 text-sm leading-6 text-stone-700">{pairing.why}</p>
        <p className="mt-3 rounded-xl bg-stone-100 p-4 text-sm text-stone-700">
          <span className="font-semibold">Likely pattern: </span>
          {pairing.childPattern}
        </p>
        {rhNote.show && (
          <div className="mt-3 rounded-xl bg-sky-50 p-4">
            <p className="text-sm font-bold text-sky-900">Rh note (pregnancy context)</p>
            <p className="mt-1 text-sm leading-6 text-sky-900">{rhNote.text}</p>
          </div>
        )}
      </Card>

      {needsRiskPath ? (
        <Card className="mt-4">
          <h2 className="text-sm font-bold text-stone-900">This pairing carries risk — two paths from here</h2>
          <p className="mt-1 text-sm leading-6 text-stone-600">
            Neither path is a recommendation. They are simply what exists.
          </p>
          <div className="mt-4 flex flex-col gap-2.5 sm:flex-row">
            <PrimaryButton href="/accept">Proceed, understanding the risk</PrimaryButton>
            <SecondaryButton href="/options">Explore other paths</SecondaryButton>
          </div>
          <div className="mt-3">
            <SecondaryButton href="/consult">Browse consults &amp; costs</SecondaryButton>
          </div>
        </Card>
      ) : (
        <Card className="mt-4">
          <h2 className="text-sm font-bold text-stone-900">Straightforwardly compatible</h2>
          <p className="mt-1 text-sm leading-6 text-stone-600">
            No further steps are needed on genetics — though meeting a genetic
            counselor is still worthwhile if you want to talk anything through.
          </p>
          <div className="mt-4">
            <SecondaryButton href="/consult">Browse consults &amp; costs anyway</SecondaryButton>
          </div>
        </Card>
      )}
      <DocNotice />
      <Disclaimer />
    </>
  );
}
