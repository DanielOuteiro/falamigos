import { storage } from '@/lib/storage';

function porIds<T extends { id: string }>(pool: T[], ids: string[]): T[] {
  return ids.map((id) => pool.find((item) => item.id === id)).filter((x): x is T => !!x);
}

/** Calcula (sem gravar nada) o próximo subconjunto de um pool, girando pelo pool inteiro. */
export function calcularProximoSubconjunto<T extends { id: string }>(
  pool: T[],
  rotIndex: number,
  quantidade: number
): { ids: string[]; novoIndex: number } {
  const selecionados: string[] = [];
  let cursor = rotIndex;
  let tentativas = 0;
  while (selecionados.length < quantidade && tentativas < pool.length) {
    const candidato = pool[cursor % pool.length];
    cursor++;
    tentativas++;
    if (!selecionados.includes(candidato.id)) selecionados.push(candidato.id);
  }
  return { ids: selecionados, novoIndex: pool.length ? cursor % pool.length : 0 };
}

/**
 * Espia (sem gravar nada) o próximo subconjunto de um pool identificado por
 * `chave` (ex.: frases do Eco/Travessia) — usado pelos jogos que não têm
 * conceito de "erro" pra priorizar, só rotação simples. Não depende de
 * data/dia; avança por sessão completada (ver `confirmarAvancoSubconjunto`).
 */
export async function espiarSubconjunto<T extends { id: string }>(
  chave: string,
  pool: T[],
  quantidade: number
): Promise<{ itens: T[]; novoIndex: number }> {
  const rotIndex = await storage.getRotacaoGenerica(chave);
  const { ids, novoIndex } = calcularProximoSubconjunto(pool, rotIndex, quantidade);
  return { itens: porIds(pool, ids), novoIndex };
}

/** Grava de vez o avanço da rotação genérica — só chamar quando a sessão terminar de verdade. */
export async function confirmarAvancoSubconjunto(chave: string, novoIndex: number): Promise<void> {
  await storage.setRotacaoGenerica(chave, novoIndex);
}
