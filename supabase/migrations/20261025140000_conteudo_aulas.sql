-- Conteúdo das 28 aulas (texto + checklist). Aulas com checkpoint mantêm o checklist original.

-- Conteúdo das aulas: Comece por aqui

update public.lessons l set
  body_md = $md$
## O teto que ninguém te contou

Você é bom no que faz. Seus alunos gostam de você, a agenda enche e o dinheiro entra. Só que o seu mês tem um limite: o número de horas que cabem na sua semana. Enquanto o seu faturamento depender de você estar de pé na academia, você não tem um negócio. Você tem um emprego bem pago, com o seu nome na porta.

Esta aula não ensina nenhuma técnica. Ela muda o lugar de onde você olha para o seu trabalho.

> **A regra desta aula:** você não vende hora de academia. Você vende um resultado, com prazo, e se responsabiliza por ele.

## Trabalhar NO negócio x trabalhar PELO negócio

- **No negócio:** você é a mão de obra. Dá a aula, monta o treino, responde o aluno, cobra, agenda. Se você para, o dinheiro para.
- **Pelo negócio:** você é o dono. Define a oferta, cria o processo, mede os números, decide quem entra e como o aluno é atendido. Parte da entrega acontece mesmo quando você não está presente, por meio do app, do check-in semanal e de um método que se repete.

Você vai continuar treinando gente, e isso é ótimo. A virada é parar de ser **só** o técnico e começar a ocupar a cadeira de quem toma as decisões.

## A conta do teto da hora

Exemplo: você atende presencial 8 horas por dia, 5 dias por semana, e cobra R$ 100 por aula. A agenda está 100% cheia.

1. 8 horas x 5 dias = 40 aulas por semana.
2. 40 aulas x R$ 100 = R$ 4.000 por semana.
3. Em 4 semanas: cerca de R$ 16.000 por mês, com a agenda lotada, sem faltas e sem férias.

Agora desconte o cancelamento, a gripe, o feriado e o deslocamento. O número real fica bem abaixo. E para ganhar mais, só existem duas saídas: trabalhar mais horas (você já está no limite) ou subir o preço da hora (existe um teto do que o aluno paga por uma hora de treino). Nos dois casos, o crescimento tem fim.

Compare com a consultoria online: o mesmo tempo gera atendimento para muito mais gente, porque o acompanhamento deixa de depender de uma hora marcada.

## Vender resultado, não sessão

Aluno que compra "aula" compra tempo. Cancela quando aperta o orçamento e some quando a rotina muda. Aluno que compra "emagrecer 8 kg em 12 semanas, com acompanhamento" compra um destino, e continua mesmo nas semanas difíceis.

Pense na diferença entre estas duas frases:

- "Faço treino personalizado, 3 vezes por semana, por R$ 400."
- "Eu ajudo mulheres acima de 30 anos a perder gordura e ganhar força em 12 semanas, com treino, ajuste semanal e suporte no dia a dia."

A segunda tem resultado, prazo e acompanhamento. É isso que se paga mais caro e se renova.

## Assuma o resultado do aluno

Se o aluno não evolui, a pergunta não é "por que ele não se esforça?". É "o que eu mudo no processo?". Dono de negócio olha o próprio sistema. Isso incomoda, mas é também o que te dá poder: o que está sob a sua responsabilidade está sob o seu controle.

## Vender não é errado, é o caminho

Muito treinador sente culpa de vender, como se estivesse empurrando algo. Inverta a lógica: **se o aluno não compra, ele não muda.** O mesmo aluno que você poderia transformar vai ficar na estagnação, trocando de plano a cada segunda-feira. Vender bem é explicar com clareza como você resolve o problema dele e convidá-lo a começar. Quem faz isso com ética presta um serviço.

## Erros comuns

- Achar que subir o preço da hora resolve o teto.
- Misturar "ser bom tecnicamente" com "ter um negócio saudável". São habilidades diferentes.
- Esperar a agenda esvaziar para só então pensar em outro modelo.
- Pedir desculpa ao falar o preço.

## Como usar esta aula

Faça a conta da sua própria agenda no checklist: horas por semana, valor por hora e o teto mensal. Depois escreva, com suas palavras, a frase do resultado que você quer vender. Ela será refinada nas próximas trilhas, mas precisa existir desde já.
$md$,
  checklist = '[{"id":"t0a1-1","text":"Calcular o teto mensal da sua agenda presencial","hint":"Horas por semana x valor da hora x 4, já descontando faltas e feriados."},{"id":"t0a1-2","text":"Escrever a frase do resultado que você vende","hint":"Quem você ajuda, qual resultado, em quanto tempo. Pode ser um rascunho."},{"id":"t0a1-3","text":"Listar 3 tarefas que só você faz hoje e que um processo faria","hint":"Cobrança, envio de treino, resposta repetida: tudo que se repete vira processo."}]'::jsonb
from public.tracks t
where l.track_id = t.id and t.slug = 'comece-por-aqui' and l.position = 1;

update public.lessons l set
  body_md = $md$
## Por que aprender o vocabulário

Conversar sobre negócio sem os termos certos é como prescrever treino sem falar em série e repetição: tudo fica vago. Cada palavra desta aula vira um número que você vai medir, e o que você mede, você melhora. Volte aqui sempre que um termo aparecer e travar a leitura.

> **A regra desta aula:** se você não consegue medir, não consegue melhorar. Cada termo abaixo é uma régua.

## Vendas e captação

| Termo | O que é | Exemplo no seu negócio |
|---|---|---|
| **Lead** | Pessoa que demonstrou interesse e deixou contato | Quem chamou no direct perguntando sobre a consultoria |
| **Funil** | O caminho do desconhecido até o aluno: atenção, interesse, conversa, venda | Viu o reel, chamou, fez a conversa, fechou o plano |
| **Taxa de conversão** | Percentual que avança de uma etapa para a próxima | 20 conversas, 4 vendas: 20% de conversão |
| **Follow-up** | Retorno ativo com quem ainda não decidiu | Mensagem dois dias depois da conversa, retomando a dúvida |
| **Social selling** | Vender por meio das redes, conversando e gerando confiança | Responder stories e abrir conversa com quem interage |
| **Oferta** | O que você vende: resultado, prazo, entrega e preço | Emagrecimento em 12 semanas, com treino, check-in e suporte |
| **Aluno ideal (nicho)** | O perfil que você atende melhor e que mais paga | Mulheres acima de 30 anos que querem perder gordura |
| **Escada de valor** | Sequência de produtos, do mais acessível ao mais completo | Desafio de 21 dias, consultoria trimestral, plano semestral |

## Aluno e relacionamento

| Termo | O que é | Exemplo no seu negócio |
|---|---|---|
| **Onboarding** | Os primeiros dias do aluno, que definem se ele fica | Avaliação inicial, treino liberado em 48 horas, boas-vindas no app |
| **Check-in** | Registro periódico do aluno: peso, fotos, percepção da semana | Formulário semanal enviado todo domingo |
| **Health score** | Nota de saúde da relação, que antecipa quem pode sair | Aluno sem check-in há duas semanas e sem treinos registrados: nota baixa |
| **Churn** | Percentual de alunos que cancelam em um período | Começou o mês com 40 alunos e 4 saíram: churn de 10% |
| **Renovação** | O aluno que termina o plano e contrata de novo | Fim do trimestre, ele fecha o semestre |
| **Recorrência** | Receita que se repete todo mês sem nova venda | Mensalidades de consultoria, cobradas automaticamente |

## Dinheiro

| Termo | O que é | Exemplo no seu negócio |
|---|---|---|
| **Ticket médio** | Valor médio pago por aluno | R$ 6.000 de faturamento com 20 alunos: ticket de R$ 300 |
| **CAC** | Custo para conquistar um aluno novo | Gastou R$ 800 em anúncios e fechou 4 alunos: CAC de R$ 200 |
| **LTV** | Quanto um aluno gera de receita durante toda a permanência | Aluno de R$ 300 que fica 8 meses: LTV de R$ 2.400 |
| **Faturamento** | Tudo o que você vendeu no período | R$ 12.000 vendidos no mês |
| **Receita** | O que de fato vira entrada, depois de taxas e reembolsos | Descontando taxa de cartão e estorno, sobra menos que o vendido |
| **Caixa** | O dinheiro que realmente está disponível na conta | Plano semestral parcelado no cartão: vendeu hoje, recebe aos poucos |
| **Pró-labore** | O salário que você, como dono, retira da empresa | Valor fixo mensal, separado do dinheiro do negócio |

## Como as peças se conectam

Duas contas simples já mudam sua visão. A primeira: **LTV dividido pelo CAC**. Se o aluno gera R$ 2.400 e custa R$ 200 para ser conquistado, o negócio é saudável. A segunda: **churn**. Quanto menor, mais tempo cada aluno fica, maior o LTV e menos você precisa vender só para repor quem saiu.

Tudo isso conversa com o funil: lead vira conversa, conversa vira venda, venda vira aluno, aluno bem acompanhado renova.

## Erros comuns

- Confundir faturamento com lucro e gastar o que ainda não entrou no caixa.
- Olhar só o número de seguidores e ignorar a conversão.
- Misturar o dinheiro da empresa com o seu dinheiro pessoal.
- Medir o churn só quando o aluno já foi embora, em vez de olhar os sinais antes.

## Como usar esta aula

Você não precisa decorar. Salve esta página como consulta. No checklist, escolha os termos que mais afetam o seu negócio hoje e calcule dois deles com números reais, mesmo que aproximados.
$md$,
  checklist = '[{"id":"t0a2-1","text":"Ler as três tabelas e marcar os termos que você não conhecia","hint":"Saber o que ainda falta entender já economiza semanas de dúvida."},{"id":"t0a2-2","text":"Calcular o seu ticket médio atual","hint":"Faturamento do mês dividido pelo número de alunos pagantes."},{"id":"t0a2-3","text":"Calcular o seu churn do último mês","hint":"Alunos que saíram dividido pelos alunos que você tinha no início do mês."},{"id":"t0a2-4","text":"Escrever o seu aluno ideal em uma linha","hint":"Perfil, objetivo principal e a dor que mais aparece nas suas conversas."}]'::jsonb
from public.tracks t
where l.track_id = t.id and t.slug = 'comece-por-aqui' and l.position = 2;

update public.lessons l set
  body_md = $md$
## Dois lugares, duas funções

Muita confusão começa aqui, então vamos separar de uma vez.

**Esta plataforma é onde você aprende e executa o método do negócio.** Aqui estão as trilhas, as aulas escritas com checklist, os checkpoints que fecham cada trilha, a biblioteca de modelos e a aba **Meu Negócio**, onde ficam os seus números e entregas.

**O MyShape é onde você opera a consultoria.** É o painel em que você cadastra o aluno, monta treino e dieta (quando faz parte do seu serviço) e acompanha a evolução. O aluno vê tudo no app dele, com a **sua marca**, não a nossa.

> **Resumindo:** aqui você decide e constrói o negócio. No MyShape você entrega o serviço.

## A ordem recomendada das trilhas

A sequência não é aleatória. Cada etapa sustenta a próxima:

1. **Oferta, antes de tudo.** Sem saber exatamente o que vende, para quem e por quanto, qualquer esforço depois fica solto.
2. **Aprender a vender.** Saber conduzir a conversa e fechar vem antes de trazer gente.
3. **Só então captar.** Não adianta encher o direct de lead se você ainda não sabe fechar: o contato esfria e você acha que o problema é o conteúdo.
4. **Entrega e retenção.** Aluno bem atendido renova e indica, o que baixa o custo de crescer.
5. **Gestão e finanças.** Com a operação rodando, você organiza o tempo, olha os números e define o seu pró-labore.

Se você já domina uma etapa, ainda vale passar pelo checkpoint dela. Muitas vezes é ali que aparece a lacuna que ninguém tinha notado.

## Como o progresso funciona

- Cada aula termina com um **checklist**. Marque só o que você realmente fez.
- Quando todos os itens estão marcados, você conclui a aula.
- Concluídas as aulas, o **checkpoint** da trilha é liberado. Ele é uma entrega prática, e não uma prova de memória.
- O avanço aparece na sua tela, mas o que importa é o que muda no seu negócio.

## Uma semana-tipo de uso

Exemplo de organização para quem tem a agenda cheia:

- **Segunda e quarta:** uma aula da trilha atual, com leitura e execução do checklist.
- **Terça e quinta:** aplicar o que foi aprendido. Escrever a oferta, mandar a mensagem, ajustar o processo.
- **Sexta:** olhar o resultado da semana e anotar o que travou, para levar ao mentor.
- **Fim de semana:** seu check-in com os alunos no MyShape, sem misturar com o horário de estudo.

Um bloco curto e fixo funciona melhor do que uma tarde inteira uma vez por mês.

## Erros comuns

- Pular para captação porque é a parte mais empolgante.
- Usar a plataforma como biblioteca de leitura e nunca marcar o checklist.
- Misturar os dois ambientes: tentar montar o treino aqui ou estudar método dentro do painel de alunos.
- Estudar só quando sobra tempo, e não tem horário reservado.

## Como usar esta aula

Abra o MyShape e esta plataforma em abas separadas. Escolha os dias e horários dos seus blocos de estudo da semana e coloque na agenda agora. Depois dê uma olhada nas trilhas e confirme qual é a sua primeira: para a maioria, é a de oferta.
$md$,
  checklist = '[{"id":"t0a3-1","text":"Abrir as trilhas e identificar a ordem recomendada","hint":"Confira qual é a primeira trilha depois desta e o que ela entrega."},{"id":"t0a3-2","text":"Entrar no MyShape e localizar a área de cadastro de alunos","hint":"Só reconhecer o ambiente, sem precisar cadastrar ninguém agora."},{"id":"t0a3-3","text":"Abrir a aba Meu Negócio e a biblioteca de modelos","hint":"Saiba onde ficam seus números e os modelos que você vai preencher."},{"id":"t0a3-4","text":"Reservar na agenda os blocos de estudo da semana","hint":"Dias e horários definidos, com a mesma força de um aluno marcado."}]'::jsonb
from public.tracks t
where l.track_id = t.id and t.slug = 'comece-por-aqui' and l.position = 3;

update public.lessons l set
  body_md = $md$
## O problema não é falta de conteúdo

O treinador que trava no próprio negócio quase nunca sofre por falta de informação. Sofre por acumular. Assiste a muita coisa, anota, concorda com tudo e não muda nada. Três meses depois está com a mesma agenda e a mesma sensação de que "ainda falta aprender".

Aprender uma habilidade de negócio funciona igual a aprender uma técnica de agachamento: você só melhora executando, olhando o resultado e corrigindo.

> **A fórmula:** aprender, aplicar no mesmo dia, olhar o resultado, ajustar, repetir.

## Os cinco passos da fórmula

1. **Aprender.** Leia uma aula inteira, sem pular para a seguinte. Uma por vez.
2. **Aplicar no mesmo dia.** O que fica para depois não acontece. Se a aula pede uma mensagem, escreva e envie hoje. Se pede uma conta, faça agora.
3. **Olhar o resultado.** Quantas pessoas responderam? Qual número mudou? Sem observar, você aprende de ouvido.
4. **Ajustar.** Mude uma coisa por vez para saber o que funcionou.
5. **Repetir.** A segunda versão quase sempre é melhor que a primeira, e a terceira é melhor ainda.

## Monte o seu ritmo

- **Bloco fixo na agenda.** Exemplo: 30 a 40 minutos, 4 vezes por semana, no mesmo horário. Trate como um aluno marcado, e não como algo que se encaixa se der.
- **Uma aula por vez.** Terminar a aula e o checklist antes de abrir a próxima vale mais do que ler três e executar nenhuma.
- **Ambiente sem interrupção.** Celular longe, notificações do direct desligadas durante o bloco.
- **Registro simples.** Um caderno ou nota no celular com três colunas: o que aprendi, o que fiz, o que aconteceu.

## O checklist é prova de execução

Marcar um item não é dizer "li sobre isso". É dizer "fiz". Se o item pede escrever a sua oferta e você só pensou nela, deixe desmarcado. Um checklist honesto vale mais do que cem por cento de itens marcados sem resultado. É ele que mostra, para você e para o mentor, onde você realmente está.

## Dúvida não é fraqueza

Quando travar, anote a dúvida com o contexto: o que você tentou, o que esperava e o que aconteceu. Leve essa lista ao mentor. Uma dúvida bem descrita se resolve em minutos. Uma dúvida guardada vira semanas de procrastinação.

## Feito é melhor que perfeito

A primeira versão da sua oferta vai ser imperfeita. A primeira mensagem de venda também. Isso é esperado. Um material mediano que foi aplicado gera dado e aprendizado. Um material perfeito que ficou na gaveta não gera nada.

## Ficou uma semana parado?

Acontece com todo mundo: semana de lotação, viagem, imprevisto. Para retomar:

1. Não tente "compensar" estudando tudo de uma vez.
2. Releia o seu último registro e veja onde parou.
3. Volte com um bloco curto, de 20 minutos, apenas no próximo item do checklist.
4. Retome o ritmo normal na semana seguinte.

O que quebra o progresso não é a pausa, é a culpa que faz o treinador desistir de voltar.

## Erros comuns

- Ler várias aulas seguidas e executar nenhuma.
- Esperar o dia perfeito para começar.
- Mudar três coisas ao mesmo tempo e não saber o que deu certo.
- Marcar o checklist para "limpar a lista".

## Como usar esta aula

Defina agora o seu bloco de estudo fixo e escolha o primeiro item do checklist da próxima aula para executar ainda hoje. Crie também a nota onde você vai guardar suas dúvidas para o mentor.
$md$,
  checklist = '[{"id":"t0a4-1","text":"Definir o seu bloco fixo de estudo na agenda","hint":"Dias e horário marcados, de 30 a 40 minutos, 4 vezes por semana."},{"id":"t0a4-2","text":"Criar a nota de registro: aprendi, fiz, aconteceu","hint":"Pode ser caderno ou bloco de notas no celular, o importante é ser fácil de abrir."},{"id":"t0a4-3","text":"Criar a lista de dúvidas para levar ao mentor","hint":"Anote o que tentou, o que esperava e o que aconteceu."},{"id":"t0a4-4","text":"Combinar consigo a regra da retomada se ficar uma semana parado","hint":"Exemplo: voltar com 20 minutos, no próximo item do checklist."}]'::jsonb
from public.tracks t
where l.track_id = t.id and t.slug = 'comece-por-aqui' and l.position = 4;

update public.lessons l set
  body_md = $md$
## Por que medir o ponto de partida

Quem não sabe de onde saiu não percebe o quanto evoluiu. É o mesmo princípio da avaliação inicial do aluno: você tira medidas, fotos e testes no dia um para comparar em 12 semanas. O seu negócio merece o mesmo cuidado.

O diagnóstico inicial faz duas coisas. Primeiro, mostra onde você está de verdade, e não onde acha que está. Segundo, cria a linha de base que vai provar sua evolução nos próximos meses, principalmente nos dias em que parecer que nada mudou.

> **A regra desta aula:** os números não são para julgar você. São para orientar a próxima decisão.

## Os quatro números que você vai levantar

Eles correspondem aos itens do checkpoint desta trilha. Leve o tempo necessário, mas não deixe para depois.

**1. Faturamento médio dos últimos 3 meses.** Some tudo o que você vendeu em cada um dos três meses e divida por três. Considere o que entrou de aulas presenciais, consultoria online, planos e qualquer outro serviço. Use o extrato e as cobranças, não a memória. Meses fortes e fracos se equilibram na média.

**2. Quantos alunos você atende hoje.** Conte **separado**: presenciais de um lado, online do outro. Considere só quem está ativo e pagando. Aluno que "volta quando puder" não conta.

**3. Quantas horas por semana você passa na academia.** Some tudo: aulas, intervalos entre elas, deslocamento e tempo de espera. O que você gasta de tempo é o que realmente custa ao seu negócio.

**4. Sua meta de faturamento para daqui a 6 meses.** Este é o único número que você escolhe, e não o que você descobre. Falamos dele mais abaixo.

## O que os números revelam juntos

Sozinhos eles são dados. Combinados, viram diagnóstico. Exemplo ilustrativo:

| Dado | Valor de exemplo |
|---|---|
| Faturamento médio | R$ 9.000 |
| Horas na academia por semana | 36 |
| Alunos presenciais | 18 |
| Alunos online | 4 |

1. **Faturamento por hora trabalhada:** R$ 9.000 por mês divididos por 144 horas (36 x 4) dão cerca de R$ 62 por hora. Esse número mostra o teto do modelo atual.
2. **Dependência do presencial:** 18 de 22 alunos, ou cerca de 82%, dependem da sua presença. Se você adoecer por duas semanas, quase todo o faturamento fica em risco.
3. **Ticket médio:** R$ 9.000 divididos por 22 alunos dão cerca de R$ 409 por aluno. Compare o ticket do presencial com o do online para decidir onde vale concentrar energia.

Faça as três contas com os seus números. Não se assuste com o resultado: ele é o ponto de partida, e não a sentença.

## Como escolher a meta de 6 meses

Uma boa meta é **ambiciosa, mas possível**. Para testar, faça duas perguntas:

- **Ela me força a mudar algo?** Se bastaria continuar como está, a meta é pequena demais.
- **Eu consigo desenhar o caminho?** Quantos alunos novos, a que ticket, vindos de qual canal? Se não consegue imaginar a conta, a meta é só um desejo.

Uma regra prática: parta do faturamento atual e pense em um salto que exija um novo comportamento, mas que caiba na sua capacidade de atendimento. Anote o valor final e o raciocínio em duas linhas.

## Onde guardar e quando revisar

Escolha **um lugar fixo**: a aba Meu Negócio, uma planilha ou um caderno, desde que sempre o mesmo. Anote a data de hoje ao lado de cada número. A cada trimestre, refaça o levantamento e compare com este. Quem registra evolui com clareza, quem não registra evolui por sensação.

## Erros comuns

- Arredondar para cima por orgulho ou para baixo por insegurança.
- Contar como aluno quem já parou de treinar.
- Esquecer o tempo de deslocamento e de espera nas horas semanais.
- Definir uma meta sem imaginar de onde virá o dinheiro.

## Como usar esta aula

Separe 30 minutos, abra seus extratos e levante os quatro números com calma. Depois preencha os itens do checkpoint desta trilha. Ele libera quando os quatro estiverem preenchidos.
$md$
from public.tracks t
where l.track_id = t.id and t.slug = 'comece-por-aqui' and l.position = 5;


-- Conteúdo das aulas: Posicionamento e Oferta

update public.lessons l set
  body_md = $md$
## Por que afiar o machado antes de cortar a árvore

Se você tenta falar com todo mundo, ninguém se enxerga na sua comunicação. "Treino para quem quer emagrecer, ganhar massa, correr, ter saúde" parece abrir portas. Na prática, fecha todas: o aluno compara você com qualquer outro personal e decide pelo preço.

O nicho dá o oposto. Quando você é **a referência para um tipo específico de aluno**, ganha diferenciação, autoridade e o direito de cobrar mais. O generalista compete por preço. O especialista compete por resultado.

> **A regra desta aula:** comece pelo aluno que você já tem, não pelo aluno que gostaria de ter. O melhor nicho costuma estar escondido na sua própria lista de alunos.

## Passo a passo

**1. Olhe seus alunos atuais e ex-alunos.** Liste todos e marque, para cada um:

- Quem teve **mais resultado**.
- Quem **paga melhor** e paga em dia.
- Quem **indica** outras pessoas.
- Quem **dá menos trabalho** (segue o plano, responde, manda check-in).

**2. Procure o padrão.** Os alunos que aparecem em vários desses grupos têm algo em comum: idade, objetivo, rotina, momento de vida. Esse padrão é o seu candidato a nicho.

**3. Monte o perfil do aluno ideal.** Responda por escrito:

- Idade e fase de vida.
- Objetivo principal.
- Rotina (horário de trabalho, filhos, viagens).
- Dor principal, dita com as palavras dele.
- O que já tentou e por que não funcionou.
- Objeções para contratar (preço, tempo, medo de não conseguir).
- Onde passa o tempo online.
- Quanto consegue investir por mês.

**4. Teste o perfil com a lista de 7 passos.** O guia **7 passos para definir seu público**, nos materiais da trilha, organiza esse raciocínio: do levantamento dos seus melhores alunos até a validação com conversas reais.

**5. Valide com 3 conversas.** Chame três alunos que se encaixam e pergunte: "O que te fez contratar? O que quase te impediu? Qual foi a maior mudança?" As respostas viram a base da sua comunicação.

## Exemplo

Exemplo: uma treinadora olha os 22 alunos ativos e percebe que as mulheres de 35 a 50 anos, com filhos, treinando em casa 3 vezes por semana, são as que mais seguem o plano, mais indicam e pagam em dia. Perfil resumido: "mulher de 35 a 50, rotina corrida, já tentou dieta da moda, quer emagrecer sem sofrer, investe de R$ 250 a R$ 350 por mês". É esse perfil que passa a guiar o conteúdo e a oferta.

## Nicho não é prisão

Escolher um público para comunicar **não significa recusar os outros**. Você continua atendendo quem chegar e se encaixar no seu método. A diferença é que seu perfil, seus posts e sua oferta falam com um tipo de aluno só. Os demais chegam por indicação, e tudo bem.

## Erros comuns

- Escolher o aluno dos sonhos, que você ainda não tem, em vez do que mais aparece e dá resultado.
- Definir nicho só por objetivo ("emagrecimento") sem olhar rotina, dor e orçamento.
- Descrever o aluno com termos técnicos em vez das palavras que ele usa.
- Ter medo de perder alunos e voltar a falar com todo mundo.

## Como usar esta aula

Abra o guia **7 passos para definir seu público**, faça a análise dos seus alunos atuais e escreva o perfil do aluno ideal em uma página. Na próxima aula você vai usar esse perfil para preencher o "quem" da sua oferta. Marque cada item no checklist conforme avançar.
$md$,
  checklist = '[{"id":"t1a1-1","text":"Listar alunos atuais e marcar os 3 a 5 melhores","hint":"Critérios: resultado, pagamento em dia, indicação e pouco trabalho."},{"id":"t1a1-2","text":"Escrever o perfil do aluno ideal em uma página","hint":"Idade, objetivo, rotina, dor, o que já tentou, objeções, online e orçamento."},{"id":"t1a1-3","text":"Fazer o guia 7 passos para definir seu público","hint":"Está nos materiais da trilha. Siga na ordem e anote o resultado."},{"id":"t1a1-4","text":"Conversar com 3 alunos que se encaixam no perfil","hint":"Pergunte o que fez contratar, o que quase impediu e o que mudou."}]'::jsonb
from public.tracks t
where l.track_id = t.id and t.slug = 'posicionamento-oferta' and l.position = 1;

update public.lessons l set
  body_md = $md$
## Por que cobrar por hora trava seu crescimento

Quando você cobra por hora, seu faturamento tem um teto: as horas do seu dia. Além disso, o aluno compra tempo, e tempo é fácil de comparar. "O outro personal cobra R$ 80 a hora, por que você cobra R$ 120?" Essa conversa não existe quando você vende um **pacote de acompanhamento** com resultado e prazo.

Na consulta avulsa, o aluno paga pelo encontro. No pacote, ele paga por treino, ajustes, check-ins semanais, suporte e acompanhamento da evolução. O valor está na transformação, não nos minutos.

> **A regra desta aula:** preço mínimo = (custos do negócio + pró-labore desejado) ÷ número realista de alunos. Abaixo disso você trabalha para pagar boletos.

## Passo a passo: calcule seu preço mínimo

**1. Some os custos mensais do negócio:** ferramentas e app, contador, impostos, internet, taxas de cartão, marketing, equipamento.

**2. Defina o pró-labore desejado:** quanto você quer retirar por mês para viver.

**3. Defina a capacidade realista:** quantos alunos você atende **bem**, com check-in, ajuste e resposta, sem virar refém do celular. Não use o número máximo teórico.

**4. Divida.**

Exemplo: custos de R$ 1.800 por mês, pró-labore desejado de R$ 6.000, capacidade realista de 30 alunos.

| Item | Valor |
| --- | --- |
| Custos do negócio | R$ 1.800 |
| Pró-labore desejado | R$ 6.000 |
| Total necessário | R$ 7.800 |
| Dividido por 30 alunos | **R$ 260 por aluno** |

Esse é o **piso**, não o preço. Se você contar com a agenda sempre cheia, uma desistência já desequilibra a conta. Por isso o preço final precisa ficar acima do piso.

## Ancoragem: mostre o valor antes do preço

Ancorar é apresentar uma referência que faz o preço parecer justo. Duas formas práticas:

- **Valor do resultado primeiro.** Antes de falar de preço, relembre o que o aluno quer mudar e o que isso vale para ele. Só depois apresente o investimento.
- **Plano mais completo primeiro.** Apresente o semestral, depois o trimestral, depois o mensal. O mensal passa a parecer o mais caro por mês, e isso é intencional.

## Planos mensal, trimestral e semestral

Prazo maior significa **mais resultado para o aluno e menos churn para você**. Por isso o prazo maior merece condição melhor.

Exemplo, usando o piso de R$ 260:

| Plano | Por mês | Total |
| --- | --- | --- |
| Mensal | R$ 349 | R$ 349 |
| Trimestral | R$ 299 | R$ 897 |
| Semestral | R$ 269 | R$ 1.614 |

Note que o semestral fica pouco acima do piso. Não dê desconto abaixo dele. E ajuste os valores ao **poder aquisitivo do seu nicho**: o perfil que você definiu na primeira aula diz quanto ele consegue investir.

## Como reajustar sem perder aluno

1. **Alunos novos** já entram no preço novo. Sem exceção e sem pedir desculpa.
2. **Alunos antigos** recebem aviso prévio de 30 a 60 dias.
3. Ofereça uma **condição de transição**: manter o valor antigo por mais um ciclo se renovar antecipado, por exemplo.

Exemplo de mensagem: "Oi, Carla! A partir de março o acompanhamento passa a R$ 329 por mês. Como você está comigo desde o início, se renovar o trimestral até o fim de fevereiro, mantenho o valor atual nesse período."

Repare: informa, explica a condição e para por aí. Sem "infelizmente" e sem "desculpa".

## Erros comuns

- Calcular o preço olhando só o que o concorrente cobra.
- Usar o máximo de alunos que você aguenta, não o que atende bem.
- Dar desconto no plano longo até chegar abaixo do piso.
- Reajustar de forma escondida, sem avisar o aluno antigo.

## Como usar esta aula

Abra a **Planilha de Precificação** nos materiais da trilha, preencha custos, pró-labore e capacidade e descubra seu piso. Depois monte os três planos e escreva a mensagem de reajuste. Marque cada etapa no checklist.
$md$,
  checklist = '[{"id":"t1a3-1","text":"Calcular seu preço mínimo na Planilha de Precificação","hint":"Custos mais pró-labore, divididos pela capacidade realista de alunos."},{"id":"t1a3-2","text":"Definir os planos mensal, trimestral e semestral","hint":"Prazo maior com condição melhor, sempre acima do seu piso."},{"id":"t1a3-3","text":"Ensaiar a apresentação com valor antes do preço","hint":"Resultado primeiro e plano mais completo no topo da lista."},{"id":"t1a3-4","text":"Escrever sua mensagem de reajuste para alunos antigos","hint":"Aviso prévio, condição de transição e nenhum pedido de desculpa."}]'::jsonb
from public.tracks t
where l.track_id = t.id and t.slug = 'posicionamento-oferta' and l.position = 3;

update public.lessons l set
  body_md = $md$
## Um produto só deixa dinheiro na mesa

Quem só tem a consultoria de R$ 300 por mês perde dois grupos de pessoas. O primeiro é quem ainda não confia em você para um compromisso mensal. O segundo é o aluno que gosta do trabalho e gostaria de algo mais completo. Para os dois você não tem o que oferecer.

A escada de valor resolve isso. Ela organiza seus produtos em **degraus de compromisso e de preço**, para que cada pessoa entre no ponto certo e suba quando fizer sentido.

> **A regra desta aula:** cada degrau prepara o próximo. Um produto que não leva a lugar nenhum é um beco sem saída.

## Os degraus

1. **Conteúdo gratuito.** Posts, vídeos e stories que mostram como você pensa. Gera atenção e confiança.
2. **Isca.** Algo gratuito em troca do contato: um guia de treino em casa, um desafio de 7 dias. Transforma seguidor em lead.
3. **Produto de entrada.** Barato e de entrega rápida: um desafio pago de 21 dias, uma avaliação avulsa, uma planilha de treino. Mostra a qualidade do seu trabalho com pouco risco para o aluno.
4. **Consultoria online.** Seu produto principal: treino, check-ins semanais, ajustes e suporte, entregues no MyShape e no app com a sua marca.
5. **Acompanhamento premium.** Mais contato e mais atenção: call mensal, resposta prioritária, encontros presenciais no formato híbrido. Poucas vagas e ticket maior.

## Upgrade e downsell

**Upgrade** é a subida natural de quem já é aluno. Quem fechou a consultoria e está engajado pode receber o convite para o premium. É a venda mais fácil que existe, porque a confiança já está construída.

**Downsell** é a oferta menor para quem não fechou o principal. Se a pessoa disse "gostei, mas agora não consigo", não encerre a conversa. Ofereça o produto de entrada. Você não perde a venda, e ela passa a conhecer seu trabalho por dentro.

Exemplo de mensagem: "Entendo que agora o valor da consultoria pesa. Tenho um desafio de 21 dias por R$ 97, em que você já treina com plano e check-in. Se gostar, a gente conversa sobre o acompanhamento completo."

## Como isso aumenta o LTV

LTV é o quanto um aluno gera de receita ao longo de toda a relação com você. Com a escada, o mesmo aluno pode entrar pelo desafio, virar consultoria, renovar e depois subir para o premium. Você cresce o ticket médio **sem precisar de mais seguidores**, e o custo para vender ao aluno que já existe é muito menor do que o de conquistar um novo.

## Passo a passo para montar a sua

1. Escreva quais produtos você já vende hoje, mesmo que informalmente.
2. Marque em que degrau cada um está.
3. Identifique o degrau que falta com mais urgência: costuma ser o produto de entrada ou o downsell.
4. Defina, para cada degrau, o preço, o que entrega e para qual degrau ele aponta.
5. Escreva o convite de upgrade e o de downsell.

## Erros comuns

- Criar cinco degraus antes de ter alunos. **Comece com 2 ou 3.**
- Fazer um produto de entrada tão bom que ninguém precisa do principal.
- Esquecer de convidar o aluno atual para o degrau acima.
- Deixar o downsell parecer um prêmio de consolação em vez de um bom começo.

## Como usar esta aula

Desenhe sua escada em uma folha, com no máximo três degraus no começo, e defina o próximo passo de cada um. Redija as duas mensagens (upgrade e downsell) e marque os itens no checklist.
$md$,
  checklist = '[{"id":"t1a4-1","text":"Desenhar sua escada de valor com 2 ou 3 degraus","hint":"Liste o que já vende e escolha só o que consegue entregar bem agora."},{"id":"t1a4-2","text":"Definir preço e entrega de cada degrau","hint":"Cada um deve apontar claramente para o degrau seguinte."},{"id":"t1a4-3","text":"Escrever a mensagem de downsell","hint":"Para quem não fecha o principal: ofereça o produto de entrada."},{"id":"t1a4-4","text":"Escrever o convite de upgrade para alunos atuais","hint":"Escolha 3 alunos engajados e convide para o degrau premium."}]'::jsonb
from public.tracks t
where l.track_id = t.id and t.slug = 'posicionamento-oferta' and l.position = 4;


-- Conteúdo das aulas: Vendas

update public.lessons l set
  body_md = $md$
## Por que a conversa decide tudo

Muito treinador tem bom conteúdo, bom resultado e um Direct cheio de curiosos. O que falta não é aluno. É uma **conversa de venda com começo, meio e fim**. Quem improvisa fala demais, empurra o preço cedo e perde quem estava quase fechando.

A boa notícia: na saúde, vender bem é fazer o que você já sabe fazer. Você não prescreve treino sem avaliar. Na venda é igual.

> **A regra desta aula:** diagnostique antes de prescrever. Primeiro você entende, depois você propõe. A proposta fica no fim da conversa, nunca no começo.

## Dois estágios, dois objetivos

**1. Qualificação (pré-venda).** Uma conversa curta, em geral por mensagem, para responder três perguntas: essa pessoa é o perfil que você atende? Ela tem urgência? Ela pode investir? Se alguma resposta for não, você encerra com educação e economiza o seu tempo.

**2. Fechamento.** A avaliação em si, por chamada, vídeo ou presencial. Aqui entra o roteiro abaixo. O objetivo é transformar o curioso em aluno, sem pressão e sem improviso.

## O roteiro em 4 partes

### 1. Abertura: como você começa a conversa

Em dois minutos você faz três coisas: agradece, explica como vai ser e pede permissão para perguntar. Isso baixa a guarda e deixa você conduzir.

Exemplo: "Obrigado por separar esse tempo. Vou te fazer algumas perguntas sobre sua rotina e seu objetivo, e no final te mostro se e como posso te ajudar. Pode ser assim?"

### 2. Diagnóstico: as perguntas que você faz

Esta é a parte mais longa e a mais importante. Faça perguntas em camadas, da mais fácil para a mais profunda:

- **Situação:** qual é o seu objetivo hoje? Como é a sua rotina de treino e de alimentação? Quanto tempo você tem por dia?
- **Histórico:** o que você já tentou? O que funcionou e o que fez você parar?
- **Problema:** o que mais te incomoda hoje? Em que ponto você trava?
- **Consequência:** se nada mudar nos próximos seis meses, como você se vê? O que isso custa para você (saúde, autoestima, energia)?
- **Ganho:** se isso estivesse resolvido, o que mudaria na sua vida?

Anote, de preferência com as palavras exatas do aluno. Elas voltam na proposta.

**Escute mais do que fala.** Uma boa proporção é 70% dele, 30% você. Depois de cada resposta, pergunte "e por que isso é importante pra você?" ou "me conta mais". O silêncio depois da pergunta também ajuda.

### 3. Proposta: como você apresenta a oferta

Só agora você fala da consultoria. A proposta liga **a dor que ele descreveu** à **promessa da sua oferta**, usando as palavras dele.

Exemplo: "Você me disse que já tentou três dietas, que perde o foco depois do segundo mês e que não aguenta mais se sentir cansada. É exatamente por isso que meu acompanhamento tem check-in toda semana: eu ajusto o plano antes de você desanimar. Funciona assim..."

Depois apresente o que está incluso e o valor. Um plano recomendado, claro, com o que ele recebe.

### 4. Fechamento: a pergunta final

Direta, sem pressão e sem rodeio. Exemplos:

- "Faz sentido para você? Quer começar ainda esta semana?"
- "Como você prefere pagar, Pix ou cartão?"

Depois de perguntar, **fique em silêncio** e deixe a pessoa responder.

## Erros comuns

- Falar o preço antes de entender a dor.
- Fazer só perguntas de situação e pular a consequência.
- Apresentar a oferta com palavras suas, não com as do aluno.
- Terminar sem pedir uma decisão ("qualquer coisa me chama").

## Como usar esta aula

Escreva o seu script com as quatro partes: abertura, 5 a 8 perguntas de diagnóstico, uma proposta com espaço para as palavras do aluno e a sua pergunta de fechamento. Treine em voz alta com um amigo ou com alguém da família. Depois use no checklist do checkpoint desta trilha, que pede cada parte do roteiro pronta.
$md$
from public.tracks t
where l.track_id = t.id and t.slug = 'vendas' and l.position = 1;

update public.lessons l set
  body_md = $md$
## Objeção não é rejeição

Quando o aluno diz "está caro" ou "vou pensar", muito treinador entende "não". Quase nunca é. A objeção é um **pedido de segurança**: a pessoa ainda não tem certeza de que vai funcionar, de que cabe na vida dela ou de que vale o valor.

Quem trata a objeção como ataque se defende ou desconta o preço. Quem trata como pergunta responde com calma e fecha mais.

> **A regra desta aula:** nunca responda a objeção de cara. Primeiro acolha, depois descubra o que está por trás.

## O método em 4 tempos

1. **Acolher.** Mostre que entendeu, sem discutir. "Faz sentido você pensar nisso."
2. **Perguntar o que está por trás.** "Quando você diz que está caro, é em relação ao orçamento do mês ou você ainda não tem certeza do resultado?"
3. **Responder com a oferta.** Agora que você sabe a causa real, responda apontando o que a oferta entrega para aquele caso.
4. **Confirmar.** "Isso resolve a sua dúvida?" Só depois retome o fechamento.

## Respostas-modelo

Use como ponto de partida e reescreva com a sua voz.

**"Está caro."**
"Entendo. Me ajuda a comparar: com o que você está comparando? Se for com uma aula avulsa, a diferença é que aqui você tem plano, ajuste semanal e suporte durante a semana. Se o problema é caber no mês, tenho uma opção de plano trimestral com parcela menor."

**"Não tenho tempo."**
"Por isso mesmo o plano é montado em cima da sua rotina. Você me disse que treina 3 vezes por semana, 40 minutos. É isso que vou prescrever, nem um minuto a mais. O que toma o seu tempo hoje é ficar sem direção."

**"Vou pensar."**
"Claro. Só para eu te ajudar a decidir: o que exatamente você quer pensar? É o valor, o formato ou se vai dar certo para você?" Quase sempre o "pensar" esconde uma das três. Combine uma data: "Posso te chamar na quinta para você me dar a resposta?"

**"Preciso falar com meu marido / minha esposa."**
"Faz todo sentido. O que você acha que ele(a) vai perguntar? Posso te mandar um resumo do plano para vocês verem juntos, ou fazer uma chamada rápida com os dois." Facilite a decisão em vez de esperar.

**"Já tentei e não funcionou."**
"Obrigado por contar. O que você tentou, e onde parou de funcionar? ... Aqui a diferença é que você não fica sozinho: o check-in semanal pega o problema cedo e eu ajusto o plano."

**"Vou começar sozinho."**
"Pode ser uma boa. Posso te perguntar o que te faz preferir começar sozinho? ... Se em 30 dias você sentir que está sem direção, a porta fica aberta, e o seu diagnóstico de hoje já está comigo."

Seja honesto: se o plano não cabe ou não é o perfil, diga. Perder uma venda errada é melhor que ter um aluno insatisfeito.

## A objeção que sempre aparece avisa algo

Se três pessoas seguidas dizem "está caro", provavelmente você apresentou o valor tarde ou fraco. Se todo mundo diz "não tenho tempo", sua oferta não mostra que o plano cabe na rotina. **Objeção repetida é falha de apresentação**, não falha do aluno. Corrija a apresentação.

## Monte o seu banco de respostas

Use a caixinha de perguntas nos stories: "Qual a sua maior dúvida antes de contratar uma consultoria?" Junte as respostas reais. Para cada objeção, escreva a sua resposta em 3 passos (acolher, perguntar, responder). Guarde num documento e consulte antes de cada conversa.

## Como usar esta aula

Liste as 6 objeções acima e escreva a sua resposta para cada uma, com as suas palavras e a sua oferta. Publique a caixinha nos stories para descobrir as objeções reais da sua audiência e acrescente ao banco. Marque cada passo no checklist.
$md$,
  checklist = '[{"id":"t2a2-1","text":"Escreva sua resposta para as 6 objeções mais comuns","hint":"Acolher, perguntar o que está por trás, responder com a oferta e confirmar."},{"id":"t2a2-2","text":"Publique uma caixinha de perguntas nos stories","hint":"Pergunte qual a maior dúvida antes de contratar uma consultoria."},{"id":"t2a2-3","text":"Adicione 3 objeções reais ao banco de respostas","hint":"Use as respostas da caixinha e das conversas que você já teve."},{"id":"t2a2-4","text":"Treine as respostas em voz alta com alguém","hint":"Quem treina soa natural. Quem lê da tela soa roteirizado."}]'::jsonb
from public.tracks t
where l.track_id = t.id and t.slug = 'vendas' and l.position = 2;

update public.lessons l set
  body_md = $md$
## O melhor momento para vender

Quem acabou de fazer uma avaliação com você está no **pico de desejo**. Acabou de ver o diagnóstico, entendeu o que precisa mudar e ainda está lembrando o que sente. Esse é o momento de apresentar o acompanhamento. Se você deixa para "depois", a emoção esfria e a venda some.

Isso vale especialmente para quem fez uma avaliação avulsa e ainda não é aluno. Seu objetivo é converter essa avaliação em um **plano de acompanhamento**, sem pressão e com a oferta clara na mão.

> **A regra desta aula:** a avaliação mostra o problema, o plano resolve. Apresente a solução enquanto o problema está na cabeça do aluno.

## Passo a passo do fechamento

1. **Resuma o diagnóstico com as palavras dele.** "Você me disse que quer perder 8 kg para o casamento, que trava nos finais de semana e que treina sem direção. A avaliação mostrou isso, e isso é resolvível."
2. **Apresente um plano recomendado e uma alternativa.** Duas opções, não cinco. O plano recomendado é o que você acredita que resolve. A alternativa é uma versão menor ou mais curta.
3. **Faça a pergunta de fechamento.** "Qual dos dois faz mais sentido para você?" Perguntar qual, e não se, é natural e mantém a conversa em frente.
4. **Receba na hora.** Tenha o link de pagamento, a chave Pix e a opção de cartão prontos. Nada de "te mando depois": é aí que a venda esfria.
5. **Se não couber no orçamento, ofereça downsell.** Um plano mais simples, um prazo menor ou uma parcela diferente. Exemplo: "Se o trimestral pesa agora, posso te oferecer o mensal por R$ 250 e você decide a renovação no fim do mês."
6. **Logo depois do sim, entregue.** Mande a boas-vindas imediatamente, com a primeira ação: acessar o app do aluno, preencher a anamnese ou agendar o primeiro check-in. Quem ouve "bem-vindo" e já tem o que fazer não sente arrependimento da compra.

## Exemplo: o fim de uma avaliação

"Fechamos o diagnóstico. Pelo que vimos, o plano que mais combina com você é o trimestral: treino em 4 fases, ajuste toda semana e suporte no WhatsApp. Se preferir começar menor, tem o mensal. Qual faz mais sentido para você?"

Silêncio. Deixe a pessoa responder.

Se ela escolher: "Ótimo. Vou te mandar o link agora. Pode ser Pix ou cartão?" E depois do pagamento: "Pronto. Em 5 minutos você recebe o acesso ao app. A primeira tarefa é preencher a avaliação inicial."

## E se for não?

Um não não é o fim. Registre no mesmo dia:

- o motivo declarado (valor, tempo, momento).
- o que ele disse que o faria decidir.
- a data combinada para você retomar.

Depois, entre na cadência de follow-up da próxima aula. Quem sai da avaliação com "vou pensar" e um combinado de data tem muito mais chance de voltar do que quem sai com "qualquer coisa me chama".

## Erros comuns

- Terminar a avaliação sem apresentar o plano.
- Oferecer opções demais e travar a decisão.
- Esperar o aluno pedir o valor.
- Mandar o link de pagamento só no dia seguinte.
- Deixar a pessoa sem nenhum próximo passo depois do sim.

## Como usar esta aula

Prepare o seu fechamento: um plano recomendado, uma alternativa, o link de pagamento pronto, a mensagem de boas-vindas e a lista de ações do primeiro dia. Monte também a sua folha de registro do "não". Marque cada item no checklist e use na sua próxima avaliação.
$md$,
  checklist = '[{"id":"t2a3-1","text":"Defina um plano recomendado e uma alternativa","hint":"Duas opções claras, com o que está incluso e o valor de cada uma."},{"id":"t2a3-2","text":"Deixe o link de pagamento e o Pix prontos","hint":"Receber na hora evita o te mando depois, onde a venda esfria."},{"id":"t2a3-3","text":"Escreva a mensagem de boas-vindas com a primeira ação","hint":"Acesso ao app, anamnese ou primeiro check-in. O aluno precisa ter o que fazer."},{"id":"t2a3-4","text":"Crie o registro do não: motivo e data de retomada","hint":"Anote o que ele disse que o faria decidir. Isso alimenta o follow-up."}]'::jsonb
from public.tracks t
where l.track_id = t.id and t.slug = 'vendas' and l.position = 3;

update public.lessons l set
  body_md = $md$
## A venda que acontece depois

A maior parte das vendas de consultoria **não acontece na primeira conversa**. A pessoa gostou, mas não era o momento: faltava dinheiro, tempo, decisão ou confiança. Quem para no primeiro "não agora" abandona justamente o lead mais quente que tem.

Follow-up não é cobrar. É **continuar presente, agregando valor, até a pessoa estar pronta**.

> **A regra desta aula:** cada mensagem de follow-up precisa dar algo (uma dica, um resultado, um convite) além de perguntar "e aí, decidiu?".

## Cadência sugerida

Exemplo de ritmo após uma conversa ou avaliação sem fechamento:

| Dia | Objetivo da mensagem |
|-----|----------------------|
| 1 | Agradecer e enviar o resumo do que foi combinado |
| 3 | Mandar um conteúdo útil ligado à dor dele |
| 7 | Perguntar com leveza se ficou alguma dúvida |
| 15 | Contar uma novidade ou abrir uma vaga específica |
| 30 | Convite final com prazo e opção de plano menor |

Ajuste ao seu ritmo. O importante é ter uma cadência escrita, em vez de lembrar quando der.

## Mensagens-modelo

**Dia 1:** "Oi, [nome]! Foi muito bom conversar hoje. Deixei aqui o resumo do que combinamos. Qualquer dúvida, me chama."

**Dia 3:** "Lembrei de você: fiz um material sobre como manter a dieta no fim de semana, que era uma das suas travas. Quer que eu te mande?"

**Dia 7:** "Oi, [nome]! Ficou alguma dúvida sobre o plano? Se quiser, conversamos 10 minutos."

**Dia 15:** "Abri duas vagas para começar no dia 1. Lembrei de você porque o seu perfil combina muito. Quer que eu reserve uma?"

**Dia 30:** "Última mensagem por enquanto, [nome]. Se ainda faz sentido, tenho o plano mensal com condição até sexta. Se não for o momento, tudo bem, e a porta fica aberta."

Se tiver dificuldade para escrever, uma ferramenta de IA pode rascunhar a primeira versão. Revise sempre para soar como você.

## Follow-up contínuo

Quem não comprou não precisa sumir. Mantenha o lead no seu radar por semanas: responda stories, mande conteúdo relevante, convide para um desafio ou uma live. Isso é nutrir. Com o tempo, a pessoa lembra de você quando a hora chegar.

## Resgate conversas paradas

Abra o WhatsApp e busque conversas das últimas semanas em que a pessoa demonstrou interesse e a conversa parou. Essas são vendas pela metade. Uma mensagem simples reabre: "Oi, [nome]! Lembrei da nossa conversa sobre seu objetivo. Ainda faz sentido pra você?"

## Reative ex-alunos

Ex-alunos são a sua lista mais quente: já confiam em você e conhecem o método. Convide-os de volta com uma condição de retorno ou uma nova fase. É a forma mais rápida de gerar caixa.

## Registre tudo numa planilha

Sem registro, o follow-up morre. Crie uma planilha simples com: nome, data do último contato, etapa (qualificado, avaliado, proposta, follow-up), próximo passo e data do próximo passo. Toda manhã, abra e execute o que vence no dia.

## Erros comuns

- Mandar só "e aí, decidiu?" a cada mensagem.
- Insistir todo dia e queimar o lead.
- Não anotar a data do próximo contato.
- Esquecer os ex-alunos.

## Como usar esta aula

Monte a planilha de leads, escreva sua cadência de 5 mensagens, resgate 5 conversas paradas e convide ao menos 3 ex-alunos de volta. Use também o material da trilha, **Follow-up inteligente**, como apoio para as mensagens. Marque cada item no checklist.
$md$,
  checklist = '[{"id":"t2a4-1","text":"Crie a planilha de leads com etapa e próximo passo","hint":"Colunas: nome, último contato, etapa, próximo passo e data."},{"id":"t2a4-2","text":"Escreva a sua cadência de 5 mensagens de follow-up","hint":"Dias 1, 3, 7, 15 e 30, cada uma agregando valor e não só cobrando."},{"id":"t2a4-3","text":"Resgate 5 conversas paradas no WhatsApp","hint":"Busque quem demonstrou interesse e a conversa esfriou."},{"id":"t2a4-4","text":"Convide 3 ex-alunos para voltar","hint":"É sua lista mais quente e gera caixa rápido."}]'::jsonb
from public.tracks t
where l.track_id = t.id and t.slug = 'vendas' and l.position = 4;


-- Conteúdo das aulas: Captação

update public.lessons l set
  body_md = $md$
## Likes não pagam boleto

Muito treinador posta todo dia e não recebe uma única mensagem de aluno. O problema quase nunca é frequência. É falta de intenção: o post foi feito para "aparecer", não para atrair a pessoa certa. Quem curte seu vídeo de agachamento pode ser outro personal. Quem manda mensagem perguntando sobre emagrecimento depois de ler seu post é aluno.

> **A regra desta aula:** todo post tem um objetivo antes de existir. Ou ele **atrai** gente nova, ou gera **confiança** em quem já te segue, ou **vende**. Se você não sabe qual dos três é, não publique ainda.

## Os 5 tipos de post que funcionam

1. **Educativo.** Ensina uma coisa pequena e aplicável. Exemplo: "3 erros que travam o emagrecimento de mulheres acima de 30". Atrai e mostra que você domina o assunto.
2. **Engajamento.** Pergunta, enquete, caixinha, opinião. Exemplo: "Qual é a sua maior dificuldade para treinar 4 vezes na semana?". Aproxima e ainda entrega ideias de conteúdo.
3. **Prova.** Resultados de alunos (com autorização por escrito), bastidores de um check-in, uma conversa de acompanhamento, sua rotina montando treinos no MyShape. Gera confiança.
4. **História.** Por que você virou personal, o aluno que quase desistiu, o erro que você cometeu no começo. Gente compra de gente, não de perfil.
5. **Tendência.** Um formato ou assunto do momento, ligado ao seu nicho. Use com moderação: ele traz alcance, mas nem sempre traz o aluno certo.

## Uma grade de 6 dias (sugestão)

| Dia | Tipo | Objetivo | Exemplo |
|---|---|---|---|
| Segunda | Educativo | Atrair | Erro comum no treino de hipertrofia |
| Terça | Engajamento | Atrair | Enquete sobre a rotina do seu público |
| Quarta | Prova | Confiança | Resultado de um aluno, com autorização |
| Quinta | Educativo | Atrair | Passo a passo de um exercício |
| Sexta | História | Confiança | Sua história ou a de um aluno |
| Sábado | Venda | Vender | Convite para a avaliação inicial |

Domingo é folga ou tendência leve. Uma regra simples: 4 de cada 6 posts atraem ou geram confiança, e 1 vende. Quem só vende, cansa. Quem nunca vende, não fatura.

## Stories que vendem

Story solto vira ruído. Story que vende segue uma narrativa de 3 a 5 telas:

1. **Problema:** "Quantas vezes você começou a dieta na segunda e largou na quarta?"
2. **Virada:** o que muda quando existe acompanhamento semanal e plano ajustado.
3. **Convite:** "Estou abrindo 5 vagas de avaliação gratuita esta semana. Quer a sua? Me responde aqui."

O convite sempre pede uma resposta no direct. É ali que a conversa começa (veremos isso nas próximas aulas).

## Você é a vitrine

Na consultoria online, o produto é o seu acompanhamento, e quem o garante é você. Mostre seu rosto, sua voz, sua forma de treinar e de falar com o aluno. Perfil sem pessoa vira catálogo. Perfil com pessoa vira confiança.

## Calendário mensal simples

1. Escolha 4 temas do mês, um por semana, ligados às dores do seu aluno ideal (ex.: falta de tempo, platô, constância, alimentação).
2. Distribua os tipos de post na grade acima.
3. Grave tudo em um ou dois blocos por semana, em vez de pensar no post na hora.
4. No fim do mês, olhe quais posts geraram mensagens no direct, não só curtidas, e repita esses formatos.

## Erros comuns

- Postar só treino bonito e esperar que alguém pergunte o preço.
- Usar o mesmo tipo de post toda semana.
- Mostrar resultado de aluno sem autorização.
- Nunca fazer um convite claro.

## Como usar esta aula

Abra o **Calendário de postagens** nos materiais e monte as próximas 4 semanas com a grade acima. Use o **Banco de referências de conteúdo** para escolher temas e formatos. Marque cada item do checklist ao concluir.
$md$,
  checklist = '[{"id":"t3a1-1","text":"Defini o objetivo de cada tipo de post","hint":"Para cada post: atrair, gerar confiança ou vender."},{"id":"t3a1-2","text":"Montei minha grade semanal de 6 dias","hint":"Misture educativo, engajamento, prova, história e venda."},{"id":"t3a1-3","text":"Preenchi o calendário do mês","hint":"Use o Calendário de postagens e escolha 4 temas ligados às dores."},{"id":"t3a1-4","text":"Roteirizei uma sequência de stories com convite","hint":"Problema, virada e convite para responder no direct."}]'::jsonb
from public.tracks t
where l.track_id = t.id and t.slug = 'captacao' and l.position = 1;

update public.lessons l set
  body_md = $md$
## Audiência não é agenda cheia

Ter 10 mil seguidores e nenhuma avaliação marcada é comum. Seguidor é atenção, não é lead. Entre o seguidor e o aluno existe um caminho, e quem não o desenha depende de sorte: alguém aparece no direct, ou não aparece.

> **A regra desta aula:** cada etapa do funil tem uma única função, e você mede a passagem de uma para a próxima. Sem medir, você não sabe onde está vazando.

## As 5 etapas

1. **Atenção:** a pessoa vê seu conteúdo.
2. **Interesse:** ela segue, salva, comenta, responde story.
3. **Conversa:** ela fala com você no direct ou no WhatsApp.
4. **Avaliação:** ela marca uma avaliação inicial.
5. **Venda:** ela contrata o acompanhamento.

Cada etapa tem um número. Exemplo: de 100 pessoas que viram o convite, 10 chamaram no direct; dessas 10, 4 fizeram avaliação; 2 fecharam. Esses números são ilustrativos. O seu vai ser diferente, e é por isso que você precisa medir o seu.

## O funil de conteúdo (palavra-chave)

É o funil mais simples de começar. Funciona assim:

1. Você publica um post útil, por exemplo "Guia de 7 dias para voltar a treinar depois de parar".
2. Na legenda ou no vídeo, a chamada: "Comente QUERO que eu te envio no direct".
3. Quem comenta recebe o material no direct e uma pergunta que puxa conversa.

Esse envio pode ser automatizado com ferramentas de automação do Instagram, mas a conversa depois dele deve ser sua. A automação entrega o material. Quem vende é você.

## Formulário de aplicação

Antes de marcar a avaliação, peça que a pessoa preencha um formulário curto: objetivo, rotina de treino, lesões, disponibilidade, e quanto ela está disposta a investir por mês. Isso qualifica o lead e economiza seu tempo. Quem não responde ou não tem perfil sai do caminho sem você gastar 40 minutos de avaliação.

## Funil em ampulheta

O funil clássico termina na venda. A ampulheta continua depois dela:

- **Captar:** atrair e converter.
- **Reter:** check-in semanal, ajuste de treino, boa experiência. Aluno que fica 8 meses vale mais do que o que sai no segundo.
- **Indicar:** aluno satisfeito indica. Peça de forma estruturada, no momento em que ele celebra um resultado.

Captar é caro. Reter e gerar indicação é a forma mais barata de crescer.

## Combine 2 ou 3 funis

Um funil só é frágil. Combine, por exemplo:

- Palavra-chave em post (conteúdo).
- Resposta de story (relacionamento).
- Indicação de alunos atuais.

Comece com um, estabilize e adicione o próximo.

## Passo a passo

1. Desenhe as 5 etapas do seu caminho em uma folha.
2. Escolha o primeiro funil (sugestão: palavra-chave).
3. Crie o material que será entregue (guia, aula curta, planilha de treino).
4. Monte o formulário de aplicação.
5. Registre toda semana: pessoas que viram, conversas abertas, avaliações marcadas, vendas.

## Erros comuns

- Entregar o material e nunca mais falar com a pessoa.
- Marcar avaliação com qualquer um, sem filtro.
- Medir só curtidas e seguidores.
- Montar cinco funis ao mesmo tempo e não terminar nenhum.

## Como usar esta aula

Abra o **Funil Ampulheta** e o **Formulário de aplicação de lead** nos materiais. Adapte os dois para o seu nicho e marque o checklist conforme avançar.
$md$,
  checklist = '[{"id":"t3a2-1","text":"Desenhei as 5 etapas do meu funil","hint":"Atenção, interesse, conversa, avaliação e venda, com o seu caminho real."},{"id":"t3a2-2","text":"Criei um funil de palavra-chave","hint":"Um post, uma palavra para comentar e um material para enviar."},{"id":"t3a2-3","text":"Montei meu formulário de aplicação","hint":"Use o modelo dos materiais e inclua objetivo, rotina e investimento."},{"id":"t3a2-4","text":"Defini os números que vou medir por etapa","hint":"Conversas abertas, avaliações marcadas e vendas, toda semana."}]'::jsonb
from public.tracks t
where l.track_id = t.id and t.slug = 'captacao' and l.position = 2;

update public.lessons l set
  body_md = $md$
## Venda por relacionamento

Treinador sabe criar vínculo com aluno na academia. No Instagram, muitos esquecem disso e viram o spam do direct: "Oi, tudo bem? Faço consultoria online, R$ 297, vamos fechar?". Ninguém responde, e quem responde costuma ser para reclamar.

Social selling é o oposto: você usa a rede para **conversar**, entender a pessoa e só então convidar. Quem vende bem por direct parece alguém interessado em ajudar, porque é.

> **A regra desta aula:** a primeira mensagem não vende nada. Ela abre uma conversa. A venda acontece na avaliação, não no direct.

## Quem abordar

Abordar todo mundo é desperdício. Priorize quem já demonstrou interesse:

- Quem respondeu ou reagiu aos seus stories.
- Quem curtiu vários posts seguidos.
- Quem começou a seguir você e tem o perfil do seu aluno ideal.
- Quem comentou nos seus posts, especialmente a palavra-chave.

## A primeira mensagem

Cite algo real e faça uma pergunta simples. Exemplos:

- "Vi que você respondeu meu story sobre treino em casa. Você treina hoje ou está querendo voltar?"
- "Vi que você começou a me seguir. Qual é o seu foco agora: emagrecer, ganhar massa ou ter mais disposição?"
- "Obrigado pelo comentário! Posso te perguntar o que mais te trava hoje na rotina de treino?"

Sem preço, sem apresentação longa, sem "consultoria".

## Perguntas que descobrem a dor

Depois que a pessoa responde, aprofunde com uma pergunta por vez:

1. Há quanto tempo você quer isso?
2. O que já tentou até agora?
3. O que mais atrapalha: tempo, constância, dieta, lesão?
4. Se nada mudar, como você imagina os próximos 6 meses?

Escute e reflita o que ela disse. A dor dela, nas palavras dela, vale mais do que qualquer argumento seu.

## Quando convidar para a avaliação

Convide quando a pessoa já contou o objetivo e o que a trava. Exemplo: "Pelo que você me contou, faz sentido a gente conversar com calma. Faço uma avaliação inicial para entender sua rotina e te mostrar um caminho. Quer que eu te chame no WhatsApp para marcar?"

## Levar para o WhatsApp

O direct é para abrir. O WhatsApp é para avançar. Peça o número com naturalidade, envie uma mensagem curta de apresentação com seu nome e marque o horário da avaliação.

## Organize os contatos

Sem registro, você esquece quem pediu retorno. Use etiquetas do Instagram ou do WhatsApp Business, ou uma planilha simples com nome, origem, data do último contato e próximo passo.

## Rotina diária

Exemplo: 30 minutos por dia, de 15 a 20 conversas. Divida em:

1. 10 minutos respondendo quem te escreveu.
2. 10 minutos abordando quem interagiu com seus stories.
3. 10 minutos retomando conversas paradas.

## Mensagens-modelo

- **Resposta de story:** "Curti sua resposta! Você já treina ou está pensando em começar?"
- **Novo seguidor:** "Bem-vindo! Me conta, o que te fez seguir meu perfil?"
- **Retomada:** "Oi, tudo bem? Lembrei da nossa conversa sobre o seu treino. Como está isso por aí?"
- **Convite:** "Que tal a gente marcar uma avaliação sem compromisso? Eu te mostro o plano e você decide."

Adapte com suas palavras. Mensagem que parece de robô é ignorada.

## Erros comuns

- Copiar e colar a mesma mensagem para todo mundo.
- Mandar preço logo de cara.
- Enviar áudio longo para quem acabou de conhecer você.
- Sumir depois da primeira resposta, sem retomar.

## Como usar esta aula

Escolha 15 pessoas dos seus stories de hoje, mande a primeira mensagem de cada uma e anote tudo na sua lista de contatos. Faça isso por uma semana e marque o checklist.
$md$,
  checklist = '[{"id":"t3a3-1","text":"Defini quem vou abordar todos os dias","hint":"Quem respondeu story, curtiu vários posts, seguiu ou comentou."},{"id":"t3a3-2","text":"Escrevi 3 mensagens-modelo com minhas palavras","hint":"Primeira mensagem, retomada e convite para avaliação, sem preço."},{"id":"t3a3-3","text":"Organizei meus contatos em etiquetas ou planilha","hint":"Nome, origem, último contato e próximo passo."},{"id":"t3a3-4","text":"Fiz minha primeira rotina de 30 minutos","hint":"Abordar de 15 a 20 pessoas e registrar as respostas."}]'::jsonb
from public.tracks t
where l.track_id = t.id and t.slug = 'captacao' and l.position = 3;

update public.lessons l set
  body_md = $md$
## Hora de gerar movimento

Você já tem oferta, sabe conduzir uma avaliação e entende o caminho do seguidor até o aluno. Agora é prática: tirar os primeiros 10 interessados da teoria e colocá-los em uma lista. Não é preciso esperar o perfil crescer. Os primeiros leads quase sempre estão mais perto do que você imagina.

> **A regra desta aula:** lead é qualquer pessoa que pediu informação sobre o seu trabalho. A meta é registrar 10 em 7 a 14 dias, de várias fontes ao mesmo tempo.

## Passo 1: defina o caminho

Antes de abordar alguém, escreva em uma linha como a pessoa vai do primeiro contato até a avaliação. Exemplo: **post ou story, depois direct, depois WhatsApp, depois avaliação inicial.** Todo mundo percorre o mesmo caminho, o que facilita medir onde as pessoas travam.

## Passo 2: monte a planilha de leads

Pode ser uma planilha ou uma lista no celular. Sugestão de colunas:

| Coluna | Para que serve |
|---|---|
| Nome | Quem é |
| Origem | Story, comentário, indicação, ex-aluno, parceria |
| Data do 1º contato | Mede o tempo de resposta |
| Objetivo | Emagrecer, hipertrofia, voltar a treinar |
| Status | Conversando, avaliação marcada, fechou, perdeu |
| Próximo passo | O que você faz e quando |

Atualize ao fim de cada dia.

## Passo 3: onde buscar os 10

1. **Rede próxima.** Família, amigos e amigos de amigos. Não peça para comprarem. Conte que você está abrindo vagas de consultoria online e pergunte quem conhece alguém que queira treinar com acompanhamento.
2. **Ex-alunos.** Quem treinou com você e parou. Exemplo: "Oi, lembrei de você e do seu progresso no treino. Estou com um acompanhamento online novo. Quer que eu te conte como funciona?"
3. **Indicação de alunos atuais satisfeitos.** Peça de forma estruturada: "Você conhece uma pessoa que também gostaria de ter esse acompanhamento? Posso falar com ela."
4. **Parcerias com profissionais vizinhos.** Nutricionista, fisioterapeuta, academias e estúdios. Ofereça uma troca: você indica para eles, eles indicam para você.

## Plano de 7 a 14 dias

- **Dia 1:** defina o caminho e monte a planilha.
- **Dia 2:** liste 20 pessoas da rede próxima e envie as primeiras mensagens.
- **Dia 3:** contate ex-alunos (de 5 a 10).
- **Dia 4:** peça indicação a 3 alunos atuais satisfeitos.
- **Dia 5:** procure 2 profissionais parceiros e proponha a troca.
- **Dia 6:** retome quem não respondeu.
- **Dia 7:** conte quantos interessados você já registrou.
- **Dias 8 a 14:** repita o ciclo com as fontes que mais renderam.

## Erros comuns

- Pedir para a pessoa comprar em vez de abrir conversa.
- Não registrar quem pediu informação.
- Contar só quem fechou e esquecer os interessados.
- Parar no dia 3 porque ninguém respondeu ainda.

## Como usar esta aula

Execute o plano e marque o checkpoint ao concluir cada etapa: definir o caminho do seguidor até a conversa, criar a planilha de leads e registrar 10 interessados. O checkpoint libera quando os três estiverem prontos.
$md$
from public.tracks t
where l.track_id = t.id and t.slug = 'captacao' and l.position = 4;


-- Conteúdo das aulas: Entrega e Jornada do aluno

update public.lessons l set
  body_md = $md$
## As duas primeiras semanas decidem se o aluno fica

O aluno fechou, pagou e está empolgado. Esse é o pico de motivação dele. Se depois do pagamento vem silêncio, um PDF solto no WhatsApp e um treino sem explicação, a empolgação vira dúvida. A dúvida vira falta, e a falta vira cancelamento no segundo ou terceiro mês.

> **A regra desta aula:** nas primeiras 24 horas, o aluno novo precisa saber o que acontece agora, o que vem depois e como falar com você.

Uma experiência premium não exige nada caro. Exige **ordem e previsibilidade** do fechamento até o primeiro check-in.

## Passo a passo

**1. Mande a pré-avaliação logo após o fechamento.** É um questionário (anamnese) que o aluno responde antes da avaliação inicial. Pergunte: objetivo, histórico de lesões e dores, rotina de trabalho e sono, experiência com treino, onde vai treinar, equipamentos disponíveis, dias e horários possíveis e como é a alimentação de forma geral. Assim a avaliação vira uma conversa de estratégia, não o preenchimento de uma ficha.

**2. Faça a avaliação inicial.** Com o questionário em mãos, você confirma o que importa, define o ponto de partida e combina o que será medido (medidas, fotos, peso) e com que frequência.

**3. Envie as boas-vindas no primeiro dia.** Quatro peças, todas no mesmo dia:

- Uma **mensagem pessoal**, com o nome do aluno e uma referência ao objetivo dele.
- O **material de boas-vindas em PDF**: quem é você, como funciona a consultoria, o que ele recebe e o que você espera dele.
- O **passo a passo para acessar o app**, curto e com prints ou um aviso de que você ajuda se ele travar.
- Os **combinados de suporte**: em quais dias e horários você responde, em quanto tempo e o que fazer numa urgência.

**4. Mostre a linha do tempo das próximas semanas.** Em cinco linhas: quando chega o primeiro treino, quando acontece o primeiro check-in, o que ele deve registrar e quando você faz o primeiro ajuste. Quem sabe o que esperar não se perde.

**5. Entregue uma vitória rápida na primeira semana.** Algo pequeno e verificável, que prove que o método funciona. Exemplo: um aluno de emagrecimento que nunca treinou ganha a meta de completar três treinos curtos na semana e uma tarefa simples, como caminhar 20 minutos nos dias sem treino. No fim da semana você comemora com ele, por mensagem, o que foi cumprido.

## Exemplo de mensagem de boas-vindas

> Oi, Carla! Que bom ter você comigo. Seu objetivo de ganhar força e perder gordura sem sofrer com dieta radical é totalmente possível, e vamos montar o caminho juntos. Hoje você recebe 3 coisas: o PDF de boas-vindas, o passo a passo do app e o questionário para a nossa avaliação. Qualquer dúvida, me chame aqui de segunda a sexta, das 9h às 18h, e eu respondo no mesmo dia. Seu primeiro check-in será no domingo. Vamos começar!

Adapte o tom ao seu jeito. O que não muda é a estrutura: acolhimento, o que recebe, onde tirar dúvida, quando é o próximo passo.

## Checklist do aluno novo

Não confie na memória. Monte uma lista fixa e repita para cada aluno: questionário enviado, avaliação marcada, boas-vindas enviadas, PDF e acesso ao app confirmados, primeiro treino liberado, vitória rápida combinada, primeiro check-in agendado. Se você usa o MyShape, deixe o cadastro do aluno completo antes do primeiro contato, para ele entrar no app e já encontrar tudo no lugar.

## Erros comuns

- **Sumir depois do pagamento** e só reaparecer quando o treino estiver pronto.
- **Mandar um PDF gigante sem uma mensagem pessoal** junto.
- **Prometer resposta imediata** em qualquer horário, o que depois você não consegue cumprir.
- **Deixar o aluno descobrir sozinho** como usar o app.

## Como usar esta aula

Abra o material **Boas-vindas ao aluno** nos materiais da trilha e adapte com a sua marca e os seus combinados de suporte. Depois monte o seu checklist de novo aluno e use-o no próximo fechamento. Marque os itens abaixo conforme for executando.
$md$,
  checklist = '[{"id":"t4a1-1","text":"Criar o questionário de pré-avaliação","hint":"Objetivo, lesões, rotina, sono, equipamentos e dias disponíveis."},{"id":"t4a1-2","text":"Preparar o PDF e a mensagem de boas-vindas","hint":"Use o material Boas-vindas ao aluno e coloque seus combinados de suporte."},{"id":"t4a1-3","text":"Definir a vitória rápida da primeira semana","hint":"Uma meta pequena e verificável que o aluno consiga cumprir em 7 dias."},{"id":"t4a1-4","text":"Montar o checklist de novo aluno","hint":"Lista fixa, do fechamento ao primeiro check-in, para usar em todo aluno."}]'::jsonb
from public.tracks t
where l.track_id = t.id and t.slug = 'entrega-jornada' and l.position = 1;

update public.lessons l set
  body_md = $md$
## Seu painel é o bastidor, o app é a vitrine

O treinador que atende online sem sistema vive entre planilha, PDF e mensagem solta. Cada aluno novo vira horas de montagem, e o aluno recebe uma entrega confusa. O **MyShape** resolve isso: é o painel onde você opera a consultoria, e o aluno acompanha tudo pelo **app com a sua marca**.

> **A regra desta aula:** padronize o que se repete e personalize só o que muda o resultado do aluno.

Isso vale para o seu tempo e para a percepção de valor. O aluno vê um app organizado com o treino dele, e não precisa saber que por trás existe um modelo que você adaptou.

## O fluxo para montar um aluno

**1. Cadastre o aluno no painel.** Dados básicos, contato e objetivo. Faça isso antes do primeiro contato de boas-vindas, para ele entrar no app já com o acesso pronto.

**2. Registre a avaliação inicial.** Medidas, fotos e objetivo principal, tudo no cadastro do aluno. Esse é o ponto de partida: sem ele, no fim do plano você não consegue provar a evolução. Combine antes o padrão das fotos (mesma luz, mesma pose, mesmo horário) para que as comparações sejam justas.

**3. Monte o treino.** Parta de um modelo, não de uma folha em branco. Ajuste volume, exercícios e progressão conforme o perfil, as lesões e os equipamentos da avaliação.

**4. Inclua as orientações gerais.** Como registrar as cargas, como se aquecer, o que fazer se sentir dor, como funciona o check-in. Escreva uma vez e reaproveite com todos.

**5. Dieta, só se for sua competência.** Se você tem nutricionista parceira, ela monta e você integra a entrega. Se não tem, oriente apenas hábitos gerais e deixe claro ao aluno que o plano alimentar é com um nutricionista.

**6. Confira como o aluno vê.** Entre no app, ou peça para um aluno conhecido testar, e confirme: o treino aparece completo, as orientações estão claras e não falta nada.

## Respeite o escopo profissional

Prescrever dieta é atribuição do nutricionista. Mesmo que o painel permita montar um plano alimentar, o seu papel como treinador é treino, orientação de hábitos e acompanhamento. Quando o objetivo do aluno exigir dieta, encaminhe para uma parceria. Isso protege você e o aluno, e ainda gera uma indicação de ida e volta.

## Modelos por perfil: onde você ganha tempo

Crie de 4 a 6 modelos de treino para os perfis que mais aparecem. Exemplos:

- Iniciante em emagrecimento, 3 dias por semana.
- Hipertrofia intermediário, 4 dias.
- Mulheres 30+ com foco em força e composição corporal.
- Corredor com treino de força complementar.
- Idoso com foco em autonomia e prevenção de quedas.

Em cada aluno novo, você escolhe o modelo e gasta o tempo no que importa: adaptar por lesão, rotina, preferência e nível. Um treino que levava 90 minutos pode virar 20 a 30 minutos de ajuste fino.

## Erros comuns

- **Montar cada treino do zero** e não ter tempo para acompanhar.
- **Pular a avaliação inicial** e perder a base de comparação.
- **Entregar dieta** fora da sua competência.
- **Não testar o que o aluno vê** e descobrir o erro só quando ele reclama.

## Como usar esta aula

Escolha os três perfis de aluno que você mais atende e crie um modelo de treino para cada um no painel. Depois defina o texto das suas orientações gerais e decida como você lida com a dieta: parceria ou encaminhamento. Marque os itens abaixo ao concluir cada etapa.
$md$,
  checklist = '[{"id":"t4a2-1","text":"Cadastrar um aluno-teste e a avaliação inicial","hint":"Medidas, fotos e objetivo no cadastro, para validar o fluxo completo."},{"id":"t4a2-2","text":"Criar 3 modelos de treino por perfil","hint":"Os perfis que você mais atende, para só ajustar o que muda por aluno."},{"id":"t4a2-3","text":"Escrever as orientações gerais padrão","hint":"Registro de cargas, aquecimento, dor e como funciona o check-in."},{"id":"t4a2-4","text":"Definir como tratar a dieta","hint":"Parceria com nutricionista ou encaminhamento, sempre no seu escopo."}]'::jsonb
from public.tracks t
where l.track_id = t.id and t.slug = 'entrega-jornada' and l.position = 2;

update public.lessons l set
  body_md = $md$
## O check-in é o coração da consultoria

Muito treinador online entrega o treino e some. O aluno se sente sozinho, treina sem saber se está certo e, em algum momento, deixa de abrir o app. O que o aluno realmente paga numa consultoria não é a planilha: é **alguém olhando para a evolução dele e ajustando o caminho**. Isso acontece no check-in.

> **A regra desta aula:** check-in curto, em dia fixo, com resposta pessoal em até 24 a 48 horas e uma ação clara para a semana seguinte.

Quando o aluno sabe que vai ser lido e respondido, ele preenche. Quando ele recebe um ajuste concreto, ele sente que está sendo acompanhado. É assim que o check-in gera adesão, e adesão gera retenção.

## As perguntas fixas

Use sempre as mesmas perguntas. Isso torna o preenchimento rápido para o aluno e a comparação fácil para você.

1. Quantos treinos você fez no período, de quantos planejados?
2. Como foram as cargas e a evolução nos exercícios principais?
3. Como estava o sono?
4. Como estava a energia no dia a dia?
5. Sentiu alguma dor ou desconforto?
6. Como foi a alimentação, de forma geral?
7. Peso, medidas e fotos, quando combinados.
8. De 0 a 10, qual a nota da sua semana?

Dê preferência ao que dá para responder em 3 a 5 minutos. A nota de 0 a 10 é o termômetro mais rápido: acompanhe a tendência, não só o número isolado.

## Passo a passo

1. **Escolha a frequência.** Semanal para quem está começando ou tem objetivo agressivo. Quinzenal para alunos mais autônomos. O importante é ser previsível: mesmo dia, mesmo horário de envio.
2. **Monte o formulário uma vez.** Padronize as perguntas acima e use a ferramenta que o seu painel oferecer, ou um formulário simples.
3. **Reserve um bloco na agenda** para responder. Por exemplo, segunda de manhã para todos os check-ins do fim de semana.
4. **Responda com três partes:** reconhecimento do que foi bem, um ajuste e uma ação clara para a próxima semana.
5. **Registre o que você mudou** no treino, para o aluno ver que o check-in tem efeito.

## Modelo de mensagem de check-in

> Bom dia, Marcos! Hoje é dia do check-in da semana. Leva uns 3 minutos: me conta quantos treinos você fez, como estão as cargas, o sono, a energia, se sentiu alguma dor, como foi a alimentação e dá uma nota de 0 a 10 para a semana. Se for dia de fotos, mande também. Eu respondo até quarta com o seu ajuste.

## Modelo de resposta

> Marcos, ótima semana! Você fechou 4 de 4 treinos e subiu a carga no agachamento, é exatamente isso que queremos. Vi que o sono ficou em 5 horas e a energia caiu, então vamos manter o volume e priorizar dormir mais. Ação da semana: deitar 30 minutos mais cedo em 4 noites. Segue o plano e me conta como foi no próximo check-in.

## Sinais de risco no check-in

Fique atento a estes padrões:

- **Sumiço**: o aluno não responde o check-in uma vez, depois outra.
- **Notas caindo** semana após semana.
- **Desculpas repetidas** para faltar aos treinos.
- **Respostas cada vez mais curtas**, sem detalhes.

O que fazer: não espere o terceiro silêncio. Mande uma mensagem pessoal, sem cobrança, perguntando como ele está. Ofereça simplificar o plano (menos dias, treinos mais curtos). Um aluno que sente acolhimento volta. Um que se sente cobrado some.

## Erros comuns

- **Formulário longo demais**, que cansa e fica sem resposta.
- **Demorar mais de 48 horas** para responder.
- **Responder só "continue assim"**, sem ajuste nem ação.
- **Mudar as perguntas** toda semana.

## Como usar esta aula

Monte o seu formulário fixo com as perguntas acima, escolha o dia e o bloco de agenda para responder e deixe os dois modelos de mensagem salvos. Marque os itens abaixo ao concluir cada etapa.
$md$,
  checklist = '[{"id":"t4a3-1","text":"Definir a frequência e o dia fixo do check-in","hint":"Semanal ou quinzenal, sempre no mesmo dia e horário de envio."},{"id":"t4a3-2","text":"Montar o formulário com as perguntas fixas","hint":"Treino, cargas, sono, energia, dor, alimentação e nota de 0 a 10."},{"id":"t4a3-3","text":"Salvar o modelo de resposta com ajuste e ação","hint":"Reconhecimento, um ajuste e uma ação clara para a próxima semana."},{"id":"t4a3-4","text":"Listar seus sinais de risco e o que fazer","hint":"Sumiço, notas caindo e desculpas repetidas, com a mensagem pronta."}]'::jsonb
from public.tracks t
where l.track_id = t.id and t.slug = 'entrega-jornada' and l.position = 3;

update public.lessons l set
  body_md = $md$
## Reter custa menos do que captar

Todo treinador sente o peso de captar aluno novo: conteúdo, conversa, proposta, fechamento. Já o aluno que está dentro paga todo mês sem exigir esse esforço. Isso é o **LTV** (quanto um aluno paga ao longo do tempo que fica com você). Exemplo: um aluno que paga R$ 300 por mês e fica 3 meses vale R$ 900. O mesmo aluno, ficando 9 meses, vale R$ 2.700, sem você gastar mais um centavo para captá-lo.

> **A regra desta aula:** retenção não acontece por acaso. Ela é desenhada, com pontos de contato planejados e prova de evolução antes da renovação.

Esta aula conecta quatro pontos do seu checklist de entrega: as boas-vindas do primeiro dia, a frequência de check-in, os pontos de contato ao longo do plano e a prova de evolução antes da renovação.

## Desenhe a jornada inteira

Pegue uma folha e escreva o que o aluno vive em cada mês do plano. Exemplo para um plano trimestral:

- **Mês 1:** adaptação. Boas-vindas, avaliação inicial, vitória rápida, rotina de check-in criada.
- **Mês 2:** consistência. Ajuste de treino com base nos check-ins, comemoração de marcos (primeiro mês completo, carga nova).
- **Mês 3:** resultado e decisão. Reavaliação, comparação com o ponto de partida e conversa sobre o próximo ciclo.

Com a jornada no papel, você sabe o que fazer em cada momento, em vez de reagir ao que aparece.

## Pontos de contato sem o aluno pedir

O check-in é o contato que o aluno espera. Os **pontos de contato surpresa** são os que ele não espera, e é por isso que marcam. Alguns exemplos:

- Mensagem no aniversário.
- Comemorar um marco (30 dias, 50 treinos, primeira carga nova).
- Um brinde simples ou um áudio curto de reconhecimento.
- Uma mensagem no meio de uma semana difícil, só para perguntar como ele está.

Não precisa ser caro nem frequente. Precisa ser verdadeiro e feito sem o aluno pedir.

## Health score: uma nota simples de risco

Você não consegue acompanhar de cabeça dezenas de alunos. Crie uma nota simples por aluno, por exemplo de 0 a 10, somando fatores como:

- Frequência de check-in (respondeu em dia?).
- Adesão ao treino (fez quantos dos planejados?).
- Engajamento (abre o app, responde mensagens, comenta?).

Alunos com nota baixa recebem contato primeiro. Use o material **Health Score** da trilha para montar a sua versão e revisar a lista uma vez por semana.

## Prova de evolução antes da renovação

Duas a três semanas antes do fim do plano, apresente a evolução ao aluno. Reúna o antes e depois, os números (cargas, medidas, peso quando for o caso) e as fotos. O material **Dossiê de resultados** ajuda a organizar isso. Depois da apresentação, conduza a conversa para o próximo ciclo: o que ele conquistou, o que falta e qual é o plano para os próximos meses. A renovação deixa de ser uma cobrança e vira uma consequência natural.

## Entenda quem sai e peça indicação

Quando um aluno decide não renovar, envie um **Formulário de saída** curto. Pergunte o motivo, o que ele gostou e o que poderia melhorar. É a forma mais barata de aprender onde a sua entrega falha.

Já o aluno satisfeito é a sua melhor fonte de novos alunos. Peça indicação **no momento certo**: logo depois de uma conquista, na apresentação de evolução ou quando ele elogiar espontaneamente. Pedir no momento errado soa como cobrança.

## Erros comuns

- **Só lembrar do aluno** quando precisa renovar.
- **Mostrar a evolução na última semana**, sem tempo para conduzir a conversa.
- **Ignorar o aluno que sai**, sem perguntar o porquê.
- **Pedir indicação** quando o aluno ainda não viu resultado.

## Como usar esta aula

Revise o seu checklist de entrega: confira as boas-vindas do primeiro dia, a frequência de check-in, os pontos de contato ao longo do plano e a prova de evolução antes da renovação. Monte a jornada mês a mês, crie o seu health score e deixe o formulário de saída pronto. Quando os quatro itens estiverem completos, você finaliza o checkpoint desta trilha.
$md$
from public.tracks t
where l.track_id = t.id and t.slug = 'entrega-jornada' and l.position = 4;


-- Conteúdo das aulas: Gestão e Tempo

update public.lessons l set
  body_md = $md$
## Desorganização tem preço

Quando o dono da consultoria vive apagando incêndio, o prejuízo não aparece na planilha, mas existe. Aluno que mandou dúvida e ficou dois dias sem resposta. Lead que pediu valores e nunca recebeu o follow-up. Check-in que ninguém olhou. Cada um desses itens é dinheiro que saiu pela porta: uma renovação perdida, uma venda que esfriou, uma indicação que não aconteceu.

O problema quase nunca é falta de tempo. É falta de **prioridade** e de **sistema**. Sem os dois, você trabalha o dia inteiro e mesmo assim sente que não fez o que importava.

> **A regra desta aula:** o que é importante raramente é urgente, e é exatamente isso que você precisa proteger na agenda.

## A matriz urgente x importante

Pegue tudo o que está na sua cabeça e jogue em quatro quadrantes:

| | Urgente | Não urgente |
|---|---|---|
| **Importante** | Fazer agora (aluno com problema, proposta que vence hoje) | **Agendar** (conteúdo, processos, estudo, revisão de números) |
| **Não importante** | **Delegar** (responder dúvida repetida, postar, organizar planilha) | **Eliminar** (reunião sem pauta, rolar feed sem objetivo) |

O quadrante que muda o seu negócio é o de cima à direita: importante e não urgente. Ninguém cobra, então ele só acontece se estiver **bloqueado na agenda**.

## Um sistema simples de organização

Inspirado no GTD, em cinco movimentos:

1. **Capturar:** tudo que surge (ideia, pedido de aluno, lembrete) vai para um único lugar, o caderno ou o app de notas. Nada fica só na memória.
2. **Esclarecer:** para cada item, pergunte qual é a próxima ação concreta. "Resolver o caso da Marta" vira "ajustar o treino B dela e responder hoje".
3. **Organizar:** o que tem data vai para a agenda. O resto vai para listas curtas: hoje, esta semana, aguardando resposta, algum dia.
4. **Revisar:** uma vez por semana você passa os olhos em tudo. Sem revisão, o sistema apodrece.
5. **Executar:** no horário certo, você abre a lista do dia e faz uma coisa de cada vez.

## Blocos fixos na semana

Em vez de decidir a cada hora o que fazer, defina **blocos recorrentes** por tipo de trabalho: atendimento, conteúdo, vendas, gestão, estudo e descanso. Dentro do bloco você faz só aquilo. Fora dele, não.

Exemplo de semana-modelo para quem tem cerca de 40 alunos:

| Dia | Manhã | Tarde |
|---|---|---|
| Segunda | Revisão semanal (30 min) e check-ins | Atendimento: ajustes de treino |
| Terça | Vendas: leads e avaliações | Conteúdo: gravar a semana |
| Quarta | Atendimento: dúvidas e check-ins | Gestão: números e financeiro |
| Quinta | Vendas: follow-up e fechamentos | Estudo e processos |
| Sexta | Atendimento: fechamento da semana | Conteúdo: edição e agendamento |
| Sábado | Descanso | Descanso |

É um modelo. Troque os blocos de lugar conforme o seu horário de treino e a sua energia, mas mantenha a ideia: cada tipo de trabalho tem seu lugar.

## Revisão semanal de 30 minutos

Escolha um horário fixo, por exemplo segunda cedo, e siga este roteiro:

1. Esvazie a caixa de captura e converta cada item em ação ou descarte.
2. Veja quem ficou sem resposta e quem não fez check-in.
3. Olhe os leads em aberto e defina o próximo contato de cada um.
4. Defina as três prioridades da semana e coloque cada uma na agenda.

## Erros comuns

- Tentar organizar tudo de uma vez com várias ferramentas. Comece com uma agenda e uma lista.
- Encher a agenda de blocos sem deixar folga para imprevistos.
- Pular a revisão semanal quando a semana está pesada, que é justamente quando ela mais ajuda.
- Atender aluno e responder lead no mesmo bloco, misturando urgência de natureza diferente.

## Como usar esta aula

Hoje, monte a sua matriz com tudo o que está pendente e marque o que dá para delegar ou eliminar. Depois bloqueie na agenda a semana-modelo e agende a primeira revisão semanal. Cada passo corresponde a um item do checklist abaixo.
$md$,
  checklist = '[{"id":"t5a1-1","text":"Montar sua matriz urgente x importante","hint":"Liste tudo que está pendente e separe em fazer, agendar, delegar e eliminar."},{"id":"t5a1-2","text":"Criar um lugar único de captura","hint":"Um caderno ou app de notas onde toda ideia e pedido entram antes de virar tarefa."},{"id":"t5a1-3","text":"Bloquear sua semana-modelo na agenda","hint":"Blocos fixos de atendimento, conteúdo, vendas, gestão, estudo e descanso."},{"id":"t5a1-4","text":"Agendar a revisão semanal de 30 minutos","hint":"Mesmo dia e horário toda semana, com o roteiro de quatro passos da aula."}]'::jsonb
from public.tracks t
where l.track_id = t.id and t.slug = 'gestao-tempo' and l.position = 1;

update public.lessons l set
  body_md = $md$
## Se só você sabe fazer, só você pode fazer

Todo treinador que cresce bate na mesma parede: o negócio funciona, mas depende de você para cada detalhe. Quem entra de aluno novo? Você lembra de tudo de cabeça. Quem cobra o check-in? Você, quando dá. Quem avisa que o plano está acabando? Você, se não esquecer.

Enquanto isso mora só na sua cabeça, não dá para delegar, e você fica refém da própria memória. A saída é tirar o processo da cabeça e colocar no papel.

> **A regra desta aula:** o que se repete deve ser escrito uma vez, bem feito, e seguido sempre. Só se delega o que está padronizado.

## O que é um POP

POP é o **procedimento operacional padrão**: um documento curto que descreve como uma tarefa repetida é feita, do começo ao fim. Ele é o primeiro passo para delegar porque responde, sem você precisar estar presente, a pergunta "como é que se faz?".

Um bom POP cabe em **uma página** e tem estes campos:

1. **Nome:** claro e específico.
2. **Objetivo:** por que esse processo existe.
3. **Responsável:** quem executa (hoje, você).
4. **Gatilho:** o evento que dá início ao processo.
5. **Passo a passo:** ações curtas, em ordem, no imperativo.
6. **Ferramentas e modelos de mensagem:** onde se faz e o que se envia.
7. **Prazo:** em quanto tempo cada etapa deve acontecer.
8. **Como saber que foi bem feito:** o critério de conclusão.

## Exemplo: POP de entrada do aluno novo

**Objetivo:** o aluno se sentir acolhido e receber o primeiro plano no prazo prometido.
**Responsável:** você (futuramente, o suporte).
**Gatilho:** confirmação do pagamento.

**Passo a passo:**

1. Confirmar o pagamento e registrar o aluno na lista de ativos.
2. Enviar a mensagem de boas-vindas com o link da anamnese e das fotos iniciais.
3. Cadastrar o aluno no MyShape e liberar o acesso ao app.
4. Marcar a avaliação inicial e registrar medidas e objetivos.
5. Montar e entregar o primeiro plano de treino.
6. Agendar o primeiro check-in para sete dias depois.

**Modelo de mensagem (passo 2):** "Oi, [nome]! Seja bem-vindo. Pra eu montar seu plano, preciso que você preencha esta anamnese e envie as fotos iniciais até amanhã. Qualquer dúvida, é só chamar aqui."

**Prazo:** primeiro plano entregue em até 3 dias úteis após o pagamento.
**Bem feito quando:** o aluno abriu o app, respondeu a anamnese e recebeu o plano dentro do prazo.

## Onde guardar: o seu segundo cérebro

Crie **um único lugar** para os processos e modelos da empresa: uma pasta organizada, um documento ou um app de notas. Dentro dele ficam os POPs, os modelos de mensagem, os formulários e os links úteis. Regra simples: se você precisou explicar duas vezes, escreva e guarde ali.

## A jornada do aluno como mapa

Desenhe a jornada do aluno do pagamento à renovação: entrada, primeiras semanas, check-ins, pontos de risco, renovação. Cada etapa em que algo precisa acontecer é um candidato a POP. Comece pelos três que mais afetam a retenção.

## Os três POPs desta trilha

- **Processo de entrada do aluno novo:** do pagamento ao primeiro plano entregue.
- **Processo de check-in:** quem faz, quando e com qual mensagem.
- **Processo de renovação:** quando começa e o que você envia.

## Erros comuns

- Escrever um manual de vinte páginas que ninguém lê. Mantenha em uma página.
- Descrever o ideal em vez do que acontece de verdade. Escreva como você faz hoje e melhore depois.
- Guardar os POPs em vários lugares diferentes.
- Nunca testar: peça para outra pessoa seguir o POP e veja onde ela trava.

## Como usar esta aula

Abra o material **Modelo de POP** da trilha e preencha os três processos acima, um por vez, começando pela entrada do aluno novo. Cada POP pronto cumpre um dos itens do checkpoint. Não precisa ficar perfeito: precisa estar escrito.
$md$
from public.tracks t
where l.track_id = t.id and t.slug = 'gestao-tempo' and l.position = 2;

update public.lessons l set
  body_md = $md$
## Contratar não é luxo, é consequência

Chega um momento em que o dono vira o gargalo da própria consultoria. Você responde dúvida até tarde, atrasa ajuste de treino, posta quando sobra tempo e recusa aluno novo porque não aguenta mais. Crescer sozinho tem teto, e o teto é o número de horas do seu dia.

> **A regra desta aula:** contrate para liberar o seu tempo para o que só você faz: vender, liderar e entregar o diferencial do método.

## Sinais de que chegou a hora

- Você é o gargalo: nada anda sem a sua aprovação.
- Gasta horas por semana em tarefas de baixo valor, como organizar planilha, responder dúvida repetida ou agendar.
- Está recusando alunos ou atrasando respostas e check-ins.
- Seus POPs já existem. Sem processo escrito, a contratação vira bagunça.

## Primeiras funções típicas

- **Atendimento e suporte ao aluno:** responde dúvidas, cobra check-in, resolve questões de acesso ao app.
- **Social media:** planeja e publica conteúdo seguindo a sua linha.
- **Estagiário de educação física:** ajuda a montar e ajustar treinos sob a sua supervisão.
- **Vendedor ou closer:** entra quando já há volume de leads que você não consegue atender bem.

Comece pela função que mais consome o seu tempo e menos exige a sua expertise.

## Desenhe a função antes de anunciar

Antes de abrir qualquer vaga, escreva em uma página:

1. **Responsabilidades:** o que a pessoa faz no dia a dia.
2. **Entregas:** o que precisa estar pronto e em que prazo.
3. **Nível:** júnior, pleno ou sênior, que muda a autonomia e o valor.
4. **Como será medida:** um ou dois indicadores simples.

## Triagem em três etapas

1. **Tarefa prática:** peça algo pequeno e real. Para suporte, responder três mensagens de alunos simulados. Para social media, planejar uma semana de conteúdo.
2. **Entrevista:** observe como a pessoa pensa, comunica e lida com erro.
3. **Referências:** converse com quem já trabalhou com ela.

## Bandeiras vermelhas

- Chega atrasado ou sem preparo ao processo seletivo.
- Culpa sempre o outro nos empregos anteriores.
- Não aceita feedback ou discute cada ajuste.
- Promete demais e entrega de menos na tarefa prática.
- Já no começo, faz pouco caso da confidencialidade dos dados dos alunos.

Elas valem também para quem já está no time. Não adie a conversa quando as vir.

## Formalização

Combine por escrito: contrato adequado ao tipo de vínculo, termo de confidencialidade (os dados dos seus alunos são sensíveis) e, quando fizer sentido, termo de não concorrência. Valide tudo com um advogado ou contador antes de assinar. As regras variam conforme o tipo de contratação, e este texto não é orientação jurídica.

## Onboarding com os POPs

No primeiro dia a pessoa já recebe o segundo cérebro: os POPs da função, os modelos de mensagem e acesso às ferramentas. Na primeira semana, ela acompanha você fazendo. Na segunda, faz com você por perto. Depois, faz sozinha e você revisa.

## Reunião 1:1 semanal

Marque 20 a 30 minutos fixos por semana. Pauta curta: o que foi bem, onde travou, o que precisa de você e a prioridade da próxima semana. Use o material **Reunião 1:1** da trilha como roteiro.

## Conversas difíceis

Quando algo precisar ser dito, seja claro e respeitoso. Fale de um **fato** ("a resposta ao aluno passou de 24 horas três vezes"), explique o impacto e combine o que muda e até quando. Faça em particular e logo, sem acumular.

## Erros comuns

- Contratar por simpatia, sem tarefa prática.
- Delegar sem POP e cobrar depois.
- Não combinar nada por escrito.
- Cancelar o 1:1 quando a semana aperta.

## Como usar esta aula

Escreva a função da primeira contratação, defina a triagem e prepare o contrato com apoio profissional. Marque cada etapa no checklist abaixo.
$md$,
  checklist = '[{"id":"t5a3-1","text":"Escolher a primeira função a contratar","hint":"A que mais consome seu tempo e menos exige a sua expertise."},{"id":"t5a3-2","text":"Escrever a descrição da função em uma página","hint":"Responsabilidades, entregas, nível e como será medida."},{"id":"t5a3-3","text":"Montar a triagem com tarefa prática","hint":"Uma tarefa pequena e real, entrevista e conversa com referências."},{"id":"t5a3-4","text":"Preparar contrato e termos com um profissional","hint":"Valide com advogado ou contador antes de assinar qualquer coisa."}]'::jsonb
from public.tracks t
where l.track_id = t.id and t.slug = 'gestao-tempo' and l.position = 3;

update public.lessons l set
  body_md = $md$
## Quem não mede, adivinha

Muito treinador sabe quanto entrou na conta no mês, mas não sabe quantos leads viraram avaliação, quantos alunos saíram, nem quanto custa trazer um aluno novo. Sem esses números, cada decisão vira palpite: aumentar anúncio, mexer no preço, contratar.

Você não precisa de um painel gigante. Precisa de um **painel mínimo** que cabe em uma folha e que você olha com regularidade.

> **A regra desta aula:** poucos números, sempre os mesmos, sempre na mesma data.

## O painel mínimo

| Indicador | O que mostra | Frequência |
|---|---|---|
| Leads | quantas pessoas chegaram | semanal |
| Avaliações | quantas conversas de venda aconteceram | semanal |
| Vendas | quantos alunos novos fecharam | semanal |
| Taxa de conversão | vendas / avaliações | mensal |
| Alunos ativos | base atual | mensal |
| Ticket médio | faturamento / alunos | mensal |
| Faturamento | receita do mês | mensal |
| Renovações | quantos renovaram dos que venciam | mensal |
| Churn | quantos saíram | mensal |
| CAC | custo para trazer um aluno | mensal |
| LTV | quanto um aluno gera ao longo da vida | trimestral |

## Como calcular, com exemplo

**Exemplo ilustrativo:** você começou o mês com 40 alunos ativos, fechou 8 novos e perdeu 4.

- **Taxa de conversão** = vendas / avaliações. Com 20 avaliações e 8 vendas: 8 / 20 = **40%**.
- **Churn** = alunos que saíram no mês / alunos ativos no início do mês. 4 / 40 = **10%**.
- **CAC** = investimento em aquisição / novos alunos. Se você investiu R$ 2.400 em anúncios e conteúdo e fechou 8 alunos: R$ 2.400 / 8 = **R$ 300**.
- **LTV** = ticket médio x tempo médio de permanência. Com ticket de R$ 300 e permanência de 6 meses: R$ 300 x 6 = **R$ 1.800**.

Agora compare: um aluno custa R$ 300 para chegar e gera R$ 1.800. Há espaço para investir mais. Se o CAC fosse R$ 1.500, o negócio estaria apertado. É a relação entre LTV e CAC que diz se dá para crescer com segurança.

## Radar de abandono

Churn é número que você só vê depois que o aluno foi embora. O radar antecipa. Escolha dois ou três sinais simples e olhe toda semana:

- Aluno que **deixou de fazer check-in** por duas semanas seguidas.
- Aluno que **parou de registrar treinos** no app.
- Aluno que **mudou o tom** ou respondeu de forma curta e fria.

Quem aparece no radar recebe contato pessoal seu em até 48 horas, antes que peça cancelamento.

## Metas trimestrais em OKR simples

OKR é um objetivo com resultados-chave que dizem se ele foi atingido. Use **1 objetivo e 3 resultados-chave** por trimestre.

**Exemplo:**

- **Objetivo:** ter uma base de alunos mais estável.
- Resultado-chave 1: reduzir o churn mensal de 10% para 6%.
- Resultado-chave 2: chegar a 70% de renovação nos planos que vencem.
- Resultado-chave 3: todo aluno em risco contatado em até 48 horas.

Use o material **OKR** da trilha para escrever o seu.

## Reunião mensal consigo mesmo

Marque uma hora fixa no último dia útil do mês. Roteiro:

1. Preencha o painel com os números do mês.
2. Compare com o mês anterior e com a meta do trimestre.
3. Anote duas coisas que funcionaram e duas que não.
4. Defina a mudança do próximo mês, uma de cada vez.

## Erros comuns

- Acompanhar muitos números e não agir em nenhum.
- Misturar faturamento com lucro.
- Calcular churn só quando a situação já está ruim.
- Definir meta sem prazo ou sem número.

## Como usar esta aula

Monte o painel em uma planilha, preencha com os dados do mês atual e calcule churn, CAC e LTV. Defina o radar de abandono e escreva seu OKR do trimestre, seguindo o material da trilha. Marque cada item no checklist abaixo.
$md$,
  checklist = '[{"id":"t5a4-1","text":"Montar o painel mínimo em uma planilha","hint":"Leads, avaliações, vendas, ativos, ticket, faturamento, renovações e churn."},{"id":"t5a4-2","text":"Calcular churn, CAC e LTV do mês","hint":"Use as fórmulas da aula com os números reais do seu último mês."},{"id":"t5a4-3","text":"Definir seu radar de abandono","hint":"Dois ou três sinais simples para olhar toda semana."},{"id":"t5a4-4","text":"Escrever o OKR do trimestre","hint":"Um objetivo e três resultados-chave, com número e prazo."}]'::jsonb
from public.tracks t
where l.track_id = t.id and t.slug = 'gestao-tempo' and l.position = 4;


-- Conteúdo das aulas: Finanças

update public.lessons l set
  body_md = $md$
## Por que "faturei 15 mil e não sobrou nada"

Todo treinador que começa a vender online já falou essa frase. O problema quase nunca é falta de venda. É que três coisas diferentes estão sendo chamadas de "dinheiro": o que você vendeu, o que entrou e o que está disponível na conta hoje.

> **A regra desta aula:** faturamento é o que você vendeu. Receita é o que entra de verdade. Caixa é o que está na conta hoje. Só o caixa paga boleto.

## Os três números

- **Faturamento:** tudo que você vendeu no mês, pelo valor cheio. Um plano semestral de R$ 1.500 entra inteiro aqui.
- **Receita:** o que efetivamente chega, depois de taxas da maquininha ou do gateway, parcelamentos (o cartão em 6x cai parcela por parcela) e cancelamentos ou estornos.
- **Caixa:** o saldo disponível em cada dia. É ele que decide se você consegue pagar o tráfego na segunda-feira.

Exemplo: no mês você vendeu 35 mensalidades de R$ 300 (R$ 10.500) e 3 planos semestrais de R$ 1.500 (R$ 4.500) no cartão em 6x. Faturamento: **R$ 15.000**.

| Item | Valor |
|---|---|
| Mensalidades (35 x R$ 300) | R$ 10.500 |
| 1ª parcela dos 3 semestrais (R$ 250 cada) | R$ 750 |
| Taxa de pagamento (exemplo: 3%) | - R$ 337,50 |
| Um estorno de mensalidade | - R$ 300 |
| **Receita que entrou no mês** | **R$ 10.612,50** |

Dos R$ 15.000 "faturados", entraram pouco mais de R$ 10 mil. O resto chega nos próximos meses, em parcelas.

## Custo fixo x custo variável

- **Fixo:** você paga mesmo se não vender nada. Aluguel de sala, software e ferramentas, contador, internet.
- **Variável:** cresce junto com as vendas. Taxa de pagamento, comissão de quem indica ou vende, tráfego pago por venda.

Separar os dois é o que permite, na próxima aula, calcular quantos alunos você precisa. Misturar é o que faz o dinheiro "sumir".

## Um fluxo de caixa simples

Exemplo do mesmo mês, com saldo inicial de R$ 1.000. Inclui o que você tirou para despesas pessoais, porque isso também sai da conta.

| Semana | Entradas | Saídas | Saldo final |
|---|---|---|---|
| 1 | R$ 4.800 | R$ 3.900 | R$ 1.900 |
| 2 | R$ 2.900 | R$ 3.000 | R$ 1.800 |
| 3 | R$ 1.700 | R$ 2.000 | R$ 1.500 |
| 4 | R$ 1.212,50 | R$ 1.400 | R$ 1.312,50 |

As saídas somam R$ 10.300: R$ 1.400 de fixos, R$ 2.400 de variáveis (tráfego e comissão) e R$ 6.500 de retiradas pessoais. Sobrou R$ 312,50. Foi assim que "15 mil" virou "nada". Repare também que o saldo cai toda semana a partir da segunda: as entradas se concentram no começo do mês e as contas se espalham.

## Passo a passo

1. Exporte as entradas do último mês (banco, gateway, Pix) e some por semana.
2. Liste todas as saídas, inclusive as pessoais que saíram da conta do negócio.
3. Marque cada saída como fixa ou variável.
4. Calcule: faturamento, receita (já sem taxas e estornos) e saldo final.
5. Monte o fluxo semanal do próximo mês com o que você já sabe que vai entrar e sair.

## Erros comuns

- Contar o plano parcelado inteiro como dinheiro do mês.
- Esquecer custos pequenos e anuais: domínio, renovação de ferramenta, material.
- Pagar o cartão pessoal pela conta do negócio e não registrar.
- Olhar só o saldo do dia, sem ver as próximas semanas.

## Como usar esta aula

Pegue o extrato do último mês e faça os cinco passos acima, mesmo que numa planilha simples. Você não precisa de nenhum material para isso. Marque cada item do checklist conforme concluir; o resultado vai alimentar a aula de pró-labore e a de ponto de equilíbrio.
$md$,
  checklist = '[{"id":"t6a1-1","text":"Listei entradas e saídas do último mês","hint":"Use extrato do banco, gateway e Pix, somando por semana."},{"id":"t6a1-2","text":"Separei meus custos em fixos e variáveis","hint":"Fixo você paga vendendo ou não; variável cresce com as vendas."},{"id":"t6a1-3","text":"Calculei faturamento, receita e saldo do mês","hint":"Receita é o que entrou depois de taxas, parcelas e estornos."},{"id":"t6a1-4","text":"Montei o fluxo de caixa semanal do próximo mês","hint":"Quatro linhas: entradas, saídas e saldo final de cada semana."}]'::jsonb
from public.tracks t
where l.track_id = t.id and t.slug = 'financas' and l.position = 1;

update public.lessons l set
  body_md = $md$
## O bolso da empresa não é o seu bolso

Quando tudo cai na mesma conta, você nunca sabe se o negócio dá lucro ou se você só está gastando o dinheiro dele. Pagar o mercado com a conta do negócio e a ferramenta de treino com o cartão pessoal parece inofensivo. Na prática, impede qualquer conta séria de preço, lucro ou crescimento.

> **A regra desta aula:** a empresa paga você (pró-labore) e você vive do pró-labore. Nunca do caixa da empresa.

Esta aula ensina os três itens do checklist: conta separada, pró-labore definido e DRE do último mês.

## 1. Conta separada para o negócio

Faça em 15 minutos, no celular:

1. Abra uma conta PJ (ou conta separada dedicada ao negócio, se você ainda estiver formalizando; confirme o caminho com seu contador).
2. Cadastre uma chave Pix no CNPJ e passe essa chave para quem paga você.
3. Peça um cartão da empresa e use só para custos do negócio.
4. Mova para a conta PJ tudo que é do negócio: tráfego, software, aluguel de sala, contador.
5. Defina um dia fixo do mês para repassar o pró-labore para sua conta pessoal.

O material **Checklist PF e PJ** traz essa lista pronta para acompanhar.

## 2. Pró-labore: parta do seu custo de vida

Não escolha um número pelo que "sobrou". Calcule de baixo para cima e depois cheque se a empresa aguenta.

Exemplo de custo de vida mensal: moradia R$ 1.800, mercado R$ 1.200, transporte R$ 500, saúde R$ 400, lazer R$ 500, dívidas R$ 600 e reserva pessoal R$ 500. Total: **R$ 5.500**.

Esse é o ponto de partida do seu pró-labore. Use a **Calculadora de Pró-labore** nos materiais para chegar ao valor. Encargos e impostos sobre o pró-labore variam: confirme com o contador como lançar e quanto você leva líquido.

Depois, a checagem: a empresa gera pelo menos esse valor depois de pagar custos fixos e variáveis? Se não gera, você tem dois caminhos: reduzir o pró-labore por um tempo ou aumentar a receita (próxima aula).

## 3. A DRE simples do mês

DRE é só a conta de receita, custos e o que sobrou, na ordem certa. Exemplo:

| Linha | Valor |
|---|---|
| Receita bruta | R$ 12.000 |
| Impostos (exemplo ilustrativo: 6%) | - R$ 720 |
| Custos variáveis (taxas, tráfego, comissão) | - R$ 2.760 |
| **Margem de contribuição** | **R$ 8.520** |
| Custos fixos (sala, software, contador) | - R$ 1.400 |
| Pró-labore | - R$ 5.500 |
| **Resultado do mês** | **R$ 1.620** |

O percentual de imposto é só exemplo. Quanto você paga de fato depende da sua situação: peça esse número ao contador.

Perceba a ordem: o pró-labore entra como custo da empresa. O que aparece como resultado é o que sobra **depois** de você ser pago. Preencha a **DRE do negócio** com os números do mês passado.

## O que fazer com o resultado

Defina uma regra antes de o dinheiro chegar. Exemplo: 50% para reserva da empresa (R$ 810), 30% para reinvestir em tráfego ou ferramenta (R$ 486), 20% para distribuição a você (R$ 324). Os percentuais são sugestão. A tributação sobre a distribuição de lucros é tema do contador.

## Erros comuns

- Tirar dinheiro "quando precisa", sem valor nem dia fixos.
- Definir o pró-labore maior do que a empresa consegue pagar.
- Deixar o pró-labore fora da DRE e achar que está lucrando.
- Manter um custo do negócio no cartão pessoal "só por enquanto".

## Como usar esta aula

Nesta ordem: faça a separação em 15 minutos e marque o item da conta separada. Calcule o pró-labore na calculadora e marque o segundo item. Por fim, preencha a DRE do último mês e marque o terceiro. O checkpoint libera quando os três estiverem prontos.
$md$
from public.tracks t
where l.track_id = t.id and t.slug = 'financas' and l.position = 2;

update public.lessons l set
  body_md = $md$
## Preço não é palpite

Muito treinador define o preço olhando o vizinho: "o pessoal cobra R$ 200, então cobro R$ 200". Só que o vizinho tem outros custos, outro pró-labore, outro número de alunos. Seu preço precisa nascer da sua conta.

> **A regra desta aula:** ponto de equilíbrio = custos fixos (com o seu pró-labore) ÷ margem de contribuição por aluno. O resultado é quantos alunos ativos você precisa para pagar tudo.

## Margem de contribuição

É o que sobra de cada aluno depois dos custos que só existem porque ele existe. Preço menos custos variáveis por aluno.

Exemplo, plano mensal de **R$ 300**:

| Custo variável por aluno | Valor |
|---|---|
| Taxa de pagamento (exemplo: 3%) | R$ 9 |
| Comissão (exemplo: 10%) | R$ 30 |
| Imposto (exemplo ilustrativo: 6%) | R$ 18 |
| Tráfego rateado por aluno | R$ 40 |
| **Total** | **R$ 97** |

Margem de contribuição: R$ 300 - R$ 97 = **R$ 203 por aluno**, ou cerca de 67,7% do preço. O imposto é só exemplo: confirme o seu percentual com o contador.

## Ponto de equilíbrio, passo a passo

1. Some os custos fixos: sala R$ 700, software R$ 400, contador R$ 300 = R$ 1.400.
2. Some o pró-labore: R$ 5.500. Ele conta como custo fixo.
3. Total a cobrir: **R$ 6.900** por mês.
4. Divida pela margem por aluno: R$ 6.900 ÷ R$ 203 = 33,99.
5. Arredonde para cima: **34 alunos ativos**.

Abaixo de 34 alunos você está pagando para trabalhar. Acima, cada aluno extra rende R$ 203 de lucro.

## O que acontece se você baixa o preço

Mantendo os mesmos custos fixos e o mesmo tráfego por aluno (R$ 40):

| Preço | Variáveis por aluno | Margem | Alunos para empatar |
|---|---|---|---|
| R$ 400 | R$ 116 | R$ 284 | 25 |
| R$ 300 | R$ 97 | R$ 203 | 34 |
| R$ 250 | R$ 87,50 | R$ 162,50 | 43 |
| R$ 200 | R$ 78 | R$ 122 | 57 |

Cortar o preço de R$ 300 para R$ 250 parece pouco (menos 17%), mas exige cerca de 25% mais alunos só para empatar. Chegar em R$ 200 exige quase 70% mais alunos. E não é só empatar. Para sobrar R$ 3.000 de lucro, o total a cobrir vira R$ 9.900:

| Preço | Alunos para sobrar R$ 3.000 |
|---|---|
| R$ 400 | 35 |
| R$ 300 | 49 |
| R$ 250 | 61 |
| R$ 200 | 82 |

Mais alunos também significam mais check-ins, mais ajustes de treino, mais mensagens. Sua agenda tem um limite.

## Usando o ponto de equilíbrio para decidir

- **Preço:** antes de dar desconto, refaça a conta. Se o equilíbrio vira um número que você não consegue atender, o desconto não cabe.
- **Contratação:** um auxiliar de R$ 2.000 por mês sobe o total a cobrir para R$ 8.900. São 44 alunos em vez de 34: dez a mais para pagar essa pessoa.
- **Anúncio:** tráfego é custo variável. Se o custo por aluno passa de R$ 40 para R$ 80, a margem cai para R$ 163 e o equilíbrio vai para 43 alunos. Antes de escalar o investimento, veja se a margem aguenta.

## Erros comuns

- Esquecer o pró-labore nos custos fixos.
- Usar o faturamento no lugar da margem de contribuição.
- Comparar preço só com a concorrência, sem olhar a própria conta.
- Dar desconto sem recalcular quantos alunos a mais isso exige.

## Como usar esta aula

Pegue os números da aula anterior e da DRE: custos fixos, pró-labore e custos variáveis por aluno. Calcule a margem de contribuição do seu plano principal e o seu ponto de equilíbrio. Depois teste o que muda com preço R$ 50 menor. Marque cada passo no checklist.
$md$,
  checklist = '[{"id":"t6a3-1","text":"Calculei meus custos variáveis por aluno","hint":"Taxa de pagamento, comissão, imposto (veja com o contador) e tráfego rateado."},{"id":"t6a3-2","text":"Calculei a margem de contribuição do meu plano","hint":"Preço do plano menos os custos variáveis de um aluno, em R$ e em %."},{"id":"t6a3-3","text":"Defini meu ponto de equilíbrio em alunos ativos","hint":"Custos fixos mais pró-labore, divididos pela margem por aluno."},{"id":"t6a3-4","text":"Simulei o impacto de baixar o preço","hint":"Refaça a conta com preço R$ 50 menor e veja quantos alunos a mais."}]'::jsonb
from public.tracks t
where l.track_id = t.id and t.slug = 'financas' and l.position = 3;

update public.lessons l set
  body_md = $md$
## Um ano sem plano vira um ano de susto

Treinador que decide mês a mês sente o susto quando o mercado esfria ou quando um mês bom é tratado como o novo normal. Projetar o ano em cenários tira o improviso: você sabe o que fazer se for bem e o que fazer se for mal.

> **A regra desta aula:** planeje três cenários (conservador, realista e ousado), compare com o realizado todo mês e ajuste o plano comercial.

## Os três cenários

- **Conservador:** o mínimo que você aceita. Ele precisa cobrir o ponto de equilíbrio da aula anterior.
- **Realista:** o que acontece se você executar o plano normalmente.
- **Ousado:** o que acontece se tudo der certo, com mais anúncio, melhor conversão e menos cancelamento.

Exemplo de faturamento projetado por trimestre, com o realizado e a diferença contra o cenário realista:

| Trimestre | Conservador | Realista | Ousado | Realizado | Diferença |
|---|---|---|---|---|---|
| 1º | R$ 30.000 | R$ 39.000 | R$ 48.000 | R$ 41.500 | + R$ 2.500 |
| 2º | R$ 27.000 | R$ 36.000 | R$ 45.000 | R$ 34.000 | - R$ 2.000 |
| 3º | R$ 33.000 | R$ 45.000 | R$ 60.000 | a preencher | |
| 4º | R$ 36.000 | R$ 48.000 | R$ 66.000 | a preencher | |
| **Ano** | **R$ 126.000** | **R$ 168.000** | **R$ 219.000** | | |

Na planilha, abra cada trimestre em três meses. Exemplo do 1º trimestre no cenário realista: R$ 12.000, R$ 13.000 e R$ 14.000, somando R$ 39.000. A tabela acima só resume para caber na tela.

## Sazonalidade

No mercado fitness brasileiro, a tendência comum é a procura subir no início do ano (promessas de ano novo) e nos meses antes do verão. Costuma haver meses mais fracos no meio do ano. Isso é uma tendência, não uma regra: olhe o seu histórico e use o que seus próprios números mostrarem.

Na projeção, isso se traduz assim: coloque mais esforço de captação antes dos meses fortes e um plano de retenção para os fracos. No exemplo, o 2º trimestre cai em todos os cenários.

## Da meta ao caixa: a conta de trás para frente

Meta não é um número solto, é uma fila de ações. Exemplo, com meta de **R$ 16.000 por mês** e mensalidade de R$ 300. As taxas de conversão abaixo são exemplos: use as suas.

| Etapa | Conta | Resultado |
|---|---|---|
| Alunos ativos | R$ 16.000 ÷ R$ 300 | 54 alunos |
| Vendas novas por mês | repor cerca de 4 que saem (8% de cancelamento, exemplo) e crescer 4 | 8 vendas |
| Avaliações por mês | 8 ÷ 40% de fechamento | 20 avaliações |
| Leads por mês | 20 ÷ 25% de leads que agendam e comparecem | 80 leads |

Isso vira rotina: cerca de 20 leads e 5 avaliações por semana. Se você não consegue gerar 80 leads por mês, a meta ou o investimento em captação precisa mudar.

## Passo a passo

1. Defina a meta de faturamento do ano e quebre em trimestres e meses.
2. Monte os três cenários, com o conservador acima do ponto de equilíbrio.
3. Calcule a conta de trás para frente para o cenário realista.
4. Faça a revisão mensal: no primeiro dia útil, preencha o realizado e a diferença.
5. Quando a diferença for negativa, descubra em que etapa travou: leads, avaliações ou fechamento. Ajuste ali.

## Erros comuns

- Projetar só um cenário, otimista.
- Copiar o mês do pico para todos os meses.
- Tratar meta de faturamento sem traduzir em leads e avaliações.
- Montar a projeção em janeiro e nunca mais abrir.

## Como usar esta aula

Abra o material **Projeção anual em 3 cenários**, preencha os valores por trimestre e depois por mês. Faça a conta de trás para frente para o cenário realista e marque cada passo no checklist. Deixe um lembrete mensal de 30 minutos para a revisão.
$md$,
  checklist = '[{"id":"t6a4-1","text":"Montei os três cenários do ano","hint":"Conservador acima do ponto de equilíbrio, realista e ousado."},{"id":"t6a4-2","text":"Marquei a sazonalidade do meu histórico","hint":"Destaque os meses mais fortes e mais fracos dos seus números."},{"id":"t6a4-3","text":"Converti a meta em vendas, avaliações e leads","hint":"Conta de trás para frente, com as suas taxas de conversão."},{"id":"t6a4-4","text":"Agendei a revisão mensal da projeção","hint":"Primeiro dia útil: preencher o realizado e ajustar o plano."}]'::jsonb
from public.tracks t
where l.track_id = t.id and t.slug = 'financas' and l.position = 4;

