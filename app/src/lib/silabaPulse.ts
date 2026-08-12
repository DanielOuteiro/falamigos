/**
 * Destaca sílabas 0…n-1 uma vez; no fim limpa (não faz loop).
 */
export function pulseSilabasOnce(
  count: number,
  setIndex: (i: number | null) => void,
  stepMs = 380
): { cancel: () => void } {
  if (count <= 0) return { cancel: () => {} };

  let i = 0;
  let cleared = false;
  setIndex(0);

  const finish = () => {
    if (cleared) return;
    cleared = true;
    setIndex(null);
  };

  if (count === 1) {
    return {
      cancel: () => finish(),
    };
  }

  const id = setInterval(() => {
    i += 1;
    if (i >= count) {
      clearInterval(id);
      finish();
      return;
    }
    setIndex(i);
  }, stepMs);

  return {
    cancel: () => {
      clearInterval(id);
      finish();
    },
  };
}
