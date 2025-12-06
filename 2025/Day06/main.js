import { getData, getPath, product, sum } from '../lib/utils.js';

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/${process.argv[2] ?? 'puzzle_input'}`;

function P1() {
    var multiply = (N, i) => N.reduce((acc, curr) => acc * curr[i], 1);
    var add = (N, i) => N.reduce((acc, curr) => acc + curr[i], 0);

    function parser(input) {
        var rows = input.split('\n');
        var OPs = rows.pop().split(' ').filter(w => w.length > 0);
        var N = rows.map(row => row.split(' ').filter(w => w.length > 0).map(Number));
        return [N, OPs];
    }

    var [N, OPs] = getData(PUZZLE_INPUT_PATH)(parser);
    return sum(OPs.map((op, i) => op === '*' ? multiply(N, i) : add(N, i)));
}

function P2() {

    function parser(input) {
        var problems = [];
        var rows = input.split('\n');
        let op = '';
        let numbers = [];
        for (var i = 0; i < rows[0].length; i++) {
            if (rows[4].charAt(i) === '*' || rows[4].charAt(i) === '+') {
                // new problem
                problems.push([op, numbers]);
                op = rows[4].charAt(i);
                numbers = [];
            }
            var nStr = `${rows[0].charAt(i)}${rows[1].charAt(i)}${rows[2].charAt(i)}${rows[3].charAt(i)}`.trim();
            if (nStr.length > 0) numbers.push(Number(nStr));
        }
        problems.push([op, numbers]);
        return problems.slice(1);
    }

    var data = getData(PUZZLE_INPUT_PATH)(parser);

    return sum(data.map(([op, numbers]) => op === '*' ? product(numbers) : sum(numbers)));
}

console.log('Part 1:', P1());
console.log('Part 2:', P2());
