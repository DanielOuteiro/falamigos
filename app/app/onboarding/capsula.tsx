import React, { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Audio } from 'expo-av';
import type { ChicoPose } from '@/components/ChicoSprite';
import { WordArt } from '@/components/WordArt';
import { MicButton } from '@/components/MicButton';
import { CofreFechando } from '@/components/onboarding/CofreFechando';
import { useWorldFlow } from '@/components/onboarding/WorldFlowChrome';
import { PontosProgresso } from '@/components/sessao/PontosProgresso';
import { fontFamily } from '@/theme/colors';
import { WORLD_INSTRUCTION_TOP, worldBrand } from '@/theme/worldBrand';
import { onboardingDraft } from '@/lib/onboardingDraft';
import { storage, type Gravacao } from '@/lib/storage';
import { speakModel } from '@/lib/voice';
import { espiarProximasPalavras } from '@/lib/palavrasDoDia';
import type { Word } from '@/data/modelWords';

const chicoCofrinhoSource = require('../../assets/chico-cofrinho.mp3');

/**
 * A cápsula do tempo usa as mesmas 5 palavras que a 1ª sessão de verdade vai
 * usar (`espiarProximasPalavras`) — mas só *espia*, não confirma avanço. A
 * cápsula não é uma sessão em si, é a apresentação das palavras que a 1ª
 * sessão (logo a seguir, em `/sessao`) vai treinar de verdade. Quem confirma
 * o avanço da rotação é essa 1ª sessão, ao terminar — assim as palavras que
 * a criança acabou de guardar no tesouro são exatamente as mesmas do
 * Aquecimento/Hora de Falar/Caça-Sílaba que vêm a seguir.
 */
export default function CapsulaScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ debugChest?: string }>();
  const debugChestAtivo = __DEV__ && params.debugChest === '1';
  const [indice, setIndice] = useState(-1);
  const [, setPose] = useState<ChicoPose>('idle');
  const [fechando, setFechando] = useState(debugChestAtivo);
  const [gravacoes, setGravacoes] = useState<Gravacao[]>([]);
  const [palavras, setPalavras] = useState<Word[] | null>(null);
  const [palavrasGuardadas, setPalavrasGuardadas] = useState<string[]>([]);
  const dataHoje = new Date().toLocaleDateString('pt-BR');

  const { setPersonagemTapHandler, setDebugChestHandler } = useWorldFlow();
  const promptRef = useRef<Audio.Sound | null>(null);
  const playPromptRef = useRef<() => Promise<void>>(async () => {});
  const debugChestRef = useRef(debugChestAtivo);
  const palavrasRef = useRef<Word[] | null>(null);

  useEffect(() => {
    espiarProximasPalavras().then(({ palavras: p }) => {
      palavrasRef.current = p;
      setPalavras(p);
      if (debugChestRef.current) setPalavrasGuardadas(p.map((w) => w.id));
    });
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function playPrompt() {
      if (cancelled) return;
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          playsInSilentModeIOS: true,
        });
        if (promptRef.current) {
          await promptRef.current.setPositionAsync(0);
          await promptRef.current.playAsync();
          return;
        }
        const { sound } = await Audio.Sound.createAsync(chicoCofrinhoSource, { shouldPlay: true });
        if (cancelled) {
          await sound.unloadAsync();
          return;
        }
        promptRef.current = sound;
        await new Promise<void>((resolve) => {
          sound.setOnPlaybackStatusUpdate((status) => {
            if (!status.isLoaded) return;
            if (status.didJustFinish) resolve();
          });
        });
      } catch {
        // áudio não deve bloquear o ecrã
      }
    }

    playPromptRef.current = playPrompt;
    setPersonagemTapHandler(() => {
      void playPromptRef.current();
    });
    setDebugChestHandler(() => {
      debugChestRef.current = true;
      setPalavrasGuardadas(palavrasRef.current?.map((w) => w.id) ?? []);
      setFechando(true);
    });

    (async () => {
      setPose('talking');
      await playPrompt();
      if (cancelled) return;
      setPose('idle');
      setIndice(0);
    })();

    return () => {
      cancelled = true;
      setPersonagemTapHandler(null);
      setDebugChestHandler(null);
      const s = promptRef.current;
      promptRef.current = null;
      void s?.stopAsync().then(() => s.unloadAsync());
    };
  }, [setPersonagemTapHandler, setDebugChestHandler]);

  useEffect(() => {
    if (!palavras || indice < 0 || indice >= palavras.length) return;
    (async () => {
      await new Promise((r) => setTimeout(r, 350));
      setPose('talking');
      await speakModel(palavras[indice].palavra);
      setPose('idle');
    })();
  }, [indice, palavras]);

  async function onWordCaptured(uri: string) {
    if (!palavras) return;
    const word = palavras[indice];
    const novaGravacao: Gravacao = {
      id: `${word.id}_${Date.now()}`,
      wordId: word.id,
      palavra: word.palavra,
      uri,
      criadoEm: Date.now(),
    };
    const atualizadas = [...gravacoes, novaGravacao];
    setGravacoes(atualizadas);

    if (indice + 1 >= palavras.length) {
      await finalizarCapsula(atualizadas);
    } else {
      setIndice((i) => i + 1);
    }
  }

  async function finalizarCapsula(atualizadas: Gravacao[]) {
    setPalavrasGuardadas(atualizadas.map((g) => g.wordId));
    setFechando(true);
    try {
      await promptRef.current?.stopAsync();
    } catch {
      // ignore
    }
    await storage.setCapsulaDia0(atualizadas);
    for (const g of atualizadas) {
      await storage.adicionarGravacao(g);
    }
    await storage.setPerfil({ ...onboardingDraft });
    await storage.setOnboardingCompleto(true);
  }

  const irParaSessao = useCallback(() => {
    if (debugChestRef.current) {
      debugChestRef.current = false;
      setFechando(false);
      return;
    }
    router.replace('/sessao');
  }, [router]);

  if (fechando) {
    return (
      <CofreFechando
        wordIds={palavrasGuardadas.length ? palavrasGuardadas : (palavras?.map((w) => w.id) ?? [])}
        data={dataHoje}
        nome={onboardingDraft.nome || 'amigo'}
        onComplete={irParaSessao}
      />
    );
  }

  if (!palavras) {
    return <SafeAreaView style={styles.root} />;
  }

  const wordAtual = indice >= 0 ? palavras[indice] : null;
  const intro = indice <= 0;

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.progress}>
        <PontosProgresso
          total={palavras.length}
          atual={Math.max(0, indice + 1)}
        />
      </View>

      <View style={styles.content}>
        <View style={styles.upper}>
          <View style={styles.bubble}>
            <Text style={styles.bubbleEyebrow}>
              {intro ? 'Cofrinho da voz' : `Palavra ${indice + 1} de ${palavras.length}`}
            </Text>
            <Text style={styles.bubbleText}>
              {intro
                ? 'Vamos guardar a sua voz no cofrinho? Fale as seguintes palavras:'
                : 'Segura o microfone e fala!'}
            </Text>
          </View>

          {wordAtual ? (
            <View style={styles.wordCard}>
              <WordArt wordId={wordAtual.id} size={118} />
              <Text style={styles.palavra}>{wordAtual.palavra}</Text>
            </View>
          ) : (
            <View style={styles.wordPlaceholder} />
          )}
        </View>

        <View style={styles.micZone}>
          {wordAtual ? (
            <MicButton
              key={wordAtual.id}
              wordId={wordAtual.id}
              palavra={wordAtual.palavra}
              size={286}
              onPoseChange={setPose}
              onCompleted={onWordCaptured}
            />
          ) : null}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: 'transparent' },
  progress: {
    alignItems: 'center',
    paddingTop: 4,
    zIndex: 12,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: WORLD_INSTRUCTION_TOP - 28,
    paddingBottom: 8,
    minHeight: 0,
    zIndex: 10,
    overflow: 'visible',
  },
  upper: {
    width: '100%',
    alignItems: 'center',
    gap: 28,
    flexShrink: 1,
    minHeight: 0,
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
    flexShrink: 0,
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
    fontSize: 22,
    textAlign: 'center',
    lineHeight: 28,
  },
  wordCard: {
    alignItems: 'center',
    gap: 2,
    backgroundColor: worldBrand.balão,
    borderRadius: 28,
    paddingHorizontal: 26,
    paddingVertical: 14,
    minWidth: 170,
    marginTop: 8,
    shadowColor: worldBrand.balãoSombra,
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  wordPlaceholder: { height: 110 },
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
  },
});
