// Core genetics logic for the Genotype & Rh Compatibility Checker (MVP).
//
// Covers haemoglobin genotypes AA, AS, AC, SS, SC and RhD (positive/negative).
// Anything else is explicitly unsupported and must be flagged, never guessed.

export type Genotype = "AA" | "AS" | "AC" | "SS" | "SC";
export type Rh = "positive" | "negative" | "unknown";
export type Abo = "O" | "A" | "B" | "AB" | "unknown";

export const GENOTYPES: Genotype[] = ["AA", "AS", "AC", "SS", "SC"];

export type VerdictLevel = "compatible" | "caution" | "high-risk";

export interface PairingResult {
  level: VerdictLevel;
  title: string;
  /** One-paragraph plain-language "why". */
  why: string;
  childPattern: string;
}

function key(a: Genotype, b: Genotype): string {
  return [a, b].sort().join("+");
}

// Rule table: every covered pairing, categorized with a plain-language reason.
// Child percentages are per-pregnancy probabilities for that pairing.
const TABLE: Record<string, PairingResult> = {
  "AA+AA": {
    level: "compatible",
    title: "Compatible — no sickle cell disease risk for children",
    why: "Neither of you carries an S or C gene, so there is nothing to pass on. Every child would be AA. This pairing carries no risk of sickle cell disease (SS or SC) or of carrier children.",
    childPattern: "100% AA",
  },
  "AA+AS": {
    level: "compatible",
    title: "Compatible — children cannot have sickle cell disease",
    why: "Only one partner carries an S gene, and a child needs an S (or C) gene from both sides to have sickle cell disease. About half of your children would be AA and half would be AS carriers. Carriers are generally healthy but should know their status before they one day plan a family.",
    childPattern: "≈50% AA, ≈50% AS (carriers)",
  },
  "AA+AC": {
    level: "compatible",
    title: "Compatible — children cannot have sickle cell disease",
    why: "Only one partner carries a C gene, and a child needs an affected gene from both sides to have a haemoglobin disorder. About half of your children would be AA and half would be AC carriers. Carriers are generally healthy but should know their status before they one day plan a family.",
    childPattern: "≈50% AA, ≈50% AC (carriers)",
  },
  "AA+SS": {
    level: "caution",
    title: "Caution — no sickle cell disease, but every child will be a carrier",
    why: "Because one partner is SS, every child will inherit one S gene and be an AS carrier — none will have sickle cell disease themselves, since the AA partner always contributes a healthy A gene. The caution is for the next generation: each of your children will need to check any future partner's genotype, because an AS child with an AS, AC, SS or SC partner can have children with sickle cell disease.",
    childPattern: "100% AS (carriers)",
  },
  "AA+SC": {
    level: "caution",
    title: "Caution — no sickle cell disease, but every child will be a carrier",
    why: "The SC partner passes either an S or a C gene to every child, and the AA partner always contributes a healthy A gene — so no child will have sickle cell disease, but every child will be a carrier (AS or AC). The caution is for the next generation: each of your children will need to check any future partner's genotype before planning a family of their own.",
    childPattern: "≈50% AS, ≈50% AC (all carriers)",
  },
  "AS+AS": {
    level: "high-risk",
    title: "High risk — 1 in 4 chance of sickle cell disease per pregnancy",
    why: "You both carry one S gene. With each pregnancy there is about a 25% chance the child inherits S from both of you and has sickle cell anaemia (SS), a 50% chance the child is an AS carrier, and a 25% chance the child is AA. This chance applies to every pregnancy independently — it does not mean one in four children, it means 1 in 4 each time.",
    childPattern: "≈25% SS, ≈50% AS, ≈25% AA per pregnancy",
  },
  "AC+AS": {
    level: "high-risk",
    title: "High risk — chance of HbSC disease per pregnancy",
    why: "One partner carries S and the other carries C. With each pregnancy there is about a 25% chance the child inherits S from one side and C from the other, resulting in HbSC disease — a form of sickle cell disease that is often milder than SS but can still cause serious complications. The other likely outcomes are a healthy child (AA) or a carrier child (AS or AC).",
    childPattern: "≈25% SC, ≈25% AS, ≈25% AC, ≈25% AA per pregnancy",
  },
  "AC+AC": {
    level: "high-risk",
    title: "High risk — chance of a haemoglobin disorder per pregnancy",
    why: "You both carry a C gene. With each pregnancy there is about a 25% chance the child inherits C from both of you and has HbCC disease — generally milder than sickle cell anaemia but still a real haemoglobin disorder needing specialist care — plus a 50% chance of an AC carrier child and a 25% chance of an AA child.",
    childPattern: "≈25% CC, ≈50% AC, ≈25% AA per pregnancy",
  },
  "AS+SS": {
    level: "high-risk",
    title: "High risk — 1 in 2 chance of sickle cell disease per pregnancy",
    why: "The SS partner passes an S gene to every child, and the AS partner passes S about half the time. That means with each pregnancy there is about a 50% chance the child has sickle cell anaemia (SS) and a 50% chance the child is an AS carrier. There is no outcome in which a child is AA.",
    childPattern: "≈50% SS, ≈50% AS per pregnancy",
  },
  "AS+SC": {
    level: "high-risk",
    title: "High risk — 1 in 2 chance of sickle cell disease per pregnancy",
    why: "Between the S genes on both sides and the C gene from the SC partner, about half of all outcomes give the child sickle cell disease — roughly 25% SS and 25% SC per pregnancy — with the other half being AS or AC carriers. There is no outcome in which a child is AA.",
    childPattern: "≈25% SS, ≈25% SC, ≈25% AS, ≈25% AC per pregnancy",
  },
  "AC+SS": {
    level: "high-risk",
    title: "High risk — 1 in 2 chance of sickle cell disease per pregnancy",
    why: "The SS partner passes an S gene to every child, and the AC partner passes C about half the time. That means with each pregnancy there is about a 50% chance the child has HbSC disease (a form of sickle cell disease) and a 50% chance the child is an AS carrier. There is no outcome in which a child is AA.",
    childPattern: "≈50% SC, ≈50% AS per pregnancy",
  },
  "AC+SC": {
    level: "high-risk",
    title: "High risk — 1 in 2 chance of a haemoglobin disorder per pregnancy",
    why: "With S and C genes on both sides, about half of all outcomes per pregnancy give the child a haemoglobin disorder — roughly 25% HbSC disease and 25% HbCC — with the other half being AS or AC carriers. There is no outcome in which a child is AA.",
    childPattern: "≈25% SC, ≈25% CC, ≈25% AS, ≈25% AC per pregnancy",
  },
  "SS+SS": {
    level: "high-risk",
    title: "High risk — every child will have sickle cell anaemia",
    why: "Both partners pass an S gene to every child, so every child will have sickle cell anaemia (SS). This is a certainty, not a chance — it applies to every pregnancy. A haematologist and genetic counselor should be part of your family-planning conversation from the start.",
    childPattern: "100% SS",
  },
  "SC+SS": {
    level: "high-risk",
    title: "High risk — every child will have sickle cell disease",
    why: "Every child inherits S from the SS partner and either S or C from the SC partner, so every child will have sickle cell disease (about half SS, half SC). This is a certainty, not a chance. A haematologist and genetic counselor should be part of your family-planning conversation from the start.",
    childPattern: "≈50% SS, ≈50% SC",
  },
  "SC+SC": {
    level: "high-risk",
    title: "High risk — every child will have sickle cell disease",
    why: "With S and C genes on both sides, every child will inherit a combination that causes sickle cell disease (roughly 25% SS, 50% SC, 25% CC). This is a certainty, not a chance. A haematologist and genetic counselor should be part of your family-planning conversation from the start.",
    childPattern: "≈25% SS, ≈50% SC, ≈25% CC",
  },
};

export function getPairing(a: Genotype, b: Genotype): PairingResult {
  const hit = TABLE[key(a, b)];
  if (!hit) throw new Error(`Unsupported pairing: ${a} + ${b}`);
  return hit;
}

export interface SingleProfile {
  heading: string;
  meaning: string;
  compatibleWith: string;
  note: string;
}

const PROFILES: Record<Genotype, SingleProfile> = {
  AA: {
    heading: "Your genotype does not carry sickle cell genes",
    meaning:
      "AA means both of your haemoglobin genes are the usual type. You cannot pass sickle cell disease to a child, no matter your partner's genotype.",
    compatibleWith:
      "You are genetically compatible with every genotype (AA, AS, AC, SS, SC) as far as sickle cell disease in your children is concerned. Note that with a partner who is SS or SC, all of your children will be carriers and will need to check their own future partner.",
    note: "AA is sometimes called 'normal haemoglobin'. It says nothing about other health conditions — it only answers the sickle-cell question.",
  },
  AS: {
    heading: "You are a healthy carrier of the sickle cell gene",
    meaning:
      "AS (sickle cell trait) means you carry one usual gene and one S gene. You do not have sickle cell disease, and in most cases the trait itself causes no illness — but you can pass the S gene to a child.",
    compatibleWith:
      "An AA partner is the straightforwardly compatible match: your children cannot have sickle cell disease. With a partner who is AS, AC, SS or SC, there is a real chance of sickle cell disease in each pregnancy — check any specific pairing before making plans.",
    note: "Knowing you are AS is valuable information, not a verdict on your health. What matters from here is your partner's result.",
  },
  AC: {
    heading: "You are a healthy carrier of the haemoglobin C gene",
    meaning:
      "AC (haemoglobin C trait) means you carry one usual gene and one C gene. You do not have a haemoglobin disorder, and in most cases the trait itself causes no illness — but you can pass the C gene to a child, which matters if your partner carries S or C.",
    compatibleWith:
      "An AA partner is the straightforwardly compatible match: your children cannot have a haemoglobin disorder. With a partner who is AS, AC, SS or SC, there is a real chance of HbSC disease, HbCC or related conditions in each pregnancy.",
    note: "Haemoglobin C is less well known than S in Nigeria but follows the same two-sides logic. A partner's result decides the picture.",
  },
  SS: {
    heading: "You have sickle cell anaemia",
    meaning:
      "SS means both of your haemoglobin genes are the S type. You pass one S gene to every child, so your partner's genotype fully decides whether your children are carriers or have sickle cell disease themselves.",
    compatibleWith:
      "An AA partner means no child will have sickle cell disease (all will be AS carriers). With a partner who is AS, AC, SS or SC, children face a high chance of sickle cell disease — this deserves an early, unhurried conversation with a haematologist and a genetic counselor.",
    note: "This tool only reflects genetics facts back to you — it says nothing about your health, your care, or your worth. Ongoing care with a haematologist matters far more than any result screen here.",
  },
  SC: {
    heading: "You have HbSC disease",
    meaning:
      "SC means you carry one S gene and one C gene. You pass one of them to every child, so your partner's genotype fully decides whether your children are carriers or have sickle cell disease themselves.",
    compatibleWith:
      "An AA partner means no child will have sickle cell disease (all will be AS or AC carriers). With a partner who is AS, AC, SS or SC, children face a high chance of sickle cell disease — this deserves an early, unhurried conversation with a haematologist and a genetic counselor.",
    note: "HbSC is often milder than SS but is still sickle cell disease and deserves proper specialist care. This tool only reflects genetics facts — it says nothing about your health beyond that.",
  },
};

export function getSingleProfile(g: Genotype): SingleProfile {
  return PROFILES[g];
}

/** RhD logic, framed around the pregnancy-monitoring context (PRD §5). */
export interface RhNote {
  show: boolean;
  tone: "info" | "watch";
  text: string;
}

export function getRhNote(ownRh: Rh, partnerRh: Rh): RhNote {
  if (ownRh === "unknown" || partnerRh === "unknown") {
    return {
      show: true,
      tone: "info",
      text: "One or both Rh results are missing, so no Rh read is possible. When you have both results, the case that matters is an Rh-negative woman carrying a pregnancy with an Rh-positive partner — ask your doctor about monitoring and preventive care.",
    };
  }
  if (ownRh === "negative" && partnerRh === "positive") {
    return {
      show: true,
      tone: "watch",
      text: "One partner is Rh-negative and the other is Rh-positive. If the Rh-negative partner is the one who would carry a pregnancy, the pregnancy needs routine monitoring: if the baby is Rh-positive, the mother's immune system can react against the baby's blood cells (rhesus incompatibility), which is preventable with standard antenatal care including anti-D injections. Raise this early with your doctor or midwife — it is a well-understood, manageable situation, not a reason to panic.",
    };
  }
  if (ownRh === "positive" && partnerRh === "negative") {
    return {
      show: true,
      tone: "watch",
      text: "One partner is Rh-positive and the other is Rh-negative. If the Rh-negative partner is the one who would carry a pregnancy, the pregnancy needs routine monitoring for rhesus incompatibility, which is preventable with standard antenatal care including anti-D injections. Raise this early with your doctor or midwife — it is a well-understood, manageable situation.",
    };
  }
  if (ownRh === "negative" && partnerRh === "negative") {
    return {
      show: true,
      tone: "info",
      text: "You are both Rh-negative, so rhesus incompatibility between you is not expected. Still mention your blood groups at your first antenatal visit, as you would with any pregnancy.",
    };
  }
  return {
    show: false,
    tone: "info",
    text: "Both partners are Rh-positive, so rhesus incompatibility between you is not expected.",
  };
}

export function singleRhNote(rh: Rh): string {
  if (rh === "negative")
    return "You are Rh-negative. On its own this affects nothing about your health — it matters in pregnancy: if your partner is Rh-positive and you are the one who would carry the pregnancy, ask your doctor early about monitoring and anti-D preventive care.";
  if (rh === "positive")
    return "You are Rh-positive. This is the common type. It matters for the pairing check only in combination with your partner's result — if your partner is Rh-negative and carries a pregnancy, monitoring applies.";
  return "Your Rh result is not recorded yet — add it when you can, since the pairing check uses both partners' Rh.";
}

/** Returns true when the two records look like the same person (PRD §6 duplicate flag). */
export function looksLikeDuplicate(
  a: { genotype: string; rh: string; abo: string },
  b: { genotype: string; rh: string; abo: string }
): boolean {
  return (
    a.genotype !== "" &&
    a.genotype === b.genotype &&
    a.rh !== "unknown" &&
    a.rh === b.rh &&
    a.abo !== "unknown" &&
    a.abo === b.abo
  );
}
