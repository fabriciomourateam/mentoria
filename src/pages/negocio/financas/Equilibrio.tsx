import { brl, pct, useEntry, useWorkspace } from '../../../lib/workspace'
import { FieldInput } from '../FormTool'
import type { ToolProgress } from '../types'
import { equilibrioCalc, fmt, has } from './calc'
import type { Data } from './calc'

export const progress: ToolProgress = (get) => {
  const d = get('equilibrio')
  const n = [has(d.fixos), has(d.preco), has(d.var_rs) || has(d.var_pct)].filter(Boolean).length
  return n / 3
}

export default function Equilibrio() {
  const { data, patch, readOnly } = useEntry<Data>('equilibrio')
  const { get } = useWorkspace()
  const c = equilibrioCalc(data, get)
  const base = c.base
  const pronto = base.pe != null

  const fixosHint = !has(data.fixos)
    ? c.fixosSrc === 'precificacao'
      ? `Usando os custos e o pró-labore da Precificação: ${brl(c.fixosSug)}. Digite outro valor para trocar.`
      : c.fixosSrc === 'dre'
        ? `Usando os custos fixos do último mês da DRE: ${brl(c.fixosSug)}. Digite outro valor para trocar.`
        : 'Custos fixos do negócio mais o seu pró-labore. Exemplo da aula: R$ 6.900.'
    : 'Custos fixos do negócio mais o seu pró-labore.'

  return (
    <div className="stack">
      <fieldset className="stack ro-fieldset" disabled={readOnly}>
        <section className="card sec r" style={{ ['--i' as string]: 1 }}>
          <h2>Seus números</h2>
          <p className="sec-intro">
            Exemplo da aula: R$ 6.900 de custos fixos, preço de R$ 300 e R$ 97 de custo variável por aluno dão margem de R$ 203 e 34 alunos no equilíbrio.
          </p>
          <div className="sec-fields">
            <FieldInput
              field={{ kind: 'money', id: 'fixos', label: 'Custos fixos totais por mês', placeholder: c.fixosSug > 0 ? fmt(c.fixosSug) : '6.900', hint: fixosHint }}
              value={data.fixos}
              onChange={(v) => patch({ fixos: v })}
            />
            <FieldInput
              field={{
                kind: 'money',
                id: 'preco',
                label: 'Preço médio por aluno',
                placeholder: c.precoSug > 0 ? fmt(c.precoSug) : '300',
                hint: !has(data.preco) && c.precoSug > 0 ? `Usando o preço mensal da Precificação: ${brl(c.precoSug)}.` : 'O valor que cada aluno paga por mês.',
              }}
              value={data.preco}
              onChange={(v) => patch({ preco: v })}
            />
            <div className="grid g2">
              <FieldInput
                field={{ kind: 'money', id: 'var_rs', label: 'Custo variável por aluno (R$)', placeholder: '40', hint: 'Tráfego rateado, comissão, ferramenta por aluno.' }}
                value={data.var_rs}
                onChange={(v) => patch({ var_rs: v })}
              />
              <FieldInput
                field={{
                  kind: 'percent',
                  id: 'var_pct',
                  label: 'Custo variável (% do preço)',
                  placeholder: c.varPctSug > 0 ? fmt(c.varPctSug) : '9',
                  hint: !has(data.var_pct) && c.varPctSug > 0 ? 'Usando taxa e imposto da Precificação.' : 'Taxa de pagamento e imposto. Confirme o imposto com o contador.',
                }}
                value={data.var_pct}
                onChange={(v) => patch({ var_pct: v })}
              />
            </div>
          </div>
        </section>
      </fieldset>

      <section className="card sec r" style={{ ['--i' as string]: 2 }}>
        <h2>Resultado</h2>
        {pronto ? (
          <div className="sec-fields">
            <div className="kpis">
              <div className="kpi">
                <div className="k">Margem por aluno</div>
                <div className="v">{brl(base.margem)}</div>
                <div className="d">{pct(base.margemPct, 1)} do preço</div>
              </div>
              <div className="kpi hl">
                <div className="k">Ponto de equilíbrio</div>
                <div className="v">{base.pe} alunos</div>
                <div className="d">ativos, por mês</div>
              </div>
            </div>
            <p className="sec-intro" style={{ marginTop: 0 }}>
              Você precisa de {base.pe} alunos ativos para pagar tudo. Abaixo disso você está pagando para trabalhar; acima, cada aluno extra rende {brl(base.margem)} de lucro.
            </p>
            <b style={{ fontSize: 15 }}>E se você baixar o preço?</b>
            <div className="md">
              <table className="cards">
                <thead>
                  <tr>
                    <th>Cenário</th>
                    <th>Preço</th>
                    <th>Margem por aluno</th>
                    <th>Alunos no equilíbrio</th>
                    <th>A mais</th>
                  </tr>
                </thead>
                <tbody>
                  {c.sims.map((s) => (
                    <tr key={s.desc}>
                      <td data-label="Cenário">{s.desc === 0 ? 'Preço atual' : `Preço ${s.desc * 100}% menor`}</td>
                      <td data-label="Preço">{brl(s.price)}</td>
                      <td data-label="Margem por aluno">{brl(s.margem)}</td>
                      <td data-label="Alunos no equilíbrio">{s.pe != null ? s.pe : 'Não fecha'}</td>
                      <td data-label="A mais">{s.desc === 0 ? '-' : s.pe != null ? `+${s.pe - (base.pe ?? 0)}` : '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {c.sims[1].pe != null && (
              <p className="sec-intro" style={{ marginTop: 0 }}>
                Com 10% de desconto você precisa de {c.sims[1].pe - (base.pe ?? 0)} alunos a mais
                {c.sims[2].pe != null ? `; com 20%, de ${c.sims[2].pe - (base.pe ?? 0)} a mais` : '; com 20%, a conta não fecha'}. Antes de dar desconto, veja se você consegue atender esses alunos.
              </p>
            )}
          </div>
        ) : (
          <p className="sec-intro">
            {base.margem <= 0 && base.price > 0
              ? 'Com esses custos variáveis a margem por aluno fica zerada ou negativa. Revise o preço ou os custos.'
              : 'Preencha os custos fixos, o preço e o custo variável por aluno para ver quantos alunos você precisa.'}
          </p>
        )}
      </section>
    </div>
  )
}
