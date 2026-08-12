import type { Metadata } from "next";
import { LegalPage } from "../../components/LegalPage";

export const metadata: Metadata = {
  title: "Termos de Uso — Falamigos",
  description: "Condições de uso do app Falamigos.",
  alternates: { canonical: "/termos" },
};

export default function Termos() {
  return (
    <LegalPage titulo="Termos de Uso" atualizadoEm="12 de agosto de 2026">
      <p>
        Ao usar o Falamigos, um responsável legal aceita, em nome da criança, as
        condições abaixo. Se não concordar com algum ponto, pedimos que não utilize o
        app.
      </p>

      <h2>1. O que o Falamigos é (e o que não é)</h2>
      <p>
        O Falamigos é um complemento lúdico para a prática de exercícios de fala em
        casa. <strong>O Falamigos não substitui a avaliação, o diagnóstico ou o
        acompanhamento de uma fonoaudióloga.</strong> Qualquer decisão clínica deve
        ser sempre tomada por um profissional qualificado.
      </p>

      <h2>2. Uso adequado</h2>
      <ul>
        <li>O app é destinado a crianças de 3 a 8 anos, usado com um responsável por perto.</li>
        <li>
          A área "Modo Adulto" deve ser usada apenas por um responsável, para
          acompanhar o progresso e gerir os dados guardados no aparelho.
        </li>
        <li>Não é permitido usar o app para fins diferentes dos exercícios de fala a que se destina.</li>
      </ul>

      <h2>3. Conteúdo e propriedade</h2>
      <p>
        Todo o conteúdo do app (personagens, ilustrações, áudios, textos e design) é
        propriedade do Falamigos ou dos seus licenciadores, e não pode ser copiado,
        redistribuído ou usado comercialmente sem autorização.
      </p>

      <h2>4. Dados guardados no aparelho</h2>
      <p>
        Os dados criados no uso do app (nome, idade, progresso, gravações de voz)
        ficam guardados apenas no aparelho do utilizador, conforme descrito na nossa{" "}
        <a href="/privacidade">Política de Privacidade</a>. É responsabilidade do
        utilizador manter o aparelho seguro e fazer backup, se desejar preservar essas
        gravações.
      </p>

      <h2>5. Sem garantias</h2>
      <p>
        O app é fornecido "como está". Fazemos o possível para que funcione bem, mas
        não garantimos ausência total de erros, nem resultados terapêuticos
        específicos — o progresso de fala depende de múltiplos fatores e do
        acompanhamento profissional adequado.
      </p>

      <h2>6. Alterações</h2>
      <p>
        Podemos atualizar estes termos ao longo do tempo. A versão em vigor é sempre a
        publicada nesta página, com a respetiva data de atualização.
      </p>

      <h2>7. Lei aplicável</h2>
      <p>Estes termos são regidos pela legislação brasileira.</p>

      <h2>8. Contacto</h2>
      <p>
        Dúvidas sobre estes termos:{" "}
        <a href="mailto:ola@falamigos.com.br">ola@falamigos.com.br</a>.
      </p>
    </LegalPage>
  );
}
