import {
  Card,
  Disclaimer,
  PageTitle,
  PrimaryButton,
  ReviewPending,
  SecondaryButton,
} from "@/components/ui";

export default function Landing() {
  return (
    <>
      <PageTitle
        title="Know your genotype match before you plan a family"
        sub="Upload your official genotype / blood-group result, get a plain-language read of what you're compatible with, and — if you want — check a specific pairing and see your options."
      />

      <Card>
        <h2 className="text-sm font-bold text-stone-900">What this tool does</h2>
        <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-6 text-stone-700">
          <li>Reads your lab-issued genotype and blood-group document.</li>
          <li>Explains in plain language what your result means.</li>
          <li>Shows which genotypes you are compatible with — with or without a partner.</li>
          <li>Optionally checks one specific pairing and lays out next steps and real costs.</li>
        </ul>
        <h2 className="mt-5 text-sm font-bold text-stone-900">What it does NOT do</h2>
        <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-6 text-stone-700">
          <li>It does not test you — you need an existing lab result (testing itself is out of scope).</li>
          <li>It does not diagnose any condition or give medical advice.</li>
          <li>It does not replace a doctor, a repeat lab test, or a genetic counselor.</li>
          <li>It never recommends one provider over another.</li>
        </ul>
        <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
          <PrimaryButton href="/upload">Start — upload your result</PrimaryButton>
          <SecondaryButton href="/consult">
            Browse consults &amp; costs first
          </SecondaryButton>
        </div>
      </Card>

      <Card className="mt-4">
        <h2 className="text-sm font-bold text-stone-900">How it works</h2>
        <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-sm leading-6 text-stone-700">
          <li>Upload your official result (photo or PDF) — or enter it manually.</li>
          <li>Confirm what the system read before anything is used.</li>
          <li>See your own result and general compatibility — that alone may be all you need.</li>
          <li>Optionally bring in a partner: invite them with a link, or add their result on their behalf.</li>
          <li>Get the pairing read, and if there is risk, see your options with providers and indicative costs.</li>
        </ol>
      </Card>

      <ReviewPending />
      <Disclaimer />
    </>
  );
}
