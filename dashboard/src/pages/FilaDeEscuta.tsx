import { useState } from 'react';
import { Clock, Flag, Play, RotateCcw, Send, Star } from 'lucide-react';
import { filaDeEscuta, type GravacaoFila } from '@/mock';
import { Avatar } from '@/components/Avatar';
import { Waveform } from '@/components/Waveform';

export function FilaDeEscuta() {
  const [itens, setItens] = useState<GravacaoFila[]>(filaDeEscuta);
  const [tocando, setTocando] = useState<string | null>(null);
  const [audioPais, setAudioPais] = useState('');

  function avaliar(id: string, avaliacao: GravacaoFila['avaliacao']) {
    setItens((atual) => atual.map((g) => (g.id === id ? { ...g, avaliacao: g.avaliacao === avaliacao ? null : avaliacao } : g)));
  }

  function tocar(id: string) {
    setTocando(id);
    setTimeout(() => setTocando((atual) => (atual === id ? null : atual)), 1400);
  }

  const pendentes = itens.filter((i) => !i.avaliacao).length;

  return (
    <div className="p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-[family-name:var(--font-titulo)] text-2xl font-extrabold text-tinta">Fila de Escuta</h1>
          <p className="mt-1 text-sm text-tinta/55">{pendentes} gravações aguardando avaliação</p>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-estrela/15 px-4 py-2 text-sm font-bold text-estrela-escura">
          <Clock size={16} />
          2 min para ouvir a semana do Liam
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {itens.map((g) => (
          <div
            key={g.id}
            className={`flex flex-wrap items-center gap-4 rounded-2xl border bg-white p-4 transition-colors ${
              g.avaliacao ? 'border-black/5 opacity-60' : 'border-black/5'
            }`}
          >
            <Avatar iniciais={g.pacienteIniciais} cor={g.corAvatar} size={44} />

            <div className="w-36 shrink-0">
              <p className="font-[family-name:var(--font-titulo)] font-bold text-tinta">{g.pacienteNome}</p>
              <p className="text-xs text-tinta/50">{g.data}</p>
            </div>

            <button
              onClick={() => tocar(g.id)}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-fundo text-white hover:bg-fundo-claro"
            >
              <Play size={16} />
            </button>

            <div className="flex-1 min-w-[140px]">
              <Waveform seed={g.id.charCodeAt(1)} ativo={tocando === g.id} />
            </div>

            <span className="rounded-full bg-areia/60 px-3 py-1.5 text-xs font-bold text-tinta">"{g.palavra}"</span>
            <span className="text-xs text-tinta/40">{g.duracaoSeg}s</span>

            <div className="ml-auto flex items-center gap-2">
              <button
                onClick={() => avaliar(g.id, 'dominou')}
                title="Dominou"
                className={`flex h-9 w-9 items-center justify-center rounded-full border transition-colors ${
                  g.avaliacao === 'dominou' ? 'border-estrela bg-estrela/20' : 'border-black/10 hover:bg-slate-50'
                }`}
              >
                <Star size={16} className={g.avaliacao === 'dominou' ? 'text-estrela-escura' : 'text-tinta/40'} />
              </button>
              <button
                onClick={() => avaliar(g.id, 'repetir')}
                title="Repetir"
                className={`flex h-9 w-9 items-center justify-center rounded-full border transition-colors ${
                  g.avaliacao === 'repetir' ? 'border-turquesa bg-turquesa/15' : 'border-black/10 hover:bg-slate-50'
                }`}
              >
                <RotateCcw size={16} className={g.avaliacao === 'repetir' ? 'text-fundo' : 'text-tinta/40'} />
              </button>
              <button
                onClick={() => avaliar(g.id, 'ver')}
                title="Ver na sessão"
                className={`flex h-9 w-9 items-center justify-center rounded-full border transition-colors ${
                  g.avaliacao === 'ver' ? 'border-coral bg-coral/15' : 'border-black/10 hover:bg-slate-50'
                }`}
              >
                <Flag size={16} className={g.avaliacao === 'ver' ? 'text-coral' : 'text-tinta/40'} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-3xl border border-black/5 bg-white p-6">
        <p className="font-[family-name:var(--font-titulo)] font-bold text-tinta">Áudio para os pais</p>
        <p className="mt-1 text-xs text-tinta/50">Grave uma mensagem rápida resumindo a semana (mock, não envia de verdade).</p>
        <textarea
          value={audioPais}
          onChange={(e) => setAudioPais(e.target.value)}
          rows={3}
          placeholder="Ex: Oi! O Liam teve uma semana ótima, já fala 'chave' e 'peixe' com bastante clareza…"
          className="mt-3 w-full resize-none rounded-xl border border-black/10 p-3 text-sm outline-none focus:border-turquesa"
        />
        <button className="mt-3 flex items-center gap-2 rounded-xl bg-turquesa px-4 py-2.5 text-sm font-semibold text-white hover:bg-turquesa/90">
          <Send size={15} />
          Enviar aos responsáveis
        </button>
      </div>
    </div>
  );
}
