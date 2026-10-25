import { useCallback, useEffect, useState } from 'react'
import { Icon } from '../../components/Icon'
import { CTA } from '../../components/ui'
import { api } from '../../lib/api'
import manifest from '../../lib/materials-manifest.json'
import { useStore } from '../../lib/store'
import type { Material } from '../../lib/types'

const MIME: Record<string, string> = {
  doc: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  sheet: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
}

/**
 * Importa os modelos oficiais (Google Drive) para o armazenamento privado do Supabase.
 * Some quando todos os materiais da lista já têm arquivo.
 */
export function ImportMaterials() {
  const { reloadContent, toast } = useStore()
  const [pending, setPending] = useState<Material[] | null>(null)
  const [done, setDone] = useState(0)
  const [running, setRunning] = useState(false)
  const [errors, setErrors] = useState<string[]>([])

  const load = useCallback(async () => {
    try {
      const all = await api.listMaterials()
      setPending(all.filter((m) => !m.storage_path && manifest.some((x) => x.title === m.title)))
    } catch {
      setPending([])
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  if (!pending || (pending.length === 0 && !running && errors.length === 0)) return null

  async function run() {
    if (!pending) return
    setRunning(true)
    setErrors([])
    setDone(0)
    const fails: string[] = []
    for (const m of pending) {
      const item = manifest.find((x) => x.title === m.title)
      if (!item) continue
      try {
        const r = await fetch(`/api/material-file?id=${encodeURIComponent(item.id)}`)
        if (!r.ok) {
          const body = (await r.json().catch(() => null)) as { error?: string } | null
          throw new Error(body?.error ?? `Falha ao baixar (${r.status}).`)
        }
        const blob = await r.blob()
        const file = new File([blob], item.filename, { type: MIME[item.type] })
        const path = await api.uploadMaterialFile(file)
        await api.saveMaterial({ ...m, storage_path: path })
      } catch (e) {
        fails.push(`${m.title}: ${e instanceof Error ? e.message : 'erro'}`)
        // Pasta sem compartilhamento: não adianta tentar os outros.
        if (fails.length === 1 && String(fails[0]).includes('Qualquer pessoa')) break
      }
      setDone((d) => d + 1)
    }
    setErrors(fails)
    setRunning(false)
    await load()
    await reloadContent()
    toast(fails.length ? 'Importação terminou com pendências.' : 'Materiais importados. Os alunos já podem baixar.')
  }

  const total = pending.length
  return (
    <section className="card r" style={{ padding: '20px 22px', marginBottom: 14 }}>
      <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
        <span className="chip-i" style={{ width: 40, height: 40, borderRadius: 12 }}>
          <Icon name="download" />
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h2 className="dsp" style={{ fontSize: 17 }}>
            Importar materiais para a plataforma
          </h2>
          <p className="muted" style={{ fontSize: 13.5, marginTop: 4 }}>
            {running
              ? `Importando ${Math.min(done + 1, total)} de ${total}...`
              : `${total} ${total === 1 ? 'material ainda abre' : 'materiais ainda abrem'} pelo Google Drive. Importe para o aluno baixar direto daqui, em Word e Excel, só com login.`}
          </p>
          {!running && errors.length === 0 && (
            <p className="muted" style={{ fontSize: 12.5, marginTop: 6 }}>
              Antes de importar, deixe a pasta "Mentoria · Materiais dos alunos" do Drive como "Qualquer pessoa com o link".
              Depois de importar, pode tirar o compartilhamento.
            </p>
          )}
          {errors.length > 0 && (
            <div className="form-err" style={{ marginTop: 10 }}>
              {errors.slice(0, 3).map((e) => (
                <div key={e}>{e}</div>
              ))}
              {errors.length > 3 && <div>e mais {errors.length - 3}.</div>}
            </div>
          )}
          <div style={{ marginTop: 14 }}>
            <CTA icon="download" variant="sm" onClick={() => void run()} disabled={running}>
              {running ? 'Importando...' : errors.length ? 'Tentar de novo' : `Importar ${total} materiais`}
            </CTA>
          </div>
        </div>
      </div>
    </section>
  )
}
