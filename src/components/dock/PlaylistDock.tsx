"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { usePlaylistStore } from "@/store/playlist";
import { getAlbum, getTrack, formatDuration, totalRuntime } from "@/lib/discography";

/**
 * The floating glass pill at the bottom of the screen: live count + total
 * runtime, expanding into the full gift builder — reorder songs, name the
 * playlist, write the message, mint the share link.
 */

function SortableRow({ trackId }: { trackId: string }) {
  const remove = usePlaylistStore((s) => s.remove);
  const track = getTrack(trackId);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: trackId });

  if (!track) return null;
  const album = getAlbum(track.albumId);

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`flex items-center gap-2 rounded-xl bg-white/50 px-3 py-2 ${
        isDragging ? "z-10 shadow-lg ring-2 ring-[var(--era-accent)]" : ""
      }`}
    >
      <button
        {...attributes}
        {...listeners}
        aria-label={`Reorder ${track.title}`}
        className="cursor-grab touch-none text-ink-soft active:cursor-grabbing"
      >
        ⠿
      </button>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm text-ink">{track.title}</p>
        <p className="truncate text-[11px] text-ink-soft">
          {album?.title} · {formatDuration(track.durationMs)}
        </p>
      </div>
      <button
        onClick={() => remove(trackId)}
        aria-label={`Remove ${track.title}`}
        className="text-ink-soft transition hover:scale-110 hover:text-ink"
      >
        ✕
      </button>
    </li>
  );
}

export function PlaylistDock() {
  const { trackIds, name, message, from, dockOpen, setDockOpen, reorder, setName, setMessage, setFrom, clear } =
    usePlaylistStore();
  const [sharing, setSharing] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function onDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (over && active.id !== over.id) {
      reorder(trackIds.indexOf(String(active.id)), trackIds.indexOf(String(over.id)));
    }
  }

  async function createGift() {
    setSharing(true);
    setError(null);
    try {
      const res = await fetch("/api/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: name, message, from, trackIds }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "something went wrong");
      setShareUrl(json.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "could not create the link");
    } finally {
      setSharing(false);
    }
  }

  async function copy() {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable — the URL is visible to copy manually */
    }
  }

  if (trackIds.length === 0 && !dockOpen) return null;

  return (
    <div className="fixed inset-x-0 bottom-4 z-50 flex justify-center px-4">
      <AnimatePresence mode="wait">
        {!dockOpen ? (
          <motion.button
            key="pill"
            layout
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 26 }}
            onClick={() => setDockOpen(true)}
            aria-label={`Open playlist — ${trackIds.length} songs`}
            className="glass flex items-center gap-3 rounded-full px-5 py-3 text-sm font-medium text-ink shadow-xl transition hover:scale-[1.03]"
          >
            <span aria-hidden>💌</span>
            <span>
              {trackIds.length} {trackIds.length === 1 ? "song" : "songs"} ·{" "}
              {totalRuntime(trackIds)}
            </span>
            <span
              className="rounded-full px-3 py-1 text-xs font-semibold text-white"
              style={{ background: "var(--era-accent)" }}
            >
              build the gift
            </span>
          </motion.button>
        ) : (
          <motion.div
            key="panel"
            layout
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            className="glass w-full max-w-lg rounded-3xl p-5"
            role="dialog"
            aria-label="Playlist builder"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-display text-xl italic text-ink">
                {shareUrl ? "sealed with a kiss 💋" : "your gift playlist"}
              </h3>
              <button
                onClick={() => setDockOpen(false)}
                aria-label="Minimize playlist"
                className="grid h-8 w-8 place-items-center rounded-full text-ink-soft hover:bg-white/50"
              >
                ▾
              </button>
            </div>

            {shareUrl ? (
              <div className="mt-4 space-y-3">
                <p className="text-sm text-ink">
                  Your gift link is ready — send it to someone you love:
                </p>
                <div className="flex items-center gap-2 rounded-xl bg-white/60 p-2">
                  <span className="min-w-0 flex-1 truncate text-xs text-ink">{shareUrl}</span>
                  <button
                    onClick={copy}
                    className="shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold text-white"
                    style={{ background: "var(--era-accent)" }}
                  >
                    {copied ? "copied! 💗" : "copy link"}
                  </button>
                </div>
                <div className="flex gap-2 text-xs">
                  <a
                    href={shareUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline decoration-dotted underline-offset-2 text-ink-soft hover:text-ink"
                  >
                    preview the gift page
                  </a>
                  <button
                    onClick={() => {
                      setShareUrl(null);
                      clear();
                    }}
                    className="ml-auto text-ink-soft underline decoration-dotted underline-offset-2 hover:text-ink"
                  >
                    start a new one
                  </button>
                </div>
              </div>
            ) : (
              <>
                <p className="mt-1 text-xs text-ink-soft">
                  {trackIds.length} {trackIds.length === 1 ? "song" : "songs"} ·{" "}
                  {totalRuntime(trackIds)} · drag ⠿ to reorder
                </p>

                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={onDragEnd}
                >
                  <SortableContext items={trackIds} strategy={verticalListSortingStrategy}>
                    <ul className="scroll-soft mt-3 flex max-h-[32vh] flex-col gap-1.5 overflow-y-auto pr-1">
                      {trackIds.map((id) => (
                        <SortableRow key={id} trackId={id} />
                      ))}
                    </ul>
                  </SortableContext>
                </DndContext>

                <div className="mt-4 space-y-2.5">
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="name this playlist (e.g. songs that are so us)"
                    maxLength={120}
                    className="w-full rounded-xl border border-white/70 bg-white/60 px-3 py-2 text-sm text-ink placeholder:text-ink-soft/70 focus:outline-none"
                  />
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="write them a little letter…"
                    rows={3}
                    maxLength={2000}
                    className="w-full resize-none rounded-xl border border-white/70 bg-white/60 px-3 py-2 text-sm text-ink placeholder:text-ink-soft/70 focus:outline-none"
                  />
                  <input
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                    placeholder="from (optional)"
                    maxLength={80}
                    className="w-full rounded-xl border border-white/70 bg-white/60 px-3 py-2 text-sm text-ink placeholder:text-ink-soft/70 focus:outline-none"
                  />
                  {error && <p className="text-xs text-red-500">{error}</p>}
                  <button
                    onClick={createGift}
                    disabled={sharing || trackIds.length === 0}
                    className="w-full rounded-full py-2.5 text-sm font-semibold text-white shadow-lg transition hover:brightness-105 disabled:opacity-60"
                    style={{ background: "var(--era-accent)" }}
                  >
                    {sharing ? "wrapping it up…" : "create the gift link 💝"}
                  </button>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
