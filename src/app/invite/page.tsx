"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Card,
  Disclaimer,
  DocNotice,
  PageTitle,
  PrimaryButton,
  SecondaryButton,
  Field,
  VerdictBadge,
  inputCls,
} from "@/components/ui";
import { getPairing, getRhNote } from "@/lib/compatibility";
import type { Abo, Genotype, Rh } from "@/lib/compatibility";
import { encodeShareBack } from "@/lib/session";

const GENO = ["AA", "AS", "AC", "SS", "SC"];

function InviteInner() {
  const params = useSearchParams();
  const [phase, setPhase] = useState<"loading" | "form" | "done" | "invalid">("loading");
  const [invalidReason, setInvalidReason] = useState("");
  const [inviterG, setInviterG] = useState("");
  const [inviterRh, setInviterRh] = useState("unknown");
  const [token, setToken] = useState("");

  const [genotype, setGenotype] = useState("");
  const [abo, setAbo] = useState("unknown");
  const [rh, setRh] = useState("unknown");

  useEffect(() => {
    const g = (params.get("g") ?? "").toUpperCase();
    const rh = (params.get("rh") ?? "unknown").toLowerCase();
    const t = params.get("t") ?? "";
    if (!GENO.includes(g) || !t) {
      setPhase("invalid");
      setInvalidReason("This invite link is incomplete. Please ask the person who invited you to send a fresh link.");
      return;
    }
    setInviterG(g);
    setInviterRh(rh);
    setToken(t);
    // Already completed on this device?
    try {
      const done = window.localStorage.getItem(`gcc.invite.done.${t}`);
      if (done) {
        const rec = JSON.parse(done);
        setGenotype(rec.genotype);
        setAbo(rec.abo);
        setRh(rec.rh);
        setPhase("done");
        return;
      }
    } catch {
      /* ignore */
    }
    // Best-effort server check: is this token superseded/completed?
    fetch(`/api/invites?token=${encodeURIComponent(t)}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.status === "superseded") {
          setPhase("invalid");
          setInvalidReason(
            "A newer invite was sent, so this link no longer works. Please ask for the latest link."
          );
        } else if (d.status === "completed") {
          setPhase("invalid");
          setInvalidReason("This invite has already been completed. If that wasn't you, ask for a fresh link.");
        } else {
          setPhase("form");
        }
      })
      .catch(() => setPhase("form")); // offline/different instance → allow flow
  }, [params]);

  function submit() {
    try {
      window.localStorage.setItem(
        `gcc.invite.done.${token}`,
        JSON.stringify({ genotype, abo, rh })
      );
    } catch {
      /* ignore */
    }
    fetch("/api/invites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "complete", token }),
    }).catch(() => {});
    setPhase("done");
  }

  if (phase === "loading") return <p className="text-sm text-stone-500">Opening your invite…</p>;

  if (phase === "invalid") {
    return (
      <>
        <PageTitle title="This invite link doesn't work" sub={invalidReason} />
        <Card>
          <p className="text-sm leading-6 text-stone-700">
            Only the most recent invite is ever valid. Ask the person who invited you
            to generate a new link from their screen.
          </p>
        </Card>
        <Disclaimer />
      </>
    );
  }

  if (phase === "done") {
    const pairing = getPairing(inviterG as Genotype, genotype as Genotype);
    const rhNote = getRhNote(inviterRh as Rh, rh as Rh);
    const code = encodeShareBack({
      genotype: genotype as Genotype,
      abo: abo as Abo,
      rh: rh as Rh,
      labName: "",
      labDate: "",
      source: "invite",
      confidence: "manual",
      rareNote: "",
    });
    return (
      <>
        <PageTitle title="Your pairing result" sub={`Their genotype: ${inviterG} · Yours: ${genotype}`} />
        <Card>
          <VerdictBadge level={pairing.level} />
          <h2 className="mt-3 text-base font-bold text-stone-900">{pairing.title}</h2>
          <p className="mt-2 text-sm leading-6 text-stone-700">{pairing.why}</p>
          <p className="mt-3 rounded-xl bg-stone-100 p-4 text-sm text-stone-700">
            <span className="font-semibold">Likely pattern: </span>
            {pairing.childPattern}
          </p>
          {rhNote.show && (
            <p className="mt-3 rounded-xl bg-sky-50 p-4 text-sm leading-6 text-sky-900">{rhNote.text}</p>
          )}
        </Card>
        <Card className="mt-4">
          <h2 className="text-sm font-bold text-stone-900">Pass your result back</h2>
          <p className="mt-1 text-sm leading-6 text-stone-600">
            Send this code to the person who invited you so their screen can show the
            same pairing. They never see your document — only this result.
          </p>
          <p className="mt-3 rounded-xl bg-stone-900 p-4 text-center text-lg font-bold tracking-widest text-white">
            {code}
          </p>
          <div className="mt-4 flex flex-col gap-2.5 sm:flex-row">
            {(pairing.level === "caution" || pairing.level === "high-risk") && (
              <SecondaryButton href="/options">See your options</SecondaryButton>
            )}
            <SecondaryButton href="/consult">Browse consults &amp; costs</SecondaryButton>
          </div>
        </Card>
        <DocNotice />
        <Disclaimer />
      </>
    );
  }

  return (
    <>
      <PageTitle
        title="You've been invited to check compatibility"
        sub={`Your partner's confirmed genotype is ${inviterG}. Add your own result below — you'll both get the pairing read, and they will never see your document.`}
      />
      <Card>
        <div className="grid gap-4">
          <Field label="Your haemoglobin genotype">
            <select value={genotype} onChange={(e) => setGenotype(e.target.value)} className={inputCls}>
              <option value="">Select…</option>
              <option value="AA">AA</option>
              <option value="AS">AS</option>
              <option value="AC">AC</option>
              <option value="SS">SS</option>
              <option value="SC">SC</option>
            </select>
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Your blood group">
              <select value={abo} onChange={(e) => setAbo(e.target.value)} className={inputCls}>
                <option value="unknown">Don&apos;t know</option>
                <option value="O">O</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="AB">AB</option>
              </select>
            </Field>
            <Field label="Your Rh">
              <select value={rh} onChange={(e) => setRh(e.target.value)} className={inputCls}>
                <option value="unknown">Don&apos;t know</option>
                <option value="positive">Positive (+)</option>
                <option value="negative">Negative (−)</option>
              </select>
            </Field>
          </div>
          <p className="text-xs text-stone-500">
            Prefer to upload your lab slip instead? Save the invite link — document
            upload for partners is coming to this page next; for now manual entry
            gives the same checked result.
          </p>
          <PrimaryButton disabled={!genotype} onClick={submit}>
            Show our pairing result
          </PrimaryButton>
        </div>
      </Card>
      <DocNotice />
      <Disclaimer />
    </>
  );
}

export default function InvitePage() {
  return (
    <Suspense fallback={<p className="text-sm text-stone-500">Opening your invite…</p>}>
      <InviteInner />
    </Suspense>
  );
}
