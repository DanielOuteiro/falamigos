import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withSpring, withTiming } from 'react-native-reanimated';
import Svg, { Circle, Ellipse, Line } from 'react-native-svg';
import { colors } from '@/theme/colors';

/**
 * Mãozinha que "conta nos dedos" — ajuda visual para a criança associar o
 * número de anos à quantidade de dedos erguidos, do jeito que ela mesma
 * mostra a idade. Uma mão cobre 0–5; para 6–8 usamos duas mãos.
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

const DEDOS: Dedo[] = [
  { baseX: 42, baseY: 152, anguloDeg: -60, comprimento: 56, coto: 16, largura: 32 }, // polegar
  { baseX: 68, baseY: 116, anguloDeg: -20, comprimento: 78, coto: 18, largura: 27 }, // indicador
  { baseX: 100, baseY: 106, anguloDeg: 0, comprimento: 86, coto: 18, largura: 28 }, // médio
  { baseX: 132, baseY: 114, anguloDeg: 18, comprimento: 78, coto: 18, largura: 27 }, // anelar
  { baseX: 156, baseY: 130, anguloDeg: 34, comprimento: 60, coto: 18, largura: 23 }, // mindinho
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

export function ContadorDeIdade({ idade, size = 120 }: { idade: number; size?: number }) {
  const bounce = useSharedValue(1);

  useEffect(() => {
    bounce.value = withSequence(withTiming(1.16, { duration: 110 }), withSpring(1, { damping: 7, stiffness: 160 }));
  }, [idade]);

  const style = useAnimatedStyle(() => ({ transform: [{ scale: bounce.value }] }));

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
