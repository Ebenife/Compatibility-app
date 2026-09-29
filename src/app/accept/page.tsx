"use client";

import { useState } from "react";
import {
  BackLink,
  Card,
  Disclaimer,
  PageTitle,
  PrimaryButton,
  SecondaryButton,
} from "@/components/ui";
import { loadSession, saveSession } from "@/lib/session";

export default function AcceptPage() {
  const [checked, setChecked] = useState(false);
  const [done, setDone] = useState(() => {
    try {
      return loadSession().acceptedRisk;
    } catch {
      return false;
    }
  });

  function acknowledge() {
    const s = loadSession();
    s.acceptedRisk = true;
    saveSession(s);
    setDone(true);
  }

  return (
    <>
      <BackLink href="/pairing" label="Pairing result" />
      <PageTitle
        title="Proceeding with open eyes"
        sub="This page is an acknowledgment for yourself — not a legal waiver, and it unlocks nothing. It exists so you can move forward informed."
      />
      <Card>
        <p className="text-sm leading-6 text-stone-700">
          You&apos;ve seen that this pairing carries a real chance of sickle cell
          disease in each pregnancy. Choosing to proceed anyway is a legitimate
          choice many couples make — what matters is that it&apos;s an informed one,
          with medical support lined up early.
        </p>
        <h2 className="mt-4 text-sm font-bold text-stone-900">
          Talk to your doctor about:
        </h2>
        <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-6 text-stone-700">
          <li>Preconception counseling with a genetic counselor before pregnancy.</li>
          <li>Early antenatal booking and prenatal testing options, if you want them.</li>
          <li>What newborn screening and early care would look like for your baby.</li>
          <li>Connecting with a haematologist now, not after a crisis.</li>
        </ul>
        <p className="mt-3 text-xs text-stone-500">
          These are prompts for a conversation with your doctor — not prescribed steps.
        </p>
        {!done ? (
          <div className="mt-5">
            <label className="flex items-start gap-2 text-sm leading-6 text-stone-800">
              <input
                type="checkbox"
                checked={checked}
                onChange={(e) => setChecked(e.target.checked)}
                className="mt-1.5"
              />
              <span>
                I understand the chance described in my pairing result, and I want to
                proceed with this knowledge and appropriate medical support.
              </span>
            </label>
            <div className="mt-4">
              <PrimaryButton disabled={!checked} onClick={acknowledge}>
                I understand — record my acknowledgment
              </PrimaryButton>
            </div>
          </div>
        ) : (
          <div className="mt-5 rounded-xl border border-emerald-300 bg-emerald-50 p-4 text-sm text-emerald-900">
            Acknowledged. Wishing you well — the consult list below is there whenever
            you need it.
          </div>
        )}
        <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
          <SecondaryButton href="/consult">Find consults &amp; costs</SecondaryButton>
          <SecondaryButton href="/options">Reconsider other paths</SecondaryButton>
        </div>
      </Card>
      <Disclaimer />
    </>
  );
}
