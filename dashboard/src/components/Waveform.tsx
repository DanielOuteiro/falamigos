import { useMemo } from 'react';

export function Waveform({ seed = 1, ativo = false }: { seed?: number; ativo?: boolean }) {
  const barras = useMemo(() => {
    let x = seed * 9301 + 49297;
    return Array.from({ length: 28 }, () => {
      x = (x * 9301 + 49297) % 233280;
      return 0.2 + (x / 233280) * 0.8;
    });
  }, [seed]);

  return (
    <div className="flex h-8 items-center gap-[2px]">
      {barras.map((h, i) => (
        <div
          key={i}
          className={`w-[3px] rounded-full ${ativo ? 'bg-turquesa' : 'bg-slate-300'}`}
          style={{ height: `${h * 100}%` }}
        />
      ))}
    </div>
  );
}
