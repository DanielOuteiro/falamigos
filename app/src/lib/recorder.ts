import { Audio, AVPlaybackStatus } from 'expo-av';
import { Directory, File, Paths } from 'expo-file-system';

const recsDir = new Directory(Paths.document, 'recs');

function ensureRecsDir() {
  if (!recsDir.exists) {
    recsDir.create({ intermediates: true, idempotent: true });
  }
}

export async function ensureMicPermission(): Promise<boolean> {
  const { status } = await Audio.requestPermissionsAsync();
  return status === 'granted';
}

export async function configureAudioMode() {
  await Audio.setAudioModeAsync({
    allowsRecordingIOS: true,
    playsInSilentModeIOS: true,
    staysActiveInBackground: false,
    shouldDuckAndroid: true,
  });
}

async function releaseRecordingMode() {
  await Audio.setAudioModeAsync({
    allowsRecordingIOS: false,
    playsInSilentModeIOS: true,
  });
}

const RECORDING_OPTIONS: Audio.RecordingOptions = {
  ...Audio.RecordingOptionsPresets.HIGH_QUALITY,
  isMeteringEnabled: true,
};

/**
 * dBFS (~-160 silêncio .. 0 no talo) normalizado para 0..1, com piso
 * suave para não deixar o anel achatado quando a criança fala baixinho.
 */
export function normalizeMetering(db: number | undefined): number {
  if (db === undefined || Number.isNaN(db) || !Number.isFinite(db)) return -1;
  const clamped = Math.max(-60, Math.min(0, db));
  return (clamped + 60) / 60;
}

export type RecordingHandle = {
  recording: Audio.Recording;
};

export async function startRecording(
  onStatus?: (status: AVPlaybackStatus | any) => void
): Promise<RecordingHandle> {
  await configureAudioMode();
  const recording = new Audio.Recording();
  await recording.prepareToRecordAsync(RECORDING_OPTIONS);
  if (onStatus) {
    recording.setProgressUpdateInterval(100);
    recording.setOnRecordingStatusUpdate(onStatus);
  }
  await recording.startAsync();
  return { recording };
}

export async function stopRecording(
  handle: RecordingHandle
): Promise<{ uri: string; durationMillis: number } | null> {
  try {
    const status = await handle.recording.stopAndUnloadAsync();
    await releaseRecordingMode();
    const uri = handle.recording.getURI();
    if (!uri) return null;
    return { uri, durationMillis: status.durationMillis ?? 0 };
  } catch {
    return null;
  }
}

export async function discardRecording(tempUri: string) {
  try {
    const file = new File(tempUri);
    if (file.exists) file.delete();
  } catch {
    // silencioso — arquivo temporário, sem problema se já sumiu
  }
}

export async function saveRecordingToFile(tempUri: string, wordId: string): Promise<string> {
  ensureRecsDir();
  const filename = `rec_${wordId}_${Date.now()}.m4a`;
  const source = new File(tempUri);
  const destination = new File(recsDir, filename);
  await source.copy(destination);
  return destination.uri;
}

let currentSound: Audio.Sound | null = null;
let resolveCurrent: (() => void) | null = null;

export async function stopPlayback(): Promise<void> {
  const sound = currentSound;
  currentSound = null;
  resolveCurrent?.();
  resolveCurrent = null;
  if (!sound) return;
  try {
    await sound.stopAsync();
    await sound.unloadAsync();
  } catch {
    // ignore
  }
}

/** Toca a gravação da criança. Resolve sempre — no fim, em erro, ou ao fim de `maxMs`. */
export async function playFile(uri: string, maxMs = 15000): Promise<void> {
  await stopPlayback();
  let sound: Audio.Sound;
  try {
    await releaseRecordingMode();
    ({ sound } = await Audio.Sound.createAsync({ uri }, { shouldPlay: true }));
  } catch {
    return;
  }
  currentSound = sound;
  await new Promise<void>((resolve) => {
    let settled = false;
    const done = () => {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      resolveCurrent = null;
      resolve();
    };
    resolveCurrent = done;
    const timeout = setTimeout(done, maxMs);
    sound.setOnPlaybackStatusUpdate((status) => {
      if (!status.isLoaded) {
        if ('error' in status && status.error) done();
        return;
      }
      if (status.didJustFinish) done();
    });
  });
  if (currentSound === sound) {
    currentSound = null;
    sound.unloadAsync().catch(() => {});
  }
}
