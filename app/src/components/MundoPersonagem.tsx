import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { ResizeMode, Video } from 'expo-av';
import { universos } from '@/data/universos';
import { onboardingDraft } from '@/lib/onboardingDraft';

type Props = {
  size?: number;
  universoId?: string;
};

/** Vídeos ping-pong por mundo (quando existirem). */
const videos: Record<string, number> = {
  fundo_do_mar: require('../../assets/chico.mp4'),
};

/** Proporção do mp4 do Chico (832×592). */
const CHICO_ASPECT = 592 / 832;

/** Personagem do mundo — vídeo nativo quando houver; senão arte estática. */
export function MundoPersonagem({ size = 220, universoId }: Props) {
  const id = universoId ?? onboardingDraft.universo;
  const mundo = universos.find((u) => u.id === id) ?? universos[0];
  const video = videos[mundo.id];

  if (video) {
    const height = size * CHICO_ASPECT;
    return (
      <View
        style={{ width: size, height, backgroundColor: '#FFFFFF' }}
        accessibilityLabel={`${mundo.personagem}, mascote do ${mundo.nome}`}
      >
        <Video
          source={video}
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

  return (
    <View style={{ width: size, height: size }} accessibilityLabel={mundo.personagem}>
      <Image source={mundo.arte} style={styles.image} resizeMode="contain" />
    </View>
  );
}

const styles = StyleSheet.create({
  video: { width: '100%', height: '100%', backgroundColor: '#FFFFFF' },
  image: { width: '100%', height: '100%' },
});
