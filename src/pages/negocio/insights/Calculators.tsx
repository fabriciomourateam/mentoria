import { Link } from 'react-router-dom'
import { Icon } from '../../../components/Icon'
import { brl, num, useWorkspace } from '../../../lib/workspace'
import { dreSerie, equilibrioCalc, precificacaoCalc, proLaboreCalc } from '../financas/calc'
import { trafegoCalc } from '../trafego/calc'
import './insights.css'

interface Card {
  key: string
  to: string
  label: string
  value: string | null
  note: string
}

/** Faixa "Calculadoras" do hub: números calculados ao vivo a partir do que o aluno já preencheu. */
export function Calculators() {
  const { get, readOnly } = useWorkspace()

  const dg = get('diagnostico')
  const fat = num(dg.faturamento_medio)
  const horas = num(dg.horas_semana)
  const alunosDg = num(dg.alunos_presenciais) + num(dg.alunos_online)

  const pl = proLaboreCalc(get('prolabore'))
  const dre = dreSerie(get('dre'), pl.necessario, num(get('prolabore').imposto))
  const dreTicket = [...dre].reverse().find((m) => m.ticketReal !== null)
  const ticket = dreTicket?.ticketReal ?? (fat > 0 && alunosDg > 0 ? fat / alunosDg : null)
  const ticketNote = dreTicket ? 'receita da DRE por aluno' : 'faturamento por aluno'

  const porHora = fat > 0 && horas > 0 ? fat / (horas * 4.33) : null
  const prec = precificacaoCalc(get('precificacao'), get)
  const pe = equilibrioCalc(get('equilibrio'), get).base.pe
  const tr = trafegoCalc(get('trafego'), get)

  const cards: Card[] = [
    { key: 'hora', to: '/negocio/diagnostico', label: 'Valor da sua hora', value: porHora !== null ? brl(porHora) : null, note: 'faturamento por hora trabalhada' },
    { key: 'ticket', to: '/negocio/diagnostico', label: 'Ticket médio', value: ticket !== null ? brl(ticket) : null, note: ticketNote },
    { key: 'min', to: '/negocio/precificacao', label: 'Preço mínimo do plano', value: prec.minimo > 0 ? brl(prec.minimo) : null, note: 'abaixo disso você perde' },
    { key: 'sug', to: '/negocio/precificacao', label: 'Preço sugerido', value: prec.sugestao > 0 ? brl(prec.sugestao) : null, note: 'mínimo com 20% de folga' },
    { key: 'pl', to: '/negocio/prolabore', label: 'Pró-labore necessário', value: pl.necessario > 0 ? brl(pl.necessario) : null, note: 'por mês, com margem' },
    { key: 'pe', to: '/negocio/equilibrio', label: 'Ponto de equilíbrio', value: pe != null ? `${pe} alunos` : null, note: 'para pagar tudo' },
    { key: 'cac', to: '/negocio/trafego', label: 'CAC máximo', value: tr.base ? brl(tr.cacMax) : null, note: 'teto por aluno novo' },
    { key: 'cpl', to: '/negocio/trafego', label: 'Custo máx. por lead', value: tr.base ? brl(tr.cplMax) : null, note: 'teto no anúncio' },
    { key: 'ltv', to: '/negocio/trafego', label: 'LTV', value: tr.ltv > 0 ? brl(tr.ltv) : null, note: 'ticket x meses de permanência' },
  ]

  return (
    <section className="calc-strip r">
      <div className="sh" style={{ margin: 0 }}>
        <h2>Calculadoras</h2>
      </div>
      <p className="ins-note">Calculadas com o que você já preencheu. Toque para ajustar os números.</p>
      <div className="calc-grid">
        {cards.map((c) => (
          <Link key={c.key} to={c.to} className={`calc-card ${c.value === null ? 'empty' : ''}`}>
            <span className="cl">{c.label}</span>
            {c.value !== null ? (
              <>
                <span className="cv">{c.value}</span>
                <span className="cnote">{c.note}</span>
              </>
            ) : (
              <span className="cta">
                {readOnly ? 'Sem dados' : 'Calcular'}
                {!readOnly && <Icon name="arrow" />}
              </span>
            )}
          </Link>
        ))}
      </div>
    </section>
  )
}
