import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import Svg, { Circle, Defs, Ellipse, Path, RadialGradient, Stop } from 'react-native-svg';
import { useRingOut } from '@/lib/motion';
import { hapticMedio } from '@/lib/haptics';

type Props = {
  onPress?: () => void;
  size?: number;
  children?: React.ReactNode;
  disabled?: boolean;
  showRing?: boolean;
};

/** Botão-pérola dentro de concha, para ações principais (CTA) — portado do protótipo. */
export function PearlButton({ onPress, size = 150, children, disabled, showRing = true }: Props) {
  const scale = useSharedValue(1);
  const pressStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const ringStyle = useRingOut(2400, 0);

  return (
    <Pressable
      disabled={disabled}
      onPressIn={() => {
        scale.value = withSpring(0.94, { damping: 12 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 9 });
      }}
      onPress={() => {
        hapticMedio();
        onPress?.();
      }}
      style={{ width: size, height: size, opacity: disabled ? 0.5 : 1 }}
    >
      {showRing && (
        <Animated.View style={[StyleSheet.absoluteFill, ringStyle]} pointerEvents="none">
          <Svg width={size} height={size} viewBox="0 0 170 170">
            <Circle cx={85} cy={92} r={68} fill="none" stroke="#7BE6F2" strokeWidth={5} />
          </Svg>
        </Animated.View>
      )}
      <Animated.View style={[{ width: size, height: size }, pressStyle]}>
        <Svg width={size} height={size} viewBox="0 0 170 170" style={StyleSheet.absoluteFill}>
          <Defs>
            <RadialGradient id="perolaGrad" cx="35%" cy="30%" r="75%">
              <Stop offset="0%" stopColor="#FFFFFF" />
              <Stop offset="55%" stopColor="#DFF8FC" />
              <Stop offset="100%" stopColor="#8FD9E6" />
            </RadialGradient>
          </Defs>
          <Path
            d="M16,98 C16,42 154,42 154,98 C154,98 128,78 85,78 C42,78 16,98 16,98 Z"
            fill="#FFC9B8"
          />
          <Path
            d="M18,96 C40,76 62,70 85,70 C108,70 130,76 152,96 C138,140 114,156 85,156 C56,156 32,140 18,96 Z"
            fill="#FF7E67"
          />
          <Path
            d="M30,102 C48,84 66,78 85,78 C104,78 122,84 140,102 C128,138 108,150 85,150 C62,150 42,138 30,102 Z"
            fill="#FF9A86"
          />
          <Circle cx={85} cy={108} r={42} fill="url(#perolaGrad)" />
          <Ellipse cx={70} cy={92} rx={13} ry={8} fill="#FFFFFF" opacity={0.85} rotation={-30} originX={70} originY={92} />
        </Svg>
        <View style={styles.center} pointerEvents="none">
          {children}
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  center: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: '18%',
  },
});
