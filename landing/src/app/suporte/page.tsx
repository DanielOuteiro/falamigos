import type { Metadata } from "next";
import { LegalPage } from "../../components/LegalPage";

export const metadata: Metadata = {
  title: "Suporte — Falamigos",
  description: "Precisa de ajuda com o Falamigos? Fale com a gente.",
  alternates: { canonical: "/suporte" },
};

export default function Suporte() {
  return (
    <LegalPage titulo="Suporte" atualizadoEm="12 de agosto de 2026">
      <p>
        Precisa de ajuda, encontrou um problema ou quer sugerir alguma coisa? Escreva
        para{" "}
        <a href="mailto:ola@falamigos.com.br?subject=Suporte%20Falamigos">
          ola@falamigos.com.br
        </a>{" "}
        — respondemos o mais rápido possível.
      </p>

      <h2>Perguntas frequentes</h2>

      <p>
        <strong>O microfone não funciona.</strong> Verifique se a permissão de
        microfone está ativa nas configurações do telemóvel para o app Falamigos. Se
        tiver negado por engano na primeira vez, pode reativar em Configurações →
        Falamigos → Microfone.
      </p>

      <p>
        <strong>Quero apagar os dados guardados.</strong> Abra o Modo Adulto dentro do
        app e toque em &quot;Recomeçar do zero&quot;. Isso apaga o perfil, o progresso
        e todas as gravações guardadas naquele aparelho, de forma imediata e
        definitiva.
      </p>

      <p>
        <strong>O app funciona sem internet?</strong> Sim. Depois de instalado, o
        Falamigos funciona 100% offline — nenhum exercício depende de ligação à rede.
      </p>

      <p>
        <strong>Onde ficam guardadas as gravações da minha criança?</strong> Apenas no
        próprio aparelho, nunca em nenhum servidor. Veja mais detalhes na nossa{" "}
        <a href="/privacidade">Política de Privacidade</a>.
      </p>

      <h2>Ainda precisa de ajuda?</h2>
      <p>
        Escreva para{" "}
        <a href="mailto:ola@falamigos.com.br?subject=Suporte%20Falamigos">
          ola@falamigos.com.br
        </a>{" "}
        com o modelo do telemóvel e uma descrição do que aconteceu — isso ajuda a
        resolver mais rápido.
      </p>
    </LegalPage>
  );
}
