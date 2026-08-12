import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Line } from 'react-native-svg';
import { Flag } from 'lucide-react-native';
import { MicButton } from '@/components/MicButton';
import { WordArt } from '@/components/WordArt';
import { Barquinho } from '@/components/scene/Barquinho';
import { PontosProgresso } from '@/components/sessao/PontosProgresso';
import { colors, fontFamily } from '@/theme/colors';
import { worldBrand } from '@/theme/worldBrand';
import { speakFrase } from '@/lib/voice';
import { storage } from '@/lib/storage';
import type { FraseTravessia } from '@/data/frasesTravessia';
import type { ChicoPose } from '@/components/ChicoSprite';
import { encontrarPalavraPorTexto } from '@/data/modelWords';

const TRILHA_LARGURA = 240;
const TRILHA_ALTURA = 64;
const TRILHA_MARGEM = 30;

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

export function ATravessia({
  frases,
  onPoseChange,
  onEstrela,
  onCompleta,
  onProgressoPalavra,
  onErro,
}: {
  frases: FraseTravessia[];
  onPoseChange: (p: ChicoPose) => void;
  onEstrela: () => void;
  onCompleta: () => void;
  onProgressoPalavra?: (atual: number, total: number) => void;
  onErro?: (wordId: string) => void;
}) {
  const [indice, setIndice] = useState(0);
  const [passo, setPasso] = useState(0);
  const [pronto, setPronto] = useState(false);

  const frase = frases[indice];

  useEffect(() => {
    if (!frase) {
      onCompleta();
      return;
    }
    onProgressoPalavra?.(indice + 1, frases.length);
    setPasso(0);
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

  async function onRepeticaoGravada(uri: string) {
    if (!frase) return;
    await storage.adicionarGravacao({
      id: `travessia_${frase.id}_${passo}_${Date.now()}`,
      wordId: frase.palavraAlvo,
      palavra: frase.texto,
      uri,
      criadoEm: Date.now(),
    });
    onEstrela();
    const proximoPasso = passo + 1;

    if (proximoPasso >= frase.passos) {
      setPasso(proximoPasso);
      await new Promise((r) => setTimeout(r, 500));
      if (indice + 1 >= frases.length) {
        onCompleta();
      } else {
        setIndice((v) => v + 1);
      }
      return;
    }

    setPasso(proximoPasso);
  }

  if (!frase) return null;

  const wordId = encontrarPalavraPorTexto(frase.palavraAlvo)?.id;
  const fracao = frase.passos > 0 ? passo / frase.passos : 0;
  const barcoX = TRILHA_MARGEM + fracao * (TRILHA_LARGURA - TRILHA_MARGEM * 2);

  return (
    <View style={styles.wrap}>
      <View style={styles.upper}>
        <View style={styles.bubble}>
          <Text style={styles.bubbleEyebrow}>A Travessia</Text>
          <Text style={styles.bubbleText}>{`Diz a frase ${frase.passos}x seguidas pro barquinho chegar!`}</Text>
        </View>

        <View style={styles.fraseCard}>
          {wordId ? <WordArt wordId={wordId} size={84} /> : null}
          {destacarFrase(frase.texto, frase.palavraAlvo)}
        </View>

        <View style={styles.trilhaCard}>
          <Svg width={TRILHA_LARGURA} height={TRILHA_ALTURA} viewBox={`0 0 ${TRILHA_LARGURA} ${TRILHA_ALTURA}`}>
            <Line
              x1={TRILHA_MARGEM}
              y1={TRILHA_ALTURA / 2 + 6}
              x2={TRILHA_LARGURA - TRILHA_MARGEM}
              y2={TRILHA_ALTURA / 2 + 6}
              stroke={colors.turquesaClaro}
              strokeWidth={3}
              strokeDasharray="6 8"
              opacity={0.55}
            />
          </Svg>
          <View style={[styles.barcoPos, { left: barcoX - 32 }]} pointerEvents="none">
            <Barquinho size={64} />
          </View>
          <View style={styles.flagPos} pointerEvents="none">
            <Flag color={colors.coralEscuro} size={24} strokeWidth={2.4} />
          </View>
        </View>

        <PontosProgresso total={frase.passos} atual={passo} />
      </View>

      <View style={styles.micZone}>
        {pronto ? (
          <MicButton
            key={frase.id}
            wordId={frase.id}
            palavra={frase.texto}
            onPoseChange={onPoseChange}
            onCompleted={onRepeticaoGravada}
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
    gap: 8,
    backgroundColor: worldBrand.balão,
    borderRadius: 28,
    paddingHorizontal: 26,
    paddingVertical: 16,
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
    fontSize: 22,
    textAlign: 'center',
    lineHeight: 28,
  },
  fraseAlvo: {
    color: worldBrand.accent,
  },
  trilhaCard: {
    width: TRILHA_LARGURA,
    height: TRILHA_ALTURA,
    justifyContent: 'center',
  },
  barcoPos: {
    position: 'absolute',
    top: TRILHA_ALTURA / 2 - 26,
  },
  flagPos: {
    position: 'absolute',
    right: TRILHA_MARGEM - 16,
    top: TRILHA_ALTURA / 2 - 18,
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
