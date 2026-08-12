import React, { createContext, useCallback, useContext, useMemo, useRef } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { ThresholdBackground } from '@/components/scene/ThresholdBackground';
import { PicoSprite } from '@/components/PicoSprite';
import { hapticLeve } from '@/lib/haptics';
import { DeviceTilt, useDeviceTilt, useParallaxStyle } from '@/lib/parallax';
import { KeyboardLiftLayers } from '@/lib/keyboardLift';
import { PICO_FLOW_TOP } from '@/theme/onboardingBrand';

type PicoFlowContextValue = {
  tilt: DeviceTilt;
  setPicoTapHandler: (fn: (() => void) | null) => void;
  picoTapRef: React.MutableRefObject<(() => void) | null>;
  keyboardLift: KeyboardLiftLayers;
};

const PicoFlowContext = createContext<PicoFlowContextValue | null>(null);

export function usePicoFlow() {
  const ctx = useContext(PicoFlowContext);
  if (!ctx) throw new Error('usePicoFlow fora do PicoFlowProvider');
  return ctx;
}

export function PicoFlowProvider({ children }: { children: React.ReactNode }) {
  const tilt = useDeviceTilt();
  const picoTapRef = useRef<(() => void) | null>(null);
  const pico = useSharedValue(0);
  const mid = useSharedValue(0);
  const form = useSharedValue(0);

  const setPicoTapHandler = useCallback((fn: (() => void) | null) => {
    picoTapRef.current = fn;
  }, []);

  const keyboardLift = useMemo<KeyboardLiftLayers>(() => ({ pico, mid, form }), [pico, mid, form]);

  const value = useMemo<PicoFlowContextValue>(
    () => ({ tilt, picoTapRef, setPicoTapHandler, keyboardLift }),
    [tilt, setPicoTapHandler, keyboardLift]
  );

  return <PicoFlowContext.Provider value={value}>{children}</PicoFlowContext.Provider>;
}

/** Fundo + Pico persistentes — ficam montados entre nome ↔ idade. */
export function PicoFlowBackdrop() {
  const { tilt, picoTapRef, keyboardLift } = usePicoFlow();
  const picoParallax = useParallaxStyle(tilt, { px: 22, py: 17, rotate: 3, scale: 0.015 });

  const picoKbStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: -keyboardLift.pico.value },
      { scale: 1 - Math.min(keyboardLift.pico.value, 160) * 0.00055 },
    ],
    opacity: 1 - Math.min(keyboardLift.pico.value, 160) * 0.0012,
  }));

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      <ThresholdBackground tilt={tilt} />
      <SafeAreaView edges={['top']} style={styles.picoSafe} pointerEvents="box-none">
        <View style={styles.picoZone} pointerEvents="box-none">
          <Pressable
            onPress={() => {
              if (!picoTapRef.current) return;
              hapticLeve();
              picoTapRef.current();
            }}
            accessibilityRole="button"
            accessibilityLabel="Ouvir o Pico de novo"
          >
            <Animated.View style={picoKbStyle}>
              <Animated.View style={picoParallax}>
                <PicoSprite size={176} />
              </Animated.View>
            </Animated.View>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  picoSafe: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 0,
  },

  picoZone: {
    height: PICO_FLOW_TOP,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 2,
  },
});
