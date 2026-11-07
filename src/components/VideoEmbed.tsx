// Player do vídeo da aula. Aceita o link "normal" de cada serviço e monta o embed.

export type ParsedVideo = { kind: 'iframe' | 'file'; src: string; vertical: boolean }

export function parseVideo(raw: string | null | undefined): ParsedVideo | null {
  const s = (raw ?? '').trim()
  if (!s) return null
  let u: URL
  try {
    u = new URL(s)
  } catch {
    return null
  }
  if (u.protocol !== 'https:') return null
  const host = u.hostname.replace(/^www\./, '').replace(/^m\./, '')

  // YouTube: watch?v=, youtu.be/, shorts/, embed/, live/
  if (host === 'youtube.com' || host === 'youtu.be' || host === 'youtube-nocookie.com') {
    let id = ''
    let vertical = false
    if (host === 'youtu.be') id = u.pathname.slice(1).split('/')[0]
    else if (u.searchParams.get('v')) id = u.searchParams.get('v') ?? ''
    else {
      const m = u.pathname.match(/^\/(shorts|embed|live)\/([\w-]{6,})/)
      if (m) {
        id = m[2]
        vertical = m[1] === 'shorts'
      }
    }
    if (!/^[\w-]{6,}$/.test(id)) return null
    return { kind: 'iframe', src: `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1&playsinline=1`, vertical }
  }

  // Vimeo: vimeo.com/123 ou vimeo.com/123/hash (não listado) ou player.vimeo.com/video/123?h=hash
  if (host === 'vimeo.com' || host === 'player.vimeo.com') {
    const m = u.pathname.match(/(?:\/video)?\/(\d+)(?:\/([\da-f]+))?/)
    if (!m) return null
    const h = m[2] ?? u.searchParams.get('h')
    return { kind: 'iframe', src: `https://player.vimeo.com/video/${m[1]}${h ? `?h=${h}&` : '?'}dnt=1`, vertical: false }
  }

  // Panda Video (já vem como link de embed)
  if (host.endsWith('pandavideo.com.br') || host.endsWith('pandavideo.com')) {
    return { kind: 'iframe', src: u.toString(), vertical: false }
  }

  // Bunny Stream: /play/ vira /embed/
  if (host === 'iframe.mediadelivery.net' || host === 'player.mediadelivery.net') {
    return { kind: 'iframe', src: `https://iframe.mediadelivery.net${u.pathname.replace('/play/', '/embed/')}`, vertical: false }
  }

  // Arquivo direto
  if (/\.(mp4|webm|mov|m4v)$/i.test(u.pathname)) return { kind: 'file', src: u.toString(), vertical: false }

  return null
}

export function VideoEmbed({ url, title = 'Vídeo da aula' }: { url: string | null | undefined; title?: string }) {
  const v = parseVideo(url)
  if (!v) return null
  return (
    <div className={`video-embed ${v.vertical ? 'vert' : ''}`}>
      {v.kind === 'iframe' ? (
        <iframe
          src={v.src}
          title={title}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      ) : (
        <video src={v.src} controls playsInline preload="metadata" controlsList="nodownload" />
      )}
    </div>
  )
}
