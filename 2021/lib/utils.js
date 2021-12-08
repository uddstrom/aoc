import * as fs from 'fs';

import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { not } from './fn.js';

export function getData(path) {
    var contents = fs.readFileSync(path, 'utf8');
    return function parseContent(parser) {
        return parser(contents);
    };
}

export function getPath(url) {
    return dirname(fileURLToPath(url));
}

// fills an array with numbers values from start to end
export function range(start, end) {
    if (start > end) {
        return Array(start - end + 1)
            .fill()
            .map((_, idx) => start - idx);
    }
    return Array(end - start + 1)
        .fill()
        .map((_, idx) => start + idx);
}

export function count(el, arr) {
    return arr.filter((e) => e === el).length;
}

export function min(arr) {
    return Math.min(...arr);
}

export function max(arr) {
    return Math.max(...arr);
}

export function sum(arr) {
    return arr.reduce((acc, curr) => acc + curr, 0);
}

export function isOdd(n) {
    return n % 2 === 1;
}

export var isEven = not(isOdd);

// Generate all permutations of an array A,
// stores them in the set S and returns S.
export function generatePermutations(array) {
    function swap(arr, i, j) {
        var b = arr[j];
        arr[j] = arr[i];
        arr[i] = b;
    }

    function recursiveHeap(k, A, S) {
        if (k === 1) {
            S.add(A.join(''));
        } else {
            recursiveHeap(k - 1, A, S);
            for (var i = 0; i < k - 1; i++) {
                if (isEven(k)) swap(A, i, k - 1);
                else swap(A, 0, k - 1);
                recursiveHeap(k - 1, A, S);
            }
        }
    }
    let S = new Set();
    recursiveHeap(array.length, array.slice(), S);
    return S;
}
