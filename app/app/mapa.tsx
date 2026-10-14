import React, { useCallback, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { Settings } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { OceanBackground } from '@/components/scene/OceanBackground';
import { MundoPersonagem } from '@/components/MundoPersonagem';
import { SpeechBubble } from '@/components/ui/SpeechBubble';
import { StarfishStreak } from '@/components/mapa/StarfishStreak';
import { CaminhoTrilho, NoCompleto, NoFuturo, NoHoje } from '@/components/mapa/Trilho';
import { gerarTrilho } from '@/components/mapa/trilhoLayout';
import { colors, fontFamily } from '@/theme/colors';
import { dataLocal, storage } from '@/lib/storage';
import { friendsFundoDoMar, mundoCompleto } from '@/data/friends';

const TOTAL_NOS = friendsFundoDoMar.length;
const CHICO_SIZE = 130;
const BUBBLE_H = 64;
const FOOTER_H = 64;

export default function MapaScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const [streak, setStreak] = useState(0);
  const [sessoes, setSessoes] = useState(0);

  useFocusEffect(
    useCallback(() => {
      let ativo = true;
      Promise.all([storage.getStreak(), storage.getSessoesCompletas()]).then(([s, n]) => {
        if (!ativo) return;
        setStreak(s);
        setSessoes(n);
      });
      return () => {
        ativo = false;
      };
    }, [])
  );

  const completo = mundoCompleto(sessoes);
  const todayIndex = Math.min(sessoes, TOTAL_NOS - 1);

  async function iniciarSessao() {
    const ultima = await storage.getUltimaSessao();
    if (ultima === dataLocal()) {
      Alert.alert(
        'Já treinaram hoje!',
        'Podem continuar se quiserem — não vamos travar. Mas um pouquinho todo dia costuma funcionar melhor do que tudo de uma vez.',
        [
          { text: 'Deixar pra depois', style: 'cancel' },
          { text: 'Continuar mesmo assim', onPress: () => router.push('/sessao') },
        ]
      );
      return;
    }
    router.push('/sessao');
  }

  const trilhoTop = insets.top + 56;
  const trilhoHeight = height - trilhoTop - insets.bottom - FOOTER_H - 8;
  const pontos = gerarTrilho(TOTAL_NOS, width, trilhoHeight);
  const noHojePos = pontos[todayIndex];
  const hojeSize = Math.min(172, width * 0.42);

  // Sem espaço acima do nó (fim do trilho): Chico e balão descem para baixo dele.
  const espacoAcima = noHojePos.y - hojeSize / 2;
  const chicoAcima = espacoAcima >= CHICO_SIZE + BUBBLE_H - 20;
  const chicoTop = chicoAcima
    ? noHojePos.y - hojeSize / 2 - CHICO_SIZE + 12
    : noHojePos.y + hojeSize / 2 - 12;
  const bubbleTop = chicoAcima ? chicoTop - BUBBLE_H : chicoTop + CHICO_SIZE - 6;
  const clampX = (x: number, w: number) => Math.max(8, Math.min(width - w - 8, x));

  return (
    <View style={styles.root}>
      <OceanBackground bubbles={7} />

      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <StarfishStreak dias={streak} />
      </View>

      <View style={{ position: 'absolute', top: trilhoTop, left: 0, width, height: trilhoHeight }}>
        <CaminhoTrilho pontos={pontos} width={width} height={trilhoHeight} />
        {pontos.map((p, i) => {
          const criatura = friendsFundoDoMar[i];
          if (i < todayIndex || (completo && i < TOTAL_NOS - 1)) {
            return <NoCompleto key={criatura.id} pos={p} delay={i * 300} arte={criatura.arte} nome={criatura.nome} />;
          }
          if (i === todayIndex) return null;
          return (
            <NoFuturo
              key={criatura.id}
              pos={p}
              delay={i * 250}
              opacidade={Math.max(0.35, 0.65 - (i - todayIndex) * 0.06)}
              arte={criatura.arte}
            />
          );
        })}

        <NoHoje
          pos={noHojePos}
          size={hojeSize}
          onPress={iniciarSessao}
          arte={friendsFundoDoMar[todayIndex]?.arte}
          desbloqueado={completo}
        />

        <View
          pointerEvents="none"
          style={[styles.chico, { left: clampX(noHojePos.x - 80, 160), top: chicoTop }]}
        >
          <MundoPersonagem size={CHICO_SIZE} transparente />
        </View>

        <View
          pointerEvents="none"
          style={[styles.bubble, { left: clampX(noHojePos.x - 110, 220), top: bubbleTop }]}
        >
          <SpeechBubble>{completo ? 'Todos os amigos nasceram! Novos mundos em breve.' : 'Bora, amigo!'}</SpeechBubble>
        </View>
      </View>

      <View style={[styles.footer, { bottom: insets.bottom + 4 }]}>
        <Pressable
          onPress={() => router.push('/colecao')}
          style={({ pressed }) => [styles.footerBtn, pressed && { opacity: 0.7 }]}
          accessibilityRole="button"
          accessibilityLabel="Coleção de amigos"
        >
          <Text style={styles.footerEmoji}>🫧</Text>
          <Text style={styles.footerLabel}>Coleção</Text>
        </Pressable>

        <Pressable
          onPress={() => router.push('/adulto')}
          style={({ pressed }) => [styles.footerBtn, pressed && { opacity: 0.7 }]}
          accessibilityRole="button"
          accessibilityLabel="Área do adulto"
        >
          <Settings color={colors.turquesaClaro} size={24} />
          <Text style={styles.footerLabel}>Adulto</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.fundo },
  header: {
    paddingRight: 20,
    alignItems: 'flex-end',
  },
  chico: { position: 'absolute', width: 160, alignItems: 'center' },
  bubble: { position: 'absolute', width: 220, alignItems: 'center' },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: FOOTER_H,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  footerBtn: { alignItems: 'center', justifyContent: 'center', gap: 2, minWidth: 72, minHeight: 56 },
  footerEmoji: { fontSize: 24 },
  footerLabel: { fontFamily: fontFamily.corpoSemi, color: colors.turquesaClaro, fontSize: 13 },
});
