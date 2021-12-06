import * as fs from 'fs';

import { dirname } from 'path';
import { fileURLToPath } from 'url';

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
  return arr.filter(e => e === el).length;  
}

export function sum(arr) {
    return arr.reduce((acc, curr) => acc + curr, 0);  
}