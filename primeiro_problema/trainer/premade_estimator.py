import argparse
import tensorflow as tf

import comments_data

parser = argparse.ArgumentParser()
parser.add_argument('--batch_size', default=100, type=int, help='batch size')
parser.add_argument('--train_steps', default=1000, type=int,
                    help='number of training steps')


def main(argv):
    args = parser.parse_args(argv[1:])

    # Fetch the data
    (train_x, train_y), (test_x, test_y) = comments_data.load_data()

    # Create feature columns for all features
    my_feature_columns = []
    for key in train_x.keys():
        my_feature_columns.append(tf.feature_column.numeric_column(key=key))

    classifier = tf.estimator.DNNClassifier(
        feature_columns=my_feature_columns,
        # One hidden layer of 100 nodes
        hidden_units=[4],
        # The momdel must choose between 2 classes
        n_classes=2
    )

    # Train the Model.
    classifier.train(
        input_fn=lambda: comments_data.train_input_fn(train_x, train_y,
                                                      args.batch_size),
        steps=args.train_steps
    )

    # TODO: Evaluate the model  (Using tests data)
    eval_result = classifier.evaluate(
        input_f=lambda: comment_data.eval_input_fn(test_x, test_y,
                                                   args.batch_size)
    )

    print('\nTest set accuracy: {accuracy:0.3f}\n'.format(**eval_result))


if __name__ == '__main__':
    tf.app.run(main)
