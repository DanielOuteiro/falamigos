import React from 'react';
import { View } from 'react-native';
import Animated from 'react-native-reanimated';
import Svg, { Ellipse, Path } from 'react-native-svg';
import { colors } from '@/theme/colors';
import { useBob } from '@/lib/motion';

const RACHADURAS = [
  'M40,60 L52,72 L44,84',
  'M40,60 L52,72 L44,84 M74,54 L64,68 L78,80',
  'M40,60 L52,72 L44,84 M74,54 L64,68 L78,80 M96,72 L86,86 L100,96',
];

export function OvoFragmento({ fragmentos, size = 130 }: { fragmentos: number; size?: number }) {
  const bob = useBob(3200, 7, 0, 2);
  const rachaduraD = RACHADURAS[Math.min(Math.max(fragmentos, 1), 3) - 1];

  return (
    <Animated.View style={[{ width: size, height: size * 1.2 }, bob]}>
      <Svg width={size} height={size * 1.2} viewBox="0 0 140 168">
        <Ellipse cx={70} cy={92} rx={58} ry={72} fill={colors.areia} />
        <Ellipse cx={54} cy={64} rx={20} ry={26} fill="#FFFFFF" opacity={0.55} rotation={-15} originX={54} originY={64} />
        <Path d={rachaduraD} stroke={colors.fundo} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" fill="none" opacity={0.6} />
      </Svg>
    </Animated.View>
  );
}
