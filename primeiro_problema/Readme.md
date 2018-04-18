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

Inicialmente tentamos *crawlear* o html das páginas da [GooglePlay](https://play.google.com/store) porém, por complicações oriundas da maneira que a página foi implementada e pelo bloqueio no endereço */store/getreviews* no arquivo [robots.txt](https://play.google.com/robots.txt), sua implementação foi mais dificultada. 

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
|real|user|sys|
|----|----|---|
|4m2.691s|0m7.387s|0m0.637s|
**PAID:**
|real|user|sys|
|----|----|---|
|3m26.569s|0m5.946s|0m0.608s|

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
|real|user|sys|
|----|----|---|
|0m0.212s|0m0.171s|0m0.039s|