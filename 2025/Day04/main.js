import { getData, getPath } from '../lib/utils.js';

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/${process.argv[2] ?? 'puzzle_input'}`;

function parser(input) {
    return input.split('\n').map(row => row.split(''));
}

var data = getData(PUZZLE_INPUT_PATH)(parser);

var DIRS = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]]; // [dr, dc]

function accessibleRolls(state) {
    var ans = 0;
    var next = structuredClone(state);
    state.forEach((row, r) => row.forEach((_, c) => {
        if (state[r][c] === '@') {
            let adjRolls = DIRS.reduce((cnt, [dr, dc]) => {
                return state[r + dr] && state[r + dr][c + dc] === '@' ? cnt + 1 : cnt;
            }, 0);

            if (adjRolls < 4) {
                ans++;
                next[r][c] = '.';
            }
        }
    }));

    return [ans, next];
}

function removeRolls(state, acc = 0) {
    var [removed, next] = accessibleRolls(state);
    return removed === 0
        ? acc
        : removeRolls(next, acc + removed);
}

console.log('Part 1:', accessibleRolls(data)[0]);
console.log('Part 2:', removeRolls(data));
