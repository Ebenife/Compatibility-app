"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BackLink,
  Card,
  Disclaimer,
  PageTitle,
  PrimaryButton,
  SecondaryButton,
  Stepper,
  Field,
  inputCls,
} from "@/components/ui";
import { looksLikeDuplicate } from "@/lib/compatibility";
import type { Abo, Genotype, Rh } from "@/lib/compatibility";
import {
  buildInviteLink,
  decodeShareBack,
  emptyPerson,
  loadSession,
  newToken,
  saveSession,
} from "@/lib/session";

export default function PartnerPage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [ready, setReady] = useState(false);
  const [inviteLink, setInviteLink] = useState("");
  const [waiting, setWaiting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shareCode, setShareCode] = useState("");
  const [shareError, setShareError] = useState("");

  // Behalf-entry fields
  const [genotype, setGenotype] = useState("");
  const [abo, setAbo] = useState("unknown");
  const [rh, setRh] = useState("unknown");
  const [consent, setConsent] = useState(false);
  const [samePersonAck, setSamePersonAck] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  useEffect(() => {
    const s = loadSession();
    if (!s.own.genotype) {
      router.replace("/upload");
      return;
    }
    if (s.inviteToken) {
      setInviteLink(buildInviteLink(s.own, s.inviteToken));
      setWaiting(!s.partnerSet);
    }
    if (s.partnerSet) {
      setGenotype(s.partner.genotype);
      setAbo(s.partner.abo);
      setRh(s.partner.rh);
    }
    setReady(true);
  }, [router]);

  if (!ready) return <p className="text-sm text-stone-500">Loading…</p>;

  function createInvite() {
    const s = loadSession();
    const token = newToken();
    s.inviteToken = token;
    s.inviteCompleted = false;
    saveSession(s);
    // Best-effort server registration (single-instance test store).
    fetch("/api/invites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "create", token }),
    }).catch(() => {});
    setInviteLink(buildInviteLink(s.own, token));
    setWaiting(true);
    setCopied(false);
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  function submitBehalf() {
    const s = loadSession();
    s.partner = {
      ...emptyPerson(),
      genotype: genotype as Genotype,
      abo: abo as Abo,
      rh: rh as Rh,
      source: "manual",
      confidence: "manual",
    };
    s.partnerSet = true;
    s.inviteCompleted = false;
    saveSession(s);
    router.push("/pairing");
  }

  function submitShareCode() {
    setShareError("");
    const rec = decodeShareBack(shareCode);
    if (!rec) {
      setShareError("That code doesn't look right. It should look like AS|POSITIVE|O.");
      return;
    }
    const s = loadSession();
    s.partner = rec;
    s.partnerSet = true;
    s.inviteCompleted = true;
    saveSession(s);
    router.push("/pairing");
  }

  async function behalfUpload(file: File) {
    setUploadError("");
    if (file.size > 10 * 1024 * 1024) {
      setUploadError("File too large — 10MB max.");
      return;
    }
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/extract", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok || data.status !== "ok") {
        setUploadError(
          "Couldn't read that document. Enter the result manually below instead."
        );
        return;
      }
      setGenotype(data.genotype ?? "");
      setAbo(data.abo ?? "unknown");
      setRh(data.rh ?? "unknown");
    } catch {
      setUploadError("Upload failed — please retry or enter the result manually.");
    } finally {
      setUploading(false);
    }
  }

  const s = loadSession();
  const duplicate =
    genotype !== "" &&
    looksLikeDuplicate(
      { genotype: s.own.genotype, rh: s.own.rh, abo: s.own.abo },
      { genotype, rh, abo }
    );

  return (
    <>
      <BackLink href="/profile" label="Your result" />
      <Stepper active={3} />
      <PageTitle
        title="Bring in a partner (optional)"
        sub="Two ways — pick whichever fits. Inviting them is preferred, because they handle their own document and you never see it."
      />

      <Card>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-stone-900">Option 1 · Invite them (preferred)</h2>
            <p className="mt-1 text-sm leading-6 text-stone-600">
              They get a link, upload and confirm their own document, and see the pairing
              result themselves. The link stays open until you send a new one — sending a
              new invite replaces the old link.
            </p>
          </div>
          <svg viewBox="0 0 64 64" className="h-14 w-14 shrink-0" aria-hidden>
            <rect x="6" y="14" width="52" height="36" rx="8" fill="#e8f3ec" />
            <path d="M12 22 L32 34 L52 22" fill="none" stroke="#059669" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="48" cy="46" r="10" fill="#1c1917" />
            <path d="M44 46 L47 49 L53 43" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        {!inviteLink ? (
          <div className="mt-4">
            <PrimaryButton onClick={createInvite}>Generate invite link</PrimaryButton>
          </div>
        ) : (
          <div className="mt-4">
            <p className="break-all rounded-xl bg-stone-100 p-3 text-xs text-stone-800">{inviteLink}</p>
            <div className="mt-3 flex flex-col gap-2.5 sm:flex-row">
              <SecondaryButton onClick={copyLink}>{copied ? "Copied ✓" : "Copy link"}</SecondaryButton>
              <SecondaryButton onClick={createInvite}>Send a new invite (replaces this one)</SecondaryButton>
            </div>
            {waiting && (
              <p className="mt-3 text-xs text-stone-500">
                Status: waiting — they haven&apos;t completed it yet. No rush; you can
                continue below in the meantime.
              </p>
            )}
            <div className="mt-4 border-t border-stone-200 pt-4">
              <Field label="They sent you a share-back code?" hint="After completing the invite, your partner gets a short code (e.g. AS|POSITIVE|O) to pass back to you. Paste it here.">
                <input value={shareCode} onChange={(e) => setShareCode(e.target.value)} className={inputCls} placeholder="e.g. AS|POSITIVE|O" />
              </Field>
              {shareError && <p className="mt-2 text-xs text-red-700">{shareError}</p>}
              <div className="mt-3">
                <PrimaryButton onClick={submitShareCode}>Use this code &amp; see pairing</PrimaryButton>
              </div>
            </div>
          </div>
        )}
      </Card>

      <Card className="mt-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-stone-900">Option 2 · Add their result on their behalf</h2>
            <p className="mt-1 text-sm leading-6 text-stone-600">
              For when they aren&apos;t doing this themselves. Only upload a document you
              have the right to share.
            </p>
          </div>
          <svg viewBox="0 0 64 64" className="h-14 w-14 shrink-0" aria-hidden>
            <rect x="14" y="6" width="36" height="48" rx="6" fill="#fff" stroke="#e7e5e4" strokeWidth="2.5" />
            <rect x="21" y="14" width="16" height="5" rx="2.5" fill="#1c1917" />
            <rect x="21" y="23" width="22" height="4" rx="2" fill="#e7e5e4" />
            <rect x="21" y="30" width="22" height="4" rx="2" fill="#e7e5e4" />
            <circle cx="43" cy="43" r="11" fill="#b45309" />
            <path d="M43 38 v6 M43 48 v.5" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </div>
        <label className="mt-3 flex items-start gap-2 text-xs leading-5 text-stone-700">
          <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1" />
          <span>I confirm I have the partner&apos;s permission to upload or enter their result here.</span>
        </label>

        <div className={`mt-4 grid gap-4 ${consent ? "" : "pointer-events-none opacity-40"}`}>
          <div>
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/heic,image/heif,application/pdf"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) void behalfUpload(f);
              }}
            />
            <SecondaryButton onClick={() => fileRef.current?.click()}>
              {uploading ? "Reading…" : "Upload their document"}
            </SecondaryButton>
            {uploadError && <p className="mt-2 text-xs text-red-700">{uploadError}</p>}
          </div>
          <Field label="Their genotype">
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
            <Field label="Their blood group">
              <select value={abo} onChange={(e) => setAbo(e.target.value)} className={inputCls}>
                <option value="unknown">Don&apos;t know</option>
                <option value="O">O</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="AB">AB</option>
              </select>
            </Field>
            <Field label="Their Rh">
              <select value={rh} onChange={(e) => setRh(e.target.value)} className={inputCls}>
                <option value="unknown">Don&apos;t know</option>
                <option value="positive">Positive (+)</option>
                <option value="negative">Negative (−)</option>
              </select>
            </Field>
          </div>
          {duplicate && (
            <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-xs leading-5 text-amber-900">
              <span className="font-bold">Heads up: </span>
              this looks identical to your own result — it may be the same
              person&apos;s document entered twice.
              <label className="mt-2 flex items-start gap-2">
                <input type="checkbox" checked={samePersonAck} onChange={(e) => setSamePersonAck(e.target.checked)} className="mt-1" />
                <span>These really are two different people — proceed anyway.</span>
              </label>
            </div>
          )}
          <PrimaryButton disabled={!genotype || !consent || (duplicate && !samePersonAck)} onClick={submitBehalf}>
            Save &amp; see pairing
          </PrimaryButton>
        </div>
      </Card>
      <Disclaimer />
    </>
  );
}
