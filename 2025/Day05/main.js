import { getData, getPath, sum } from '../lib/utils.js';

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/${process.argv[2] ?? 'puzzle_input'}`;

function parser(input) {
    var [ranges, ids] = input.split('\n\n');
    var R = ranges.split('\n').map(r => r.split('-').map(Number));
    var IDs = ids.split('\n').map(Number);
    return [R, IDs];
}

var inRange = (id, [min, max]) => id >= min && id <= max;

var [R, IDs] = getData(PUZZLE_INPUT_PATH)(parser);

var p1 = IDs.reduce((cnt, id) => {
    for (let r of R) {
        if (inRange(id, r)) return cnt + 1;
    }
    return cnt;
}, 0);

// sort R by length, largest first
R.sort(([amin, amax], [bmin, bmax]) => (bmax - bmin) - (amax - amin));

var p2 = sum(R.map(([MIN, MAX], i) => {
    var adjMin = MIN;
    var adjMax = MAX;
    for (let j = 0; j < i; j++) {
        let [min, max] = R[j];
        if (adjMin > max) continue; // no overlap
        if (adjMax < min) continue; // no overlap
        if (adjMin >= min && adjMax <= max) return 0; // subset
        if (adjMin < min) adjMax = min - 1; // lower intersect
        if (adjMax > max) adjMin = max + 1; // upper intersect
    }
    return adjMax - adjMin + 1;
}));

console.log('Part 1:', p1);
console.log('Part 2:', p2);

