import type { FormSchema } from '../forms'

// Meu banco de objeções (aula Vendas, aula 2).
export const schema: FormSchema = {
  sections: [
    {
      title: 'Minhas respostas',
      intro: 'Método em 4 tempos: acolher, perguntar o que está por trás, responder com a oferta e confirmar.',
      fields: [
        {
          kind: 'list',
          id: 'objecoes',
          label: 'Objeções e respostas (comece pelas 6 mais comuns)',
          addLabel: 'Adicionar objeção',
          startRows: 6,
          columns: [
            { id: 'objecao', label: 'Objeção', kind: 'text', placeholder: 'Ex.: Está caro' },
            { id: 'por_tras', label: 'O que está por trás', kind: 'text', placeholder: 'Ex.: cabe no mês? ou falta certeza do resultado?' },
            {
              id: 'resposta',
              label: 'Minha resposta',
              kind: 'textarea',
              placeholder: 'Ex.: Faz sentido pensar nisso. Com o que você está comparando? Aqui você tem plano, ajuste semanal e suporte...',
            },
          ],
        },
      ],
    },
    {
      title: 'Objeções reais da minha audiência',
      intro: 'Publique uma caixinha nos stories perguntando a maior dúvida antes de contratar e junte as respostas.',
      fields: [
        {
          kind: 'textarea',
          id: 'reais',
          label: 'O que as pessoas disseram',
          placeholder: 'Ex.: "Não sei se funciona pra mim", "Tenho medo de não conseguir manter", "Já paguei e fiquei sozinha".',
          rows: 4,
        },
        {
          kind: 'textarea',
          id: 'repetida',
          label: 'A objeção que mais se repete e o que mudar na minha apresentação',
          hint: 'Objeção repetida é falha de apresentação, não do aluno.',
          placeholder: 'Ex.: Todo mundo diz "não tenho tempo": vou mostrar o treino de 40 minutos já na proposta.',
          rows: 3,
        },
      ],
    },
  ],
  checkpoint: {
    slug: 'vendas',
    position: 2,
    checked: (d) => {
      const ids: string[] = []
      const rows = Array.isArray(d.objecoes) ? (d.objecoes as Record<string, string>[]) : []
      if (rows.filter((r) => (r.objecao ?? '').trim() && (r.resposta ?? '').trim()).length >= 6) ids.push('t2a2-1')
      return ids
    },
  },
}
