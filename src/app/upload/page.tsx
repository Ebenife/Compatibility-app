"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  Disclaimer,
  DocNotice,
  PageTitle,
  PrimaryButton,
  Stepper,
  Field,
  SecondaryButton,
  inputCls,
} from "@/components/ui";
import { emptyPerson, loadSession, saveSession } from "@/lib/session";
import type { Abo, Genotype, Rh } from "@/lib/compatibility";

const MAX_BYTES = 10 * 1024 * 1024;
const ACCEPTED = ["image/jpeg", "image/png", "image/heic", "image/heif", "application/pdf"];

type Mode = "upload" | "manual";
type Status =
  | "empty"
  | "uploading"
  | "failed"
  | "too-large"
  | "wrong-type"
  | "unreadable";

export default function UploadPage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<Mode>("upload");
  const [status, setStatus] = useState<Status>("empty");
  const [errorDetail, setErrorDetail] = useState("");
  const [fileName, setFileName] = useState("");

  // Manual-entry fields (first-class fallback, PRD §5)
  const [genotype, setGenotype] = useState("");
  const [abo, setAbo] = useState("unknown");
  const [rh, setRh] = useState("unknown");
  const [rareNote, setRareNote] = useState("");

  async function handleFile(file: File) {
    setErrorDetail("");
    if (!ACCEPTED.includes(file.type) && file.type !== "") {
      setStatus("wrong-type");
      return;
    }
    if (file.size > MAX_BYTES) {
      setStatus("too-large");
      return;
    }
    setFileName(file.name);
    setStatus("uploading");
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/extract", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok || data.status === "unreadable") {
        setStatus("unreadable");
        setErrorDetail(data?.message ?? "The document could not be read.");
        return;
      }
      if (data.status === "manual-required") {
        // Extraction service not configured in this test build — keep the
        // file name for context and route to manual entry honestly.
        setStatus("failed");
        setErrorDetail(
          "Automatic reading is not switched on in this test build, so your document was not processed. Please enter your result manually below — it takes under a minute."
        );
        setMode("manual");
        return;
      }
      // High/low confidence extraction → stash as pending, confirm next.
      const s = loadSession();
      s.own = {
        ...emptyPerson(),
        genotype: data.genotype ?? "",
        abo: data.abo ?? "unknown",
        rh: data.rh ?? "unknown",
        labName: data.labName ?? "",
        labDate: data.labDate ?? "",
        source: "upload",
        confidence: data.confidence ?? "low",
        rareNote: data.rareNote ?? "",
      };
      saveSession(s);
      sessionStorage.setItem("gcc.pending", "own");
      router.push("/confirm");
    } catch {
      setStatus("failed");
      setErrorDetail("Network or upload failure. Your entries are safe — please retry.");
    }
  }

  function submitManual() {
    const s = loadSession();
    s.own = {
      ...emptyPerson(),
      genotype: genotype as Genotype | "",
      abo: abo as Abo,
      rh: rh as Rh,
      source: "manual",
      confidence: "manual",
      rareNote,
    };
    saveSession(s);
    router.push("/profile");
  }

  const manualValid = genotype !== "";

  return (
    <>
      <Stepper active={0} />
      <PageTitle
        title="Upload your genotype / blood-group result"
        sub="Most Nigerian lab slips show haemoglobin genotype and ABO/Rh on one document, so a single upload usually covers both."
      />

      <div className="mb-4 flex gap-2">
        {(["upload", "manual"] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`rounded-full px-4 py-2 text-sm font-semibold ${
              mode === m ? "bg-stone-900 text-white" : "bg-white text-stone-700 border border-stone-300"
            }`}
          >
            {m === "upload" ? "Upload document" : "Enter manually"}
          </button>
        ))}
      </div>

      {mode === "upload" && (
        <Card>
          <div
            className="rounded-2xl border-2 border-dashed border-stone-300 bg-stone-50 p-8 text-center"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const f = e.dataTransfer.files?.[0];
              if (f) void handleFile(f);
            }}
          >
            <p className="text-sm font-semibold text-stone-800">
              Drag your result here, or choose a file
            </p>
            <p className="mt-1 text-xs text-stone-500">
              JPG, PNG, HEIC or PDF · max 10MB · official lab-issued slip
            </p>
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/heic,image/heif,application/pdf"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) void handleFile(f);
              }}
            />
            <div className="mt-4">
              <SecondaryButton onClick={() => fileRef.current?.click()}>
                Choose file
              </SecondaryButton>
            </div>
            {fileName && status === "uploading" && (
              <p className="mt-3 text-xs text-stone-500">Reading {fileName}…</p>
            )}
          </div>

          {status === "empty" && (
            <p className="mt-3 text-xs text-stone-500">
              No document yet? The manual-entry tab works just as well — nothing is hidden.
            </p>
          )}
          {status === "uploading" && (
            <p className="mt-3 text-sm text-stone-600">Uploading and reading… please wait.</p>
          )}
          {status === "too-large" && (
            <ErrorBox title="File too large" body="That file is over the 10MB limit. Try a smaller photo or scan, or enter your result manually." />
          )}
          {status === "wrong-type" && (
            <ErrorBox title="Wrong file type" body="Please upload a JPG, PNG, HEIC image or a PDF. Other formats can't be read." />
          )}
          {status === "unreadable" && (
            <ErrorBox
              title="Document unreadable"
              body={`${errorDetail} Try a clearer photo (good light, flat page, all corners visible) — or enter your result manually.`}
              retry={() => setStatus("empty")}
            />
          )}
          {status === "failed" && (
            <ErrorBox title="Couldn't process that upload" body={errorDetail} retry={() => setStatus("empty")} />
          )}
          <DocNotice />
        </Card>
      )}

      {mode === "manual" && (
        <Card>
          <div className="grid gap-4">
            <Field label="Haemoglobin genotype">
              <select value={genotype} onChange={(e) => setGenotype(e.target.value)} className={inputCls}>
                <option value="">Select…</option>
                <option value="AA">AA</option>
                <option value="AS">AS</option>
                <option value="AC">AC</option>
                <option value="SS">SS</option>
                <option value="SC">SC</option>
                <option value="OTHER">Something else / rare variant</option>
                <option value="UNKNOWN">Not shown on my slip</option>
              </select>
            </Field>
            {(genotype === "OTHER" || genotype === "UNKNOWN") && (
              <Field
                label="What does your slip say?"
                hint="Rare variants aren't covered by this tool — we'll say so plainly rather than guess."
              >
                <input value={rareNote} onChange={(e) => setRareNote(e.target.value)} className={inputCls} placeholder="e.g. CC, DD, or 'not shown'" />
              </Field>
            )}
            <div className="grid grid-cols-2 gap-4">
              <Field label="Blood group (ABO)">
                <select value={abo} onChange={(e) => setAbo(e.target.value)} className={inputCls}>
                  <option value="unknown">Don&apos;t know / not shown</option>
                  <option value="O">O</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="AB">AB</option>
                </select>
              </Field>
              <Field label="Rhesus (RhD)">
                <select value={rh} onChange={(e) => setRh(e.target.value)} className={inputCls}>
                  <option value="unknown">Don&apos;t know / not shown</option>
                  <option value="positive">Positive (+)</option>
                  <option value="negative">Negative (−)</option>
                </select>
              </Field>
            </div>
            <PrimaryButton disabled={!manualValid} onClick={submitManual}>
              Continue to my result
            </PrimaryButton>
            {!manualValid && (
              <p className="text-xs text-stone-500">
                Pick your genotype to continue — or choose “Something else” and we&apos;ll handle it honestly.
              </p>
            )}
          </div>
          <DocNotice />
        </Card>
      )}
      <Disclaimer />
    </>
  );
}

function ErrorBox({ title, body, retry }: { title: string; body: string; retry?: () => void }) {
  return (
    <div className="mt-4 rounded-xl border border-red-300 bg-red-50 p-4">
      <p className="text-sm font-bold text-red-900">{title}</p>
      <p className="mt-1 text-sm leading-6 text-red-800">{body}</p>
      {retry && (
        <button onClick={retry} className="mt-2 text-sm font-semibold text-red-900 underline">
          Try again
        </button>
      )}
    </div>
  );
}
