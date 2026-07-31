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
  async registrarSessaoConcluida(): Promise<{ streak: number; ovoCompleto: boolean }> {
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

    let fragmentos = (await getJSON<number>(KEYS.ovoFragmentos, 0)) + 1;
    let ovoCompleto = false;
    if (fragmentos >= 3) {
      ovoCompleto = true;
    }
    await setJSON(KEYS.ovoFragmentos, fragmentos);

    return { streak, ovoCompleto };
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

  async resetTudo(): Promise<void> {
    await AsyncStorage.multiRemove(Object.values(KEYS));
  },
};
