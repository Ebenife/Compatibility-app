import { NextResponse } from "next/server";

// POST /api/extract — reads an uploaded genotype/blood-group document.
// The file is processed in memory only and never stored (PRD §5).
// If no vision model key is configured (test build default), it honestly
// returns manual-required so the client routes to manual entry.

const MAX_BYTES = 10 * 1024 * 1024;
const ALLOWED = [
  "image/jpeg",
  "image/png",
  "image/heic",
  "image/heif",
  "application/pdf",
];

export async function POST(req: Request) {
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json(
      { status: "unreadable", message: "No file received. Please retry." },
      { status: 400 }
    );
  }
  const file = form.get("file");
  if (!(file instanceof Blob)) {
    return NextResponse.json(
      { status: "unreadable", message: "No file received. Please retry." },
      { status: 400 }
    );
  }
  const mime = (file as Blob & { type?: string }).type || "application/octet-stream";
  if (!ALLOWED.includes(mime)) {
    return NextResponse.json(
      { status: "unreadable", message: `File type ${mime} is not supported.` },
      { status: 415 }
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { status: "unreadable", message: "File exceeds the 10MB limit." },
      { status: 413 }
    );
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    // Test build without a vision key: do not pretend to read the document.
    return NextResponse.json({
      status: "manual-required",
      message: "Automatic reading is not configured; manual entry required.",
    });
  }

  if (mime === "application/pdf") {
    return NextResponse.json({
      status: "unreadable",
      message: "PDF reading is not enabled in this build. Please upload a clear photo of the slip, or enter the result manually.",
    });
  }

  try {
    const buf = Buffer.from(await file.arrayBuffer());
    const b64 = buf.toString("base64");
    const resp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        max_tokens: 400,
        messages: [
          {
            role: "system",
            content:
              "You read Nigerian lab-issued haemoglobin genotype / blood-group slips. Reply with JSON only: {genotype: 'AA'|'AS'|'AC'|'SS'|'SC'|null, abo: 'O'|'A'|'B'|'AB'|null, rh: 'positive'|'negative'|null, labName: string|null, labDate: string|null, confidence: 'high'|'low', rareNote: string|null}. Use null when a field is absent or unclear; set confidence low unless the genotype letters are clearly legible. Put anything outside AA/AS/AC/SS/SC in rareNote verbatim.",
          },
          {
            role: "user",
            content: [
              { type: "text", text: "Read this lab slip and return the JSON only." },
              { type: "image_url", image_url: { url: `data:${mime};base64,${b64}` } },
            ],
          },
        ],
      }),
    });
    if (!resp.ok) throw new Error(`vision model HTTP ${resp.status}`);
    const body = await resp.json();
    const text: string = body.choices?.[0]?.message?.content ?? "";
    const jsonText = text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1);
    const parsed = JSON.parse(jsonText);
    // file buffer drops out of scope here — nothing retained.
    return NextResponse.json({
      status: "ok",
      genotype: parsed.genotype ?? "",
      abo: parsed.abo ?? "unknown",
      rh: parsed.rh ?? "unknown",
      labName: parsed.labName ?? "",
      labDate: parsed.labDate ?? "",
      confidence: parsed.confidence ?? "low",
      rareNote: parsed.rareNote ?? "",
    });
  } catch {
    return NextResponse.json({
      status: "unreadable",
      message: "The document couldn't be read confidently. Try a clearer photo, or enter the result manually.",
    });
  }
}
