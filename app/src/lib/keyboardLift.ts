import { useEffect } from 'react';
import { Keyboard, Platform } from 'react-native';
import {
  SharedValue,
  withSpring,
} from 'react-native-reanimated';

/** Molas distintas — camadas sobem com “pesos” diferentes. */
const SPRING_PICO = { damping: 30, stiffness: 110, mass: 1.05 } as const;
const SPRING_MID = { damping: 24, stiffness: 150, mass: 0.9 } as const;
const SPRING_FORM = { damping: 20, stiffness: 200, mass: 0.75 } as const;

export type KeyboardLiftLayers = {
  /** Personagem (mais lento / menos deslocamento). */
  pico: SharedValue<number>;
  /** Balão / meio. */
  mid: SharedValue<number>;
  /** Input + CTA (mais rápido / mais deslocamento). */
  form: SharedValue<number>;
};

/** Anima as 3 camadas a partir da altura do teclado (px). */
export function animateKeyboardLift(layers: KeyboardLiftLayers, keyboardHeight: number) {
  const h = Math.max(0, Math.min(keyboardHeight, 360));
  if (h <= 0) {
    layers.pico.value = withSpring(0, SPRING_PICO);
    layers.mid.value = withSpring(0, SPRING_MID);
    layers.form.value = withSpring(0, SPRING_FORM);
    return;
  }
  // Frações diferentes + springs diferentes = parallax temporal + espacial
  layers.pico.value = withSpring(h * 0.38, SPRING_PICO);
  layers.mid.value = withSpring(h * 0.58, SPRING_MID);
  layers.form.value = withSpring(h * 0.94, SPRING_FORM);
}

/** Liga listeners do teclado às camadas. Limpa ao desmontar. */
export function useKeyboardLift(layers: KeyboardLiftLayers, enabled = true) {
  useEffect(() => {
    if (!enabled) {
      animateKeyboardLift(layers, 0);
      return;
    }

    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const show = Keyboard.addListener(showEvent, (e) => {
      animateKeyboardLift(layers, e.endCoordinates.height);
    });
    const hide = Keyboard.addListener(hideEvent, () => {
      animateKeyboardLift(layers, 0);
    });

    return () => {
      show.remove();
      hide.remove();
      animateKeyboardLift(layers, 0);
    };
  }, [enabled, layers]);
}
