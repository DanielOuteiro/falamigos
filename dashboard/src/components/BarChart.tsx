export function BarChart({ data }: { data: { rotulo: string; valor: number }[] }) {
  const max = Math.max(...data.map((d) => d.valor), 1);
  return (
    <div className="flex h-40 gap-3">
      {data.map((d) => (
        <div key={d.rotulo} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
          <div className="flex w-full flex-1 items-end">
            <div
              className="w-full rounded-t-lg bg-gradient-to-t from-fundo to-turquesa"
              style={{ height: `${Math.max(4, (d.valor / max) * 100)}%` }}
            />
          </div>
          <span className="text-[11px] font-semibold text-tinta/50">{d.rotulo}</span>
        </div>
      ))}
    </div>
  );
}
