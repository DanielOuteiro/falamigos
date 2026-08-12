import type { Word } from '@/data/modelWords';

export type ParQualEQual = {
  id: string;
  certaId: string;
  erradaId: string;
};

/**
 * Gera as rodadas de "Qual é qual?" a partir das palavras do dia — a criança
 * ouve a palavra-alvo (certaId) e toca na imagem certa entre ela e uma
 * distratora (erradaId, a palavra 2 posições adiante, circular).
 */
export function gerarParesQualEQual(words: Word[]): ParQualEQual[] {
  if (words.length < 2) return [];
  return words.map((word, i) => {
    const distratora = words[(i + 2) % words.length];
    return {
      id: `${word.id}_vs_${distratora.id}`,
      certaId: word.id,
      erradaId: distratora.id,
    };
  });
}
