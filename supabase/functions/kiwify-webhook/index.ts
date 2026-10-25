// Webhook da Kiwify: compra aprovada libera o acesso; reembolso/chargeback/cancelamento encerra.
// Configure na Kiwify a URL: https://<projeto>.supabase.co/functions/v1/kiwify-webhook
// Secrets: KIWIFY_TOKEN (o token do webhook na Kiwify). SUPABASE_URL e
// SUPABASE_SERVICE_ROLE_KEY já existem nas edge functions.
// Deploy: supabase functions deploy kiwify-webhook --no-verify-jwt
import { createClient } from 'npm:@supabase/supabase-js@2'

const ACTIVE = new Set(['paid', 'approved', 'order_approved', 'subscription_renewed'])
const CANCEL = new Set(['refunded', 'chargedback', 'order_refunded', 'chargeback', 'subscription_canceled', 'canceled'])

async function hmacSha1Hex(key: string, body: string): Promise<string> {
  const k = await crypto.subtle.importKey('raw', new TextEncoder().encode(key), { name: 'HMAC', hash: 'SHA-1' }, false, ['sign'])
  const sig = await crypto.subtle.sign('HMAC', k, new TextEncoder().encode(body))
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') return new Response('ok')
  const raw = await req.text()
  const token = Deno.env.get('KIWIFY_TOKEN') ?? ''
  const signature = new URL(req.url).searchParams.get('signature') ?? ''
  if (!token || signature !== (await hmacSha1Hex(token, raw))) {
    return new Response('assinatura inválida', { status: 401 })
  }

  let body: Record<string, unknown>
  try {
    body = JSON.parse(raw)
  } catch {
    return new Response('json inválido', { status: 400 })
  }
  const customer = (body.Customer ?? body.customer ?? {}) as Record<string, string>
  const email = (customer.email ?? '').trim().toLowerCase()
  const event = String(body.webhook_event_type ?? '').toLowerCase()
  const status = String(body.order_status ?? '').toLowerCase()
  if (!email) return new Response('sem e-mail', { status: 200 })

  const next = CANCEL.has(event) || CANCEL.has(status) ? 'canceled' : ACTIVE.has(event) || ACTIVE.has(status) ? 'active' : null
  if (!next) return new Response('evento ignorado', { status: 200 })

  const sb = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
  const { error } = await sb.from('access_grants').upsert({
    email,
    status: next,
    source: 'kiwify',
    order_id: String(body.order_id ?? ''),
    updated_at: new Date().toISOString(),
  })
  if (error) return new Response(error.message, { status: 500 })
  const { error: e2 } = await sb.rpc('apply_access_grant', { p_email: email })
  if (e2) return new Response(e2.message, { status: 500 })
  return new Response(`ok: ${email} -> ${next}`)
})
