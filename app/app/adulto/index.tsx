import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Redirect, useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, fontFamily } from '@/theme/colors';
import { hapticLeve, hapticSucesso } from '@/lib/haptics';

/**
 * Ativa sempre em builds de produção/TestFlight/Play (protege dados da
 * criança e o menu de dev do painel). Em desenvolvimento (`__DEV__`) fica
 * desligada só para agilizar testes — nunca desligar isto manualmente
 * para uma build que vá para a loja.
 */
const GATE_ATIVO = !__DEV__;

const TECLAS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

/** Multiplicação com resultado de 2 dígitos — fácil para um adulto, fora do alcance de quem ainda não lê. */
function novaConta() {
  const a = 3 + Math.floor(Math.random() * 7);
  const b = 3 + Math.floor(Math.random() * 7);
  return { a, b, resposta: String(a * b) };
}

export default function GateAdulto() {
  const router = useRouter();
  const [conta, setConta] = useState(novaConta);
  const [digitado, setDigitado] = useState('');

  if (!GATE_ATIVO) {
    return <Redirect href="/adulto/painel" />;
  }

  function tocar(n: number) {
    const novo = digitado + n;
    if (!conta.resposta.startsWith(novo)) {
      hapticLeve();
      setDigitado('');
      setConta(novaConta());
      return;
    }
    if (novo === conta.resposta) {
      hapticSucesso();
      router.replace('/adulto/painel');
      return;
    }
    setDigitado(novo);
  }

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safe}>
        <Pressable
          onPress={() => router.back()}
          hitSlop={12}
          style={styles.voltar}
          accessibilityRole="button"
          accessibilityLabel="Voltar"
        >
          <ArrowLeft color={colors.turquesaClaro} size={24} />
        </Pressable>

        <Text style={styles.titulo}>Modo Adulto</Text>
        <Text style={styles.instrucao}>Para continuar, responda:</Text>
        <Text style={styles.conta} accessibilityLabel={`${conta.a} vezes ${conta.b}`}>
          {`${conta.a} × ${conta.b} = ${digitado || '?'}`}
        </Text>

        <View style={styles.grid}>
          {TECLAS.map((n) => (
            <Pressable
              key={n}
              style={({ pressed }) => [styles.tecla, pressed && styles.teclaPressed]}
              onPress={() => tocar(n)}
              accessibilityRole="button"
              accessibilityLabel={String(n)}
            >
              <Text style={styles.teclaTexto}>{n}</Text>
            </Pressable>
          ))}
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.tinta },
  safe: { flex: 1, alignItems: 'center', paddingTop: 4 },
  voltar: {
    alignSelf: 'flex-start',
    marginLeft: 12,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titulo: { fontFamily: fontFamily.titulo, color: colors.areia, fontSize: 24, marginTop: 12 },
  instrucao: { fontFamily: fontFamily.corpoSemi, color: colors.turquesaClaro, fontSize: 14, marginTop: 8 },
  conta: { fontFamily: fontFamily.titulo, color: colors.estrela, fontSize: 34, marginVertical: 18 },
  teclaPressed: { backgroundColor: 'rgba(38,198,218,0.35)' },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 14,
    maxWidth: 280,
  },
  tecla: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(38,198,218,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(123,230,242,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  teclaTexto: { fontFamily: fontFamily.titulo, color: colors.branco, fontSize: 26 },
});
