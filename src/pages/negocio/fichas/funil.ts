import type { FormSchema } from '../forms'

// Meu funil: as 5 etapas do seguidor até a venda (aula Captação).
export const schema: FormSchema = {
  sections: [
    {
      title: 'O caminho do seguidor até a venda',
      intro: 'Cada etapa tem uma função só, e o número da semana mostra onde você está vazando.',
      fields: [
        {
          kind: 'list',
          id: 'etapas',
          label: 'Minhas 5 etapas',
          addLabel: 'Adicionar etapa',
          startRows: 5,
          columns: [
            { id: 'etapa', label: 'Etapa', kind: 'select', options: ['Atenção', 'Interesse', 'Conversa', 'Avaliação', 'Venda'] },
            { id: 'faco', label: 'O que eu faço', kind: 'text', placeholder: 'Ex.: Reel com chamada: comente QUERO e recebe o guia no direct' },
            { id: 'numero', label: 'Número da semana', kind: 'number', placeholder: 'Ex.: 10' },
          ],
        },
        {
          kind: 'select',
          id: 'primeiro_funil',
          label: 'Meu primeiro funil',
          hint: 'Comece com um, estabilize e só então adicione o próximo.',
          options: ['Palavra-chave em post', 'Resposta de story', 'Indicação de alunos', 'Outro'],
        },
      ],
    },
    {
      title: 'Minhas taxas de conversão',
      intro: 'Anote as suas, mesmo aproximadas. Exemplo: de 10 conversas, 4 avaliações e 2 vendas.',
      fields: [
        { kind: 'percent', id: 'taxa_conversa', label: 'Atenção para conversa', placeholder: '10' },
        { kind: 'percent', id: 'taxa_avaliacao', label: 'Conversa para avaliação', placeholder: '40' },
        { kind: 'percent', id: 'taxa_venda', label: 'Avaliação para venda', placeholder: '50' },
        {
          kind: 'textarea',
          id: 'vazamento',
          label: 'Onde mais estou vazando e o que vou testar',
          placeholder: 'Ex.: Muita conversa e pouca avaliação marcada: vou enviar o formulário de aplicação logo na primeira resposta.',
          rows: 3,
        },
      ],
    },
  ],
  checkpoint: {
    slug: 'captacao',
    position: 4,
    checked: (d) => {
      const ids: string[] = []
      const rows = Array.isArray(d.etapas) ? (d.etapas as Record<string, string>[]) : []
      if (rows.filter((r) => (r.faco ?? '').trim()).length >= 3) ids.push('c1')
      return ids
    },
  },
}
