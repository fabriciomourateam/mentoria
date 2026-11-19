# Conteúdo dos carrosséis educativos (gerar audiência, sem chamar pra mentoria).
# **negrito**  [[laranja]]   k: cover | stmt | red | dark | final
FINAL_B = "Eu te chamo no direct pra uma **avaliação gratuita** do seu cenário. Ou toca no link da bio."
CTA = "\n\nComenta MENTORIA que eu te chamo pra uma avaliação gratuita do seu cenário. Ou toca no link da bio.\n\n#consultoriaonline #nutricionista #personaltrainer #mentoria #empreendedorismodigital"

POSTS = {
"c01-estrutura": {
  "caption": """Uma boa consultoria online tem 5 peças. A maioria dos profissionais monta só uma.

Quem leva o consultório pro online do mesmo jeito (atende, entrega o plano e some até o retorno) tem um atendimento online. Não uma consultoria.

Uma consultoria de verdade tem 5 peças:
1. Entrada
2. Entrega
3. Acompanhamento
4. Renovação
5. Números

Quantas você tem hoje? Me conta nos comentários.

Salva pra montar a sua."""+CTA,
  "slides": [
    {"k":"cover","kicker":"Uma boa consultoria online tem","big":"5 peças.","bs":300,"sub":"E a maioria dos profissionais monta só uma: [[a entrega.]]","lab":"A estrutura de uma boa consultoria online"},
    {"k":"stmt","lab":"O erro mais comum","H":"Fazer online o mesmo do [[consultório.]]","B":"Atende, entrega o plano e some até o retorno. **O aluno fica sozinho justo quando mais precisa de você.**"},
    {"k":"stmt","H":"As 5 [[peças.]]","hs":180,"items":["Entrada","Entrega","Acompanhamento","Renovação","Números"]},
    {"k":"stmt","lab":"Peças 1 e 2","H":"Entrada e [[entrega.]]","B":"**Entrada:** o que acontece entre o pagamento e o primeiro contato. Boas-vindas, anamnese e prazo claro. **Entrega:** um plano que ele entende sozinho, sem precisar te chamar pra decifrar."},
    {"k":"red","lab":"Peça 3","H":"Acompanhamento [[é o produto.]]","B":"Plano qualquer um acha na internet. **O que ele não acha sozinho é alguém olhando o progresso toda semana e ajustando a rota.**"},
    {"k":"dark","lab":"Peças 4 e 5","H":"Renovação se planeja [[no dia 1.]]","B":"E os números você olha toda semana: quantos entraram, quantos ficaram, quantos renovaram. **Sem isso, você descobre o problema quando o mês já fechou.**"},
    {"k":"stmt","lab":"Faz o check","H":"Quantas das 5 você [[tem hoje?]]","B":"Se a resposta é \"só a entrega\", você tem um atendimento online. **Ainda não tem uma consultoria.**"},
    {"k":"final","H":"Salva pra montar [[a sua.]]","B":FINAL_B},
  ]},
"c02-hora": {
  "caption": """Quem vende hora coloca um teto no próprio faturamento.

Quem cobra por hora coloca um teto no próprio faturamento: o dia tem o mesmo tamanho todo mês. Crescer vira sinônimo de trabalhar mais, até o dia em que não cabe mais.

Mentalidade de empresário significa montar programa, processo e rotina pra que o aluno tenha resultado até nas horas em que você não está olhando.

Se você parar 15 dias, o que acontece com o seu negócio?"""+CTA,
  "slides": [
    {"k":"cover","kicker":"Quem vende","big":"Horas","bs":300,"sub":"já colocou um [[teto]] no próprio salário.","lab":"Mentalidade de empresário"},
    {"k":"stmt","lab":"A conta que ninguém faz","H":"Seu dia tem o mesmo tamanho [[todo mês.]]","B":"Se cada real que entra depende de uma hora sua, crescer significa trabalhar mais. **Até o dia em que não cabe mais.**"},
    {"k":"red","lab":"Exemplo ilustrativo","H":"8h × 22 dias","nw":1,"hs":168,"big":"= 176 horas.","bigs":180,"B":"É o máximo que quem vende hora consegue vender no mês. **Sem férias, sem doença, sem imprevisto.**"},
    {"k":"stmt","lab":"O que muda na cabeça do empresário","H":"Isso funciona [[sem mim?]]","B":"Sumir do atendimento não resolve. **O objetivo é o aluno ter resultado mesmo nas horas em que você não está olhando.**"},
    {"k":"stmt","H":"Mesma profissão. [[Outra cabeça.]]","rows":[["Quanto cobro pela consulta?","Quanto vale o resultado em 3 meses?"],["Preciso de mais alunos","Preciso que eles fiquem mais"],["Respondo tudo na hora","Tenho horário e processo"],["Faço tudo sozinho","Sei o que delegar"]]},
    {"k":"dark","lab":"Na prática","H":"Programa, processo [[e rotina.]]","B":"Programa de meses no lugar de consulta solta. Processo que se repete igual com todo aluno. **Rotina com hora pra atender e hora pra gerir.**"},
    {"k":"stmt","lab":"Uma pergunta pra hoje","H":"Se você parar 15 dias, [[o que acontece?]]","B":"Se a resposta é \"para tudo\", você tem um emprego que criou pra si mesmo. **Dá pra mudar isso sem largar o atendimento.**"},
    {"k":"final","H":"Pensa nisso [[essa semana.]]","B":FINAL_B},
  ]},
"c03-agenda-cheia": {
  "caption": """Agenda cheia pode ser sinal de preço baixo.

Exemplo ilustrativo:
60 consultas de R$ 150 = R$ 9 mil
30 programas de R$ 450 = R$ 13,5 mil

Metade das pessoas, mais faturamento e tempo pra acompanhar cada uma direito. Resultado melhor vira indicação e renovação.

Crescer de verdade é escolher pra quem você atende, quanto cobra e quanto tempo dedica a cada um."""+CTA,
  "slides": [
    {"k":"cover","kicker":"Agenda cheia pode ser sinal de","big":"Preço baixo.","bs":264,"sub":"Mais gente, mais cansaço e [[a mesma margem]] no fim do mês.","lab":"Mentalidade de empresário"},
    {"k":"stmt","H":"Lotou e o dinheiro [[não acompanhou?]]","B":"É o padrão de quem cresce no volume: mais aluno, mais cansaço, mesma margem. **A demanda está aí. O que trava é o modelo.**"},
    {"k":"stmt","H":"3 sinais de que [[é o modelo.]]","items":["Você não tem horário pra pensar no negócio.","Seu preço é o mesmo de 2 anos atrás.","Todo mês começa do zero."]},
    {"k":"red","lab":"Exemplo ilustrativo","H":"60 × R$ 150 = R$ 9 mil","nw":1,"hs":92,"big":"30 × R$ 450 = R$ 13,5 mil","bigs":92,"B":"**Metade das pessoas. Mais faturamento.** E tempo pra atender cada uma direito."},
    {"k":"stmt","lab":"Por que funciona","H":"Menos gente, [[mais perto.]]","B":"Com metade dos alunos você consegue acompanhar de verdade. **Resultado melhor vira indicação e renovação.**"},
    {"k":"dark","H":"Crescer é [[escolher.]]","B":"Escolher pra quem você atende, quanto cobra e quanto tempo dedica a cada um. **Quem decide isso é o dono do negócio.**"},
    {"k":"stmt","lab":"Faz a conta da sua agenda","H":"Quanto você ganha por hora [[de verdade?]]","B":"Some atendimento, mensagens, plano e ajustes. Divida o que entrou no mês por esse tempo. **O número costuma assustar.**"},
    {"k":"final","H":"Salva e faz a conta [[hoje.]]","B":FINAL_B},
  ]},
"c04-hora-real": {
  "caption": """Sua consulta custa R$ 200. Sua hora provavelmente vale menos da metade disso.

A consulta não termina quando a chamada acaba. Tem o plano, as mensagens, os ajustes, o retorno. Esse tempo também é seu, e ninguém está pagando por ele.

Exemplo ilustrativo: 4 horas por aluno. R$ 200 ÷ 4h = R$ 50 a hora, antes de imposto e ferramentas.

Duas saídas: precificar o pacote inteiro ou reduzir o tempo sem reduzir o cuidado.

Desafio: cronometra uma semana e me conta o resultado."""+CTA,
  "slides": [
    {"k":"cover","kicker":"Sua consulta custa R$ 200.","big":"Sua hora","bs":264,"sub":"provavelmente vale [[menos da metade]] disso.","lab":"A conta que quase ninguém faz"},
    {"k":"stmt","H":"A consulta não acaba [[na chamada.]]","B":"Tem o plano, as mensagens, os ajustes, o retorno. **Esse tempo também é seu, e ninguém está pagando por ele.**"},
    {"k":"stmt","lab":"Exemplo ilustrativo","H":"Pra onde vai [[o tempo.]]","items":["1h de consulta","1h montando o plano","1h30 de mensagens no mês","30min de ajustes"],"B":"**Total: 4 horas por aluno.**"},
    {"k":"red","lab":"Exemplo ilustrativo","H":"R$ 200 ÷ 4h","nw":1,"hs":180,"big":"= R$ 50 a hora.","bigs":156,"B":"E ainda sai imposto, plataforma e ferramentas. **A consulta de R$ 200 vira uma hora de R$ 40.**"},
    {"k":"stmt","lab":"Saída 1","H":"Precifique o [[pacote inteiro.]]","B":"Some todo o tempo que um aluno consome em 3 meses e coloque um preço que **pague esse tempo com margem.**"},
    {"k":"dark","lab":"Saída 2","H":"Menos tempo, [[mesmo cuidado.]]","B":"Material pronto pras dúvidas que se repetem, check-in por formulário, horário fixo pra mensagens. **Processo libera hora.**"},
    {"k":"stmt","lab":"Faz agora","H":"Cronometra [[uma semana.]]","B":"Anota cada minuto que você gasta por aluno fora da consulta. **Na sexta você vai saber quanto vale a sua hora.**"},
    {"k":"final","H":"Me conta o seu [[resultado.]]","B":FINAL_B},
  ]},
"c05-semana-1": {
  "caption": """O aluno decide se fica na semana 1, bem antes do retorno e do fim do plano.

Pagou e ficou dias sem notícia? É aí que nasce o arrependimento.

O que precisa acontecer:
1. Boas-vindas no mesmo dia do pagamento
2. Prazo claro de quando o plano chega
3. Uma vitória pequena nos primeiros 7 dias

Regra simples: no máximo 24 horas entre o pagamento e o seu primeiro contato.

Teste: compra o seu próprio serviço e anota o que você recebe e quando."""+CTA,
  "slides": [
    {"k":"cover","kicker":"O aluno decide se fica","big":"Na semana 1.","bs":240,"sub":"Bem antes do retorno e do [[fim do plano.]]","lab":"A estrutura de uma boa consultoria online"},
    {"k":"stmt","H":"Pagou e ficou dias [[sem notícia?]]","B":"É aí que nasce o arrependimento. A pessoa estava empolgada e o silêncio esfria. **Quem esfria na semana 1 raramente renova.**"},
    {"k":"stmt","H":"O que precisa [[acontecer.]]","items":["Boas-vindas no mesmo dia do pagamento.","Prazo claro de quando o plano chega.","Uma vitória pequena nos primeiros 7 dias."]},
    {"k":"red","lab":"A regra","H":"24 horas.","hs":276,"B":"É o tempo máximo entre o pagamento e o seu primeiro contato. **Pode ser uma mensagem pronta, mas tem que chegar.**"},
    {"k":"stmt","lab":"A vitória pequena","H":"Uma meta que dá pra bater [[em 7 dias.]]","B":"Beber 2 litros de água, treinar 3 vezes, dormir antes da meia-noite. **Ele precisa sentir que já começou a dar certo.**"},
    {"k":"dark","H":"Primeira impressão [[vira renovação.]]","B":"Quem é bem recebido confia mais, segue melhor o plano e tem mais resultado. **Tudo isso aparece lá na frente, na hora de renovar.**"},
    {"k":"stmt","lab":"Faz o teste","H":"Compra o seu [[próprio serviço.]]","B":"Paga, espera e anota o que você recebe e quando. **Do lado de lá, a experiência costuma ser bem diferente.**"},
    {"k":"final","H":"Salva pra revisar [[a sua entrada.]]","B":FINAL_B},
  ]},
"c06-renovacao": {
  "caption": """Renovação se planeja, e começa no primeiro dia.

Mandar mensagem no fim do plano é tarde: se a pessoa chegou no último mês sem saber o que vem depois, a decisão de sair já foi tomada.

Como planejar:
1. Mostre a jornada inteira logo no início
2. Marque a evolução a cada mês
3. Apresente a próxima fase antes do fim

Exemplo ilustrativo: com 40 alunos, sair de 30% pra 60% de renovação são 12 alunos a mais por ciclo. Sem gastar um real pra trazer gente nova.

Qual é a sua taxa de renovação hoje?"""+CTA,
  "slides": [
    {"k":"cover","kicker":"Renovação","big":"Se planeja.","bs":258,"sub":"E começa no [[primeiro dia]] do plano.","lab":"A estrutura de uma boa consultoria online"},
    {"k":"stmt","H":"Pedir no fim do plano [[é tarde.]]","B":"Se a pessoa chegou no último mês sem saber o que vem depois, a decisão de sair já foi tomada. **Você só fica sabendo agora.**"},
    {"k":"stmt","H":"Como [[planejar.]]","items":["Mostre a jornada inteira logo no início.","Marque a evolução a cada mês.","Apresente a próxima fase antes do fim."]},
    {"k":"red","lab":"Exemplo ilustrativo · 40 alunos","H":"De 30% pra 60%","nw":1,"hs":168,"big":"= 12 alunos a mais.","bigs":132,"B":"Por ciclo, **sem gastar um real pra trazer gente nova.** Por isso renovação vem antes de captação."},
    {"k":"stmt","lab":"A jornada","H":"Fase 1, fase 2, [[fase 3.]]","B":"Quando o aluno enxerga que existe um próximo passo, **renovar vira o próximo passo natural.**"},
    {"k":"dark","H":"Evolução que ele não vê [[não existe.]]","B":"Foto, medida, carga, peso, como se sente. Mostre o antes e o agora todo mês. **É isso que ele lembra na hora de decidir.**"},
    {"k":"stmt","lab":"Faz agora","H":"Qual é a sua taxa [[de renovação?]]","B":"Dos últimos 10 alunos que terminaram, quantos continuaram? **Se você não sabe o número, esse é o primeiro problema.**"},
    {"k":"final","H":"Salva pra planejar [[a próxima fase.]]","B":FINAL_B},
  ]},
"c07-4-numeros": {
  "caption": """Faturamento é só o placar. Quando ele cai, o problema começou semanas antes.

Os 4 números que todo consultor online deveria olhar toda semana:
1. Contatos novos
2. Quantos viraram venda
3. Alunos ativos
4. Quantos renovaram

Se as vendas caem, você sabe onde olhar: chegou menos gente ou converteu menos? São problemas diferentes, com soluções diferentes.

Uma planilha, 4 colunas, 10 minutos toda segunda."""+CTA,
  "slides": [
    {"k":"cover","kicker":"Olhar só o faturamento é ver","big":"Tarde demais.","bs":228,"sub":"Ele é o resultado. Esses [[4 números]] mostram antes.","lab":"Mentalidade de empresário"},
    {"k":"stmt","H":"Faturamento é [[só o placar.]]","B":"Quando ele cai, o problema começou semanas antes. **Quem olha só o placar descobre tarde.**"},
    {"k":"stmt","H":"Os 4 [[números.]]","hs":180,"items":["Contatos novos na semana.","Quantos viraram venda.","Alunos ativos.","Quantos renovaram."]},
    {"k":"red","lab":"Exemplo ilustrativo","H":"20 contatos × 25%","nw":1,"hs":144,"big":"= 5 vendas.","bigs":180,"B":"Se as vendas caem, você sabe onde olhar: **chegou menos gente ou converteu menos?** São problemas diferentes."},
    {"k":"stmt","lab":"Por que toda semana","H":"Uma semana dá pra corrigir. [[Um mês, não.]]","B":"Olhando toda semana você ajusta no meio do caminho, **antes de virar um mês ruim.**"},
    {"k":"dark","H":"Dono decide [[olhando número.]]","B":"\"O mês tá fraco\" não ajuda ninguém. \"A conversão caiu de 25% pra 12%\" mostra onde agir. **Com o número, a próxima ação fica óbvia.**"},
    {"k":"stmt","lab":"Faz agora","H":"Uma planilha, [[4 colunas.]]","B":"Toda segunda, 10 minutos. **Em um mês você vai conhecer o seu negócio melhor do que em um ano de feeling.**"},
    {"k":"final","H":"Salva e começa [[segunda.]]","B":FINAL_B},
  ]},
}
