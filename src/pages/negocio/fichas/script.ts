import type { FormSchema } from '../forms'

// Meu script de vendas: qualificação por mensagem + roteiro em 4 partes (aula Vendas, aula 1).
export const schema: FormSchema = {
  sections: [
    {
      title: 'Qualificação por mensagem',
      intro: 'Uma conversa curta antes da avaliação: se alguma resposta for não, você encerra com educação e poupa o seu tempo.',
      fields: [
        {
          kind: 'textarea',
          id: 'qual_perfil',
          label: 'Pergunta 1: é o perfil que eu atendo?',
          placeholder: 'Ex.: Qual é o seu objetivo hoje e como é a sua rotina de treino?',
          rows: 2,
        },
        {
          kind: 'textarea',
          id: 'qual_urgencia',
          label: 'Pergunta 2: tem urgência?',
          placeholder: 'Ex.: Você quer começar nas próximas semanas ou está só pesquisando?',
          rows: 2,
        },
        {
          kind: 'textarea',
          id: 'qual_investimento',
          label: 'Pergunta 3: pode investir?',
          placeholder: 'Ex.: Meu acompanhamento começa em R$ 349 por mês. Isso cabe no seu orçamento?',
          rows: 2,
        },
      ],
    },
    {
      title: '1. Abertura',
      intro: 'Em dois minutos: agradeça, explique como vai ser e peça permissão para perguntar.',
      fields: [
        {
          kind: 'textarea',
          id: 'abertura',
          label: 'Minha abertura',
          placeholder: 'Ex.: Obrigado por separar esse tempo. Vou te fazer algumas perguntas sobre sua rotina e seu objetivo e, no final, te mostro se e como posso te ajudar. Pode ser assim?',
          rows: 4,
        },
      ],
    },
    {
      title: '2. Diagnóstico',
      intro: 'Pergunte em camadas, da mais fácil para a mais profunda, e anote com as palavras exatas dele.',
      fields: [
        {
          kind: 'list',
          id: 'perguntas',
          label: 'Minhas perguntas de diagnóstico (5 a 8)',
          addLabel: 'Adicionar pergunta',
          startRows: 5,
          columns: [
            { id: 'camada', label: 'Camada', kind: 'select', options: ['Situação', 'Histórico', 'Problema', 'Consequência', 'Ganho'] },
            { id: 'pergunta', label: 'Pergunta', kind: 'text', placeholder: 'Ex.: Se nada mudar nos próximos 6 meses, como você se vê?' },
          ],
        },
      ],
    },
    {
      title: '3. Proposta',
      intro: 'Só agora você fala da consultoria, ligando a dor que ele descreveu à sua promessa, com as palavras dele.',
      fields: [
        {
          kind: 'textarea',
          id: 'proposta',
          label: 'Minha proposta',
          placeholder: 'Ex.: Você me disse que larga a dieta depois do segundo mês. Por isso meu acompanhamento tem check-in toda semana: eu ajusto o plano antes de você desanimar. Funciona assim...',
          rows: 5,
        },
      ],
    },
    {
      title: '4. Fechamento',
      intro: 'Uma pergunta direta, sem pressão. Depois de perguntar, fique em silêncio.',
      fields: [
        {
          kind: 'textarea',
          id: 'fechamento',
          label: 'Minha pergunta de fechamento',
          placeholder: 'Ex.: Faz sentido para você? Prefere começar ainda esta semana, com Pix ou cartão?',
          rows: 3,
        },
      ],
    },
  ],
  checkpoint: {
    slug: 'vendas',
    position: 1,
    checked: (d) => {
      const has = (k: string) => typeof d[k] === 'string' && (d[k] as string).trim().length > 0
      const ids: string[] = []
      if (has('abertura')) ids.push('v1')
      if (Array.isArray(d.perguntas) && (d.perguntas as Record<string, string>[]).filter((r) => (r.pergunta ?? '').trim()).length >= 3) ids.push('v2')
      if (has('proposta')) ids.push('v3')
      if (has('fechamento')) ids.push('v4')
      return ids
    },
  },
}
