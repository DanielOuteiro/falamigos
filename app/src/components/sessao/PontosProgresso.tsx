import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Ellipse } from 'react-native-svg';
import { colors } from '@/theme/colors';

export function PontosProgresso({ total, atual }: { total: number; atual: number }) {
  return (
    <View style={styles.row}>
      {Array.from({ length: total }, (_, i) => (
        <Svg key={i} width={22} height={22} viewBox="0 0 32 32">
          {i < atual ? (
            <>
              <Circle cx={16} cy={16} r={13} fill={colors.estrela} />
              <Ellipse cx={11} cy={11} rx={4} ry={2.6} fill="#FFF6DF" opacity={0.9} rotation={-30} originX={11} originY={11} />
            </>
          ) : (
            <Circle cx={16} cy={16} r={12} fill="none" stroke={colors.turquesaClaro} strokeWidth={3} opacity={0.5} />
          )}
        </Svg>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 14, justifyContent: 'center' },
});
