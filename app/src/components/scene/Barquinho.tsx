import React from 'react';
import Animated from 'react-native-reanimated';
import Svg, { Path, Line } from 'react-native-svg';
import { colors } from '@/theme/colors';
import { useBob, useSway } from '@/lib/motion';

/**
 * Veículo do mundo Fundo do Mar para "A Travessia". Cada mundo troca este
 * sprite (foguete no Espaço, tapete no Reino Mágico, etc.) — o jogo por
 * baixo é sempre o mesmo.
 */
export function Barquinho({ size = 64 }: { size?: number }) {
  const bob = useBob(2200, 6, 0, 0);
  const sway = useSway(2600, 4, 200);

  return (
    <Animated.View style={bob}>
      <Animated.View style={sway}>
        <Svg width={size} height={size} viewBox="0 0 64 64">
          <Path
            d="M8 42 L56 42 L48 56 L16 56 Z"
            fill={colors.coral}
            stroke={colors.coralEscuro}
            strokeWidth={1.5}
          />
          <Line x1={32} y1={42} x2={32} y2={12} stroke={colors.coralProfundo} strokeWidth={2.5} />
          <Path d="M33 13 L52 38 L33 38 Z" fill={colors.branco} opacity={0.95} />
          <Path d="M31 16 L31 38 L20 38 Z" fill={colors.perola} opacity={0.85} />
        </Svg>
      </Animated.View>
    </Animated.View>
  );
}
