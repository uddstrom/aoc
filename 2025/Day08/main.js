import { getData, getPath, min } from '../lib/utils.js';

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/${process.argv[2] ?? 'puzzle_input'}`;

function parser(input) {
    return input.split('\n').map(row => row.split(',').map(Number));
}

function straitLineDistance([x1, y1, z1], [x2, y2, z2]) {
    return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2 + (z1 - z2) ** 2);
}

function connect(p, q) {
    if (C.some(c => c.has(p) && c.has(q))) return;

    var cp = C.findIndex(c => c.has(p));
    var cq = C.findIndex(c => c.has(q));

    if (cp >= 0 && cq >= 0) {
        let c_merged = new Set([...C[cp], ...C[cq]]);
        if (cp > cq) {
            C.splice(cp, 1);
            C.splice(cq, 1);
        } else {
            C.splice(cq, 1);
            C.splice(cp, 1);
        }
        C.push(c_merged);
    } else if (cp >= 0) {
        C[cp].add(q);
    } else if (cq >= 0) {
        C[cq].add(p);
    } else {
        C.push(new Set([p, q]));
    }
}

var data = getData(PUZZLE_INPUT_PATH)(parser);
var D = new Map(); // map with distances
var C = []; // set of circuites

// calculate distances
data.forEach((p, i) => {
    D.set(i, data.map((q) => straitLineDistance(p, q)));
});
D.forEach((value, key) => C.push(new Set([key])));

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
        let p1 = C.slice(0, 3).reduce((acc, curr) => acc * curr.size, 1);
        console.log('Part 1:', p1);
    }
}

var [px, py, pz] = data[pp];
var [qx, qy, qz] = data[qq];

console.log('Part 2:', px * qx);

