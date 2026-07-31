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

export async function listSavedRecordings(): Promise<string[]> {
  ensureRecsDir();
  return recsDir
    .list()
    .filter((entry): entry is File => entry instanceof File)
    .map((f) => f.uri);
}

let currentSound: Audio.Sound | null = null;

export async function playFile(uri: string): Promise<void> {
  if (currentSound) {
    try {
      await currentSound.unloadAsync();
    } catch {
      // ignore
    }
    currentSound = null;
  }
  const { sound } = await Audio.Sound.createAsync({ uri }, { shouldPlay: true });
  currentSound = sound;
  return new Promise((resolve) => {
    sound.setOnPlaybackStatusUpdate((status) => {
      if ('didJustFinish' in status && status.didJustFinish) {
        sound.unloadAsync().catch(() => {});
        resolve();
      }
    });
  });
}
