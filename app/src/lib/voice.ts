import * as Speech from 'expo-speech';
import { chicoLines, ChicoLineId } from '@/data/chico';

/**
 * PONTO DE TROCA: hoje toda a voz sai por TTS (expo-speech, pt-BR).
 * Amanhã, troque o corpo destas 3 funções por Audio.Sound.createAsync
 * de ficheiros mp3 gravados (voz-modelo real e voz do ator do Chico),
 * sem tocar em nenhum ecrã — todos eles só chamam speakModel/speakChico/speakSlow.
 */

function speakAsync(text: string, options: Speech.SpeechOptions): Promise<void> {
  return new Promise((resolve) => {
    Speech.speak(text, {
      ...options,
      onDone: () => resolve(),
      onStopped: () => resolve(),
      onError: () => resolve(),
    });
  });
}

export function stopVoice() {
  Speech.stop();
}

/** Voz-modelo: fala a palavra inteira, devagar e clara. */
export function speakModel(word: string): Promise<void> {
  return speakAsync(word, { language: 'pt-BR', rate: 0.78, pitch: 1.0 });
}

/** Voz do Chico: aguda, animada, o polvo mascote. */
export function speakChico(lineId: ChicoLineId, vars?: { nome?: string }): Promise<void> {
  let text: string = chicoLines[lineId];
  if (vars?.nome) text = text.replace('{nome}', vars.nome);
  return speakAsync(text, { language: 'pt-BR', rate: 1.05, pitch: 1.2 });
}

/**
 * Fala uma palavra sílaba a sílaba, chamando onSilaba(indice) antes de cada
 * uma (e onSilaba(null) no final) — para a UI destacar a bolhinha certa em
 * sincronia exata com o áudio (em vez de um "sincronismo aproximado").
 */
export async function speakSyllables(
  syllables: string[],
  onSilaba?: (index: number | null) => void,
  options?: { rate?: number; gapMs?: number }
): Promise<void> {
  const rate = options?.rate ?? 0.72;
  const gapMs = options?.gapMs ?? 90;
  for (let i = 0; i < syllables.length; i++) {
    onSilaba?.(i);
    await speakAsync(syllables[i], { language: 'pt-BR', rate, pitch: 1.0 });
    if (i < syllables.length - 1) await new Promise((r) => setTimeout(r, gapMs));
  }
  onSilaba?.(null);
}

/** Fala sílaba a sílaba, bem devagar, com pausa entre elas (correção de erro). */
export function speakSlow(syllables: string[], onSilaba?: (index: number | null) => void): Promise<void> {
  return speakSyllables(syllables, onSilaba, { rate: 0.55, gapMs: 160 });
}

export function isSpeaking(): Promise<boolean> {
  return Speech.isSpeakingAsync();
}
