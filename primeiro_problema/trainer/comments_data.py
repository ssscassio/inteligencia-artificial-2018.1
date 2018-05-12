import pandas as pd
import tensorflow as tf


def load_data(label_name='qualification'):

    # TODO: Mudar Path de importação dos dados
    train = pd.read_json(
        "../preprocessor/results/sub-sample.json", orient='records')
    trainJson = train.to_json(force_ascii=False)
    train_x, train_y = train, train.pop(label_name)

    test = pd.read_json(
        "../preprocessor/test/test-sub-sample.json", orient='records')
    testJson = test.to_json(force_ascii=False)
    test_x, test_y = test, test.pop(label_name)

    # TODO: Filtrar textos apenas em português

    words = []
    # Processa o conjunto para transformar em vetor // Bag of Words
    for index, row in train_x.iterrows():
        corpus_raw = row['text'].lower()  # Coloca todo o texto em caixa baixa
        for word in corpus_raw.split():
            if word != '.':
                words.append(word)

    for index, row in test_x.iterrows():
        corpus_raw = row['text'].lower()  # Coloca todo o texto em caixa baixa
        for word in corpus_raw.split():
            if word != '.':
                words.append(word)

    words = set(words)  # Remove duplicadas no conjunto de palavras

    word2int = {}
    int2word = {}

    vocab_size = len(words)

    for i, word in enumerate(words):
        word2int[word] = int(i)
        int2word[i] = str(word)

    bag_of_words_train = {}
    bag_of_words_test = {}

    for i in range(len(int2word)):
        bag_of_words_train[i] = [0] * len(train_x)
        bag_of_words_test[i] = [0] * len(test_x)

    for i, row in train_x.iterrows():
        corpus_raw = row['text'].lower()  # Coloca todo o texto em caixa baixa
        for word in corpus_raw.split():
            if word != '.':
                index = word2int[word]
                bag_of_words_train[index][i] += 1

    for i, row in test_x.iterrows():
        corpus_raw = row['text'].lower()  # Coloca todo o texto em caixa baixa
        for word in corpus_raw.split():
            if word != '.':
                index = word2int[word]
                bag_of_words_test[index][i] += 1

    # Remove palavras com menos que um limiar de ocorrências em diferentes documentos
    bag_of_words_train_copy = {}
    bag_of_words_test_copy = {}
    for word_as_int in range(len(bag_of_words_train)):
        vector_of_occurrences_of_word = bag_of_words_train[word_as_int]
        sum = 0
        for occurrence in vector_of_occurrences_of_word:
            if(occurrence != 0):
                sum += 1
        if(sum > 2):
            bag_of_words_train_copy[str(
                word_as_int)] = bag_of_words_train[word_as_int]
            bag_of_words_test_copy[str(word_as_int)
                                   ] = bag_of_words_test[word_as_int]

    train_x = pd.DataFrame(data=bag_of_words_train_copy)
    test_x = pd.DataFrame(data=bag_of_words_test_copy)

    return (train_x, train_y), (test_x, test_y)


def train_input_fn(features, labels, batch_size):

    # Convert the inputs to a Dataset.
    dataset = tf.data.Dataset.from_tensor_slices((dict(features), labels))

    # Shuffle, repeat, and batch the examples.
    dataset = dataset.batch(batch_size)

    # Return the dataset.
    return dataset


def eval_input_fn(features, labels, batch_size):
    features = dict(features)
    if labels is None:
        # No labels, use only features.
        inputs = features
    else:
        inputs = (features, labels)

    # Convert the inputs to a Dataset.
    dataset = tf.data.Dataset.from_tensor_slices(inputs)

    # Batch the examples
    assert batch_size is not None, "batch_size must not be None"
    dataset = dataset.batch(batch_size)

    # Return the dataset.
    return dataset


load_data()
