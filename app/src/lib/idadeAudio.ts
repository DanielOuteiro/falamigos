import { Audio } from 'expo-av';

const SOURCES: Record<number, number> = {
  3: require('../../assets/idades/3.mp3'),
  4: require('../../assets/idades/4.mp3'),
  5: require('../../assets/idades/5.mp3'),
  6: require('../../assets/idades/6.mp3'),
  7: require('../../assets/idades/7.mp3'),
  8: require('../../assets/idades/8.mp3'),
};

const sounds = new Map<number, Audio.Sound>();
let current: Audio.Sound | null = null;

async function ensureMode() {
  await Audio.setAudioModeAsync({
    allowsRecordingIOS: false,
    playsInSilentModeIOS: true,
  });
}

/** Pré-carrega os clips 3–8. */
export async function preloadIdadeAudio() {
  await ensureMode();
  await Promise.all(
    Object.entries(SOURCES).map(async ([age, src]) => {
      const n = Number(age);
      if (sounds.has(n)) return;
      const { sound } = await Audio.Sound.createAsync(src, { shouldPlay: false });
      sounds.set(n, sound);
    })
  );
}

/** Toca o número da idade (para o clip anterior se ainda estiver a tocar). */
export async function playIdade(age: number) {
  try {
    await ensureMode();
    let sound = sounds.get(age);
    if (!sound) {
      const src = SOURCES[age];
      if (!src) return;
      const created = await Audio.Sound.createAsync(src, { shouldPlay: false });
      sound = created.sound;
      sounds.set(age, sound);
    }
    if (current && current !== sound) {
      try {
        await current.stopAsync();
      } catch {
        // ignore
      }
    }
    current = sound;
    await sound.replayAsync();
  } catch {
    // áudio não deve bloquear o ecrã
  }
}

export async function stopIdadeAudio() {
  if (!current) return;
  try {
    await current.stopAsync();
  } catch {
    // ignore
  }
}

export async function unloadIdadeAudio() {
  current = null;
  await Promise.all(
    [...sounds.values()].map(async (s) => {
      try {
        await s.unloadAsync();
      } catch {
        // ignore
      }
    })
  );
  sounds.clear();
}
