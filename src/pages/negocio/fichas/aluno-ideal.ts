import type { FormSchema } from '../forms'

// Meu aluno ideal: perfil em uma página (aula Posicionamento e Oferta, aula 1).
export const schema: FormSchema = {
  sections: [
    {
      title: 'Quem são meus melhores alunos',
      intro: 'Comece pelo aluno que você já tem: quem teve mais resultado, paga em dia, indica e dá pouco trabalho.',
      fields: [
        {
          kind: 'list',
          id: 'melhores',
          label: 'Meus 3 a 5 melhores alunos',
          addLabel: 'Adicionar aluno',
          startRows: 3,
          columns: [
            { id: 'nome', label: 'Aluno', kind: 'text', placeholder: 'Ex.: Carla, 41 anos' },
            { id: 'porque', label: 'Por que está entre os melhores', kind: 'text', placeholder: 'Ex.: perdeu 9 kg, paga em dia e indicou duas amigas' },
          ],
        },
        {
          kind: 'textarea',
          id: 'padrao',
          label: 'O que eles têm em comum',
          placeholder: 'Ex.: mulheres de 35 a 50 anos, com filhos, que treinam em casa 3 vezes por semana.',
          rows: 3,
        },
      ],
    },
    {
      title: 'O perfil do aluno ideal',
      intro: 'Escreva com as palavras dele, não com termos técnicos.',
      fields: [
        { kind: 'text', id: 'resumo', label: 'Meu aluno ideal em uma frase', placeholder: 'Ex.: Mulher de 35 a 50, rotina corrida, que quer emagrecer sem sofrer.' },
        { kind: 'text', id: 'fase', label: 'Idade e fase de vida', placeholder: 'Ex.: 35 a 50 anos, mãe, trabalha fora' },
        { kind: 'textarea', id: 'objetivo', label: 'Objetivo principal', placeholder: 'Ex.: perder 6 a 8 kg e voltar a ter energia no fim do dia.', rows: 2 },
        { kind: 'textarea', id: 'rotina', label: 'Rotina', placeholder: 'Ex.: trabalha das 8h às 18h, treina de manhã cedo ou à noite, viaja pouco.', rows: 2 },
        { kind: 'textarea', id: 'dor', label: 'Dor principal, nas palavras dele', placeholder: 'Ex.: "Já comecei a dieta dez vezes e largo na quarta-feira."', rows: 2 },
        { kind: 'textarea', id: 'ja_tentou', label: 'O que já tentou e por que não funcionou', placeholder: 'Ex.: dieta da moda e academia sem acompanhamento; faltou direção e ajuste.', rows: 2 },
        { kind: 'textarea', id: 'objecoes', label: 'Objeções para contratar', placeholder: 'Ex.: preço, falta de tempo, medo de não conseguir manter.', rows: 2 },
        { kind: 'textarea', id: 'onde_esta', label: 'Onde passa o tempo online', placeholder: 'Ex.: Instagram à noite, grupos de mães, YouTube de receitas.', rows: 2 },
        { kind: 'money', id: 'investimento', label: 'Quanto consegue investir por mês', placeholder: '300' },
      ],
    },
    {
      title: 'Validação com 3 conversas',
      intro: 'Chame três alunos que se encaixam e pergunte o que fez contratar, o que quase impediu e o que mudou.',
      fields: [
        {
          kind: 'list',
          id: 'conversas',
          label: 'O que ouvi',
          addLabel: 'Adicionar conversa',
          startRows: 3,
          columns: [
            { id: 'aluno', label: 'Aluno', kind: 'text', placeholder: 'Ex.: Carla' },
            { id: 'contratar', label: 'O que fez contratar', kind: 'text', placeholder: 'Ex.: ver o resultado de uma amiga' },
            { id: 'impediu', label: 'O que quase impediu', kind: 'text', placeholder: 'Ex.: medo de não ter tempo' },
            { id: 'mudou', label: 'Maior mudança', kind: 'text', placeholder: 'Ex.: mais disposição' },
          ],
        },
      ],
    },
  ],
  checkpoint: {
    slug: 'posicionamento-oferta',
    position: 1,
    checked: (d) => {
      const has = (k: string) => typeof d[k] === 'string' && (d[k] as string).trim().length > 0
      const ids: string[] = []
      if (has('fase') && has('objetivo') && has('dor')) ids.push('t1a1-2')
      return ids
    },
  },
}
