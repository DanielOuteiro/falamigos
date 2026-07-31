const CORES = ['bg-slate-100', 'bg-turquesa/25', 'bg-turquesa/50', 'bg-turquesa/75', 'bg-turquesa'];

export function Heatmap30({ valores }: { valores: number[] }) {
  return (
    <div className="grid grid-cols-10 gap-1.5 sm:grid-cols-[repeat(15,minmax(0,1fr))]">
      {valores.map((v, i) => (
        <div
          key={i}
          className={`aspect-square rounded-[5px] ${CORES[v] ?? CORES[0]}`}
          title={`Dia ${i + 1}: nível ${v}`}
        />
      ))}
    </div>
  );
}
