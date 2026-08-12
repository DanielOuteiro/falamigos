import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { WordArt } from '@/components/WordArt';
import { SilabaRow } from '@/components/sessao/SilabaRow';
import { MicButton } from '@/components/MicButton';
import { fontFamily } from '@/theme/colors';
import { worldBrand } from '@/theme/worldBrand';
import type { Word } from '@/data/modelWords';
import { speakChico, speakModel } from '@/lib/voice';
import { pulseSilabasOnce } from '@/lib/silabaPulse';
import { storage } from '@/lib/storage';
import type { ChicoPose } from '@/components/ChicoSprite';

export function Producao({
  words,
  onPoseChange,
  onEstrela,
  onCompleta,
  onProgressoPalavra,
  onErro,
}: {
  words: Word[];
  onPoseChange: (p: ChicoPose) => void;
  onEstrela: () => void;
  onCompleta: () => void;
  onProgressoPalavra?: (atual: number, total: number) => void;
  onErro?: (wordId: string) => void;
}) {
  const [indice, setIndice] = useState(0);
  const [falandoIndex, setFalandoIndex] = useState<number | null>(null);
  const [pronto, setPronto] = useState(false);

  useEffect(() => {
    onProgressoPalavra?.(1, words.length);
    let cancelled = false;
    (async () => {
      setPronto(false);
      onPoseChange('talking');
      await speakChico('segura');
      if (cancelled) return;
      onPoseChange('idle');
      setPronto(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!pronto) return;
    const word = words[indice];
    if (!word) return;
    onProgressoPalavra?.(indice + 1, words.length);
    let cancelled = false;
    let pulse: { cancel: () => void } | null = null;
    (async () => {
      await new Promise((r) => setTimeout(r, 250));
      if (cancelled) return;
      onPoseChange('talking');
      pulse = pulseSilabasOnce(word.silabas.length, setFalandoIndex);
      await speakModel(word.palavra);
      pulse.cancel();
      if (!cancelled) onPoseChange('idle');
    })();
    return () => {
      cancelled = true;
      pulse?.cancel();
    };
  }, [indice, pronto]);

  async function onPalavraGravada(uri: string) {
    await storage.adicionarGravacao({
      id: `${words[indice].id}_${Date.now()}`,
      wordId: words[indice].id,
      palavra: words[indice].palavra,
      uri,
      criadoEm: Date.now(),
    });
    onEstrela();
    if (indice + 1 >= words.length) {
      onCompleta();
    } else {
      setIndice((i) => i + 1);
    }
  }

  const word = words[indice];
  if (!word) return null;

  return (
    <View style={styles.wrap}>
      <View style={styles.upper}>
        <View style={styles.bubble}>
          <Text style={styles.bubbleEyebrow}>Hora de falar</Text>
          <Text style={styles.bubbleText}>Segura a pérola e fala!</Text>
        </View>

        <View style={styles.wordCard}>
          <WordArt wordId={word.id} size={110} />
          <Text style={styles.palavra}>{word.palavra}</Text>
        </View>

        <SilabaRow silabas={word.silabas} alvo={word.alvo} falandoIndex={falandoIndex} />
      </View>

      <View style={styles.micZone}>
        {pronto ? (
          <MicButton
            key={word.id}
            wordId={word.id}
            palavra={word.palavra}
            silabas={word.silabas}
            onSilabaFalando={setFalandoIndex}
            size={270}
            onPoseChange={onPoseChange}
            onCompleted={onPalavraGravada}
            onRepeat={() => onErro?.(word.id)}
          />
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 0,
    overflow: 'visible',
  },
  upper: {
    width: '100%',
    alignItems: 'center',
    gap: 28,
    flexShrink: 1,
    zIndex: 11,
  },
  bubble: {
    backgroundColor: worldBrand.balão,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 28,
    maxWidth: '94%',
    alignItems: 'center',
    gap: 4,
    zIndex: 20,
    shadowColor: worldBrand.balãoSombra,
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 12,
  },
  bubbleEyebrow: {
    fontFamily: fontFamily.titulo,
    color: worldBrand.accent,
    fontSize: 18,
    textAlign: 'center',
  },
  bubbleText: {
    fontFamily: fontFamily.titulo,
    color: worldBrand.tinta,
    fontSize: 24,
    textAlign: 'center',
    lineHeight: 30,
  },
  wordCard: {
    alignItems: 'center',
    gap: 6,
    backgroundColor: worldBrand.balão,
    borderRadius: 28,
    paddingHorizontal: 26,
    paddingVertical: 14,
    minWidth: 220,
    shadowColor: worldBrand.balãoSombra,
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  palavra: {
    fontFamily: fontFamily.titulo,
    color: worldBrand.tinta,
    fontSize: 30,
  },
  micZone: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 4,
    marginTop: 'auto',
    flexShrink: 0,
    overflow: 'visible',
    zIndex: 12,
    minHeight: 200,
  },
});
