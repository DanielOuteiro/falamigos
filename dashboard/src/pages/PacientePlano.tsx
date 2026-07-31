import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Sparkles, X } from 'lucide-react';
import { fonemasDisponiveis, niveis, pacientes, palavrasSeed, posicoes, sotaques } from '@/mock';
import { Avatar } from '@/components/Avatar';

export function PacientePlano() {
  const { id } = useParams();
  const navigate = useNavigate();
  const paciente = useMemo(() => pacientes.find((p) => p.id === id), [id]);

  const [fonema, setFonema] = useState('sh');
  const [posicao, setPosicao] = useState('Inicial');
  const [nivel, setNivel] = useState('Palavra');
  const [sotaque, setSotaque] = useState(paciente?.sotaque ?? sotaques[0]);
  const [tema, setTema] = useState('Fundo do Mar');
  const [chips, setChips] = useState<{ id: string; palavra: string; emoji: string }[] | null>(null);
  const [gerando, setGerando] = useState(false);

  if (!paciente) {
    return (
      <div className="p-8">
        <p>Paciente não encontrado.</p>
      </div>
    );
  }

  function gerarLista() {
    setGerando(true);
    setTimeout(() => {
      setChips(palavrasSeed);
      setGerando(false);
    }, 650);
  }

  function removerChip(id: string) {
    setChips((atual) => (atual ? atual.filter((c) => c.id !== id) : atual));
  }

  return (
    <div className="p-8">
      <button
        onClick={() => navigate('/pacientes')}
        className="mb-5 flex items-center gap-2 text-sm font-semibold text-tinta/55 hover:text-tinta"
      >
        <ArrowLeft size={16} /> Pacientes
      </button>

      <div className="flex items-center gap-4">
        <Avatar iniciais={paciente.iniciais} cor={paciente.corAvatar} size={58} />
        <div>
          <h1 className="font-[family-name:var(--font-titulo)] text-2xl font-extrabold text-tinta">{paciente.nome}</h1>
          <p className="text-sm text-tinta/55">{paciente.idade} anos · plano de terapia do fonema</p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <section className="rounded-3xl border border-black/5 bg-white p-6">
            <p className="mb-3 font-[family-name:var(--font-titulo)] font-bold text-tinta">Fonema-alvo</p>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
              {fonemasDisponiveis.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFonema(f.id)}
                  className={`rounded-2xl border py-3 text-center transition-colors ${
                    fonema === f.id ? 'border-turquesa bg-turquesa/10' : 'border-black/5 hover:bg-slate-50'
                  }`}
                >
                  <p className="font-[family-name:var(--font-titulo)] text-xl font-bold text-fundo">{f.simbolo}</p>
                  <p className="mt-0.5 text-[10px] font-semibold text-tinta/50">{f.nome}</p>
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-black/5 bg-white p-6">
            <p className="mb-3 font-[family-name:var(--font-titulo)] font-bold text-tinta">Posição</p>
            <div className="flex gap-2">
              {posicoes.map((p) => (
                <button
                  key={p}
                  onClick={() => setPosicao(p)}
                  className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
                    posicao === p ? 'bg-fundo text-white' : 'bg-slate-100 text-tinta/60 hover:bg-slate-200'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            <p className="mb-3 mt-6 font-[family-name:var(--font-titulo)] font-bold text-tinta">Nível</p>
            <div className="flex gap-2">
              {niveis.map((n) => (
                <button
                  key={n}
                  onClick={() => setNivel(n)}
                  className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
                    nivel === n ? 'bg-fundo text-white' : 'bg-slate-100 text-tinta/60 hover:bg-slate-200'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-black/5 bg-white p-6">
            <p className="mb-1 font-[family-name:var(--font-titulo)] font-bold text-tinta">Sotaque do áudio-modelo</p>
            <p className="mb-3 text-xs text-tinta/50">O áudio-modelo muda com a região selecionada.</p>
            <div className="flex flex-wrap gap-2">
              {sotaques.map((s) => (
                <button
                  key={s}
                  onClick={() => setSotaque(s)}
                  className={`rounded-full border px-4 py-2 text-xs font-semibold transition-colors ${
                    sotaque === s ? 'border-turquesa bg-turquesa/10 text-fundo' : 'border-black/10 text-tinta/55 hover:bg-slate-50'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-4">
          <section className="rounded-3xl border border-black/5 bg-white p-6">
            <p className="mb-1 flex items-center gap-2 font-[family-name:var(--font-titulo)] font-bold text-tinta">
              <Sparkles size={16} className="text-estrela-escura" /> Gerador de lista
            </p>
            <p className="mb-3 text-xs text-tinta/50">Escolha um tema e gere as palavras de treino.</p>
            <input
              value={tema}
              onChange={(e) => setTema(e.target.value)}
              placeholder="Tema, ex: Fundo do Mar"
              className="w-full rounded-xl border border-black/10 px-3 py-2.5 text-sm outline-none focus:border-turquesa"
            />
            <button
              onClick={gerarLista}
              disabled={gerando}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-fundo py-2.5 text-sm font-semibold text-white hover:bg-fundo-claro disabled:opacity-60"
            >
              {gerando ? 'Gerando…' : 'Gerar lista'}
            </button>

            {chips && (
              <div className="mt-4 flex flex-wrap gap-2">
                {chips.map((c) => (
                  <span
                    key={c.id}
                    className="flex items-center gap-1.5 rounded-full bg-areia/60 px-3 py-1.5 text-xs font-semibold text-tinta"
                  >
                    {c.emoji} {c.palavra}
                    <button onClick={() => removerChip(c.id)} className="text-tinta/40 hover:text-tinta">
                      <X size={12} />
                    </button>
                  </span>
                ))}
                {chips.length === 0 && <p className="text-xs text-tinta/40">Nenhuma palavra na lista.</p>}
              </div>
            )}
          </section>

          <button className="w-full rounded-2xl bg-turquesa py-3 text-sm font-bold text-white hover:bg-turquesa/90">
            Salvar plano
          </button>
        </aside>
      </div>
    </div>
  );
}
