# Redes Neurais Artificiais

# Proposta 

**Classificação de comentários como positivos ou negativos**

A proposta do projeto é escolher comentários em algum site que tenha comentários com avaliação e treinar um modelo para ser capaz de, dado um novo comentário não rotulado classificar o comentário como positivo ou negativo

# Dados
A primeira etapa do projeto era decidir qual seria o site que iriamos utilizar para capturar as informações de comentários e avaliação dos usuários para cada comentário

## Serviços pensados para ter seus comentários analisados
- [Google Play](https://play.google.com/store)
	Reviews de aplicativos mobile (Estrelas de 1 a 5)
- [TripAdvisor](https://www.tripadvisor.com/)
	Comentários e avaliação sobre locais feito, geralmente, por turistas (Pontos de 1 a 5)
- [Steam](http://store.steampowered.com/)
	Avaliação de jogos: Comentários e Avaliação(Recomendado/Não recomendado)
  
Para criar o nosso *Dataset* de comentários e pontuação foi pensado inicialmente fazer um crawler percorrendo os sites e armazenando as informações em um banco que tivéssemos controle

## Armazenar informações
Dentre as opções para armazenar os dados coletados no site escolhido, pensamos em soluções de banco de dados como:
- [SQLite:](https://www.sqlite.org/index.html) (Por ser leve e gerar um arquivo .db)
- [Firebase:](www.firebase.com/) (Por não depender da infraestrutura de SGBD local)

Porém o formato escolhido para armazenar os dados colhidos foi um arquivo *.json* dentro da pasta do projeto, pois sua leitura e escrita é facilitada pelo node e python que foram as ferramentas escolhidas para o desenvolvimento deste trabalho.

## Tecnologia para realizar a mineração
- [NodeJs](https://nodejs.org/en/)
- [google-play-scraper](https://github.com/facundoolano/google-play-scraper)

Inicialmente tentamos fazer um script para extrair as informações do html das páginas da [GooglePlay](https://play.google.com/store) porém, por complicações oriundas da maneira que a página foi implementada e pelo bloqueio no endereço */store/getreviews* no arquivo [robots.txt](https://play.google.com/robots.txt), sua implementação foi mais dificultada. 

Resolvemos então utilizar uma api de terceiro ([google-play-scraper](https://github.com/facundoolano/google-play-scraper)) que usava os *requests* iguais aos feitos pelo navegador de um usuário comum.

## Variabilidade dos dados
Para ter um *Dataset* que contemplasse os diferentes tipos de usuários buscamos dois aplicativos de cada uma das 57 categorias existentes na GooglePlay tanto da lista dos mais baixados pagos, quanto dos mais baixados gratuitos. Resultado em um total de 228 aplicativos. Para cada um destes aplicativos foram pegos os reviews presentes na primeira página de requisição. Poderiam ser retornados no máximo 50 reviews por aplicativo porém sem critério quanto a avaliação do usuário. 

Existe um problema no Dataset nesse ponto pois ele contém informações não relevantes para o propósito do trabalho e pelo fato de ter um conjunto de classes com população desbalanceada o que pode prejudicar no treinamento do modelo por conta de um possível enviesamento por parte do grupo dominante e da falta de representatividade do grupo minoritário.

### Exemplo de Dado (Crawler)
```
{
	"id": "gp:AOqpTOHSkmGFE_awFeeZXD5OC5CFWCQlVJqCMFwbOri1ZQHaegI58h9vsvLYVmu1Cth5YHhm2UfY3VZsfUqT8w",
	"userName": "Gabriela Cunha Alves",
	"userImage": "https://lh3.googleusercontent.com/-JS5R9YV_OJo/AAAAAAAAAAI/AAAAAAAAAAA/ACLGyWCS0TCRI5hzCa2TScenJ7wxSmHtVw/w96-h96-p/photo.jpg",
	"date": "8 de junho de 2016",
	"url": "https://play.google.com/store/apps/details?id=com.mcdonalds.app&reviewId=Z3A6QU9xcFRPSFNrbUdGRV9hd0ZlZVpYRDVPQzVDRldDUWxWSnFDTUZ3Yk9yaTFaUUhhZWdJNThoOXZzdkxZVm11MUN0aDVZSGhtMlVmWTNWWnNmVXFUOHc",
	"score": 1,
	"title": "Não gostei",
	"text": "Não gostei Pois me registrei e não encontrou nelhum restaurante. Sou de Mogi das cruzes. As vezes sou eu quem não soube mecher,mas deveria também ter a versão português. Se tiverem uma resposta. Me ajudem pfv. Ai eu torno a baixar ✌"
}
```

### Tempo de execução (Crawler)

**FREE:**

| real     | user     | sys      |
| -------- | -------- | -------- |
| 4m2.691s | 0m7.387s | 0m0.637s |

**PAID:**

| real      | user     | sys      |
| --------- | -------- | -------- |
| 3m26.569s | 0m5.946s | 0m0.608s |

## Pré processamento

O pré processamento tem como função:
- Remover informações indesejáveis do *Dataset* (ex.: userName, userImage, date, url,...)
- Gerar *Dataset* com **reviews** escolhidos de forma aleatória
- Gerar diferentes conjuntos de dados de treinamento 
	- Base de dados padrão desbalanceada
	- Base de dados sobreamostrada
	- Base de dados subamostrada
- Aplicar limiar na avaliação por estrelas (1 a 3 = negativo; 4 e 5 = positivo)
- Randomizar os reviews no *Dataset*

Uma das soluções para o problema de desbalanceamento de dados de treinamento é a abordagem de pré-processamento de dados, onde o objetivo é balancear o conjunto de treinamento através de mecanismos de reamostragem de dados no espaço de entrada, que incluem sobreamostragem da classe minoritária, subamostragem da classe majoritária ou a combinação de ambas as técnicas.

A sobreamostragem é baseada na replicação de exemplos preexistentes ou na geração de dados sintéticos. Neste caso, replicamos a classe minoritária *(reviews negativos)* até o tamanho de sua população se igualar a dos reviews positivos *(classe majoritária)*.

A subamostragem envolve a eliminação de exemplos da classe majoritária. Os exemplos a serem eliminados podem ser escolhidos aleatoriamente *(subamostragem aleatória)* ou a partir de alguma informação a priori *(subamostragem informativa)*. Neste projeto, foi adotada a remoção de elementos da classe majoritária *(reviews positivos)* de forma aleatória até o tamanho da sua população se igualar a dos reviews negativos *(classe minoritária)*

### Resultado da execução (Pré-Processador)
```
############################
END OF PREPROCESSOR
STATS:
Base positive:  6120
Base negative:  225
Base length:  6345
Sob length:  12195
Sub length:  450
############################
```

### Exemplo de Dado (Pré-Processador)
```
{
	"text": "Excelente Intuitivo e fácil de configurar",
	"qualification": 1
}
```
### Tempo de execução (Pré-Processador)
| real     | user     | sys      |
| -------- | -------- | -------- |
| 0m0.212s | 0m0.171s | 0m0.039s |

## Criação da rede neural MLP

Para a criação da rede neural foi escolhida a linguagem de programação [Python](https://www.python.org/) na sua versão 3.

Como ferramenta escolhida para a criação da rede neural utilizou-se do [Google Tensor Flow](https://www.tensorflow.org/) devido a sua extensa documentação, comunidade grande e ativa, código open source e reputação positiva construída a partir dos excelentes resultados que foram divulgados pelo Google. Já para criar as estruturas de dados necessárias para inserção dos dados na rede criada pelo tensor flow utilizou-se da biblioteca open source [Python Data Analysis Library](http://pandas.pydata.org/).

![Blocos de execução do desenvolvimento do problema](https://i.imgur.com/vPxeRDJ.png)

Figura 1. Blocos de execução do desenvolvimento do problema

Uma vez que os dados já estavam minerados e disponíveis para uso, iniciou-se a etapa de conversão dos dados textuais em dados numéricos, já que redes neurais não são capazes de trabalhar com letras e palavras. O algoritmo escolhido para executar esta tarefa foi o Bag of Words que consiste na teoria da análise de semântica latente para contar o número de ocorrência de uma palavra e colocar em uma posição do vetor de palavras cuja dimensão é N (sendo N o número de palavras do nosso vocabulário). Uma vez que o vetor estava criado, buscamos, dentre todos os comentários, quais palavras ocorreram menos de 2 vezes e retiramos do conjunto de treinamento, por entender que elas são irrelevantes para a predição.

![Figura 2. Exemplo de arquitetura da rede neural](https://i.imgur.com/gd8muvj.png)

Figura 2. Exemplo de arquitetura da rede neural

A rede neural construída neste projeto é uma MultiLayer Perceptron que é uma classe de rede neural artificial retro alimentada (Feedforward artificial neural network). Quanto a estrutura, a rede possui apenas uma camada escondida, que pode ter seu número de neurônios variado com propósito de testes. O método de treinamento utilizado neste trabalho tem como base o Aprendizado supervisionado na qual é apresentado para a rede neural exemplos de dados de entrada e saída e o treinamento é feito comparando-se a saída atual de acordo com os pesos da rede e a saída esperada.

Para simplificar as análises durantes os passos seguintes foram definidos alguns parâmetros entre eles o **tamanho do Batch** que foi definido como sendo igual ao tamanho do conjunto de dados, ou seja, as atualizações nos pesos da rede neural só deveriam ser feitas após o treinamento com influência de todos os dados do conjunto de treinamento.

Para traçar a curva de acurácia foi definido que os treinamentos seriam feitos ao longo de 30 épocas, ou seja, a rede teria seus pesos atualizados 30 vezes ao longo do treinamento. Com a curva de acurácia, é possível analisar a partir de qual época começou a existir super treinamento (overfit) da rede neural. 

Os parâmetros variáveis foram escolhidos com o intuito de verificar, a partir dos resultados, qual seria a melhor configuração da rede para este tipo de problema, a partir da acurácia obtida. Para isso, foi feito um script que executa a rede com todas as 18 combinações possíveis variando os seguintes parâmetros:

1. Número de neurônios na camada escondida: esta variável influencia em como a rede é capaz de generalizar problemas complexos sem que haja overfitting ou underfitting podem ser 10, 100 ou 1000
2. Taxa de aprendizado: esta variável influencia o quanto do erro vai influenciar na mudança dos pesos e nesta implementação pode ser 0.1, 0.01 ou 0.001
3. Otimizador:esta variável diz respeito a forma de tentar minimizar o erro de treino pode ser [Adagrad](https://www.tensorflow.org/api_docs/python/tf/train/AdagradOptimizer) ou [Gradiente descendente](https://www.tensorflow.org/api_docs/python/tf/train/GradientDescentOptimizer)

### Resultados

Para a construção dos conjuntos de treinamento e teste dividiu-se o conjunto amostral em duas partes, sendo o conjunto de treino igual a 90% e o conjunto de testes 10% do conjunto amostral, a escolha dos valores de teste era determinística e obtida sempre a partir dos 10% primeiros itens resultados da execução do pré processador. 

Todos os treinamentos foram executados com o mesmo número de épocas (30) e sofreram variações no número de neurônios na camada escondida, taxa de aprendizagem e otimizadores, ao total foram um total de 18 execuções, porém, foram selecionadas as 3 que consideramos mais adequadas para análise neste relatório.

A primeira das execuções a ser discutida, utilizou do otimizador Adagrad, com 0.1 de taxa de aprendizagem e 10 neurônios na camada escondida. Como resultado, obtivemos uma acurácia máxima de 0,77777780 que apareceu pela primeira vez na sétima época de treinamento e uma acurácia final de 0,64444447 na trigésima e última época, já o erro era de 81242,1 na primeira época e de 1402,4827 na última.

A segunda execução também utilizou do otimizador Adagrad, entretanto com um taxa de aprendizado de 0.001 e um total de 1000 neurônios na camada escondida o que gerou uma acurácia máxima de 0,75555557 na décima sétima época e se manteve fixa até a última época, já o erro começou em 14153884 na primeira época e reduziu-se até 31707,559 na última época.

Já na terceira execução o otimizador utilizado foi o Gradiente descendente, com uma taxa de aprendizado de 0.001 e 1000 neurônios na camada escondida, como resultado, obtivemos uma acurácia máxima de 0,55555560 na segunda época, que se alterou com 0,44444445 até a última época. O mesmo ocorreu para o erro que começou com um valor de 12434655 e na última época foi de 85528,09.

Ao compararmos os dados obtidos entre a primeira e segunda execução, podemos perceber que um algoritmo com uma maior taxa de aprendizado conseguiu chegar mais rápido em uma acurácia maior, entretanto sofreu muita alteração com o passar das épocas (podemos observar no gráfico 1) e acabou terminando com uma acurácia inferior a que foi obtida anteriormente, já na segunda execução, a acurácia final é mais estável, principalmente por que a taxa de aprendizado é menor. Acreditamos que, com um número maior de épocas, a segunda execução seria capaz de atingir um nível maior de acurácia, principalmente se observamos o seu erro, que foi descendente durante todo o treinamento.

![Gráfico 1. Gráfico das acurácias dos testes analisados](https://i.imgur.com/CYWvhzE.png)

Gráfico 1. Gráfico das acurácias dos testes analisados

Já quando comparamos a primeira e a segunda execução com a terceira execução, que utilizou um algoritmo diferente de otimização (gradiente descendente) percebemos que ele teve problemas (preso em algum vale muito profundo), mesmo com uma taxa de aprendizagem pequena, em encontrar o valor mínimo da função, e acabou não alcançando uma taxa de acurácia satisfatória.

![Gráfico 2. Gráfico dos erros dos testes analisados](https://i.imgur.com/MXV5qFq.png)

Gráfico 2. Gráfico dos erros dos testes analisados


| Época    | Acurária   | Erro      |
| -------- | ---------- | --------- |
| 1        | 0,53333336 | 81242,1   |
| 2        | 0,57777780 | 254597,67 |
| 3        | 0,75555557 | 6300,6436 |
| 4        | 0,77777780 | 4686,957  |
| 5        | 0,75555557 | 3648,4998 |
| 6        | 0,75555557 | 2934,704  |
| 7        | 0,77777780 | 2616,107  |
| 8        | 0,77777780 | 2426,7134 |
| 9        | 0,77777780 | 2253,0586 |
| 10       | 0,77777780 | 2111,978  |
| 11       | 0,77777780 | 1975,8851 |
| 12       | 0,62222224 | 1863,1548 |
| 13       | 0,75555557 | 1771,6184 |
| 14       | 0,62222224 | 1644,3672 |
| 15       | 0,75555557 | 1554,6621 |
| 16       | 0,62222224 | 1518,4559 |
| 16       | 0,77777780 | 1533,5017 |
| 18       | 0,77777780 | 1494,9857 |
| 19       | 0,77777780 | 1492,7682 |
| 20       | 0,62222224 | 1479,8978 |
| 21       | 0,77777780 | 1504,1902 |
| 22       | 0,77777780 | 1465,2827 |
| 23       | 0,77777780 | 1458,3765 |
| 24       | 0,77777780 | 1441,0447 |
| 25       | 0,77777780 | 1441,7102 |
| 26       | 0,64444447 | 1428,3184 |
| 27       | 0,77777780 | 1452,6466 |
| 28       | 0,77777780 | 1417,2759 |
| 29       | 0,77777780 | 1412,7798 |
| 30       | 0,64444447 | 1402,4827 |
Tabela 1. Primeira execução - Adagrad 0.1 de taxa de aprendizagem com 10 neurônios na camada intermediária 

| Época    | Acurária   | Erro      |
| -------- | ---------- | --------- |
| 1        | 0,44444445 | 14153884  |
| 2        | 0,55555560 | 31660958  |
| 3        | 0,55555560 | 687413,44 |
| 4        | 0,64444447 | 113281,33 |
| 5        | 0,73333335 | 83450,76  |
| 6        | 0,73333335 | 70077,38  |
| 7        | 0,73333335 | 62122,508 |
| 8        | 0,73333335 | 56363,04  |
| 9        | 0,73333335 | 52072,6   |
| 10       | 0,73333335 | 48829,98  |
| 11       | 0,75555557 | 46291,707 |
| 12       | 0,75555557 | 44307,938 |
| 13       | 0,73333335 | 42648,008 |
| 14       | 0,73333335 | 41263,39  |
| 15       | 0,73333335 | 40177,297 |
| 16       | 0,73333335 | 39218,23  |
| 16       | 0,75555557 | 38419,438 |
| 18       | 0,75555557 | 37712,473 |
| 19       | 0,75555557 | 37042,05  |
| 20       | 0,75555557 | 36396,766 |
| 21       | 0,75555557 | 35821,742 |
| 22       | 0,75555557 | 35253,32  |
| 23       | 0,75555557 | 34778,223 |
| 24       | 0,75555557 | 34274,8   |
| 25       | 0,75555557 | 33791,15  |
| 26       | 0,75555557 | 33326,496 |
| 27       | 0,75555557 | 32925,715 |
| 28       | 0,75555557 | 32493,977 |
| 29       | 0,75555557 | 32076,504 |
| 30       | 0,75555557 | 31707,559 |
Tabela 2. Segunda execução - Adagrad 0.001 de taxa de aprendizagem com 1000 neurônios na camada intermediária 

| Época    | Acurária            | Erro      |
| -------- | ------------------- | --------- |
| 1        | 0,44444445	12434655 |
| 2        | 0,55555560          | 12434655  |
| 3        | 0,55555560          | 4528,086  |
| 4        | 0,44444445          | 148089,89 |
| 5        | 0,55555560          | 1528,0859 |
| 6        | 0,44444445          | 151839,89 |
| 7        | 0,44444445          | 1839,8926 |
| 8        | 0,55555560          | 118528,09 |
| 9        | 0,44444445          | 5589,8926 |
| 10       | 0,55555560          | 115528,09 |
| 11       | 0,44444445          | 9339,893  |
| 12       | 0,55555560          | 112528,09 |
| 13       | 0,44444445          | 13089,893 |
| 14       | 0,55555560          | 109528,09 |
| 15       | 0,44444445          | 16839,893 |
| 16       | 0,55555560          | 106528,09 |
| 16       | 0,44444445          | 20589,893 |
| 18       | 0,55555560          | 103528,09 |
| 19       | 0,44444445          | 24339,893 |
| 20       | 0,55555560          | 100528,09 |
| 21       | 0,44444445          | 28089,893 |
| 22       | 0,55555560          | 97528,09  |
| 23       | 0,44444445          | 31839,893 |
| 24       | 0,55555560          | 94528,09  |
| 25       | 0,44444445          | 35589,89  |
| 26       | 0,55555560          | 91528,09  |
| 27       | 0,44444445          | 39339,89  |
| 28       | 0,55555560          | 88528,09  |
| 29       | 0,44444445          | 43089,89  |
| 30       | 0,55555560          | 85528,09  |

Tabela 2. Segunda execução - Gradiente descendente 0.001 de taxa de aprendizagem com 1000 neurônios na camada intermediária 