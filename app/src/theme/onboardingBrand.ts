/** Paleta do fluxo liminar (antes do mundo) — Pico. */
export const onboardingBrand = {
  tinta: '#2A3350',
  roxo: '#9B6BFF',
  roxoEscuro: '#7A4FE0',
  campo: '#FFFFFF',
  campoBorda: 'rgba(155,107,255,0.35)',
  balão: '#FFFFFF',
  fundo: '#FFFFFF',
  idadeAtiva: '#9B6BFF',
  idadeInativa: '#6ED3C0',
} as const;

/** Altura reservada ao Pico no topo (partilhada entre ecrãs). */
export const PICO_FLOW_TOP = 198;

/** Início do conteúdo de instruções — um pouco acima da zona do Pico. */
export const PICO_INSTRUCTION_TOP = PICO_FLOW_TOP - 20;
