/**
 * Falas do Chico, o polvo mascote. Faladas via speakChico(lineId).
 * Ponto de troca: no futuro, cada linha pode apontar para um mp3 gravado
 * em vez de passar pelo TTS (ver src/lib/voice.ts).
 */
export const chicoLines = {
  oi_liam: 'Oi, {nome}! Eu sou o Chico!',
  bora: 'Bora lá?',
  segura: 'Segura a pérola e fala!',
  olha: 'Olha como ficou!',
  lindo: 'Que lindo!',
  demais: 'Uau, você é demais!',
  isso: 'Isso mesmo!',
  denovo: 'De novo? Segura e fala!',
  ouvidos: 'Ouvidos mágicos: só escuta!',
  cofre: 'Vamos guardar a sua voz no cofrinho?',
  chispa: 'Diga o nome dele: CHISPA!',
  nasceu: 'Ele nasceu!',
  estrela: 'Você ganhou uma estrela!',
  tchau: 'Até amanhã, {nome}!',
} as const;

export type ChicoLineId = keyof typeof chicoLines;
