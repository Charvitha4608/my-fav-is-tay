import type { Album, Track } from "./media/types";

/**
 * The full studio discography, Debut → The Life of a Showgirl.
 * Taylor's Versions are used where they exist. Deluxe/vault/3am/Anthology
 * tracks included. Cover art is resolved at runtime from the official
 * catalog APIs (never rehosted) — see /api/art.
 */

type SeedTrack = [title: string, duration: string]; // duration "m:ss"

interface SeedAlbum {
  id: string;
  title: string;
  year: number;
  eraId: string;
  searchQuery: string;
  tracks: SeedTrack[];
}

const SEED: SeedAlbum[] = [
  {
    id: "debut",
    title: "Taylor Swift",
    year: 2006,
    eraId: "debut",
    searchQuery: "Taylor Swift Taylor Swift album",
    tracks: [
      ["Tim McGraw", "3:52"],
      ["Picture to Burn", "2:53"],
      ["Teardrops on My Guitar", "3:23"],
      ["A Place in This World", "3:19"],
      ["Cold as You", "3:59"],
      ["The Outside", "3:27"],
      ["Tied Together with a Smile", "4:08"],
      ["Stay Beautiful", "3:56"],
      ["Should've Said No", "4:02"],
      ["Mary's Song (Oh My My My)", "3:33"],
      ["Our Song", "3:21"],
      ["I'm Only Me When I'm with You", "3:33"],
      ["Invisible", "3:23"],
      ["A Perfectly Good Heart", "3:40"],
    ],
  },
  {
    id: "fearless-tv",
    title: "Fearless (Taylor's Version)",
    year: 2021,
    eraId: "fearless",
    searchQuery: "Fearless Taylor's Version",
    tracks: [
      ["Fearless (Taylor's Version)", "4:01"],
      ["Fifteen (Taylor's Version)", "4:54"],
      ["Love Story (Taylor's Version)", "3:55"],
      ["Hey Stephen (Taylor's Version)", "4:14"],
      ["White Horse (Taylor's Version)", "3:54"],
      ["You Belong with Me (Taylor's Version)", "3:51"],
      ["Breathe (Taylor's Version)", "4:23"],
      ["Tell Me Why (Taylor's Version)", "3:20"],
      ["You're Not Sorry (Taylor's Version)", "4:21"],
      ["The Way I Loved You (Taylor's Version)", "4:03"],
      ["Forever & Always (Taylor's Version)", "3:45"],
      ["The Best Day (Taylor's Version)", "4:05"],
      ["Change (Taylor's Version)", "4:39"],
      ["Jump Then Fall (Taylor's Version)", "3:57"],
      ["Untouchable (Taylor's Version)", "5:12"],
      ["Forever & Always (Piano Version) (Taylor's Version)", "4:27"],
      ["Come In with the Rain (Taylor's Version)", "3:57"],
      ["Superstar (Taylor's Version)", "4:22"],
      ["The Other Side of the Door (Taylor's Version)", "3:58"],
      ["Today Was a Fairytale (Taylor's Version)", "4:01"],
      ["You All Over Me (From the Vault)", "3:40"],
      ["Mr. Perfectly Fine (From the Vault)", "4:37"],
      ["We Were Happy (From the Vault)", "4:04"],
      ["That's When (From the Vault)", "3:09"],
      ["Don't You (From the Vault)", "3:28"],
      ["Bye Bye Baby (From the Vault)", "4:02"],
    ],
  },
  {
    id: "speak-now-tv",
    title: "Speak Now (Taylor's Version)",
    year: 2023,
    eraId: "speak-now",
    searchQuery: "Speak Now Taylor's Version",
    tracks: [
      ["Mine (Taylor's Version)", "3:50"],
      ["Sparks Fly (Taylor's Version)", "4:20"],
      ["Back to December (Taylor's Version)", "4:53"],
      ["Speak Now (Taylor's Version)", "4:00"],
      ["Dear John (Taylor's Version)", "6:43"],
      ["Mean (Taylor's Version)", "3:57"],
      ["The Story of Us (Taylor's Version)", "4:25"],
      ["Never Grow Up (Taylor's Version)", "4:50"],
      ["Enchanted (Taylor's Version)", "5:52"],
      ["Better Than Revenge (Taylor's Version)", "3:37"],
      ["Innocent (Taylor's Version)", "5:02"],
      ["Haunted (Taylor's Version)", "4:02"],
      ["Last Kiss (Taylor's Version)", "6:07"],
      ["Long Live (Taylor's Version)", "5:17"],
      ["Ours (Taylor's Version)", "3:58"],
      ["Superman (Taylor's Version)", "4:36"],
      ["Electric Touch (From the Vault)", "4:25"],
      ["When Emma Falls in Love (From the Vault)", "4:12"],
      ["I Can See You (From the Vault)", "4:33"],
      ["Castles Crumbling (From the Vault)", "5:05"],
      ["Foolish One (From the Vault)", "5:14"],
      ["Timeless (From the Vault)", "5:23"],
    ],
  },
  {
    id: "red-tv",
    title: "Red (Taylor's Version)",
    year: 2021,
    eraId: "red",
    searchQuery: "Red Taylor's Version",
    tracks: [
      ["State of Grace (Taylor's Version)", "4:55"],
      ["Red (Taylor's Version)", "3:43"],
      ["Treacherous (Taylor's Version)", "4:02"],
      ["I Knew You Were Trouble (Taylor's Version)", "3:39"],
      ["All Too Well (Taylor's Version)", "5:29"],
      ["22 (Taylor's Version)", "3:50"],
      ["I Almost Do (Taylor's Version)", "4:04"],
      ["We Are Never Ever Getting Back Together (Taylor's Version)", "3:13"],
      ["Stay Stay Stay (Taylor's Version)", "3:25"],
      ["The Last Time (Taylor's Version)", "4:59"],
      ["Holy Ground (Taylor's Version)", "3:22"],
      ["Sad Beautiful Tragic (Taylor's Version)", "4:44"],
      ["The Lucky One (Taylor's Version)", "4:00"],
      ["Everything Has Changed (Taylor's Version)", "4:05"],
      ["Starlight (Taylor's Version)", "3:40"],
      ["Begin Again (Taylor's Version)", "3:58"],
      ["The Moment I Knew (Taylor's Version)", "4:45"],
      ["Come Back... Be Here (Taylor's Version)", "3:43"],
      ["Girl at Home (Taylor's Version)", "3:40"],
      ["State of Grace (Acoustic) (Taylor's Version)", "5:21"],
      ["Ronan (Taylor's Version)", "4:24"],
      ["Better Man (From the Vault)", "4:56"],
      ["Nothing New (From the Vault)", "4:18"],
      ["Babe (From the Vault)", "3:44"],
      ["Message in a Bottle (From the Vault)", "3:45"],
      ["I Bet You Think About Me (From the Vault)", "4:45"],
      ["Forever Winter (From the Vault)", "4:23"],
      ["Run (From the Vault)", "4:00"],
      ["The Very First Night (From the Vault)", "3:20"],
      ["All Too Well (10 Minute Version)", "10:13"],
    ],
  },
  {
    id: "1989-tv",
    title: "1989 (Taylor's Version)",
    year: 2023,
    eraId: "1989",
    searchQuery: "1989 Taylor's Version",
    tracks: [
      ["Welcome to New York (Taylor's Version)", "3:32"],
      ["Blank Space (Taylor's Version)", "3:51"],
      ["Style (Taylor's Version)", "3:51"],
      ["Out of the Woods (Taylor's Version)", "3:55"],
      ["All You Had to Do Was Stay (Taylor's Version)", "3:13"],
      ["Shake It Off (Taylor's Version)", "3:39"],
      ["I Wish You Would (Taylor's Version)", "3:27"],
      ["Bad Blood (Taylor's Version)", "3:31"],
      ["Wildest Dreams (Taylor's Version)", "3:40"],
      ["How You Get the Girl (Taylor's Version)", "4:07"],
      ["This Love (Taylor's Version)", "4:10"],
      ["I Know Places (Taylor's Version)", "3:15"],
      ["Clean (Taylor's Version)", "4:30"],
      ["Wonderland (Taylor's Version)", "4:05"],
      ["You Are in Love (Taylor's Version)", "4:27"],
      ["New Romantics (Taylor's Version)", "3:50"],
      ['"Slut!" (From the Vault)', "3:00"],
      ["Say Don't Go (From the Vault)", "4:39"],
      ["Now That We Don't Talk (From the Vault)", "2:26"],
      ["Suburban Legends (From the Vault)", "2:51"],
      ["Is It Over Now? (From the Vault)", "3:49"],
    ],
  },
  {
    id: "reputation",
    title: "reputation",
    year: 2017,
    eraId: "reputation",
    searchQuery: "reputation Taylor Swift",
    tracks: [
      ["...Ready for It?", "3:28"],
      ["End Game", "4:04"],
      ["I Did Something Bad", "3:58"],
      ["Don't Blame Me", "3:56"],
      ["Delicate", "3:52"],
      ["Look What You Made Me Do", "3:31"],
      ["So It Goes...", "3:47"],
      ["Gorgeous", "3:29"],
      ["Getaway Car", "3:53"],
      ["King of My Heart", "3:34"],
      ["Dancing with Our Hands Tied", "3:31"],
      ["Dress", "3:50"],
      ["This Is Why We Can't Have Nice Things", "3:27"],
      ["Call It What You Want", "3:23"],
      ["New Year's Day", "3:55"],
    ],
  },
  {
    id: "lover",
    title: "Lover",
    year: 2019,
    eraId: "lover",
    searchQuery: "Lover Taylor Swift",
    tracks: [
      ["I Forgot That You Existed", "2:50"],
      ["Cruel Summer", "2:58"],
      ["Lover", "3:41"],
      ["The Man", "3:10"],
      ["The Archer", "3:31"],
      ["I Think He Knows", "2:53"],
      ["Miss Americana & the Heartbreak Prince", "3:54"],
      ["Paper Rings", "3:42"],
      ["Cornelia Street", "4:47"],
      ["Death by a Thousand Cuts", "3:18"],
      ["London Boy", "3:10"],
      ["Soon You'll Get Better", "3:21"],
      ["False God", "3:20"],
      ["You Need to Calm Down", "2:51"],
      ["Afterglow", "3:43"],
      ["ME!", "3:13"],
      ["It's Nice to Have a Friend", "2:30"],
      ["Daylight", "4:53"],
    ],
  },
  {
    id: "folklore",
    title: "folklore",
    year: 2020,
    eraId: "folklore",
    searchQuery: "folklore Taylor Swift deluxe",
    tracks: [
      ["the 1", "3:30"],
      ["cardigan", "3:59"],
      ["the last great american dynasty", "3:51"],
      ["exile", "4:45"],
      ["my tears ricochet", "4:15"],
      ["mirrorball", "3:29"],
      ["seven", "3:28"],
      ["august", "4:21"],
      ["this is me trying", "3:15"],
      ["illicit affairs", "3:10"],
      ["invisible string", "4:12"],
      ["mad woman", "3:57"],
      ["epiphany", "4:49"],
      ["betty", "4:54"],
      ["peace", "3:54"],
      ["hoax", "3:40"],
      ["the lakes", "3:31"],
    ],
  },
  {
    id: "evermore",
    title: "evermore",
    year: 2020,
    eraId: "evermore",
    searchQuery: "evermore Taylor Swift deluxe",
    tracks: [
      ["willow", "3:34"],
      ["champagne problems", "4:04"],
      ["gold rush", "3:05"],
      ["'tis the damn season", "3:49"],
      ["tolerate it", "4:05"],
      ["no body, no crime", "3:35"],
      ["happiness", "5:15"],
      ["dorothea", "3:45"],
      ["coney island", "4:35"],
      ["ivy", "4:20"],
      ["cowboy like me", "4:35"],
      ["long story short", "3:35"],
      ["marjorie", "4:17"],
      ["closure", "3:00"],
      ["evermore", "5:04"],
      ["right where you left me", "4:05"],
      ["it's time to go", "4:14"],
    ],
  },
  {
    id: "midnights",
    title: "Midnights",
    year: 2022,
    eraId: "midnights",
    searchQuery: "Midnights The Til Dawn Edition Taylor Swift",
    tracks: [
      ["Lavender Haze", "3:22"],
      ["Maroon", "3:38"],
      ["Anti-Hero", "3:20"],
      ["Snow on the Beach", "4:16"],
      ["You're on Your Own, Kid", "3:14"],
      ["Midnight Rain", "2:54"],
      ["Question...?", "3:30"],
      ["Vigilante Shit", "2:44"],
      ["Bejeweled", "3:14"],
      ["Labyrinth", "4:07"],
      ["Karma", "3:24"],
      ["Sweet Nothing", "3:08"],
      ["Mastermind", "3:11"],
      ["The Great War", "4:00"],
      ["Bigger Than the Whole Sky", "3:22"],
      ["Paris", "3:16"],
      ["High Infidelity", "3:51"],
      ["Glitch", "2:28"],
      ["Would've, Could've, Should've", "4:20"],
      ["Dear Reader", "3:45"],
      ["Hits Different", "3:57"],
      ["You're Losing Me (From the Vault)", "4:37"],
    ],
  },
  {
    id: "ttpd",
    title: "The Tortured Poets Department",
    year: 2024,
    eraId: "ttpd",
    searchQuery: "The Tortured Poets Department The Anthology",
    tracks: [
      ["Fortnight", "3:48"],
      ["The Tortured Poets Department", "4:53"],
      ["My Boy Only Breaks His Favorite Toys", "3:23"],
      ["Down Bad", "4:21"],
      ["So Long, London", "4:22"],
      ["But Daddy I Love Him", "5:40"],
      ["Fresh Out the Slammer", "3:30"],
      ["Florida!!!", "3:35"],
      ["Guilty as Sin?", "4:14"],
      ["Who's Afraid of Little Old Me?", "5:34"],
      ["I Can Fix Him (No Really I Can)", "2:36"],
      ["loml", "4:37"],
      ["I Can Do It with a Broken Heart", "3:38"],
      ["The Smallest Man Who Ever Lived", "4:05"],
      ["The Alchemy", "3:16"],
      ["Clara Bow", "3:36"],
      ["The Black Dog", "3:58"],
      ["imgonnagetyouback", "3:42"],
      ["The Albatross", "3:03"],
      ["Chloe or Sam or Sophia or Marcus", "3:33"],
      ["How Did It End?", "3:58"],
      ["So High School", "3:48"],
      ["I Hate It Here", "3:54"],
      ["thanK you aIMee", "3:23"],
      ["I Look in People's Windows", "2:11"],
      ["The Prophecy", "4:07"],
      ["Cassandra", "3:53"],
      ["Peter", "4:43"],
      ["The Bolter", "3:57"],
      ["Robin", "3:00"],
      ["The Manuscript", "3:45"],
    ],
  },
  {
    id: "showgirl",
    title: "The Life of a Showgirl",
    year: 2025,
    eraId: "showgirl",
    searchQuery: "The Life of a Showgirl Taylor Swift",
    tracks: [
      ["The Fate of Ophelia", "3:46"],
      ["Elizabeth Taylor", "3:33"],
      ["Opalite", "3:56"],
      ["Father Figure", "3:33"],
      ["Eldest Daughter", "4:00"],
      ["Ruin the Friendship", "3:16"],
      ["Actually Romantic", "2:41"],
      ["Wi$h Li$t", "3:12"],
      ["Wood", "3:30"],
      ["CANCELLED!", "3:32"],
      ["Honey", "3:16"],
      ["The Life of a Showgirl", "4:20"],
    ],
  },
];

function parseDuration(d: string): number {
  const [m, s] = d.split(":").map(Number);
  return (m * 60 + s) * 1000;
}

export const ALBUMS: Album[] = SEED.map((a) => ({
  id: a.id,
  title: a.title,
  year: a.year,
  eraId: a.eraId,
  searchQuery: a.searchQuery,
}));

export const TRACKS: Track[] = SEED.flatMap((a) =>
  a.tracks.map(([title, duration], i) => ({
    id: `${a.id}.${i + 1}`,
    title,
    albumId: a.id,
    trackNumber: i + 1,
    durationMs: parseDuration(duration),
    preferredProvider: "spotify" as const,
  })),
);

const albumById = new Map(ALBUMS.map((a) => [a.id, a]));
const trackById = new Map(TRACKS.map((t) => [t.id, t]));
const tracksByAlbum = new Map<string, Track[]>();
for (const t of TRACKS) {
  const list = tracksByAlbum.get(t.albumId) ?? [];
  list.push(t);
  tracksByAlbum.set(t.albumId, list);
}

export function getAlbum(id: string): Album | undefined {
  return albumById.get(id);
}

export function getTrack(id: string): Track | undefined {
  return trackById.get(id);
}

export function getAlbumTracks(albumId: string): Track[] {
  return tracksByAlbum.get(albumId) ?? [];
}

export function formatDuration(ms: number): string {
  const total = Math.round(ms / 1000);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function totalRuntime(trackIds: string[]): string {
  const ms = trackIds.reduce((sum, id) => sum + (getTrack(id)?.durationMs ?? 0), 0);
  const total = Math.round(ms / 1000);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  return h > 0 ? `${h}h ${m}m` : `${m} min`;
}
