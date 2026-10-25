import type { Field, FormSchema, Section } from '../forms'

// Meus processos: 3 POPs de uma página (aula Gestão do Tempo, aula 2).
// Cada processo tem os mesmos campos; só mudam o prefixo e os exemplos.
const pop = (
  prefix: string,
  title: string,
  intro: string,
  ex: { gatilho: string; responsavel: string; passo: string; mensagem: string; prazo: string; ok: string },
): Section => {
  const fields: Field[] = [
    { kind: 'text', id: `${prefix}_gatilho`, label: 'Gatilho (o que dá início)', placeholder: ex.gatilho },
    { kind: 'text', id: `${prefix}_responsavel`, label: 'Responsável', placeholder: ex.responsavel },
    {
      kind: 'list',
      id: `${prefix}_passos`,
      label: 'Passo a passo',
      addLabel: 'Adicionar passo',
      startRows: 4,
      columns: [{ id: 'passo', label: 'Passo, no imperativo', kind: 'text', placeholder: ex.passo }],
    },
    { kind: 'textarea', id: `${prefix}_mensagem`, label: 'Mensagens e modelos', placeholder: ex.mensagem, rows: 3 },
    { kind: 'text', id: `${prefix}_prazo`, label: 'Prazo', placeholder: ex.prazo },
    { kind: 'textarea', id: `${prefix}_ok`, label: 'Como sei que foi bem feito', placeholder: ex.ok, rows: 2 },
  ]
  return { title, intro, fields }
}

export const schema: FormSchema = {
  sections: [
    pop('entrada', '1. Entrada do aluno novo', 'Do pagamento ao primeiro plano entregue: escreva como você faz hoje e melhore depois.', {
      gatilho: 'Ex.: confirmação do pagamento',
      responsavel: 'Ex.: eu (futuramente, o suporte)',
      passo: 'Ex.: Enviar a anamnese e o pedido de fotos iniciais',
      mensagem: 'Ex.: Oi, [nome]! Seja bem-vindo. Pra eu montar seu plano, preencha esta anamnese e envie as fotos iniciais até amanhã.',
      prazo: 'Ex.: primeiro plano entregue em até 3 dias úteis',
      ok: 'Ex.: o aluno abriu o app, respondeu a anamnese e recebeu o plano no prazo.',
    }),
    pop('checkin', '2. Check-in', 'Quem faz, quando e com qual mensagem.', {
      gatilho: 'Ex.: todo domingo às 18h',
      responsavel: 'Ex.: eu',
      passo: 'Ex.: Enviar o formulário de check-in',
      mensagem: 'Ex.: Oi, [nome]! Hora do check-in da semana. Me conta peso, fotos e como foi a sua percepção.',
      prazo: 'Ex.: devolutiva em até 24 horas',
      ok: 'Ex.: o aluno respondeu e recebeu o ajuste do plano na segunda.',
    }),
    pop('renovacao', '3. Renovação', 'Quando começa e o que você envia antes de o plano acabar.', {
      gatilho: 'Ex.: 15 dias antes do fim do plano',
      responsavel: 'Ex.: eu',
      passo: 'Ex.: Montar o comparativo de antes e depois',
      mensagem: 'Ex.: Oi, [nome]! Olha a sua evolução nestes 3 meses. Vamos desenhar o próximo ciclo?',
      prazo: 'Ex.: conversa de renovação até 7 dias antes do vencimento',
      ok: 'Ex.: o aluno confirmou a renovação ou disse o motivo de não renovar.',
    }),
  ],
  checkpoint: {
    slug: 'gestao-tempo',
    position: 2,
    checked: (d) => {
      const done = (p: string) => {
        const g = d[`${p}_gatilho`]
        const rows = d[`${p}_passos`]
        return (
          typeof g === 'string' &&
          g.trim().length > 0 &&
          Array.isArray(rows) &&
          (rows as Record<string, string>[]).some((r) => (r.passo ?? '').trim())
        )
      }
      const ids: string[] = []
      if (done('entrada')) ids.push('g1')
      if (done('checkin')) ids.push('g2')
      if (done('renovacao')) ids.push('g3')
      return ids
    },
  },
}
