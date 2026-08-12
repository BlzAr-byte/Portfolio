import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { ArrowUp, ArrowUpRight, Mail } from "lucide-react";
import { Boot } from "./components/Boot";
import { Hud } from "./components/Hud";
import { PauseMenu } from "./components/PauseMenu";
import { FACE, PixelArt } from "./components/Pixel";
import { ACHIEVEMENTS, KONAMI_SEQUENCE, sfx } from "./lib/game";
import { HouseScene } from "./three/HouseScene";

const PROFILE = {
  name: "Ali-Reza Razavi",
  email: "arrazavi9@gmail.com",
  github: "https://github.com/",
  linkedin: "https://www.linkedin.com/",
};

const PROJECTS = [
  {
    id: "atlas",
    code: "PRJ-01",
    title: "Silas",
    desc: "A voice-driven personal assistant running in the terminal. Currently in beta with text responses, powered by a local Ollama model.",
    stack: ["Python", "Ollama", "CLI"],
  },
  {
    id: "relay",
    code: "PRJ-02",
    title: "Study Forge",
    desc: "An open source study tool that runs fully local and connects to your own API keys. Summarizes YouTube videos and PDFs, generates transcripts, notes, quizzes, and tests, then adapts its setup to your field of study.",
    stack: ["TypeScript", "React", "Electron"],
  },
  {
    id: "north",
    code: "PRJ-03",
    title: "Foreman",
    desc: "A local AI business assistant that reads reviews, support tickets, invoices, and competitor pages, then turns each into a plain language digest. Runs fully local through your browser, modular, and works for any type of business.",
    stack: ["React", "Typescript", "Ollama"],
  },
];

const STATS = [
  { label: "ENGINEERING", val: 90, cls: "bg-xp" },
  { label: "PRODUCT DESIGN", val: 86, cls: "bg-mana" },
  { label: "CODING", val: 74, cls: "bg-coin" },
  { label: "SHIPPING", val: 80, cls: "bg-[#ff8a7a]" },
];

const TOOLBOX = [
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "Python",
  "Rust",
  "Docker",
  "Framer",
  "Javascript",
];

const reveal = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as const },
};

const smooth = (x: number, a: number, b: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

function IntroOverlay({ progress }: { progress: { current: number } }) {
  const l0 = useRef<HTMLDivElement>(null);
  const l1 = useRef<HTMLDivElement>(null);
  const l2 = useRef<HTMLDivElement>(null);
  const take = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const setOpacity = (el: HTMLElement | null, o: number) => {
      if (!el) return;
      el.style.opacity = String(o);
      el.style.visibility = o < 0.01 ? "hidden" : "visible";
    };
    const loop = () => {
      const p = progress.current;
      const o0 = 1 - smooth(p, 0.03, 0.2);
      if (l0.current) l0.current.style.transform = `translateY(${p * 220}px)`;
      setOpacity(l0.current, o0);
      setOpacity(l1.current, smooth(p, 0.36, 0.46) * (1 - smooth(p, 0.56, 0.64)));
      setOpacity(l2.current, smooth(p, 0.7, 0.78) * (1 - smooth(p, 0.88, 0.93)));
      const oT = smooth(p, 0.955, 0.99);
      if (take.current) {
        take.current.style.opacity = String(oT);
        take.current.style.pointerEvents = oT > 0.6 ? "auto" : "none";
        take.current.style.visibility = oT < 0.005 ? "hidden" : "visible";
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [progress]);

  return (
    <>
      <div
        ref={l0}
        className="pointer-events-none absolute inset-0 flex flex-col items-center justify-end pb-[16vh] text-center"
      >
        <p className="font-mono mb-6 text-[10px] tracking-[0.28em] text-dim sm:text-[11px]">
          AN INTERACTIVE PORTFOLIO
        </p>
        <h1 className="font-display text-[clamp(2.6rem,8vw,7rem)] font-bold leading-[0.98] tracking-[-0.045em]">
          <span className="text-outline block">JOURNEY TO</span>
          <span className="block">
            THE WORKSHOP<span className="text-xp">.</span>
          </span>
        </h1>
        <p className="font-mono mt-7 text-xs tracking-[0.22em] text-dim uppercase sm:text-sm">
          Scroll to walk up to the house
        </p>
        <div className="bounce-hard mt-6 text-xp">▼</div>
      </div>

      <div
        ref={l1}
        className="pointer-events-none absolute inset-x-0 bottom-[12vh] flex justify-center px-6"
        style={{ opacity: 0, visibility: "hidden" }}
      >
        <p className="font-mono border border-white/15 bg-void/80 px-5 py-4 text-center text-[10px] leading-[1.9] text-paper backdrop-blur-sm sm:text-[11px]">
          EVERY PROJECT ON THIS SITE
          <br />
          <span className="text-xp">CAME OUT OF THIS HOUSE.</span>
        </p>
      </div>

      <div
        ref={l2}
        className="pointer-events-none absolute inset-x-0 top-[14vh] flex justify-center px-6"
        style={{ opacity: 0, visibility: "hidden" }}
      >
        <p className="font-pixel border border-white/15 bg-void/80 px-5 py-4 text-center text-[9px] leading-[2] text-paper backdrop-blur-sm sm:text-[11px]">
          WELCOME TO <span className="text-xp">THE WORKSHOP</span>
        </p>
      </div>

      <div
        ref={take}
        className="absolute inset-0 flex items-center justify-center bg-[#050805]"
        style={{ opacity: 0, visibility: "hidden", pointerEvents: "none" }}
      >
        <p className="font-mono text-[11px] tracking-[0.18em] text-xp sm:text-xs">
          RAZAVI OS ▸ LOGGING YOU IN<span className="blink">▮</span>
        </p>
      </div>
    </>
  );
}

export default function App() {
  const [phase, setPhase] = useState<"boot" | "play">("boot");
  const [seen, setSeen] = useState<Set<string>>(new Set());
  const [muted, setMuted] = useState(false);
  const [pauseOpen, setPauseOpen] = useState(false);
  const [god, setGod] = useState(false);
  const [introActive, setIntroActive] = useState(true);

  const progressRef = useRef(0);
  const introRef = useRef<HTMLDivElement>(null);
  const unlockedRef = useRef(new Set<string>());
  const konamiIdx = useRef(0);
  const doorCrossed = useRef(false);

  const unlock = (id: keyof typeof ACHIEVEMENTS) => {
    if (unlockedRef.current.has(id as string)) return;
    unlockedRef.current.add(id as string);
    // toasts removed — silent unlock
    if (id === "KONAMI") sfx.unlock();
  };

  const seeProject = (id: string) => {
    setSeen((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  useEffect(() => {
    if (seen.size === PROJECTS.length && PROJECTS.length > 0) unlock("SCOUT");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seen]);

  useEffect(() => {
    document.body.style.overflow = phase === "boot" ? "hidden" : "";
  }, [phase]);

  useEffect(() => {
    sfx.enabled = !muted;
  }, [muted]);

  useEffect(() => {
    if (phase !== "play") return;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        const intro = introRef.current;
        if (intro) {
          const total = intro.offsetHeight - window.innerHeight;
          const p = Math.min(1, Math.max(0, window.scrollY / Math.max(1, total)));
          progressRef.current = p;
          setIntroActive((prev) => {
            const next = p < 0.995;
            return prev === next ? prev : next;
          });
          if (p >= 0.7 && !doorCrossed.current) {
            doorCrossed.current = true;
            sfx.move();
          }
          if (p >= 0.985) unlock("TRAVEL");
        }
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
        if (pct >= 97) unlock("DONE");
        const mid = window.scrollY + window.innerHeight * 0.5;
        let current = "0-1";
        document.querySelectorAll<HTMLElement>("[data-world]").forEach((el) => {
          if (el.offsetTop <= mid) current = el.dataset.world ?? current;
        });
        if (current === "1-3") unlock("DEEP");
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === "m" || e.key === "M") && phase === "play") {
        setPauseOpen((p) => !p);
      }
      const expected = KONAMI_SEQUENCE[konamiIdx.current];
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      if (key === expected) {
        konamiIdx.current += 1;
        if (konamiIdx.current === KONAMI_SEQUENCE.length) {
          konamiIdx.current = 0;
          setGod(true);
          unlock("KONAMI");
        }
      } else {
        konamiIdx.current = key === KONAMI_SEQUENCE[0] ? 1 : 0;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  return (
    <div className="bg-void text-paper">
      {phase === "boot" && <Boot onDone={() => setPhase("play")} />}

      <HouseScene progress={progressRef} active={introActive} />

      <motion.main
        className={god ? "godmode relative z-10" : "relative z-10"}
        initial={false}
        animate={phase === "play" ? { opacity: 1 } : { opacity: 0.2 }}
        transition={{ duration: 0.6 }}
      >
        {phase === "play" && (
          <Hud
            muted={muted}
            onToggleMute={() => setMuted((m) => !m)}
            onPause={() => setPauseOpen(true)}
          />
        )}

        <PauseMenu
          open={pauseOpen}
          muted={muted}
          onClose={() => setPauseOpen(false)}
          onToggleMute={() => setMuted((m) => !m)}
        />

        {god && (
          <div className="font-mono fixed left-1/2 top-24 z-40 -translate-x-1/2 border border-xp bg-xp px-3 py-2 text-[10px] font-bold tracking-[0.2em] text-black">
            ROOT ACCESS GRANTED
          </div>
        )}

        <div ref={introRef} data-world="0-1" className="relative h-[600vh]">
          <div className="sticky top-0 h-screen overflow-hidden">
            <IntroOverlay progress={progressRef} />
          </div>
        </div>

        <section id="top" className="relative bg-[#050805] px-4 pb-20 pt-10 sm:px-8 sm:pb-28">
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto max-w-6xl"
          >
            <div className="rounded-[22px] border border-white/10 bg-gradient-to-b from-[#1a2420] to-[#0a0f0c] p-3 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.85),0_0_40px_rgba(70,255,156,0.1)] sm:p-4">
              <div className="relative overflow-hidden rounded-[14px] border border-black bg-[#06100a]">
                <div className="scanlines pointer-events-none absolute inset-0 opacity-50" />
                <div className="scanline-move pointer-events-none" />
                <div className="relative flex items-center justify-between border-b border-xp/20 bg-black/60 px-4 py-2.5">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-coin" />
                    <span className="h-2.5 w-2.5 rounded-full bg-xp shadow-[0_0_8px_#46ff9c]" />
                  </div>
                  <span className="font-mono text-[10px] tracking-[0.06em] text-dim">
                    guest@razavi-os — zsh — 80x24
                  </span>
                  <span className="font-mono flex items-center gap-2 text-[9px] font-bold tracking-[0.16em] text-xp">
                    <span className="h-1.5 w-1.5 animate-pulse bg-xp" /> ONLINE
                  </span>
                </div>
                <div className="relative px-6 py-16 text-center sm:px-12 sm:py-24">
                  <p className="font-mono mb-7 text-[10px] tracking-[0.18em] text-dim sm:text-[11px]">
                    {PROFILE.name.toUpperCase()} — FULL-STACK DEVELOPER
                  </p>
                  <h2 className="font-display text-[clamp(2.4rem,7vw,6rem)] font-bold leading-[0.98] tracking-[-0.045em]">
                    <span className="text-outline block">PRODUCTS,</span>
                    <span className="block">INTERACTIONS &</span>
                    <span className="block text-xp">
                      STORIES<span className="text-paper">.</span>
                    </span>
                  </h2>
                  <p className="font-mono mx-auto mt-8 max-w-xl text-sm leading-relaxed text-dim sm:text-[15px]">
                    Full-stack developer & intentional builder. You made it to the machine — keep
                    scrolling for the projects, and remember: the old cheat codes still work.
                  </p>
                  <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                    <a href="#work" onClick={() => sfx.blip()} className="btn-pixel btn-pixel-green">
                      ▸ View the work
                    </a>
                    <a
                      href={PROFILE.github}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => sfx.blip()}
                      className="btn-pixel btn-pixel-ghost"
                    >
                      <GitHubMark /> Open GitHub
                    </a>
                    <a
                      href={PROFILE.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => sfx.blip()}
                      className="btn-pixel btn-pixel-ghost"
                    >
                      <LinkedInMark /> Connect on LinkedIn
                    </a>
                  </div>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between px-2 pb-1">
                <span className="font-mono text-[9px] tracking-[0.12em] text-dim/60">
                  RAZAVI PRO 14"
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-xp" />
              </div>
            </div>
          </motion.div>
        </section>

        <section id="work" data-world="1-1" className="relative scroll-mt-28 border-t border-xp/10 bg-[radial-gradient(80%_80%_at_0%_0%,rgba(70,255,156,0.06),transparent)]">
          <div className="mx-auto max-w-[1400px] px-5 py-24 sm:px-8 lg:px-12 lg:py-36">
            <motion.div {...reveal} className="mb-14 flex flex-wrap items-end justify-between gap-6">
              <div>
                <h2 className="font-display text-5xl font-bold tracking-[-0.04em] sm:text-7xl">
                  The Work
                </h2>
                <p className="font-mono mt-4 max-w-md text-sm leading-relaxed text-dim">
                  Three shipped things. Zero filler. Hover each card to mark it as seen.
                </p>
              </div>
              <p className="font-mono text-[11px] tracking-[0.12em] text-dim/70">
                SHIPPED, NOT SHELVED
              </p>
            </motion.div>

            <div className="grid gap-6 lg:grid-cols-3">
              {PROJECTS.map((q, i) => {
                const viewed = seen.has(q.id);
                return (
                  <motion.article
                    key={q.id}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.55, delay: i * 0.1 }}
                    whileHover={{ y: -8, rotate: i % 2 === 0 ? -0.4 : 0.4 }}
                    onMouseEnter={() => seeProject(q.id)}
                    onFocus={() => seeProject(q.id)}
                    className="pixel-frame group flex flex-col bg-panel p-6"
                  >
                    <div className="mb-6 flex items-center justify-between">
                      <span className="font-mono text-[11px] tracking-[0.04em] text-dim">{q.code}</span>
                      <span className={`font-mono text-[9px] ${viewed ? "text-xp" : "text-dim/40"}`}>
                        {viewed ? "[viewed]" : "[new]"}
                      </span>
                    </div>
                    <h3 className="font-display text-[1.9rem] font-bold tracking-[-0.02em] transition-colors group-hover:text-xp sm:text-3xl">
                      {q.title}
                    </h3>
                    <p className="font-mono mt-4 flex-1 text-[13px] leading-relaxed text-dim">
                      {q.desc}
                    </p>
                    <div className="mt-6 flex flex-wrap gap-2">
                      {q.stack.map((s) => (
                        <span key={s} className="chip">
                          {s}
                        </span>
                      ))}
                    </div>
                    <div className="mt-7 flex items-center justify-between border-t border-white/10 pt-5">
                      <span className="font-mono text-[10px] tracking-[0.12em] text-dim/60">
                        {">"} open
                      </span>
                      <a
                        href={PROFILE.github}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`Open ${q.title} on GitHub`}
                        onClick={() => sfx.hit()}
                        className="grid h-9 w-9 place-items-center border border-paper/15 text-paper/50 transition-all group-hover:rotate-12 hover:border-xp hover:text-xp"
                      >
                        <ArrowUpRight size={15} />
                      </a>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </section>

        <section id="about" data-world="1-2" className="relative scroll-mt-28 border-t border-white/10 bg-panel/40">
          <div className="mx-auto max-w-[1400px] px-5 py-24 sm:px-8 lg:px-12 lg:py-36">
            <div className="grid gap-12 lg:grid-cols-[400px_1fr] lg:gap-20">
              <motion.div {...reveal} className="pixel-frame h-fit bg-void p-6">
                <div className="mb-4 flex items-center justify-between">
                  <span className="font-mono text-[10px] tracking-[0.18em] text-dim">PROFILE</span>
                  <span className="font-mono text-[10px] text-dim">EST. 2010</span>
                </div>
                <div className="grid place-items-center border border-white/10 bg-[#0a0a0c] bg-[repeating-linear-gradient(45deg,#0a0a0c_0_12px,#0d0d10_12px_24px)] py-8">
                  <PixelArt sprite={FACE} pixel={10} />
                </div>
                <h3 className="font-display mt-6 text-2xl font-bold">{PROFILE.name}</h3>
                <p className="font-mono mt-2 text-[10px] tracking-[0.16em] text-xp">
                  The Goat
                </p>
                <div className="mt-6 space-y-4">
                  {STATS.map((s, i) => (
                    <div key={s.label}>
                      <div className="mb-1.5 flex items-center justify-between">
                        <span className="font-mono text-[9px] tracking-[0.14em] text-dim">
                          {s.label}
                        </span>
                        <span className="font-mono text-[10px] text-paper/60">{s.val}%</span>
                      </div>
                      <div className="h-2.5 w-full border border-white/15 bg-black/40 p-[2px]">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${s.val}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.9, delay: i * 0.12, ease: "easeOut" }}
                          className={`h-full ${s.cls}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div {...reveal}>
                <h2 className="font-display text-4xl font-bold leading-[1.05] tracking-[-0.03em] sm:text-6xl">
                  Make things,
                  <br />
                  but with more <span className="text-outline">intention</span>.
                </h2>
                <div className="font-mono mt-8 grid gap-6 text-[13px] leading-relaxed text-dim sm:grid-cols-2 sm:text-sm">
                  <p>
                    I'm a developer who treats software like a craftsperson treats wood — measured
                    twice, cut once, sanded where nobody will ever see. I work the full stack, but
                    I'm happiest where product thinking meets hard engineering.
                  </p>
                  <p>
                    Off the clock: gaming w/ friends, maintaining an unreasonable pcb schematic collection, and brainstorming side projects that start as jokes and end up
                    with intrests.
                  </p>
                </div>

                <div className="mt-12">
                  <p className="font-mono mb-5 text-[10px] tracking-[0.18em] text-dim">
                    ▤ TOOLBOX
                  </p>
                  <div className="flex flex-wrap gap-2.5">
                    {TOOLBOX.map((item) => (
                      <span key={item} className="chip">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="font-mono mt-10 grid gap-2 border-t border-dashed border-white/15 pt-6 text-[12px] text-dim sm:grid-cols-2">
                  <p>BASE: TORONTO / REMOTE</p>
                  <p>STATUS: OPEN TO WORK</p>
                  <p>DAILY DRIVER: Python</p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section id="contact" data-world="1-3" className="relative scroll-mt-28 overflow-hidden border-t border-xp/20 bg-[#060a08]">
          <div className="relative mx-auto max-w-[1400px] px-5 py-24 sm:px-8 lg:px-12 lg:py-40">
            <motion.div {...reveal} className="mx-auto max-w-3xl text-center">
              <p className="font-mono text-[11px] tracking-[0.22em] text-dim">
                SAY HELLO — LET'S BUILD SOMETHING INTENTIONAL
              </p>

              <h2 className="font-display mt-10 text-[clamp(2.6rem,8vw,6.2rem)] font-bold leading-[0.92] tracking-[-0.04em]">
                <span className="text-outline block">LET'S</span>
                <span className="block text-xp">
                  BUILD IT<span className="blink text-paper">_</span>
                </span>
              </h2>
              <p className="font-mono mx-auto mt-7 max-w-xl text-sm leading-relaxed text-dim sm:text-[15px]">
                Ambitious products, interesting problems, friendly humans — that's all it takes.
                Pick a channel —
              </p>

              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:flex-wrap">
                <a
                  href={`https://mail.google.com/mail/?view=cm&fs=1&to=${PROFILE.email}`}
                  onClick={() => sfx.unlock()}
                  className="btn-pixel btn-pixel-green"
                >
                  <Mail size={13} /> {PROFILE.email}
                </a>
                <a
                  href={PROFILE.github}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => sfx.blip()}
                  className="btn-pixel btn-pixel-ghost"
                >
                  <GitHubMark /> Open GitHub
                </a>
                <a
                  href={PROFILE.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => sfx.blip()}
                  className="btn-pixel btn-pixel-ghost"
                >
                  <LinkedInMark /> Connect on LinkedIn
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        <footer className="border-t border-white/10 bg-[#040705]">
          <div className="mx-auto flex max-w-[1400px] flex-col items-center justify-between gap-6 px-5 py-10 sm:flex-row sm:px-8 lg:px-12">
            <p className="font-mono text-[10px] tracking-[0.14em] text-dim/70">
              © 2026 {PROFILE.name.toUpperCase()}
            </p>
            <div className="flex items-center gap-3">
              <SocialChip href={PROFILE.github} label="GitHub">
                <GitHubMark /> GITHUB
              </SocialChip>
              <SocialChip href={PROFILE.linkedin} label="LinkedIn">
                <LinkedInMark /> LINKEDIN
              </SocialChip>
              <SocialChip href={`https://mail.google.com/mail/?view=cm&fs=1&to=${PROFILE.email}`} label="Email">
                <Mail size={12} /> EMAIL
              </SocialChip>
            </div>
            <button
              type="button"
              onClick={() => {
                sfx.coin();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="font-mono flex items-center gap-2 text-[10px] tracking-[0.16em] text-xp/80 transition-transform hover:-translate-y-1 hover:text-xp"
            >
              BACK TO TOP <ArrowUp size={12} />
            </button>
          </div>
        </footer>
      </motion.main>

      <div className="grid-bg" />
      <div className="scanlines" />
      <div className="vignette" />
    </div>
  );
}

function SocialChip({ href, label, children }: { href: string; label: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel="noreferrer"
      aria-label={label}
      className="font-mono flex items-center gap-2 border border-white/15 px-3 py-2.5 text-[10px] tracking-[0.08em] text-paper/60 transition-all hover:-translate-y-0.5 hover:border-xp/60 hover:text-xp"
    >
      {children}
    </a>
  );
}

function GitHubMark() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .7A11.3 11.3 0 0 0 8.4 22.8c.6.1.8-.2.8-.5v-2c-3.4.7-4.1-1.4-4.1-1.4-.5-1.4-1.3-1.8-1.3-1.8-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.7-.3-5.5-1.3-5.5-6A4.7 4.7 0 0 1 5.6 8c-.1-.3-.5-1.6.1-3.3 0 0 1-.3 3.4 1.3a11.8 11.8 0 0 1 6.2 0c2.4-1.6 3.4-1.3 3.4-1.3.6 1.7.2 3 .1 3.3a4.7 4.7 0 0 1 1.2 3.2c0 4.7-2.8 5.7-5.5 6 .4.4.8 1.1.8 2.2v3c0 .3.2.6.8.5A11.3 11.3 0 0 0 12 .7Z" />
    </svg>
  );
}

function LinkedInMark() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M5.4 7.8H1.8V22h3.6V7.8ZM3.6 2A2.1 2.1 0 1 0 3.6 6.2 2.1 2.1 0 0 0 3.6 2ZM22.2 13.8c0-4.3-2.3-6.3-5.4-6.3a4.6 4.6 0 0 0-4.2 2.3v-2H9V22h3.6v-7c0-1.9.4-3.7 2.7-3.7 2.3 0 2.3 2.1 2.3 3.8V22h3.6l1-8.2Z" />
    </svg>
  );
}
