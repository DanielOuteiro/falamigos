import React, { useMemo, useState } from 'react';
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

const SENHA = [3, 7, 2];

function embaralhar<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function GateAdulto() {
  const router = useRouter();
  const numeros = useMemo(() => embaralhar([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]), []);
  const [progresso, setProgresso] = useState<number[]>([]);

  if (!GATE_ATIVO) {
    return <Redirect href="/adulto/painel" />;
  }

  function tocar(n: number) {
    const novo = [...progresso, n];
    const esperado = SENHA[progresso.length];
    if (n !== esperado) {
      hapticLeve();
      setProgresso([]);
      return;
    }
    if (novo.length === SENHA.length) {
      hapticSucesso();
      router.replace('/adulto/painel');
      return;
    }
    setProgresso(novo);
  }

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safe}>
        <Pressable onPress={() => router.back()} hitSlop={10} style={styles.voltar}>
          <ArrowLeft color={colors.turquesaClaro} size={24} />
        </Pressable>

        <Text style={styles.titulo}>Modo Adulto</Text>
        <Text style={styles.instrucao}>{`Toque na ordem: ${SENHA.join(' · ')}`}</Text>

        <View style={styles.dots}>
          {SENHA.map((_, i) => (
            <View key={i} style={[styles.dot, i < progresso.length && styles.dotAtivo]} />
          ))}
        </View>

        <View style={styles.grid}>
          {numeros.map((n) => (
            <Pressable key={n} style={styles.tecla} onPress={() => tocar(n)}>
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
  safe: { flex: 1, alignItems: 'center', paddingTop: 20 },
  voltar: { position: 'absolute', top: 16, left: 20, zIndex: 1 },
  titulo: { fontFamily: fontFamily.titulo, color: colors.areia, fontSize: 24, marginTop: 30 },
  instrucao: { fontFamily: fontFamily.corpoSemi, color: colors.turquesaClaro, fontSize: 14, marginTop: 8 },
  dots: { flexDirection: 'row', gap: 10, marginVertical: 22 },
  dot: { width: 12, height: 12, borderRadius: 6, backgroundColor: 'rgba(123,230,242,0.25)' },
  dotAtivo: { backgroundColor: colors.estrela },
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
