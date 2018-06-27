// Imports
var displayData = require('./displayData');

// Genetic Algorithm Params
const POPULATION_SIZE = 200;
const LIMIT_OF_ROBOT_STEPS = 100;
const LIMIT_OF_GENERATIONS = 100;
// MAP fields
const MAP = { BLANK: 0, WALL: 1, END: 2, OUT_RANGE: 3 };
const _ = 0, X = 1, F = 2;
// Robot Moves: Alleles
const ROBOT_MOVE = { TURN_LEFT: 0, MOVE_FRONT: 1, TURN_RIGHT: 2 };
// Which Side the robot is looking
const ROBOT_LOOK = { LEFT: 0, TOP: 1, RIGHT: 2, BOTTOM: 3 };
// Robot Chromosome Size: ( Map_fields_size )^ Robot_sensors_count
const CHROMOSOME_SIZE = 64;
// Mutate Rate to each Locus on Chromosome
const MUTATE_RATE = 1 / 62;

/**
 * Create the first generation of subjects fully randomized
 * @returns {Array} list of robot objects generated randomly 
 *  {chromosome, fitness, generation}
 */
function initialization() {
    firstGeneration = [];
    for (var i = 0; i < POPULATION_SIZE; i++) {
        var robot = {
            chromosome: [],
            fitness: null,
            generation: 0
        }
        for (var j = 0; j < CHROMOSOME_SIZE; j++) {
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
function mutate(initialValue, mutationRange = 3, mutationRate = MUTATE_RATE) {
    if (Math.random() <= mutationRate) {
        return Math.floor((Math.random() * (mutationRange)));
    } else {
        return initialValue;
    }
}

function mutateRobot(robot, mutationRate) {
    var newRobot = Object.assign({}, robot);
    var newChromosome = [];
    newRobot.chromosome.forEach((locus) => {
        var newLocus = mutate(locus, 3, mutationRate);
        newChromosome.push(newLocus);
    });
    newRobot.chromosome = newChromosome;
    return newRobot;
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

function calculateFitness(generation, map, initialPosition, desirablePosition) {
    var generationWithFitness = [];

    generation.forEach((robot) => {
        var newRobot = updateRobotFitness(robot, map, initialPosition, desirablePosition);
        generationWithFitness.push(newRobot);
    });
    return generationWithFitness;
}

function updateRobotFitness(robot, map, initialPosition, desirablePosition) {
    var newRobot = Object.assign({}, robot);
    var energySpent = 0;
    var actualPosition = Object.assign({}, { ...initialPosition });
    var fitness = 1000;
    var reach = false;
    var timesOnWall = 0;
    for (; energySpent < LIMIT_OF_ROBOT_STEPS; energySpent++) {

        // Get sensor values
        var sensor = readSensors(map, actualPosition);
        // Update the actualPosition
        actualPosition = robotMove(newRobot.chromosome, actualPosition, sensor, map);
        // Check if move to a Wall block
        if (map[actualPosition.y][actualPosition.x] == MAP.WALL) {
            timesOnWall += 1;
        }
        // Check if reached the final block
        if (map[actualPosition.y][actualPosition.x] == MAP.END) {
            reach = true;
            break;
        }
    }
    const distance = manhattanDistance(actualPosition, desirablePosition);

    // console.log(energySpent, distance, reach, timesOnWall);
    // Adaptation Function - Fitness - Ponderations
    fitness += energySpent * 50;
    fitness += distance * 300;
    fitness -= reach ? -1000 : 0;
    fitness += timesOnWall * 300;
    newRobot.fitness = fitness + getRandomInt(0, 1000);
    return newRobot;
}

/**
 * Computes the distances betweens pairs of elements
 * @param {Object} actualPosition first position, object with x and y fields { x, y }
 * @param {Object} desirablePosition second position, object with x and y fields { x, y }
 */
function euclideanDistance(actualPosition, desirablePosition) {
    return Math.floor(
        Math.sqrt(
            Math.pow((desirablePosition.x - actualPosition.x), 2) +
            Math.pow((desirablePosition.y - actualPosition.y), 2)
        )
    );
}

/**
 * Computes the distance that would be traveled to get 
 * from one data point to the other if a grid-like path is followed.
 * @param {Object} actualPosition first position, object with x and y fields { x, y }
 * @param {Object} desirablePosition second position, object with x and y fields { x, y }
 */
function manhattanDistance(actualPosition, desirablePosition) {
    return Math.abs(desirablePosition.x - actualPosition.x) +
        Math.abs(desirablePosition.y - actualPosition.y);
}

/**
 * Computes the absolute magnitude of the difference between coordinates
 * of a pair of objects
 * @param {Object} actualPosition first position, object with x and y fields { x, y }
 * @param {Object} desirablePosition second position, object with x and y fields { x, y }
 */
function chebyshevDistance(actualPosition, desirablePosition) {
    return Math.max(
        Math.abs(desirablePosition.x - actualPosition.x),
        Math.abs(desirablePosition.y - actualPosition.y));
}

function robotMove(chromosome, actualPosition, sensor, map) {
    const { x, y, side } = actualPosition;
    var nextPosition = Object.assign({}, actualPosition);
    var phenotype = getPhenotype(chromosome);

    const ROBOT_ABSOLUTE_COORDINATE = //[Left, Top, Right, Bottom]
        [x - 1 >= 0 ? map[y][x - 1] : MAP.OUT_RANGE,
        y - 1 >= 0 ? map[y - 1][x] : MAP.OUT_RANGE,
        x + 1 < map[0].length ? map[y][x + 1] : MAP.OUT_RANGE,
        y + 1 < map.length ? map[y + 1][x] : MAP.OUT_RANGE];

    robotAction = phenotype[sensor.left][sensor.front][sensor.left];
    switch (robotAction) {
        case ROBOT_MOVE.TURN_LEFT:
            nextPosition.side = side - 1 < 0 ? ROBOT_LOOK.BOTTOM : side - 1; break;
        case ROBOT_MOVE.MOVE_FRONT:
            nextPosition.side = side;
            if (ROBOT_ABSOLUTE_COORDINATE[side] != MAP.OUT_RANGE) {
                switch (side) {
                    case ROBOT_LOOK.LEFT:
                        nextPosition.x -= 1; break;
                    case ROBOT_LOOK.RIGHT:
                        nextPosition.x += 1; break;
                    case ROBOT_LOOK.TOP:
                        nextPosition.y -= 1; break;
                    case ROBOT_LOOK.BOTTOM:
                        nextPosition.y += 1; break;
                }
            }
            break;
        case ROBOT_MOVE.TURN_RIGHT:
            nextPosition.side = side + 1 > 3 ? ROBOT_LOOK.LEFT : side + 1; break;
    }

    return nextPosition;
}

function getPhenotype(chromosome) {
    var phenotype = new Array(
        new Array(
            new Array(), new Array(), new Array(), new Array()
        ),
        new Array(
            new Array(), new Array(), new Array(), new Array()
        ),
        new Array(
            new Array(), new Array(), new Array(), new Array()
        ),
        new Array(
            new Array(), new Array(), new Array(), new Array()
        ));
    for (i = 0; i < chromosome.length; i++) {
        phenotype[Math.floor(i / 16)][(Math.floor(i / 4)) % 4][i % 4] = chromosome[i];
    }
    return phenotype;
}

/**
 * Read the sensors of robot based on his position on the map
 * 
 * @param {[][]} map the Map of training
 * @param {Object} robotPosition Object that must contain 3 fields: { x, y, side }
 *  that represents the position x and y of the robot on the map and the direction in 
 * which the robot is looking (0:Left, 1:Top, 2:Right, 3:Bottom)
 * @returns {Object} a object with 3 fields: { left, front, right } that represents 
 * the infos from the map of the left, front and right sensors of the robot
 */
function readSensors(map, robotPosition) {
    const { x, y, side } = robotPosition;
    const
        LEFT_SENSOR = x - 1 >= 0 ? map[y][x - 1] : MAP.OUT_RANGE,
        TOP_SENSOR = y - 1 >= 0 ? map[y - 1][x] : MAP.OUT_RANGE,
        RIGHT_SENSOR = x + 1 < map[0].length ? map[y][x + 1] : MAP.OUT_RANGE,
        BOTTOM_SENSOR = y + 1 < map.length ? map[y + 1][x] : MAP.OUT_RANGE;
    switch (side) {
        case ROBOT_LOOK.LEFT:
            return {
                left: BOTTOM_SENSOR, front: LEFT_SENSOR, right: TOP_SENSOR
            }
        case ROBOT_LOOK.TOP:
            return {
                left: LEFT_SENSOR, front: TOP_SENSOR, right: RIGHT_SENSOR
            }
        case ROBOT_LOOK.RIGHT:
            return {
                left: TOP_SENSOR, front: RIGHT_SENSOR, right: BOTTOM_SENSOR
            }
        case ROBOT_LOOK.BOTTOM:
            return {
                left: RIGHT_SENSOR, front: BOTTOM_SENSOR, right: LEFT_SENSOR
            }
    }
}

function createChildren(bestCandidates, generationIndex) {
    var candidatesShuffled = []
    var bestCandidatesChildren = [];
    function shuffle(array) {
        var currentIndex = array.length, temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    }
    candidatesShuffled = shuffle([...bestCandidates]);
    for (var pair = 0; pair < candidatesShuffled.length; pair += 2) {
        var newRobot = {
            chromosome: breed(candidatesShuffled[pair].chromosome, candidatesShuffled[pair + 1].chromosome),
            fitness: null,
            generation: generationIndex
        }
        bestCandidatesChildren.push(newRobot);
    }

    return bestCandidatesChildren;
}

function breed(firstChromosome, secondChromosome) {
    let cutPoint1 = getRandomInt(0, firstChromosome.length - 1);
    let cutPoint2 = getRandomInt(cutPoint1, firstChromosome.length - 1);

    return firstChromosome.slice(0, cutPoint1 + 1)
        .concat(secondChromosome.slice(cutPoint1 + 1, cutPoint2 + 1),
            firstChromosome.slice(cutPoint2 + 1, firstChromosome.length));
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min))) + Math.ceil(min);
}

function main() {
    /** Main **/
    console.log("Robot Evolutionary Computing");

    var bestSubjectsOverGenerations = [];
    var bestFitnessOverGenerations = [];
    var meanFitnessOverGenerations = [];

    var nextGeneration = [];
    //  1. Initialize the first generation of subjects
    var firstGeneration = initialization();
    var actualGeneration = firstGeneration;
    //  2. Generate the map
    var map = [ // (y,x)
        [X, X, X, X, X, X, X, X, X, X], // y = 0
        [X, _, _, _, _, _, _, _, _, X], // |
        [X, X, X, X, X, _, _, _, X, X], // |
        [X, X, _, _, X, _, X, X, _, X], // |
        [X, _, _, _, _, _, _, _, _, X], // |
        [X, X, X, X, _, _, X, X, X, X], // |
        [X, X, _, _, _, _, _, _, _, X], // |
        [X, X, X, X, X, X, X, X, _, X], // |
        [X, _, _, _, _, _, _, _, _, X], // V
        [X, X, X, X, X, X, X, X, X, X]  // y = 9
        // x = 0---------------->x = 9
    ];
    //      2.1. Define End block
    const desirablePosition = {
        x: 1,
        y: 8
    }
    map[desirablePosition.y][desirablePosition.x] = MAP.END;
    //      2.2. Place the robot on Map
    const initialPosition = {
        x: 1,
        y: 1,
        side: ROBOT_LOOK.RIGHT
    }

    //  3. Iteration over Generations
    for (var generationIndex = 0; generationIndex < LIMIT_OF_GENERATIONS; generationIndex++) {
        //  3.1. Calculate the fitness of each subject in generation
        actualGenerationWithFitness = calculateFitness([...actualGeneration], map, initialPosition, desirablePosition);
        var actualGenerationSorted = sortByFitness([...actualGenerationWithFitness]);

        // Get the best robot (Subject)
        var bestSubject = Object.assign({}, actualGenerationSorted[0]);
        bestSubjectsOverGenerations.push(bestSubject);
        bestFitnessOverGenerations.push(bestSubject.fitness);
        var meanFitness = fitnessMean([...actualGenerationSorted]);
        meanFitnessOverGenerations.push(meanFitness);

        //  3.2 Showing info about this generation
        console.log("Generation: ", generationIndex);
        console.log("Best Fitness: ", bestSubject.fitness, "; Best Subject: ");
        console.log("Best Subject Generation: ", bestSubject.generation);
        console.log(getPhenotype(bestSubject.chromosome));
        console.log("Mean Fitness: ", fitnessMean(actualGenerationSorted));

        //  3.3 Creating the next Generation
        //      3.3.1 Crossover
        var best40Parents = [...actualGenerationSorted.slice(0, Math.floor(POPULATION_SIZE * 0.4))];
        var new20Children = createChildren(best40Parents, generationIndex);

        //      3.3.2 Mutation
        //          3.3.1.1 Mutation over Crossover generated children
        var mutated20Children = [];
        new20Children.forEach((robot) => {
            var newRobot = mutateRobot(robot, MUTATE_RATE);
            newRobot.generation = generationIndex;
            mutated20Children.push(newRobot);
        });

        //          3.3.1.1 Mutation over Best Parents Population
        var mutated40Parents = [];
        best40Parents.forEach((robot) => {
            var newRobot = mutateRobot(robot, MUTATE_RATE * 2);
            newRobot.generation = generationIndex;
            mutated40Parents.push(newRobot);
        });

        // 40% - Best Subjects from previous generation
        // 20% - Crossover generated Subjects between 2 parents with 3 cut points (mutationRate = MUTATE_RATE)
        // 40% - Mutated Best Subjects from previous generation (mutationRate = MUTATE_RATE * 2)
        nextGeneration = best40Parents.concat(mutated20Children, mutated40Parents);

        actualGeneration = nextGeneration;
    }
    console.log("Map: ");
    console.log(map);
    var evolutionParams = {
        populationSize: POPULATION_SIZE,
        limitOfRobotSteps: LIMIT_OF_ROBOT_STEPS,
        limitOfGenerations: LIMIT_OF_GENERATIONS,
        mutationRate: MUTATE_RATE
    }

    // Get the first Robot with the min fitness over generations
    var minFitness = bestSubjectsOverGenerations[0].fitness;
    var firstBestSubject = Object.assign({}, bestSubjectsOverGenerations[0]);
    bestSubjectsOverGenerations.forEach(subject => {
        if (subject.fitness < minFitness) {
            minFitness = subject.fitness
            firstBestSubject = Object.assign({}, subject);
        }
    });

    // Display data
    displayData.initialize(
        bestFitnessOverGenerations,
        meanFitnessOverGenerations,
        firstBestSubject,
        evolutionParams
    );

    // Simulate the best robot over generations
    simulateBestRobot(
        firstBestSubject,
        map,
        initialPosition,
        displayData.simulate
    )
}

function simulateBestRobot(robot, map, initialPosition, callback) {
    var bestRobot = Object.assign({}, robot);
    var energySpent = 0;
    var actualPosition = Object.assign({}, { ...initialPosition });

    callback(actualPosition, map);

    var logInterval = setInterval(function () {
        var sensor = readSensors(map, actualPosition);
        actualPosition = robotMove(bestRobot.chromosome, actualPosition, sensor, map, true);
        callback(actualPosition, map);
        if (energySpent == LIMIT_OF_ROBOT_STEPS || map[actualPosition.y][actualPosition.x] == MAP.END) {
            clearInterval(logInterval);
        }
        energySpent++;
    }, 500);

}
main();