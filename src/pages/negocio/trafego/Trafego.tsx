import { HBars } from '../../../components/charts'
import { brl, pct, useEntry, useWorkspace } from '../../../lib/workspace'
import { FieldInput } from '../FormTool'
import { fmt, has, num, precoMensal } from '../financas/calc'
import type { Data, Get } from '../financas/calc'

const CAC_SHARE = 0.3

export function progress(get: (key: string) => Record<string, unknown>): number {
  const d = get('trafego')
  const ticket = has(d.ticket) || precoMensal(get as Get) > 0
  const n = [ticket, has(d.meses), has(d.margem), has(d.conv_venda), has(d.orcamento)].filter(Boolean).length
  return n / 5
}

function calc(d: Data, get: Get) {
  const ticketSug = precoMensal(get)
  const ticket = has(d.ticket) ? num(d.ticket) : ticketSug
  const meses = num(d.meses)
  const margem = num(d.margem) / 100
  const convVenda = num(d.conv_venda) / 100
  const convConversa = has(d.conv_conversa) ? num(d.conv_conversa) / 100 : 1
  const orcamento = num(d.orcamento)
  const cpl = num(d.cpl)

  const ltv = ticket * meses
  const margemAluno = ltv * margem
  const cacMax = margemAluno * CAC_SHARE
  const leadVenda = convConversa * convVenda
  const cplMax = cacMax * leadVenda
  const cpcMax = cacMax * convVenda

  const gasto = orcamento * 30
  const cplUsado = cpl > 0 ? cpl : cplMax
  const leads = cplUsado > 0 ? gasto / cplUsado : 0
  const conversas = leads * convConversa
  const vendas = conversas * convVenda
  const fatNovo = vendas * ticket
  const retorno = vendas * ltv
  const roas = gasto > 0 ? retorno / gasto : 0
  const cacReal = vendas > 0 ? gasto / vendas : 0

  const base = ltv > 0 && margem > 0 && convVenda > 0
  let veredito: { tone: 'ok' | 'warn' | 'bad'; label: string } | null = null
  if (base && cpl > 0 && cplMax > 0) {
    veredito =
      cpl <= cplMax
        ? { tone: 'ok', label: 'dentro do máximo' }
        : cpl <= cplMax * 1.3
          ? { tone: 'warn', label: 'no limite' }
          : { tone: 'bad', label: 'acima do máximo' }
  }
  return { ticketSug, ticket, ltv, margemAluno, cacMax, cplMax, cpcMax, leadVenda, gasto, cplUsado, leads, conversas, vendas, fatNovo, roas, cacReal, base, veredito, usouMax: cpl <= 0 }
}

export default function Trafego() {
  const { data, patch, readOnly } = useEntry<Data>('trafego')
  const { get } = useWorkspace()
  const c = calc(data, get)
  const pronto = c.base && c.gasto > 0

  return (
    <div className="stack">
      <fieldset className="stack ro-fieldset" disabled={readOnly}>
        <section className="card sec r" style={{ ['--i' as string]: 1 }}>
          <h2>Seus números</h2>
          <p className="sec-intro">
            Exemplo da aula: ticket de R$ 300 por mês, 6 meses de permanência e 70% de margem dão LTV de R$ 1.800 e CAC máximo de R$ 378.
          </p>
          <div className="sec-fields">
            <div className="grid g2">
              <FieldInput
                field={{
                  kind: 'money',
                  id: 'ticket',
                  label: 'Ticket mensal',
                  placeholder: c.ticketSug > 0 ? fmt(c.ticketSug) : '300',
                  hint: !has(data.ticket) && c.ticketSug > 0 ? `Usando o preço mensal da Precificação: ${brl(c.ticketSug)}.` : 'Quanto o aluno paga por mês.',
                }}
                value={data.ticket}
                onChange={(v) => patch({ ticket: v })}
              />
              <FieldInput
                field={{ kind: 'number', id: 'meses', label: 'Meses médios de permanência', placeholder: '6', hint: 'Sem histórico, use 4.' }}
                value={data.meses}
                onChange={(v) => patch({ meses: v })}
              />
            </div>
            <div className="grid g2">
              <FieldInput
                field={{ kind: 'percent', id: 'margem', label: 'Margem (%)', placeholder: '70', hint: 'O que sobra depois de taxas, impostos e custo de entrega.' }}
                value={data.margem}
                onChange={(v) => patch({ margem: v })}
              />
              <FieldInput
                field={{ kind: 'percent', id: 'conv_venda', label: 'Conversa para venda (%)', placeholder: '15', hint: 'De cada 100 conversas, quantas viram aluno.' }}
                value={data.conv_venda}
                onChange={(v) => patch({ conv_venda: v })}
              />
            </div>
            <div className="grid g2">
              <FieldInput
                field={{ kind: 'percent', id: 'conv_conversa', label: 'Lead para conversa (%)', placeholder: '60', hint: 'Dos cliques ou cadastros, quantos realmente conversam. Vazio vale 100%.' }}
                value={data.conv_conversa}
                onChange={(v) => patch({ conv_conversa: v })}
              />
              <FieldInput
                field={{ kind: 'money', id: 'orcamento', label: 'Orçamento diário', placeholder: '30', hint: 'Comece com R$ 20 a R$ 50 por dia.' }}
                value={data.orcamento}
                onChange={(v) => patch({ orcamento: v })}
              />
            </div>
            <FieldInput
              field={{ kind: 'money', id: 'cpl', label: 'Custo por lead atual (opcional)', placeholder: c.cplMax > 0 ? fmt(c.cplMax) : '25', hint: 'Do gerenciador de anúncios. Em branco, a projeção usa o custo máximo.' }}
              value={data.cpl}
              onChange={(v) => patch({ cpl: v })}
            />
          </div>
        </section>
      </fieldset>

      <section className="card sec r" style={{ ['--i' as string]: 2 }}>
        <h2>Quanto você pode pagar</h2>
        {c.base ? (
          <div className="sec-fields">
            <div className="kpis">
              <div className="kpi">
                <div className="k">LTV</div>
                <div className="v">{brl(c.ltv)}</div>
                <div className="d">ticket x meses</div>
              </div>
              <div className="kpi hl">
                <div className="k">CAC máximo</div>
                <div className="v">{brl(c.cacMax)}</div>
                <div className="d">{pct(CAC_SHARE, 0)} da margem do aluno</div>
              </div>
              <div className="kpi">
                <div className="k">Custo máx. por conversa</div>
                <div className="v">{brl(c.cpcMax)}</div>
                <div className="d">CAC máximo x conversa para venda</div>
              </div>
              <div className="kpi">
                <div className="k">Custo máx. por lead</div>
                <div className="v">{brl(c.cplMax)}</div>
                <div className="d">taxa lead para venda {pct(c.leadVenda, 1)}</div>
              </div>
            </div>
            <p className="sec-intro" style={{ marginTop: 0 }}>
              O CAC máximo é {pct(CAC_SHARE, 0)} da margem que o aluno deixa ({brl(c.margemAluno)}). Os outros 70% pagam suas contas, seu pró-labore e o lucro. É um teto, não uma meta: mire abaixo dele.
            </p>
            {c.veredito && (
              <p style={{ margin: 0 }}>
                Seu custo por lead de {brl(num(data.cpl))} está <span className={`pill ${c.veredito.tone}`}>{c.veredito.label}</span> (máximo de {brl(c.cplMax)}).
              </p>
            )}
          </div>
        ) : (
          <p className="sec-intro">Preencha o ticket, os meses de permanência, a margem e a conversa para venda para ver o seu teto de custo.</p>
        )}
      </section>

      <section className="card sec r" style={{ ['--i' as string]: 3 }}>
        <h2>O que esperar por mês</h2>
        {pronto && c.cplUsado > 0 ? (
          <div className="sec-fields">
            <p className="sec-intro" style={{ marginTop: 0 }}>
              {c.usouMax
                ? `Projeção com o custo por lead no máximo (${brl(c.cplUsado)}), o pior caso que ainda fecha a conta.`
                : `Projeção com o seu custo por lead atual (${brl(c.cplUsado)}).`}{' '}
              Investindo {brl(c.gasto)} no mês.
            </p>
            <HBars
              rows={[
                { label: 'Leads', value: c.leads, tone: 'muted' },
                { label: 'Conversas', value: c.conversas, tone: 'accent' },
                { label: 'Vendas', value: c.vendas, tone: 'ok' },
              ]}
              format={(n) => fmt(n, 1)}
            />
            <div className="kpis">
              <div className="kpi">
                <div className="k">Vendas por mês</div>
                <div className="v">{fmt(c.vendas, 1)}</div>
                <div className="d">alunos novos</div>
              </div>
              <div className="kpi hl">
                <div className="k">Faturamento novo</div>
                <div className="v">{brl(c.fatNovo)}</div>
                <div className="d">por mês, só dos alunos novos</div>
              </div>
              <div className="kpi">
                <div className="k">Retorno estimado</div>
                <div className="v">{fmt(c.roas, 1)}x</div>
                <div className="d">receita no LTV sobre o gasto</div>
              </div>
              <div className="kpi">
                <div className="k">CAC projetado</div>
                <div className="v">{c.vendas > 0 ? brl(c.cacReal) : '-'}</div>
                <div className="d">gasto por aluno novo</div>
              </div>
            </div>
            <p className="sec-intro" style={{ marginTop: 0 }}>
              São estimativas a partir das suas taxas, não promessa de resultado. Troque pelas taxas reais assim que tiver 20 a 30 conversas.
            </p>
          </div>
        ) : (
          <p className="sec-intro">Preencha o orçamento diário para ver leads, conversas, vendas e o retorno esperado.</p>
        )}
      </section>
    </div>
  )
}
