import { useState } from 'react';
import { Check, Copy, X } from 'lucide-react';

function gerarCodigo(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let sufixo = '';
  for (let i = 0; i < 4; i++) {
    sufixo += chars[Math.floor(Math.random() * chars.length)];
  }
  return `MAR-${sufixo}`;
}

export function ModalConvite({ nome, onClose }: { nome: string; onClose: () => void }) {
  const [codigo] = useState(gerarCodigo);
  const [copiado, setCopiado] = useState(false);

  function copiar() {
    navigator.clipboard?.writeText(codigo).catch(() => {});
    setCopiado(true);
    setTimeout(() => setCopiado(false), 1800);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div
        className="w-full max-w-sm rounded-3xl bg-white p-7 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="font-[family-name:var(--font-titulo)] text-lg font-bold text-tinta">Código de convite</p>
            <p className="mt-1 text-sm text-tinta/60">Compartilhe com a família de {nome} para vincular o app.</p>
          </div>
          <button onClick={onClose} className="rounded-full p-1 text-tinta/40 hover:bg-slate-100">
            <X size={18} />
          </button>
        </div>

        <div className="mt-6 flex items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-turquesa/40 bg-turquesa/5 py-6">
          <span className="font-[family-name:var(--font-titulo)] text-3xl font-extrabold tracking-widest text-fundo">
            {codigo}
          </span>
        </div>

        <button
          onClick={copiar}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-fundo py-3 font-semibold text-white transition-colors hover:bg-fundo-claro"
        >
          {copiado ? <Check size={16} /> : <Copy size={16} />}
          {copiado ? 'Copiado!' : 'Copiar código'}
        </button>

        <p className="mt-4 text-center text-xs text-tinta/45">
          Válido por 7 dias. O código conecta o app da criança a este perfil clínico.
        </p>
      </div>
    </div>
  );
}
