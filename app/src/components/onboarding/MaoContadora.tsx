import React, { useEffect } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, Ellipse, Line } from 'react-native-svg';
import { colors } from '@/theme/colors';

/**
 * Mãozinha que "conta nos dedos".
 * Idades 3–8: PNGs pré-alinhados (mesmo canvas 1024×682), crossfade simples.
 */

type Dedo = {
  baseX: number;
  baseY: number;
  anguloDeg: number;
  comprimento: number;
  coto: number;
  largura: number;
};

const VB_W = 200;
const VB_H = 230;
/** Canvas uniforme dos assets 3–8 (1024×682). */
const ART_ASPECT = 682 / 1024;

const MAO_ART = {
  3: require('../../../assets/idades/mao-3.png'),
  4: require('../../../assets/idades/mao-4.png'),
  5: require('../../../assets/idades/mao-5.png'),
  6: require('../../../assets/idades/mao-6.png'),
  7: require('../../../assets/idades/mao-7.png'),
  8: require('../../../assets/idades/mao-8.png'),
} as const;

type IdadeIlustrada = keyof typeof MAO_ART;
const IDADES_ART = [3, 4, 5, 6, 7, 8] as const satisfies readonly IdadeIlustrada[];

const DEDOS: Dedo[] = [
  { baseX: 42, baseY: 152, anguloDeg: -60, comprimento: 56, coto: 16, largura: 32 },
  { baseX: 68, baseY: 116, anguloDeg: -20, comprimento: 78, coto: 18, largura: 27 },
  { baseX: 100, baseY: 106, anguloDeg: 0, comprimento: 86, coto: 18, largura: 28 },
  { baseX: 132, baseY: 114, anguloDeg: 18, comprimento: 78, coto: 18, largura: 27 },
  { baseX: 156, baseY: 130, anguloDeg: 34, comprimento: 60, coto: 18, largura: 23 },
];

function ponta(dedo: Dedo, comprimento: number) {
  const rad = (dedo.anguloDeg * Math.PI) / 180;
  return {
    x: dedo.baseX + comprimento * Math.sin(rad),
    y: dedo.baseY - comprimento * Math.cos(rad),
  };
}

export function MaoContadora({
  erguidos,
  size = 120,
  espelhada = false,
}: {
  erguidos: number;
  size?: number;
  espelhada?: boolean;
}) {
  const n = Math.max(0, Math.min(5, erguidos));

  return (
    <View style={[{ width: size, height: (size * VB_H) / VB_W }, espelhada ? { transform: [{ scaleX: -1 }] } : null]}>
      <Svg width="100%" height="100%" viewBox={`0 0 ${VB_W} ${VB_H}`}>
        <Ellipse cx={100} cy={210} rx={34} ry={22} fill={colors.peleSombra} />
        <Ellipse cx={100} cy={168} rx={64} ry={58} fill={colors.pele} />

        {DEDOS.map((dedo, i) => {
          const levantado = i < n;
          const p = ponta(dedo, levantado ? dedo.comprimento : dedo.coto);
          return (
            <Line
              key={i}
              x1={dedo.baseX}
              y1={dedo.baseY}
              x2={p.x}
              y2={p.y}
              stroke={levantado ? colors.pele : colors.peleDobra}
              strokeWidth={dedo.largura}
              strokeLinecap="round"
              opacity={levantado ? 1 : 0.9}
            />
          );
        })}

        <Ellipse cx={100} cy={168} rx={64} ry={58} fill="none" stroke={colors.peleDobra} strokeWidth={2} opacity={0.4} />
        <Ellipse cx={78} cy={140} rx={16} ry={10} fill="#FFFFFF" opacity={0.3} rotation={-25} originX={78} originY={140} />
        {n === 0 && <Circle cx={100} cy={168} r={4} fill={colors.peleDobra} opacity={0.6} />}
      </Svg>
    </View>
  );
}

function artIndex(idade: IdadeIlustrada) {
  return IDADES_ART.indexOf(idade);
}

/** Crossfade 3–8 — assets já vêm alinhados e no mesmo tamanho. */
function MaoIlustrada({ idade, size }: { idade: IdadeIlustrada; size: number }) {
  const progress = useSharedValue(artIndex(idade));
  const bounce = useSharedValue(1);
  const width = size;
  const height = size * ART_ASPECT;

  useEffect(() => {
    progress.value = withTiming(artIndex(idade), {
      duration: 280,
      easing: Easing.out(Easing.cubic),
    });
    bounce.value = withSequence(
      withTiming(1.03, { duration: 100, easing: Easing.out(Easing.quad) }),
      withSpring(1, { damping: 14, stiffness: 180 })
    );
  }, [idade, bounce, progress]);

  const wrapStyle = useAnimatedStyle(() => ({
    transform: [{ scale: bounce.value }],
  }));

  return (
    <Animated.View style={[{ width, height }, wrapStyle]}>
      {IDADES_ART.map((n, i) => (
        <MaoArtLayer key={n} source={MAO_ART[n]} index={i} progress={progress} />
      ))}
    </Animated.View>
  );
}

function MaoArtLayer({
  source,
  index,
  progress,
}: {
  source: number;
  index: number;
  progress: SharedValue<number>;
}) {
  const style = useAnimatedStyle(() => {
    const dist = Math.abs(progress.value - index);
    return { opacity: interpolate(dist, [0, 1], [1, 0], 'clamp') };
  });

  return (
    <Animated.View style={[styles.layer, style]}>
      <Image source={source} style={styles.image} resizeMode="contain" />
    </Animated.View>
  );
}

export function ContadorDeIdade({ idade, size = 120 }: { idade: number; size?: number }) {
  const bounce = useSharedValue(1);

  useEffect(() => {
    if (idade in MAO_ART) return;
    bounce.value = withSequence(withTiming(1.16, { duration: 110 }), withSpring(1, { damping: 7, stiffness: 160 }));
  }, [idade, bounce]);

  const style = useAnimatedStyle(() => ({ transform: [{ scale: bounce.value }] }));

  if (idade in MAO_ART) {
    return <MaoIlustrada idade={idade as IdadeIlustrada} size={size} />;
  }

  return (
    <Animated.View style={[{ flexDirection: 'row', alignItems: 'center' }, style]}>
      {idade > 5 ? (
        <>
          <MaoContadora erguidos={5} size={size} espelhada />
          <MaoContadora erguidos={idade - 5} size={size} />
        </>
      ) : (
        <MaoContadora erguidos={idade} size={size} />
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  layer: {
    ...StyleSheet.absoluteFillObject,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
