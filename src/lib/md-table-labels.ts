// Plugin rehype mínimo: copia o texto do cabeçalho de cada coluna para data-label nas células.
// No celular, tabelas com 3+ colunas viram cartões e cada célula mostra seu rótulo (ver .md no CSS).
interface HNode {
  type: string
  tagName?: string
  value?: string
  properties?: Record<string, unknown>
  children?: HNode[]
}

const text = (n: HNode): string => (n.type === 'text' ? (n.value ?? '') : (n.children ?? []).map(text).join(''))
const kids = (n: HNode, tag: string) => (n.children ?? []).filter((c) => c.type === 'element' && c.tagName === tag)

function visit(n: HNode) {
  if (n.type === 'element' && n.tagName === 'table') {
    const head = kids(n, 'thead')[0]
    const labels = head ? kids(kids(head, 'tr')[0] ?? { type: 'x' }, 'th').map(text) : []
    for (const body of kids(n, 'tbody'))
      for (const tr of kids(body, 'tr'))
        kids(tr, 'td').forEach((td, i) => {
          td.properties = { ...(td.properties ?? {}), dataLabel: labels[i] ?? '' }
        })
    n.properties = { ...(n.properties ?? {}), className: labels.length >= 3 ? ['cards'] : [] }
  }
  ;(n.children ?? []).forEach(visit)
}

export function rehypeTableLabels() {
  return (tree: HNode) => visit(tree)
}
