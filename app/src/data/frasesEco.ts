export type FraseEco = {
  id: string;
  texto: string;
  /** Palavra dentro da frase que tem o clip do Chico (para speakModel). */
  palavraAlvo: string;
};

/**
 * "Eco" — a criança ouve a frase uma única vez e repete na hora. Sem
 * repetição múltipla nem trilha (isso é o Travessia); aqui é só imitação
 * imediata, o aquecimento da Fase 3.
 */
export const FRASES_ECO: FraseEco[] = [
  { id: 'bruxa_chapeu', texto: 'A bruxa tem chapéu', palavraAlvo: 'bruxa' },
  { id: 'cachorro_late', texto: 'O cachorro late alto', palavraAlvo: 'cachorro' },
  { id: 'chave_porta', texto: 'A chave abre a porta', palavraAlvo: 'chave' },
  { id: 'chupeta_caiu', texto: 'A chupeta caiu no chão', palavraAlvo: 'chupeta' },
  { id: 'chaleira_apitou', texto: 'A chaleira apitou', palavraAlvo: 'chaleira' },
  { id: 'guarda_chuva_pega', texto: 'Pega o guarda-chuva', palavraAlvo: 'guarda-chuva' },
  { id: 'bexiga_estourou', texto: 'A bexiga estourou', palavraAlvo: 'bexiga' },
  { id: 'abacaxi_doce', texto: 'O abacaxi é doce', palavraAlvo: 'abacaxi' },
  { id: 'mochila_pesada', texto: 'A mochila é pesada', palavraAlvo: 'mochila' },
  { id: 'machucado_joelho', texto: 'O joelho ficou machucado', palavraAlvo: 'machucado' },
  { id: 'enxada_vovo', texto: 'O vovô pegou a enxada', palavraAlvo: 'enxada' },
];
