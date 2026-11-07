import { useEffect, useState } from 'react'
import { Icon } from '../../components/Icon'
import { CTA } from '../../components/ui'
import { api } from '../../lib/api'
import { fmtDateTime } from '../../lib/dates'
import type { Call } from '../../lib/types'
import { isLive, pickNext, relativeDay, useNow } from './callUtils'
import './calls.css'

/** Próxima call + estado "ao vivo", para a Home. */
export function useNextCall(): { call: Call | null; live: boolean; loading: boolean } {
  const [calls, setCalls] = useState<Call[] | null>(null)
  const now = useNow()
  useEffect(() => {
    let alive = true
    api
      .listCalls()
      .then((l) => {
        if (alive) setCalls(l)
      })
      .catch(() => {
        if (alive) setCalls([])
      })
    return () => {
      alive = false
    }
  }, [])
  const call = calls ? pickNext(calls, now) : null
  return { call, live: !!call && isLive(call, now), loading: calls === null }
}

export function NextCallCard() {
  const { call, live, loading } = useNextCall()
  const now = useNow()
  if (loading || !call) return null
  return (
    <section className={`card nextcall r${live ? ' live' : ''}`}>
      <span className="chip-i">
        <Icon name="users" />
      </span>
      <div className="tx">
        <span className="nc-ey">
          {live ? (
            <>
              <i className="call-dot" /> Ao vivo agora
            </>
          ) : (
            `Próxima call · ${relativeDay(call.starts_at, now)}`
          )}
        </span>
        <b>{call.title}</b>
        <span className="nc-when">{fmtDateTime(call.starts_at)}</span>
      </div>
      {live && call.meet_url ? (
        <CTA href={call.meet_url} icon="external" variant="sm">
          Entrar no Meet
        </CTA>
      ) : (
        <CTA to="/calls" variant="ghost sm">
          Ver detalhes
        </CTA>
      )}
    </section>
  )
}
