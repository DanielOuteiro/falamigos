import React, { createContext, useCallback, useContext, useMemo, useRef } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated from 'react-native-reanimated';
import { OceanBackground } from '@/components/scene/OceanBackground';
import { MundoPersonagem } from '@/components/MundoPersonagem';
import { WORLD_FLOW_TOP } from '@/theme/worldBrand';
import { DeviceTilt, useDeviceTilt, useParallaxStyle } from '@/lib/parallax';
import { hapticLeve, hapticMedio } from '@/lib/haptics';

type WorldFlowContextValue = {
  tilt: DeviceTilt;
  setPersonagemTapHandler: (fn: (() => void) | null) => void;
  /** Debug: 5 toques no Chico abrem o baú (cápsula). */
  setDebugChestHandler: (fn: (() => void) | null) => void;
  personagemTapRef: React.MutableRefObject<(() => void) | null>;
  debugChestRef: React.MutableRefObject<(() => void) | null>;
};

const WorldFlowContext = createContext<WorldFlowContextValue | null>(null);

export function useWorldFlow() {
  const ctx = useContext(WorldFlowContext);
  if (!ctx) throw new Error('useWorldFlow fora do WorldFlowProvider');
  return ctx;
}

export function WorldFlowProvider({ children }: { children: React.ReactNode }) {
  const tilt = useDeviceTilt();
  const personagemTapRef = useRef<(() => void) | null>(null);
  const debugChestRef = useRef<(() => void) | null>(null);

  const setPersonagemTapHandler = useCallback((fn: (() => void) | null) => {
    personagemTapRef.current = fn;
  }, []);

  const setDebugChestHandler = useCallback((fn: (() => void) | null) => {
    debugChestRef.current = fn;
  }, []);

  const value = useMemo<WorldFlowContextValue>(
    () => ({
      tilt,
      personagemTapRef,
      debugChestRef,
      setPersonagemTapHandler,
      setDebugChestHandler,
    }),
    [tilt, setPersonagemTapHandler, setDebugChestHandler]
  );

  return <WorldFlowContext.Provider value={value}>{children}</WorldFlowContext.Provider>;
}

/**
 * Ambiente + personagem — só visual (atrás da UI).
 * Toques ficam em WorldFlowHeroHit (acima da UI).
 */
export function WorldFlowBackdrop({ variant = 'fundo' }: { variant?: 'fundo' | 'premio' }) {
  const { tilt } = useWorldFlow();
  const heroStyle = useParallaxStyle(tilt, { px: 16, py: 12, rotate: 2.2, scale: 0.012 });

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <OceanBackground variant={variant} bubbles={variant === 'premio' ? 6 : 9} tilt={tilt} />

      <SafeAreaView edges={['top']} style={styles.heroSafe} pointerEvents="none">
        <View style={styles.heroZone} pointerEvents="none">
          <Animated.View style={heroStyle}>
            <MundoPersonagem size={200} />
          </Animated.View>
        </View>
      </SafeAreaView>
    </View>
  );
}

/**
 * Zona clicável do Chico — montar ACIMA da UI (senão o Stack engole os toques).
 * 5 toques rápidos → debug do baú (se a tela registrou o handler).
 */
export function WorldFlowHeroHit() {
  const { personagemTapRef, debugChestRef } = useWorldFlow();
  const tapCountRef = useRef(0);
  const tapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  return (
    <SafeAreaView edges={['top']} style={styles.hitSafe} pointerEvents="box-none">
      <View style={styles.heroZone} pointerEvents="box-none">
        <Pressable
          onPress={() => {
            tapCountRef.current += 1;
            if (tapTimerRef.current) clearTimeout(tapTimerRef.current);
            tapTimerRef.current = setTimeout(() => {
              tapCountRef.current = 0;
            }, 1600);

            if (tapCountRef.current >= 5 && debugChestRef.current) {
              tapCountRef.current = 0;
              hapticMedio();
              debugChestRef.current();
              return;
            }

            if (!personagemTapRef.current) return;
            hapticLeve();
            personagemTapRef.current();
          }}
          style={styles.hitTarget}
          accessibilityRole="button"
          accessibilityLabel="Ouvir o Chico de novo"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  heroSafe: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 0,
  },
  hitSafe: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    elevation: 50,
  },
  heroZone: {
    height: WORLD_FLOW_TOP,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 2,
  },
  hitTarget: {
    width: 220,
    height: WORLD_FLOW_TOP - 4,
  },
});
