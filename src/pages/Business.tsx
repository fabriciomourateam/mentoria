import { Icon } from '../components/Icon'
import { CTA } from '../components/ui'
import { useStore } from '../lib/store'

const TOOLS = [
  { icon: 'book', title: 'Planos de dieta e treino', text: 'Você monta no painel e o aluno acompanha tudo pelo app.' },
  { icon: 'chat', title: 'Check-ins', text: 'O acompanhamento periódico que mantém o aluno engajado.' },
  { icon: 'chart', title: 'Evolução do aluno', text: 'Fotos, medidas e histórico para provar resultado na renovação.' },
] as const

export function Business() {
  const { settings } = useStore()
  return (
    <>
      <section className="hero r">
        <span className="eyebrow">Meu Negócio</span>
        <h1>A ferramenta onde você opera a sua consultoria.</h1>
        <p>
          Aqui você aprende o método. No MyShape você aplica: monta dieta e treino, e seus alunos acompanham tudo pelo app com a
          sua marca.
        </p>
        <div className="actions">
          <CTA href={settings.myshape_url} variant="light" icon="arrowUpRight">
            Abrir meu MyShape
          </CTA>
        </div>
      </section>

      <div className="grid g3" style={{ marginTop: 14 }}>
        {TOOLS.map((t, i) => (
          <div key={t.title} className="card tool r" style={{ ['--i' as string]: i + 1 }}>
            <span className="ti">
              <Icon name={t.icon} />
            </span>
            <div>
              <h3>{t.title}</h3>
              <p>{t.text}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="sh">
        <h2>Seus números</h2>
      </div>
      <div className="card empty r" style={{ ['--i' as string]: 4 }}>
        <div className="ei">
          <Icon name="chart" />
        </div>
        <h3>Seus números vão aparecer aqui</h3>
        <p>
          Quando a sua conta MyShape estiver conectada, faturamento, alunos ativos e renovações aparecem neste painel, sem você
          precisar digitar nada.
        </p>
      </div>
    </>
  )
}
