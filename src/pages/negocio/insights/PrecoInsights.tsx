import { brl, useEntry, useWorkspace } from '../../../lib/workspace'
import { has, num, precificacaoCalc } from '../financas/calc'
import { Panel } from './Meter'

type Rel = { tone: 'ok' | 'warn' | 'bad'; label: string }

/** Quanto o preço pesa no bolso do aluno ideal: cabe, aperta ou não cabe. */
function cabe(preco: number, investimento: number): Rel {
  if (investimento >= preco) return { tone: 'ok', label: 'cabe no bolso do aluno ideal' }
  if (investimento >= preco * 0.8) return { tone: 'warn', label: 'aperta o bolso do aluno ideal' }
  return { tone: 'bad', label: 'não cabe no bolso do aluno ideal' }
}

const MESES: Record<string, number> = { mensal: 1, bimestral: 2, trimestral: 3, quadrimestral: 4, semestral: 6, anual: 12 }

/** Lê o texto livre de "Planos e condições" procurando duração e valor ("trimestral R$ 299/mês"). */
function lerPlanos(texto: unknown): { nome: string; meses: number; porMes: number; total: number }[] {
  if (typeof texto !== 'string') return []
  const out: { nome: string; meses: number; porMes: number; total: number }[] = []
  for (const parte of texto.split(/[;\n,]/)) {
    const m = parte.match(/(mensal|bimestral|trimestral|quadrimestral|semestral|anual)/i)
    const v = parte.match(/(\d[\d.]*(?:,\d+)?)/)
    if (!m || !v) continue
    const nome = m[1].toLowerCase()
    const meses = MESES[nome]
    const valor = num(v[1])
    if (!valor) continue
    const ehTotal = /total|à vista|a vista|pix/i.test(parte) && !/mês|mes/i.test(parte)
    const porMes = ehTotal ? valor / meses : valor
    out.push({ nome: nome[0].toUpperCase() + nome.slice(1), meses, porMes, total: porMes * meses })
  }
  return out
}

/** Painel da "Minha oferta": o preço em dia e semana, contra o mínimo e o bolso do aluno ideal. */
export function OfertaInsights() {
  const { data } = useEntry('oferta')
  const { get } = useWorkspace()
  if (!has(data.preco_mensal)) return null
  const preco = num(data.preco_mensal)
  if (preco <= 0) return null

  const minimo = precificacaoCalc(get('precificacao'), get).minimo
  const invest = num(get('aluno-ideal').investimento)
  const planos = lerPlanos(data.planos)

  return (
    <Panel title="O que o seu preço significa" intro="Calculado a partir do preço do plano mensal abaixo.">
      <div className="ins-stats s3">
        <div className="st">
          <div className="k">Por dia</div>
          <div className="v">{brl(preco / 30)}</div>
          <div className="d">preço ÷ 30 dias</div>
        </div>
        <div className="st">
          <div className="k">Por semana</div>
          <div className="v">{brl((preco * 12) / 52)}</div>
          <div className="d">preço x 12 ÷ 52</div>
        </div>
        <div className="st">
          <div className="k">Por mês</div>
          <div className="v">{brl(preco)}</div>
          <div className="d">plano mensal</div>
        </div>
      </div>
      <div className="ins-pills">
        {minimo > 0 ? (
          <span className={`pill ${preco + 0.005 >= minimo ? 'ok' : 'bad'}`}>
            {preco + 0.005 >= minimo ? 'acima do mínimo' : 'abaixo do mínimo'} de {brl(minimo)}
          </span>
        ) : (
          <span className="ins-note">Faça a Precificação para comparar com o preço mínimo.</span>
        )}
        {invest > 0 ? (
          (() => {
            const r = cabe(preco, invest)
            return <span className={`pill ${r.tone}`}>{r.label} ({brl(invest)})</span>
          })()
        ) : (
          <span className="ins-note">Preencha o investimento no Meu aluno ideal para ver se cabe no bolso dele.</span>
        )}
      </div>
      {planos.length > 0 && (
        <>
          <div className="ins-sub">Seus planos, lidos do texto</div>
          <div className="ins-cmp">
            {planos.map((p) => (
              <div key={p.nome}>
                <span className="l">
                  {p.nome}
                  <small style={{ display: 'block', fontSize: 12 }}>{brl(p.porMes)} por mês</small>
                </span>
                <span className="v">
                  {brl(p.total)}
                  {minimo > 0 && <small>{p.porMes + 0.005 >= minimo ? 'acima do mínimo' : 'abaixo do mínimo'}</small>}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </Panel>
  )
}

/** Painel do "Meu aluno ideal": o que ele investe contra o preço da oferta e o mínimo. */
export function AlunoIdealInsights() {
  const { data } = useEntry('aluno-ideal')
  const { get } = useWorkspace()
  if (!has(data.investimento)) return null
  const invest = num(data.investimento)
  if (invest <= 0) return null

  const of = get('oferta')
  const preco = has(of.preco_mensal) ? num(of.preco_mensal) : 0
  const minimo = precificacaoCalc(get('precificacao'), get).minimo

  return (
    <Panel title="Seu aluno ideal e o seu preço" intro="Compara o que ele consegue investir com o que você cobra.">
      <div className="ins-stats s3">
        <div className="st">
          <div className="k">Ele investe</div>
          <div className="v">{brl(invest)}</div>
          <div className="d">por mês</div>
        </div>
        <div className="st">
          <div className="k">Seu preço</div>
          <div className="v">{preco > 0 ? brl(preco) : '-'}</div>
          <div className="d">{preco > 0 ? 'da Minha oferta' : 'preencha a oferta'}</div>
        </div>
        <div className="st">
          <div className="k">Preço mínimo</div>
          <div className="v">{minimo > 0 ? brl(minimo) : '-'}</div>
          <div className="d">{minimo > 0 ? 'da Precificação' : 'faça a Precificação'}</div>
        </div>
      </div>
      <div className="ins-pills">
        {preco > 0 && <span className={`pill ${cabe(preco, invest).tone}`}>{cabe(preco, invest).label}</span>}
        {minimo > 0 && (
          <span className={`pill ${invest + 0.005 >= minimo ? 'ok' : 'bad'}`}>
            {invest + 0.005 >= minimo ? 'o bolso dele cobre o seu mínimo' : 'o bolso dele não cobre o seu mínimo'}
          </span>
        )}
      </div>
      {preco > invest && (
        <p className="ins-note">
          Seu preço passa o que ele investe em {brl(preco - invest)}. Ancore o valor no resultado, ofereça um plano mais longo ou revise o público.
        </p>
      )}
    </Panel>
  )
}
