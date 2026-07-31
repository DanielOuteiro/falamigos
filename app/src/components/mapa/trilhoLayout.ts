export type NoTrilho = { x: number; y: number };

/**
 * Gera 10 posições em serpentina para o trilho do mapa, dentro da área
 * disponível (width x height), imitando o zigue-zague do protótipo.
 */
export function gerarTrilho(count: number, width: number, height: number): NoTrilho[] {
  const margin = width * 0.22;
  const topPad = height * 0.12;
  const bottomPad = height * 0.06;
  const usableHeight = height - topPad - bottomPad;
  const step = usableHeight / (count - 1);

  return Array.from({ length: count }, (_, i) => {
    const y = height - bottomPad - i * step;
    const wave = Math.sin(i * 1.35) * (width / 2 - margin - 30);
    const x = width / 2 + wave;
    return { x, y };
  });
}
