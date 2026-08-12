import React, { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { ArrowLeft, Lock } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { OceanBackground } from '@/components/scene/OceanBackground';
import { MundoPersonagem } from '@/components/MundoPersonagem';
import { colors, fontFamily } from '@/theme/colors';
import { storage } from '@/lib/storage';
import { speakModel } from '@/lib/voice';
import { hapticSelecao, hapticLeve } from '@/lib/haptics';

const BLOQUEADAS = ['🦀', '🐡', '🦑', '🐢', '🦈', '🐬', '🪸'];

export default function ColecaoScreen() {
  const router = useRouter();
  const [chispaDesbloqueado, setChispaDesbloqueado] = useState(false);

  useFocusEffect(
    useCallback(() => {
      storage.chispaNasceu().then(setChispaDesbloqueado);
    }, [])
  );

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
            disabled={!chispaDesbloqueado}
            onPress={() => {
              hapticSelecao();
              speakModel('Chico');
            }}
          >
            {chispaDesbloqueado ? (
              <MundoPersonagem size={78} />
            ) : (
              <View style={styles.bloqueado}>
                <Lock color={colors.turquesaClaro} size={22} />
              </View>
            )}
            <Text style={styles.nomeCriatura}>{chispaDesbloqueado ? 'Chico' : '???'}</Text>
          </Pressable>

          {BLOQUEADAS.map((_, i) => (
            <Pressable key={i} style={styles.slot} onPress={hapticLeve}>
              <View style={styles.bloqueado}>
                <Lock color={colors.turquesaClaro} size={22} />
              </View>
              <Text style={styles.nomeCriatura}>???</Text>
            </Pressable>
          ))}
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
  bloqueado: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: 'rgba(10,34,49,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(123,230,242,0.3)',
  },
  nomeCriatura: { fontFamily: fontFamily.corpoSemi, color: colors.turquesaClaro, fontSize: 12 },
});
