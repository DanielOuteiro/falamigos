import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowRight } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { OceanBackground } from '@/components/scene/OceanBackground';
import { ChicoSprite } from '@/components/ChicoSprite';
import { SpeechBubble } from '@/components/ui/SpeechBubble';
import { PearlButton } from '@/components/ui/PearlButton';
import { colors, fontFamily } from '@/theme/colors';
import { onboardingDraft } from '@/lib/onboardingDraft';

export default function NomeScreen() {
  const router = useRouter();
  const [nome, setNome] = useState(onboardingDraft.nome);

  function continuar() {
    onboardingDraft.nome = nome.trim() || 'Liam';
    router.push('/onboarding/idade');
  }

  return (
    <View style={styles.root}>
      <OceanBackground bubbles={8} />
      <SafeAreaView style={styles.content}>
        <ChicoSprite pose="idle" size={150} />
        <SpeechBubble>Oi! Eu sou o Chico! Como você se chama?</SpeechBubble>

        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.inputWrap}>
          <TextInput
            value={nome}
            onChangeText={setNome}
            placeholder="Liam"
            placeholderTextColor="rgba(10,34,49,0.4)"
            style={styles.input}
            maxLength={20}
            autoCapitalize="words"
            returnKeyType="done"
            onSubmitEditing={continuar}
          />
        </KeyboardAvoidingView>

        <View style={styles.footer}>
          <PearlButton size={110} onPress={continuar}>
            <ArrowRight color={colors.fundo} size={34} strokeWidth={3} />
          </PearlButton>
          <Text style={styles.footerLabel}>Bora lá!</Text>
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
    paddingHorizontal: 24,
  },
  inputWrap: { width: '100%', alignItems: 'center' },
  input: {
    backgroundColor: colors.areia,
    color: colors.tinta,
    fontFamily: fontFamily.titulo,
    fontSize: 26,
    textAlign: 'center',
    borderRadius: 30,
    paddingVertical: 14,
    paddingHorizontal: 28,
    width: '80%',
    overflow: 'hidden',
  },
  footer: { position: 'absolute', bottom: 56, alignItems: 'center', gap: 8 },
  footerLabel: { fontFamily: fontFamily.corpoExtra, color: colors.areia, fontSize: 16 },
});
