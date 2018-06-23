// Genetic Algorithm Params
const POPULATION_SIZE = 100;
// MAP fields
const MAP = {
    WALL: 0, BLANK: 1, END: 2
};
// Robot Moves: Alleles
const ROBOT_MOVE = {
    TURN_LEFT: 0, MOVE_FRONT: 1, TURN_RIGHT: 2
};
// Robot Chromosome Size: ( Map_fields_size )^ Robot_sensors_count
const CHROMOSOME_SIZE = 27;


function initialization() {
    firstGeneration = []
    for (i = 0; i < POPULATION_SIZE; i++) {
        var robot = {
            chromosome: [],
            fitness: null,
            generation: 0
        }
        for (j = 0; j < CHROMOSOME_SIZE; j++) {
            robot.chromosome.push(mutate(0, 3, 1));
        }

        firstGeneration.push(robot);
    }
    return firstGeneration;
}

/**
 * Mutate one Chromosome 's Locus
 * @param {int} initialValue value that will be returned if no mutation occurs
 * @param {int} mutationRange Limit value that can be reach by the mutation Ex.: mutationRange=3 will 
 * randomize a integer between 0 and 3
 * @param {float} mutationRate Float value between 0 and 1 that will define if the mutation will
 * happen or not 
 */
function mutate(initialValue, mutationRange = 3, mutationRate = 0.2) {
    if (Math.random() <= mutationRate) {
        return Math.floor((Math.random() * (mutationRange)));
    } else {
        return initialValue;
    }
}

/**
 * Calculate the mean fitness of a generation
 * @param {Array} generation Generation to be calculated the mean fitness
 * @returns The mean fitness of the generation
 */
function fitnessMean(generation) {
    fitnessAcc = 0;
    generation.forEach(robot => {
        fitnessAcc += robot.fitness;
    });
    return fitnessAcc / generation.length;
}

/**
 * Sort subjects on a generation by fitness
 * @param {Array} generation Generation not ordered
 * @returns Array of Subjects ordered by fitness
 */
function sortByFitness(generation) {
    return generation.sort(function (a, b) {
        return (a.fitness > b.fitness) ? 1
            : ((b.fitness > a.fitness) ? -1
                : 0);
    });
}

/**
 * Get the best Subject of a generation
 * @param {Array} generation The generation
 * @return The best Subject of the generation
 */
function bestFitnessSubject(generation) {
    return sortByFitness(generation)[0];
}

/** Main **/
console.log("Computação Evolutiva");
var firstGeneration = initialization();
console.log(bestFitnessSubject(firstGeneration));

var firstGenerationFitnessMean = fitnessMean(firstGeneration);
console.log(firstGenerationFitnessMean);