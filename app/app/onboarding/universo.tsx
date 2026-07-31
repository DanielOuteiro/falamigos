import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Lock } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { OceanBackground } from '@/components/scene/OceanBackground';
import { ChicoSprite } from '@/components/ChicoSprite';
import { SpeechBubble } from '@/components/ui/SpeechBubble';
import { colors, fontFamily } from '@/theme/colors';
import { onboardingDraft } from '@/lib/onboardingDraft';
import { universos } from '@/data/universos';
import { hapticSelecao, hapticLeve } from '@/lib/haptics';

export default function UniversoScreen() {
  const router = useRouter();

  function escolher(id: string, ativo: boolean) {
    if (!ativo) {
      hapticLeve();
      return;
    }
    hapticSelecao();
    onboardingDraft.universo = id;
    router.push('/onboarding/permissao');
  }

  return (
    <View style={styles.root}>
      <OceanBackground bubbles={6} />
      <SafeAreaView style={styles.content}>
        <ChicoSprite pose="idle" size={110} />
        <SpeechBubble>Escolha seu mundo!</SpeechBubble>

        <View style={styles.grid}>
          {universos.map((u) => (
            <Pressable
              key={u.id}
              onPress={() => escolher(u.id, u.ativo)}
              style={[styles.card, { backgroundColor: u.ativo ? u.corPrincipal : 'rgba(10,34,49,0.55)' }]}
            >
              <Text style={styles.emoji}>{u.emoji}</Text>
              <Text style={[styles.nome, !u.ativo && { opacity: 0.6 }]}>{u.nome}</Text>
              {!u.ativo && (
                <View style={styles.lockBadge}>
                  <Lock color={colors.areia} size={14} />
                  <Text style={styles.lockText}>em breve</Text>
                </View>
              )}
            </Pressable>
          ))}
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.fundo },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    paddingHorizontal: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 14,
    maxWidth: 360,
  },
  card: {
    width: 104,
    height: 116,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  emoji: { fontSize: 36 },
  nome: {
    fontFamily: fontFamily.corpoExtra,
    color: colors.branco,
    fontSize: 13,
    textAlign: 'center',
    paddingHorizontal: 4,
  },
  lockBadge: {
    position: 'absolute',
    bottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  lockText: {
    fontFamily: fontFamily.corpoSemi,
    color: colors.areia,
    fontSize: 10,
  },
});
