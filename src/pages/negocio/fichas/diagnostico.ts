import type { FormSchema } from '../forms'

// Meu ponto de partida: os 4 números do diagnóstico inicial (trilha Comece por aqui, checkpoint).
export const schema: FormSchema = {
  sections: [
    {
      title: 'Seus números de hoje',
      intro: 'Use extrato e cobranças, não a memória: vale o número real, não o desejado.',
      fields: [
        {
          kind: 'money',
          id: 'faturamento_medio',
          label: 'Faturamento médio dos últimos 3 meses',
          hint: 'Some o que vendeu em cada mês (presencial, online, planos) e divida por três.',
          placeholder: '9.000',
        },
        { kind: 'number', id: 'alunos_presenciais', label: 'Alunos presenciais ativos e pagando', placeholder: '18' },
        { kind: 'number', id: 'alunos_online', label: 'Alunos online ativos e pagando', placeholder: '4' },
        {
          kind: 'number',
          id: 'horas_semana',
          label: 'Horas por semana na academia',
          hint: 'Conte aulas, intervalos entre elas, deslocamento e tempo de espera.',
          placeholder: '36',
        },
      ],
    },
    {
      title: 'Sua meta para daqui a 6 meses',
      intro: 'É o único número que você escolhe: ambicioso, mas com um caminho que você consiga desenhar.',
      fields: [
        { kind: 'money', id: 'meta_6m', label: 'Meta de faturamento mensal em 6 meses', placeholder: '15.000' },
        {
          kind: 'textarea',
          id: 'meta_caminho',
          label: 'De onde vem esse dinheiro',
          placeholder: 'Ex.: 12 alunos online novos a R$ 350, vindos do Instagram, mantendo 14 presenciais.',
          rows: 3,
        },
      ],
    },
    {
      title: 'O que esses números me dizem',
      intro: 'Números sozinhos são dados; combinados viram diagnóstico. Escreva com as suas palavras.',
      fields: [
        {
          kind: 'textarea',
          id: 'leitura',
          label: 'O que esses números me dizem',
          hint: 'Faturamento por hora (faturamento dividido por horas x 4), dependência do presencial e ticket médio.',
          placeholder: 'Ex.: Ganho cerca de R$ 62 por hora, 82% dos meus alunos dependem de eu estar presente e meu ticket online é maior que o presencial.',
          rows: 4,
        },
        {
          kind: 'textarea',
          id: 'primeira_mudanca',
          label: 'A primeira mudança que eu quero fazer',
          placeholder: 'Ex.: abrir 5 vagas online por mês e reduzir 6 horas de agenda presencial.',
          rows: 2,
        },
      ],
    },
  ],
  checkpoint: {
    slug: 'comece-por-aqui',
    position: 5,
    checked: (d) => {
      const has = (k: string) => (typeof d[k] === 'number' ? true : typeof d[k] === 'string' && (d[k] as string).trim().length > 0)
      const ids: string[] = []
      if (has('faturamento_medio')) ids.push('d1')
      if (has('alunos_presenciais') && has('alunos_online')) ids.push('d2')
      if (has('horas_semana')) ids.push('d3')
      if (has('meta_6m')) ids.push('d4')
      return ids
    },
  },
}
