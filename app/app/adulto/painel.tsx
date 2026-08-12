import React, { useCallback, useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { ArrowLeft, Play, RotateCcw } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, fontFamily } from '@/theme/colors';
import { storage, type Gravacao } from '@/lib/storage';
import { playFile } from '@/lib/recorder';
import { espiarProximasPalavras } from '@/lib/palavrasDoDia';
import type { Word } from '@/data/modelWords';

type Aba = 'viagem' | 'gravacoes' | 'jogos';

const JOGOS_DEV: { label: string; fase: string; novo?: boolean }[] = [
  { label: 'Bloco 1 · Ouvidos Mágicos', fase: 'aquecimento' },
  { label: 'Bloco 1 · Hora de Falar', fase: 'producao' },
  { label: 'Bloco 1 · Guardar no Tesouro', fase: 'tesouro', novo: true },
  { label: 'Bloco 1 · Recompensa 1/3', fase: 'recompensa1' },
  { label: 'Bloco 2 · Caça-Sílaba', fase: 'cacaSilaba' },
  { label: 'Bloco 2 · Qual é qual?', fase: 'qualEQual' },
  { label: 'Bloco 2 · Recompensa 2/3', fase: 'recompensa2' },
  { label: 'Bloco 3 · Eco', fase: 'eco' },
  { label: 'Bloco 3 · A Travessia', fase: 'travessia' },
  { label: 'Bloco 3 · Recompensa 3/3 (nasce!)', fase: 'recompensa3' },
  { label: 'Fecho', fase: 'fecho' },
];

export default function PainelAdulto() {
  const router = useRouter();
  const [aba, setAba] = useState<Aba>('viagem');
  const [capsula, setCapsula] = useState<Gravacao[]>([]);
  const [recentes, setRecentes] = useState<Record<string, Gravacao | null>>({});
  const [gravacoes, setGravacoes] = useState<Gravacao[]>([]);
  const [proximasPalavras, setProximasPalavras] = useState<Word[]>([]);
  const [errosSessaoAnterior, setErrosSessaoAnterior] = useState<string[]>([]);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const [c, todas] = await Promise.all([storage.getCapsulaDia0(), storage.getGravacoes()]);
        setCapsula(c);
        setGravacoes(todas);
        const mapa: Record<string, Gravacao | null> = {};
        for (const g of c) {
          mapa[g.wordId] = await storage.ultimaGravacaoDe(g.wordId);
        }
        setRecentes(mapa);
      })();
      espiarProximasPalavras().then(({ palavras }) => setProximasPalavras(palavras));
      storage.getErrosUltimaSessao().then(setErrosSessaoAnterior);
    }, [])
  );

  async function comparar(wordId: string) {
    const original = capsula.find((c) => c.wordId === wordId);
    const recente = recentes[wordId];
    if (original) await playFile(original.uri).catch(() => {});
    await new Promise((r) => setTimeout(r, 300));
    if (recente) await playFile(recente.uri).catch(() => {});
  }

  function confirmarReset() {
    Alert.alert(
      'Recomeçar do zero?',
      'Isso apaga o perfil, o streak, o ovo, a cápsula do tempo e todas as gravações salvas neste telemóvel. Não pode ser desfeito.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Apagar tudo',
          style: 'destructive',
          onPress: async () => {
            await storage.resetTudo();
            router.replace('/');
          },
        },
      ]
    );
  }

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <Pressable onPress={() => router.replace('/mapa')} hitSlop={10}>
            <ArrowLeft color={colors.areia} size={24} />
          </Pressable>
          <Text style={styles.titulo}>Modo Adulto</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.tabs}>
          <Pressable style={[styles.tab, aba === 'viagem' && styles.tabAtiva]} onPress={() => setAba('viagem')}>
            <Text style={[styles.tabTexto, aba === 'viagem' && styles.tabTextoAtiva]}>Viagem da Voz</Text>
          </Pressable>
          <Pressable style={[styles.tab, aba === 'gravacoes' && styles.tabAtiva]} onPress={() => setAba('gravacoes')}>
            <Text style={[styles.tabTexto, aba === 'gravacoes' && styles.tabTextoAtiva]}>Gravações</Text>
          </Pressable>
          {__DEV__ ? (
            <Pressable style={[styles.tab, aba === 'jogos' && styles.tabAtiva]} onPress={() => setAba('jogos')}>
              <Text style={[styles.tabTexto, aba === 'jogos' && styles.tabTextoAtiva]}>Testar jogos</Text>
            </Pressable>
          ) : null}
        </View>

        {__DEV__ && aba === 'jogos' ? (
          <FlatList
            data={JOGOS_DEV}
            keyExtractor={(item) => item.fase}
            contentContainerStyle={styles.lista}
            ListHeaderComponent={
              <View style={{ gap: 12, marginBottom: 4 }}>
                <Text style={styles.avisoJogos}>Abre a sessão direto naquela fase, para testar sem jogar tudo antes.</Text>

                <View style={styles.rotacaoBox}>
                  <Text style={styles.rotacaoTitulo}>Próxima sessão vai usar</Text>
                  <Text style={styles.rotacaoTexto}>{proximasPalavras.map((w) => w.palavra).join(', ') || '—'}</Text>

                  <Text style={[styles.rotacaoTitulo, { marginTop: 8 }]}>Erros da sessão anterior (voltam agora)</Text>
                  <Text style={styles.rotacaoTexto}>{errosSessaoAnterior.length ? errosSessaoAnterior.join(', ') : 'nenhum'}</Text>

                  <Text style={styles.rotacaoNota}>
                    A rotação só avança quando uma sessão termina de verdade (não é por dia) — pode jogar várias vezes seguidas que cada uma traz palavras novas.
                  </Text>
                </View>
              </View>
            }
            renderItem={({ item }) => (
              <Pressable
                style={styles.linhaJogo}
                onPress={() => router.push({ pathname: '/sessao', params: { fase: item.fase } })}
              >
                <View style={styles.playIcon}>
                  <Play color={colors.fundo} size={16} />
                </View>
                <Text style={styles.palavra}>{item.label}</Text>
                {item.novo ? (
                  <View style={styles.novoBadge}>
                    <Text style={styles.novoBadgeTexto}>novo</Text>
                  </View>
                ) : null}
              </Pressable>
            )}
          />
        ) : null}

        {aba === 'viagem' ? (
          <FlatList
            data={capsula}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.lista}
            ListEmptyComponent={<Text style={styles.vazio}>Ainda não há cápsula do tempo salva.</Text>}
            renderItem={({ item }) => (
              <View style={styles.linha}>
                <Text style={styles.palavra}>{item.palavra}</Text>
                <View style={styles.playersRow}>
                  <Pressable style={styles.playerChip} onPress={() => playFile(item.uri).catch(() => {})}>
                    <Play color={colors.fundo} size={14} />
                    <Text style={styles.playerLabel}>Dia 0</Text>
                  </Pressable>
                  <Pressable
                    style={[styles.playerChip, { backgroundColor: colors.turquesa }]}
                    onPress={() => recentes[item.wordId] && playFile(recentes[item.wordId]!.uri).catch(() => {})}
                  >
                    <Play color={colors.branco} size={14} />
                    <Text style={[styles.playerLabel, { color: colors.branco }]}>Recente</Text>
                  </Pressable>
                  <Pressable style={styles.compararBtn} onPress={() => comparar(item.wordId)}>
                    <Text style={styles.compararTexto}>Comparar</Text>
                  </Pressable>
                </View>
              </View>
            )}
          />
        ) : null}

        {aba === 'gravacoes' ? (
          <FlatList
            data={gravacoes}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.lista}
            ListEmptyComponent={<Text style={styles.vazio}>Nenhuma gravação ainda.</Text>}
            renderItem={({ item }) => (
              <Pressable style={styles.linhaGravacao} onPress={() => playFile(item.uri).catch(() => {})}>
                <View style={styles.playIcon}>
                  <Play color={colors.fundo} size={16} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.palavra}>{item.palavra}</Text>
                  <Text style={styles.dataTexto}>{new Date(item.criadoEm).toLocaleString('pt-BR')}</Text>
                </View>
              </Pressable>
            )}
          />
        ) : null}

        <View style={styles.footer}>
          <Pressable style={styles.resetBtn} onPress={confirmarReset} hitSlop={8}>
            <RotateCcw color={colors.coral} size={14} />
            <Text style={styles.resetTexto}>Recomeçar do zero</Text>
          </Pressable>
          <Text style={styles.footerTexto}>O Falamigos não substitui a fonoaudióloga.</Text>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.tinta },
  safe: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  titulo: { fontFamily: fontFamily.titulo, color: colors.areia, fontSize: 20 },
  tabs: { flexDirection: 'row', marginHorizontal: 20, marginTop: 16, backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 16, padding: 4 },
  tab: { flex: 1, paddingVertical: 10, borderRadius: 12, alignItems: 'center' },
  tabAtiva: { backgroundColor: colors.turquesa },
  tabTexto: { fontFamily: fontFamily.corpoExtra, color: colors.turquesaClaro, fontSize: 13 },
  tabTextoAtiva: { color: colors.branco },
  lista: { padding: 20, gap: 14 },
  vazio: { fontFamily: fontFamily.corpoSemi, color: colors.turquesaClaro, textAlign: 'center', marginTop: 40 },
  linha: { backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 18, padding: 16, gap: 10 },
  palavra: { fontFamily: fontFamily.titulo, color: colors.areia, fontSize: 18 },
  playersRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  playerChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.areia,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  playerLabel: { fontFamily: fontFamily.corpoExtra, color: colors.fundo, fontSize: 12 },
  compararBtn: { marginLeft: 'auto', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: colors.estrela },
  compararTexto: { fontFamily: fontFamily.corpoExtra, color: colors.estrela, fontSize: 12 },
  linhaGravacao: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 16,
    padding: 14,
  },
  playIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.areia, alignItems: 'center', justifyContent: 'center' },
  dataTexto: { fontFamily: fontFamily.corpoSemi, color: colors.turquesaClaro, fontSize: 12, marginTop: 2 },
  avisoJogos: {
    fontFamily: fontFamily.corpoSemi,
    color: colors.turquesaClaro,
    fontSize: 13,
    marginBottom: 4,
  },
  linhaJogo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 16,
    padding: 14,
  },
  rotacaoBox: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 16,
    padding: 14,
    gap: 2,
  },
  rotacaoTitulo: { fontFamily: fontFamily.corpoExtra, color: colors.turquesaClaro, fontSize: 12 },
  rotacaoTexto: { fontFamily: fontFamily.corpoSemi, color: colors.areia, fontSize: 14 },
  rotacaoNota: {
    fontFamily: fontFamily.corpoSemi,
    color: colors.turquesaClaro,
    fontSize: 11,
    marginTop: 10,
    lineHeight: 15,
  },
  novoBadge: {
    marginLeft: 'auto',
    backgroundColor: colors.estrela,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  novoBadgeTexto: { fontFamily: fontFamily.corpoExtra, color: colors.fundo, fontSize: 11 },
  footer: { paddingHorizontal: 20, paddingVertical: 14, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.08)', gap: 10 },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.coral,
  },
  resetTexto: { fontFamily: fontFamily.corpoExtra, color: colors.coral, fontSize: 12 },
  footerTexto: { fontFamily: fontFamily.corpoSemi, color: colors.turquesaClaro, fontSize: 11, textAlign: 'center' },
});
