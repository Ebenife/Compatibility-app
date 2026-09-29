// Static, hand-compiled content blocks (PRD §5: "Options & consult content").
//
// These are descriptive starter listings for this test build — informational,
// not endorsements, and they must be reviewed by a clinician before launch
// (PRD §7). Cost ranges are indicative and date-stamped.

export const CONTENT_AS_OF = "September 2026";

export interface OptionPath {
  id: string;
  title: string;
  whatItIs: string;
  considerations: string;
}

export const OPTION_PATHS: OptionPath[] = [
  {
    id: "counseling",
    title: "Genetic counseling",
    whatItIs:
      "A one-on-one session with a trained genetic counselor who explains your specific pairing, the probabilities, and what each path would involve for you. It is a conversation, not a procedure — most couples do this first, whatever else they decide.",
    considerations:
      "Ask what the session covers, whether your partner should attend, and what follow-up is included. Available at teaching hospitals and a small number of independent practices.",
  },
  {
    id: "pgd-ivf",
    title: "PGD with IVF (preimplantation genetic diagnosis)",
    whatItIs:
      "Embryos created through IVF are tested for sickle cell genes before implantation, so that the pregnancy carried has the genotype you planned for. It exists in Nigeria at a small number of fertility clinics.",
    considerations:
      "It is expensive, physically demanding, and success is not guaranteed per cycle. Ask any clinic for their live-birth rates, how many cycles are typically needed, and the full cost breakdown before deciding anything.",
  },
  {
    id: "donor",
    title: "Donor gametes (sperm or egg donation)",
    whatItIs:
      "Using a donor's sperm or egg with a compatible genotype changes the genetic pairing and therefore the probabilities for the child. Some fertility clinics in Nigeria offer this with screening of donors.",
    considerations:
      "This raises medical, legal, cultural and family questions that deserve unhurried discussion — ideally with a counselor, not only with the clinic offering the service.",
  },
  {
    id: "adoption",
    title: "Adoption",
    whatItIs:
      "Some couples decide to build their family through adoption. In Nigeria this goes through state welfare departments and licensed orphanages with a legal process.",
    considerations:
      "The process takes time and involves home assessments and court steps. Start by speaking to your state's Ministry of Women Affairs or a licensed adoption service — not agents.",
  },
  {
    id: "scd-care",
    title: "If a child or partner already has SCD: ongoing specialist care",
    whatItIs:
      "Bone marrow transplant and gene therapy exist as treatments for sickle cell disease but are not widely available, are very expensive, and carry serious risks — they are mentioned here only so you know they exist, not as a suggestion.",
    considerations:
      "Day-to-day, what matters is steady care with a haematologist: vaccinations, penicillin prophylaxis where advised, malaria prevention, and a crisis plan. Ask for a referral to a haematology department.",
  },
];

export type ProviderPath = "counseling" | "fertility" | "hematology";
export type ProviderArea = "Lagos" | "Abuja" | "Ibadan" | "General";

export interface Provider {
  name: string;
  area: ProviderArea;
  paths: ProviderPath[];
  detail: string;
}

// Starter list compiled from well-known public institutions for this test
// build. Verify every entry independently before launch; this list is static
// and is only updated when explicitly requested (PRD §5).
export const PROVIDERS: Provider[] = [
  {
    name: "Sickle Cell Foundation Nigeria — National Sickle Cell Centre",
    area: "Lagos",
    paths: ["counseling", "hematology"],
    detail:
      "Idi-Araba, Surulere (opposite LUTH). Runs an established Genetic Counselling Programme and trains counselors on sickle cell disorder.",
  },
  {
    name: "LUTH — Department of Haematology & Blood Transfusion",
    area: "Lagos",
    paths: ["counseling", "hematology"],
    detail:
      "Lagos University Teaching Hospital, Idi-Araba. Teaching-hospital haematology department with longer-running clinical genetics activity.",
  },
  {
    name: "UCH — Department of Haematology",
    area: "Ibadan",
    paths: ["counseling", "hematology"],
    detail:
      "University College Hospital, Ibadan. One of the longer-running clinical genetics centres in the country.",
  },
  {
    name: "National Hospital Abuja — Haematology Department",
    area: "Abuja",
    paths: ["counseling", "hematology"],
    detail:
      "Federal tertiary centre in the capital; a reasonable first contact for counseling referrals in the Abuja area.",
  },
  {
    name: "Teaching-hospital fertility centres (e.g. LUTH/UCH assisted-reproduction units)",
    area: "General",
    paths: ["fertility"],
    detail:
      "Public teaching hospitals with IVF units can advise on PGD availability or refer onward. Ask directly whether PGD for sickle cell is currently offered.",
  },
  {
    name: "Licensed private fertility clinics in your city",
    area: "General",
    paths: ["fertility"],
    detail:
      "Several licensed clinics in Lagos, Abuja and Port Harcourt advertise IVF with genetic testing. Verify licensing, ask for audited success rates, and get itemised costs.",
  },
  {
    name: "Genetics Society of Nigeria / Nigerian Society for Human Genetics",
    area: "General",
    paths: ["counseling"],
    detail:
      "Professional bodies that can point to a member genetic counselor or clinical geneticist, including outside Lagos.",
  },
  {
    name: "Independent genetic counseling practices",
    area: "General",
    paths: ["counseling"],
    detail:
      "A small number of counselors now practice outside the hospital system and may be more available for a one-off session. Confirm training and credentials before booking.",
  },
];

export interface CostRange {
  path: string;
  range: string;
  note: string;
}

export const COST_RANGES: CostRange[] = [
  {
    path: "Genotype / blood-group test (per person)",
    range: "₦5,000 – ₦25,000",
    note: "Varies by lab and city; retesting at an accredited lab is worth it before major decisions.",
  },
  {
    path: "Genetic counseling session",
    range: "₦20,000 – ₦100,000",
    note: "Teaching hospitals tend toward the lower end; private practices higher.",
  },
  {
    path: "IVF with PGD (per cycle)",
    range: "₦5,000,000 – ₦12,000,000+",
    note: "Multiple cycles are often needed; confirm what one quoted cycle includes.",
  },
  {
    path: "Donor gametes",
    range: "Varies widely",
    note: "Highly clinic-dependent; request a full written breakdown.",
  },
  {
    path: "Adoption (legal & administrative)",
    range: "Varies by state",
    note: "Official fees are modest but the process is long; beware anyone quoting fast-track fees.",
  },
  {
    path: "Bone marrow transplant / gene therapy",
    range: "Tens of millions of naira and above; limited availability",
    note: "Rarely available locally; mentioned for completeness only.",
  },
];

export const DISCLAIMER_SHORT =
  "Educational tool, not medical advice. Not a substitute for a doctor or genetic counselor. Verify lab results with retesting before major life decisions — lab errors happen.";

export const LISTING_NOTE =
  "Informational listing, not an endorsement. These are starting points for your own research — confirm credentials, licensing and current costs directly with each provider.";

export const DOC_NOTICE =
  "Your documents are processed to read the result and then deleted — nothing is retained after your result is generated.";

export const CLINICAL_REVIEW_NOTE =
  "Content pending clinical review: a hematologist or genetic counselor must review the genotype rules, disclaimers and options content before launch.";
