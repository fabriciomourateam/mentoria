# Mentoria · área de membros

Produto separado do MyShape e do Meu Acompanhamento: login, usuários e banco próprios.
Curso escrito e clicável: trilhas, aulas com checklist e checkpoint, materiais para baixar,
e um painel do gestor para conteúdo, alunos e aparência (cor e tema configuráveis).

## Rodar

```bash
npm install
npm run dev        # sem .env = modo demonstração (dados no navegador)
npm run build
```

Modo demonstração: qualquer e-mail e senha (6+ caracteres) entram. E-mail começando com
`admin` abre o painel do gestor; contendo `pendente` mostra a tela de acesso aguardando liberação.

## Ligar no Supabase

1. Criar o projeto (região São Paulo).
2. Rodar as migrations de `supabase/migrations/` em ordem (SQL Editor ou `supabase db push`):
   - `..._init.sql`: tabelas, regras de acesso (RLS), bucket privado `materials`.
   - `..._seed_grade.sql`: as 7 trilhas, 29 aulas, checkpoints e materiais.
   - `..._kiwify_access.sql`: liberação automática por compra.
3. Copiar `.env.example` para `.env` com a URL e a chave anon do projeto (na Vercel, nas variáveis de ambiente).
4. Criar a sua conta pela tela `/entrar` e virar admin no SQL Editor:
   ```sql
   update public.profiles set role = 'admin' where email = 'SEU-EMAIL';
   ```
5. Auth > URL Configuration: colocar a URL de produção em Site URL e Redirect URLs.

## Acesso dos alunos

- Manual: o aluno cria a conta, aparece em Admin > Alunos como "Aguardando" e você libera.
- Kiwify (opcional): deploy de `supabase/functions/kiwify-webhook` com
  `supabase functions deploy kiwify-webhook --no-verify-jwt`, secret `KIWIFY_TOKEN` e a URL
  `https://<projeto>.supabase.co/functions/v1/kiwify-webhook` cadastrada no webhook da Kiwify.
  Compra aprovada libera; reembolso, chargeback ou cancelamento encerra. Funciona mesmo se a
  compra chegar antes do cadastro.

## Estrutura

- `src/lib/theme.ts`: gera todos os tons a partir de uma cor (definida no admin).
- `src/lib/api.ts`: contrato de dados; `api-supabase.ts` (produção) e `api-demo.ts` (demonstração).
- `src/styles.css`: todo o visual (Direção 2), por tokens.
- `src/pages/`: telas do aluno; `src/pages/admin/`: painel do gestor.

## Pendências

- Escrever o texto das 28 aulas restantes (pelo admin). A aula "Sua oferta irresistível em uma página" é o modelo.
- Subir os arquivos dos 22 materiais (pelo admin, em cada trilha).
- "Meu Negócio": números reais quando houver integração com o MyShape.
