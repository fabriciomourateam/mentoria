import type { BaseTheme } from './types'

// A partir de UMA cor (escolhida no admin), gera todos os tons da plataforma
// e escolhe a cor do texto sobre ela para manter a leitura sempre boa.

export const DEFAULT_ACCENT = '#13A6E6'

export const ACCENT_PRESETS: { hex: string; name: string }[] = [
  { hex: '#13A6E6', name: 'Azul vivo' },
  { hex: '#F3C64B', name: 'Dourado' },
  { hex: '#C2F032', name: 'Lima elétrico' },
  { hex: '#10C275', name: 'Emerald' },
  { hex: '#FB5436', name: 'Coral' },
  { hex: '#D4248C', name: 'Magenta' },
]

export function isHex(v: string): boolean {
  return /^#[0-9a-fA-F]{6}$/.test(v)
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '')
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]
}

function scale(rgb: [number, number, number], f: number): string {
  return `rgb(${rgb.map((c) => Math.round(c * f)).join(',')})`
}

function luminance([r, g, b]: [number, number, number]): number {
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255
}

export function applyTheme(accent: string, base: BaseTheme): void {
  const hex = isHex(accent) ? accent : DEFAULT_ACCENT
  const rgb = hexToRgb(hex)
  const root = document.documentElement
  const s = root.style
  const light = luminance(rgb) > 0.62
  s.setProperty('--accent', hex)
  s.setProperty('--accent-rgb', rgb.join(','))
  // Cores muito claras (lima, dourado) precisam de um tom de texto mais escuro.
  s.setProperty('--accent-d', scale(rgb, light ? 0.55 : 0.68))
  // Cor clara usa texto escuro: o degradê não pode escurecer tanto.
  s.setProperty('--accent-deep', scale(rgb, light ? 0.74 : 0.26))
  s.setProperty('--on-accent', light ? '#0E1F2A' : '#FFFFFF')
  if (base === 'light') root.removeAttribute('data-base')
  else root.setAttribute('data-base', base)
  const meta = document.querySelector('meta[name="theme-color"]')
  if (meta) meta.setAttribute('content', base === 'light' ? '#F1F6FB' : base === 'dark' ? '#0B0A0C' : '#1A1920')
}
