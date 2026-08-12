import { useEffect, useState } from "react";

interface Sprite {
  rows: string[];
  palette: Record<string, string>;
}

export function PixelArt({
  sprite,
  pixel = 4,
  className,
}: {
  sprite: Sprite;
  pixel?: number;
  className?: string;
}) {
  const h = sprite.rows.length;
  const w = sprite.rows[0].length;
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      width={w * pixel}
      height={h * pixel}
      className={className}
      style={{ shapeRendering: "crispEdges" }}
      aria-hidden="true"
    >
      {sprite.rows.flatMap((row, y) =>
        [...row].map((ch, x) =>
          sprite.palette[ch] ? (
            <rect
              key={`${x}-${y}`}
              x={x}
              y={y}
              width={1}
              height={1}
              fill={sprite.palette[ch]}
            />
          ) : null
        )
      )}
    </svg>
  );
}

export const HEART: Sprite = {
  rows: [
    ".KK.KK.",
    "KRWRKRK",
    "KRRRRRK",
    ".KRRRK.",
    "..KRK..",
    "...K...",
  ],
  palette: { K: "#111111", R: "#ff5f56", W: "#ffc4be" },
};

export const COIN: Sprite = {
  rows: [
    "..KKKK..",
    ".KYYYYK.",
    "KYWWYYYK",
    "KYWWYYYK",
    "KYWWYYYK",
    "KYYYYYYK",
    ".KYYYYK.",
    "..KKKK..",
  ],
  palette: { K: "#151515", Y: "#ffd23d", W: "#fff1b8" },
};

export const FACE_OPEN: Sprite = {
  rows: [
    "..KKKKKKKK..",
    ".KFFFFFFFFK.",
    "KFFFFFFFFFFK",
    "KFFFFFFFFFFK",
    "KFKKFFKKFFFK",
    "KFFFFFFFFFFK",
    "KFCFFFFFFCFK",
    "KFFKFFFFKFFK",
    "KFFFKKKKFFFK",
    "KFFFFFFFFFFK",
    ".KFFFFFFFFK.",
    "..KKKKKKKK..",
  ],
  palette: { K: "#111111", F: "#f2efe4", C: "#ffb1a0" },
};

export const FACE_CLOSED: Sprite = {
  rows: [
    "..KKKKKKKK..",
    ".KFFFFFFFFK.",
    "KFFFFFFFFFFK",
    "KFFFFFFFFFFK",
    "KFFF----FFFK",
    "KFFFFFFFFFFK",
    "KFCFFFFFFCFK",
    "KFFKFFFFKFFK",
    "KFFFKKKKFFFK",
    "KFFFFFFFFFFK",
    ".KFFFFFFFFK.",
    "..KKKKKKKK..",
  ],
  palette: { K: "#111111", F: "#f2efe4", C: "#ffb1a0", "-": "#111111" },
};

// keep old export for backwards compat
export const FACE = FACE_OPEN;

export function BlinkingFace({ pixel = 9, className }: { pixel?: number; className?: string }) {
  const [blink, setBlink] = useState(false);

  useEffect(() => {
    let mounted = true;
    const loop = () => {
      if (!mounted) return;
      const nextIn = 1800 + Math.random() * 3800;
      const id = window.setTimeout(() => {
        if (!mounted) return;
        setBlink(true);
        window.setTimeout(() => {
          if (!mounted) return;
          setBlink(false);
          // 18% chance of double blink
          if (Math.random() < 0.18) {
            window.setTimeout(() => {
              if (!mounted) return;
              setBlink(true);
              window.setTimeout(() => mounted && setBlink(false), 120);
            }, 110);
          }
          loop();
        }, 140);
      }, nextIn);
      return id;
    };
    const t = loop();
    return () => {
      mounted = false;
      clearTimeout(t as unknown as number);
    };
  }, []);

  return (
    <div className={className} style={{ display: "inline-block", lineHeight: 0 }}>
      <PixelArt sprite={blink ? FACE_CLOSED : FACE_OPEN} pixel={pixel} />
    </div>
  );
}

export const GHOST: Sprite = {
  rows: [
    "....KKKK....",
    "..KKWWWWKK..",
    ".KWWWWWWWWK.",
    "KWWWWWWWWWWK",
    "KWWKKWWKKWWK",
    "KWWKKWWKKWWK",
    "KWWWWWWWWWWK",
    "KWWWWWWWWWWK",
    "KWWWWWWWWWWK",
    "WKWKWKWKWKW.",
  ],
  palette: { K: "#151515", W: "#f2efe4" },
};

export const STAR: Sprite = {
  rows: [
    "..K..",
    ".KYK.",
    "KYYYK",
    ".KYK.",
    "..K..",
  ],
  palette: { K: "#151515", Y: "#ffd23d" },
};

export const SWORD: Sprite = {
  rows: [
    "......KK",
    ".....KSK",
    "....KSK.",
    "G.KSK...",
    ".GGK....",
    "..G.....",
    ".B.B....",
    "B...B...",
    "........",
  ],
  palette: { K: "#151515", S: "#6fd6ff", G: "#8a8778", B: "#ffd23d" },
};
