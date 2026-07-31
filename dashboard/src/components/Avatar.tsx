export function Avatar({ iniciais, cor, size = 44 }: { iniciais: string; cor: string; size?: number }) {
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full font-[family-name:var(--font-titulo)] font-bold text-white"
      style={{ width: size, height: size, backgroundColor: cor, fontSize: size * 0.36 }}
    >
      {iniciais}
    </div>
  );
}
