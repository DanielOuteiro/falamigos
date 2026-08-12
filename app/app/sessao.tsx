import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { OceanBackground } from '@/components/scene/OceanBackground';
import { MundoPersonagem } from '@/components/MundoPersonagem';
import { PontosProgresso } from '@/components/sessao/PontosProgresso';
import { Aquecimento } from '@/components/sessao/Aquecimento';
import { QualEQual } from '@/components/sessao/QualEQual';
import { Producao } from '@/components/sessao/Producao';
import { CacaSilaba } from '@/components/sessao/CacaSilaba';
import { Eco } from '@/components/sessao/Eco';
import { ATravessia } from '@/components/sessao/ATravessia';
import { Recompensa } from '@/components/sessao/Recompensa';
import { Fecho } from '@/components/sessao/Fecho';
import { CofreFechando } from '@/components/onboarding/CofreFechando';
import type { ChicoPose } from '@/components/ChicoSprite';
import { WORLD_INSTRUCTION_TOP, WORLD_FLOW_TOP } from '@/theme/worldBrand';
import { storage } from '@/lib/storage';
import { MODEL_WORDS, type Word } from '@/data/modelWords';
import { espiarProximasPalavras, confirmarAvancoPalavras } from '@/lib/palavrasDoDia';
import { gerarParesQualEQual } from '@/data/qualEQualPares';
import { espiarSubconjunto, confirmarAvancoSubconjunto } from '@/lib/rotacaoDiaria';
import { FRASES_ECO, type FraseEco } from '@/data/frasesEco';
import { FRASES_TRAVESSIA, type FraseTravessia } from '@/data/frasesTravessia';

const FRASES_POR_SESSAO = 3;

/**
 * 3 blocos, 2 jogos cada, 1 pedaço de ovo por bloco:
 *   Ouvidos Mágicos → Hora de Falar (cofrinho da voz) → Guardar no Tesouro → recompensa 1/3
 *   Caça-Sílaba     → Qual é qual?                                        → recompensa 2/3
 *   Eco             → A Travessia                                         → recompensa 3/3 (ovo completo → nasce o bichinho)
 * Regra: o tesouro (`CofreFechando`) aparece 1x por sessão, sempre logo
 * depois do cofrinho da voz — nunca antes, nunca de novo. Na 1ª sessão de
 * todas, esse "cofrinho da voz" já aconteceu na Cápsula do Tempo (onboarding,
 * com as mesmas 5 palavras); então o tesouro dessa sessão é o da Cápsula, e
 * o passo 'tesouro' aqui dentro é pulado (senão seria o 2º tesouro da mesma
 * sessão). Da 2ª sessão em diante, o cofrinho da voz é o "Hora de Falar"
 * (Producao) e o tesouro aparece normalmente logo depois dele. As palavras
 * guardadas no cofrinho são as mesmas `palavras` usadas em todos os jogos
 * dessa sessão (Aquecimento, Caça-Sílaba, Qual é qual, etc.) — um único
 * conjunto por sessão, ponto.
 */
type Fase =
  | 'aquecimento'
  | 'producao'
  | 'tesouro'
  | 'recompensa1'
  | 'cacaSilaba'
  | 'qualEQual'
  | 'recompensa2'
  | 'eco'
  | 'travessia'
  | 'recompensa3'
  | 'fecho';

const FASES_VALIDAS: Fase[] = [
  'aquecimento',
  'producao',
  'tesouro',
  'recompensa1',
  'cacaSilaba',
  'qualEQual',
  'recompensa2',
  'eco',
  'travessia',
  'recompensa3',
  'fecho',
];

const RECOMPENSA_DEV_FRAGMENTOS: Partial<Record<Fase, number>> = {
  recompensa1: 1,
  recompensa2: 2,
  recompensa3: 3,
};

export default function SessaoScreen() {
  const router = useRouter();
  const { fase: faseInicial } = useLocalSearchParams<{ fase?: string }>();
  const faseDev = FASES_VALIDAS.includes(faseInicial as Fase) ? (faseInicial as Fase) : 'aquecimento';
  const [fase, setFase] = useState<Fase>(faseDev);
  const [, setPose] = useState<ChicoPose>('idle');
  const [totalEstrelas, setTotalEstrelas] = useState(0);
  const [nome, setNome] = useState('amigo');
  const [streakFinal, setStreakFinal] = useState(0);
  /** Progresso por palavra (não por fase da sessão). */
  const [progPalavra, setProgPalavra] = useState({ atual: 1, total: 5 });
  const [checkpoint, setCheckpoint] = useState<{ fragmentos: number; ovoCompleto: boolean }>(() => {
    const fragmentosDev = RECOMPENSA_DEV_FRAGMENTOS[faseDev] ?? 0;
    return { fragmentos: fragmentosDev, ovoCompleto: fragmentosDev >= 3 };
  });
  /**
   * Palavras/frases desta sessão (rotação + repescagem de erro) — espiadas
   * 1x ao abrir a tela. O avanço da rotação só é gravado de vez se a sessão
   * chegar ao fim (ver `aoTerminarUltimoBloco`); sessão abandonada não
   * consome nada.
   */
  const [palavras, setPalavras] = useState<Word[] | null>(null);
  const [frasesEcoDia, setFrasesEcoDia] = useState<FraseEco[] | null>(null);
  const [frasesTravessiaDia, setFrasesTravessiaDia] = useState<FraseTravessia[] | null>(null);
  /** 1ª sessão de todas: a Cápsula do Tempo já foi o cofrinho da voz + tesouro dela — não repete aqui. */
  const [ehPrimeiraSessao, setEhPrimeiraSessao] = useState(false);
  const pares = React.useMemo(() => gerarParesQualEQual(palavras ?? []), [palavras]);
  const errosSessaoRef = React.useRef<Set<string>>(new Set());
  const registrarErro = React.useCallback((wordId: string) => {
    errosSessaoRef.current.add(wordId);
  }, []);
  const rotacaoPendenteRef = React.useRef({ palavras: 0, frasesEco: 0, frasesTravessia: 0 });

  React.useEffect(() => {
    storage.getPerfil().then((p) => p && setNome(p.nome));
    storage.getSessoesCompletas().then((n) => setEhPrimeiraSessao(n === 0));
    espiarProximasPalavras().then(({ palavras: p, novoIndex }) => {
      rotacaoPendenteRef.current.palavras = novoIndex;
      setPalavras(p);
      setProgPalavra({ atual: 1, total: p.length || MODEL_WORDS.length });
    });
    espiarSubconjunto('frasesEco', FRASES_ECO, FRASES_POR_SESSAO).then(({ itens, novoIndex }) => {
      rotacaoPendenteRef.current.frasesEco = novoIndex;
      setFrasesEcoDia(itens);
    });
    espiarSubconjunto('frasesTravessia', FRASES_TRAVESSIA, FRASES_POR_SESSAO).then(({ itens, novoIndex }) => {
      rotacaoPendenteRef.current.frasesTravessia = novoIndex;
      setFrasesTravessiaDia(itens);
    });
  }, []);

  function avancarPara(proxima: Fase) {
    setPose('idle');
    setFase(proxima);
  }

  /** Fim de bloco — ganha 1 pedaço de ovo, sem tocar no streak/trilho do dia. */
  async function aoTerminarBloco(proxima: 'recompensa1' | 'recompensa2' | 'recompensa3') {
    const r = await storage.adicionarFragmentoOvo();
    setCheckpoint(r);
    avancarPara(proxima);
  }

  /**
   * Só no fim do 3º bloco: regista a sessão (streak + trilho no mapa),
   * guarda os erros pra repescagem, e só agora confirma o avanço da
   * rotação — sessão completa de verdade é o que "gasta" o conteúdo do dia.
   */
  async function aoTerminarUltimoBloco() {
    const r = await storage.adicionarFragmentoOvo();
    const { streak } = await storage.registrarSessaoConcluida();
    await storage.registrarErrosSessao(Array.from(errosSessaoRef.current));
    await Promise.all([
      confirmarAvancoPalavras(rotacaoPendenteRef.current.palavras),
      confirmarAvancoSubconjunto('frasesEco', rotacaoPendenteRef.current.frasesEco),
      confirmarAvancoSubconjunto('frasesTravessia', rotacaoPendenteRef.current.frasesTravessia),
    ]);
    setStreakFinal(streak);
    setCheckpoint(r);
    avancarPara('recompensa3');
  }

  const mostraProgPalavra =
    fase === 'aquecimento' ||
    fase === 'producao' ||
    fase === 'qualEQual' ||
    fase === 'cacaSilaba' ||
    fase === 'eco' ||
    fase === 'travessia';

  const emRecompensa = fase === 'recompensa1' || fase === 'recompensa2' || fase === 'recompensa3';

  if (!palavras || !frasesEcoDia || !frasesTravessiaDia) {
    return <View style={styles.root} />;
  }

  if (fase === 'tesouro') {
    return (
      <CofreFechando
        wordIds={palavras.map((w) => w.id)}
        data={new Date().toLocaleDateString('pt-BR')}
        nome={nome}
        onComplete={() => aoTerminarBloco('recompensa1')}
      />
    );
  }

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <OceanBackground bubbles={7} variant={emRecompensa ? 'premio' : 'fundo'} />

      {/* Na Travessia e no bloco do ovo (recompensa3) o Chico está "dentro do ovo" — só reaparece quando nasce, dentro do próprio Recompensa. */}
      {fase !== 'travessia' && fase !== 'recompensa3' && (
        <SafeAreaView edges={['top']} style={styles.heroSafe} pointerEvents="none">
          <View style={styles.heroZone}>
            <MundoPersonagem size={emRecompensa ? 160 : 200} />
          </View>
        </SafeAreaView>
      )}

      <SafeAreaView style={styles.safe}>
        {mostraProgPalavra ? (
          <View style={styles.progress}>
            <PontosProgresso total={progPalavra.total} atual={progPalavra.atual} />
          </View>
        ) : null}

        <View style={styles.conteudo}>
          {fase === 'aquecimento' && (
            <Aquecimento
              words={palavras}
              onPoseChange={setPose}
              onCompleta={() => avancarPara('producao')}
              onProgressoPalavra={(atual, total) => setProgPalavra({ atual, total })}
            />
          )}
          {fase === 'producao' && (
            <Producao
              words={palavras}
              onPoseChange={setPose}
              onEstrela={() => setTotalEstrelas((v) => v + 1)}
              onCompleta={() =>
                ehPrimeiraSessao ? aoTerminarBloco('recompensa1') : avancarPara('tesouro')
              }
              onProgressoPalavra={(atual, total) => setProgPalavra({ atual, total })}
              onErro={registrarErro}
            />
          )}
          {fase === 'recompensa1' && (
            <Recompensa
              fragmentos={checkpoint.fragmentos}
              ovoCompleto={checkpoint.ovoCompleto}
              onPoseChange={setPose}
              onCompleta={() => avancarPara('cacaSilaba')}
            />
          )}
          {fase === 'cacaSilaba' && (
            <CacaSilaba
              words={palavras}
              onPoseChange={setPose}
              onEstrela={() => setTotalEstrelas((v) => v + 1)}
              onCompleta={() => avancarPara('qualEQual')}
              onProgressoPalavra={(atual, total) => setProgPalavra({ atual, total })}
              onErro={registrarErro}
            />
          )}
          {fase === 'qualEQual' && (
            <QualEQual
              pares={pares}
              onPoseChange={setPose}
              onEstrela={() => setTotalEstrelas((v) => v + 1)}
              onCompleta={() => aoTerminarBloco('recompensa2')}
              onProgressoPalavra={(atual, total) => setProgPalavra({ atual, total })}
              onErro={registrarErro}
            />
          )}
          {fase === 'recompensa2' && (
            <Recompensa
              fragmentos={checkpoint.fragmentos}
              ovoCompleto={checkpoint.ovoCompleto}
              onPoseChange={setPose}
              onCompleta={() => avancarPara('eco')}
            />
          )}
          {fase === 'eco' && (
            <Eco
              frases={frasesEcoDia}
              onPoseChange={setPose}
              onEstrela={() => setTotalEstrelas((v) => v + 1)}
              onCompleta={() => avancarPara('travessia')}
              onProgressoPalavra={(atual, total) => setProgPalavra({ atual, total })}
              onErro={registrarErro}
            />
          )}
          {fase === 'travessia' && (
            <ATravessia
              frases={frasesTravessiaDia}
              onPoseChange={setPose}
              onEstrela={() => setTotalEstrelas((v) => v + 1)}
              onCompleta={aoTerminarUltimoBloco}
              onProgressoPalavra={(atual, total) => setProgPalavra({ atual, total })}
              onErro={registrarErro}
            />
          )}
          {fase === 'recompensa3' && (
            <Recompensa
              fragmentos={checkpoint.fragmentos}
              ovoCompleto={checkpoint.ovoCompleto}
              onPoseChange={setPose}
              onCompleta={() => avancarPara('fecho')}
            />
          )}
          {fase === 'fecho' && (
            <Fecho
              nome={nome}
              streak={streakFinal}
              totalEstrelas={totalEstrelas}
              onPoseChange={setPose}
              onFinalizar={() => router.replace('/mapa')}
            />
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FFFFFF' },
  heroSafe: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 0,
  },
  heroZone: {
    height: WORLD_FLOW_TOP,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 2,
  },
  safe: { flex: 1, zIndex: 10 },
  progress: {
    alignItems: 'center',
    paddingTop: 4,
    zIndex: 12,
  },
  conteudo: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: WORLD_INSTRUCTION_TOP - 28,
    paddingBottom: 8,
    minHeight: 0,
    zIndex: 10,
    overflow: 'visible',
  },
});
