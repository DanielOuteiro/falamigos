import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import Svg, { Circle, Ellipse } from 'react-native-svg';
import { colors, fontFamily } from '@/theme/colors';
import { hapticLeve } from '@/lib/haptics';

type Props = {
  onPress?: () => void;
  size?: number;
  emoji?: string;
  label?: string;
  /** Tamanho da label em px; default = 38% do size. */
  labelSize?: number;
  color?: string;
  disabled?: boolean;
  dim?: boolean;
};

/** Botão-bolha: objeto redondo turquesa usado para ações secundárias. */
export function BubbleButton({
  onPress,
  size = 72,
  emoji,
  label,
  labelSize,
  color = colors.turquesa,
  disabled,
  dim,
}: Props) {
  const scale = useSharedValue(1);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const fontSize = labelSize ?? size * 0.38;

  return (
    <Pressable
      disabled={disabled}
      onPressIn={() => {
        scale.value = withSpring(0.9, { damping: 12 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 10 });
      }}
      onPress={() => {
        hapticLeve();
        onPress?.();
      }}
      hitSlop={8}
      style={{ opacity: dim ? 0.45 : disabled ? 0.5 : 1 }}
    >
      <Animated.View style={[{ width: size, height: size }, style]}>
        <Svg width={size} height={size} viewBox="0 0 80 80" style={StyleSheet.absoluteFill}>
          <Circle cx={40} cy={40} r={34} fill={color} />
          <Circle cx={40} cy={40} r={34} fill="none" stroke={colors.turquesaSuave} strokeWidth={3} />
          <Ellipse cx={29} cy={27} rx={9} ry={6} fill="#EAFDFF" opacity={0.7} rotation={-30} originX={29} originY={27} />
        </Svg>
        <View style={styles.center} pointerEvents="none">
          {emoji ? <Text style={{ fontSize: size * 0.42 }}>{emoji}</Text> : null}
          {label ? <Text style={[styles.label, { fontSize }]}>{label}</Text> : null}
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
  },
  label: {
    fontFamily: fontFamily.titulo,
    color: colors.branco,
  },
});
