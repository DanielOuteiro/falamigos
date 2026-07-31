import React, { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, Defs, Ellipse, Path, RadialGradient, Stop } from 'react-native-svg';
import { colors } from '@/theme/colors';
import { useRingOut } from '@/lib/motion';
import { hapticLeve, hapticSucesso } from '@/lib/haptics';
import { speakChico, speakModel, speakSyllables } from '@/lib/voice';
import {
  discardRecording,
  ensureMicPermission,
  normalizeMetering,
  playFile,
  saveRecordingToFile,
  startRecording,
  stopRecording,
  type RecordingHandle,
} from '@/lib/recorder';
import { BubbleButton } from '@/components/ui/BubbleButton';
import type { ChicoPose } from '@/components/ChicoSprite';

const MIN_DURATION_MS = 400;
const MAX_DURATION_MS = 6000;
const MAX_REPEATS = 3;

type MicState = 'idle' | 'recording' | 'captured';

type Props = {
  wordId: string;
  palavra: string;
  silabas?: string[];
  onSilabaFalando?: (index: number | null) => void;
  size?: number;
  onPoseChange?: (pose: ChicoPose) => void;
  onCompleted: (uri: string) => void;
};

export function MicButton({
  wordId,
  palavra,
  silabas,
  onSilabaFalando,
  size = 220,
  onPoseChange,
  onCompleted,
}: Props) {
  const [state, setState] = useState<MicState>('idle');
  const [repeatCount, setRepeatCount] = useState(0);
  const [busy, setBusy] = useState(false);
  const [prontoParaAcoes, setProntoParaAcoes] = useState(false);

  const handleRef = useRef<RecordingHandle | null>(null);
  const pressStartRef = useRef(0);
  const tempUriRef = useRef<string | null>(null);
  const autoStopRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const usingFakePulse = useRef(false);
  const soltouCedoRef = useRef(false);

  const level = useSharedValue(0);

  const ringA = useRingOut(2200, 0);
  const ringB = useRingOut(2200, 1100);

  const recordRingStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + level.value * 0.55 }],
    opacity: 0.35 + level.value * 0.5,
  }));

  useEffect(() => {
    return () => {
      if (autoStopRef.current) clearTimeout(autoStopRef.current);
    };
  }, []);

  function startFakePulse() {
    usingFakePulse.current = true;
    level.value = withRepeat(withTiming(1, { duration: 380, easing: Easing.inOut(Easing.sin) }), -1, true);
  }

  async function handlePressIn() {
    if (state !== 'idle' || busy) return;
    hapticLeve();
    onPoseChange?.('listening');
    setBusy(true);
    soltouCedoRef.current = false;
    const granted = await ensureMicPermission();
    if (!granted) {
      setBusy(false);
      onPoseChange?.('idle');
      return;
    }
    setState('recording');
    pressStartRef.current = Date.now();
    usingFakePulse.current = false;
    level.value = 0;

    let gotRealMetering = false;
    const handle = await startRecording((status: any) => {
      if (usingFakePulse.current) return;
      if (typeof status?.metering === 'number') {
        gotRealMetering = true;
        level.value = withTiming(normalizeMetering(status.metering), { duration: 90 });
      } else if (!gotRealMetering) {
        startFakePulse();
      }
    });
    handleRef.current = handle;
    setBusy(false);

    if (soltouCedoRef.current) {
      handlePressOut();
      return;
    }

    autoStopRef.current = setTimeout(() => {
      handlePressOut();
    }, MAX_DURATION_MS);
  }

  async function handlePressOut() {
    if (!handleRef.current) {
      soltouCedoRef.current = true;
      return;
    }
    if (autoStopRef.current) {
      clearTimeout(autoStopRef.current);
      autoStopRef.current = null;
    }
    const duration = Date.now() - pressStartRef.current;
    const handle = handleRef.current;
    handleRef.current = null;
    const result = await stopRecording(handle);
    level.value = withTiming(0, { duration: 200 });

    // Pequena pausa para a sessão de áudio nativa liberar o modo de
    // gravação antes de falar — sem isso, a primeira fala do Chico logo
    // após parar de gravar pode sair muda em alguns aparelhos.
    await new Promise((r) => setTimeout(r, 220));

    if (!result || duration < MIN_DURATION_MS) {
      if (result?.uri) await discardRecording(result.uri);
      setState('idle');
      onPoseChange?.('talking');
      await speakChico('segura');
      onPoseChange?.('idle');
      return;
    }

    tempUriRef.current = result.uri;
    const finalUri = await saveRecordingToFile(result.uri, wordId);
    tempUriRef.current = finalUri;
    setState('captured');
    setProntoParaAcoes(false);

    onPoseChange?.('talking');
    await speakChico('olha');
    onPoseChange?.('idle');
    try {
      await playFile(finalUri);
    } catch {
      // reprodução falhou silenciosamente — segue o fluxo mesmo assim
    }
    setProntoParaAcoes(true);
  }

  async function handleRepeat() {
    if (busy) return;
    setBusy(true);
    setRepeatCount((c) => c + 1);
    onPoseChange?.('talking');
    if (silabas && silabas.length > 0) {
      await speakSyllables(silabas, onSilabaFalando);
    } else {
      await speakModel(palavra);
    }
    onPoseChange?.('idle');
    setState('idle');
    setProntoParaAcoes(false);
    setBusy(false);
  }

  async function handleStar() {
    if (busy || !tempUriRef.current) return;
    setBusy(true);
    hapticSucesso();
    onPoseChange?.('celebrating');
    await speakChico('estrela');
    const finalUri = tempUriRef.current;
    tempUriRef.current = null;
    setRepeatCount(0);
    setState('idle');
    setProntoParaAcoes(false);
    setBusy(false);
    onCompleted(finalUri);
  }

  return (
    <View style={styles.wrap}>
      {state !== 'captured' && (
        <>
          <Animated.View style={[StyleSheet.absoluteFill, ringA]} pointerEvents="none">
            <RingSvg size={size} color={colors.turquesaClaro} strokeWidth={6} />
          </Animated.View>
          <Animated.View style={[StyleSheet.absoluteFill, ringB]} pointerEvents="none">
            <RingSvg size={size} color={colors.turquesa} strokeWidth={8} />
          </Animated.View>
        </>
      )}

      {state === 'recording' && (
        <Animated.View style={[StyleSheet.absoluteFill, recordRingStyle]} pointerEvents="none">
          <RingSvg size={size} color={colors.turquesaSuave} strokeWidth={10} />
        </Animated.View>
      )}

      <Pressable
        disabled={state === 'captured' || busy}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={{ width: size, height: size }}
      >
        <ShellPearl size={size} pressed={state === 'recording'} />
      </Pressable>

      {state === 'captured' && prontoParaAcoes && (
        <View style={styles.actions}>
          <BubbleButton
            emoji="🔁"
            size={68}
            onPress={handleRepeat}
            disabled={busy || repeatCount >= MAX_REPEATS}
            dim={repeatCount >= MAX_REPEATS}
          />
          <BubbleButton emoji="⭐" size={68} color={colors.estrela} onPress={handleStar} disabled={busy} />
        </View>
      )}
    </View>
  );
}

function RingSvg({ size, color, strokeWidth }: { size: number; color: string; strokeWidth: number }) {
  const vb = 260;
  return (
    <Svg width={size} height={size} viewBox={`0 0 ${vb} ${vb}`}>
      <Circle cx={130} cy={140} r={104} fill="none" stroke={color} strokeWidth={strokeWidth} />
    </Svg>
  );
}

function ShellPearl({ size, pressed }: { size: number; pressed: boolean }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 260 260">
      <Defs>
        <RadialGradient id="pearlBtn" cx="35%" cy="30%" r="75%">
          <Stop offset="0%" stopColor="#FFFFFF" />
          <Stop offset="55%" stopColor="#DFF8FC" />
          <Stop offset="100%" stopColor="#8FD9E6" />
        </RadialGradient>
      </Defs>
      <Path
        d="M22,152 C22,58 238,58 238,152 C238,152 200,120 130,120 C60,120 22,152 22,152 Z"
        fill="#FFC9B8"
      />
      <Path
        d="M26,150 C60,120 96,110 130,110 C164,110 200,120 234,150 C214,214 176,240 130,240 C84,240 46,214 26,150 Z"
        fill="#FF7E67"
      />
      <Path
        d="M40,156 C70,132 100,124 130,124 C160,124 190,132 220,156 C204,208 172,230 130,230 C88,230 56,208 40,156 Z"
        fill="#FF9A86"
      />
      <Circle cx={130} cy={164} r={66} fill="url(#pearlBtn)" opacity={pressed ? 0.85 : 1} />
      <Ellipse cx={106} cy={138} rx={20} ry={13} fill="#FFFFFF" opacity={0.85} rotation={-30} originX={106} originY={138} />
    </Svg>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  actions: {
    position: 'absolute',
    bottom: -50,
    flexDirection: 'row',
    gap: 28,
  },
});
