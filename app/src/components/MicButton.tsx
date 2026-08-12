import React, { useEffect, useRef, useState } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';
import { Mic } from 'lucide-react-native';
import { colors } from '@/theme/colors';
import { useRingOut } from '@/lib/motion';
import { hapticLeve, hapticSucesso } from '@/lib/haptics';
import { speakChico, speakModel } from '@/lib/voice';
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
import type { ChicoPose } from '@/components/ChicoSprite';

const clamSource = require('../../assets/concha-perola.png');
const repeatSource = require('../../assets/ui/btn-repetir.png');
const starSource = require('../../assets/ui/btn-estrela.png');
/** Arte 1024×737. */
const CLAM_ASPECT = 737 / 1024;

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
  /** Chamado sempre que a criança/pai pede pra repetir — sinal de dificuldade nessa palavra. */
  onRepeat?: () => void;
  /**
   * Como falar o modelo ao repetir — por padrão fala `palavra` via speakModel
   * (clip de palavra única). Frases inteiras (Eco/Travessia) devem passar
   * isso pra tocar o clip da frase em vez de cair no TTS lendo a frase toda.
   */
  onFalarModelo?: () => Promise<void>;
};

export function MicButton({
  wordId,
  palavra,
  silabas,
  onSilabaFalando,
  size = 220,
  onPoseChange,
  onCompleted,
  onRepeat,
  onFalarModelo,
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

  // Idle: logo fora da pérola/concha (visíveis, sem começar longe demais).
  const ringA = useRingOut(2400, 0, { fromScale: 0.58, toScale: 1.05, fromOpacity: 0.72 });
  const ringB = useRingOut(2400, 1200, { fromScale: 0.58, toScale: 1.05, fromOpacity: 0.55 });

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
    setProntoParaAcoes(false);
    setRepeatCount((c) => c + 1);
    onRepeat?.();
    // Concha volta — depois fala o modelo e fica pronta a gravar.
    setState('idle');
    clamT.value = withSpring(1, { damping: 14, stiffness: 160 });
    actionsT.value = withTiming(0, { duration: 160 });
    onPoseChange?.('talking');
    await (onFalarModelo ? onFalarModelo() : speakModel(palavra));
    onSilabaFalando?.(null);
    onPoseChange?.('idle');
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

  const pressScale = useSharedValue(1);
  const clamT = useSharedValue(1);
  const actionsT = useSharedValue(0);

  useEffect(() => {
    if (state === 'captured' && prontoParaAcoes) {
      clamT.value = withTiming(0, { duration: 220, easing: Easing.out(Easing.cubic) });
      actionsT.value = withSpring(1, { damping: 13, stiffness: 150 });
    } else if (state !== 'captured') {
      clamT.value = withSpring(1, { damping: 14, stiffness: 160 });
      actionsT.value = withTiming(0, { duration: 140 });
    }
  }, [state, prontoParaAcoes]);

  const pressStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pressScale.value }],
  }));

  const clamStyle = useAnimatedStyle(() => ({
    opacity: clamT.value,
    transform: [{ scale: 0.86 + clamT.value * 0.14 }],
  }));

  const actionsStyle = useAnimatedStyle(() => ({
    opacity: actionsT.value,
    transform: [{ scale: 0.82 + actionsT.value * 0.18 }],
  }));

  const height = size * CLAM_ASPECT;
  /** Caixa dos anéis — espaço para o pulse sem cortar; idle fica perto da pérola. */
  const ringBox = Math.round(size * 1.35);
  const recording = state === 'recording';
  const showActions = state === 'captured' && prontoParaAcoes;
  const btnSize = Math.round(size * 0.34);
  const repeatDimmed = busy || repeatCount >= MAX_REPEATS;

  return (
    <View style={[styles.wrap, { width: size, height }]}>
      {!showActions && state !== 'captured' && (
        <>
          <Animated.View
            style={[styles.rings, { width: ringBox, height: ringBox, marginLeft: -ringBox / 2, marginTop: -ringBox / 2 }, ringA]}
            pointerEvents="none"
          >
            <RingSvg box={ringBox} color="rgba(123,230,242,0.9)" strokeWidth={6} />
          </Animated.View>
          <Animated.View
            style={[styles.rings, { width: ringBox, height: ringBox, marginLeft: -ringBox / 2, marginTop: -ringBox / 2 }, ringB]}
            pointerEvents="none"
          >
            <RingSvg box={ringBox} color="rgba(38,198,218,0.75)" strokeWidth={8} />
          </Animated.View>
        </>
      )}

      {recording && (
        <Animated.View
          style={[
            styles.rings,
            { width: ringBox, height: ringBox, marginLeft: -ringBox / 2, marginTop: -ringBox / 2 },
            recordRingStyle,
          ]}
          pointerEvents="none"
        >
          <RingSvg box={ringBox} color="rgba(255,255,255,0.85)" strokeWidth={11} />
        </Animated.View>
      )}

      <Animated.View
        style={[styles.layer, clamStyle]}
        pointerEvents={showActions ? 'none' : 'box-none'}
      >
        <Pressable
          disabled={showActions || busy || state === 'captured'}
          onPressIn={() => {
            pressScale.value = withSpring(0.94, { damping: 14 });
            void handlePressIn();
          }}
          onPressOut={() => {
            pressScale.value = withSpring(1, { damping: 10 });
            void handlePressOut();
          }}
          style={{ width: size, height }}
        >
          <Animated.View style={[{ width: size, height }, pressStyle]}>
            <Image
              source={clamSource}
              style={[styles.clam, recording && styles.clamRecording]}
              resizeMode="contain"
              accessibilityLabel="Concha com pérola — segura e fala"
            />
            <View style={styles.micIcon} pointerEvents="none">
              <Mic
                color={recording ? colors.coralEscuro : colors.fundo}
                size={size * 0.17}
                strokeWidth={2.7}
              />
            </View>
          </Animated.View>
        </Pressable>
      </Animated.View>

      <Animated.View
        style={[styles.actions, actionsStyle]}
        pointerEvents={showActions ? 'box-none' : 'none'}
      >
        {showActions ? (
          <>
            <ActionImageButton
              source={repeatSource}
              size={btnSize}
              label="Repetir"
              onPress={handleRepeat}
              disabled={repeatDimmed}
              dim={repeatCount >= MAX_REPEATS}
            />
            <ActionImageButton
              source={starSource}
              size={btnSize}
              label="Guardar"
              onPress={handleStar}
              disabled={busy}
            />
          </>
        ) : null}
      </Animated.View>
    </View>
  );
}

function ActionImageButton({
  source,
  size,
  label,
  onPress,
  disabled,
  dim,
}: {
  source: number;
  size: number;
  label: string;
  onPress: () => void;
  disabled?: boolean;
  dim?: boolean;
}) {
  const scale = useSharedValue(1);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Pressable
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      onPressIn={() => {
        scale.value = withSpring(0.9, { damping: 12 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 9 });
      }}
      onPress={() => {
        if (disabled) return;
        hapticLeve();
        onPress();
      }}
      style={{ width: size, height: size, opacity: dim ? 0.4 : 1 }}
    >
      <Animated.View style={[{ width: size, height: size }, style]}>
        <Image source={source} style={styles.actionImg} resizeMode="contain" />
      </Animated.View>
    </Pressable>
  );
}

function RingSvg({ box, color, strokeWidth }: { box: number; color: string; strokeWidth: number }) {
  return (
    <Svg width={box} height={box} viewBox="0 0 260 260">
      <Circle cx={130} cy={130} r={64} fill="none" stroke={color} strokeWidth={strokeWidth} />
    </Svg>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  },
  layer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  },
  rings: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  },
  clam: {
    width: '100%',
    height: '100%',
  },
  clamRecording: {
    opacity: 0.96,
  },
  micIcon: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '40%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actions: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 28,
  },
  actionImg: {
    width: '100%',
    height: '100%',
  },
});
