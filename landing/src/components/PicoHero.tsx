export function PicoHero() {
  return (
    <video
      src="/assets/pico.mp4"
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      aria-label="Pico, o mascote do Falamigos, acenando"
      style={{
        width: "min(480px, 100%)",
        maxWidth: "100%",
        height: "auto",
        display: "block",
        margin: "0 auto",
        objectFit: "contain",
      }}
    />
  );
}
