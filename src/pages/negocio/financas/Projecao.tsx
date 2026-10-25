import { brl, pct, useEntry, useWorkspace } from '../../../lib/workspace'
import { FieldInput } from '../FormTool'
import type { ToolProgress } from '../types'
import { CENARIOS, MESES_CURTOS, SAZ_PADRAO, equilibrioCalc, fmt, has, projecaoCalc } from './calc'
import type { Data } from './calc'

const MAIN = ['alunos', 'ticket', 'novas_cons', 'novas_real', 'novas_ous', 'churn_cons', 'churn_real', 'churn_ous', 'meta', 'conv_venda', 'conv_lead']

export const progress: ToolProgress = (get) => {
  const d = get('projecao')
  return MAIN.filter((k) => has(d[k])).length / MAIN.length
}

const MES_NOME = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro']
const al = (n: number) => `${Math.round(n)} ${Math.round(n) === 1 ? 'aluno' : 'alunos'}`

export default function Projecao() {
  const { data, patch, readOnly } = useEntry<Data>('projecao')
  const { get } = useWorkspace()
  const c = projecaoCalc(data, get)
  const eq = equilibrioCalc(get('equilibrio'), get)
  const m = c.meta
  const preenchido = c.alunosHoje > 0 || CENARIOS.some((x) => has(data[`novas_${x.id}`]))
  const pronto = preenchido && c.ticket > 0
  const saz = data.saz && typeof data.saz === 'object' ? (data.saz as Record<string, unknown>) : {}
  const real = c.cenarios[1]
  const cons = c.cenarios[0]

  // Rótulo de cada trimestre a partir do mês atual (ex.: "nov a jan").
  const triLabel = (q: number) => {
    const a = MESES_CURTOS[(c.start + q * 3) % 12]
    const b = MESES_CURTOS[(c.start + q * 3 + 2) % 12]
    return `${q + 1}º trimestre (${a} a ${b})`
  }

  return (
    <div className="stack">
      <fieldset className="stack ro-fieldset" disabled={readOnly}>
        <section className="card sec r" style={{ ['--i' as string]: 1 }}>
          <h2>Ponto de partida</h2>
          <p className="sec-intro">A projeção cobre os próximos 12 meses, a partir do mês atual.</p>
          <div className="sec-fields">
            <div className="grid g2">
              <FieldInput
                field={{
                  kind: 'money',
                  id: 'ticket',
                  label: 'Ticket médio por aluno',
                  placeholder: c.ticketSug > 0 ? fmt(c.ticketSug) : '300',
                  hint: !has(data.ticket) && c.ticketSug > 0 ? `Usando o preço mensal da Precificação: ${brl(c.ticketSug)}.` : 'Quanto cada aluno paga por mês, em média.',
                }}
                value={data.ticket}
                onChange={(v) => patch({ ticket: v })}
              />
              <FieldInput
                field={{ kind: 'number', id: 'alunos', label: 'Alunos ativos hoje', placeholder: '30', hint: 'Quem está pagando e sendo atendido agora.' }}
                value={data.alunos}
                onChange={(v) => patch({ alunos: v })}
              />
            </div>
          </div>
        </section>

        <section className="card sec r" style={{ ['--i' as string]: 2 }}>
          <h2>Os três cenários</h2>
          <p className="sec-intro">
            O conservador é o mínimo que você aceita e precisa ficar acima do ponto de equilíbrio. O realista é o plano executado normalmente. O
            ousado é quando tudo dá certo.
          </p>
          <div className="sec-fields">
            <div className="grid g3">
              {CENARIOS.map((x, i) => (
                <div key={x.id} className="stack" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <b style={{ fontSize: 14.5 }}>{x.nome}</b>
                  <FieldInput
                    field={{ kind: 'number', id: `novas_${x.id}`, label: 'Novas vendas por mês', placeholder: ['3', '5', '8'][i] }}
                    value={data[`novas_${x.id}`]}
                    onChange={(v) => patch({ [`novas_${x.id}`]: v })}
                  />
                  <FieldInput
                    field={{ kind: 'percent', id: `churn_${x.id}`, label: 'Cancelamento por mês', placeholder: ['10', '8', '5'][i] }}
                    value={data[`churn_${x.id}`]}
                    onChange={(v) => patch({ [`churn_${x.id}`]: v })}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="card sec r" style={{ ['--i' as string]: 3 }}>
          <h2>Sazonalidade</h2>
          <p className="sec-intro">
            Multiplica as novas vendas de cada mês. 1,0 é um mês normal; acima de 1 vende mais, abaixo vende menos. Os valores iniciais seguem uma
            tendência comum no mercado fitness (procura maior no começo do ano e antes do verão, mais fraca no meio do ano). É uma tendência, não
            um dado: olhe o seu histórico e ajuste.
          </p>
          <div className="sec-fields">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(84px, 1fr))', gap: 10 }}>
              {MESES_CURTOS.map((k, i) => (
                <label key={k} className="lcol">
                  <span className="lcl">{MES_NOME[i].slice(0, 3)}</span>
                  <input
                    className="input"
                    inputMode="decimal"
                    aria-label={`Sazonalidade de ${MES_NOME[i]}`}
                    value={typeof saz[k] === 'string' ? (saz[k] as string) : ''}
                    placeholder={fmt(SAZ_PADRAO[i])}
                    onChange={(e) => patch({ saz: { ...saz, [k]: e.target.value.replace(/[^\d.,]/g, '') } })}
                  />
                </label>
              ))}
            </div>
          </div>
        </section>

        <section className="card sec r" style={{ ['--i' as string]: 4 }}>
          <h2>Da meta ao caixa</h2>
          <p className="sec-intro">
            A meta vira uma fila de ações. Exemplo da aula: meta de R$ 16.000 com mensalidade de R$ 300 dá 54 alunos, 8 vendas, 20 avaliações e 80
            leads por mês. As taxas de conversão do exemplo (40% e 25%) são só exemplo: use as suas.
          </p>
          <div className="sec-fields">
            <div className="grid g2">
              <FieldInput
                field={{ kind: 'money', id: 'meta', label: 'Meta mensal de faturamento', placeholder: '16.000' }}
                value={data.meta}
                onChange={(v) => patch({ meta: v })}
              />
              <FieldInput
                field={{
                  kind: 'money',
                  id: 'ticket_meta',
                  label: 'Ticket',
                  placeholder: c.ticket > 0 ? fmt(c.ticket) : '300',
                  hint: !has(data.ticket_meta) && c.ticket > 0 ? 'Usando o ticket médio acima.' : undefined,
                }}
                value={data.ticket_meta}
                onChange={(v) => patch({ ticket_meta: v })}
              />
              <FieldInput
                field={{ kind: 'percent', id: 'conv_venda', label: 'Avaliações que viram venda', placeholder: '40' }}
                value={data.conv_venda}
                onChange={(v) => patch({ conv_venda: v })}
              />
              <FieldInput
                field={{ kind: 'percent', id: 'conv_lead', label: 'Leads que viram avaliação', placeholder: '25', hint: 'Leads que agendam e comparecem.' }}
                value={data.conv_lead}
                onChange={(v) => patch({ conv_lead: v })}
              />
            </div>
            <FieldInput
              field={{
                kind: 'number',
                id: 'prazo',
                label: 'Prazo para chegar na meta (meses)',
                placeholder: '6',
                hint: 'Usado para calcular quantas vendas por mês, além de repor quem cancela (cancelamento do cenário realista).',
              }}
              value={data.prazo}
              onChange={(v) => patch({ prazo: v })}
            />
          </div>
        </section>
      </fieldset>

      <section className="card sec r" style={{ ['--i' as string]: 5 }}>
        <h2>Resultado da projeção</h2>
        {pronto ? (
          <div className="sec-fields">
            <div className="kpis">
              {c.cenarios.map((x) => (
                <div key={x.id} className={`kpi ${x.id === 'real' ? 'hl' : ''}`}>
                  <div className="k">{x.nome}, faturamento em 12 meses</div>
                  <div className="v">{brl(x.total)}</div>
                  <div className="d">{al(x.alunosFim)} no fim</div>
                </div>
              ))}
            </div>
            <p className="sec-intro" style={{ marginTop: 0 }}>
              No cenário realista você termina os 12 meses com {al(real.alunosFim)} e fatura {brl(real.total)}. No conservador, {al(cons.alunosFim)} e{' '}
              {brl(cons.total)}.
              {eq.base.pe != null &&
                (cons.alunosFim >= eq.base.pe
                  ? ` O conservador fica acima do ponto de equilíbrio (${eq.base.pe} alunos).`
                  : ` Atenção: o conservador termina abaixo do ponto de equilíbrio (${eq.base.pe} alunos). Ele deveria cobrir as contas.`)}
            </p>
            <div className="md">
              <table className="cards">
                <thead>
                  <tr>
                    <th>Trimestre</th>
                    {CENARIOS.map((x) => (
                      <th key={x.id}>{x.nome}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[0, 1, 2, 3].map((q) => (
                    <tr key={q}>
                      <td data-label="Trimestre">{triLabel(q)}</td>
                      {c.cenarios.map((x) => (
                        <td key={x.id} data-label={x.nome}>
                          {brl(x.tris[q].fat)} e {al(x.tris[q].alunos)}
                        </td>
                      ))}
                    </tr>
                  ))}
                  <tr>
                    <td data-label="Trimestre" style={{ fontWeight: 700 }}>
                      Total dos 12 meses
                    </td>
                    {c.cenarios.map((x) => (
                      <td key={x.id} data-label={x.nome} style={{ fontWeight: 700 }}>
                        {brl(x.total)} e {al(x.alunosFim)}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="sec-intro" style={{ marginTop: 0 }}>
              Alunos no fim de cada trimestre e faturamento do trimestre (alunos do mês vezes o ticket de {brl(c.ticket)}).
            </p>
            <details>
              <summary style={{ cursor: 'pointer', fontWeight: 700, fontSize: 14.5 }}>Ver mês a mês</summary>
              <div className="md" style={{ marginTop: 10 }}>
                <table className="cards">
                  <thead>
                    <tr>
                      <th>Mês</th>
                      {CENARIOS.map((x) => (
                        <th key={x.id}>{x.nome}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {real.meses.map((mm, i) => (
                      <tr key={i}>
                        <td data-label="Mês">
                          {MES_NOME[mm.idx]} de {mm.ano}
                        </td>
                        {c.cenarios.map((x) => (
                          <td key={x.id} data-label={x.nome}>
                            {brl(x.meses[i].fat)} e {al(x.meses[i].alunos)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </details>
          </div>
        ) : (
          <p className="sec-intro">Preencha os alunos de hoje, o ticket e as novas vendas para ver os três cenários.</p>
        )}
      </section>

      <section className="card sec r" style={{ ['--i' as string]: 6 }}>
        <h2>Da meta ao caixa: o que fazer por mês</h2>
        {m.alunosNec > 0 ? (
          <div className="sec-fields">
            <div className="kpis">
              <div className="kpi">
                <div className="k">Alunos necessários</div>
                <div className="v">{m.alunosNec}</div>
                <div className="d">{brl(m.meta)} ÷ {brl(m.ticketMeta)}</div>
              </div>
              <div className="kpi">
                <div className="k">Vendas por mês</div>
                <div className="v">{m.vendas}</div>
                <div className="d">repor cancelamentos e crescer</div>
              </div>
              <div className="kpi">
                <div className="k">Avaliações por mês</div>
                <div className="v">{m.avaliacoes > 0 ? m.avaliacoes : '-'}</div>
                <div className="d">{m.avaliacoes > 0 ? `cerca de ${m.avalSemana} por semana` : 'informe a conversão'}</div>
              </div>
              <div className="kpi hl">
                <div className="k">Leads por mês</div>
                <div className="v">{m.leads > 0 ? m.leads : '-'}</div>
                <div className="d">{m.leads > 0 ? `cerca de ${m.leadsSemana} por semana` : 'informe a conversão'}</div>
              </div>
            </div>
            <p className="sec-intro" style={{ marginTop: 0 }}>
              Você precisa de {m.alunosNec} alunos ativos para chegar a {brl(m.meta)} por mês.
              {m.leads > 0
                ? ` Isso pede ${m.vendas} vendas, ${m.avaliacoes} avaliações e ${m.leads} leads por mês, ou cerca de ${m.leadsSemana} leads por semana (mês de 4 semanas). Se você não consegue gerar esses leads, a meta ou o investimento em captação precisa mudar.`
                : ' Preencha as taxas de conversão para ver quantas avaliações e leads isso exige.'}
              {m.convVenda > 0 && m.convLead > 0 ? ` Taxas usadas: ${pct(m.convVenda, 0)} das avaliações viram venda e ${pct(m.convLead, 0)} dos leads viram avaliação.` : ''}
            </p>
          </div>
        ) : (
          <p className="sec-intro">Preencha a meta mensal e o ticket para converter a meta em alunos, avaliações e leads.</p>
        )}
      </section>
    </div>
  )
}
