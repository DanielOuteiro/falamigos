import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MicButton } from '@/components/MicButton';
import { WordArt } from '@/components/WordArt';
import { fontFamily } from '@/theme/colors';
import { worldBrand } from '@/theme/worldBrand';
import { speakChico, speakFrase } from '@/lib/voice';
import { storage } from '@/lib/storage';
import type { FraseEco } from '@/data/frasesEco';
import type { ChicoPose } from '@/components/ChicoSprite';
import { encontrarPalavraPorTexto } from '@/data/modelWords';

function destacarFrase(texto: string, alvo: string) {
  const i = texto.indexOf(alvo);
  if (i < 0) return <Text style={styles.frase}>{texto}</Text>;
  return (
    <Text style={styles.frase}>
      {texto.slice(0, i)}
      <Text style={styles.fraseAlvo}>{texto.slice(i, i + alvo.length)}</Text>
      {texto.slice(i + alvo.length)}
    </Text>
  );
}

export function Eco({
  frases,
  onPoseChange,
  onEstrela,
  onCompleta,
  onProgressoPalavra,
  onErro,
}: {
  frases: FraseEco[];
  onPoseChange: (p: ChicoPose) => void;
  onEstrela: () => void;
  onCompleta: () => void;
  onProgressoPalavra?: (atual: number, total: number) => void;
  onErro?: (wordId: string) => void;
}) {
  const [indice, setIndice] = useState(0);
  const [pronto, setPronto] = useState(false);

  const frase = frases[indice];

  useEffect(() => {
    if (!frase) {
      onCompleta();
      return;
    }
    onProgressoPalavra?.(indice + 1, frases.length);
    setPronto(false);
    let cancelled = false;
    (async () => {
      await new Promise((r) => setTimeout(r, 300));
      if (cancelled) return;
      onPoseChange('talking');
      await speakFrase(frase.id, frase.texto);
      if (cancelled) return;
      onPoseChange('idle');
      setPronto(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [indice]);

  async function onEcoGravado(uri: string) {
    if (!frase) return;
    await storage.adicionarGravacao({
      id: `eco_${frase.id}_${Date.now()}`,
      wordId: frase.palavraAlvo,
      palavra: frase.texto,
      uri,
      criadoEm: Date.now(),
    });
    onEstrela();
    onPoseChange('celebrating');
    await speakChico('isso');
    onPoseChange('idle');
    if (indice + 1 >= frases.length) {
      onCompleta();
    } else {
      setIndice((v) => v + 1);
    }
  }

  if (!frase) return null;

  const wordId = encontrarPalavraPorTexto(frase.palavraAlvo)?.id;

  return (
    <View style={styles.wrap}>
      <View style={styles.upper}>
        <View style={styles.bubble}>
          <Text style={styles.bubbleEyebrow}>Eco</Text>
          <Text style={styles.bubbleText}>Ouve e repete!</Text>
        </View>

        <View style={styles.fraseCard}>
          {wordId ? <WordArt wordId={wordId} size={92} /> : null}
          {destacarFrase(frase.texto, frase.palavraAlvo)}
        </View>
      </View>

      <View style={styles.micZone}>
        {pronto ? (
          <MicButton
            key={frase.id}
            wordId={frase.id}
            palavra={frase.texto}
            onPoseChange={onPoseChange}
            onCompleted={onEcoGravado}
            onRepeat={() => onErro?.(frase.palavraAlvo)}
            onFalarModelo={() => speakFrase(frase.id, frase.texto)}
            size={270}
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
    gap: 22,
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
  fraseCard: {
    alignItems: 'center',
    gap: 10,
    backgroundColor: worldBrand.balão,
    borderRadius: 28,
    paddingHorizontal: 26,
    paddingVertical: 18,
    maxWidth: '90%',
    shadowColor: worldBrand.balãoSombra,
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  frase: {
    fontFamily: fontFamily.titulo,
    color: worldBrand.tinta,
    fontSize: 24,
    textAlign: 'center',
    lineHeight: 30,
  },
  fraseAlvo: {
    color: worldBrand.accent,
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
