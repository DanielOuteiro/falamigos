import { View, StyleSheet } from 'react-native';
import { Stack, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { PicoFlowBackdrop, PicoFlowProvider } from '@/components/onboarding/PicoFlowChrome';
import {
  WorldFlowBackdrop,
  WorldFlowHeroHit,
  WorldFlowProvider,
} from '@/components/onboarding/WorldFlowChrome';
import { onboardingBrand } from '@/theme/onboardingBrand';

const picoScreenOptions = {
  animation: 'fade' as const,
  animationDuration: 220,
  animationMatchesGesture: true,
  fullScreenGestureShadowEnabled: false,
  contentStyle: { backgroundColor: 'transparent' },
};

const worldScreenOptions = {
  animation: 'fade' as const,
  animationDuration: 280,
  animationMatchesGesture: true,
  fullScreenGestureShadowEnabled: false,
  contentStyle: { backgroundColor: 'transparent' },
};

export default function OnboardingLayout() {
  const segments = useSegments();
  const leaf = segments[segments.length - 1];
  const picoFlow = leaf === 'nome' || leaf === 'idade' || leaf === 'universo';
  const worldFlow = leaf === 'permissao' || leaf === 'capsula';

  return (
    <PicoFlowProvider>
      <WorldFlowProvider>
        <View
          style={[
            styles.root,
            picoFlow && styles.rootPico,
            worldFlow && styles.rootWorld,
          ]}
        >
          {picoFlow || worldFlow ? <StatusBar style="dark" /> : null}
          {/* Personagens / fundo — sempre atrás da UI */}
          <View style={styles.characterLayer} pointerEvents="box-none">
            {picoFlow ? <PicoFlowBackdrop /> : null}
            {worldFlow ? <WorldFlowBackdrop /> : null}
          </View>
          {/* Caixas de texto / CTAs — sempre por cima dos personagens */}
          <View style={styles.uiLayer} pointerEvents="box-none">
            <Stack
              screenOptions={{
                headerShown: false,
                animation: 'fade',
                contentStyle: { backgroundColor: 'transparent' },
              }}
            >
              <Stack.Screen name="nome" options={picoScreenOptions} />
              <Stack.Screen name="idade" options={picoScreenOptions} />
              <Stack.Screen name="universo" options={picoScreenOptions} />
              <Stack.Screen name="permissao" options={worldScreenOptions} />
              <Stack.Screen name="capsula" options={worldScreenOptions} />
            </Stack>
          </View>
          {/* Chico clicável acima da UI — senão o Stack engole os toques */}
          {worldFlow ? <WorldFlowHeroHit /> : null}
        </View>
      </WorldFlowProvider>
    </PicoFlowProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  rootPico: { backgroundColor: onboardingBrand.fundo },
  rootWorld: { backgroundColor: '#FFFFFF' },
  characterLayer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
    elevation: 0,
  },
  uiLayer: {
    flex: 1,
    zIndex: 10,
    elevation: 10,
  },
});

