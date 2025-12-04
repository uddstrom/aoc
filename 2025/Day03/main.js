import { getData, getPath, sum } from '../lib/utils.js';

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/${process.argv[2] ?? 'puzzle_input'}`;

function parser(input) {
    return input.split('\n').map(row => row.split('').map(Number));
}

function findLargestJoltage(nums, length, max = []) {
    if (length === 0) return Number(max.join(''));

    var m = 0;
    var index_of_m = 0;
    for (let i = 0; i <= nums.length - length; i++) {
        if (nums[i] > m) {
            m = nums[i];
            index_of_m = i;
        }
    }

    return findLargestJoltage(nums.slice(index_of_m + 1), length - 1, [...max, m]);
}

var data = getData(PUZZLE_INPUT_PATH)(parser);

console.log('Part 1:', sum(data.map(nums => findLargestJoltage(nums, 2))));
console.log('Part 2:', sum(data.map(nums => findLargestJoltage(nums, 12))));

