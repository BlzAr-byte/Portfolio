export interface GameToast {
  id: number;
  label: string;
  title: string;
  desc?: string;
}

export interface Achievement {
  id: string;
  title: string;
  desc: string;
}

export const ACHIEVEMENTS: Record<string, Achievement> = {
  TRAVEL: {
    id: "TRAVEL",
    title: "WELL TRAVELED",
    desc: "Walked the entire path to the workshop.",
  },
  SCOUT: {
    id: "SCOUT",
    title: "CURIOUS EYE",
    desc: "Checked out every project card.",
  },
  DEEP: {
    id: "DEEP",
    title: "DEEP DIVER",
    desc: "Made it all the way down to the contact section.",
  },
  DONE: {
    id: "DONE",
    title: "COMPLETIONIST",
    desc: "Read every last pixel of this page.",
  },
  KONAMI: {
    id: "KONAMI",
    title: "GOD MODE",
    desc: "Konami code accepted. Reality may behave differently.",
  },
};

export const KONAMI_SEQUENCE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

/** Tiny WebAudio synth for retro blips. Safe no-op before user gesture. */
class SfxEngine {
  private ctx: AudioContext | null = null;
  enabled = true;

  resume() {
    const ctx = this.ensure();
    if (ctx && ctx.state === "suspended") ctx.resume().catch(() => {});
  }

  private ensure(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      try {
        const AC =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext?: typeof AudioContext })
            .webkitAudioContext;
        if (AC) this.ctx = new AC();
      } catch {
        this.ctx = null;
      }
    }
    return this.ctx;
  }

  private tone(
    freq: number,
    delay: number,
    dur: number,
    type: OscillatorType = "square",
    vol = 0.035
  ) {
    if (!this.enabled) return;
    const ctx = this.ensure();
    if (!ctx || ctx.state !== "running") return;
    try {
      const t0 = ctx.currentTime + delay;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, t0);
      gain.gain.setValueAtTime(vol, t0);
      gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t0);
      osc.stop(t0 + dur + 0.03);
    } catch {
      /* ignore */
    }
  }

  blip() {
    this.tone(440, 0, 0.06, "square", 0.025);
  }
  move() {
    this.tone(600, 0, 0.045, "square", 0.02);
  }
  coin() {
    this.tone(920, 0, 0.09);
    this.tone(1440, 0.08, 0.2);
  }
  unlock() {
    [523, 659, 784, 1046].forEach((f, i) => this.tone(f, i * 0.08, 0.14, "square", 0.04));
  }
  boot() {
    [220, 330, 440, 660, 880].forEach((f, i) =>
      this.tone(f, i * 0.09, 0.11, "sawtooth", 0.028)
    );
  }
  hit() {
    this.tone(160, 0, 0.12, "sawtooth", 0.04);
    this.tone(90, 0.06, 0.18, "sawtooth", 0.04);
  }
}

export const sfx = new SfxEngine();
