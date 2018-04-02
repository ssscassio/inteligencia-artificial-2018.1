# Redes Neurais Artificiais

# Proposta 

**Classificação de comentários como positivos ou negativos**

A proposta do projeto é escolher comentários em algum site que tenha comentários com avaliação e treinar um modelo para ser capaz de, dado um novo comentário não rotulado classificar o comentário como posito ou negativo

# Dados
A primeira etapa do projeto era decidir qual seria o site que iriamos utilizar para capturar as informações de comentários e avaliação dos usuários para cada comentário

## Serviços pensados para ter seus comentários analisados
- [Google Play](https://play.google.com/store)
	Reviews de aplicativos mobile (Estrelas de 1 a 5)
- [TripAdvisor](https://www.tripadvisor.com/)
	Comentários e avaliação sobre locais feito, geralmente, por turistas (Pontos de 1 a 5)
- [Steam](http://store.steampowered.com/)
	Avaliação de jogos: Comentários e Avaliação(Recomendado/Não recomendado)
  
Para criar o nosso dataset de comentários e pontuação foi pensado inicialmente fazer um crawler percorrendo os 
sites e armazendo as informações em um banco em que tivessemos controle

## Armazenar informações
Dentre as opções para armazenar os dados coletados no site escolhido, ficamos entre:
- [SQLite:](https://www.sqlite.org/index.html) (Por ser leve e gerar um arquivo .db)
- [Firebase:](www.firebase.com/) (Por não depender da infraestrutura de SGBD local)

## Tecnologia para realizar a mineração
- [NodeJs](https://nodejs.org/en/)
- [Google-Play-Scraper](https://github.com/facundoolano/google-play-scraper)


