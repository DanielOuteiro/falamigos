import { colors } from '@/theme/colors';

/** Tokens do fluxo no mundo escolhido (após Pico). */
export const worldBrand = {
  tinta: colors.tinta,
  accent: colors.coral,
  accentEscuro: colors.coralEscuro,
  balão: '#FFFFFF',
  balãoSombra: '#0A2231',
  tag: '#0A5F75',
  hint: 'rgba(255,232,194,0.78)',
  cta: colors.coral,
  ctaTexto: '#FFFFFF',
} as const;

/** Altura reservada ao personagem do mundo no topo (vídeo 832×592). */
export const WORLD_FLOW_TOP = 160;

/** Início do conteúdo de instruções — um pouco acima da zona do personagem. */
export const WORLD_INSTRUCTION_TOP = WORLD_FLOW_TOP - 16;
