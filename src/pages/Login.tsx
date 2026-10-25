import { useState } from 'react'
import type { FormEvent } from 'react'
import { Navigate } from 'react-router-dom'
import { Brand } from '../components/Layout'
import { CTA } from '../components/ui'
import { api } from '../lib/api'
import { useStore } from '../lib/store'

type Mode = 'entrar' | 'criar' | 'esqueci'

export function Login() {
  const { user, settings } = useStore()
  const [mode, setMode] = useState<Mode>('entrar')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const [ok, setOk] = useState<string | null>(null)

  if (user) return <Navigate to="/" replace />

  async function submit(e: FormEvent) {
    e.preventDefault()
    setErr(null)
    setOk(null)
    setBusy(true)
    try {
      if (mode === 'entrar') await api.signIn(email.trim(), password)
      else if (mode === 'criar') {
        if (name.trim().length < 2) throw new Error('Digite seu nome.')
        const r = await api.signUp(name.trim(), email.trim(), password)
        if (r.needsConfirmation) setOk('Enviamos um link de confirmação para o seu e-mail. Confirme e depois entre.')
      } else {
        await api.resetPassword(email.trim())
        setOk('Se o e-mail tiver cadastro, você vai receber o link para criar uma nova senha.')
      }
    } catch (e2) {
      setErr(e2 instanceof Error ? e2.message : 'Algo deu errado. Tente de novo.')
    } finally {
      setBusy(false)
    }
  }

  const title = mode === 'entrar' ? 'Bom te ver de novo' : mode === 'criar' ? 'Comece sua jornada' : 'Recuperar senha'
  const sub =
    mode === 'entrar'
      ? 'Use o e-mail da sua inscrição na mentoria.'
      : mode === 'criar'
        ? 'Depois do cadastro, seu acesso é liberado pela equipe.'
        : 'Enviamos um link para você criar uma senha nova.'

  return (
    <div className="auth">
      <section className="art">
        <Brand />
        <div>
          <h1 className="r">Sua consultoria online, montada passo a passo.</h1>
          <p className="r" style={{ ['--i' as string]: 1 }}>
            Cada aula termina em uma entrega. Você aprende, aplica na hora e libera o próximo passo.
          </p>
          <div className="steps">
            {['Leia a aula e entenda o porquê', 'Marque o checklist enquanto executa', 'Libere o checkpoint e siga'].map((s, i) => (
              <div key={s} className="r" style={{ ['--i' as string]: i + 2 }}>
                <i>{i + 1}</i>
                {s}
              </div>
            ))}
          </div>
        </div>
        <span style={{ fontSize: 12.5, opacity: 0.75 }}>{settings.brand_name}</span>
      </section>

      <section className="side">
        <div className="box">
          <div className="bezel r" style={{ ['--i' as string]: 1 }}>
            <form className="card" onSubmit={submit} noValidate>
              {mode !== 'esqueci' && (
                <div className="seg" role="group" aria-label="Acesso">
                  <button type="button" aria-pressed={mode === 'entrar'} onClick={() => setMode('entrar')}>
                    Entrar
                  </button>
                  <button type="button" aria-pressed={mode === 'criar'} onClick={() => setMode('criar')}>
                    Criar conta
                  </button>
                </div>
              )}
              <h2>{title}</h2>
              <p className="sub">{sub}</p>

              {mode === 'criar' && (
                <label className="field">
                  <span>Nome completo</span>
                  <input className="input" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" required />
                </label>
              )}
              <label className="field">
                <span>E-mail</span>
                <input
                  className="input"
                  type="email"
                  inputMode="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </label>
              {mode !== 'esqueci' && (
                <label className="field">
                  <span>Senha</span>
                  <input
                    className="input"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete={mode === 'criar' ? 'new-password' : 'current-password'}
                    minLength={6}
                    required
                  />
                  {mode === 'criar' && <small>Pelo menos 6 caracteres.</small>}
                </label>
              )}

              {err && <div className="form-err">{err}</div>}
              {ok && <div className="form-ok">{ok}</div>}

              <div style={{ marginTop: 20 }}>
                <CTA type="submit" variant="block" disabled={busy}>
                  {busy ? 'Aguarde...' : mode === 'entrar' ? 'Entrar na plataforma' : mode === 'criar' ? 'Criar conta' : 'Enviar link'}
                </CTA>
              </div>

              <div className="foot">
                {mode === 'esqueci' ? (
                  <button type="button" className="link" onClick={() => setMode('entrar')}>
                    Voltar para o login
                  </button>
                ) : (
                  mode === 'entrar' && (
                    <button type="button" className="link" onClick={() => setMode('esqueci')}>
                      Esqueci minha senha
                    </button>
                  )
                )}
              </div>

              {api.mode === 'demo' && (
                <div className="demo-note">
                  <b>Modo demonstração.</b> Qualquer e-mail e senha (6+ caracteres) entram. E-mail começando com
                  "admin" abre o painel do gestor; com "pendente" mostra a tela de acesso aguardando liberação.
                </div>
              )}
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}
