import { useEffect, useMemo } from 'react';
import { AccessibilityInfo } from 'react-native';
import { DeviceMotion } from 'expo-sensors';
import {
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

export type DeviceTilt = {
  x: SharedValue<number>;
  y: SharedValue<number>;
};

const SPRING = { damping: 26, stiffness: 120, mass: 0.85 } as const;

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

/**
 * Inclinação do telefone normalizada (−1…1), suavizada com spring.
 * Calibra no primeiro frame para o gesto ser relativo à posição de descanso.
 */
export function useDeviceTilt(): DeviceTilt {
  const x = useSharedValue(0);
  const y = useSharedValue(0);

  useEffect(() => {
    let sub: { remove: () => void } | null = null;
    let cancelled = false;
    let restGamma: number | null = null;
    let restBeta: number | null = null;
    let samples = 0;

    (async () => {
      const reduce = await AccessibilityInfo.isReduceMotionEnabled();
      if (cancelled || reduce) return;

      const available = await DeviceMotion.isAvailableAsync();
      if (cancelled || !available) return;

      const perm = await DeviceMotion.requestPermissionsAsync();
      if (cancelled || perm.status !== 'granted') return;

      DeviceMotion.setUpdateInterval(48);
      sub = DeviceMotion.addListener(({ rotation }) => {
        if (!rotation) return;
        const { gamma, beta } = rotation;

        // Primeiros frames = pose de descanso (evita salto inicial).
        if (restGamma === null || restBeta === null || samples < 4) {
          restGamma = restGamma === null ? gamma : restGamma * 0.7 + gamma * 0.3;
          restBeta = restBeta === null ? beta : restBeta * 0.7 + beta * 0.3;
          samples += 1;
          return;
        }

        // ~0.34 rad — entre o gesto suave original e o máximo.
        let nx = clamp((gamma - restGamma) / 0.34, -1, 1);
        let ny = clamp((beta - restBeta) / 0.34, -1, 1);
        if (Math.abs(nx) < 0.025) nx = 0;
        if (Math.abs(ny) < 0.025) ny = 0;

        x.value = withSpring(nx, SPRING);
        y.value = withSpring(ny, SPRING);
      });
    })();

    return () => {
      cancelled = true;
      sub?.remove();
    };
  }, [x, y]);

  return useMemo(() => ({ x, y }), [x, y]);
}

type ParallaxOpts = {
  /** Deslocamento máximo em X (px). */
  px?: number;
  /** Deslocamento máximo em Y (px). */
  py?: number;
  /** Rotação máxima (graus). */
  rotate?: number;
  /** Escala extra sob tilt (ex.: 0.012). */
  scale?: number;
};

/** Estilo parallax a partir do tilt (−1…1). */
export function useParallaxStyle(tilt: DeviceTilt, opts: ParallaxOpts = {}) {
  const { px = 12, py = 10, rotate = 0, scale = 0 } = opts;

  return useAnimatedStyle(() => {
    const tx = tilt.x.value * px;
    const ty = tilt.y.value * py;
    const transforms: (
      | { translateX: number }
      | { translateY: number }
      | { rotate: string }
      | { scale: number }
    )[] = [{ translateX: tx }, { translateY: ty }];

    if (rotate) {
      transforms.push({ rotate: `${tilt.x.value * rotate}deg` });
    }
    if (scale) {
      transforms.push({ scale: 1 + Math.abs(tilt.x.value) * scale + Math.abs(tilt.y.value) * scale * 0.5 });
    }

    return { transform: transforms };
  });
}
