import React, { useEffect, useRef, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Bau } from '@/components/sessao/Bau';
import { OvoFragmento } from '@/components/sessao/OvoFragmento';
import { InvocacaoButton } from '@/components/sessao/InvocacaoButton';
import { ConfettiBubbles } from '@/components/sessao/ConfettiBubbles';
import { SpeechBubble } from '@/components/ui/SpeechBubble';
import { colors, fontFamily } from '@/theme/colors';
import { speakChico, speakModel, stopVoice } from '@/lib/voice';
import { storage } from '@/lib/storage';
import type { ChicoPose } from '@/components/ChicoSprite';
import type { Friend } from '@/data/friends';

type Etapa = 'baú' | 'ovo' | 'completo' | 'invocacao' | 'nasceu';

export function Recompensa({
  fragmentos,
  ovoCompleto,
  amigo,
  mundoCompleto = false,
  onPoseChange,
  onCompleta,
}: {
  fragmentos: number;
  ovoCompleto: boolean;
  amigo?: Friend;
  /** Todos os amigos do mundo já nasceram — baú abre, mas não há ovo. */
  mundoCompleto?: boolean;
  onPoseChange: (p: ChicoPose) => void;
  onCompleta: () => void;
}) {
  const [etapa, setEtapa] = useState<Etapa>('baú');
  const [holds, setHolds] = useState(0);
  const cancelledRef = useRef(false);
  const vaiNascer = ovoCompleto && !!amigo;

  useEffect(() => {
    cancelledRef.current = false;
    const esperar = (ms: number) => new Promise((r) => setTimeout(r, ms));
    (async () => {
      await esperar(500);
      if (cancelledRef.current) return;
      setEtapa(mundoCompleto ? 'completo' : 'ovo');
      onPoseChange('celebrating');
      await speakChico('demais');
      if (cancelledRef.current) return;
      onPoseChange('idle');

      if (vaiNascer && amigo) {
        await esperar(900);
        if (cancelledRef.current) return;
        setEtapa('invocacao');
        onPoseChange('talking');
        await speakModel(amigo.nome);
        if (cancelledRef.current) return;
        onPoseChange('idle');
      } else {
        await esperar(1800);
        if (!cancelledRef.current) onCompleta();
      }
    })();
    return () => {
      cancelledRef.current = true;
      void stopVoice();
    };
  }, []);

  async function onHoldValido() {
    const proximo = holds + 1;
    setHolds(proximo);
    if (proximo >= 3) {
      onPoseChange('celebrating');
      await speakChico('nasceu');
      await storage.resetOvo();
      if (cancelledRef.current) return;
      setEtapa('nasceu');
      await new Promise((r) => setTimeout(r, 2600));
      if (!cancelledRef.current) onCompleta();
    }
  }

  return (
    <View style={styles.wrap}>
      {etapa === 'nasceu' && <ConfettiBubbles />}

      {etapa === 'baú' && (
        <>
          <SpeechBubble>Vamos ver o que apareceu?</SpeechBubble>
          <Bau aberto={false} />
        </>
      )}

      {etapa === 'ovo' && (
        <>
          <SpeechBubble>Que lindo! Mais um pedaço do ovo!</SpeechBubble>
          <Bau aberto size={190} />
          <OvoFragmento fragmentos={fragmentos} />
          <Text style={styles.legenda}>{`${Math.min(fragmentos, 3)} de 3 pedaços`}</Text>
        </>
      )}

      {etapa === 'completo' && (
        <>
          <SpeechBubble>Você é demais! Todos os amigos do Chico já estão aqui!</SpeechBubble>
          <Bau aberto size={190} />
        </>
      )}

      {etapa === 'invocacao' && amigo && (
        <>
          <SpeechBubble>{`Chame por ${amigo.artigo} ${amigo.nome}!`}</SpeechBubble>
          <OvoFragmento fragmentos={holds + 1} size={150} />
          <InvocacaoButton onHoldValido={onHoldValido} disabled={holds >= 3} />
          <Text style={styles.legenda}>{`Segure e fale — ${holds} de 3`}</Text>
        </>
      )}

      {etapa === 'nasceu' && amigo && (
        <>
          <SpeechBubble>{`Nasceu! ${amigo.artigo === 'a' ? 'Esta' : 'Este'} é ${amigo.artigo} ${amigo.nome}!`}</SpeechBubble>
          <Image
            source={amigo.arte}
            style={styles.amigoArte}
            resizeMode="contain"
            accessibilityLabel={amigo.nome}
          />
          <Text style={styles.tituloNasceu}>{amigo.nome.toUpperCase()}</Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center', gap: 18, flex: 1 },
  legenda: { fontFamily: fontFamily.corpoExtra, color: colors.turquesaClaro, fontSize: 15 },
  tituloNasceu: { fontFamily: fontFamily.titulo, color: colors.estrela, fontSize: 34 },
  amigoArte: { width: 200, height: 200 },
});
