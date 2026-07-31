export type Universo = {
  id: string;
  nome: string;
  emoji: string;
  corPrincipal: string;
  ativo: boolean;
};

export const universos: Universo[] = [
  { id: 'fundo_do_mar', nome: 'Fundo do Mar', emoji: '🐙', corPrincipal: '#26C6DA', ativo: true },
  { id: 'espaco', nome: 'Espaço', emoji: '🚀', corPrincipal: '#6C63FF', ativo: false },
  { id: 'dinossauros', nome: 'Dinossauros', emoji: '🦕', corPrincipal: '#7CB342', ativo: false },
  { id: 'reino_magico', nome: 'Reino Mágico', emoji: '🏰', corPrincipal: '#BA68C8', ativo: false },
  { id: 'futebol', nome: 'Futebol', emoji: '⚽', corPrincipal: '#43A047', ativo: false },
  { id: 'safari', nome: 'Safári', emoji: '🦁', corPrincipal: '#FB8C00', ativo: false },
];
