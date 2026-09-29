export type Friend = {
  id: string;
  nome: string;
  universoId: string;
  artigo: 'o' | 'a';
  /** require() do PNG */
  arte: number;
};

export const chicoFundoDoMar: Friend = {
  id: 'chico',
  nome: 'Chico',
  universoId: 'fundo_do_mar',
  artigo: 'o',
  arte: require('../../assets/mundos/chico.png'),
};

export const friendsFundoDoMar: Friend[] = [
  { id: 'xuxa', nome: 'Xuxa', universoId: 'fundo_do_mar', artigo: 'a', arte: require('../../assets/mundos/chico-friends/chico-friend-xuxa.png') },
  { id: 'chuca', nome: 'Chuca', universoId: 'fundo_do_mar', artigo: 'a', arte: require('../../assets/mundos/chico-friends/chico-friend-chuca.png') },
  { id: 'xande', nome: 'Xande', universoId: 'fundo_do_mar', artigo: 'o', arte: require('../../assets/mundos/chico-friends/chico-friend-xande.png') },
  { id: 'ficha', nome: 'Ficha', universoId: 'fundo_do_mar', artigo: 'a', arte: require('../../assets/mundos/chico-friends/chico-friend-ficha.png') },
  { id: 'tacho', nome: 'Tacho', universoId: 'fundo_do_mar', artigo: 'o', arte: require('../../assets/mundos/chico-friends/chico-friend-tacho.png') },
  { id: 'peixoto', nome: 'Peixoto', universoId: 'fundo_do_mar', artigo: 'o', arte: require('../../assets/mundos/chico-friends/chico-friend-peixoto.png') },
  { id: 'michela', nome: 'Michela', universoId: 'fundo_do_mar', artigo: 'a', arte: require('../../assets/mundos/chico-friends/chico-friend-michela.png') },
  { id: 'chama', nome: 'Chama', universoId: 'fundo_do_mar', artigo: 'a', arte: require('../../assets/mundos/chico-friends/chico-friend-chama.png') },
  { id: 'bolacha', nome: 'Bolacha', universoId: 'fundo_do_mar', artigo: 'a', arte: require('../../assets/mundos/chico-friends/chico-friend-bolacha.png') },
];

/** Spot 0 = Xuxa (1ª sessão), spots 1–8 = remaining friends. */
export function amigoDaSessao(sessionNum: number): Friend {
  return friendsFundoDoMar[Math.max(0, Math.min(sessionNum, friendsFundoDoMar.length) - 1)] ?? friendsFundoDoMar[0];
}
