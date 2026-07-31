import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { StarfishStreak } from '@/components/mapa/StarfishStreak';
import { SpeechBubble } from '@/components/ui/SpeechBubble';
import { colors, fontFamily } from '@/theme/colors';
import { speakChico } from '@/lib/voice';
import type { ChicoPose } from '@/components/ChicoSprite';

export function Fecho({
  nome,
  streak,
  totalEstrelas,
  onPoseChange,
  onFinalizar,
}: {
  nome: string;
  streak: number;
  totalEstrelas: number;
  onPoseChange: (p: ChicoPose) => void;
  onFinalizar: () => void;
}) {
  useEffect(() => {
    (async () => {
      onPoseChange('talking');
      await speakChico('tchau', { nome });
      onPoseChange('idle');
      await new Promise((r) => setTimeout(r, 1400));
      onFinalizar();
    })();
  }, []);

  return (
    <View style={styles.wrap}>
      <StarfishStreak dias={streak} size={110} />
      <Text style={styles.estrelas}>{`⭐ ${totalEstrelas} estrelas nesta sessão`}</Text>
      <SpeechBubble>{`Até amanhã, ${nome}!`}</SpeechBubble>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 22 },
  estrelas: { fontFamily: fontFamily.titulo, color: colors.estrela, fontSize: 18 },
});
