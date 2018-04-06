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

Porém o formato escolhido para armazenar os dados colhidos foi um arquivo *.json* dentro da pasta do projeto. Pois sua leitura e escrita é facilitada pelo node e python que foram as ferramentas escolhidas para o desenvolvimento do projeto.

## Tecnologia para realizar a mineração
- [NodeJs](https://nodejs.org/en/)
- [google-play-scraper](https://github.com/facundoolano/google-play-scraper)

Inicialmente tentamos crawlear o html das páginas da [GooglePlay](https://play.google.com/store) porém, por complicações de oriundas da maneira que a página foi implementada e pelo bloqueio no endereço */store/getreviews* no arquivo [robots.txt](https://play.google.com/robots.txt), sua implementação foi mais dificultada. 

Resolvemos então utilizar uma api de terceiro ([google-play-scraper](https://github.com/facundoolano/google-play-scraper)) que usava os requests iguais aos feitos pelo navegador de um usuário comum.

## Variabilidade dos dados
Para ter um *Dataset* que contemplasse os diferentes tipos de usuários buscamos dois aplicativos de cada uma das 57 categorias existentes na GooglePlay tanto da lista dos mais baixados pagos, quanto dos mais baixados gratuitos. Resultado em um total de 228 aplicativos.


### Tempo de execução do crawler

**FREE:**
real	4m2.691s
user	0m7.387s
sys	0m0.637s

**PAID:**
real	3m26.569s
user	0m5.946s
sys	0m0.608s