import { useEffect } from 'react';
import {
  Easing,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

/** Flutuação suave dessincronizada (bobA/bobB/bobC do protótipo). */
export function useBob(durationMs = 4000, amplitude = 8, delayMs = 0, rotateDeg = 2) {
  const t = useSharedValue(0);
  useEffect(() => {
    t.value = withDelay(
      delayMs,
      withRepeat(withTiming(1, { duration: durationMs / 2, easing: Easing.inOut(Easing.sin) }), -1, true)
    );
  }, []);
  return useAnimatedStyle(() => ({
    transform: [
      { translateY: (t.value - 0.5) * 2 * amplitude },
      { rotate: `${(t.value - 0.5) * 2 * rotateDeg}deg` },
    ],
  }));
}

/** Balanço tipo alga (sway). */
export function useSway(durationMs = 4000, degrees = 3, delayMs = 0) {
  const t = useSharedValue(0);
  useEffect(() => {
    t.value = withDelay(
      delayMs,
      withRepeat(withTiming(1, { duration: durationMs / 2, easing: Easing.inOut(Easing.sin) }), -1, true)
    );
  }, []);
  return useAnimatedStyle(() => ({
    transform: [{ rotate: `${(t.value - 0.5) * 2 * degrees}deg` }],
  }));
}

/** Pulso de escala (todayPulse / haloPulse). */
export function usePulse(durationMs = 1900, from = 1, to = 1.07, delayMs = 0) {
  const t = useSharedValue(0);
  useEffect(() => {
    t.value = withDelay(
      delayMs,
      withRepeat(withTiming(1, { duration: durationMs / 2, easing: Easing.inOut(Easing.ease) }), -1, true)
    );
  }, []);
  return useAnimatedStyle(() => ({
    transform: [{ scale: from + (to - from) * t.value }],
  }));
}

/** Anel expandindo e desaparecendo em loop (ringOut). */
export function useRingOut(
  durationMs = 2200,
  delayMs = 0,
  opts?: { fromScale?: number; toScale?: number; fromOpacity?: number }
) {
  const fromScale = opts?.fromScale ?? 0.72;
  const toScale = opts?.toScale ?? 1.5;
  const fromOpacity = opts?.fromOpacity ?? 0.75;
  const t = useSharedValue(0);
  useEffect(() => {
    t.value = withDelay(delayMs, withRepeat(withTiming(1, { duration: durationMs, easing: Easing.out(Easing.ease) }), -1, false));
  }, []);
  return useAnimatedStyle(() => ({
    opacity: fromOpacity * (1 - t.value),
    transform: [{ scale: fromScale + (toScale - fromScale) * t.value }],
  }));
}

/** Brilho pulsante (glow) para pontos com destaque. */
export function useGlow(durationMs = 2000, delayMs = 0) {
  const t = useSharedValue(0);
  useEffect(() => {
    t.value = withDelay(
      delayMs,
      withRepeat(withTiming(1, { duration: durationMs / 2, easing: Easing.inOut(Easing.sin) }), -1, true)
    );
  }, []);
  return useAnimatedStyle(() => ({
    opacity: 0.45 + 0.45 * t.value,
    transform: [{ scale: 1 + 0.12 * t.value }],
  }));
}

/** Cintilar de estrelinha (twinkle). */
export function useTwinkle(durationMs = 2600, delayMs = 0) {
  const t = useSharedValue(0);
  useEffect(() => {
    t.value = withDelay(
      delayMs,
      withRepeat(withTiming(1, { duration: durationMs / 2, easing: Easing.inOut(Easing.sin) }), -1, true)
    );
  }, []);
  return useAnimatedStyle(() => ({
    opacity: 0.2 + 0.8 * t.value,
    transform: [{ scale: 0.7 + 0.3 * t.value }, { rotate: `${25 * t.value}deg` }],
  }));
}

/** Tentáculo balançando com leve translação (tentacle). */
export function useTentacle(durationMs = 4600, delayMs = 0, degrees = 3, rise = 5) {
  const t = useSharedValue(0);
  useEffect(() => {
    t.value = withDelay(
      delayMs,
      withRepeat(withTiming(1, { duration: durationMs / 2, easing: Easing.inOut(Easing.sin) }), -1, true)
    );
  }, []);
  return useAnimatedStyle(() => ({
    transform: [
      { rotate: `${(t.value - 0.5) * 2 * degrees}deg` },
      { translateY: -(t.value - 0.5) * 2 * rise },
    ],
  }));
}

/** Igual a useSway, mas devolve um número em graus (para props SVG `rotation`). */
export function useRotationLoop(durationMs = 4600, delayMs = 0, degrees = 3) {
  const t = useSharedValue(0);
  useEffect(() => {
    t.value = withDelay(
      delayMs,
      withRepeat(withTiming(1, { duration: durationMs / 2, easing: Easing.inOut(Easing.sin) }), -1, true)
    );
  }, []);
  return useDerivedValue(() => (t.value - 0.5) * 2 * degrees);
}

/** Confete/bolha subindo e sumindo, para telas de conquista. */
export function useRise(durationMs = 9000, delayMs = 0, distance = 500) {
  const t = useSharedValue(0);
  useEffect(() => {
    t.value = withDelay(delayMs, withRepeat(withTiming(1, { duration: durationMs, easing: Easing.linear }), -1, false));
  }, []);
  return useAnimatedStyle(() => ({
    opacity: t.value < 0.15 ? t.value * 6 : t.value > 0.85 ? (1 - t.value) * 6 : 0.85,
    transform: [
      { translateY: 60 - t.value * distance },
      { scale: 0.6 + t.value * 0.5 },
    ],
  }));
}

/** Um "shake" curto de erro-carinhoso (bolha treme, sem X vermelho). */
export function useShake() {
  const t = useSharedValue(0);
  const trigger = () => {
    t.value = withSequence(
      withTiming(1, { duration: 60 }),
      withTiming(-1, { duration: 60 }),
      withTiming(0.7, { duration: 60 }),
      withTiming(-0.7, { duration: 60 }),
      withTiming(0, { duration: 60 })
    );
  };
  const style = useAnimatedStyle(() => ({
    transform: [{ translateX: t.value * 8 }],
  }));
  return { style, trigger };
}
