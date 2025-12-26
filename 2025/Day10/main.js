import { getData, getPath, matrix, min, sum } from '../lib/utils.js';
import { solve, augment } from '../lib/linAlg.js';

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/${process.argv[2] ?? 'puzzle_input'}`;

function parser(input) {
    return input.split('\n').map(line => {
        let indicators = line.slice(1, line.indexOf(']'))
            .split('').map(char => char === '#' ? 1 : 0);
        let buttons = line.slice(line.indexOf(']') + 2, line.indexOf('{') - 1)
            .split(' ').map(btn => btn.slice(1, -1).split(',').map(Number));
        let joltages = line.slice(line.indexOf('{') + 1, line.indexOf('}'))
            .split(',').map(Number);

        return {
            indicators,
            buttons,
            joltages
        };
    });
}

function p1({ indicators: goal, buttons }) {
    var SEEN = new Set();
    var Q = [];
    Q.push({ path: [], indicators: [...goal].map(_ => 0) });
    while (Q.length > 0) {
        let v = Q.shift();
        if (v.indicators.toString() === goal.toString()) return v.path.length;

        buttons.map(btn => ({
            path: [btn, ...v.path],
            indicators: v.indicators.map((val, idx) => btn.some(i => i === idx) ? (val + 1) % 2 : val)
        })).forEach(w => {
            if (!SEEN.has(w.indicators.toString())) {
                SEEN.add(w.indicators.toString());
                Q.push(w);
            }
        });
    }
}

function p2({ joltages, buttons }) {
    var rows = joltages.length;
    var cols = buttons.length;

    var A = matrix(rows, cols, 0);

    buttons.forEach((btn, i) => btn.forEach((j) => A[j][i] = 1));
    // console.table(A);

    // var A = [
    //     [0, 0, 0, 0, 1, 1],
    //     [0, 1, 0, 0, 0, 1],
    //     [0, 0, 1, 1, 1, 0],
    //     [1, 1, 0, 1, 0, 0],
    // ]
    // var b = [3, 5, 4, 7];

    // console.log('Solving');
    // console.table(A, joltages);

    var solutions = solve(A, joltages);
    if (solutions.length === 0) {
        console.log('No Solutions', solutions);
        console.table(augment(A, joltages));
    }

    var minimum = min(solutions.map(sum));

    return minimum;
}

var data = getData(PUZZLE_INPUT_PATH)(parser);

console.log('Part 1:', sum(data.map(p1)));
console.log('Part 2:', sum(data.map(p2)));

