import React, { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import Svg, { Circle, Ellipse } from 'react-native-svg';
import { colors, fontFamily } from '@/theme/colors';
import { useGlow } from '@/lib/motion';

type Props = {
  silabas: string[];
  alvo: number;
  mostrarAlvo?: boolean;
  onPressSilaba?: (index: number) => void;
  tremendoIndex?: number | null;
  tremorStyle?: any;
  acertoIndex?: number | null;
  falandoIndex?: number | null;
};

const BASE_SIZE = 60;

function Bolhinha({
  texto,
  alvo,
  falando,
  onPress,
  tremendo,
  tremorStyle,
  acerto,
}: {
  texto: string;
  alvo: boolean;
  falando: boolean;
  onPress?: () => void;
  tremendo?: boolean;
  tremorStyle?: any;
  acerto?: boolean;
}) {
  const glow = useGlow(1600, 0);
  const Wrapper = onPress ? Pressable : View;
  const dourada = alvo || acerto;

  const scale = useSharedValue(1);
  useEffect(() => {
    scale.value = withSpring(falando ? 1.32 : 1, { damping: 8, stiffness: 160, mass: 0.6 });
  }, [falando]);
  const scaleStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Wrapper onPress={onPress} hitSlop={6}>
      <Animated.View style={tremendo ? tremorStyle : undefined}>
        <Animated.View style={[{ width: BASE_SIZE, height: BASE_SIZE }, scaleStyle]}>
          {(dourada || falando) && (
            <Animated.View style={[StyleSheet.absoluteFill, glow]} pointerEvents="none">
              <Svg width={BASE_SIZE} height={BASE_SIZE} viewBox="0 0 80 80">
                <Circle cx={40} cy={40} r={38} fill={colors.estrela} opacity={0.4} />
              </Svg>
            </Animated.View>
          )}
          <Svg width={BASE_SIZE} height={BASE_SIZE} viewBox="0 0 80 80" style={StyleSheet.absoluteFill}>
            <Circle cx={40} cy={40} r={32} fill={dourada ? colors.estrela : colors.algaMedia} />
            <Circle
              cx={40}
              cy={40}
              r={32}
              fill="none"
              stroke={falando ? '#FFFFFF' : dourada ? '#FFE08A' : colors.turquesaClaro}
              strokeWidth={falando ? 4 : 3}
              opacity={0.9}
            />
            <Ellipse cx={29} cy={27} rx={9} ry={6} fill="#FFFFFF" opacity={0.35} rotation={-30} originX={29} originY={27} />
          </Svg>
          <View style={styles.center} pointerEvents="none">
            <Text style={[styles.texto, { fontSize: 17, color: dourada ? colors.fundo : colors.branco }]}>{texto}</Text>
          </View>
        </Animated.View>
      </Animated.View>
    </Wrapper>
  );
}

export function SilabaRow({
  silabas,
  alvo,
  mostrarAlvo = true,
  onPressSilaba,
  tremendoIndex,
  tremorStyle,
  acertoIndex,
  falandoIndex,
}: Props) {
  return (
    <View style={styles.row}>
      {silabas.map((s, i) => (
        <Bolhinha
          key={i}
          texto={s}
          alvo={mostrarAlvo && i === alvo}
          onPress={onPressSilaba ? () => onPressSilaba(i) : undefined}
          tremendo={tremendoIndex === i}
          tremorStyle={tremorStyle}
          acerto={acertoIndex === i}
          falando={falandoIndex === i}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12 },
  center: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center' },
  texto: { fontFamily: fontFamily.titulo },
});
