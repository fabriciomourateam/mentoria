import { brl, pct, useEntry, useWorkspace } from '../../../lib/workspace'
import { FieldInput } from '../FormTool'
import type { ToolProgress } from '../types'
import { fmt, has, precificacaoCalc } from './calc'
import type { Data } from './calc'

const MAIN = ['custos', 'prolabore', 'capacidade', 'taxa', 'imposto', 'preco_mensal']
const filledAny = (v: unknown): boolean =>
  Array.isArray(v) ? v.some((r) => r && typeof r === 'object' && Object.values(r).some((x) => has(x))) : has(v)

export const progress: ToolProgress = (get) => {
  const d = get('precificacao')
  return MAIN.filter((k) => filledAny(d[k])).length / MAIN.length
}

export default function Precificacao() {
  const { data, patch, readOnly } = useEntry<Data>('precificacao')
  const { get } = useWorkspace()
  const c = precificacaoCalc(data, get)
  const pronto = c.minimo > 0

  return (
    <div className="stack">
      <fieldset className="stack ro-fieldset" disabled={readOnly}>
        <section className="card sec r" style={{ ['--i' as string]: 1 }}>
          <h2>Quanto o negócio precisa</h2>
          <p className="sec-intro">
            Exemplo da aula: custos de R$ 1.800, pró-labore de R$ 6.000 e 30 alunos dão um piso de R$ 260 por aluno.
          </p>
          <div className="sec-fields">
            <FieldInput
              field={{
                kind: 'list',
                id: 'custos',
                label: 'Custos fixos do negócio',
                hint: 'Sala, software, contador, marketing fixo. Sem o seu pró-labore.',
                addLabel: 'Adicionar custo',
                startRows: 3,
                columns: [
                  { id: 'item', label: 'Item', kind: 'text', placeholder: 'Ex.: sala' },
                  { id: 'valor', label: 'Valor por mês', kind: 'money' },
                ],
              }}
              value={data.custos}
              onChange={(v) => patch({ custos: v })}
            />
            <FieldInput
              field={{
                kind: 'money',
                id: 'prolabore',
                label: 'Pró-labore desejado',
                placeholder: c.plSug > 0 ? fmt(c.plSug) : '6.000',
                hint:
                  !c.plOwn && c.plSug > 0
                    ? `Usando o valor da Calculadora de Pró-labore: ${brl(c.plSug)}. Digite outro valor para trocar.`
                    : 'Quanto você quer tirar por mês. Faça a conta na Calculadora de Pró-labore.',
              }}
              value={data.prolabore}
              onChange={(v) => patch({ prolabore: v })}
            />
            <FieldInput
              field={{
                kind: 'number',
                id: 'capacidade',
                label: 'Capacidade realista de alunos ativos',
                placeholder: '30',
                hint: 'Quantos você atende bem, com check-in e ajuste. Não use o máximo teórico.',
              }}
              value={data.capacidade}
              onChange={(v) => patch({ capacidade: v })}
            />
            <div className="grid g2">
              <FieldInput
                field={{
                  kind: 'percent',
                  id: 'taxa',
                  label: 'Taxa de pagamento',
                  placeholder: c.taxaSug > 0 ? fmt(c.taxaSug) : '3',
                  hint: !has(data.taxa) && c.taxaSug > 0 ? 'Usando a taxa da Calculadora de Pró-labore.' : 'Cartão, gateway e Pix.',
                }}
                value={data.taxa}
                onChange={(v) => patch({ taxa: v })}
              />
              <FieldInput
                field={{
                  kind: 'percent',
                  id: 'imposto',
                  label: 'Imposto',
                  placeholder: c.impSug > 0 ? fmt(c.impSug) : '6',
                  hint: !has(data.imposto) && c.impSug > 0 ? 'Usando o imposto da Calculadora de Pró-labore.' : 'Confirme o seu percentual com o contador.',
                }}
                value={data.imposto}
                onChange={(v) => patch({ imposto: v })}
              />
            </div>
          </div>
        </section>

        <section className="card sec r" style={{ ['--i' as string]: 2 }}>
          <h2>Seus planos</h2>
          <p className="sec-intro">Planos mais longos têm desconto no valor por mês. Veja se cada um ainda fica acima do preço mínimo.</p>
          <div className="sec-fields">
            <FieldInput
              field={{
                kind: 'money',
                id: 'preco_mensal',
                label: 'Preço do plano mensal',
                placeholder: c.sugestao > 0 ? fmt(c.sugestao) : '349',
                hint: !has(data.preco_mensal) && c.sugestao > 0 ? `Sugestão: preço mínimo com 20% de folga, ${brl(c.sugestao)}. Digite o seu preço.` : undefined,
              }}
              value={data.preco_mensal}
              onChange={(v) => patch({ preco_mensal: v })}
            />
            <div className="grid g2">
              <FieldInput
                field={{ kind: 'percent', id: 'desc_tri', label: 'Desconto do trimestral', placeholder: '10', hint: 'Sobre o valor por mês do plano mensal.' }}
                value={data.desc_tri}
                onChange={(v) => patch({ desc_tri: v })}
              />
              <FieldInput
                field={{ kind: 'percent', id: 'desc_sem', label: 'Desconto do semestral', placeholder: '15', hint: 'Sobre o valor por mês do plano mensal.' }}
                value={data.desc_sem}
                onChange={(v) => patch({ desc_sem: v })}
              />
            </div>
          </div>
        </section>
      </fieldset>

      <section className="card sec r" style={{ ['--i' as string]: 3 }}>
        <h2>Resultado</h2>
        {pronto ? (
          <div className="sec-fields">
            <div className="kpis">
              <div className="kpi">
                <div className="k">Piso por aluno</div>
                <div className="v">{brl(c.piso)}</div>
                <div className="d">antes de taxa e imposto</div>
              </div>
              <div className="kpi hl">
                <div className="k">Preço mínimo</div>
                <div className="v">{brl(c.minimo)}</div>
                <div className="d">por aluno, por mês</div>
              </div>
            </div>
            <p className="sec-intro" style={{ marginTop: 0 }}>
              Seus custos de {brl(c.fixos)} mais o pró-labore de {brl(c.prolabore)}, divididos por {fmt(c.capacidade)} alunos, dão{' '}
              {brl(c.piso)} por aluno. Descontando {pct(c.taxa + c.imposto, 1)} de taxa e imposto, o preço mínimo é {brl(c.minimo)}. Cobrar menos
              que isso é pagar para trabalhar.
            </p>
            <div className="md">
              <table className="cards">
                <thead>
                  <tr>
                    <th>Plano</th>
                    <th>Por mês</th>
                    <th>Total do plano</th>
                    <th>Desconto</th>
                    <th>Situação</th>
                  </tr>
                </thead>
                <tbody>
                  {c.planos.map((p) => (
                    <tr key={p.nome}>
                      <td data-label="Plano">{p.nome}</td>
                      <td data-label="Por mês">{brl(p.porMes)}</td>
                      <td data-label="Total do plano">{brl(p.total)}</td>
                      <td data-label="Desconto">{p.desc > 0 ? pct(p.desc / 100, 1) : '-'}</td>
                      <td data-label="Situação">
                        <span className={`pill ${p.ok ? 'ok' : 'bad'}`}>{p.ok ? 'acima do mínimo' : 'abaixo do mínimo'}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {c.planos.some((p) => !p.ok) && (
              <div className="note">
                <b>Atenção:</b> algum plano ficou abaixo do mínimo. Reduza o desconto dele ou suba o preço do mensal antes de oferecer.
              </div>
            )}
          </div>
        ) : (
          <p className="sec-intro">Preencha os custos, o pró-labore e a capacidade de alunos para ver o piso e o preço mínimo.</p>
        )}
      </section>
    </div>
  )
}
