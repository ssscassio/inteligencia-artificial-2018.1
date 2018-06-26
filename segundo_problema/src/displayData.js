var blessed = require('blessed');
var contrib = require('blessed-contrib');
var screen = blessed.screen();
const MAP = { BLANK: 0, WALL: 1, END: 2, OUT_RANGE: 3 };

module.exports = function (bestFitnessOverGenerations, meanFitnessOverGenerations, bestSubjectsOverGenerations, map) {
    var grid = new contrib.grid({ rows: 12, cols: 12, screen: screen })

    var fitnessLine = grid.set(0, 0, 6, 6, contrib.line,
        {
            showNthLabel: 5,
            label: 'Fitness over Generations',
            showLegend: true
        })

    var fitnessLog = grid.set(0, 6, 6, 3, contrib.log,
        {
            label: 'Best Subjects Fitness',
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

    var mapBox = grid.set(0, 9, 6, 3, blessed.box, {
        label: 'Trained Map',
        align: 'center',
        valign: 'middle',
        content: "" + printableMap
    })
    screen.append(mapBox);


    screen.append(fitnessLog);
    var i = 0
    var logInterval = setInterval(function () {
        fitnessLog.log(
            "Generation: {blue-fg}" + i + "{/blue-fg} " +
            "Fitness: {red-fg}" + bestSubjectsOverGenerations[i].fitness + "{/red-fg}");
        i++;
        if (!bestSubjectsOverGenerations[i]) {
            clearInterval(logInterval);
        }
    }, 100);

    var meanFitnessData = {
        title: 'Mean Fitness',
        style: { line: 'blue' },
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
        fitnessLog.emit('attach');
        fitnessLine.setData([meanFitnessData, bestFitnessData]);
    });

    screen.render()
}
