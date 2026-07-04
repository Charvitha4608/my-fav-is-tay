import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getShare } from "@/lib/share/store";
import { getTrack } from "@/lib/discography";
import { resolveAllArt } from "@/lib/art";
import { enrichTracks } from "@/lib/spotify/resolve";
import { GiftView } from "@/components/gift/GiftView";
import { Footer } from "@/components/site/Footer";
import { EraWorld } from "@/components/world/EraWorld";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ shortId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { shortId } = await params;
  const share = await getShare(shortId);
  if (!share) return { title: "my fav is tay 💌" };
  return {
    title: `${share.title} 💌 my fav is tay`,
    description: share.from
      ? `${share.from} made you a playlist — open it up.`
      : "Someone made you a playlist — open it up.",
  };
}

export default async function SharePage({ params }: Props) {
  const { shortId } = await params;
  const share = await getShare(shortId);
  if (!share) notFound();

  const seeded = share.trackIds
    .map((id) => getTrack(id))
    .filter((t): t is NonNullable<typeof t> => Boolean(t));

  let art: Record<string, string> = {};
  try {
    art = await resolveAllArt();
  } catch {
    /* gift still renders with gradient covers */
  }

  let tracks = seeded;
  try {
    tracks = await enrichTracks(seeded);
  } catch {
    /* unresolved tracks fall back to search deep-links */
  }

  return (
    <>
      <EraWorld />
      <GiftView share={share} tracks={tracks} art={art} />
      <Footer />
    </>
  );
}
