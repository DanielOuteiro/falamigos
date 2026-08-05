"use client";

import { useEffect, useEffectEvent, useRef, useState } from "react";

const criaturas = [
  {
    video: "/assets/chico.mp4",
    nome: "Chico",
    mundo: "Fundo do mar",
    corTxt: "#1D6FD6",
    corBg: "#E3F0FF",
  },
  {
    video: "/assets/dara.mp4",
    nome: "Dara",
    mundo: "Dinossauros",
    corTxt: "#12896F",
    corBg: "#DEF5EC",
  },
  {
    video: "/assets/cosmo.mp4",
    nome: "Cosmo",
    mundo: "Espaço",
    corTxt: "#5A3FD6",
    corBg: "#ECE6FF",
  },
  {
    video: "/assets/brilha.mp4",
    nome: "Brilha",
    mundo: "Reino mágico",
    corTxt: "#8A56D6",
    corBg: "#F3EBFF",
  },
  {
    video: "/assets/craque.mp4",
    nome: "Craque",
    mundo: "Futebol",
    corTxt: "#3E8E1E",
    corBg: "#E8F6DD",
  },
  {
    video: "/assets/barbara.mp4",
    nome: "Bárbara",
    mundo: "Safári",
    corTxt: "#A87400",
    corBg: "#FFF2CF",
  },
] as const;

export function CriaturasGrid() {
  const rootRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [inView, setInView] = useState(false);
  const [isCoarse, setIsCoarse] = useState(false);
  const [featured, setFeatured] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(hover: none), (pointer: coarse)");
    const sync = () => setIsCoarse(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!inView || isCoarse) return;
    const id = window.setInterval(() => {
      setFeatured((i) => (i + 1) % criaturas.length);
    }, 4200);
    return () => window.clearInterval(id);
  }, [inView, isCoarse]);

  const syncPlayback = useEffectEvent(() => {
    videoRefs.current.forEach((video, i) => {
      if (!video) return;
      const play =
        isCoarse ||
        hovered === i ||
        (inView && hovered === null && featured === i);
      if (play) {
        const p = video.play();
        if (p) p.catch(() => {});
      } else {
        video.pause();
        video.currentTime = 0;
      }
    });
  });

  useEffect(() => {
    syncPlayback();
  }, [inView, isCoarse, featured, hovered]);

  return (
    <div
      ref={rootRef}
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
        gap: 10,
        alignItems: "end",
      }}
    >
      {criaturas.map((c, i) => {
        const active =
          isCoarse ||
          hovered === i ||
          (inView && hovered === null && featured === i);
        return (
          <div
            key={c.nome}
            className={`criatura-card${active ? " is-active" : ""}`}
            onMouseEnter={() => {
              if (!isCoarse) setHovered(i);
            }}
            onMouseLeave={() => {
              if (!isCoarse) setHovered(null);
            }}
          >
            <div className="criatura-media">
              <video
                ref={(el) => {
                  videoRefs.current[i] = el;
                }}
                src={c.video}
                muted
                loop
                playsInline
                preload="metadata"
                aria-label={c.nome}
                style={{
                  width: "100%",
                  maxWidth: 190,
                  aspectRatio: "1",
                  objectFit: "contain",
                  display: "block",
                  margin: "0 auto",
                  background: "#fff",
                }}
              />
            </div>
            <div
              className="font-fredoka"
              style={{ fontWeight: 600, fontSize: 18, marginTop: 10 }}
            >
              {c.nome}
            </div>
            <div
              style={{
                display: "inline-block",
                marginTop: 5,
                fontSize: 12.5,
                fontWeight: 900,
                letterSpacing: 0.6,
                textTransform: "uppercase",
                color: c.corTxt,
                background: c.corBg,
                padding: "4px 12px",
                borderRadius: 999,
              }}
            >
              {c.mundo}
            </div>
          </div>
        );
      })}
    </div>
  );
}
