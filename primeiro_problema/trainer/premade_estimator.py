import tensorflow as tf

import comments_data


def main(argv):

    # Fetch the data
    (train_x, train_y) = comments_data.load_data()

    # Create feature columns for all features
    my_feature_columns = []
    for key in train_x.keys():
        my_feature_columns.append(tf.feature_column.numeric_column(key=key))

    classifier - tf.estimator.DNNClassifier(
        feature_columns=my_feature_columns,
        hidden_units=[100],
        n_classes=2
    )

    # # Train the Model.
    # classifier.train(
    #     input_fn=lambda:comments_data.
    # )


if __name__ == '__main__':
    tf.app.run(main)
