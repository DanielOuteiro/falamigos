export type FraseTravessia = {
  id: string;
  texto: string;
  /** Palavra dentro da frase que tem o clip do Chico (para speakModel). */
  palavraAlvo: string;
  /** Quantas vezes a frase precisa ser dita para o barquinho chegar na meta. */
  passos: number;
};

/**
 * "A Travessia" — a criança ouve a frase e a repete; cada repetição válida
 * avança o veículo do mundo (aqui, o barquinho do Chico) um passo até a meta.
 * No código é um jogo só; só troca o sprite/cenário por mundo.
 */
export const FRASES_TRAVESSIA: FraseTravessia[] = [
  { id: 'cha_quente', texto: 'O chá tá quente', palavraAlvo: 'chá', passos: 3 },
  { id: 'chave_perdida', texto: 'Achei a chave', palavraAlvo: 'chave', passos: 3 },
  { id: 'peixe_nada', texto: 'O peixe nada rápido', palavraAlvo: 'peixe', passos: 3 },
  { id: 'chupeta_cade', texto: 'Cadê a chupeta?', palavraAlvo: 'chupeta', passos: 3 },
  { id: 'chaleira_fogo', texto: 'A chaleira tá no fogo', palavraAlvo: 'chaleira', passos: 3 },
  { id: 'guarda_chuva_azul', texto: 'O guarda-chuva é azul', palavraAlvo: 'guarda-chuva', passos: 3 },
  { id: 'bexiga_sopra', texto: 'Sopra a bexiga', palavraAlvo: 'bexiga', passos: 3 },
  { id: 'abacaxi_corta', texto: 'Corta o abacaxi', palavraAlvo: 'abacaxi', passos: 3 },
  { id: 'mochila_leva', texto: 'Leva a mochila', palavraAlvo: 'mochila', passos: 3 },
  { id: 'machucado_sarou', texto: 'O machucado já sarou', palavraAlvo: 'machucado', passos: 3 },
  { id: 'enxada_cavou', texto: 'A enxada cavou o chão', palavraAlvo: 'enxada', passos: 3 },
];
