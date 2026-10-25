// Baixa um material do Google Drive (exportado em .docx ou .xlsx) para o painel do gestor
// importar para o Supabase. Só aceita os arquivos da lista oficial (não é um proxy aberto).
// Requer a pasta do Drive compartilhada como "Qualquer pessoa com o link: Leitor" durante a importação.
import manifest from './_manifest.js'

const MIME = {
  doc: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  sheet: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
}

export default async function handler(req, res) {
  const id = new URL(req.url, 'http://x').searchParams.get('id')
  const item = manifest.find((m) => m.id === id)
  if (!item) {
    res.status(404).json({ error: 'Material desconhecido.' })
    return
  }
  const url =
    item.type === 'sheet'
      ? `https://docs.google.com/spreadsheets/d/${item.id}/export?format=xlsx`
      : `https://docs.google.com/document/d/${item.id}/export?format=docx`
  const r = await fetch(url, { redirect: 'follow' })
  const type = r.headers.get('content-type') || ''
  if (!r.ok || type.includes('text/html')) {
    res.status(403).json({
      error: 'O Google não liberou o arquivo. Confira se a pasta do Drive está como "Qualquer pessoa com o link".',
    })
    return
  }
  const buf = Buffer.from(await r.arrayBuffer())
  res.setHeader('Content-Type', MIME[item.type])
  res.setHeader('Cache-Control', 'no-store')
  res.status(200).send(buf)
}
