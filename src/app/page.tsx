import { resolveAllArt } from "@/lib/art";
import { Home } from "@/components/home/Home";

// Artwork URLs are re-resolved at most daily; images themselves always
// come straight from the official CDN.
export const revalidate = 86400;

export default async function Page() {
  let art: Record<string, string> = {};
  try {
    art = await resolveAllArt();
  } catch {
    // offline build / API hiccup — the client re-resolves lazily
  }
  return <Home initialArt={art} />;
}
