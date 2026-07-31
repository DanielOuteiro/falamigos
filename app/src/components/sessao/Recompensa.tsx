import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Bau } from '@/components/sessao/Bau';
import { OvoFragmento } from '@/components/sessao/OvoFragmento';
import { InvocacaoButton } from '@/components/sessao/InvocacaoButton';
import { ConfettiBubbles } from '@/components/sessao/ConfettiBubbles';
import { ChispaSprite } from '@/components/ChispaSprite';
import { SpeechBubble } from '@/components/ui/SpeechBubble';
import { colors, fontFamily } from '@/theme/colors';
import { speakChico } from '@/lib/voice';
import { storage } from '@/lib/storage';
import type { ChicoPose } from '@/components/ChicoSprite';

type Etapa = 'baú' | 'ovo' | 'invocacao' | 'nasceu';

export function Recompensa({
  fragmentos,
  ovoCompleto,
  onPoseChange,
  onCompleta,
}: {
  fragmentos: number;
  ovoCompleto: boolean;
  onPoseChange: (p: ChicoPose) => void;
  onCompleta: () => void;
}) {
  const [etapa, setEtapa] = useState<Etapa>('baú');
  const [holds, setHolds] = useState(0);

  useEffect(() => {
    (async () => {
      await new Promise((r) => setTimeout(r, 500));
      setEtapa('ovo');
      onPoseChange('celebrating');
      await speakChico('demais');
      onPoseChange('idle');

      if (ovoCompleto) {
        await new Promise((r) => setTimeout(r, 900));
        setEtapa('invocacao');
        onPoseChange('talking');
        await speakChico('chispa');
        onPoseChange('idle');
      } else {
        await new Promise((r) => setTimeout(r, 1800));
        onCompleta();
      }
    })();
  }, []);

  async function onHoldValido() {
    const proximo = holds + 1;
    setHolds(proximo);
    if (proximo >= 3) {
      onPoseChange('celebrating');
      await speakChico('nasceu');
      await storage.resetOvo();
      await storage.setChispaNasceu(true);
      setEtapa('nasceu');
      await new Promise((r) => setTimeout(r, 2600));
      onCompleta();
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

      {etapa === 'invocacao' && (
        <>
          <SpeechBubble>Diga o nome dele: CHISPA!</SpeechBubble>
          <OvoFragmento fragmentos={holds + 1} size={150} />
          <InvocacaoButton onHoldValido={onHoldValido} disabled={holds >= 3} />
          <Text style={styles.legenda}>{`Segure e fale — ${holds} de 3`}</Text>
        </>
      )}

      {etapa === 'nasceu' && (
        <>
          <SpeechBubble>Ele nasceu! Este é o Chispa!</SpeechBubble>
          <ChispaSprite size={170} />
          <Text style={styles.tituloNasceu}>CHISPA</Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center', gap: 18, flex: 1 },
  legenda: { fontFamily: fontFamily.corpoExtra, color: colors.turquesaClaro, fontSize: 15 },
  tituloNasceu: { fontFamily: fontFamily.titulo, color: colors.estrela, fontSize: 34 },
});
