import type { FormSchema } from '../forms'

// Separação PF e PJ: o checklist de 15 minutos (aula Finanças, aula 2).
export const schema: FormSchema = {
  sections: [
    {
      title: 'Abrir e organizar a conta',
      intro: 'Faça no celular, em cerca de 15 minutos. Se ainda estiver formalizando, confirme o caminho com o contador.',
      fields: [
        { kind: 'check', id: 'conta_pj', label: 'Abri uma conta PJ (ou conta separada só do negócio)', hint: 'Nada de misturar com a conta pessoal.' },
        { kind: 'check', id: 'pix_cnpj', label: 'Cadastrei uma chave Pix no CNPJ', hint: 'E passei essa chave para quem me paga.' },
        { kind: 'check', id: 'cartao', label: 'Pedi um cartão da empresa', hint: 'Usado só para custos do negócio.' },
      ],
    },
    {
      title: 'Rotina do dinheiro',
      intro: 'A empresa paga você (pró-labore) e você vive do pró-labore, nunca do caixa da empresa.',
      fields: [
        { kind: 'check', id: 'custos_pj', label: 'Movi os custos do negócio para a conta PJ', hint: 'Tráfego, software, aluguel de sala, contador.' },
        { kind: 'check', id: 'dia_prolabore', label: 'Defini um dia fixo do mês para repassar o pró-labore', hint: 'Valor e dia fixos, sem tirar dinheiro quando precisa.' },
        { kind: 'check', id: 'comprovantes', label: 'Passei a guardar os comprovantes', hint: 'Notas, recibos e extratos em uma pasta só.' },
        { kind: 'check', id: 'contador', label: 'Conversei com o contador', hint: 'Impostos e lançamento do pró-labore variam: confirme com ele.' },
      ],
    },
    {
      title: 'Minhas anotações',
      intro: 'Registre o banco escolhido, a data combinada e o que ficou pendente.',
      fields: [
        {
          kind: 'textarea',
          id: 'notas',
          label: 'Anotações',
          placeholder: 'Ex.: Conta PJ aberta em 12/11. Pró-labore dia 5. Falta mudar o cartão do software de treino.',
          rows: 4,
        },
      ],
    },
  ],
  checkpoint: {
    slug: 'financas',
    position: 2,
    checked: (d) => (d.conta_pj === true ? ['f1'] : []),
  },
}
