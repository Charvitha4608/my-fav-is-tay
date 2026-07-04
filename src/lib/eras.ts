/**
 * Era WORLDS. Every era is a complete fullscreen environment: its own sky,
 * lighting, particles, color grading, glass chemistry and typography glow.
 * Selecting an album swaps the entire world — the UI reads everything from
 * here (and from the CSS variables the era store derives from it).
 */

export type ParticleKind =
  | "fireflies" // debut — green-gold fireflies over a dusk meadow
  | "golddust" //  fearless — warm dust motes floating in sunlight
  | "sparkles" //  speak now — purple fairy-light sparkles
  | "leaves" //    red — falling autumn leaves
  | "seabreeze" // 1989 — bright drifting cloud puffs / gulls of light
  | "smoke" //     reputation — slow dark smoke wisps
  | "glitter" //   lover — pink glitter rain
  | "fog" //       folklore — rolling forest fog
  | "embers" //    evermore — fireside embers rising
  | "stars" //     midnights — twinkling stars + the odd shooting star
  | "paper" //     ttpd — torn paper fragments in the rain
  | "stage"; //    showgirl — gold glitter under stage light

export interface AuroraBlob {
  /** rgba() color of the glow blob */
  color: string;
  /** position as CSS percentages */
  x: string;
  y: string;
  /** diameter, any CSS length (vw works best) */
  size: string;
  /** extra blur px */
  blur?: number;
}

export interface EraWorld {
  id: string;
  label: string;
  /** poetic one-liner shown under the era title */
  caption: string;

  /* ---- accent + text ---- */
  accent: string;
  accentRgb: string;
  accentSoft: string;
  /** primary text color inside this world */
  ink: string;
  inkRgb: string;
  inkSoft: string;
  /** true → dark world (light text, darker glass) */
  dark: boolean;

  /* ---- surfaces ---- */
  glassBg: string;
  glassBorder: string;

  /* ---- environment ---- */
  /** full CSS background for the sky */
  sky: string;
  /** solid fallback painted on <body> behind everything */
  bg: string;
  /** soft light blobs layered over the sky */
  aurora: AuroraBlob[];
  /** god-ray/stage-light color, or null for ray-less worlds */
  rays: { color: string; opacity: number } | null;
  /** color-grading wash laid over the whole world */
  grade: { background: string; blend: string; opacity: number };
  /** 0..1 — how heavy the corner vignette is */
  vignette: number;
  particles: ParticleKind;

  /* ---- typography ---- */
  /** gradient used by the giant era title */
  titleGradient: string;
  /** rgba glow behind the era title */
  titleGlow: string;
}

const W = (w: EraWorld) => w;

export const ERAS: Record<string, EraWorld> = {
  debut: W({
    id: "debut",
    label: "Debut",
    caption: "porch lights, first chords, fireflies at dusk",
    accent: "#5fd6ac",
    accentRgb: "95,214,172",
    accentSoft: "#bfe9dc",
    ink: "#eafff5",
    inkRgb: "234,255,245",
    inkSoft: "#a8d8c4",
    dark: true,
    glassBg: "rgba(10,40,32,0.38)",
    glassBorder: "rgba(160,255,215,0.22)",
    sky: "linear-gradient(180deg,#04120e 0%,#0b2f26 30%,#1d5c4a 62%,#7fae8e 88%,#d8c99a 100%)",
    bg: "#0b2f26",
    aurora: [
      { color: "rgba(95,214,172,0.30)", x: "22%", y: "70%", size: "52vw" },
      { color: "rgba(216,201,154,0.25)", x: "78%", y: "86%", size: "44vw" },
    ],
    rays: null,
    grade: {
      background: "linear-gradient(200deg, rgba(46,110,84,0.5), rgba(6,20,16,0.6))",
      blend: "soft-light",
      opacity: 0.7,
    },
    vignette: 0.42,
    particles: "fireflies",
    titleGradient: "linear-gradient(100deg,#d9ffef 0%,#8be8c2 45%,#e8d9a8 100%)",
    titleGlow: "rgba(95,214,172,0.45)",
  }),

  fearless: W({
    id: "fearless",
    label: "Fearless",
    caption: "golden, like daylight on a first love",
    accent: "#f2b544",
    accentRgb: "242,181,68",
    accentSoft: "#ffe6b0",
    ink: "#4a3010",
    inkRgb: "74,48,16",
    inkSoft: "#8a6a3a",
    dark: false,
    glassBg: "rgba(255,244,220,0.42)",
    glassBorder: "rgba(255,255,255,0.65)",
    sky: "linear-gradient(180deg,#fff9e6 0%,#ffe9b0 30%,#f7c86a 62%,#e09a45 88%,#c2762e 100%)",
    bg: "#f7c86a",
    aurora: [
      { color: "rgba(255,255,235,0.85)", x: "50%", y: "18%", size: "58vw" },
      { color: "rgba(255,196,90,0.55)", x: "24%", y: "72%", size: "48vw" },
    ],
    rays: { color: "255,232,170", opacity: 0.5 },
    grade: {
      background: "linear-gradient(180deg, rgba(255,214,120,0.35), rgba(194,118,46,0.3))",
      blend: "overlay",
      opacity: 0.55,
    },
    vignette: 0.18,
    particles: "golddust",
    titleGradient: "linear-gradient(100deg,#8a5a18 0%,#c2762e 40%,#f2b544 100%)",
    titleGlow: "rgba(255,214,120,0.6)",
  }),

  "speak-now": W({
    id: "speak-now",
    label: "Speak Now",
    caption: "wander through an enchanted purple night",
    accent: "#c084f5",
    accentRgb: "192,132,245",
    accentSoft: "#e6ccff",
    ink: "#f4e9ff",
    inkRgb: "244,233,255",
    inkSoft: "#c3a8e0",
    dark: true,
    glassBg: "rgba(46,17,72,0.42)",
    glassBorder: "rgba(220,180,255,0.25)",
    sky: "linear-gradient(180deg,#12061f 0%,#2a1140 32%,#4a1f6e 62%,#8b4ab8 88%,#c996e0 100%)",
    bg: "#2a1140",
    aurora: [
      { color: "rgba(168,90,220,0.4)", x: "70%", y: "30%", size: "54vw" },
      { color: "rgba(120,60,200,0.35)", x: "18%", y: "78%", size: "50vw" },
      { color: "rgba(255,190,240,0.18)", x: "50%", y: "94%", size: "60vw" },
    ],
    rays: null,
    grade: {
      background: "linear-gradient(210deg, rgba(120,50,190,0.45), rgba(20,5,40,0.55))",
      blend: "soft-light",
      opacity: 0.7,
    },
    vignette: 0.4,
    particles: "sparkles",
    titleGradient: "linear-gradient(100deg,#f0dcff 0%,#c084f5 50%,#8b4ab8 100%)",
    titleGlow: "rgba(192,132,245,0.55)",
  }),

  red: W({
    id: "red",
    label: "Red",
    caption: "autumn air, scarves, and everything in between",
    accent: "#e05a3a",
    accentRgb: "224,90,58",
    accentSoft: "#f5c0a8",
    ink: "#ffeadd",
    inkRgb: "255,234,221",
    inkSoft: "#d8a58c",
    dark: true,
    glassBg: "rgba(58,20,14,0.42)",
    glassBorder: "rgba(255,190,150,0.22)",
    sky: "linear-gradient(180deg,#1c0906 0%,#4a1810 30%,#8a3018 60%,#c2652e 84%,#e8a05c 100%)",
    bg: "#4a1810",
    aurora: [
      { color: "rgba(232,160,92,0.4)", x: "50%", y: "88%", size: "64vw" },
      { color: "rgba(180,60,30,0.35)", x: "80%", y: "40%", size: "46vw" },
    ],
    rays: { color: "255,180,110", opacity: 0.22 },
    grade: {
      background: "linear-gradient(190deg, rgba(190,80,30,0.4), rgba(30,8,4,0.55))",
      blend: "soft-light",
      opacity: 0.72,
    },
    vignette: 0.4,
    particles: "leaves",
    titleGradient: "linear-gradient(100deg,#ffd9c2 0%,#e05a3a 55%,#8a3018 100%)",
    titleGlow: "rgba(224,90,58,0.5)",
  }),

  "1989": W({
    id: "1989",
    label: "1989",
    caption: "blue skies, salt air, a clean slate",
    accent: "#3f9fdd",
    accentRgb: "63,159,221",
    accentSoft: "#bcdff1",
    ink: "#123a5c",
    inkRgb: "18,58,92",
    inkSoft: "#4a7ba3",
    dark: false,
    glassBg: "rgba(255,255,255,0.45)",
    glassBorder: "rgba(255,255,255,0.7)",
    sky: "linear-gradient(180deg,#7cc4f2 0%,#a5d8f7 34%,#d3edfc 66%,#f2fbff 88%,#ffffff 100%)",
    bg: "#a5d8f7",
    aurora: [
      { color: "rgba(255,255,255,0.9)", x: "50%", y: "90%", size: "70vw" },
      { color: "rgba(120,200,255,0.4)", x: "16%", y: "24%", size: "44vw" },
    ],
    rays: { color: "255,255,255", opacity: 0.35 },
    grade: {
      background: "linear-gradient(180deg, rgba(140,205,250,0.3), rgba(255,255,255,0.25))",
      blend: "overlay",
      opacity: 0.5,
    },
    vignette: 0.1,
    particles: "seabreeze",
    titleGradient: "linear-gradient(100deg,#0e3a5e 0%,#3f9fdd 55%,#8fd0f5 100%)",
    titleGlow: "rgba(120,200,255,0.55)",
  }),

  reputation: W({
    id: "reputation",
    label: "reputation",
    caption: "in the dark, she made her own light",
    accent: "#c9ccd6",
    accentRgb: "201,204,214",
    accentSoft: "#e6e8ee",
    ink: "#eceef2",
    inkRgb: "236,238,242",
    inkSoft: "#8f93a0",
    dark: true,
    glassBg: "rgba(14,14,18,0.5)",
    glassBorder: "rgba(220,224,235,0.18)",
    sky: "linear-gradient(180deg,#050507 0%,#0c0c10 40%,#17171d 70%,#26262e 100%)",
    bg: "#0c0c10",
    aurora: [
      { color: "rgba(190,195,210,0.14)", x: "50%", y: "30%", size: "50vw" },
      { color: "rgba(90,95,115,0.2)", x: "20%", y: "85%", size: "55vw" },
    ],
    rays: { color: "210,215,230", opacity: 0.12 },
    grade: {
      background: "linear-gradient(180deg, rgba(40,42,52,0.5), rgba(0,0,0,0.6))",
      blend: "soft-light",
      opacity: 0.8,
    },
    vignette: 0.55,
    particles: "smoke",
    titleGradient: "linear-gradient(100deg,#ffffff 0%,#c9ccd6 45%,#5f6270 100%)",
    titleGlow: "rgba(201,204,214,0.35)",
  }),

  lover: W({
    id: "lover",
    label: "Lover",
    caption: "the sky is pink and gold and yours",
    accent: "#ec5f9f",
    accentRgb: "236,95,159",
    accentSoft: "#f8c1da",
    ink: "#57406b",
    inkRgb: "87,64,107",
    inkSoft: "#8a72a3",
    dark: false,
    glassBg: "rgba(255,255,255,0.42)",
    glassBorder: "rgba(255,255,255,0.65)",
    sky: "linear-gradient(180deg,#b8d4f2 0%,#dccaf0 24%,#f6c8dd 50%,#ecc9e9 72%,#d9c6ee 88%,#f8d8c4 100%)",
    bg: "#f6c8dd",
    aurora: [
      { color: "rgba(255,220,240,0.8)", x: "30%", y: "30%", size: "52vw" },
      { color: "rgba(200,180,255,0.5)", x: "78%", y: "60%", size: "48vw" },
      { color: "rgba(255,224,190,0.55)", x: "50%", y: "94%", size: "62vw" },
    ],
    rays: { color: "255,230,245", opacity: 0.3 },
    grade: {
      background: "linear-gradient(120deg, rgba(255,160,210,0.25), rgba(170,150,255,0.25))",
      blend: "overlay",
      opacity: 0.5,
    },
    vignette: 0.12,
    particles: "glitter",
    titleGradient: "linear-gradient(100deg,#e75c9d 5%,#9d7bdd 50%,#d9a441 95%)",
    titleGlow: "rgba(236,95,159,0.45)",
  }),

  folklore: W({
    id: "folklore",
    label: "folklore",
    caption: "step quietly into the misted woods",
    accent: "#9aa79a",
    accentRgb: "154,167,154",
    accentSoft: "#d4d4c8",
    ink: "#eef0ea",
    inkRgb: "238,240,234",
    inkSoft: "#a3aba0",
    dark: true,
    glassBg: "rgba(30,34,31,0.45)",
    glassBorder: "rgba(220,228,218,0.16)",
    sky: "linear-gradient(180deg,#181c1a 0%,#262b28 30%,#454e48 62%,#7d867e 88%,#b5bcb2 100%)",
    bg: "#262b28",
    aurora: [
      { color: "rgba(190,200,190,0.22)", x: "50%", y: "80%", size: "68vw" },
      { color: "rgba(120,130,122,0.25)", x: "16%", y: "40%", size: "46vw" },
    ],
    rays: { color: "220,228,215", opacity: 0.14 },
    grade: {
      background: "linear-gradient(180deg, rgba(70,78,72,0.5), rgba(18,20,18,0.55))",
      blend: "soft-light",
      opacity: 0.75,
    },
    vignette: 0.48,
    particles: "fog",
    titleGradient: "linear-gradient(100deg,#f4f6f0 0%,#c2cabf 50%,#7d867e 100%)",
    titleGlow: "rgba(200,210,198,0.3)",
  }),

  evermore: W({
    id: "evermore",
    label: "evermore",
    caption: "ember-warm stories told by firelight",
    accent: "#e0873c",
    accentRgb: "224,135,60",
    accentSoft: "#e2c3a4",
    ink: "#ffeed8",
    inkRgb: "255,238,216",
    inkSoft: "#cfa176",
    dark: true,
    glassBg: "rgba(46,26,16,0.45)",
    glassBorder: "rgba(255,200,140,0.2)",
    sky: "linear-gradient(180deg,#160c06 0%,#3a1e10 30%,#7a4018 60%,#c27a2e 84%,#f2b05e 100%)",
    bg: "#3a1e10",
    aurora: [
      { color: "rgba(242,176,94,0.45)", x: "50%", y: "92%", size: "66vw" },
      { color: "rgba(160,80,30,0.35)", x: "78%", y: "55%", size: "44vw" },
    ],
    rays: { color: "255,200,130", opacity: 0.2 },
    grade: {
      background: "linear-gradient(190deg, rgba(160,90,30,0.4), rgba(20,10,4,0.55))",
      blend: "soft-light",
      opacity: 0.72,
    },
    vignette: 0.42,
    particles: "embers",
    titleGradient: "linear-gradient(100deg,#ffe4bd 0%,#e0873c 55%,#8a4a1c 100%)",
    titleGlow: "rgba(224,135,60,0.5)",
  }),

  midnights: W({
    id: "midnights",
    label: "Midnights",
    caption: "meet me at midnight, under lavender stars",
    accent: "#8b7ff0",
    accentRgb: "139,127,240",
    accentSoft: "#c8c1ec",
    ink: "#e9ecff",
    inkRgb: "233,236,255",
    inkSoft: "#9aa0d0",
    dark: true,
    glassBg: "rgba(12,16,42,0.48)",
    glassBorder: "rgba(170,180,255,0.22)",
    sky: "linear-gradient(180deg,#030514 0%,#0a0f2e 36%,#16204d 66%,#2b3a6e 88%,#45568e 100%)",
    bg: "#0a0f2e",
    aurora: [
      { color: "rgba(110,120,220,0.3)", x: "70%", y: "24%", size: "48vw" },
      { color: "rgba(70,90,180,0.28)", x: "22%", y: "70%", size: "52vw" },
      { color: "rgba(180,190,255,0.14)", x: "50%", y: "6%", size: "40vw" },
    ],
    rays: null,
    grade: {
      background: "linear-gradient(200deg, rgba(50,60,140,0.4), rgba(4,6,20,0.6))",
      blend: "soft-light",
      opacity: 0.75,
    },
    vignette: 0.45,
    particles: "stars",
    titleGradient: "linear-gradient(100deg,#dfe4ff 0%,#8b7ff0 55%,#3d4a8e 100%)",
    titleGlow: "rgba(139,127,240,0.5)",
  }),

  ttpd: W({
    id: "ttpd",
    label: "The Tortured Poets Department",
    caption: "ink, rain, and everything she couldn't say",
    accent: "#b8b2a4",
    accentRgb: "184,178,164",
    accentSoft: "#ddd8cc",
    ink: "#f2efe8",
    inkRgb: "242,239,232",
    inkSoft: "#9c968a",
    dark: true,
    glassBg: "rgba(26,25,22,0.5)",
    glassBorder: "rgba(230,224,210,0.16)",
    sky: "linear-gradient(180deg,#141311 0%,#26241f 34%,#4a463e 66%,#7a7468 88%,#a39c8e 100%)",
    bg: "#26241f",
    aurora: [
      { color: "rgba(210,200,180,0.16)", x: "50%", y: "20%", size: "54vw" },
      { color: "rgba(120,112,100,0.22)", x: "80%", y: "80%", size: "48vw" },
    ],
    rays: { color: "225,218,200", opacity: 0.1 },
    grade: {
      background: "linear-gradient(180deg, rgba(90,84,72,0.45), rgba(12,11,9,0.6))",
      blend: "soft-light",
      opacity: 0.8,
    },
    vignette: 0.5,
    particles: "paper",
    titleGradient: "linear-gradient(100deg,#f7f4ec 0%,#c9c2b2 50%,#6e685c 100%)",
    titleGlow: "rgba(220,212,196,0.28)",
  }),

  showgirl: W({
    id: "showgirl",
    label: "The Life of a Showgirl",
    caption: "lights up — the show never really ends",
    accent: "#f5a623",
    accentRgb: "245,166,35",
    accentSoft: "#ffd9a0",
    ink: "#fff2dc",
    inkRgb: "255,242,220",
    inkSoft: "#d8a878",
    dark: true,
    glassBg: "rgba(40,10,20,0.48)",
    glassBorder: "rgba(255,210,140,0.24)",
    sky: "linear-gradient(180deg,#12040c 0%,#33081a 32%,#5e1226 62%,#9c2c26 86%,#d8622e 100%)",
    bg: "#33081a",
    aurora: [
      { color: "rgba(255,170,60,0.35)", x: "50%", y: "94%", size: "64vw" },
      { color: "rgba(200,60,80,0.3)", x: "18%", y: "40%", size: "46vw" },
      { color: "rgba(90,220,190,0.16)", x: "84%", y: "26%", size: "38vw" },
    ],
    rays: { color: "255,214,140", opacity: 0.4 },
    grade: {
      background: "linear-gradient(200deg, rgba(190,60,60,0.4), rgba(20,4,10,0.6))",
      blend: "soft-light",
      opacity: 0.75,
    },
    vignette: 0.48,
    particles: "stage",
    titleGradient: "linear-gradient(100deg,#ffe9c2 0%,#f5a623 50%,#c23a3a 100%)",
    titleGlow: "rgba(245,166,35,0.55)",
  }),
};

export const DEFAULT_ERA = ERAS.lover;

export function eraFor(eraId: string | undefined): EraWorld {
  return (eraId && ERAS[eraId]) || DEFAULT_ERA;
}

/** Back-compat alias — some call sites think of these as plain "eras". */
export type Era = EraWorld;
