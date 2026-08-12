import { Pause, Volume2, VolumeX } from "lucide-react";
import { sfx } from "../lib/game";

interface HudProps {
  muted: boolean;
  onToggleMute: () => void;
  onPause: () => void;
}

export function Hud({ muted, onToggleMute, onPause }: HudProps) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 select-none">
      <div className="flex items-center justify-between gap-3 border-b border-white/10 bg-void/90 px-5 py-3.5 backdrop-blur-md sm:px-8 lg:px-12">
        <a
          href="#top"
          className="font-display text-[15px] font-semibold tracking-[-0.03em] text-paper"
        >
          AR<span className="text-xp">.</span>
        </a>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onToggleMute}
            aria-label={muted ? "Unmute sound" : "Mute sound"}
            className="grid h-9 w-9 place-items-center border border-white/15 text-paper/60 transition-colors hover:border-white/30 hover:text-paper"
          >
            {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
          </button>
          <button
            type="button"
            onClick={() => {
              sfx.blip();
              onPause();
            }}
            className="flex h-9 items-center gap-1.5 border border-white/15 px-3.5 font-mono text-[10px] font-medium tracking-[0.12em] text-paper/70 transition-colors hover:border-white/30 hover:text-paper"
          >
            <Pause size={12} /> MENU
          </button>
        </div>
      </div>
    </header>
  );
}
