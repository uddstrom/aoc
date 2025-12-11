import { getData, getPath, min, product } from '../lib/utils.js';

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/${process.argv[2] ?? 'puzzle_input'}`;

function parser(input) {
    return input.split('\n').map(row => row.split(',').map(Number));
}

function straitLineDistance([x1, y1, z1], [x2, y2, z2]) {
    return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2 + (z1 - z2) ** 2);
}

function connect(p, q) {
    if (C.some(c => c.has(p) && c.has(q))) return;

    var cp = C.find(c => c.has(p));
    var cq = C.find(c => c.has(q));

    if (cp && cq) {
        let c_merged = new Set([...cp, ...cq]);
        C = [...C.filter(c => !(c.has(p) || c.has(q))), c_merged];
    } else if (cp) {
        cp.add(q);
    } else if (cq) {
        cq.add(p);
    } else {
        C.push(new Set([p, q]));
    }
}

var data = getData(PUZZLE_INPUT_PATH)(parser);
var D = new Map(data.map((p, i) => [i, data.map((q) => straitLineDistance(p, q))]));
var C = [...D.keys()].map((_, key) => new Set([key])); // set of circuites

var prev = 0;
var cnt = 0;
let pp;
let qq;
while (C.length > 1) {
    let shortest_distance = Number.MAX_SAFE_INTEGER;
    D.forEach((distances, p) => {
        let d = min(distances.filter(d => d > prev));
        if (d > prev && d < shortest_distance) {
            shortest_distance = d;
            pp = p;
            qq = distances.indexOf(d);
        }
    });
    prev = shortest_distance;
    connect(pp, qq);
    cnt++;
    if (cnt === 1000) {
        C.sort((a, b) => b.size - a.size);
        console.log('Part 1:', product(C.slice(0, 3).map(s => s.size)));
    }
}

var [px] = data[pp];
var [qx] = data[qq];

console.log('Part 2:', px * qx);

