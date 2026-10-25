import { useMemo } from 'react'
import { Icon } from '../../../components/Icon'
import { brl, num, pct, useEntry } from '../../../lib/workspace'
import type { FormSchema } from '../forms'
import { FieldInput, useCheckpointSync } from '../FormTool'
import type { ToolProgress } from '../types'
import { has, proLaboreCalc } from './calc'
import type { Data } from './calc'

const MAIN = ['custo_vida', 'margem', 'receita', 'imposto', 'taxas', 'fixos', 'variaveis']
const filledAny = (v: unknown): boolean =>
  Array.isArray(v) ? v.some((r) => r && typeof r === 'object' && Object.values(r).some((x) => has(x))) : has(v)

export const progress: ToolProgress = (get) => {
  const d = get('prolabore')
  return MAIN.filter((k) => filledAny(d[k])).length / MAIN.length
}

const SUGESTOES = ['Moradia', 'Alimentação', 'Transporte', 'Saúde', 'Educação', 'Lazer', 'Outros']

export default function ProLabore() {
  const { data, patch, state, readOnly } = useEntry<Data>('prolabore')
  const c = proLaboreCalc(data)

  // Pró-labore calculado: marca o item "Definiu seu pró-labore mensal" da aula.
  const schema = useMemo<FormSchema>(
    () => ({ sections: [], checkpoint: { slug: 'financas', position: 2, checked: () => (c.necessario > 0 ? ['f2'] : []) } }),
    [c.necessario],
  )
  useCheckpointSync(schema, data, readOnly ? 'idle' : state)

  const vidaVazia = !filledAny(data.custo_vida)
  const aplicarSugestoes = () => patch({ custo_vida: SUGESTOES.map((item) => ({ item, valor: '' })) })

  return (
    <div className="stack">
      <fieldset className="stack ro-fieldset" disabled={readOnly}>
        <section className="card sec r" style={{ ['--i' as string]: 1 }}>
          <h2>Seu custo de vida</h2>
          <p className="sec-intro">
            Quanto você precisa para viver por mês. Exemplo da aula: moradia R$ 1.800, mercado R$ 1.200, transporte R$ 500, saúde R$ 400,
            lazer R$ 500, dívidas R$ 600 e reserva pessoal R$ 500, total de R$ 5.500.
          </p>
          <div className="sec-fields">
            <FieldInput
              field={{
                kind: 'list',
                id: 'custo_vida',
                label: 'Gastos pessoais do mês',
                hint: 'Moradia, alimentação, transporte, saúde, educação, lazer e outros.',
                addLabel: 'Adicionar gasto',
                startRows: 3,
                columns: [
                  { id: 'item', label: 'Item', kind: 'text', placeholder: 'Ex.: moradia' },
                  { id: 'valor', label: 'Valor por mês', kind: 'money' },
                ],
              }}
              value={data.custo_vida}
              onChange={(v) => patch({ custo_vida: v })}
            />
            {vidaVazia && (
              <button type="button" className="btn ghost sm" style={{ alignSelf: 'flex-start' }} onClick={aplicarSugestoes}>
                <span className="t">Usar os itens sugeridos</span>
                <span className="bi">
                  <Icon name="plus" />
                </span>
              </button>
            )}
            <FieldInput
              field={{
                kind: 'percent',
                id: 'margem',
                label: 'Margem de segurança',
                placeholder: '10',
                hint: 'Um colchão sobre o custo de vida, para imprevistos. Ex.: 10%.',
              }}
              value={data.margem}
              onChange={(v) => patch({ margem: v })}
            />
          </div>
        </section>

        <section className="card sec r" style={{ ['--i' as string]: 2 }}>
          <h2>A empresa consegue pagar?</h2>
          <p className="sec-intro">Compare o pró-labore com o que o negócio gera, depois de impostos, taxas e custos.</p>
          <div className="sec-fields">
            <FieldInput
              field={{ kind: 'money', id: 'receita', label: 'Receita média mensal', placeholder: '12.000', hint: 'A média dos últimos meses, não o melhor mês.' }}
              value={data.receita}
              onChange={(v) => patch({ receita: v })}
            />
            <div className="grid g2">
              <FieldInput
                field={{
                  kind: 'percent',
                  id: 'imposto',
                  label: 'Imposto sobre a receita',
                  placeholder: '6',
                  hint: 'Percentual de exemplo. Confirme o seu com o contador.',
                }}
                value={data.imposto}
                onChange={(v) => patch({ imposto: v })}
              />
              <FieldInput
                field={{
                  kind: 'percent',
                  id: 'taxas',
                  label: 'Taxas de pagamento',
                  placeholder: '3',
                  hint: 'Cartão, gateway e Pix, em % da receita.',
                }}
                value={data.taxas}
                onChange={(v) => patch({ taxas: v })}
              />
            </div>
            <FieldInput
              field={{
                kind: 'list',
                id: 'fixos',
                label: 'Custos fixos do negócio',
                hint: 'O que você paga vendendo ou não: sala, software, contador.',
                addLabel: 'Adicionar custo',
                startRows: 2,
                columns: [
                  { id: 'item', label: 'Item', kind: 'text', placeholder: 'Ex.: software' },
                  { id: 'valor', label: 'Valor por mês', kind: 'money' },
                ],
              }}
              value={data.fixos}
              onChange={(v) => patch({ fixos: v })}
            />
            <FieldInput
              field={{
                kind: 'money',
                id: 'variaveis',
                label: 'Custos variáveis do mês',
                placeholder: '2.000',
                hint: 'Tráfego, comissões e outros que crescem com as vendas (sem imposto e taxas, já contados acima).',
              }}
              value={data.variaveis}
              onChange={(v) => patch({ variaveis: v })}
            />
          </div>
        </section>
      </fieldset>

      <section className="card sec r" style={{ ['--i' as string]: 3 }}>
        <h2>Resultado</h2>
        {c.necessario > 0 ? (
          <div className="sec-fields">
            <div className="kpis">
              <div className="kpi hl">
                <div className="k">Pró-labore necessário</div>
                <div className="v">{brl(c.necessario)}</div>
                <div className="d">
                  por mês{c.margem > 0 ? `, com ${pct(c.margem, 1)} de margem` : ''}
                </div>
              </div>
              <div className="kpi">
                <div className="k">Custo de vida</div>
                <div className="v">{brl(c.vida)}</div>
                <div className="d">soma dos seus gastos</div>
              </div>
            </div>
            <p className="sec-intro" style={{ marginTop: 0 }}>
              Para viver com tranquilidade você precisa tirar {brl(c.necessario)} por mês da empresa.
            </p>
          </div>
        ) : (
          <p className="sec-intro">Liste seus gastos pessoais acima para ver quanto você precisa tirar por mês.</p>
        )}

        {c.necessario > 0 && c.receita > 0 && (
          <div className="sec-fields">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <b style={{ fontSize: 15 }}>A empresa consegue pagar?</b>
              {c.veredito && <span className={`pill ${c.veredito.tone}`}>{c.veredito.label}</span>}
            </div>
            <div className="kpis">
              <div className="kpi">
                <div className="k">Disponível para pagar você</div>
                <div className="v">{brl(c.disponivel)}</div>
                <div className="d">receita menos impostos, taxas e custos</div>
              </div>
              <div className="kpi">
                <div className="k">{c.sobra >= 0 ? 'Sobra' : 'Falta'}</div>
                <div className="v">{brl(Math.abs(c.sobra))}</div>
                <div className="d">depois do pró-labore</div>
              </div>
              <div className="kpi">
                <div className="k">Sobra sobre a receita</div>
                <div className="v">{pct(c.sobraPct, 1)}</div>
                <div className="d">abaixo de 10% é aperto</div>
              </div>
              <div className="kpi hl">
                <div className="k">Receita mensal necessária</div>
                <div className="v">{c.receitaNec != null ? brl(c.receitaNec) : 'Sem solução'}</div>
                <div className="d">para fechar a conta</div>
              </div>
            </div>
            <p className="sec-intro" style={{ marginTop: 0 }}>
              {c.sobra < 0
                ? `Hoje o negócio gera ${brl(c.disponivel)} para pagar você, e o pró-labore é ${brl(c.necessario)}. Faltam ${brl(-c.sobra)} por mês: reduza o pró-labore por um tempo ou aumente a receita.`
                : c.veredito?.tone === 'warn'
                  ? `Depois de pagar você, sobram só ${brl(c.sobra)} (${pct(c.sobraPct, 1)} da receita). Dá para pagar, mas qualquer mês fraco aperta.`
                  : `Depois de pagar você, ainda sobram ${brl(c.sobra)} (${pct(c.sobraPct, 1)} da receita) para reserva e reinvestimento.`}
              {c.receitaNec != null && num(data.receita) > 0 && ` Para fechar a conta com folga zero, você precisa faturar cerca de ${brl(c.receitaNec)} por mês.`}
            </p>
          </div>
        )}
        {c.necessario > 0 && c.receita <= 0 && (
          <p className="sec-intro" style={{ marginTop: 12 }}>
            Preencha a receita média e os custos do negócio para saber se a empresa consegue pagar esse valor.
          </p>
        )}
        <p className="sec-intro" style={{ marginTop: 12 }}>
          Encargos e impostos sobre o pró-labore variam: confirme com o seu contador como lançar e quanto você leva líquido.
        </p>
      </section>
    </div>
  )
}
