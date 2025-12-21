import { getData, getPath } from '../lib/utils.js';

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/${process.argv[2] ?? 'puzzle_input'}`;

function parser(input) {
    return new Map(input.split('\n').map(row => {
        var [from, to] = row.split(': ');
        return [from, to.split(' ')];
    }));
}

var G = getData(PUZZLE_INPUT_PATH)(parser);

function search(v, DP = new Map(), seen_dac = false, seen_fft = false, p2 = false) {
    if (v === 'out') return (seen_dac && seen_fft) || !p2 ? 1 : 0;

    var state = `${v},${seen_dac},${seen_fft}`;
    if (DP.has(state)) return DP.get(state);

    var paths = 0;
    G.get(v)?.forEach(w => paths += search(w, DP, w === 'dac' || seen_dac, w === 'fft' || seen_fft, p2));
    DP.set(state, paths);

    return paths;
}

console.log('Part 1:', search('you'));
console.log('Part 2:', search('svr', new Map(), false, false, true));

