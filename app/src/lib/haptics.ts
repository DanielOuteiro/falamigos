import * as Haptics from 'expo-haptics';

export const hapticLeve = () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
export const hapticMedio = () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
export const hapticForte = () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
export const hapticSucesso = () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
export const hapticSelecao = () => Haptics.selectionAsync();
