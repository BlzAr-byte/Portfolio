import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { sfx } from "../lib/game";

const BLOCKS = 16;

export function Boot({ onDone }: { onDone: () => void }) {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, []);

  const start = () => {
    if (loading) return;
    setLoading(true);
    sfx.resume();
    sfx.boot();
    const t0 = performance.now();
    const dur = 1500;
    const tick = (t: number) => {
      const raw = Math.min(1, (t - t0) / dur);
      const eased = raw < 0.85 ? raw : Math.min(1, raw + (raw - 0.85) * 0.4);
      setProgress(Math.round(eased * 100));
      if (raw < 1) {
        raf.current = requestAnimationFrame(tick);
      } else {
        setProgress(100);
        window.setTimeout(() => setLeaving(true), 350);
        window.setTimeout(onDone, 850);
      }
    };
    raf.current = requestAnimationFrame(tick);
  };

  const filled = Math.round((progress / 100) * BLOCKS);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-between bg-void px-6 py-8"
      animate={leaving ? { opacity: 0, scale: 1.04 } : { opacity: 1, scale: 1 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      <div className="flex w-full max-w-5xl items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-dim">
        <span>RAZAVI SOFTWARE BIOS v2.6</span>
      </div>

      <div className="flex flex-col items-center gap-8 text-center">
        <div>
          <p className="font-pixel mb-6 text-[10px] text-xp">
            <span className="text-heart">●</span> PLAYER 1 INSERTED <span className="text-heart">●</span>
          </p>
          <h1 className="font-pixel text-[clamp(1.6rem,6vw,3.4rem)] leading-[1.5] text-paper">
            ALI-REZA<span className="text-xp">.</span>EXE
          </h1>
          <p className="font-mono mt-6 text-xs sm:text-sm tracking-[0.35em] text-dim uppercase">
            A playable portfolio
          </p>
        </div>

        {!loading ? (
          <button onClick={start} className="btn-pixel btn-pixel-green group blink">
            ▸ PRESS START
          </button>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <div className="flex gap-1">
              {Array.from({ length: BLOCKS }).map((_, i) => (
                <span
                  key={i}
                  className={`h-5 w-4 border border-black ${
                    i < filled ? "bg-xp" : "bg-white/10"
                  }`}
                />
              ))}
            </div>
            <p className="font-pixel text-[9px] text-dim">
              LOADING PIXELS... {progress}%
            </p>
          </div>
        )}
      </div>

      <div className="font-mono w-full max-w-5xl text-center text-[10px] uppercase tracking-[0.2em] text-dim/70">
        © 2026 — No microtransactions. Only microinteractions.
      </div>
    </motion.div>
  );
}
