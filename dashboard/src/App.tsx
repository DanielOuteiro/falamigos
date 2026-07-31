import { Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Pacientes } from '@/pages/Pacientes';
import { PacientePlano } from '@/pages/PacientePlano';
import { FilaDeEscuta } from '@/pages/FilaDeEscuta';
import { Relatorio } from '@/pages/Relatorio';

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/pacientes" replace />} />
        <Route path="/pacientes" element={<Pacientes />} />
        <Route path="/pacientes/:id" element={<PacientePlano />} />
        <Route path="/fila" element={<FilaDeEscuta />} />
        <Route path="/relatorios/:id" element={<Relatorio />} />
        <Route path="*" element={<Navigate to="/pacientes" replace />} />
      </Routes>
    </Layout>
  );
}
