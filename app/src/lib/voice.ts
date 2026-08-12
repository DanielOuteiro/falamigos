import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';
import { chicoLines, ChicoLineId } from '@/data/chico';

/**
 * Clips gravados (ElevenLabs). Se existir, usam-se no lugar do TTS.
 * Adiciona aqui novos ficheiros à medida que chegam.
 */
const modelClips: Record<string, number> = {
  chave: require('../../assets/chico-chave.mp3'),
  peixe: require('../../assets/chico-peixe.mp3'),
  bruxa: require('../../assets/chico-bruxa.mp3'),
  cha: require('../../assets/chico-cha.mp3'),
  cachorro: require('../../assets/chico-cachorro.mp3'),
  chupeta: require('../../assets/chico-chupeta.mp3'),
  chaleira: require('../../assets/chico-chaleira.mp3'),
  'guarda-chuva': require('../../assets/chico-guarda_chuva.mp3'),
  bexiga: require('../../assets/chico-bexiga.mp3'),
  abacaxi: require('../../assets/chico-abacaxi.mp3'),
  mochila: require('../../assets/chico-mochila.mp3'),
  machucado: require('../../assets/chico-machucado.mp3'),
  enxada: require('../../assets/chico-enxada.mp3'),
};

const chicoClips: Partial<Record<ChicoLineId, number>> = {
  segura: require('../../assets/chico-segura.mp3'),
  ouvidos: require('../../assets/chico-ouvidos.mp3'),
};

/**
 * Frases inteiras (Eco / A Travessia), por frase.id — clip do Chico se
 * existir, senão cai no TTS via speakFrase().
 */
const fraseClips: Record<string, number> = {
  bruxa_chapeu: require('../../assets/eco-bruxa-chapeu.mp3'),
  cachorro_late: require('../../assets/eco-cachorro-late.mp3'),
  chave_porta: require('../../assets/eco-chave-porta.mp3'),
  chupeta_caiu: require('../../assets/eco-chupeta-caiu.mp3'),
  chaleira_apitou: require('../../assets/eco-chaleira-apitou.mp3'),
  guarda_chuva_pega: require('../../assets/eco-guarda-chuva-pega.mp3'),
  bexiga_estourou: require('../../assets/eco-bexiga-estourou.mp3'),
  abacaxi_doce: require('../../assets/eco-abacaxi-doce.mp3'),
  mochila_pesada: require('../../assets/eco-mochila-pesada.mp3'),
  machucado_joelho: require('../../assets/eco-machucado-joelho.mp3'),
  enxada_vovo: require('../../assets/eco-enxada-vovo.mp3'),

  cha_quente: require('../../assets/travessia-cha-quente.mp3'),
  chave_perdida: require('../../assets/travessia-chave-perdida.mp3'),
  peixe_nada: require('../../assets/travessia-peixe-nada.mp3'),
  chupeta_cade: require('../../assets/travessia-chupeta-cade.mp3'),
  chaleira_fogo: require('../../assets/travessia-chaleira-fogo.mp3'),
  guarda_chuva_azul: require('../../assets/travessia-guarda-chuva-azul.mp3'),
  bexiga_sopra: require('../../assets/travessia-bexiga-sopra.mp3'),
  abacaxi_corta: require('../../assets/travessia-abacaxi-corta.mp3'),
  mochila_leva: require('../../assets/travessia-mochila-leva.mp3'),
  machucado_sarou: require('../../assets/travessia-machucado-sarou.mp3'),
  enxada_cavou: require('../../assets/travessia-enxada-cavou.mp3'),
};

/** Variações — evita repetir a mesma frase em seguida. */
const chicoClipVariants: Partial<Record<ChicoLineId, number[]>> = {
  isso: [
    require('../../assets/chico-isso-1.mp3'),
    require('../../assets/chico-isso-2.mp3'),
    require('../../assets/chico-isso-3.mp3'),
    require('../../assets/chico-isso-4.mp3'),
    require('../../assets/chico-isso-5.mp3'),
  ],
  olha: [
    require('../../assets/chico-olha-1.mp3'),
    require('../../assets/chico-olha-2.mp3'),
    require('../../assets/chico-olha-3.mp3'),
    require('../../assets/chico-olha-4.mp3'),
  ],
  estrela: [
    require('../../assets/chico-estrela-1.mp3'),
    require('../../assets/chico-estrela-2.mp3'),
    require('../../assets/chico-estrela-3.mp3'),
    require('../../assets/chico-estrela-4.mp3'),
    require('../../assets/chico-estrela-5.mp3'),
    require('../../assets/chico-estrela-6.mp3'),
  ],
};

const lastVariantIndex: Partial<Record<ChicoLineId, number>> = {};

function pickVariantClip(lineId: ChicoLineId, clips: number[]): number {
  if (clips.length === 1) return clips[0];
  const last = lastVariantIndex[lineId] ?? -1;
  let next = Math.floor(Math.random() * (clips.length - 1));
  if (last >= 0 && next >= last) next += 1;
  lastVariantIndex[lineId] = next;
  return clips[next];
}

let clipSound: Audio.Sound | null = null;

async function ensurePlaybackMode() {
  await Audio.setAudioModeAsync({
    allowsRecordingIOS: false,
    playsInSilentModeIOS: true,
  });
}

async function playClip(source: number): Promise<void> {
  await ensurePlaybackMode();
  Speech.stop();
  if (clipSound) {
    try {
      await clipSound.stopAsync();
      await clipSound.unloadAsync();
    } catch {
      // ignore
    }
    clipSound = null;
  }

  const { sound } = await Audio.Sound.createAsync(source, { shouldPlay: true });
  clipSound = sound;

  await new Promise<void>((resolve) => {
    sound.setOnPlaybackStatusUpdate((status) => {
      if (!status.isLoaded) return;
      if (status.didJustFinish) {
        resolve();
      }
    });
  });

  if (clipSound === sound) {
    try {
      await sound.unloadAsync();
    } catch {
      // ignore
    }
    clipSound = null;
  }
}

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

export async function stopVoice() {
  Speech.stop();
  if (!clipSound) return;
  try {
    await clipSound.stopAsync();
    await clipSound.unloadAsync();
  } catch {
    // ignore
  }
  clipSound = null;
}

/** Voz-modelo: fala a palavra inteira (clip se existir, senão TTS). */
export async function speakModel(word: string): Promise<void> {
  const key = word
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
  const clip = modelClips[key] ?? modelClips[word.toLowerCase()];
  if (clip) {
    try {
      await playClip(clip);
      return;
    } catch {
      // cai no TTS
    }
  }
  return speakAsync(word, { language: 'pt-BR', rate: 0.78, pitch: 1.0 });
}

/** Voz-modelo pra frase inteira (Eco/Travessia): clip por frase.id, senão TTS. */
export async function speakFrase(fraseId: string, textoFallback: string): Promise<void> {
  const clip = fraseClips[fraseId];
  if (clip) {
    try {
      await playClip(clip);
      return;
    } catch {
      // cai no TTS
    }
  }
  return speakAsync(textoFallback, { language: 'pt-BR', rate: 0.82, pitch: 1.0 });
}

/** Voz do Chico: clip se existir, senão TTS. */
export async function speakChico(lineId: ChicoLineId, vars?: { nome?: string }): Promise<void> {
  const variants = chicoClipVariants[lineId];
  if (variants?.length) {
    try {
      await playClip(pickVariantClip(lineId, variants));
      return;
    } catch {
      // cai no TTS
    }
  }
  const clip = chicoClips[lineId];
  if (clip) {
    try {
      await playClip(clip);
      return;
    } catch {
      // cai no TTS
    }
  }
  let text: string = chicoLines[lineId];
  if (vars?.nome) text = text.replace('{nome}', vars.nome);
  return speakAsync(text, { language: 'pt-BR', rate: 1.05, pitch: 1.2 });
}

/**
 * Fala uma palavra sílaba a sílaba, chamando onSilaba(indice) antes de cada
 * uma (e onSilaba(null) no final) — para a UI destacar a bolhinha certa em
 * sincronia exata com o áudio.
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
