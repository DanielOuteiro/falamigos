/**
 * Dados 100% mock do painel da fonoaudióloga. Nenhuma chamada de rede —
 * tudo hardcoded para a demo. Ponto de troca: substituir por chamadas a
 * uma API real mantendo os mesmos tipos.
 */

export type Paciente = {
  id: string;
  nome: string;
  idade: number;
  iniciais: string;
  corAvatar: string;
  fonemaAlvo: string;
  sotaque: string;
  streak: number;
  producoesTotais: number;
  adesaoSemana: boolean[]; // 7 dias
};

export const pacientes: Paciente[] = [
  {
    id: 'liam',
    nome: 'Liam T.',
    idade: 5,
    iniciais: 'LT',
    corAvatar: '#26C6DA',
    fonemaAlvo: '/ʃ/ inicial + medial',
    sotaque: 'Interior de São Paulo',
    streak: 9,
    producoesTotais: 214,
    adesaoSemana: [true, true, true, true, true, false, true],
  },
  {
    id: 'sofia',
    nome: 'Sofia M.',
    idade: 4,
    iniciais: 'SM',
    corAvatar: '#FF7E67',
    fonemaAlvo: '/ʒ/ inicial',
    sotaque: 'Nordeste',
    streak: 4,
    producoesTotais: 96,
    adesaoSemana: [true, false, true, true, false, false, true],
  },
  {
    id: 'davi',
    nome: 'Davi R.',
    idade: 6,
    iniciais: 'DR',
    corAvatar: '#FFD166',
    fonemaAlvo: 'R forte',
    sotaque: 'Rio de Janeiro',
    streak: 12,
    producoesTotais: 301,
    adesaoSemana: [true, true, true, true, true, true, true],
  },
  {
    id: 'helena',
    nome: 'Helena C.',
    idade: 7,
    iniciais: 'HC',
    corAvatar: '#BA68C8',
    fonemaAlvo: 'R de trava',
    sotaque: 'Sul',
    streak: 2,
    producoesTotais: 41,
    adesaoSemana: [false, false, true, false, true, false, false],
  },
  {
    id: 'miguel',
    nome: 'Miguel A.',
    idade: 3,
    iniciais: 'MA',
    corAvatar: '#43A047',
    fonemaAlvo: 's / z',
    sotaque: 'Minas Gerais',
    streak: 6,
    producoesTotais: 128,
    adesaoSemana: [true, true, false, true, true, false, true],
  },
  {
    id: 'valentina',
    nome: 'Valentina P.',
    idade: 8,
    iniciais: 'VP',
    corAvatar: '#EC407A',
    fonemaAlvo: 'l / lh',
    sotaque: 'Interior de São Paulo',
    streak: 15,
    producoesTotais: 372,
    adesaoSemana: [true, true, true, true, true, true, false],
  },
];

export const fonemasDisponiveis = [
  { id: 'sh', simbolo: 'ʃ', nome: 'CH / X' },
  { id: 'zh', simbolo: 'ʒ', nome: 'J / G' },
  { id: 'rforte', simbolo: 'R', nome: 'R forte' },
  { id: 'rtrava', simbolo: 'ɾ', nome: 'R de trava' },
  { id: 's', simbolo: 's', nome: 'S' },
  { id: 'z', simbolo: 'z', nome: 'Z' },
  { id: 'l', simbolo: 'l', nome: 'L' },
  { id: 'lh', simbolo: 'ʎ', nome: 'LH' },
  { id: 'grupos', simbolo: 'CCV', nome: 'Grupos consonantais' },
];

export const posicoes = ['Inicial', 'Medial', 'Final'];
export const niveis = ['Palavra', 'Frase'];
export const sotaques = [
  'Interior de São Paulo',
  'Nordeste',
  'Rio de Janeiro',
  'Sul',
  'Minas Gerais',
];

export const palavrasSeed = [
  { id: 'cha', palavra: 'chá', emoji: '🍵' },
  { id: 'chave', palavra: 'chave', emoji: '🔑' },
  { id: 'chupeta', palavra: 'chupeta', emoji: '🍼' },
  { id: 'chaleira', palavra: 'chaleira', emoji: '🫖' },
  { id: 'guarda_chuva', palavra: 'guarda-chuva', emoji: '☂️' },
  { id: 'bexiga', palavra: 'bexiga', emoji: '🎈' },
  { id: 'abacaxi', palavra: 'abacaxi', emoji: '🍍' },
  { id: 'peixe', palavra: 'peixe', emoji: '🐠' },
  { id: 'bruxa', palavra: 'bruxa', emoji: '🧙' },
  { id: 'mochila', palavra: 'mochila', emoji: '🎒' },
  { id: 'machucado', palavra: 'machucado', emoji: '🩹' },
  { id: 'enxada', palavra: 'enxada', emoji: '⛏️' },
  { id: 'cachorro', palavra: 'cachorro', emoji: '🐕' },
];

export type GravacaoFila = {
  id: string;
  pacienteNome: string;
  pacienteIniciais: string;
  corAvatar: string;
  palavra: string;
  data: string;
  duracaoSeg: number;
  avaliacao: 'dominou' | 'repetir' | 'ver' | null;
};

export const filaDeEscuta: GravacaoFila[] = [
  { id: 'g1', pacienteNome: 'Liam T.', pacienteIniciais: 'LT', corAvatar: '#26C6DA', palavra: 'chave', data: 'Hoje, 08:12', duracaoSeg: 2, avaliacao: null },
  { id: 'g2', pacienteNome: 'Liam T.', pacienteIniciais: 'LT', corAvatar: '#26C6DA', palavra: 'peixe', data: 'Hoje, 08:13', duracaoSeg: 1, avaliacao: null },
  { id: 'g3', pacienteNome: 'Liam T.', pacienteIniciais: 'LT', corAvatar: '#26C6DA', palavra: 'bruxa', data: 'Hoje, 08:14', duracaoSeg: 2, avaliacao: null },
  { id: 'g4', pacienteNome: 'Sofia M.', pacienteIniciais: 'SM', corAvatar: '#FF7E67', palavra: 'jacaré', data: 'Ontem, 17:40', duracaoSeg: 2, avaliacao: 'dominou' },
  { id: 'g5', pacienteNome: 'Davi R.', pacienteIniciais: 'DR', corAvatar: '#FFD166', palavra: 'cachorro', data: 'Ontem, 19:02', duracaoSeg: 3, avaliacao: null },
  { id: 'g6', pacienteNome: 'Miguel A.', pacienteIniciais: 'MA', corAvatar: '#43A047', palavra: 'sapo', data: 'Ontem, 20:11', duracaoSeg: 1, avaliacao: 'repetir' },
  { id: 'g7', pacienteNome: 'Valentina P.', pacienteIniciais: 'VP', corAvatar: '#EC407A', palavra: 'lua', data: '2 dias atrás', duracaoSeg: 2, avaliacao: null },
  { id: 'g8', pacienteNome: 'Helena C.', pacienteIniciais: 'HC', corAvatar: '#BA68C8', palavra: 'carro', data: '2 dias atrás', duracaoSeg: 2, avaliacao: null },
];

/** Heatmap de 30 dias do Liam — intensidade 0..4 (produções no dia). */
export const heatmap30dias: number[] = Array.from({ length: 30 }, (_, i) => {
  const base = Math.sin(i / 3) * 2 + 2;
  const ruido = (i * 37) % 5;
  return Math.max(0, Math.min(4, Math.round((base + ruido) / 2)));
});

export const producoesPorDia = [
  { dia: 'Seg', total: 24 },
  { dia: 'Ter', total: 31 },
  { dia: 'Qua', total: 18 },
  { dia: 'Qui', total: 29 },
  { dia: 'Sex', total: 35 },
  { dia: 'Sáb', total: 12 },
  { dia: 'Dom', total: 27 },
];

export const percentualEstrelaPorPalavra = [
  { palavra: 'chave', pct: 92 },
  { palavra: 'chá', pct: 88 },
  { palavra: 'peixe', pct: 76 },
  { palavra: 'bruxa', pct: 71 },
  { palavra: 'mochila', pct: 64 },
  { palavra: 'cachorro', pct: 58 },
  { palavra: 'abacaxi', pct: 45 },
];

export const rascunhoEvolucaoClinica = `Liam apresenta boa adesão ao plano terapêutico (9 dias consecutivos, 214 produções registradas). Observa-se evolução consistente na articulação do fonema /ʃ/ em posição inicial, com generalização ainda em consolidação na posição medial. Recomenda-se manter o foco em palavras com /ʃ/ medial (ex.: "mochila", "machucado") e iniciar introdução gradual de frases curtas. Sem intercorrências relatadas pelos responsáveis.`;
