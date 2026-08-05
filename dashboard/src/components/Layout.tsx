import type { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { Users, Headphones, FileBarChart2, Waves } from 'lucide-react';

const navItems = [
  { to: '/pacientes', label: 'Pacientes', icon: Users },
  { to: '/fila', label: 'Fila de Escuta', icon: Headphones },
  { to: '/relatorios/liam', label: 'Relatórios', icon: FileBarChart2 },
];

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen w-full bg-[#f4f8fa]">
      <aside className="flex w-64 shrink-0 flex-col bg-fundo text-white">
        <div className="flex items-center gap-2 px-6 py-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-turquesa">
            <Waves size={18} className="text-white" />
          </div>
          <div>
            <p className="font-[family-name:var(--font-titulo)] text-lg font-extrabold leading-none">Falamigos</p>
            <p className="text-[11px] font-semibold text-turquesa-claro">painel da fono</p>
          </div>
        </div>

        <nav className="mt-4 flex flex-col gap-1 px-3">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                  isActive ? 'bg-turquesa text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <main className="flex-1 overflow-y-auto">{children}</main>
        <footer className="border-t border-black/5 bg-white px-8 py-3 text-center text-xs font-semibold text-tinta/50">
          Complemento ao tratamento — a conduta clínica é sempre da fono.
        </footer>
      </div>
    </div>
  );
}
