import React, { useCallback, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { ArrowLeft, Lock } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { OceanBackground } from '@/components/scene/OceanBackground';
import { colors, fontFamily } from '@/theme/colors';
import { storage } from '@/lib/storage';
import { speakModel } from '@/lib/voice';
import { hapticSelecao, hapticLeve } from '@/lib/haptics';
import { chicoFundoDoMar, friendsFundoDoMar } from '@/data/friends';

export default function ColecaoScreen() {
  const router = useRouter();
  const [sessionCount, setSessionCount] = useState(0);

  useFocusEffect(
    useCallback(() => {
      storage.getSessionCount().then(setSessionCount);
    }, [])
  );

  const unlockedFriends = friendsFundoDoMar.slice(0, sessionCount);

  return (
    <View style={styles.root}>
      <OceanBackground bubbles={6} />
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} hitSlop={10}>
            <ArrowLeft color={colors.areia} size={26} />
          </Pressable>
          <Text style={styles.titulo}>Coleção</Text>
          <View style={{ width: 26 }} />
        </View>

        <View style={styles.grid}>
          <Pressable
            style={styles.slot}
            onPress={() => {
              hapticSelecao();
              speakModel(chicoFundoDoMar.nome);
            }}
          >
            <View style={styles.arteWrap}>
              <Image source={chicoFundoDoMar.arte} style={styles.arte} resizeMode="contain" />
            </View>
            <Text style={styles.nomeCriatura}>{chicoFundoDoMar.nome}</Text>
          </Pressable>

          {friendsFundoDoMar.map((friend) => {
            const unlocked = unlockedFriends.some((f) => f.id === friend.id);
            return (
              <Pressable
                key={friend.id}
                style={styles.slot}
                onPress={() => {
                  if (!unlocked) {
                    hapticLeve();
                    return;
                  }
                  hapticSelecao();
                  speakModel(friend.nome);
                }}
              >
                {unlocked ? (
                  <View style={styles.arteWrap}>
                    <Image source={friend.arte} style={styles.arte} resizeMode="contain" />
                  </View>
                ) : (
                  <View style={styles.bloqueado}>
                    <Image source={friend.arte} style={styles.silhueta} resizeMode="contain" />
                    <View style={styles.lockBadge}>
                      <Lock color={colors.turquesaClaro} size={16} />
                    </View>
                  </View>
                )}
                <Text style={styles.nomeCriatura}>{unlocked ? friend.nome : '???'}</Text>
              </Pressable>
            );
          })}
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.fundo },
  safe: { flex: 1, paddingHorizontal: 20 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  titulo: { fontFamily: fontFamily.titulo, color: colors.areia, fontSize: 22 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 18,
    justifyContent: 'center',
    marginTop: 20,
  },
  slot: { width: 90, height: 100, alignItems: 'center', gap: 6 },
  arteWrap: {
    width: 78,
    height: 78,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arte: { width: 78, height: 78 },
  bloqueado: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: 'rgba(10,34,49,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(123,230,242,0.3)',
    overflow: 'hidden',
  },
  silhueta: { width: 64, height: 64, opacity: 0.28, tintColor: '#7BE6F2' },
  lockBadge: { position: 'absolute' },
  nomeCriatura: { fontFamily: fontFamily.corpoSemi, color: colors.turquesaClaro, fontSize: 12 },
});
