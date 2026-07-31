import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { OceanBackground } from '@/components/scene/OceanBackground';
import { ChicoSprite, ChicoPose } from '@/components/ChicoSprite';
import { PontosProgresso } from '@/components/sessao/PontosProgresso';
import { Aquecimento } from '@/components/sessao/Aquecimento';
import { Producao } from '@/components/sessao/Producao';
import { CacaSilaba } from '@/components/sessao/CacaSilaba';
import { Recompensa } from '@/components/sessao/Recompensa';
import { Fecho } from '@/components/sessao/Fecho';
import { colors } from '@/theme/colors';
import { storage } from '@/lib/storage';

type Fase = 'aquecimento' | 'producao' | 'cacaSilaba' | 'recompensa' | 'fecho';
const FASES: Fase[] = ['aquecimento', 'producao', 'cacaSilaba', 'recompensa', 'fecho'];

export default function SessaoScreen() {
  const router = useRouter();
  const [fase, setFase] = useState<Fase>('aquecimento');
  const [pose, setPose] = useState<ChicoPose>('idle');
  const [totalEstrelas, setTotalEstrelas] = useState(0);
  const [nome, setNome] = useState('Liam');
  const [resultadoSessao, setResultadoSessao] = useState<{ streak: number; ovoCompleto: boolean; fragmentos: number }>(
    { streak: 0, ovoCompleto: false, fragmentos: 0 }
  );

  React.useEffect(() => {
    storage.getPerfil().then((p) => p && setNome(p.nome));
  }, []);

  function avancarPara(proxima: Fase) {
    setPose('idle');
    setFase(proxima);
  }

  async function aoTerminarCacaSilaba() {
    const { streak, ovoCompleto } = await storage.registrarSessaoConcluida();
    const fragmentos = await storage.getOvoFragmentos();
    setResultadoSessao({ streak, ovoCompleto, fragmentos });
    avancarPara('recompensa');
  }

  const indiceFase = FASES.indexOf(fase);

  return (
    <View style={styles.root}>
      <OceanBackground bubbles={6} variant={fase === 'recompensa' ? 'premio' : 'fundo'} />
      <SafeAreaView style={styles.safe}>
        <PontosProgresso total={5} atual={indiceFase + 1} />

        <View style={styles.chicoZone}>
          <ChicoSprite pose={pose} size={fase === 'recompensa' ? 96 : 120} />
        </View>

        <View style={styles.conteudo}>
          {fase === 'aquecimento' && (
            <Aquecimento onPoseChange={setPose} onCompleta={() => avancarPara('producao')} />
          )}
          {fase === 'producao' && (
            <Producao
              onPoseChange={setPose}
              onEstrela={() => setTotalEstrelas((v) => v + 1)}
              onCompleta={() => avancarPara('cacaSilaba')}
            />
          )}
          {fase === 'cacaSilaba' && (
            <CacaSilaba
              onPoseChange={setPose}
              onEstrela={() => setTotalEstrelas((v) => v + 1)}
              onCompleta={aoTerminarCacaSilaba}
            />
          )}
          {fase === 'recompensa' && (
            <Recompensa
              fragmentos={resultadoSessao.fragmentos}
              ovoCompleto={resultadoSessao.ovoCompleto}
              onPoseChange={setPose}
              onCompleta={() => avancarPara('fecho')}
            />
          )}
          {fase === 'fecho' && (
            <Fecho
              nome={nome}
              streak={resultadoSessao.streak}
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
  root: { flex: 1, backgroundColor: colors.fundo },
  safe: { flex: 1, paddingTop: 8 },
  chicoZone: { alignItems: 'center', marginTop: 6, marginBottom: -10 },
  conteudo: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20, paddingBottom: 20 },
});
