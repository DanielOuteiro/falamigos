import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Toda a persistência da demo vive no AsyncStorage do telemóvel — zero rede,
 * zero backend. Isto simula o que no futuro sincronizaria com o dashboard
 * da fonoaudióloga.
 */

const KEYS = {
  perfil: 'falamigos:perfil',
  streak: 'falamigos:streak',
  ultimaSessao: 'falamigos:ultimaSessao',
  sessoesCompletas: 'falamigos:sessoesCompletas',
  ovoFragmentos: 'falamigos:ovoFragmentos',
  chispaNasceu: 'falamigos:chispaNasceu',
  gravacoes: 'falamigos:gravacoes',
  capsulaDia0: 'falamigos:capsulaDia0',
  onboardingCompleto: 'falamigos:onboardingCompleto',
  rotacaoIndex: 'falamigos:rotacaoIndex',
  errosUltimaSessao: 'falamigos:errosUltimaSessao',
} as const;

export type Perfil = {
  nome: string;
  idade: number;
  universo: string;
};

export type Gravacao = {
  id: string;
  wordId: string;
  palavra: string;
  uri: string;
  criadoEm: number;
};

async function getJSON<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

async function setJSON<T>(key: string, value: T): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

export const storage = {
  async getPerfil(): Promise<Perfil | null> {
    return getJSON<Perfil | null>(KEYS.perfil, null);
  },
  async setPerfil(perfil: Perfil): Promise<void> {
    await setJSON(KEYS.perfil, perfil);
  },

  async isOnboardingCompleto(): Promise<boolean> {
    return getJSON<boolean>(KEYS.onboardingCompleto, false);
  },
  async setOnboardingCompleto(v: boolean): Promise<void> {
    await setJSON(KEYS.onboardingCompleto, v);
  },

  async getStreak(): Promise<number> {
    return getJSON<number>(KEYS.streak, 0);
  },
  async getUltimaSessao(): Promise<string | null> {
    return getJSON<string | null>(KEYS.ultimaSessao, null);
  },
  /** Chamado uma vez, ao fim de toda a sessão do dia (streak + contagem do trilho). */
  async registrarSessaoConcluida(): Promise<{ streak: number }> {
    const hoje = new Date().toISOString().slice(0, 10);
    const ultima = await this.getUltimaSessao();
    let streak = await this.getStreak();
    if (ultima !== hoje) {
      const ontem = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
      streak = ultima === ontem ? streak + 1 : 1;
      await setJSON(KEYS.streak, streak);
      await setJSON(KEYS.ultimaSessao, hoje);
    }
    const sessoes = (await getJSON<number>(KEYS.sessoesCompletas, 0)) + 1;
    await setJSON(KEYS.sessoesCompletas, sessoes);

    return { streak };
  },

  /** Chamado ao fim de cada bloco (3 por sessão) — 1 pedaço de ovo cada. */
  async adicionarFragmentoOvo(): Promise<{ fragmentos: number; ovoCompleto: boolean }> {
    const fragmentos = (await getJSON<number>(KEYS.ovoFragmentos, 0)) + 1;
    await setJSON(KEYS.ovoFragmentos, fragmentos);
    return { fragmentos, ovoCompleto: fragmentos >= 3 };
  },

  async getOvoFragmentos(): Promise<number> {
    return getJSON<number>(KEYS.ovoFragmentos, 0);
  },
  async resetOvo(): Promise<void> {
    await setJSON(KEYS.ovoFragmentos, 0);
  },
  async getSessoesCompletas(): Promise<number> {
    return getJSON<number>(KEYS.sessoesCompletas, 0);
  },

  async chispaNasceu(): Promise<boolean> {
    return getJSON<boolean>(KEYS.chispaNasceu, false);
  },
  async setChispaNasceu(v: boolean): Promise<void> {
    await setJSON(KEYS.chispaNasceu, v);
  },

  async getGravacoes(): Promise<Gravacao[]> {
    return getJSON<Gravacao[]>(KEYS.gravacoes, []);
  },
  async adicionarGravacao(g: Gravacao): Promise<void> {
    const atual = await this.getGravacoes();
    atual.unshift(g);
    await setJSON(KEYS.gravacoes, atual);
  },
  async ultimaGravacaoDe(wordId: string): Promise<Gravacao | null> {
    const atual = await this.getGravacoes();
    return atual.find((g) => g.wordId === wordId) ?? null;
  },

  async getCapsulaDia0(): Promise<Gravacao[]> {
    return getJSON<Gravacao[]>(KEYS.capsulaDia0, []);
  },
  async setCapsulaDia0(gravacoes: Gravacao[]): Promise<void> {
    await setJSON(KEYS.capsulaDia0, gravacoes);
  },

  /**
   * Ponteiro de rotação das palavras — avança 1x por sessão *completada*
   * (não por dia/data). Fazer várias sessões no mesmo dia dá conteúdo novo
   * em cada uma; ficar dias sem abrir o app não pula nada.
   */
  async getRotacaoIndex(): Promise<number> {
    return getJSON<number>(KEYS.rotacaoIndex, 0);
  },
  async setRotacaoIndex(v: number): Promise<void> {
    await setJSON(KEYS.rotacaoIndex, v);
  },

  async getErrosUltimaSessao(): Promise<string[]> {
    return getJSON<string[]>(KEYS.errosUltimaSessao, []);
  },
  /**
   * Chamado 1x no fim de cada sessão completa — guarda as palavras em que
   * houve "erro" (pediu repetir, ou tocou na sílaba/opção errada). Elas
   * voltam com prioridade na sessão seguinte. Sobrescreve o registo
   * anterior: só interessa o que aconteceu na sessão mais recente.
   */
  async registrarErrosSessao(wordIds: string[]): Promise<void> {
    await setJSON(KEYS.errosUltimaSessao, Array.from(new Set(wordIds)));
  },

  /** Rotação genérica por chave — usada por pools sem prioridade de erro (ex.: frases do Eco/Travessia). */
  async getRotacaoGenerica(chave: string): Promise<number> {
    return getJSON<number>(rotacaoGenericaKey(chave), 0);
  },
  async setRotacaoGenerica(chave: string, v: number): Promise<void> {
    await setJSON(rotacaoGenericaKey(chave), v);
  },

  async resetTudo(): Promise<void> {
    const todas = await AsyncStorage.getAllKeys();
    await AsyncStorage.multiRemove(todas.filter((k) => k.startsWith('falamigos:')));
  },
};

function rotacaoGenericaKey(chave: string): string {
  return `falamigos:rot:${chave}`;
}
