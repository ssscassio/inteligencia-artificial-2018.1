import argparse
import tensorflow as tf

import comments_data

parser = argparse.ArgumentParser()
parser.add_argument('--batch_size', default=100, type=int, help='batch size')
parser.add_argument('--train_steps', default=1000, type=int,
                    help='number of training steps')
parser.add_argument('--optimizer', default='adagrad',
                    type=str, help='optimizer name')
parser.add_argument('--learning_rate', default=0.1,
                    type=float, help='learning rate')

OPTIMIZER = tf.train.ProximalAdagradOptimizer
# Optimizers types:
# tf.train.Optimizer
# tf.train.GradientDescentOptimizer <-
# tf.train.AdadeltaOptimizer
# tf.train.AdagradOptimizer <-
# tf.train.AdagradDAOptimizer
# tf.train.MomentumOptimizer
# tf.train.AdamOptimizer <- Beta1=0.9, Beta2=0.999, Epsilon=1e-08
# tf.train.FtrlOptimizer
# tf.train.ProximalGradientDescentOptimizer
# tf.train.ProximalAdagradOptimizer
# tf.train.RMSPropOptimizer


def main(argv):
    args = parser.parse_args(argv[1:])
    OPTIMIZER = tf.train.ProximalAdagradOptimizer
    if args.optimizer == 'adam':
        OPTIMIZER = tf.train.AdamOptimizer
    elif args.optimizer == 'gradient':
        OPTIMIZER = tf.train.GradientDescentOptimizer
    else:
        OPTIMIZER = tf.train.ProximalAdagradOptimizer

    # Fetch the data
    (train_x, train_y), (test_x, test_y) = comments_data.load_data()

    # Create feature columns for all features
    my_feature_columns = []
    for key in train_x.keys():
        my_feature_columns.append(tf.feature_column.numeric_column(key=key))

    classifier = tf.estimator.DNNClassifier(
        feature_columns=my_feature_columns,
        # One hidden layer of 100 nodes
        hidden_units=[100],
        # The momdel must choose between 2 classes
        n_classes=2,
        # Choose the Optimizer
        optimizer=OPTIMIZER(
            learning_rate=args.learning_rate,
        )
    )

    # Train the Model.
    classifier.train(
        input_fn=lambda: comments_data.train_input_fn(train_x, train_y,
                                                      args.batch_size),
        steps=args.train_steps)

    # TODO: Evaluate the model  (Using tests data)
    eval_result = classifier.evaluate(
        input_fn=lambda: comments_data.eval_input_fn(test_x, test_y,
                                                     args.batch_size))

    print(args)
    print(eval_result)


if __name__ == '__main__':
    tf.logging.set_verbosity(tf.logging.INFO)
    tf.app.run(main)
