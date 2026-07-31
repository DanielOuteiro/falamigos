import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CheckCircle2, Download, PlayCircle } from 'lucide-react';
import {
  heatmap30dias,
  pacientes,
  percentualEstrelaPorPalavra,
  producoesPorDia,
  rascunhoEvolucaoClinica,
} from '@/mock';
import { Avatar } from '@/components/Avatar';
import { Heatmap30 } from '@/components/Heatmap30';
import { BarChart } from '@/components/BarChart';

export function Relatorio() {
  const { id } = useParams();
  const paciente = useMemo(() => pacientes.find((p) => p.id === id) ?? pacientes[0], [id]);
  const [texto, setTexto] = useState(rascunhoEvolucaoClinica);
  const [assinado, setAssinado] = useState(false);

  return (
    <div className="p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar iniciais={paciente.iniciais} cor={paciente.corAvatar} size={54} />
          <div>
            <h1 className="font-[family-name:var(--font-titulo)] text-2xl font-extrabold text-tinta">
              Relatório de {paciente.nome.split(' ')[0]}
            </h1>
            <p className="text-sm text-tinta/55">Últimos 30 dias · {paciente.fonemaAlvo}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 rounded-xl border border-black/10 px-4 py-2.5 text-sm font-semibold text-tinta hover:bg-slate-50">
            <PlayCircle size={16} />
            Ouvir antes / depois
          </button>
          <button className="flex items-center gap-2 rounded-xl bg-fundo px-4 py-2.5 text-sm font-semibold text-white hover:bg-fundo-claro">
            <Download size={16} />
            Exportar PDF
          </button>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <section className="rounded-3xl border border-black/5 bg-white p-6 xl:col-span-2">
          <p className="mb-4 font-[family-name:var(--font-titulo)] font-bold text-tinta">Frequência de prática — 30 dias</p>
          <Heatmap30 valores={heatmap30dias} />
          <div className="mt-3 flex items-center gap-2 text-[11px] text-tinta/40">
            <span>Menos</span>
            <div className="h-3 w-3 rounded bg-slate-100" />
            <div className="h-3 w-3 rounded bg-turquesa/25" />
            <div className="h-3 w-3 rounded bg-turquesa/50" />
            <div className="h-3 w-3 rounded bg-turquesa/75" />
            <div className="h-3 w-3 rounded bg-turquesa" />
            <span>Mais</span>
          </div>
        </section>

        <section className="rounded-3xl border border-black/5 bg-white p-6">
          <p className="mb-1 font-[family-name:var(--font-titulo)] font-bold text-tinta">{paciente.producoesTotais}</p>
          <p className="text-xs text-tinta/50">produções totais registradas</p>
          <div className="mt-4 border-t border-black/5 pt-4">
            <p className="font-[family-name:var(--font-titulo)] text-2xl font-bold text-turquesa">{paciente.streak} dias</p>
            <p className="text-xs text-tinta/50">sequência atual</p>
          </div>
        </section>

        <section className="rounded-3xl border border-black/5 bg-white p-6 xl:col-span-2">
          <p className="mb-4 font-[family-name:var(--font-titulo)] font-bold text-tinta">Produções por dia (última semana)</p>
          <BarChart data={producoesPorDia.map((d) => ({ rotulo: d.dia, valor: d.total }))} />
        </section>

        <section className="rounded-3xl border border-black/5 bg-white p-6">
          <p className="mb-4 font-[family-name:var(--font-titulo)] font-bold text-tinta">% ⭐ por palavra</p>
          <div className="space-y-3">
            {percentualEstrelaPorPalavra.map((p) => (
              <div key={p.palavra}>
                <div className="mb-1 flex justify-between text-xs font-semibold text-tinta/60">
                  <span>{p.palavra}</span>
                  <span>{p.pct}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-estrela" style={{ width: `${p.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-black/5 bg-white p-6 xl:col-span-3">
          <p className="font-[family-name:var(--font-titulo)] font-bold text-tinta">Rascunho de evolução clínica</p>
          <p className="mt-1 text-xs text-tinta/50">
            Texto sugerido automaticamente a partir dos dados de prática. Revise e edite antes de assinar.
          </p>
          <textarea
            value={texto}
            onChange={(e) => {
              setTexto(e.target.value);
              setAssinado(false);
            }}
            rows={5}
            className="mt-3 w-full resize-none rounded-xl border border-black/10 p-4 text-sm leading-relaxed outline-none focus:border-turquesa"
          />
          <button
            onClick={() => setAssinado(true)}
            className={`mt-3 flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-colors ${
              assinado ? 'bg-green-600 text-white' : 'bg-fundo text-white hover:bg-fundo-claro'
            }`}
          >
            <CheckCircle2 size={16} />
            {assinado ? 'Assinado' : 'Revisar e assinar'}
          </button>
        </section>
      </div>
    </div>
  );
}
