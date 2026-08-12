import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ResizeMode, Video } from 'expo-av';

type Props = {
  size?: number;
};

/** MP4 ping-pong: frente + reverso, loop contínuo. */
const picoSource = require('../../assets/pico.mp4');
/** Proporção do mp4 da landing (768×832). */
const ASPECT = 832 / 768;

/** Pico — vídeo nativo em loop ping-pong. */
export function PicoSprite({ size = 240 }: Props) {
  return (
    <View
      style={{ width: size, height: size * ASPECT, backgroundColor: '#FFFFFF' }}
      accessibilityLabel="Pico, o mascote do Falamigos, acenando"
    >
      <Video
        source={picoSource}
        style={styles.video}
        resizeMode={ResizeMode.CONTAIN}
        shouldPlay
        isLooping
        isMuted
        useNativeControls={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  video: { width: '100%', height: '100%', backgroundColor: '#FFFFFF' },
});
