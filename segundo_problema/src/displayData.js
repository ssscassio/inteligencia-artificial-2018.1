var blessed = require('blessed');
var contrib = require('blessed-contrib');
var colors = require('colors/safe');
var screen = blessed.screen();
const MAP = { BLANK: 0, WALL: 1, END: 2, OUT_RANGE: 3 };
const ROBOT_LOOK = { LEFT: 0, TOP: 1, RIGHT: 2, BOTTOM: 3 };

var grid = new contrib.grid({ rows: 12, cols: 12, screen: screen })
var energy = 0;

var simulateBox = grid.set(6, 0, 6, 3, blessed.box, {
    label: 'Simulation on Trained Map',
    align: 'center',
    valign: 'middle'
});

module.exports = {
    initialize: function (bestFitnessOverGenerations, meanFitnessOverGenerations, bestSubject, evolutionParams, fitnessPonds) {

        // Fitness Table
        var fitnessTable = grid.set(6, 8, 6, 4, contrib.table,
            {
                keys: true,
                fg: 'white',
                selectedFg: 'black',
                selectedBg: 'white',
                interactive: true,
                label: 'Fitness Table',
                columnWidth: [12, 12, 12]
            });

        fitnessTable.setData(
            {
                headers: ['Generation', 'Best Fitness', 'Mean Fitness'],
                data: bestFitnessOverGenerations.map((fitness, index) => [
                    colors.green(index), colors.red(fitness), colors.yellow(meanFitnessOverGenerations[index])])
            });
        fitnessTable.focus();
        screen.append(fitnessTable);

        // Evolution Params
        var evolutionParamsBox = grid.set(6, 3, 3, 2.5, blessed.box, {
            label: 'Evolution Params',
            padding: 1,
            valign: 'middle'
        })
        evolutionParamsBox.setContent(
            "Population Size:       " + evolutionParams.populationSize + "\n" +
            "Limit of Robot Steps:  " + evolutionParams.limitOfRobotSteps + "\n" +
            "Limit of Generations:  " + evolutionParams.limitOfGenerations + "\n" +
            "Mutation Rate:         " + (evolutionParams.mutationRate * 100).toFixed(2) + " %");
        screen.append(evolutionParamsBox);

        // Fitness Ponderations
        var fitnessPondBox = grid.set(6, 5.5, 3, 2.5, blessed.box, {
            label: 'Fitness Ponderations',
            padding: 1,
            valign: 'middle'
        })
        fitnessPondBox.setContent(
            "For each energy spent:      " + fitnessPonds.ENERGY_SPENT + "\n" +
            "For each unity of distance: " + fitnessPonds.DISTANCE + "\n" +
            "For each time on the wall:  " + fitnessPonds.TIMES_ON_WALL + "\n" +
            "If reach the end:           " + fitnessPonds.REACH);
        screen.append(fitnessPondBox);

        // Best Subject
        var bestSubjectBox = grid.set(9, 3, 3, 5, blessed.box, {
            label: 'Best Subject',
            padding: 1,
            valign: 'middle'
        })
        bestSubjectBox.setContent(
            "Generation of first occurrence:  " + bestSubject.generation + "\n" +
            "Chromosome: " + bestSubject.chromosome + "\n" +
            "Fitness:                      " + bestSubject.fitness);
        screen.append(bestSubjectBox);

        // Fitness Graph
        var fitnessLine = grid.set(0, 0, 6, 12, contrib.line,
            {
                showNthLabel: 5,
                label: 'Fitness over Generations',
                showLegend: true
            });

        var meanFitnessData = {
            title: 'Mean Fitness',
            style: { line: 'yellow' },
            x: meanFitnessOverGenerations.map((value, index) => "" + index),
            y: meanFitnessOverGenerations
        }
        var bestFitnessData = {
            title: 'Best Fitness',
            style: { line: 'red' },
            x: bestFitnessOverGenerations.map((value, index) => "" + index),
            y: bestFitnessOverGenerations
        }
        screen.append(fitnessLine);
        fitnessLine.setData([meanFitnessData, bestFitnessData])

        // Screen and Resize events definition
        screen.key(['escape', 'q', 'C-c'], function (ch, key) {
            return process.exit(0);
        });

        screen.on('resize', function () {
            fitnessTable.emit('attach');
            evolutionParamsBox.emit('attach');
            fitnessPondBox.emit('attach');
            bestSubjectBox.emit('attach');
            fitnessLine.emit('attach');
            fitnessLine.setData([meanFitnessData, bestFitnessData]);
        });

        screen.render()
    },
    simulate: function (position, map) {


        simulatedMap = "";
        for (var y = 0; y < map.length; y++) {
            for (var x = 0; x < map[0].length; x++) {
                if (position.x == x && position.y == y) {
                    switch (position.side) {
                        case ROBOT_LOOK.LEFT:
                            simulatedMap += " < ";
                            break;
                        case ROBOT_LOOK.TOP:
                            simulatedMap += " ^ ";
                            break;
                        case ROBOT_LOOK.RIGHT:
                            simulatedMap += " > ";
                            break;
                        case ROBOT_LOOK.BOTTOM:
                            simulatedMap += " V ";
                            break;
                    }

                } else if (map[y][x] == MAP.BLANK) {
                    simulatedMap += "   ";
                } else if (map[y][x] == MAP.END) {
                    simulatedMap += " F ";
                } else {
                    simulatedMap += "[#]";
                }
            }
            simulatedMap += "\n"
        }

        simulateBox.setContent(simulatedMap + "Movements: " + energy++ + "\nPosition: " + JSON.stringify(position));
        screen.render()
    }
}
