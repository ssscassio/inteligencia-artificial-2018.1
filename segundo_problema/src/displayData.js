var blessed = require('blessed');
var contrib = require('blessed-contrib');
var screen = blessed.screen();
const MAP = { BLANK: 0, WALL: 1, END: 2, OUT_RANGE: 3 };
const ROBOT_LOOK = { LEFT: 0, TOP: 1, RIGHT: 2, BOTTOM: 3 };

var grid = new contrib.grid({ rows: 12, cols: 12, screen: screen })
var energy = 0;

var simulateBox = grid.set(6, 0, 6, 3, blessed.box, {
    label: 'Simulation',
    align: 'center',
    valign: 'middle'
});

module.exports = {
    initialize: function (bestFitnessOverGenerations, meanFitnessOverGenerations, bestSubjectsOverGenerations, map) {

        var fitnessLine = grid.set(0, 0, 6, 12, contrib.line,
            {
                showNthLabel: 5,
                label: 'Fitness over Generations',
                showLegend: true
            })

        var bestFitnessLog = grid.set(6, 6, 6, 3, contrib.log,
            {
                label: 'Best Subjects Fitness',
                height: "100%",
                tags: true,
                border: { type: "line", fg: "cyan" }
            });

        var meanFitnessLog = grid.set(6, 3, 6, 3, contrib.log,
            {
                label: 'Mean Fitness',
                height: "100%",
                tags: true,
                border: { type: "line", fg: "cyan" }
            });

        printableMap = "";
        for (var y = 0; y < map.length; y++) {
            for (var x = 0; x < map[0].length; x++) {
                if (map[y][x] == MAP.BLANK) {
                    printableMap += "   ";
                } else if (map[y][x] == MAP.END) {
                    printableMap += " F ";
                } else {
                    printableMap += "[#]";
                }
            }
            printableMap += "\n"
        }

        var mapBox = grid.set(6, 9, 6, 3, blessed.box, {
            label: 'Training Map',
            align: 'center',
            valign: 'middle',
            content: "" + printableMap
        })
        screen.append(mapBox);

        screen.append(bestFitnessLog);
        var i = 0
        var bestLogInterval = setInterval(function () {
            bestFitnessLog.log(
                "{blue-fg}Generation:{/blue-fg} " + i + " " +
                "{red-fg}Best Fitness:{/red-fg} " + bestFitnessOverGenerations[i] + "");
            i++;
            if (!bestFitnessOverGenerations[i]) {
                clearInterval(bestLogInterval);
            }
        }, 100);

        var j = 0
        var meanLogInterval = setInterval(function () {
            meanFitnessLog.log(
                "{blue-fg}Generation:{/blue-fg} " + j + " " +
                "{yellow-fg}Mean Fitness:{/yellow-fg} " + meanFitnessOverGenerations[j] + "");
            j++;
            if (!meanFitnessOverGenerations[j]) {
                clearInterval(meanLogInterval);
            }
        }, 100);

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

        screen.key(['escape', 'q', 'C-c'], function (ch, key) {
            return process.exit(0);
        });

        screen.on('resize', function () {
            fitnessLine.emit('attach');
            bestFitnessLog.emit('attach');
            meanFitnessLog.emit('attach');
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

        simulateBox.setContent(simulatedMap + "Movement: " + energy++ + "\nPosition: " + JSON.stringify(position));
        screen.render()
    }
}
