import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flame, Mic2, Plus, UserPlus } from 'lucide-react';
import { pacientes } from '@/mock';
import { Avatar } from '@/components/Avatar';
import { MiniHeatmap } from '@/components/MiniHeatmap';
import { ModalConvite } from '@/components/ModalConvite';

export function Pacientes() {
  const navigate = useNavigate();
  const [convitePara, setConvitePara] = useState<string | null>(null);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-titulo)] text-2xl font-extrabold text-tinta">Pacientes</h1>
          <p className="mt-1 text-sm text-tinta/55">{pacientes.length} crianças em acompanhamento</p>
        </div>
        <button className="flex items-center gap-2 rounded-xl bg-fundo px-4 py-2.5 text-sm font-semibold text-white hover:bg-fundo-claro">
          <UserPlus size={16} />
          Novo paciente
        </button>
      </div>

      <div className="mt-7 grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {pacientes.map((p) => (
          <div key={p.id} className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
            <button className="flex w-full items-center gap-3 text-left" onClick={() => navigate(`/pacientes/${p.id}`)}>
              <Avatar iniciais={p.iniciais} cor={p.corAvatar} size={52} />
              <div className="min-w-0 flex-1">
                <p className="truncate font-[family-name:var(--font-titulo)] font-bold text-tinta">{p.nome}</p>
                <p className="truncate text-xs text-tinta/55">{p.idade} anos · {p.fonemaAlvo}</p>
              </div>
              <div className="flex items-center gap-1 rounded-full bg-estrela/20 px-2.5 py-1 text-xs font-bold text-estrela-escura">
                <Flame size={12} />
                {p.streak}
              </div>
            </button>

            <div className="mt-4 flex items-center justify-between border-t border-black/5 pt-4">
              <div>
                <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-tinta/40">Adesão da semana</p>
                <MiniHeatmap dias={p.adesaoSemana} />
              </div>
              <div className="text-right">
                <p className="flex items-center justify-end gap-1 text-xs font-semibold text-tinta/50">
                  <Mic2 size={12} /> {p.producoesTotais}
                </p>
                <p className="text-[10px] text-tinta/35">produções</p>
              </div>
            </div>

            <button
              onClick={() => setConvitePara(p.nome)}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-turquesa/30 py-2.5 text-xs font-semibold text-fundo hover:bg-turquesa/5"
            >
              <Plus size={14} />
              Gerar código de convite
            </button>
          </div>
        ))}
      </div>

      {convitePara && <ModalConvite nome={convitePara} onClose={() => setConvitePara(null)} />}
    </div>
  );
}
