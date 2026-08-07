import { CriaturasGrid } from "../components/CriaturasGrid";
import { PicoHero } from "../components/PicoHero";

const capsulas = [
  {
    cor: "#2F80ED",
    onda: "#6BA6F5",
    titulo: '"Evelador", março',
    sub: "Primeira semana de treino",
    barras: [10, 22, 14, 26, 9, 18, 24, 12],
  },
  {
    cor: "#9B6BFF",
    onda: "#B79BFF",
    titulo: '"Elevador", junho',
    sub: "Depois de 12 semanas",
    barras: [14, 26, 20, 30, 16, 24, 28, 18],
  },
  {
    cor: "#FF7A59",
    onda: "#FF9E85",
    titulo: "Cofre da voz",
    sub: "Guardada para sempre",
    barras: [8, 18, 12, 22, 10, 16, 20, 14],
  },
] as const;

const ciencia = [
  {
    num: "10 de 10",
    cor: "#2F80ED",
    texto:
      "crianças do estudo melhoraram nos indicadores de fala (PCC, PCC-R, PDI).",
  },
  {
    num: "Nota 4/5",
    cor: "#9B6BFF",
    texto: "de interesse das crianças pelas atividades, segundo os pais.",
  },
  {
    num: "11-15 min",
    cor: "#17A88B",
    texto: "de atenção sustentada por atividade, relatados pelas famílias.",
  },
] as const;

const painel = [
  {
    titulo: "Você monta o plano",
    texto: "escolhe o fonema, a posição, o nível e as palavras de cada criança.",
  },
  {
    titulo: "Ouve a semana em minutos",
    texto: "áudios curtos do treino chegam organizados na sua fila.",
  },
  {
    titulo: "Avalia com um toque",
    texto: "dominou / repetir, e o jogo da criança se ajusta sozinho.",
  },
  {
    titulo: "Relatório quase pronto",
    texto:
      "a evolução se escreve sozinha; você chega à consulta sabendo o que trabalhar.",
  },
] as const;

function Logo({ dark = false, height = 36 }: { dark?: boolean; height?: number }) {
  /* dark = versão negativa (mono clara) para fundo escuro — Brand Book */
  const src = dark ? "/brand/logo-negative.svg" : "/brand/logo.svg";
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt="Falamigos"
      height={height}
      style={{
        height,
        width: "auto",
        display: "block",
        /* proporção do arquivo: 1466×394 */
        aspectRatio: "1466 / 394",
      }}
    />
  );
}

export default function Home() {
  return (
    <>
      <nav className="nav">
        <a href="#topo" aria-label="Falamigos" style={{ display: "flex", alignItems: "center" }}>
          <Logo height={34} />
        </a>
        <div className="nav-links">
          <a href="#historia" className="nav-link">
            A história
          </a>
          <a href="#como" className="nav-link">
            Como funciona
          </a>
          <a href="#fonos" className="nav-link">
            Sou fono
          </a>
          <a
            href="mailto:ola@falamigos.com.br?subject=Quero%20conhecer%20o%20Falamigos"
            className="nav-cta"
          >
            Quero conhecer
          </a>
        </div>
      </nav>

      <header
        id="topo"
        style={{
          position: "relative",
          overflow: "hidden",
          padding: "40px 5vw 0",
          background: "#fff",
        }}
      >
        <div className="hero-grid">
          <p
            className="font-fredoka hero-eyebrow"
            style={{
              fontWeight: 600,
              fontSize: 17,
              color: "#9B6BFF",
              margin: 0,
              letterSpacing: 0.3,
            }}
          >
            Oi! Eu sou o Pico! ✦
          </p>
          <h1
            className="font-fredoka hero-title"
            style={{
              fontWeight: 700,
              fontSize: "clamp(42px, 5.4vw, 74px)",
              lineHeight: 1.04,
              margin: 0,
              letterSpacing: -0.5,
            }}
          >
            O treino de fala que seu filho vai{" "}
            <span style={{ color: "#2F80ED" }}>pedir</span>{" "}
            <span style={{ color: "#FF7A59" }}>para</span>{" "}
            <span style={{ color: "#9B6BFF" }}>repetir</span>
          </h1>
          <div className="hero-visual">
            <div
              className="twinkle"
              style={{
                position: "absolute",
                top: "8%",
                left: "12%",
                color: "#FFD166",
                fontSize: 34,
              }}
            >
              ★
            </div>
            <div
              className="twinkle"
              style={{
                position: "absolute",
                top: "22%",
                right: "14%",
                color: "#9B6BFF",
                fontSize: 24,
                animationDelay: "0.7s",
                animationDuration: "3.4s",
              }}
            >
              ★
            </div>
            <div
              className="twinkle"
              style={{
                position: "absolute",
                bottom: "18%",
                left: "10%",
                color: "#6ED3C0",
                fontSize: 19,
                animationDelay: "1.3s",
                animationDuration: "3s",
              }}
            >
              ★
            </div>
            <div
              className="twinkle"
              style={{
                position: "absolute",
                top: "12%",
                right: "28%",
                color: "#FF7A59",
                fontSize: 16,
                animationDelay: "0.3s",
                animationDuration: "4s",
              }}
            >
              ✦
            </div>
            <PicoHero />
          </div>
          <p
            className="hero-sub"
            style={{
              fontSize: 19.5,
              lineHeight: 1.65,
              margin: 0,
              color: "#44506E",
              maxWidth: 540,
            }}
          >
            A criança segura um botão, fala, ouve a própria voz e vê
            criaturinhas mágicas nascerem. É o dever de casa da fono,
              disfarçado de magia.
          </p>
          <div className="hero-cta">
            <a
              href="mailto:ola@falamigos.com.br?subject=Avise-me%20do%20lançamento"
              className="btn-coral"
              style={{
                fontSize: 19,
                padding: "16px 34px",
                boxShadow: "0 5px 0 #C4502F",
              }}
            >
              Avise-me do lançamento
            </a>
            <a
              href="#historia"
              className="font-fredoka"
              style={{
                fontWeight: 600,
                fontSize: 18,
                color: "#1F2A44",
                padding: "16px 10px",
              }}
            >
              Por que existe ↓
            </a>
          </div>
          <p
            className="hero-meta"
            style={{
              margin: 0,
              fontSize: 14.5,
              fontWeight: 700,
              color: "#7683A3",
            }}
          >
            Para crianças de 3 a 8 anos · Em breve na App Store e no Google Play
          </p>
        </div>
        <svg
          viewBox="0 0 1440 90"
          preserveAspectRatio="none"
          style={{
            display: "block",
            height: 70,
            margin: "-1px calc(-5vw) 0",
            width: "calc(100% + 10vw)",
          }}
        >
          <path
            d="M0,50 C240,95 480,5 720,45 C960,85 1200,15 1440,55 L1440,90 L0,90 Z"
            fill="#1F2A44"
          />
        </svg>
      </header>

      <section
        id="historia"
        style={{
          background: "#1F2A44",
          color: "#fff",
          padding: "70px 5vw 90px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          className="historia-grid"
          style={{
            maxWidth: 1180,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "minmax(300px, 1fr) minmax(320px, 1.1fr)",
            gap: "clamp(30px, 6vw, 90px)",
            alignItems: "center",
          }}
        >
          <div
            style={{
              position: "relative",
              display: "flex",
              justifyContent: "center",
              padding: "30px 0",
            }}
          >
            <div
              style={{
                background: "#FFFDF8",
                color: "#1F2A44",
                borderRadius: 6,
                padding: "34px 32px 40px",
                width: "min(340px, 80%)",
                transform: "rotate(-3deg)",
                boxShadow: "0 24px 50px rgba(0,0,0,.35)",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: -14,
                  left: "50%",
                  transform: "translateX(-50%) rotate(1deg)",
                  background: "rgba(255,209,102,.85)",
                  width: 110,
                  height: 28,
                  borderRadius: 2,
                }}
              />
              <div
                className="font-fredoka"
                style={{
                  fontWeight: 600,
                  fontSize: 15,
                  letterSpacing: 1,
                  textTransform: "uppercase",
                  color: "#7683A3",
                  marginBottom: 18,
                }}
              >
                Treino de casa: som CH/X
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                  fontSize: 21,
                  fontWeight: 700,
                  color: "#44506E",
                }}
              >
                {(
                  [
                    ["ca", "ch", "orro"],
                    ["", "ch", "ave"],
                    ["pei", "x", "e"],
                    ["", "x", "ícara"],
                  ] as const
                ).map(([pre, mid, pos], i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span>
                      {pre}
                      <u>{mid}</u>
                      {pos}
                    </span>
                    <span style={{ color: "#C9CFDE", fontSize: 15 }}>
                      ☐ fez
                    </span>
                  </div>
                ))}
              </div>
              <div
                className="font-fredoka"
                style={{
                  marginTop: 24,
                  color: "#FF7A59",
                  fontSize: 17,
                  transform: "rotate(-2deg)",
                  fontWeight: 600,
                }}
              >
                repetir 3x cada uma ♡
              </div>
            </div>
            <div
              style={{
                position: "absolute",
                bottom: 6,
                right: "4%",
                background: "#FF7A59",
                color: "#fff",
                fontFamily: "var(--font-fredoka), Fredoka, sans-serif",
                fontWeight: 600,
                fontSize: 16,
                padding: "10px 20px",
                borderRadius: "999px 999px 999px 4px",
                transform: "rotate(2deg)",
                boxShadow: "0 8px 20px rgba(0,0,0,.3)",
              }}
            >
              &quot;Ele não quis nem olhar.&quot;
            </div>
          </div>
          <div>
            <p
              className="font-fredoka"
              style={{
                fontWeight: 600,
                fontSize: 16,
                color: "#FFD166",
                letterSpacing: 1.5,
                textTransform: "uppercase",
                margin: "0 0 16px",
              }}
            >
              Como tudo começou
            </p>
            <h2
              className="font-fredoka"
              style={{
                fontWeight: 700,
                fontSize: "clamp(30px, 3.6vw, 46px)",
                lineHeight: 1.12,
                margin: "0 0 20px",
              }}
            >
              Duas folhas de papel. O conteúdo era bom. Meu filho não quis nem
              olhar.
            </h2>
            <p
              style={{
                fontSize: 17.5,
                lineHeight: 1.75,
                color: "#C6CFE4",
                margin: "0 0 16px",
              }}
            >
              A fono mandou o treino de casa: figuras do som CH, frases com R.
              Um pai transformou as folhas num joguinho: as mesmas palavras, mas
              com um polvo que fala, estrelinhas e um botão para gravar a própria
              voz.
            </p>
            <p
              style={{
                fontSize: 17.5,
                lineHeight: 1.75,
                color: "#C6CFE4",
                margin: "0 0 24px",
              }}
            >
              <strong style={{ color: "#fff" }}>
                Ele pediu para jogar de novo.
              </strong>{" "}
              O problema nunca foi o exercício: foi o formato. E os estudos
              mostram que essa casa é a regra: a não adesão ao treino domiciliar
              passa de 70%. A parte do tratamento que mais depende de repetição
              diária é justamente a que menos acontece.
            </p>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 12,
                background: "rgba(255,255,255,.08)",
                border: "1px solid rgba(255,255,255,.14)",
                borderRadius: 999,
                padding: "12px 24px",
                fontWeight: 800,
                fontSize: 15.5,
                color: "#FFD166",
              }}
            >
              O Falamigos é a ponte entre o consultório e a sala de casa.
            </div>
          </div>
        </div>
      </section>

      <section
        id="como"
        style={{
          position: "relative",
          padding: "0 5vw 40px",
          background: "#FFFDF8",
        }}
      >
        <svg
          viewBox="0 0 1440 90"
          preserveAspectRatio="none"
          style={{
            display: "block",
            height: 70,
            margin: "0 calc(-5vw)",
            width: "calc(100% + 10vw)",
            transform: "rotate(180deg)",
          }}
        >
          <path
            d="M0,50 C240,95 480,5 720,45 C960,85 1200,15 1440,55 L1440,90 L0,90 Z"
            fill="#1F2A44"
          />
        </svg>
        <div style={{ maxWidth: 1240, margin: "40px auto 0" }}>
          <div style={{ maxWidth: 680, marginBottom: 60 }}>
            <p
              className="font-fredoka"
              style={{
                fontWeight: 600,
                fontSize: 16,
                color: "#2F80ED",
                letterSpacing: 1.5,
                textTransform: "uppercase",
                margin: "0 0 14px",
              }}
            >
              Como funciona
            </p>
            <h2
              className="font-fredoka"
              style={{
                fontWeight: 700,
                fontSize: "clamp(30px, 3.6vw, 46px)",
                lineHeight: 1.1,
                margin: 0,
              }}
            >
              A repetição que a terapia pede, do jeito que a criança quer
            </h2>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "clamp(18px, 3vw, 40px)",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <div
                style={{
                  height: 170,
                  borderRadius: 24,
                  background: "#FFF1EC",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div
                  className="pulse-mic"
                  style={{
                    width: 92,
                    height: 92,
                    borderRadius: "50%",
                    background: "#FF7A59",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div
                    style={{
                      width: 26,
                      height: 40,
                      background: "#fff",
                      borderRadius: 13,
                      position: "relative",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        left: "50%",
                        bottom: -16,
                        transform: "translateX(-50%)",
                        width: 40,
                        height: 20,
                        border: "4px solid #fff",
                        borderTop: "none",
                        borderRadius: "0 0 24px 24px",
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        left: "50%",
                        bottom: -26,
                        transform: "translateX(-50%)",
                        width: 4,
                        height: 10,
                        background: "#fff",
                      }}
                    />
                  </div>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: 10,
                  marginTop: 14,
                }}
              >
                <span
                  className="font-fredoka"
                  style={{ fontWeight: 700, fontSize: 30, color: "#FF7A59" }}
                >
                  1
                </span>
                <span
                  className="font-fredoka"
                  style={{ fontWeight: 600, fontSize: 21 }}
                >
                  Segura e fala
                </span>
              </div>
              <p
                style={{
                  margin: 0,
                  color: "#44506E",
                  lineHeight: 1.65,
                  fontSize: 15.5,
                }}
              >
                A criança segura o botão e diz a palavra do treino, a que a
                fono escolheu.
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <div
                style={{
                  height: 170,
                  borderRadius: 24,
                  background: "#EAF3FF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 5,
                }}
              >
                {[
                  { h: 26, c: "#2F80ED", d: "0s" },
                  { h: 54, c: "#2F80ED", d: "0.12s" },
                  { h: 38, c: "#6ED3C0", d: "0.24s" },
                  { h: 70, c: "#2F80ED", d: "0.36s" },
                  { h: 44, c: "#9B6BFF", d: "0.48s" },
                  { h: 60, c: "#2F80ED", d: "0.6s" },
                  { h: 30, c: "#6ED3C0", d: "0.72s" },
                ].map((b, i) => (
                  <div
                    key={i}
                    className="wave-bar"
                    style={{
                      width: 8,
                      height: b.h,
                      background: b.c,
                      borderRadius: 4,
                      animationDelay: b.d,
                    }}
                  />
                ))}
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: 10,
                  marginTop: 14,
                }}
              >
                <span
                  className="font-fredoka"
                  style={{ fontWeight: 700, fontSize: 30, color: "#2F80ED" }}
                >
                  2
                </span>
                <span
                  className="font-fredoka"
                  style={{ fontWeight: 600, fontSize: 21 }}
                >
                  Ouve a própria voz
                </span>
              </div>
              <p
                style={{
                  margin: 0,
                  color: "#44506E",
                  lineHeight: 1.65,
                  fontSize: 15.5,
                }}
              >
                O app toca a gravação de volta na hora. Ouvir-se é parte do
                treino, e vira brincadeira.
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <div
                style={{
                  height: 170,
                  borderRadius: 24,
                  background: "#F4EEFF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  className="twinkle"
                  style={{
                    position: "absolute",
                    top: 16,
                    left: "22%",
                    color: "#FFD166",
                    fontSize: 20,
                    animationDuration: "2.4s",
                  }}
                >
                  ★
                </div>
                <div
                  className="twinkle"
                  style={{
                    position: "absolute",
                    top: 30,
                    right: "20%",
                    color: "#9B6BFF",
                    fontSize: 15,
                    animationDelay: "0.5s",
                    animationDuration: "3s",
                  }}
                >
                  ✦
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/assets/chico-nascendo.png"
                  alt="Criaturinha Chico nascendo"
                  style={{
                    width: 108,
                    height: 108,
                    objectFit: "contain",
                    objectPosition: "center",
                    display: "block",
                  }}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: 10,
                  marginTop: 14,
                }}
              >
                <span
                  className="font-fredoka"
                  style={{ fontWeight: 700, fontSize: 30, color: "#9B6BFF" }}
                >
                  3
                </span>
                <span
                  className="font-fredoka"
                  style={{ fontWeight: 600, fontSize: 21 }}
                >
                  Criaturas nascem
                </span>
              </div>
              <p
                style={{
                  margin: 0,
                  color: "#44506E",
                  lineHeight: 1.65,
                  fontSize: 15.5,
                }}
              >
                Diga o nome três vezes em voz alta e a criaturinha nasce. É a
                repetição do fonema, disfarçada de magia.
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <div
                style={{
                  height: 170,
                  borderRadius: 24,
                  background: "#E9F8F3",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                }}
              >
                <div
                  className="font-fredoka"
                  style={{
                    background: "#fff",
                    borderRadius: 999,
                    padding: "9px 20px",
                    fontWeight: 600,
                    fontSize: 15,
                    color: "#17A88B",
                    boxShadow: "0 4px 12px rgba(23,168,139,.18)",
                    transform: "rotate(-2deg)",
                  }}
                >
                  ✓ dominou
                </div>
                <div
                  className="font-fredoka"
                  style={{
                    background: "#fff",
                    borderRadius: 999,
                    padding: "9px 20px",
                    fontWeight: 600,
                    fontSize: 15,
                    color: "#FF7A59",
                    boxShadow: "0 4px 12px rgba(255,122,89,.18)",
                    transform: "rotate(1.5deg)",
                  }}
                >
                  ↻ repetir
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: 10,
                  marginTop: 14,
                }}
              >
                <span
                  className="font-fredoka"
                  style={{ fontWeight: 700, fontSize: 30, color: "#17A88B" }}
                >
                  4
                </span>
                <span
                  className="font-fredoka"
                  style={{ fontWeight: 600, fontSize: 21 }}
                >
                  A fono acompanha
                </span>
              </div>
              <p
                style={{
                  margin: 0,
                  color: "#44506E",
                  lineHeight: 1.65,
                  fontSize: 15.5,
                }}
              >
                Áudios curtos chegam ao painel da fono, que avalia com um toque
                e ajusta o plano à distância.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        id="mundos"
        style={{ padding: "80px 5vw 90px", background: "#fff" }}
      >
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              gap: 30,
              flexWrap: "wrap",
              marginBottom: 54,
            }}
          >
            <div style={{ maxWidth: 620 }}>
              <p
                className="font-fredoka"
                style={{
                  fontWeight: 600,
                  fontSize: 16,
                  color: "#9B6BFF",
                  letterSpacing: 1.5,
                  textTransform: "uppercase",
                  margin: "0 0 14px",
                }}
              >
                Os mundos
              </p>
              <h2
                className="font-fredoka"
                style={{
                  fontWeight: 700,
                  fontSize: "clamp(30px, 3.6vw, 46px)",
                  lineHeight: 1.1,
                  margin: 0,
                }}
              >
                Criaturinhas que só nascem quando a criança fala
              </h2>
            </div>
            <p
              style={{
                maxWidth: 400,
                fontSize: 16.5,
                lineHeight: 1.65,
                color: "#44506E",
                margin: 0,
              }}
            >
              Ela escolhe o mundo que ama. Cada criatura nasce quando ela diz o
              nome <strong>três vezes em voz alta</strong>: a repetição do
              fonema, disfarçada de magia.
            </p>
          </div>
          <CriaturasGrid />
          <p
            style={{
              textAlign: "center",
              margin: "44px 0 0",
              fontSize: 15,
              color: "#7683A3",
              fontWeight: 700,
            }}
          >
            Com o nome da criança dentro das frases, listas no tema que ela ama
            e áudio-modelo com o sotaque da sua região. ✦
          </p>
        </div>
      </section>

      <section
        style={{
          position: "relative",
          background: "#141D33",
          color: "#fff",
          overflow: "hidden",
        }}
      >
        <svg
          viewBox="0 0 1440 90"
          preserveAspectRatio="none"
          style={{ display: "block", width: "100%", height: 70 }}
        >
          <path
            d="M0,55 C260,10 520,90 760,45 C1000,0 1240,80 1440,40 L1440,0 L0,0 Z"
            fill="#FFFDF8"
          />
        </svg>
        <div
          className="twinkle"
          style={{
            position: "absolute",
            top: "18%",
            left: "8%",
            color: "#FFD166",
            fontSize: 22,
            animationDuration: "3.2s",
          }}
        >
          ★
        </div>
        <div
          className="twinkle"
          style={{
            position: "absolute",
            top: "34%",
            right: "10%",
            color: "#9B6BFF",
            fontSize: 18,
            animationDelay: "0.8s",
            animationDuration: "4s",
          }}
        >
          ★
        </div>
        <div
          className="twinkle"
          style={{
            position: "absolute",
            bottom: "22%",
            left: "14%",
            color: "#6ED3C0",
            fontSize: 15,
            animationDelay: "1.4s",
            animationDuration: "3.6s",
          }}
        >
          ✦
        </div>
        <div
          className="twinkle"
          style={{
            position: "absolute",
            top: "60%",
            right: "20%",
            color: "#fff",
            fontSize: 13,
            animationDelay: "0.4s",
            animationDuration: "2.8s",
          }}
        >
          ✦
        </div>
        <div
          className="capsula-grid"
          style={{
            maxWidth: 1180,
            margin: "0 auto",
            padding: "60px 5vw 100px",
            display: "grid",
            gridTemplateColumns: "minmax(320px, 1.05fr) minmax(300px, 0.95fr)",
            gap: "clamp(48px, 8vw, 120px)",
            alignItems: "center",
          }}
        >
          <div>
            <p
              className="font-fredoka"
              style={{
                fontWeight: 600,
                fontSize: 16,
                color: "#FFD166",
                letterSpacing: 1.5,
                textTransform: "uppercase",
                margin: "0 0 18px",
              }}
            >
              ✦ Cápsula do Tempo
            </p>
            <div
              className="font-fredoka"
              style={{
                fontWeight: 700,
                fontSize: "clamp(34px, 4vw, 54px)",
                lineHeight: 1.1,
              }}
            >
              <span
                style={{
                  color: "#FF9E85",
                  textDecoration: "line-through",
                  textDecorationThickness: 3,
                  textDecorationColor: "rgba(255,158,133,.55)",
                }}
              >
                evelador
              </span>
              <span style={{ color: "#7683A3", margin: "0 10px" }}>→</span>
              <span style={{ color: "#6ED3C0" }}>elevador</span>
            </div>
            <p
              style={{
                fontSize: 17.5,
                lineHeight: 1.75,
                color: "#C6CFE4",
                margin: "24px 0 16px",
              }}
            >
              A terapia existe para corrigir exatamente aquilo que a gente, em
              segredo, acha uma gracinha. E quando o tratamento funciona, essas
              palavras somem sem avisar.{" "}
              <strong style={{ color: "#fff" }}>
                A última vez que ele diz &quot;evelador&quot;, ninguém sabe que
                foi a última.
              </strong>
            </p>
            <p
              style={{
                fontSize: 17.5,
                lineHeight: 1.75,
                color: "#C6CFE4",
                margin: 0,
              }}
            >
              Guardamos milhares de fotos dos nossos filhos, mas quase ninguém
              guarda a voz. O Falamigos grava desde o primeiro dia. O antes e o
              depois, lado a lado, para sempre.
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {capsulas.map((g) => (
              <div
                key={g.titulo}
                style={{
                  background: "rgba(255,255,255,.06)",
                  border: "1px solid rgba(255,255,255,.12)",
                  borderRadius: 20,
                  padding: "18px 22px",
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    background: g.cor,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <div
                    style={{
                      width: 0,
                      height: 0,
                      borderLeft: "13px solid #fff",
                      borderTop: "8px solid transparent",
                      borderBottom: "8px solid transparent",
                      marginLeft: 3,
                    }}
                  />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    className="font-fredoka"
                    style={{ fontWeight: 600, fontSize: 17.5 }}
                  >
                    {g.titulo}
                  </div>
                  <div
                    style={{
                      fontSize: 13.5,
                      color: "#9AA7C7",
                      fontWeight: 700,
                    }}
                  >
                    {g.sub}
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: 3,
                    alignItems: "center",
                    height: 30,
                    flexShrink: 0,
                  }}
                >
                  {g.barras.map((b, i) => (
                    <div
                      key={i}
                      style={{
                        width: 4,
                        height: b,
                        background: g.onda,
                        borderRadius: 2,
                        animation: "wavepulse 1.6s ease-in-out infinite",
                        animationDelay: `${i}00ms`,
                      }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: "#FFFDF8", padding: "0 5vw 90px" }}>
        <svg
          viewBox="0 0 1440 90"
          preserveAspectRatio="none"
          style={{
            display: "block",
            height: 70,
            margin: "0 calc(-5vw) 60px",
            width: "calc(100% + 10vw)",
          }}
        >
          <path
            d="M0,55 C260,10 520,90 760,45 C1000,0 1240,80 1440,40 L1440,0 L0,0 Z"
            fill="#141D33"
          />
        </svg>
        <div
          className="ciencia-grid"
          style={{
            maxWidth: 1180,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "minmax(300px, 0.95fr) minmax(420px, 1.15fr)",
            gap: "clamp(48px, 7vw, 110px)",
            alignItems: "center",
          }}
        >
          <div style={{ maxWidth: 560 }}>
            <p
              className="font-fredoka"
              style={{
                fontWeight: 600,
                fontSize: 16,
                color: "#2F80ED",
                letterSpacing: 1.5,
                textTransform: "uppercase",
                margin: "0 0 14px",
              }}
            >
              Baseado em ciência
            </p>
            <h2
              className="font-fredoka"
              style={{
                fontWeight: 700,
                fontSize: "clamp(26px, 2.8vw, 38px)",
                lineHeight: 1.2,
                margin: "0 0 18px",
                textWrap: "balance",
              }}
            >
              Não inventamos um método.
              <br />
              Automatizamos um que a USP validou.
            </h2>
            <p
              style={{
                fontSize: 16.5,
                lineHeight: 1.7,
                color: "#44506E",
                margin: 0,
              }}
            >
              Em 2025, o grupo da Profa. Haydée Wertzner (Faculdade de Medicina
              da USP) publicou no CoDAS um estudo que testou este modelo à mão:
              sessões a distância, treino diário em casa com participação dos
              pais e análise assíncrona pela fono.
            </p>
          </div>
          <div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "max-content 1fr",
                columnGap: 36,
                rowGap: 0,
                alignItems: "center",
              }}
            >
              {ciencia.map((n) => (
                <div
                  key={n.num}
                  style={{
                    display: "contents",
                  }}
                >
                  <div
                    className="font-fredoka"
                    style={{
                      fontWeight: 700,
                      fontSize: "clamp(30px, 2.8vw, 40px)",
                      color: n.cor,
                      whiteSpace: "nowrap",
                      lineHeight: 1,
                      padding: "26px 0",
                      borderBottom: "2px dotted #E4E0D2",
                    }}
                  >
                    {n.num}
                  </div>
                  <div
                    style={{
                      fontSize: 16.5,
                      color: "#44506E",
                      lineHeight: 1.5,
                      fontWeight: 600,
                      padding: "26px 0",
                      borderBottom: "2px dotted #E4E0D2",
                    }}
                  >
                    {n.texto}
                  </div>
                </div>
              ))}
            </div>
            <p
              style={{
                fontSize: 12.5,
                color: "#98A0B5",
                lineHeight: 1.6,
                margin: "22px 0 0",
              }}
            >
              Barbosa DA, Wertzner HF. Eficácia do plano de intervenção da
              abordagem dos Ciclos adaptada por telefonoaudiologia com enfoque
              parental para crianças com transtornos dos sons da fala. CoDAS.
              2025;37(4):e20240216. SciELO / PubMed Central.
            </p>
          </div>
        </div>
      </section>

      <section id="fonos" style={{ background: "#EAF8F3", padding: "90px 5vw" }}>
        <div
          className="fonos-grid"
          style={{
            maxWidth: 1180,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "minmax(300px, 0.9fr) minmax(360px, 1.2fr)",
            gap: "clamp(30px, 5vw, 70px)",
            alignItems: "center",
          }}
        >
          <div>
            <p
              className="font-fredoka"
              style={{
                fontWeight: 600,
                fontSize: 16,
                color: "#17A88B",
                letterSpacing: 1.5,
                textTransform: "uppercase",
                margin: "0 0 14px",
              }}
            >
              Para fonos
            </p>
            <h2
              className="font-fredoka"
              style={{
                fontWeight: 700,
                fontSize: "clamp(28px, 3.4vw, 44px)",
                lineHeight: 1.12,
                margin: "0 0 18px",
              }}
            >
              Você é o cérebro. O app é o soldado do dever de casa.
            </h2>
            <p
              style={{
                fontSize: 17,
                lineHeight: 1.7,
                color: "#35564C",
                margin: "0 0 28px",
              }}
            >
              Isto não substitui a fono: está escrito em todas as telas do
              painel. A avaliação, o diagnóstico, a escolha dos alvos e a
              conduta são sempre seus. O jogo da criança muda sozinho conforme a
              sua conduta.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {painel.map((f) => (
                <div
                  key={f.titulo}
                  style={{
                    display: "flex",
                    gap: 14,
                    alignItems: "flex-start",
                  }}
                >
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      background: "#17A88B",
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 900,
                      fontSize: 14,
                      flexShrink: 0,
                      marginTop: 1,
                    }}
                  >
                    ✓
                  </div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 16.5,
                      lineHeight: 1.6,
                      color: "#1F2A44",
                    }}
                  >
                    <strong>{f.titulo}</strong>: {f.texto}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/dashboard-ui.png"
              alt="Painel da fono: lista de pacientes, adesão da semana e fila de escuta"
              style={{
                width: "100%",
                height: "auto",
                display: "block",
                borderRadius: 20,
                boxShadow: "0 28px 60px rgba(20, 60, 50, 0.18)",
                border: "1px solid rgba(23,168,139,.12)",
                background: "#fff",
              }}
            />
          </div>
        </div>
      </section>

      <footer
        style={{ background: "#1F2A44", color: "#C6CFE4", padding: "0 5vw 40px" }}
      >
        <svg
          viewBox="0 0 1440 90"
          preserveAspectRatio="none"
          style={{
            display: "block",
            height: 70,
            margin: "0 calc(-5vw) 40px",
            width: "calc(100% + 10vw)",
          }}
        >
          <path
            d="M0,50 C240,95 480,5 720,45 C960,85 1200,15 1440,55 L1440,90 L0,90 Z"
            fill="#EAF8F3"
            transform="rotate(180 720 45)"
          />
        </svg>
        <div
          style={{
            maxWidth: 1180,
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 40,
            flexWrap: "wrap",
          }}
        >
          <div>
            <div style={{ marginBottom: 12 }}>
              <Logo dark height={32} />
            </div>
            <p
              style={{
                margin: 0,
                fontSize: 14.5,
                maxWidth: 340,
                lineHeight: 1.65,
              }}
            >
              Falar é mágico. Amigos para sempre.
              <br />A ponte entre o consultório da fono e a sala de casa.
            </p>
          </div>
          <div style={{ display: "flex", gap: 60, flexWrap: "wrap" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
                fontSize: 14.5,
              }}
            >
              <div
                className="font-fredoka"
                style={{ fontWeight: 600, color: "#fff", fontSize: 15 }}
              >
                Navegação
              </div>
              <a href="#historia" className="footer-link">
                A história
              </a>
              <a href="#como" className="footer-link">
                Como funciona
              </a>
              <a href="#fonos" className="footer-link">
                Para fonos
              </a>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
                fontSize: 14.5,
              }}
            >
              <div
                className="font-fredoka"
                style={{ fontWeight: 600, color: "#fff", fontSize: 15 }}
              >
                Contato
              </div>
              <a href="mailto:ola@falamigos.com.br" className="footer-link">
                ola@falamigos.com.br
              </a>
            </div>
          </div>
        </div>
        <div
          style={{
            maxWidth: 1180,
            margin: "36px auto 0",
            borderTop: "1px solid rgba(255,255,255,.12)",
            paddingTop: 20,
            fontSize: 13,
            color: "#7683A3",
            display: "flex",
            justifyContent: "space-between",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <span>
            © 2026 Falamigos. Quem trata é a fono; nós somos a ponte entre a
            consulta e a casa.
          </span>
          <span>Feito com carinho no Brasil ✦</span>
        </div>
      </footer>
    </>
  );
}
