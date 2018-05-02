import pandas as pd
import tensorflow as tf


def load_data(label_name='qualification'):

    # TODO: Mudar Path de importação dos dados
    train = pd.read_json(
        "../preprocessor/results/sub-sample.json", orient='records')
    trainJson = train.to_json(force_ascii=False)
    train_x, train_y = train, train.pop(label_name)

    # TODO: Carregar o conjunto de teste

    # TODO: Filtrar textos apenas em português

    words = []
    # Processa o conjunto para transformar em vetor // Bag of Words
    for index, row in train_x.iterrows():
        corpus_raw = row['text'].lower()  # Coloca todo o texto em caixa baixa
        for word in corpus_raw.split():
            if word != '.':
                words.append(word)

    words = set(words)  # Remove duplicadas no conjunto de palavras

    word2int = {}
    int2word = {}

    vocab_size = len(words)

    for i, word in enumerate(words):
        word2int[word] = i
        int2word[i] = word

    bag_of_words = {}

    for i in range(len(int2word)):
        bag_of_words[i] = [0] * len(train_x)

    for i, row in train_x.iterrows():
        corpus_raw = row['text'].lower()  # Coloca todo o texto em caixa baixa
        for word in corpus_raw.split():
            if word != '.':
                index = word2int[word]
                bag_of_words[index][i] += 1

    # Remove palavras com menos que um limiar de ocorrências em diferentes documentos
    bag_of_words_copy = {}
    for word_as_int in range(len(bag_of_words)):
        vector_of_occurrences_of_word = bag_of_words[word_as_int]
        sum = 0
        for occurrence in vector_of_occurrences_of_word:
            if(occurrence != 0):
                sum += 1
        if(sum > 2):
            bag_of_words_copy[word_as_int] = bag_of_words[word_as_int]

    train_x = pd.DataFrame(data=bag_of_words_copy)
    # TODO: Retornar o conjunto de teste
    return (train_x, train_y)


load_data()
