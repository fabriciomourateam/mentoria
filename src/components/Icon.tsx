// Ícones de traço fino, desenhados à mão (sem biblioteca).
const P: Record<string, string> = {
  arrow: 'M5 12h14M13 6l6 6-6 6',
  arrowUpRight: 'M7 17L17 7M9 7h8v8',
  back: 'M19 12H5M11 18l-6-6 6-6',
  chevron: 'M9 6l6 6-6 6',
  check: 'M5 12.5l4.5 4.5L19 7.5',
  lock: 'M6 11h12v9H6zM8.5 11V8a3.5 3.5 0 017 0v3',
  unlock: 'M6 11h12v9H6zM8.5 11V8a3.5 3.5 0 016.8-1.2',
  home: 'M4 11l8-7 8 7v9h-5v-6H9v6H4z',
  layers: 'M12 3l9 5-9 5-9-5zM3 13l9 5 9-5',
  book: 'M5 4h10a3 3 0 013 3v13H8a3 3 0 01-3-3zM5 17a3 3 0 013-3h10',
  briefcase: 'M4 8h16v11H4zM9 8V5h6v3M4 13h16',
  star: 'M12 3l2.6 5.4 5.9.8-4.3 4.1 1 5.9L12 16.4 6.8 19.2l1-5.9-4.3-4.1 5.9-.8z',
  target: 'M12 21a9 9 0 100-18 9 9 0 000 18zM12 16a4 4 0 100-8 4 4 0 000 8zM12 12h.01',
  chat: 'M20 15a2 2 0 01-2 2H8l-4 4V6a2 2 0 012-2h12a2 2 0 012 2z',
  funnel: 'M4 5h16l-6 7v6l-4 2v-8z',
  route: 'M6 19a2 2 0 100-4 2 2 0 000 4zM18 9a2 2 0 100-4 2 2 0 000 4zM8 17h6a3 3 0 000-6h-4a3 3 0 010-6h6',
  clock: 'M12 21a9 9 0 100-18 9 9 0 000 18zM12 7v5l3 2',
  chart: 'M4 20V4M4 20h16M8 16l4-5 3 3 5-6',
  coin: 'M12 21a9 9 0 100-18 9 9 0 000 18zM14.8 9.2c-.5-.8-1.6-1.3-2.8-1.3-1.7 0-2.8.9-2.8 2s1 1.7 2.8 2.1 2.8 1 2.8 2.1-1.2 2-2.8 2c-1.3 0-2.4-.5-2.9-1.4M12 6.5v1.4M12 16.1v1.4',
  doc: 'M7 3h7l4 4v14H7zM14 3v4h4M10 12h5M10 16h5',
  sheet: 'M4 4h16v16H4zM4 10h16M10 4v16',
  guide: 'M4 5h6a2 2 0 012 2v13a2 2 0 00-2-2H4zM20 5h-6a2 2 0 00-2 2v13a2 2 0 012-2h6z',
  list: 'M9 6h11M9 12h11M9 18h11M4.5 6l.5.5L6.5 5M4.5 12l.5.5 1.5-1.5M4.5 18l.5.5 1.5-1.5',
  download: 'M12 4v11M7 10l5 5 5-5M5 20h14',
  settings:
    'M12 15a3 3 0 100-6 3 3 0 000 6zM19.4 13a7.6 7.6 0 000-2l2-1.5-2-3.4-2.3.9a7.3 7.3 0 00-1.8-1L15 3.5h-4l-.4 2.5a7.3 7.3 0 00-1.8 1l-2.3-.9-2 3.4 2 1.5a7.6 7.6 0 000 2l-2 1.5 2 3.4 2.3-.9a7.3 7.3 0 001.8 1l.4 2.5h4l.4-2.5a7.3 7.3 0 001.8-1l2.3.9 2-3.4z',
  logout: 'M15 4h3a2 2 0 012 2v12a2 2 0 01-2 2h-3M10 17l5-5-5-5M15 12H4',
  users: 'M9 11a3.5 3.5 0 100-7 3.5 3.5 0 000 7zM3 20a6 6 0 0112 0M16 4.5a3.5 3.5 0 010 6.5M21 20a6 6 0 00-4-5.6',
  palette: 'M12 21a9 9 0 110-18c5 0 9 3.6 9 8 0 2.5-2 4-4.3 4H15a2 2 0 00-1.4 3.4A1.6 1.6 0 0112 21zM7.5 12.5h.01M9.5 8h.01M14.5 8h.01',
  edit: 'M4 20h4L19 9l-4-4L4 16zM13.5 6.5l4 4',
  plus: 'M12 5v14M5 12h14',
  trash: 'M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3',
  eye: 'M2.5 12S6 5 12 5s9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7zM12 15a3 3 0 100-6 3 3 0 000 6z',
  up: 'M12 19V5M6 11l6-6 6 6',
  down: 'M12 5v14M18 13l-6 6-6-6',
  upload: 'M12 16V4M7 9l5-5 5 5M5 20h14',
  sparkle: 'M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z',
  hourglass: 'M7 3h10M7 21h10M8 3c0 5 8 5 8 9s-8 4-8 9M16 3c0 5-8 5-8 9s8 4 8 9',
  mail: 'M4 6h16v12H4zM4 7l8 6 8-6',
  pen: 'M12 20h9M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z',
  close: 'M6 6l12 12M18 6L6 18',
  external: 'M14 4h6v6M20 4l-9 9M18 14v6H4V6h6',
}

export type IconName = keyof typeof P

export function Icon({ name, className = '' }: { name: IconName | string; className?: string }) {
  return (
    <svg className={`i ${className}`} viewBox="0 0 24 24" aria-hidden="true">
      <path d={P[name] ?? P.sparkle} />
    </svg>
  )
}

// Ícone de cada trilha (pelo slug) e de cada tipo de material.
export const TRACK_ICON: Record<string, IconName> = {
  'comece-por-aqui': 'star',
  'posicionamento-oferta': 'target',
  vendas: 'chat',
  captacao: 'funnel',
  'entrega-jornada': 'route',
  'gestao-tempo': 'clock',
  financas: 'coin',
}

export const KIND_ICON: Record<string, IconName> = {
  documento: 'doc',
  planilha: 'sheet',
  guia: 'guide',
  checklist: 'list',
}

export const KIND_LABEL: Record<string, string> = {
  documento: 'Documento',
  planilha: 'Planilha',
  guia: 'Guia',
  checklist: 'Checklist',
}
