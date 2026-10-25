import { useEffect, useState } from 'react'
import { Icon } from '../../components/Icon'
import { CTA } from '../../components/ui'
import { useStore } from '../../lib/store'
import { ACCENT_PRESETS, isHex } from '../../lib/theme'
import type { BaseTheme } from '../../lib/types'

const BASES: { id: BaseTheme; label: string }[] = [
  { id: 'light', label: 'Claro' },
  { id: 'graphite', label: 'Grafite' },
  { id: 'dark', label: 'Escuro' },
]

export function AdminAppearance() {
  const { settings, previewTheme, saveSettings, toast } = useStore()
  const [accent, setAccent] = useState(settings.accent)
  const [base, setBase] = useState<BaseTheme>(settings.base)
  const [brand, setBrand] = useState(settings.brand_name)
  const [myshape, setMyshape] = useState(settings.myshape_url)
  const [hexText, setHexText] = useState(settings.accent)
  const [busy, setBusy] = useState(false)

  // Pré-visualiza ao vivo; se sair sem salvar, volta ao que estava salvo.
  useEffect(() => {
    previewTheme(accent, base)
  }, [accent, base, previewTheme])
  useEffect(() => () => previewTheme(settings.accent, settings.base), [settings.accent, settings.base, previewTheme])

  const dirty =
    accent.toLowerCase() !== settings.accent.toLowerCase() ||
    base !== settings.base ||
    brand !== settings.brand_name ||
    myshape !== settings.myshape_url

  function pick(hex: string) {
    setAccent(hex)
    setHexText(hex)
  }

  async function save() {
    setBusy(true)
    try {
      await saveSettings({ accent, base, brand_name: brand.trim() || 'Mentoria', myshape_url: myshape.trim() })
      toast('Aparência salva para todos os alunos.')
    } catch (e) {
      toast(e instanceof Error ? e.message : 'Não foi possível salvar.')
    } finally {
      setBusy(false)
    }
  }

  const isPreset = ACCENT_PRESETS.some((p) => p.hex.toLowerCase() === accent.toLowerCase())

  return (
    <div className="grid" style={{ gridTemplateColumns: 'minmax(0,1fr)' }}>
      <section className="card r" style={{ padding: '26px 26px 24px' }}>
        <h2 className="dsp" style={{ fontSize: 21 }}>
          Cor principal
        </h2>
        <p className="muted" style={{ fontSize: 13.5, marginTop: 4, maxWidth: '56ch' }}>
          Toque numa cor e veja a plataforma inteira se repintar. O sistema gera os tons sozinho e garante que o texto fique
          sempre legível.
        </p>
        <div className="sw" style={{ marginTop: 18 }}>
          {ACCENT_PRESETS.map((p) => (
            <button
              key={p.hex}
              style={{ background: p.hex }}
              aria-pressed={p.hex.toLowerCase() === accent.toLowerCase()}
              title={p.name}
              aria-label={p.name}
              onClick={() => pick(p.hex)}
            />
          ))}
          <label title="Cor personalizada" aria-pressed={!isPreset} style={!isPreset ? { background: accent } : undefined}>
            <Icon name="palette" />
            <input type="color" value={accent} onChange={(e) => pick(e.target.value)} aria-label="Cor personalizada" />
          </label>
        </div>
        <label className="field" style={{ marginTop: 18, maxWidth: 220 }}>
          <span>Código da cor</span>
          <input
            className="input"
            value={hexText}
            onChange={(e) => {
              const v = e.target.value.trim()
              setHexText(v)
              const h = v.startsWith('#') ? v : `#${v}`
              if (isHex(h)) setAccent(h)
            }}
            placeholder="#13A6E6"
            spellCheck={false}
          />
        </label>

        <h2 className="dsp" style={{ fontSize: 21, marginTop: 30 }}>
          Tema base
        </h2>
        <div className="choice" style={{ marginTop: 14 }}>
          {BASES.map((b) => (
            <button key={b.id} aria-pressed={base === b.id} onClick={() => setBase(b.id)}>
              {b.label}
            </button>
          ))}
        </div>
      </section>

      <section className="card r" style={{ padding: '26px 26px 24px', ['--i' as string]: 1 }}>
        <h2 className="dsp" style={{ fontSize: 21 }}>
          Marca e links
        </h2>
        <div className="grid g2" style={{ marginTop: 16 }}>
          <label className="field">
            <span>Nome da plataforma</span>
            <input className="input" value={brand} onChange={(e) => setBrand(e.target.value)} maxLength={40} />
            <small>Aparece no topo e na tela de login.</small>
          </label>
          <label className="field" style={{ marginTop: 0 }}>
            <span>Link do MyShape</span>
            <input className="input" value={myshape} onChange={(e) => setMyshape(e.target.value)} inputMode="url" />
            <small>Usado no botão "Abrir meu MyShape".</small>
          </label>
        </div>
      </section>

      <div className="r" style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', ['--i' as string]: 2 }}>
        <CTA icon="check" onClick={save} disabled={!dirty || busy}>
          {busy ? 'Salvando...' : 'Salvar para todos'}
        </CTA>
        {dirty && (
          <CTA
            variant="ghost"
            icon={null}
            onClick={() => {
              pick(settings.accent)
              setBase(settings.base)
              setBrand(settings.brand_name)
              setMyshape(settings.myshape_url)
            }}
          >
            Descartar
          </CTA>
        )}
        {!dirty && <span className="muted" style={{ fontSize: 13 }}>Tudo salvo.</span>}
      </div>
    </div>
  )
}
