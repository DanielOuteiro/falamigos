import React, { useCallback, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { ArrowLeft, Lock } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { OceanBackground } from '@/components/scene/OceanBackground';
import { colors, fontFamily } from '@/theme/colors';
import { storage } from '@/lib/storage';
import { speakModel } from '@/lib/voice';
import { hapticSelecao, hapticLeve } from '@/lib/haptics';
import { chicoFundoDoMar, friendsFundoDoMar, type Friend } from '@/data/friends';

const COLUNAS = 3;
const GAP = 18;
const PADDING = 20;

export default function ColecaoScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const [sessionCount, setSessionCount] = useState(0);

  useFocusEffect(
    useCallback(() => {
      let ativo = true;
      storage.getSessionCount().then((n) => ativo && setSessionCount(n));
      return () => {
        ativo = false;
      };
    }, [])
  );

  const conteudo = Math.min(width, 520) - PADDING * 2;
  const slot = Math.floor((conteudo - GAP * (COLUNAS - 1)) / COLUNAS);
  const desbloqueados = Math.min(sessionCount, friendsFundoDoMar.length);

  return (
    <View style={styles.root}>
      <OceanBackground bubbles={6} />
      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
        <View style={styles.header}>
          <Pressable
            onPress={() => (router.canGoBack() ? router.back() : router.replace('/mapa'))}
            hitSlop={12}
            style={styles.voltar}
            accessibilityRole="button"
            accessibilityLabel="Voltar ao mapa"
          >
            <ArrowLeft color={colors.areia} size={26} />
          </Pressable>
          <Text style={styles.titulo}>Coleção</Text>
          <View style={styles.voltar} />
        </View>
        <Text style={styles.contador}>{`${desbloqueados + 1} de ${friendsFundoDoMar.length + 1} amigos`}</Text>

        <ScrollView contentContainerStyle={styles.grid} showsVerticalScrollIndicator={false}>
          <Slot friend={chicoFundoDoMar} unlocked size={slot} />
          {friendsFundoDoMar.map((friend, i) => (
            <Slot key={friend.id} friend={friend} unlocked={i < desbloqueados} size={slot} />
          ))}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function Slot({ friend, unlocked, size }: { friend: Friend; unlocked: boolean; size: number }) {
  const arte = Math.min(size - 12, 110);
  return (
    <Pressable
      style={({ pressed }) => [styles.slot, { width: size }, pressed && unlocked && { transform: [{ scale: 0.95 }] }]}
      onPress={() => {
        if (!unlocked) {
          hapticLeve();
          return;
        }
        hapticSelecao();
        speakModel(friend.nome);
      }}
      accessibilityRole="button"
      accessibilityLabel={unlocked ? friend.nome : 'Amigo ainda escondido'}
      accessibilityHint={unlocked ? 'Toque para ouvir o nome' : 'Complete mais sessões para descobrir'}
    >
      {unlocked ? (
        <Image source={friend.arte} style={{ width: arte, height: arte }} resizeMode="contain" />
      ) : (
        <View style={[styles.bloqueado, { width: arte, height: arte, borderRadius: arte / 2 }]}>
          <Image
            source={friend.arte}
            style={[styles.silhueta, { width: arte * 0.8, height: arte * 0.8 }]}
            resizeMode="contain"
          />
          <View style={styles.lockBadge}>
            <Lock color={colors.turquesaClaro} size={18} />
          </View>
        </View>
      )}
      <Text style={styles.nomeCriatura} numberOfLines={1}>
        {unlocked ? friend.nome : '???'}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.fundo },
  safe: { flex: 1, alignItems: 'center' },
  header: {
    width: '100%',
    maxWidth: 520,
    paddingHorizontal: PADDING - 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  voltar: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  titulo: { fontFamily: fontFamily.titulo, color: colors.areia, fontSize: 24 },
  contador: { fontFamily: fontFamily.corpoSemi, color: colors.turquesaClaro, fontSize: 14, marginBottom: 8 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GAP,
    justifyContent: 'center',
    maxWidth: 520,
    paddingHorizontal: PADDING,
    paddingTop: 12,
    paddingBottom: 40,
  },
  slot: { alignItems: 'center', gap: 6, paddingVertical: 4 },
  bloqueado: {
    backgroundColor: 'rgba(10,34,49,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(123,230,242,0.3)',
    overflow: 'hidden',
  },
  silhueta: { opacity: 0.28, tintColor: colors.turquesaClaro },
  lockBadge: { position: 'absolute' },
  nomeCriatura: { fontFamily: fontFamily.corpoSemi, color: colors.turquesaClaro, fontSize: 14 },
});
