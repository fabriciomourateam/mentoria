import type { FormSchema } from '../forms'

// Minha Oferta: os 4 blocos da oferta de uma página (aula Posicionamento e Oferta, aula 2).
export const schema: FormSchema = {
  sections: [
    {
      title: 'Promessa central',
      intro: 'Uma frase só: quem você ajuda, o resultado, o prazo e sem qual dor. Escreva versões e fique com a mais específica.',
      fields: [
        {
          kind: 'textarea',
          id: 'promessa',
          label: 'Sua promessa em uma frase',
          placeholder: 'Ex.: Eu ajudo mulheres de 35 a 50 anos a perder 6 kg em 12 semanas, treinando 40 minutos em casa, sem dieta maluca.',
          rows: 2,
        },
        { kind: 'textarea', id: 'promessa_alt', label: 'Outras versões (opcional)', rows: 2 },
      ],
    },
    {
      title: 'Para quem é, e para quem não é',
      intro: 'Dizer quem você não atende afasta o curioso e aumenta a confiança de quem é o seu aluno.',
      fields: [
        { kind: 'textarea', id: 'para_quem', label: 'É para quem...', placeholder: 'Ex.: tem rotina corrida, já tentou sozinha e quer um plano que caiba no dia.', rows: 3 },
        { kind: 'textarea', id: 'nao_para_quem', label: 'Não é para quem...', placeholder: 'Ex.: busca resultado em 15 dias ou não quer acompanhamento.', rows: 3 },
      ],
    },
    {
      title: 'O que está incluso',
      intro: 'Escreva o "como" da entrega, não só o "o quê".',
      fields: [
        {
          kind: 'list',
          id: 'incluso',
          label: 'Itens da entrega',
          addLabel: 'Adicionar item',
          startRows: 3,
          columns: [
            { id: 'item', label: 'Item', kind: 'text', placeholder: 'Ex.: Check-in semanal' },
            { id: 'como', label: 'Como funciona', kind: 'text', placeholder: 'Ex.: toda segunda, resposta em até 24h' },
          ],
        },
      ],
    },
    {
      title: 'Preço e garantia',
      intro: 'Ancore o valor no resultado, não na hora. A garantia tira o risco de cima do aluno.',
      fields: [
        { kind: 'money', id: 'preco_mensal', label: 'Preço do plano mensal', placeholder: '349' },
        { kind: 'textarea', id: 'planos', label: 'Planos e condições', placeholder: 'Ex.: trimestral R$ 299/mês, semestral R$ 269/mês.', rows: 2 },
        { kind: 'textarea', id: 'garantia', label: 'Sua garantia', placeholder: 'Ex.: 7 dias para cancelar sem custo se não se adaptar ao método.', rows: 2 },
      ],
    },
  ],
  checkpoint: {
    slug: 'posicionamento-oferta',
    position: 2,
    checked: (d) => {
      const has = (k: string) => typeof d[k] === 'string' && (d[k] as string).trim().length > 0
      const ids: string[] = []
      if (has('promessa')) ids.push('o1')
      if (has('para_quem') && has('nao_para_quem')) ids.push('o2')
      if (Array.isArray(d.incluso) && (d.incluso as Record<string, string>[]).some((r) => (r.item ?? '').trim())) ids.push('o3')
      if ((has('preco_mensal') || typeof d.preco_mensal === 'number') && has('garantia')) ids.push('o4')
      return ids
    },
  },
}
