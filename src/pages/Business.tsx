import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from '../components/Icon'
import { CTA, ProgressBar } from '../components/ui'
import { api } from '../lib/api'
import { useStore } from '../lib/store'
import { useWorkspace } from '../lib/workspace'
import { GROUPS, isReady, TOOLS } from './negocio/registry'

export function Business() {
  const { settings } = useStore()
  const ws = useWorkspace()
  const [leads, setLeads] = useState(0)

  useEffect(() => {
    api
      .listLeads()
      .then((l) => setLeads(l.length))
      .catch(() => setLeads(0))
  }, [])

  const tools = TOOLS.filter(isReady)
  const measured = tools.filter((t) => t.type !== 'guide')
  const overall = measured.length
    ? Math.round((measured.reduce((a, t) => a + Math.min(1, t.progress?.(ws.get, { leads }) ?? 0), 0) / measured.length) * 100)
    : 0

  return (
    <>
      <section className="hero split r">
        <div>
          <span className="eyebrow">Meu Negócio</span>
          <h1>Seu negócio inteiro, num lugar só.</h1>
          <p>
            Tudo o que você preenche nas aulas fica salvo aqui: oferta, script, números e leads. Revise quando quiser, sem
            procurar arquivo.
          </p>
        </div>
        <div className="ring" aria-hidden="true">
          <svg viewBox="0 0 188 188">
            <circle className="bg" cx="94" cy="94" r="84" />
            <circle
              className="fg"
              cx="94"
              cy="94"
              r="84"
              strokeDasharray={2 * Math.PI * 84}
              strokeDashoffset={2 * Math.PI * 84 * (1 - Math.max(overall, 1.5) / 100)}
            />
          </svg>
          <div className="c">
            <b>{overall}%</b>
            <span>do seu negócio no papel</span>
          </div>
        </div>
      </section>

      {GROUPS.map((g, gi) => {
        const items = tools.filter((t) => t.group === g.id)
        if (!items.length) return null
        return (
          <section key={g.id}>
            <div className="sh">
              <h2>{g.title}</h2>
            </div>
            <p className="muted" style={{ margin: '-6px 2px 12px', fontSize: 13.5 }}>
              {g.desc}
            </p>
            <div className="grid g3">
              {items.map((t, i) => {
                const p = t.type === 'guide' ? null : Math.round(Math.min(1, t.progress?.(ws.get, { leads }) ?? 0) * 100)
                return (
                  <Link key={t.key} to={`/negocio/${t.key}`} className="card tcard r" style={{ ['--i' as string]: gi * 2 + i }}>
                    <span className="top2">
                      <span className="chip-i">
                        <Icon name={t.icon} />
                      </span>
                      {p === null ? (
                        <span className="pill">Consulta</span>
                      ) : p >= 100 ? (
                        <span className="pill ok">
                          <Icon name="check" />
                          Pronto
                        </span>
                      ) : p > 0 ? (
                        <span className="pill acc">{p}%</span>
                      ) : (
                        <span className="pill">Começar</span>
                      )}
                    </span>
                    <h3>{t.title}</h3>
                    <p>{t.desc}</p>
                    {p !== null && p > 0 && p < 100 && <ProgressBar pct={p} />}
                  </Link>
                )
              })}
            </div>
          </section>
        )
      })}

      <div className="sh">
        <h2>Onde você opera</h2>
      </div>
      <div className="card tool r">
        <span className="ti">
          <Icon name="briefcase" />
        </span>
        <div style={{ flex: 1 }}>
          <h3>Seu MyShape</h3>
          <p>Monte treino e dieta no painel; seus alunos acompanham tudo pelo app com a sua marca.</p>
          <div style={{ marginTop: 12 }}>
            <CTA href={settings.myshape_url} variant="sm" icon="arrowUpRight">
              Abrir meu MyShape
            </CTA>
          </div>
        </div>
      </div>
    </>
  )
}
