import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { sfx } from "../lib/game";
import { GHOST, PixelArt } from "./Pixel";

interface PauseMenuProps {
  open: boolean;
  muted: boolean;
  onClose: () => void;
  onToggleMute: () => void;
}

const ITEMS = [
  { label: "RESUME", action: "close" },
  { label: "THE WORK", action: "work" },
  { label: "PROFILE", action: "about" },
  { label: "CONTACT", action: "contact" },
  { label: "TOGGLE SOUND", action: "mute" },
] as const;

export function PauseMenu({ open, muted, onClose, onToggleMute }: PauseMenuProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!open) return;
    setIndex(0);
  }, [open]);

  const activate = (action: string) => {
    if (action === "close") onClose();
    else if (action === "mute") onToggleMute();
    else {
      onClose();
      document.getElementById(action)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        sfx.blip();
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        sfx.move();
        setIndex((i) => (i + 1) % ITEMS.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        sfx.move();
        setIndex((i) => (i - 1 + ITEMS.length) % ITEMS.length);
      } else if (e.key === "Enter") {
        sfx.blip();
        activate(ITEMS[index].action);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, index]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[95] flex items-center justify-center bg-void/85 px-6 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-label="Pause menu"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.92, y: 12 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
            className="pixel-frame w-full max-w-md bg-panel p-8 sm:p-10"
          >
            <div className="mb-8 flex items-center justify-between">
              <h2 className="font-pixel text-lg text-paper">
                PAUSED<span className="blink text-xp">_</span>
              </h2>
              <PixelArt sprite={GHOST} pixel={3} className="float-a" />
            </div>

            <ul className="space-y-1">
              {ITEMS.map((item, i) => (
                <li key={item.label}>
                  <button
                    type="button"
                    onMouseEnter={() => setIndex(i)}
                    onClick={() => {
                      sfx.blip();
                      activate(item.action);
                    }}
                    className={`flex w-full items-center gap-4 px-3 py-3 text-left transition-colors ${
                      index === i ? "bg-white/5 text-xp" : "text-paper/70"
                    }`}
                  >
                    <span
                      className={`font-pixel w-4 text-[10px] ${
                        index === i ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      ▶
                    </span>
                    <span className="font-pixel text-[11px] tracking-wider">
                      {item.label}
                      {item.action === "mute" && (
                        <span className="ml-3 text-dim">{muted ? "OFF" : "ON"}</span>
                      )}
                    </span>
                  </button>
                </li>
              ))}
            </ul>

            <div className="font-mono mt-8 border-t border-white/10 pt-5 text-[10px] uppercase tracking-[0.2em] text-dim">
              ↑↓ select · enter confirm · esc resume
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
