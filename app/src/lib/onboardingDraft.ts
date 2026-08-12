/**
 * Estado transitório do fluxo de onboarding (nome → idade → universo →
 * cápsula). Vive só em memória — é persistido em AsyncStorage no fim,
 * quando a cápsula do tempo é concluída (ver storage.ts).
 */
export const onboardingDraft: { nome: string; idade: number; universo: string } = {
  nome: '',
  idade: 5,
  universo: 'fundo_do_mar',
};
