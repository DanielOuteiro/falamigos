export type Universo = {
  id: string;
  nome: string;
  personagem: string;
  corPrincipal: string;
  corSuave: string;
  ativo: boolean;
  /** require() do PNG do personagem */
  arte: number;
};

export const universos: Universo[] = [
  {
    id: 'fundo_do_mar',
    nome: 'Fundo do Mar',
    personagem: 'Chico',
    corPrincipal: '#2F80ED',
    corSuave: '#E3F0FF',
    ativo: true,
    arte: require('../../assets/mundos/chico.png'),
  },
  {
    id: 'espaco',
    nome: 'Espaço',
    personagem: 'Cosmo',
    corPrincipal: '#5A3FD6',
    corSuave: '#ECE6FF',
    ativo: false,
    arte: require('../../assets/mundos/cosmo.png'),
  },
  {
    id: 'dinossauros',
    nome: 'Dinossauros',
    personagem: 'Dara',
    corPrincipal: '#12896F',
    corSuave: '#DEF5EC',
    ativo: false,
    arte: require('../../assets/mundos/dara.png'),
  },
  {
    id: 'reino_magico',
    nome: 'Reino Mágico',
    personagem: 'Brilha',
    corPrincipal: '#8A56D6',
    corSuave: '#F3EBFF',
    ativo: false,
    arte: require('../../assets/mundos/brilha.png'),
  },
  {
    id: 'futebol',
    nome: 'Futebol',
    personagem: 'Craque',
    corPrincipal: '#3E8E1E',
    corSuave: '#E8F6DD',
    ativo: false,
    arte: require('../../assets/mundos/craque.png'),
  },
  {
    id: 'safari',
    nome: 'Safári',
    personagem: 'Bárbara',
    corPrincipal: '#A87400',
    corSuave: '#FFF2CF',
    ativo: false,
    arte: require('../../assets/mundos/barbara.png'),
  },
];
