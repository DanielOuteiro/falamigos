import Link from "next/link";

function Logo({ height = 34 }: { height?: number }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/brand/logo.svg"
      alt="Falamigos"
      height={height}
      style={{
        height,
        width: "auto",
        display: "block",
        aspectRatio: "1466 / 394",
      }}
    />
  );
}

export function LegalPage({
  titulo,
  atualizadoEm,
  children,
}: {
  titulo: string;
  atualizadoEm: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <nav className="nav">
        <Link href="/" aria-label="Falamigos" style={{ display: "flex", alignItems: "center" }}>
          <Logo height={34} />
        </Link>
        <div className="nav-links">
          <Link href="/#historia" className="nav-link">
            A história
          </Link>
          <Link href="/#como" className="nav-link">
            Como funciona
          </Link>
          <Link href="/#fonos" className="nav-link">
            Sou fono
          </Link>
        </div>
      </nav>

      <main
        style={{
          background: "#FFFDF8",
          minHeight: "70vh",
          padding: "56px 5vw 100px",
        }}
      >
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <h1
            className="font-fredoka"
            style={{
              fontWeight: 700,
              fontSize: "clamp(32px, 4vw, 48px)",
              lineHeight: 1.12,
              margin: "0 0 8px",
              color: "#1F2A44",
            }}
          >
            {titulo}
          </h1>
          <p
            style={{
              fontSize: 14.5,
              color: "#7683A3",
              fontWeight: 700,
              margin: "0 0 40px",
            }}
          >
            Última atualização: {atualizadoEm}
          </p>
          <div className="legal-content">{children}</div>
        </div>
      </main>

      <footer
        style={{ background: "#1F2A44", color: "#C6CFE4", padding: "40px 5vw" }}
      >
        <div
          style={{
            maxWidth: 1180,
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 16,
            flexWrap: "wrap",
            fontSize: 13,
          }}
        >
          <span>© 2026 Falamigos. Quem trata é a fono; nós somos a ponte entre a consulta e a casa.</span>
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            <Link href="/privacidade" className="footer-link">
              Privacidade
            </Link>
            <Link href="/termos" className="footer-link">
              Termos de uso
            </Link>
            <Link href="/suporte" className="footer-link">
              Suporte
            </Link>
            <a href="mailto:ola@falamigos.com.br" className="footer-link">
              ola@falamigos.com.br
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
