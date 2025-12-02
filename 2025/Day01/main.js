import { getData, getPath } from '../lib/utils.js';

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/${process.argv[2] ?? 'puzzle_input'}`;

function parser(input) {
    return input.split('\n').map((str) => [str[0], Number(str.substring(1))]);
}

function P1([acc, pos], [dir, clicks]) {
    var newPos = dir === "R" ? (pos + clicks) % 100 : (pos - clicks + 100) % 100;
    return newPos === 0 ? [acc + 1, newPos] : [acc, newPos];
}

function P2([acc, pos], [dir, clicks]) {
    var laps = Math.floor(clicks / 100);
    var newPos = dir === "R" ? (pos + clicks) % 100 : (pos - (clicks - 100 * laps) + 100) % 100;

    if (pos !== 0 && newPos !== 0 && dir === "R" && newPos < pos) laps++;
    if (pos !== 0 && newPos !== 0 && dir === "L" && newPos > pos) laps++;
    if (newPos === 0) laps++;

    return [acc + laps, newPos];
}

var data = getData(PUZZLE_INPUT_PATH)(parser);

var [p1] = data.reduce(P1, [0, 50]);
var [p2] = data.reduce(P2, [0, 50]);

console.log('Part 1:', p1);
console.log('Part 2:', p2);

