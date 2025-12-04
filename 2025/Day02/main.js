import { getData, getPath, isEven, sum } from '../lib/utils.js';

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/${process.argv[2] ?? 'puzzle_input'}`;

function parser(input) {
    return input.split(',').map(range => range.split('-').map(Number));
}

function isInvalidFast(str) {
    var n1 = str.substring(0, str.length / 2);
    var n2 = str.substring(str.length / 2);
    return n1 === n2;
}

function isInvalid(word, windowSize) {
    if (word.length === 1) {
        return false;
    }
    var pattern = word.substring(0, windowSize);
    var w = word.substring(windowSize);
    while (w.length >= windowSize) {
        if (w.substring(0, windowSize) !== pattern) {
            return false;
        }
        w = w.substring(windowSize);
    }
    return w.length === 0;
}

var data = getData(PUZZLE_INPUT_PATH)(parser);

var p1 = [];
data.forEach(([min, max]) => {
    for (let i = min; i <= max; i++) {
        let str = i.toString();
        if (isInvalid(str, str.length / 2)) p1.push(i);
    }
});

console.log('Part 1:', sum(p1));

var p2 = [];
data.forEach(([min, max]) => {
    for (let i = min; i <= max; i++) {
        let str = `${i}`;
        for (let w = Math.floor(str.length/2); w > 0; w--) {
            if (isInvalid(str, w)) {
                p2.push(i);
                break;
            }
        }
    }
});

console.log('Part 2:', sum(p2));

