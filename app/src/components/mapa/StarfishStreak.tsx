import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';
import { colors, fontFamily } from '@/theme/colors';
import { useSway } from '@/lib/motion';

export function StarfishStreak({ dias, size = 82 }: { dias: number; size?: number }) {
  const style = useSway(5000, 4, 0);
  return (
    <Animated.View style={[{ width: size, height: size }, style]}>
      <Svg width={size} height={size} viewBox="0 0 100 100" style={StyleSheet.absoluteFill}>
        <Path
          d="M50,4 C57,4 60,10 62,24 C74,22 84,18 88,24 C92,30 86,36 76,46 C84,56 90,64 88,71 C85,78 76,76 62,72 C58,86 56,94 50,94 C44,94 42,86 38,72 C24,76 15,78 12,71 C10,64 16,56 24,46 C14,36 8,30 12,24 C16,18 26,22 38,24 C40,10 43,4 50,4 Z"
          fill={colors.estrela}
        />
        <Path
          d="M50,14 C55,14 57,20 58,30 C68,29 74,26 77,30 C80,34 76,39 68,46 C74,54 78,60 76,65 C74,70 67,68 57,65 C54,76 53,82 50,82 C47,82 46,76 43,65 C33,68 26,70 24,65 C22,60 26,54 32,46 C24,39 20,34 23,30 C26,26 32,29 42,30 C43,20 45,14 50,14 Z"
          fill={colors.estrelaEscura}
          opacity={0.55}
        />
      </Svg>
      <View style={styles.center} pointerEvents="none">
        <Text style={[styles.numero, { fontSize: size * 0.36 }]}>{dias}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  center: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center', paddingTop: 4 },
  numero: { fontFamily: fontFamily.titulo, color: '#B3541E' },
});
