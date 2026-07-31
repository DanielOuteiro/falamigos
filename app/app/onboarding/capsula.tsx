import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';
import Svg, { Ellipse, Path, Rect } from 'react-native-svg';
import { OceanBackground } from '@/components/scene/OceanBackground';
import { ChicoSprite, ChicoPose } from '@/components/ChicoSprite';
import { SpeechBubble } from '@/components/ui/SpeechBubble';
import { WordArt } from '@/components/WordArt';
import { MicButton } from '@/components/MicButton';
import { colors, fontFamily } from '@/theme/colors';
import { onboardingDraft } from '@/lib/onboardingDraft';
import { storage, type Gravacao } from '@/lib/storage';
import { speakChico, speakModel } from '@/lib/voice';

const PALAVRAS_CAPSULA = ['chave', 'peixe', 'bruxa', 'cha', 'cachorro'];

export default function CapsulaScreen() {
  const router = useRouter();
  const [indice, setIndice] = useState(-1);
  const [pose, setPose] = useState<ChicoPose>('idle');
  const [fechando, setFechando] = useState(false);
  const [gravacoes, setGravacoes] = useState<Gravacao[]>([]);
  const dataHoje = new Date().toLocaleDateString('pt-BR');

  useEffect(() => {
    (async () => {
      setPose('talking');
      await speakChico('cofre');
      setPose('idle');
      setIndice(0);
    })();
  }, []);

  useEffect(() => {
    if (indice < 0 || indice >= PALAVRAS_CAPSULA.length) return;
    (async () => {
      await new Promise((r) => setTimeout(r, 350));
      setPose('talking');
      await speakModel(wordName(PALAVRAS_CAPSULA[indice]));
      setPose('idle');
    })();
  }, [indice]);

  function wordName(id: string) {
    const map: Record<string, string> = {
      chave: 'chave',
      peixe: 'peixe',
      bruxa: 'bruxa',
      cha: 'chá',
      cachorro: 'cachorro',
    };
    return map[id] ?? id;
  }

  async function onWordCaptured(uri: string) {
    const wordId = PALAVRAS_CAPSULA[indice];
    const novaGravacao: Gravacao = {
      id: `${wordId}_${Date.now()}`,
      wordId,
      palavra: wordName(wordId),
      uri,
      criadoEm: Date.now(),
    };
    const atualizadas = [...gravacoes, novaGravacao];
    setGravacoes(atualizadas);

    if (indice + 1 >= PALAVRAS_CAPSULA.length) {
      await finalizarCapsula(atualizadas);
    } else {
      setIndice((i) => i + 1);
    }
  }

  async function finalizarCapsula(atualizadas: Gravacao[]) {
    setFechando(true);
    await storage.setCapsulaDia0(atualizadas);
    for (const g of atualizadas) {
      await storage.adicionarGravacao(g);
    }
    await storage.setPerfil({ ...onboardingDraft });
    await storage.setOnboardingCompleto(true);
    setTimeout(() => {
      router.replace('/sessao');
    }, 2200);
  }

  if (fechando) {
    return <CofreFechando data={dataHoje} nome={onboardingDraft.nome} />;
  }

  const wordId = indice >= 0 ? PALAVRAS_CAPSULA[indice] : null;

  return (
    <View style={styles.root}>
      <OceanBackground bubbles={6} />
      <SafeAreaView style={styles.content}>
        <ChicoSprite pose={pose} size={130} />
        <SpeechBubble>
          {indice === 0
            ? 'Vamos guardar a sua voz no cofrinho? Fale as palavras!'
            : `Palavra ${indice + 1} de ${PALAVRAS_CAPSULA.length}`}
        </SpeechBubble>

        {wordId && (
          <View style={styles.wordZone}>
            <WordArt wordId={wordId} size={92} />
            <Text style={styles.palavra}>{wordName(wordId)}</Text>
          </View>
        )}

        <View style={styles.micZone}>
          {wordId && (
            <MicButton
              key={wordId}
              wordId={wordId}
              palavra={wordName(wordId)}
              size={190}
              onPoseChange={setPose}
              onCompleted={onWordCaptured}
            />
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}

function CofreFechando({ data, nome }: { data: string; nome: string }) {
  const t = useSharedValue(0);
  useEffect(() => {
    t.value = withSequence(withTiming(1, { duration: 900 }), withTiming(1, { duration: 400 }));
  }, []);
  const lidStyle = useAnimatedStyle(() => ({
    transform: [{ rotateX: `${(1 - t.value) * -50}deg` }],
  }));

  return (
    <View style={styles.root}>
      <OceanBackground bubbles={5} variant="premio" />
      <SafeAreaView style={styles.content}>
        <Text style={styles.tituloCofre}>Cofrinho guardado!</Text>
        <View style={styles.chestWrap}>
          <Svg width={220} height={170} viewBox="0 0 280 220" style={styles.chestBase}>
            <Path
              d="M28,116 C28,96 60,86 140,86 C220,86 252,96 252,116 L262,196 C262,210 232,216 140,216 C48,216 18,210 18,196 Z"
              fill="#8A5A3B"
            />
            <Path
              d="M40,124 C40,110 70,102 140,102 C210,102 240,110 240,124 L248,192 C248,202 220,206 140,206 C60,206 32,202 32,192 Z"
              fill="#A9714C"
            />
            <Rect x={120} y={120} width={40} height={46} rx={10} fill={colors.estrela} />
          </Svg>
          <Animated.View style={[styles.chestLid, lidStyle]}>
            <Svg width={220} height={90} viewBox="0 0 240 90">
              <Path
                d="M8,90 C8,48 46,34 120,34 C194,34 232,48 232,90 Z"
                fill="#8A5A3B"
              />
              <Path
                d="M24,88 C24,56 58,44 120,44 C182,44 216,56 216,88 Z"
                fill="#B37E56"
              />
            </Svg>
          </Animated.View>
        </View>
        <Text style={styles.dataTexto}>{data}</Text>
        <Text style={styles.legendaCofre}>{`A voz de ${nome} de hoje ficará guardada para vocês compararem depois.`}</Text>
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
    gap: 18,
    paddingHorizontal: 24,
  },
  wordZone: { alignItems: 'center', gap: 6 },
  palavra: {
    fontFamily: fontFamily.titulo,
    color: colors.areia,
    fontSize: 24,
  },
  micZone: { marginTop: 20, alignItems: 'center', justifyContent: 'center', minHeight: 260 },
  tituloCofre: {
    fontFamily: fontFamily.titulo,
    color: colors.estrela,
    fontSize: 26,
    textAlign: 'center',
  },
  chestWrap: { width: 220, height: 200, alignItems: 'center', justifyContent: 'flex-end' },
  chestBase: { position: 'absolute', bottom: 0 },
  chestLid: { position: 'absolute', top: 6, left: 0 },
  dataTexto: {
    fontFamily: fontFamily.corpoExtra,
    color: colors.branco,
    fontSize: 20,
  },
  legendaCofre: {
    fontFamily: fontFamily.corpoSemi,
    color: colors.turquesaClaro,
    textAlign: 'center',
    fontSize: 14,
    paddingHorizontal: 20,
  },
});
