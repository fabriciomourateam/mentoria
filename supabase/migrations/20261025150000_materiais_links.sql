-- Liga os 22 materiais aos modelos no Google Drive (abre "Fazer uma cópia").
-- Requer a pasta do Drive compartilhada como "Qualquer pessoa com o link: Leitor".

update public.materials set external_url = 'https://docs.google.com/document/d/1WTUs3uP5Qb4rTDyH7Qs0ZD50fF1IaC9MChsrzplyu68/copy', storage_path = null where title = 'Modelo de Oferta (1 página)';
update public.materials set external_url = 'https://docs.google.com/document/d/1HynDfDz380kPuvZ9dD8eZw9TPF_wgwidtc2ttIPc6Sk/copy', storage_path = null where title = '7 passos para definir seu público';
update public.materials set external_url = 'https://docs.google.com/document/d/14t6HlPYmBsxH-YhJyqITyNmKYHZpNh4s9wEMlXrrPKE/copy', storage_path = null where title = 'Script de vendas';
update public.materials set external_url = 'https://docs.google.com/document/d/1_LcCtVbWj7272h76KUwzmsZ8FFG70Br01ZjgcLzSkKI/copy', storage_path = null where title = 'Quebra de objeção';
update public.materials set external_url = 'https://docs.google.com/document/d/1jroFWmLq0HtMLekF9rjdqkKtYVJuQFUXJQPJu_o6ljA/copy', storage_path = null where title = 'Apresentação que converte';
update public.materials set external_url = 'https://docs.google.com/document/d/1FpqfRtInUH5ftABH91E0IzTf1B7Ry_XjtjUFRLpGaZc/copy', storage_path = null where title = 'Follow-up inteligente';
update public.materials set external_url = 'https://docs.google.com/document/d/1axMQ05yNWP9j3E_ubhyVTZYMCijSYCBrixurEHeTRYE/copy', storage_path = null where title = 'Funil Ampulheta';
update public.materials set external_url = 'https://docs.google.com/document/d/1RJyEp2fZPNNl2_hEhx_IeAGhp_pnnjYM0tRfg4mArKs/copy', storage_path = null where title = 'Formulário de aplicação de lead';
update public.materials set external_url = 'https://docs.google.com/document/d/1g0boM8z_IqNFZzlJnKICYczVxNs_oN0Mn5z0zKQxC9I/copy', storage_path = null where title = 'Banco de referências de conteúdo';
update public.materials set external_url = 'https://docs.google.com/document/d/1EHOhLfEK7_ibeFwQE6GtgNGJfEXS_mDNEplKI_Flukk/copy', storage_path = null where title = 'Boas-vindas ao aluno';
update public.materials set external_url = 'https://docs.google.com/document/d/1tDuG5t7aapwapCff0pn9Z1p_99QCTWfVexNqOmi4ong/copy', storage_path = null where title = 'Formulário de saída';
update public.materials set external_url = 'https://docs.google.com/document/d/16aDlceE9acWozrJrx_9WhSl-Obmumyfy0XlkIomHfaQ/copy', storage_path = null where title = 'Dossiê de resultados';
update public.materials set external_url = 'https://docs.google.com/document/d/1-VTWWCKIiDdKEWDh3pJzfjuFIwi4Afsp4XrKwDyq-k8/copy', storage_path = null where title = 'Modelo de POP';
update public.materials set external_url = 'https://docs.google.com/document/d/17O6CZM_SyEHYyNdQlVupEsO0sDiDuCbm-EguAAQOqEQ/copy', storage_path = null where title = 'Reunião 1:1';
update public.materials set external_url = 'https://docs.google.com/document/d/1h6Oe178RxzpxyUp6nQx50GbnXPNY0-pmGDJdPcPMEJc/copy', storage_path = null where title = 'Checklist PF e PJ';
update public.materials set external_url = 'https://docs.google.com/spreadsheets/d/1aNTUFnRelub-oVdjMT-vQjT9ENKbRp1Zc8a7utsQFsg/copy', storage_path = null where title = 'OKR';
update public.materials set external_url = 'https://docs.google.com/spreadsheets/d/1tYPpV48uxNAzds-swroIFTUgPbmVnZ5AwZLHolLnKsc/copy', storage_path = null where title = 'Calendário de postagens';
update public.materials set external_url = 'https://docs.google.com/spreadsheets/d/1SICq9tpevKN3JEOiENyMIXLeLN3YTd63fuAARp7Dj-Q/copy', storage_path = null where title = 'Planilha de Precificação';
update public.materials set external_url = 'https://docs.google.com/spreadsheets/d/1OjIbpE0naAoLs_Nzebw3jutl0OM6coiYgXXnZja0L8w/copy', storage_path = null where title = 'Health Score';
update public.materials set external_url = 'https://docs.google.com/spreadsheets/d/1BsZy24VJ72CBZR1XkTxABoCpPNyP-PfQH6QkrrCKY6A/copy', storage_path = null where title = 'Calculadora de Pró-labore';
update public.materials set external_url = 'https://docs.google.com/spreadsheets/d/1tE2qZSuKZXZXPvbXY6hkbSW1yClHzyQcbzDQY8bGrqo/copy', storage_path = null where title = 'DRE do negócio';
update public.materials set external_url = 'https://docs.google.com/spreadsheets/d/1eScdVSQuXCm6RYocHJD8bA1QqtfxP3jhbAtuq8XVdWE/copy', storage_path = null where title = 'Projeção anual em 3 cenários';

-- Ajuste na aula de Captação (proporção de posts coerente com a tabela).
update public.lessons set body_md = replace(body_md, '4 de cada 6 posts', '5 de cada 6 posts') where body_md like '%4 de cada 6 posts%';

-- Conferência: deve listar 22 materiais com link.
select count(*) filter (where external_url is not null) as com_link, count(*) as total from public.materials;
