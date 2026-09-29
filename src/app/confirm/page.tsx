"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BackLink,
  Card,
  Disclaimer,
  PageTitle,
  PrimaryButton,
  Stepper,
  Field,
  VerifyRow,
  inputCls,
} from "@/components/ui";
import { loadSession, saveSession } from "@/lib/session";
import type { Abo, Genotype, Rh } from "@/lib/compatibility";

export default function ConfirmPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [genotype, setGenotype] = useState("");
  const [abo, setAbo] = useState("unknown");
  const [rh, setRh] = useState("unknown");
  const [labName, setLabName] = useState("");
  const [labDate, setLabDate] = useState("");
  const [confidence, setConfidence] = useState("low");
  const [rareNote, setRareNote] = useState("");

  useEffect(() => {
    const s = loadSession();
    if (!s.own.genotype && !s.own.rareNote) {
      router.replace("/upload");
      return;
    }
    setGenotype(s.own.genotype);
    setAbo(s.own.abo);
    setRh(s.own.rh);
    setLabName(s.own.labName);
    setLabDate(s.own.labDate);
    setConfidence(s.own.confidence);
    setRareNote(s.own.rareNote);
    setReady(true);
  }, [router]);

  if (!ready) return <p className="text-sm text-stone-500">Loading…</p>;

  const unsupported = genotype === "OTHER" || genotype === "UNKNOWN" || genotype === "";

  function confirm() {
    const s = loadSession();
    s.own = {
      ...s.own,
      genotype: (GENOTYPES.includes(genotype as Genotype) ? genotype : "") as Genotype | "",
      abo: abo as Abo,
      rh: rh as Rh,
      labName,
      labDate,
      rareNote,
    };
    saveSession(s);
    router.push(unsupported ? "/profile?unsupported=1" : "/profile");
  }

  return (
    <>
      <BackLink href="/upload" label="Upload" />
      <Stepper active={1} />
      <PageTitle
        title="Check what we read"
        sub="Nothing is used until you confirm it. Correct anything that's wrong — a wrong letter here changes the whole result."
      />
      <Card>
        {confidence === "low" && (
          <div className="mb-4 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
            <span className="font-bold">Low-confidence read. </span>
            Parts of your document were hard to read, so every field below needs your
            explicit confirmation — nothing has been assumed.
          </div>
        )}
        {confidence === "high" && (
          <div className="mb-4 rounded-xl border border-emerald-300 bg-emerald-50 p-4 text-sm leading-6 text-emerald-900">
            High-confidence read — still, please verify each field before continuing.
          </div>
        )}
        <div className="grid gap-3">
          <VerifyRow
            label="1 · Haemoglobin genotype"
            value={genotype && GENOTYPES.includes(genotype) ? genotype : ""}
            status={genotype && GENOTYPES.includes(genotype) ? (confidence === "high" ? "clear" : "check") : "missing"}
          >
            <select value={genotype} onChange={(e) => setGenotype(e.target.value)} className={inputCls}>
              <option value="">Select…</option>
              <option value="AA">AA</option>
              <option value="AS">AS</option>
              <option value="AC">AC</option>
              <option value="SS">SS</option>
              <option value="SC">SC</option>
              <option value="OTHER">Something else / rare variant</option>
              <option value="UNKNOWN">Not shown / unclear</option>
            </select>
          </VerifyRow>
          {(genotype === "OTHER" || genotype === "UNKNOWN" || genotype === "") && (
            <Field label="What does your slip say, exactly?">
              <input value={rareNote} onChange={(e) => setRareNote(e.target.value)} className={inputCls} placeholder="Copy it letter-for-letter" />
            </Field>
          )}
          <div className="grid gap-3 sm:grid-cols-2">
            <VerifyRow
              label="2 · Blood group (ABO)"
              value={abo !== "unknown" ? abo : ""}
              status={abo !== "unknown" ? (confidence === "high" ? "clear" : "check") : "missing"}
            >
              <select value={abo} onChange={(e) => setAbo(e.target.value)} className={inputCls}>
                <option value="unknown">Not shown</option>
                <option value="O">O</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="AB">AB</option>
              </select>
            </VerifyRow>
            <VerifyRow
              label="3 · Rhesus (RhD)"
              value={rh !== "unknown" ? (rh === "positive" ? "Positive (+)" : "Negative (−)") : ""}
              status={rh !== "unknown" ? (confidence === "high" ? "clear" : "check") : "missing"}
            >
              <select value={rh} onChange={(e) => setRh(e.target.value)} className={inputCls}>
                <option value="unknown">Not shown</option>
                <option value="positive">Positive (+)</option>
                <option value="negative">Negative (−)</option>
              </select>
            </VerifyRow>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Lab name (if visible)" hint="Optional — helps you remember which slip this was.">
              <input value={labName} onChange={(e) => setLabName(e.target.value)} className={inputCls} placeholder="e.g. Clina Lancet" />
            </Field>
            <Field label="Test date (if visible)" hint="Optional.">
              <input value={labDate} onChange={(e) => setLabDate(e.target.value)} className={inputCls} placeholder="e.g. 12 Mar 2026" />
            </Field>
          </div>
          <PrimaryButton onClick={confirm}>Confirm — show my result</PrimaryButton>
        </div>
      </Card>
      <Disclaimer />
    </>
  );
}

const GENOTYPES = ["AA", "AS", "AC", "SS", "SC"];
