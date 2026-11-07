import type { ReactNode } from 'react'
import './insights.css'

/**
 * Entradas e resultados lado a lado em tela larga (>= 1280px), com os resultados fixos
 * enquanto o aluno digita. Em telas menores empilha: entradas, depois resultados.
 */
export function CalcLayout({ inputs, results }: { inputs: ReactNode; results: ReactNode }) {
  return (
    <div className="calc-layout">
      <div className="calc-inputs">{inputs}</div>
      <div className="calc-results">{results}</div>
    </div>
  )
}
