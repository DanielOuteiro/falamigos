import type { Metadata } from "next";
import { LegalPage } from "../../components/LegalPage";

export const metadata: Metadata = {
  title: "Política de Privacidade — Falamigos",
  description:
    "Como o Falamigos trata os dados da criança: gravações de voz, nome e idade, guardados só no aparelho, sem servidores nem partilha com terceiros.",
  alternates: { canonical: "/privacidade" },
};

export default function Privacidade() {
  return (
    <LegalPage titulo="Política de Privacidade" atualizadoEm="12 de agosto de 2026">
      <p>
        O Falamigos é um app de apoio a exercícios de fala para crianças de 3 a 8
        anos, feito para ser usado com o acompanhamento de um responsável e, quando
        aplicável, de uma fonoaudióloga. Esta política explica, em linguagem simples,
        que dados o app usa e como eles são tratados.
      </p>

      <h2>1. Resumo em uma frase</h2>
      <p>
        <strong>O Falamigos não tem servidor.</strong> Tudo o que a criança grava, diz
        ou preenche fica guardado apenas no aparelho onde o app está instalado — nada é
        enviado, partilhado ou vendido a terceiros.
      </p>

      <h2>2. Que dados o app recolhe</h2>
      <ul>
        <li>
          <strong>Nome e idade</strong>, indicados no início (onboarding), para
          personalizar as atividades.
        </li>
        <li>
          <strong>Gravações de voz</strong>, feitas durante os exercícios de fala,
          usadas para a criança se ouvir e comparar a sua evolução ao longo do tempo.
        </li>
        <li>
          <strong>Progresso do jogo</strong> (sequência de dias, palavras já
          praticadas, criaturas desbloqueadas), para manter a experiência entre
          sessões.
        </li>
      </ul>
      <p>
        Não pedimos e-mail, telefone, localização, contactos, fotos ou qualquer dado
        que identifique a criança fora do aparelho.
      </p>

      <h2>3. Onde esses dados ficam guardados</h2>
      <p>
        Nome, idade, progresso e gravações ficam guardados exclusivamente no
        armazenamento local do telemóvel ou tablet (não em nenhum servidor nosso ou de
        terceiros). O Falamigos funciona sem ligação à internet depois de instalado.
        Não usamos analytics, publicidade ou SDKs de rastreamento de terceiros.
      </p>

      <h2>4. Microfone e outras permissões</h2>
      <p>
        O microfone é usado apenas durante os exercícios, para a criança gravar a
        própria voz e ouvi-la de volta na hora — nunca é enviado para fora do
        aparelho. O acesso a sensores de movimento serve só para um efeito visual
        suave de profundidade na tela e não recolhe nem guarda nenhuma informação.
      </p>

      <h2>5. Área de responsável ("Modo Adulto")</h2>
      <p>
        O app tem uma área protegida por um código simples, pensada para o
        responsável acompanhar as gravações e o progresso da criança, e para apagar
        todos os dados guardados no aparelho sempre que quiser, de forma definitiva e
        imediata.
      </p>

      <h2>6. Crianças e privacidade</h2>
      <p>
        Sabemos que este app é usado por crianças. Por isso desenhámo-lo para não
        depender de rede, conta, publicidade ou qualquer recolha de dados além do que
        é estritamente necessário para os exercícios funcionarem no próprio aparelho.
        Não existe partilha de dados com terceiros, nem para fins de marketing, nem de
        qualquer outra natureza.
      </p>

      <h2>7. Apagar os dados</h2>
      <p>
        Pode apagar todos os dados guardados a qualquer momento, de duas formas: pelo
        botão "Recomeçar do zero" dentro do Modo Adulto, ou desinstalando o app do
        aparelho (o que remove tudo o que foi guardado localmente).
      </p>

      <h2>8. Alterações a esta política</h2>
      <p>
        Se esta política mudar de forma relevante, a data no topo desta página será
        atualizada e, sempre que fizer sentido, avisaremos dentro do próprio app.
      </p>

      <h2>9. Contacto</h2>
      <p>
        Dúvidas sobre privacidade ou sobre os dados da criança:{" "}
        <a href="mailto:ola@falamigos.com.br">ola@falamigos.com.br</a>.
      </p>
    </LegalPage>
  );
}
