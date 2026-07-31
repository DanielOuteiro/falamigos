import React, { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { Settings } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { OceanBackground } from '@/components/scene/OceanBackground';
import { ChicoSprite } from '@/components/ChicoSprite';
import { SpeechBubble } from '@/components/ui/SpeechBubble';
import { StarfishStreak } from '@/components/mapa/StarfishStreak';
import { CaminhoTrilho, NoCompleto, NoFuturo, NoHoje } from '@/components/mapa/Trilho';
import { gerarTrilho } from '@/components/mapa/trilhoLayout';
import { colors, fontFamily } from '@/theme/colors';
import { storage } from '@/lib/storage';

const TOTAL_NOS = 10;

export default function MapaScreen() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  const [streak, setStreak] = useState(0);
  const [nome, setNome] = useState('Liam');
  const [todayIndex, setTodayIndex] = useState(0);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const [s, perfil, sessoes] = await Promise.all([
          storage.getStreak(),
          storage.getPerfil(),
          storage.getSessoesCompletas(),
        ]);
        setStreak(s);
        setNome(perfil?.nome ?? 'Liam');
        setTodayIndex(Math.min(sessoes, TOTAL_NOS - 1));
      })();
    }, [])
  );

  const trilhoHeight = height * 0.76;
  const trilhoTop = height * 0.16;
  const pontos = gerarTrilho(TOTAL_NOS, width, trilhoHeight);
  const noHojePos = pontos[todayIndex];

  return (
    <View style={styles.root}>
      <OceanBackground bubbles={7} />

      <SafeAreaView style={StyleSheet.absoluteFill} pointerEvents="box-none">
        <View style={styles.header}>
          <StarfishStreak dias={streak} />
        </View>

        <View style={{ position: 'absolute', top: trilhoTop, left: 0, width, height: trilhoHeight }}>
          <CaminhoTrilho pontos={pontos} width={width} height={trilhoHeight} />
          {pontos.map((p, i) => {
            if (i < todayIndex) return <NoCompleto key={i} pos={p} delay={i * 300} />;
            if (i === todayIndex) return null;
            return <NoFuturo key={i} pos={p} delay={i * 250} opacidade={Math.max(0.35, 0.65 - (i - todayIndex) * 0.06)} />;
          })}

          <NoHoje pos={noHojePos} onPress={() => router.push('/sessao')} />

          <View
            pointerEvents="none"
            style={{
              position: 'absolute',
              left: noHojePos.x - 80,
              top: noHojePos.y - 195,
              width: 160,
              alignItems: 'center',
            }}
          >
            <ChicoSprite pose="idle" size={110} />
          </View>

          <View
            pointerEvents="none"
            style={{ position: 'absolute', left: noHojePos.x - 90, top: noHojePos.y - 250, width: 180, alignItems: 'center' }}
          >
            <SpeechBubble>{`Bora, ${nome}?`}</SpeechBubble>
          </View>
        </View>

        <View style={styles.footer}>
          <Pressable
            onPress={() => router.push('/colecao')}
            style={({ pressed }) => [styles.footerBtn, pressed && { opacity: 0.7 }]}
          >
            <Text style={styles.footerEmoji}>🫧</Text>
            <Text style={styles.footerLabel}>Coleção</Text>
          </Pressable>

          <Pressable
            onPress={() => router.push('/adulto')}
            style={({ pressed }) => [styles.footerBtn, pressed && { opacity: 0.7 }]}
          >
            <Settings color={colors.turquesaClaro} size={22} />
            <Text style={styles.footerLabel}>Adulto</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.fundo },
  header: {
    paddingTop: 12,
    paddingRight: 20,
    alignItems: 'flex-end',
  },
  footer: {
    position: 'absolute',
    bottom: 24,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 30,
  },
  footerBtn: { alignItems: 'center', gap: 2 },
  footerEmoji: { fontSize: 22 },
  footerLabel: { fontFamily: fontFamily.corpoSemi, color: colors.turquesaClaro, fontSize: 11 },
});
