-- Vídeo da aula: link do YouTube (não listado), Vimeo, Panda Video, Bunny ou arquivo .mp4.
-- Leitura e escrita seguem as policies que já existem em public.lessons.
alter table public.lessons add column if not exists video_url text;
