import { ALL_WORDS, type Word } from '@/data/modelWords';
import { storage } from '@/lib/storage';

export const TAMANHO_SESSAO = 5;

function porIds(ids: string[]): Word[] {
  return ids.map((id) => ALL_WORDS.find((w) => w.id === id)).filter((w): w is Word => !!w);
}

/**
 * Calcula (sem gravar nada) quais palavras a próxima sessão usaria a partir
 * do ponteiro de rotação atual:
 *  1. Palavras que tiveram "erro" na sessão anterior (pediu repetir, ou
 *     tocou na sílaba/opção errada) voltam primeiro — reforço.
 *  2. As vagas restantes vêm da rotação normal pelo banco de palavras,
 *     continuando de onde parou.
 *
 * Não depende de data/dia nenhum — só de quantas sessões já foram
 * *completadas*. Fazer 5 sessões no mesmo dia dá 5 conjuntos diferentes;
 * não abrir o app por uma semana não pula nada.
 */
export function calcularProximasPalavras(
  rotIndex: number,
  errosPassados: string[],
  quantidade = TAMANHO_SESSAO
): { ids: string[]; novoIndex: number } {
  const selecionadas: string[] = [];
  for (const id of errosPassados) {
    if (selecionadas.length >= quantidade) break;
    if (ALL_WORDS.some((w) => w.id === id)) selecionadas.push(id);
  }

  let cursor = rotIndex;
  let tentativas = 0;
  while (selecionadas.length < quantidade && tentativas < ALL_WORDS.length) {
    const candidata = ALL_WORDS[cursor % ALL_WORDS.length];
    cursor++;
    tentativas++;
    if (!selecionadas.includes(candidata.id)) selecionadas.push(candidata.id);
  }

  return { ids: selecionadas, novoIndex: cursor % ALL_WORDS.length };
}

/**
 * Espia (sem gravar nada) o conjunto que a próxima sessão vai usar — pra
 * mostrar no painel de dev ou pra montar a tela sem já consumir a rotação.
 * `novoIndex` vem junto pra quem for realmente rodar a sessão poder
 * confirmar o avanço no fim (ver `confirmarAvancoPalavras`).
 */
export async function espiarProximasPalavras(): Promise<{ palavras: Word[]; novoIndex: number }> {
  const [errosPassados, rotIndex] = await Promise.all([
    storage.getErrosUltimaSessao(),
    storage.getRotacaoIndex(),
  ]);
  const { ids, novoIndex } = calcularProximasPalavras(rotIndex, errosPassados);
  return { palavras: porIds(ids), novoIndex };
}

/** Grava de vez o avanço da rotação — só chamar quando a sessão terminar de verdade. */
export async function confirmarAvancoPalavras(novoIndex: number): Promise<void> {
  await storage.setRotacaoIndex(novoIndex);
}
