#!/bin/bash
cd ../trainer

optimizers=("adagrad" "gradient")
train_steps=(30)
learning_rate=(0.1 0.01 0.001)
hidden_layer=(10 100 1000)

for i in "${optimizers[@]}"
do
            for j in "${train_steps[@]}"
                do
                    for k in "${learning_rate[@]}"
                    do
                        for l in "${hidden_layer[@]}"
                        do
                            python3 premade_estimator.py --train_steps="$j" --optimizer="$i" --learning_rate="$j" --hidden_layer="$l" > "results/$i-$j-$k-$l".txt
                        done
                    done 
                done

done
