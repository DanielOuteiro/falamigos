import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';
import Svg, { Path, Rect } from 'react-native-svg';
import { colors } from '@/theme/colors';

export function Bau({ aberto, size = 220, delayMs = 0 }: { aberto: boolean; size?: number; delayMs?: number }) {
  const t = useSharedValue(0);
  useEffect(() => {
    if (aberto) t.value = withDelay(delayMs, withTiming(1, { duration: 700 }));
  }, [aberto]);

  const lidStyle = useAnimatedStyle(() => ({
    transform: [{ perspective: 400 }, { rotateX: `${-t.value * 70}deg` }, { translateY: -t.value * 6 }],
  }));

  const glowStyle = useAnimatedStyle(() => ({ opacity: t.value }));

  return (
    <View style={{ width: size, height: size * 0.86, alignItems: 'center' }}>
      <Animated.View style={[{ position: 'absolute', top: -size * 0.25 }, glowStyle]}>
        <Svg width={size * 0.7} height={size * 0.7} viewBox="0 0 100 100">
          <Path d="M50,0 A50,50 0 1 1 49.9,0 Z" fill={colors.estrela} opacity={0.25} />
        </Svg>
      </Animated.View>

      <Svg width={size} height={size * 0.78} viewBox="0 0 280 220" style={{ position: 'absolute', bottom: 0 }}>
        <Path
          d="M28,116 C28,96 60,86 140,86 C220,86 252,96 252,116 L262,196 C262,210 232,216 140,216 C48,216 18,210 18,196 Z"
          fill="#8A5A3B"
        />
        <Path
          d="M40,124 C40,110 70,102 140,102 C210,102 240,110 240,124 L248,192 C248,202 220,206 140,206 C60,206 32,202 32,192 Z"
          fill="#A9714C"
        />
        <Rect x={120} y={120} width={40} height={34} rx={10} fill={colors.estrela} />
      </Svg>

      <Animated.View style={[{ position: 'absolute', top: size * 0.06 }, lidStyle]}>
        <Svg width={size} height={size * 0.42} viewBox="0 0 280 120">
          <Path d="M28,120 C28,64 66,44 140,44 C214,44 252,64 252,120 Z" fill="#8A5A3B" />
          <Path d="M44,116 C44,72 78,56 140,56 C202,56 236,72 236,116 Z" fill="#B37E56" />
        </Svg>
      </Animated.View>
    </View>
  );
}
