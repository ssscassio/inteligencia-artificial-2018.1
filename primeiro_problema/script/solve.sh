#!/bin/bash
cd ../trainer

optimizers=("adagrad" "adam" "gradient")
batch_sizes=(10 100 1000)
train_steps=(1000 5000 10000)
learning_rate=(0.1 0.01 0.001)

for i in "${optimizers[@]}"
do
    for j in "${batch_sizes[@]}"
        do
            for k in "${train_steps[@]}"
                do
                    for l in "${learning_rate[@]}"
                    do
                        python3 premade_estimator.py --batch_size="$j" --train_steps="$k" --optimizer="$i" --learning_rate="$l" > "results/$i-$j-$k-$l".txt
                    done 
                done

        done
done

echo "TESTANDO AQUI NO TROLL"
echo $TEST
