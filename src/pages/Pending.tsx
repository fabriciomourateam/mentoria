import { Navigate, useNavigate } from 'react-router-dom'
import { Brand } from '../components/Layout'
import { Icon } from '../components/Icon'
import { CTA } from '../components/ui'
import { api } from '../lib/api'
import { firstName } from '../lib/derive'
import { useStore } from '../lib/store'

export function Pending() {
  const { me, refreshMe, toast } = useStore()
  const nav = useNavigate()
  if (!me) return <Navigate to="/entrar" replace />
  if (me.hasAccess) return <Navigate to="/" replace />

  const st = me.enrollment?.status
  const expired = st === 'active' && me.enrollment?.expires_at && new Date(me.enrollment.expires_at) <= new Date()
  const title =
    st === 'paused' ? 'Seu acesso está pausado.' : st === 'canceled' || expired ? 'Seu acesso foi encerrado.' : 'Cadastro recebido.'
  const text =
    st === 'paused' || st === 'canceled' || expired
      ? 'Fale com a equipe da mentoria para reativar. Assim que liberarem, é só voltar aqui.'
      : 'Seu acesso está aguardando liberação pela equipe. Assim que for liberado, tudo aparece aqui automaticamente.'

  return (
    <div className="wrap" style={{ maxWidth: 560, paddingTop: 28, paddingBottom: 40 }}>
      <Brand />
      <div className="bezel r" style={{ marginTop: 28 }}>
        <div className="card empty" style={{ padding: '40px 26px' }}>
          <div className="ei">
            <Icon name="hourglass" />
          </div>
          <h3 className="dsp" style={{ fontSize: 24 }}>
            {firstName(me.profile.full_name) ? `${firstName(me.profile.full_name)}, ` : ''}
            {title.charAt(0).toLowerCase() + title.slice(1)}
          </h3>
          <p>{text}</p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', marginTop: 20 }}>
            <CTA
              icon="arrow"
              onClick={async () => {
                await refreshMe()
                toast('Verificado. Ainda aguardando liberação.')
              }}
            >
              Verificar agora
            </CTA>
            <CTA
              variant="ghost"
              icon={null}
              onClick={async () => {
                await api.signOut()
                nav('/entrar', { replace: true })
              }}
            >
              Sair
            </CTA>
          </div>
        </div>
      </div>
      <p className="muted" style={{ fontSize: 12.5, textAlign: 'center', marginTop: 16 }}>
        Conta: {me.profile.email}
      </p>
    </div>
  )
}
