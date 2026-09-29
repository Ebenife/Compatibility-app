import {
  BackLink,
  Card,
  Disclaimer,
  ListingNote,
  PageTitle,
  SecondaryButton,
} from "@/components/ui";
import { OPTION_PATHS } from "@/lib/content";

export default function OptionsPage() {
  return (
    <>
      <BackLink href="/pairing" label="Pairing result" />
      <PageTitle
        title="Paths that exist"
        sub="Described here so you know what's out there — not recommended, not ranked. What fits is for you, your partner, your doctor and your counselor to work out."
      />
      <div className="grid gap-4">
        {OPTION_PATHS.map((o) => (
          <Card key={o.id}>
            <h2 className="text-base font-bold text-stone-900">{o.title}</h2>
            <p className="mt-2 text-sm leading-6 text-stone-700">{o.whatItIs}</p>
            <p className="mt-2 rounded-xl bg-stone-100 p-4 text-sm leading-6 text-stone-700">
              <span className="font-semibold">Worth knowing: </span>
              {o.considerations}
            </p>
          </Card>
        ))}
      </div>
      <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
        <SecondaryButton href="/consult">See providers &amp; costs per path</SecondaryButton>
        <SecondaryButton href="/accept">Proceed, understanding the risk</SecondaryButton>
      </div>
      <ListingNote />
      <Disclaimer />
    </>
  );
}
