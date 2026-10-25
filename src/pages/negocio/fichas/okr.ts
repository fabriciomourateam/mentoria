import type { FormSchema } from '../forms'

// Metas do trimestre: 1 objetivo e 3 resultados-chave (aula Gestão do Tempo, aula 4).
export const schema: FormSchema = {
  sections: [
    {
      title: 'Objetivo do trimestre',
      intro: 'Um objetivo só, escrito como uma direção que dá para reconhecer quando for atingida.',
      fields: [
        {
          kind: 'textarea',
          id: 'objetivo',
          label: 'Meu objetivo',
          placeholder: 'Ex.: Ter uma base de alunos mais estável.',
          rows: 2,
        },
      ],
    },
    {
      title: 'Resultados-chave',
      intro: 'Três números com prazo que dizem se o objetivo foi atingido. Atualize o "atual" na revisão semanal.',
      fields: [
        {
          kind: 'list',
          id: 'krs',
          label: 'Meus 3 resultados-chave',
          addLabel: 'Adicionar resultado-chave',
          startRows: 3,
          columns: [
            { id: 'kr', label: 'Resultado-chave', kind: 'text', placeholder: 'Ex.: Reduzir o churn mensal' },
            { id: 'base', label: 'Linha de base', kind: 'text', placeholder: 'Ex.: 10%' },
            { id: 'meta', label: 'Meta', kind: 'text', placeholder: 'Ex.: 6%' },
            { id: 'atual', label: 'Atual', kind: 'text', placeholder: 'Ex.: 8%' },
          ],
        },
      ],
    },
    {
      title: 'Iniciativas',
      intro: 'O que você vai fazer, concretamente, para mexer nesses números.',
      fields: [
        {
          kind: 'textarea',
          id: 'iniciativas',
          label: 'Minhas iniciativas',
          placeholder: 'Ex.: Contato pessoal em até 48h com quem sumiu do check-in; mensagem de renovação 15 dias antes do fim do plano.',
          rows: 4,
        },
        {
          kind: 'textarea',
          id: 'radar',
          label: 'Meu radar de abandono (2 ou 3 sinais)',
          placeholder: 'Ex.: duas semanas sem check-in, treinos sem registro no app, respostas curtas e frias.',
          rows: 2,
        },
      ],
    },
  ],
  checkpoint: {
    slug: 'gestao-tempo',
    position: 4,
    checked: (d) => {
      const ids: string[] = []
      const obj = typeof d.objetivo === 'string' && d.objetivo.trim().length > 0
      const krs = Array.isArray(d.krs) ? (d.krs as Record<string, string>[]) : []
      if (obj && krs.filter((r) => (r.kr ?? '').trim() && (r.meta ?? '').trim()).length >= 3) ids.push('t5a4-4')
      return ids
    },
  },
}
