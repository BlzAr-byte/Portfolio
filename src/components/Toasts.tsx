import { AnimatePresence, motion } from "framer-motion";
import { Trophy } from "lucide-react";
import type { GameToast } from "../lib/game";

export function Toasts({ toasts }: { toasts: GameToast[] }) {
  return (
    <div className="pointer-events-none fixed bottom-5 left-4 z-[90] flex w-[min(92vw,340px)] flex-col gap-3 sm:left-6">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ x: "-120%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-120%", opacity: 0, transition: { duration: 0.25 } }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            className="pixel-frame flex items-start gap-3 bg-panel p-4"
          >
            <div className="grid h-9 w-9 shrink-0 place-items-center border-2 border-coin bg-coin/15 text-coin">
              <Trophy size={16} />
            </div>
            <div className="min-w-0">
              <p className="font-pixel text-[7px] tracking-wide text-coin">{t.label}</p>
              <p className="font-pixel mt-1.5 text-[10px] text-paper">{t.title}</p>
              {t.desc && (
                <p className="font-mono mt-1.5 text-[11px] leading-relaxed text-dim">
                  {t.desc}
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
