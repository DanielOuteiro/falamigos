import type { Metadata } from "next";
import { Fredoka, Nunito_Sans } from "next/font/google";
import "./globals.css";

const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-fredoka",
  display: "swap",
});

const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
  variable: "--font-nunito",
  display: "swap",
});

const title = "FalaMigos: O treino de fala que seu filho vai pedir para repetir";
const description =
  "A criança segura um botão, fala, ouve a própria voz e vê criaturinhas mágicas nascerem. Complemento ao trabalho da fono, para crianças de 3 a 8 anos.";
const siteUrl = "https://falamigos.com.br";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  keywords: [
    "terapia da fala",
    "fonoaudiologia infantil",
    "treino de fala para crianças",
    "app de fonoaudiologia",
    "dislalia",
    "trocas de fala",
  ],
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title,
    description,
    url: siteUrl,
    siteName: "FalaMigos",
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${fredoka.variable} ${nunitoSans.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "MobileApplication",
              name: "FalaMigos",
              applicationCategory: "HealthApplication",
              operatingSystem: "iOS, Android",
              description,
              url: siteUrl,
              audience: {
                "@type": "PeopleAudience",
                suggestedMinAge: 3,
                suggestedMaxAge: 8,
              },
            }),
          }}
        />
        {children}
      </body>
    </html>
  );
}
