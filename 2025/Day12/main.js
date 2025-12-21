import { getData, getPath, count, sum } from '../lib/utils.js';

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/${process.argv[2] ?? 'puzzle_input'}`;

function parser(input) {
    var data = input.split('\n\n');

    var regions = data.pop().split('\n').map(row => {
        var region_parts = row.split(' ');
        var w = Number(region_parts[0].slice(0, -1).split('x')[0]);
        var l = Number(region_parts[0].slice(0, -1).split('x')[1]);
        var presents = region_parts.slice(1).map(Number);
        return { w, l, presents };
    });

    var shapes = data.map(present => count('#', present.split('')));

    return { shapes, regions };
}

var { shapes, regions } = getData(PUZZLE_INPUT_PATH)(parser);

// counts
var possible = 0;
var impossible = 0;
var unknown = 0;

regions.forEach(({ w, l, presents }) => {
    var total_number_of_presentes = sum(presents);
    var number_of_three_by_three_squares = Math.floor(w / 3) * Math.floor(l / 3);
    var total_space_available = w * l;
    let total_space_needed = presents.reduce((acc, curr, idx) => acc + curr * shapes[idx], 0);

    // Check if it would fit if present takes up full 3x3.
    if (total_number_of_presentes <= number_of_three_by_three_squares) possible++;
    // Is it impossible due to more # than space?
    else if (total_space_needed > total_space_available) impossible++;
    else unknown++; // dont know...
});

console.log('Part 1:', possible, impossible, unknown);

