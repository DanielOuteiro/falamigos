import wordsData from '@/data/words.json';

export type Word = { id: string; palavra: string; emoji: string; silabas: string[]; alvo: number };

const TODAS = wordsData as Word[];

/** As 5 palavras da 1ª sessão de sempre (Aula 1 / Cápsula do Tempo). */
export const MODEL_WORD_IDS = ['chave', 'peixe', 'bruxa', 'cha', 'cachorro'] as const;

/**
 * Banco completo de palavras pra rotação. Começa pelas 5 da Aula 1 — assim
 * a cápsula do tempo e a 1ª sessão de verdade (que puxam da mesma rotação,
 * ver `palavrasDoDia.ts`) usam exatamente esse conjunto, na ordem certa.
 * O resto entra depois, na ordem do words.json.
 */
export const ALL_WORDS: Word[] = [
  ...MODEL_WORD_IDS.map((id) => TODAS.find((w) => w.id === id)!),
  ...TODAS.filter((w) => !MODEL_WORD_IDS.includes(w.id as (typeof MODEL_WORD_IDS)[number])),
];

export const MODEL_WORDS = MODEL_WORD_IDS.map((id) => ALL_WORDS.find((w) => w.id === id)!);

/** Acha a palavra pelo texto de exibição (ex.: "guarda-chuva", "chá") — usado por Eco/Travessia, que guardam `palavraAlvo` como texto, não id. */
export function encontrarPalavraPorTexto(texto: string): Word | undefined {
  return ALL_WORDS.find((w) => w.palavra === texto);
}
