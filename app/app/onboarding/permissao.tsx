import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Mic } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { OceanBackground } from '@/components/scene/OceanBackground';
import { ChicoSprite } from '@/components/ChicoSprite';
import { SpeechBubble } from '@/components/ui/SpeechBubble';
import { PearlButton } from '@/components/ui/PearlButton';
import { colors, fontFamily } from '@/theme/colors';
import { ensureMicPermission } from '@/lib/recorder';
import { onboardingDraft } from '@/lib/onboardingDraft';

export default function PermissaoScreen() {
  const router = useRouter();
  const [negado, setNegado] = useState(false);

  async function pedirPermissao() {
    const ok = await ensureMicPermission();
    if (ok) {
      router.push('/onboarding/capsula');
    } else {
      setNegado(true);
    }
  }

  return (
    <View style={styles.root}>
      <OceanBackground bubbles={6} />
      <SafeAreaView style={styles.content}>
        <ChicoSprite pose="talking" size={150} />
        <SpeechBubble>
          {`Oi, ${onboardingDraft.nome}! Eu preciso ouvir sua voz para brincarmos.\nPosso usar o microfone?`}
        </SpeechBubble>

        {negado ? (
          <Text style={styles.aviso}>
            Sem o microfone eu não escuto você 🥲{'\n'}Ative nas configurações do telemóvel e tente de novo.
          </Text>
        ) : null}

        <View style={styles.footer}>
          <PearlButton size={130} onPress={pedirPermissao}>
            <Mic color={colors.fundo} size={40} strokeWidth={2.5} />
          </PearlButton>
          <Text style={styles.footerLabel}>Permitir microfone</Text>
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
    gap: 22,
    paddingHorizontal: 30,
  },
  aviso: {
    fontFamily: fontFamily.corpoSemi,
    color: colors.areia,
    textAlign: 'center',
    fontSize: 14,
  },
  footer: { position: 'absolute', bottom: 60, alignItems: 'center', gap: 10 },
  footerLabel: { fontFamily: fontFamily.corpoExtra, color: colors.areia, fontSize: 16 },
});
