const DIAS = ['S', 'T', 'Q', 'Q', 'S', 'S', 'D'];

export function MiniHeatmap({ dias }: { dias: boolean[] }) {
  return (
    <div className="flex gap-1">
      {dias.map((ativo, i) => (
        <div key={i} className="flex flex-col items-center gap-1">
          <div
            className={`h-4 w-4 rounded-[5px] ${ativo ? 'bg-turquesa' : 'bg-slate-200'}`}
            title={ativo ? 'Praticou' : 'Não praticou'}
          />
          <span className="text-[9px] font-semibold text-tinta/35">{DIAS[i]}</span>
        </div>
      ))}
    </div>
  );
}
