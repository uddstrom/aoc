import { getData, getPath, sum } from '../lib/utils.js';

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/${process.argv[2] ?? 'puzzle_input'}`;

function parser(input) {
    return input.split('\n')
        .map(row => row.split('').map(col => col === '.' ? 0 : col === 'S' ? 1 : col));
}

var grid = getData(PUZZLE_INPUT_PATH)(parser);

var p1 = 0;
grid.forEach((row, r) => {
    row.forEach((col, c) => {
        let prev = grid[r - 1] && grid[r - 1][c];
        if (col >= 0 && prev > 0) grid[r][c] += prev;
        if (col === '^' && prev > 0) {
            grid[r][c - 1] += prev;
            grid[r][c + 1] += prev;
            p1++;
        }
    });
});
var p2 = sum(grid[grid.length - 1]);

console.log('Part 1:', p1);
console.log('Part 2:', p2);
