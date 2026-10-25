import type { FormSchema } from '../forms'

// Calendário de conteúdo: grade semanal e plano do mês (aula Captação, aula 1).
const TIPOS = ['Educativo', 'Engajamento', 'Prova', 'História', 'Tendência', 'Venda']

export const schema: FormSchema = {
  sections: [
    {
      title: 'Minha grade semanal',
      intro: 'Todo post tem um objetivo antes de existir: atrair, gerar confiança ou vender. Regra simples: 4 de cada 6 atraem ou geram confiança, 1 vende.',
      fields: [
        {
          kind: 'list',
          id: 'grade',
          label: 'Dia, tipo e objetivo',
          addLabel: 'Adicionar dia',
          startRows: 6,
          columns: [
            { id: 'dia', label: 'Dia', kind: 'select', options: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'] },
            { id: 'tipo', label: 'Tipo', kind: 'select', options: TIPOS },
            { id: 'objetivo', label: 'Objetivo', kind: 'select', options: ['Atrair', 'Gerar confiança', 'Vender'] },
          ],
        },
      ],
    },
    {
      title: 'Temas do mês',
      intro: 'Escolha 4 temas, um por semana, ligados às dores do seu aluno ideal.',
      fields: [
        {
          kind: 'textarea',
          id: 'temas',
          label: 'Os 4 temas',
          placeholder: 'Ex.: Semana 1 falta de tempo, semana 2 platô, semana 3 constância, semana 4 alimentação.',
          rows: 3,
        },
      ],
    },
    {
      title: 'Plano do mês',
      intro: 'Grave em um ou dois blocos por semana. No fim do mês, repita os formatos que geraram mensagens no direct, não só curtidas.',
      fields: [
        {
          kind: 'list',
          id: 'mes',
          label: 'Posts do mês',
          addLabel: 'Adicionar post',
          startRows: 4,
          columns: [
            { id: 'data', label: 'Data', kind: 'date' },
            { id: 'formato', label: 'Formato', kind: 'select', options: ['Reels', 'Carrossel', 'Stories', 'Foto'] },
            { id: 'tipo', label: 'Tipo', kind: 'select', options: TIPOS },
            { id: 'tema', label: 'Tema', kind: 'text', placeholder: 'Ex.: 3 erros que travam o emagrecimento depois dos 30' },
            { id: 'status', label: 'Status', kind: 'select', options: ['Ideia', 'Roteirizado', 'Gravado', 'Publicado'] },
          ],
        },
      ],
    },
  ],
  checkpoint: {
    slug: 'captacao',
    position: 1,
    checked: (d) => {
      const ids: string[] = []
      const grade = Array.isArray(d.grade) ? (d.grade as Record<string, string>[]) : []
      const mes = Array.isArray(d.mes) ? (d.mes as Record<string, string>[]) : []
      if (grade.filter((r) => r.dia && r.tipo).length >= 6) ids.push('t3a1-2')
      if (mes.filter((r) => (r.tema ?? '').trim()).length >= 4) ids.push('t3a1-3')
      return ids
    },
  },
}
