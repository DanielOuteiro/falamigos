# Falamigos — Demo (app + dashboard)

Monorepo com duas aplicações independentes, sem backend, feitas para rodar
hoje mesmo:

- **`/app`** — a app da criança (Expo / React Native, roda no Expo Go)
- **`/dashboard`** — o painel da fonoaudióloga (Vite + React + Tailwind, 100% dados mock)

Fonema desta demo: **/ʃ/** (som do CH/X), universo **Fundo do Mar**, mascote **Chico** (polvo).

---

## 1. Rodar a app (Expo Go)

```bash
cd app
npm install       # só na primeira vez
npx expo start
```

Escaneie o QR code com a câmera (iOS) ou com o app **Expo Go** (Android).
Funciona 100% offline — pode testar em modo avião depois de aberto uma vez.

Fluxo completo pronto para testar: **onboarding → cápsula do tempo → mapa →
sessão (aquecimento, produção, caça-sílaba, recompensa/invocação, fecho) →
coleção → modo adulto**.

O modo adulto fica atrás de uma engrenagem discreta no rodapé do mapa.
Gate de segurança: toque os números na ordem **3 · 7 · 2** (aparecem
embaralhados na tela).

## 2. Rodar o dashboard (fonoaudióloga)

```bash
cd dashboard
npm install       # só na primeira vez
npm run dev
```

Abra a URL que aparecer no terminal (normalmente `http://localhost:5173`).
4 telas navegáveis: **Pacientes → Plano do paciente → Fila de Escuta → Relatório**.

---

## Stack técnica

| | App | Dashboard |
|---|---|---|
| Framework | Expo (React Native) + `expo-router` | Vite + React |
| Linguagem | TypeScript | TypeScript |
| Estilo | `StyleSheet` + SVG (`react-native-svg`) | Tailwind CSS v4 |
| Animação | `react-native-reanimated` | CSS/Tailwind |
| Áudio | `expo-av` (gravação/playback) + `expo-speech` (TTS pt-BR) | — (mock) |
| Persistência | `@react-native-async-storage/async-storage` | — (mock em memória) |
| Rede em runtime | **zero** | **zero** |

A app só usa bibliotecas compatíveis com Expo Go (nenhum dev build
necessário): `expo-av`, `expo-speech`, `expo-haptics`, `expo-file-system`,
`async-storage`, `react-native-reanimated` (+ `react-native-worklets`,
peer-dependency obrigatória da v4), `expo-router`, `expo-font`
(`@expo-google-fonts/baloo-2` e `/nunito`), `lucide-react-native` e
`react-native-svg` (necessária para toda a arte vetorial/animada do
cenário e do Chico, conforme pedido na direção de arte).

---

## Pontos de troca (onde entra conteúdo real depois)

A demo foi construída com estas abstrações para que trocar "placeholder"
por conteúdo de produção não exija tocar nos ecrãs:

- **`app/src/lib/voice.ts`** — hoje todo áudio (voz-modelo, falas do Chico,
  soletração lenta) sai por `expo-speech` (TTS pt-BR). As funções
  `speakModel(word)`, `speakChico(lineId)` e `speakSlow(syllables)` são o
  único ponto de contato dos ecrãs com áudio. Amanhã, troque o corpo delas
  por `Audio.Sound.createAsync(mp3Real)` — nenhum ecrã muda.
- **`app/src/components/WordArt.tsx`** — hoje devolve o emoji gigante da
  palavra (`wordId → emoji`). Amanhã, devolve uma `<Image>` do pipeline de
  ilustração, mantendo a mesma prop `wordId`. É exatamente o retângulo
  "IMAGEM: chave (do pipeline)" do protótipo de referência.
- **`app/src/components/ChicoSprite.tsx`** — hoje é um SVG (paths portados
  do protótipo `Falamigos.dc.html`) com poses `idle | listening |
  celebrating | talking`. Amanhã pode virar sprite-sheet/Lottie/vídeo sem
  mudar a prop `pose`.
- **`app/src/data/words.json`** e **`app/src/data/chico.ts`** — banco de
  palavras e falas do Chico. Hoje estático; amanhã pode vir do dashboard
  (o "Gerador de lista" do painel já simula esse fluxo).
- **`dashboard/src/mock.ts`** — toda a "base de dados" do painel. Os tipos
  (`Paciente`, `GravacaoFila`, etc.) já são o contrato esperado de uma API
  futura; trocar por `fetch`/React Query preservando os tipos é o caminho.

---

## Estrutura

```
falamigos/
├── app/            # Expo Router — app da criança
│   ├── app/        # rotas (onboarding, mapa, sessao, colecao, adulto)
│   └── src/
│       ├── components/   # ChicoSprite, MicButton, WordArt, cenário, UI
│       ├── data/         # words.json, chico.ts, universos.ts
│       ├── lib/          # voice.ts, recorder.ts, storage.ts, motion.ts...
│       └── theme/        # paleta e fontes
└── dashboard/      # Vite + React + Tailwind — painel da fonoaudióloga
    └── src/
        ├── components/   # Layout, Avatar, Heatmap, Waveform, gráficos
        ├── pages/        # Pacientes, PacientePlano, FilaDeEscuta, Relatorio
        └── mock.ts
```

---

## Nota importante

Em todos os ecrãs (app e dashboard) aparece o lembrete:
**"O Falamigos não substitui a fonoaudióloga."** — a app é um complemento de
prática guiada; a conduta clínica é sempre da profissional.
