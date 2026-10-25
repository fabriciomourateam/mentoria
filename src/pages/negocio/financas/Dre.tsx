import { useMemo, useState } from 'react'
import { brl, pct, useEntry, useWorkspace } from '../../../lib/workspace'
import type { FormSchema } from '../forms'
import { FieldInput, useCheckpointSync } from '../FormTool'
import type { ToolProgress } from '../types'
import { num, DRE_FIXOS, dreCalc, dreMeses, fmt, has, monthLabel, monthsBack, nowMonth, proLaboreCalc } from './calc'
import type { Data } from './calc'

const VARS = ['comissoes', 'trafego', 'var_outros']

/** Fração dos campos principais preenchidos no melhor mês. */
export const progress: ToolProgress = (get) => {
  const meses = dreMeses(get('dre'))
  let best = 0
  for (const m of Object.values(meses)) {
    const n = [has(m.receita), has(m.imposto), has(m.taxas), VARS.some((k) => has(m[k])), DRE_FIXOS.some((k) => has(m[k]))].filter(Boolean).length
    best = Math.max(best, n / 5)
  }
  return best
}

export default function Dre() {
  const { data, patch, state, readOnly } = useEntry<Data>('dre')
  const { get } = useWorkspace()
  const [mes, setMes] = useState(nowMonth)

  const meses = useMemo(() => dreMeses(data), [data])
  const pl = proLaboreCalc(get('prolabore'))
  const impSug = num(get('prolabore').imposto)
  const m = meses[mes] ?? {}
  const c = dreCalc(m, pl.necessario, impSug)
  const temReceita = c.receita > 0

  // Marca na aula: pró-labore calculado (f2) e DRE com receita preenchida (f3).
  const comReceita = Object.values(meses).some((x) => num(x.receita) > 0)
  const schema = useMemo<FormSchema>(
    () => ({
      sections: [],
      checkpoint: {
        slug: 'financas',
        position: 2,
        checked: () => [...(pl.necessario > 0 ? ['f2'] : []), ...(comReceita ? ['f3'] : [])],
      },
    }),
    [pl.necessario, comReceita],
  )
  useCheckpointSync(schema, data, readOnly ? 'idle' : state)

  const opcoes = useMemo(() => {
    const set = new Set([...monthsBack(24), ...Object.keys(meses), mes])
    return [...set].sort().reverse()
  }, [meses, mes])

  const setCampo = (id: string, v: unknown) => patch({ meses: { ...meses, [mes]: { ...m, [id]: v } } })
  const money = (id: string, label: string, placeholder = '0') =>
    ({ kind: 'money' as const, id, label, placeholder })

  const historico = Object.keys(meses)
    .filter((k) => num(meses[k].receita) > 0)
    .sort()
    .reverse()
    .map((k) => ({ k, ...dreCalc(meses[k], pl.necessario, impSug) }))

  const linha = (rotulo: string, valor: number, forte = false, menos = false) => (
    <tr>
      <td style={forte ? { fontWeight: 700, color: 'var(--ink)' } : undefined}>{rotulo}</td>
      <td style={{ textAlign: 'right', ...(forte ? { fontWeight: 700, color: 'var(--ink)' } : {}) }}>
        {menos && valor > 0 ? '- ' : ''}
        {brl(valor)}
      </td>
    </tr>
  )

  return (
    <div className="stack">
      <section className="card sec r" style={{ ['--i' as string]: 1 }}>
        <h2>Qual mês você está preenchendo?</h2>
        <p className="sec-intro">Cada mês fica salvo separado. Comece pelo último mês fechado.</p>
        <div className="sec-fields">
          <label className="field">
            <span>Mês</span>
            <select className="select" value={mes} onChange={(e) => setMes(e.target.value)} aria-label="Mês da DRE">
              {opcoes.map((k) => (
                <option key={k} value={k}>
                  {monthLabel(k)}
                  {num(meses[k]?.receita) > 0 ? ' (preenchido)' : ''}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      <fieldset className="stack ro-fieldset" disabled={readOnly}>
        <section className="card sec r" style={{ ['--i' as string]: 2 }}>
          <h2>Receita e impostos</h2>
          <p className="sec-intro">Exemplo da aula: receita de R$ 12.000 com 6% de imposto (percentual ilustrativo, confirme o seu com o contador).</p>
          <div className="sec-fields">
            <FieldInput field={money('receita', 'Receita bruta do mês', '12.000')} value={m.receita} onChange={(v) => setCampo('receita', v)} />
            <div className="grid g2">
              <FieldInput
                field={{
                  kind: 'percent',
                  id: 'imposto',
                  label: 'Imposto',
                  placeholder: impSug > 0 ? fmt(impSug) : '6',
                  hint: !has(m.imposto) && impSug > 0 ? 'Usando o imposto da Calculadora de Pró-labore.' : undefined,
                }}
                value={m.imposto}
                onChange={(v) => setCampo('imposto', v)}
              />
              <FieldInput
                field={money('taxas', 'Taxas de pagamento (R$)', '360')}
                value={m.taxas}
                onChange={(v) => setCampo('taxas', v)}
              />
            </div>
          </div>
        </section>

        <section className="card sec r" style={{ ['--i' as string]: 3 }}>
          <h2>Custos variáveis</h2>
          <p className="sec-intro">Crescem com as vendas. Não repita aqui as taxas de pagamento nem o imposto.</p>
          <div className="sec-fields">
            <div className="grid g3">
              <FieldInput field={money('comissoes', 'Comissões')} value={m.comissoes} onChange={(v) => setCampo('comissoes', v)} />
              <FieldInput field={money('trafego', 'Tráfego por venda')} value={m.trafego} onChange={(v) => setCampo('trafego', v)} />
              <FieldInput field={money('var_outros', 'Outros variáveis')} value={m.var_outros} onChange={(v) => setCampo('var_outros', v)} />
            </div>
          </div>
        </section>

        <section className="card sec r" style={{ ['--i' as string]: 4 }}>
          <h2>Custos fixos</h2>
          <p className="sec-intro">O pró-labore entra como custo da empresa. O que sobra é depois de você ser pago.</p>
          <div className="sec-fields">
            <FieldInput
              field={{
                kind: 'money',
                id: 'f_prolabore',
                label: 'Pró-labore',
                placeholder: pl.necessario > 0 ? fmt(pl.necessario) : '5.500',
                hint:
                  !has(m.f_prolabore) && pl.necessario > 0
                    ? `Usando o valor da Calculadora de Pró-labore: ${brl(pl.necessario)}. Digite o que você realmente tirou.`
                    : undefined,
              }}
              value={m.f_prolabore}
              onChange={(v) => setCampo('f_prolabore', v)}
            />
            <div className="grid g2">
              <FieldInput field={money('software', 'Software e ferramentas')} value={m.software} onChange={(v) => setCampo('software', v)} />
              <FieldInput field={money('contador', 'Contador')} value={m.contador} onChange={(v) => setCampo('contador', v)} />
              <FieldInput field={money('aluguel', 'Aluguel ou sala')} value={m.aluguel} onChange={(v) => setCampo('aluguel', v)} />
              <FieldInput field={money('marketing', 'Marketing fixo')} value={m.marketing} onChange={(v) => setCampo('marketing', v)} />
            </div>
            <FieldInput field={money('f_outros', 'Outros custos fixos')} value={m.f_outros} onChange={(v) => setCampo('f_outros', v)} />
          </div>
        </section>
      </fieldset>

      <section className="card sec r" style={{ ['--i' as string]: 5 }}>
        <h2>Resultado de {monthLabel(mes)}</h2>
        {temReceita ? (
          <div className="sec-fields">
            <div className="kpis">
              <div className="kpi">
                <div className="k">Receita líquida</div>
                <div className="v">{brl(c.liquida)}</div>
                <div className="d">receita menos imposto</div>
              </div>
              <div className="kpi">
                <div className="k">Margem de contribuição</div>
                <div className="v">{brl(c.mc)}</div>
                <div className="d">{pct(c.mcPct, 1)} da receita</div>
              </div>
              <div className="kpi hl">
                <div className="k">Resultado do mês</div>
                <div className="v">{brl(c.resultado)}</div>
                <div className="d">{pct(c.resultadoPct, 1)} da receita</div>
              </div>
            </div>
            <p className="sec-intro" style={{ marginTop: 0 }}>
              {c.resultado >= 0
                ? `Em ${monthLabel(mes)} sobraram ${brl(c.resultado)} depois de pagar todos os custos e o seu pró-labore de ${brl(c.prolabore)}.`
                : `Em ${monthLabel(mes)} faltaram ${brl(-c.resultado)} para pagar todos os custos e o seu pró-labore de ${brl(c.prolabore)}.`}
              {c.prolabore <= 0 && ' Atenção: sem pró-labore na conta, o resultado parece maior do que é.'}
            </p>
            <div className="md">
              <table>
                <tbody>
                  {linha('Receita bruta', c.receita)}
                  {linha('Impostos', c.impostoR, false, true)}
                  {linha('Taxas de pagamento', c.taxas, false, true)}
                  {linha('Custos variáveis', c.variaveis, false, true)}
                  {linha('Margem de contribuição', c.mc, true)}
                  {linha('Custos fixos (sem pró-labore)', c.fixosSem, false, true)}
                  {linha('Pró-labore', c.prolabore, false, true)}
                  {linha('Resultado do mês', c.resultado, true)}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <p className="sec-intro">Preencha a receita bruta do mês para ver a margem de contribuição e o resultado.</p>
        )}
      </section>

      {historico.length > 0 && (
        <section className="card sec r" style={{ ['--i' as string]: 6 }}>
          <h2>Histórico</h2>
          <p className="sec-intro">Os meses que você já preencheu. Toque em um mês para abrir.</p>
          <div className="sec-fields">
            <div className="md">
              <table className="cards">
                <thead>
                  <tr>
                    <th>Mês</th>
                    <th>Receita</th>
                    <th>Resultado</th>
                    <th>Resultado %</th>
                  </tr>
                </thead>
                <tbody>
                  {historico.map((h) => (
                    <tr key={h.k}>
                      <td data-label="Mês">
                        <button
                          type="button"
                          onClick={() => setMes(h.k)}
                          style={{ background: 'none', border: 'none', padding: 0, font: 'inherit', fontWeight: 700, color: 'var(--accent-ink)', textAlign: 'left', cursor: 'pointer', textDecoration: h.k === mes ? 'underline' : undefined }}
                        >
                          {monthLabel(h.k)}
                        </button>
                      </td>
                      <td data-label="Receita">{brl(h.receita)}</td>
                      <td data-label="Resultado">{brl(h.resultado)}</td>
                      <td data-label="Resultado %">{pct(h.resultadoPct, 1)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
