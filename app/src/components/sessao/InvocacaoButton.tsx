import React, { useRef, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';
import { colors } from '@/theme/colors';
import { useRingOut } from '@/lib/motion';
import { hapticLeve, hapticSucesso } from '@/lib/haptics';

const MIN_DURATION_MS = 400;

export function InvocacaoButton({
  size = 190,
  disabled,
  onHoldValido,
}: {
  size?: number;
  disabled?: boolean;
  onHoldValido: () => void;
}) {
  const [pressionando, setPressionando] = useState(false);
  const startRef = useRef(0);
  const scale = useSharedValue(1);
  const ringA = useRingOut(2200, 0);
  const ringB = useRingOut(2200, 1100);
  const pressStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  function onPressIn() {
    if (disabled) return;
    hapticLeve();
    setPressionando(true);
    startRef.current = Date.now();
    scale.value = withSpring(1.06, { damping: 8 });
  }

  function onPressOut() {
    if (disabled) return;
    setPressionando(false);
    scale.value = withSpring(1, { damping: 8 });
    const duration = Date.now() - startRef.current;
    if (duration >= MIN_DURATION_MS) {
      hapticSucesso();
      onHoldValido();
    }
  }

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Animated.View style={[StyleSheet.absoluteFill, ringA]} pointerEvents="none">
        <Svg width={size} height={size} viewBox="0 0 190 190">
          <Circle cx={95} cy={95} r={78} fill="none" stroke={colors.turquesaClaro} strokeWidth={5} />
        </Svg>
      </Animated.View>
      <Animated.View style={[StyleSheet.absoluteFill, ringB]} pointerEvents="none">
        <Svg width={size} height={size} viewBox="0 0 190 190">
          <Circle cx={95} cy={95} r={78} fill="none" stroke={colors.estrela} strokeWidth={4} />
        </Svg>
      </Animated.View>
      <Pressable disabled={disabled} onPressIn={onPressIn} onPressOut={onPressOut} style={{ opacity: disabled ? 0.5 : 1 }}>
        <Animated.View style={[{ width: size * 0.75, height: size * 0.75 }, pressStyle]}>
          <Svg width={size * 0.75} height={size * 0.75} viewBox="0 0 150 150">
            <Defs>
              <RadialGradient id="invocaGrad" cx="35%" cy="30%" r="75%">
                <Stop offset="0%" stopColor="#FFFFFF" />
                <Stop offset="55%" stopColor="#DFF8FC" />
                <Stop offset="100%" stopColor="#8FD9E6" />
              </RadialGradient>
            </Defs>
            <Circle cx={75} cy={75} r={68} fill="url(#invocaGrad)" opacity={pressionando ? 0.85 : 1} />
            <Circle cx={75} cy={75} r={68} fill="none" stroke="#FFFFFF" strokeWidth={4} opacity={0.7} />
          </Svg>
        </Animated.View>
      </Pressable>
    </View>
  );
}
