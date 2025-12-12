// #raycasting #intersecting line segments
import { getData, getPath, isOdd, max } from '../lib/utils.js';

var PUZZLE_INPUT_PATH = `${getPath(import.meta.url)}/${process.argv[2] ?? 'puzzle_input'}`;

function parser(input) {
    return input.split('\n').map(row => row.split(',').map(Number));
}

function onLine(xp, yp, x1, y1, x2, y2) {
    return (xp === x1 && xp === x2 && (yp <= y1 !== yp <= y2)) ||
        (yp === y1 && yp === y2 && (xp <= x1 !== xp <= x2));
}

function findLargestArea(polygon, rectangles) {
    function isInsidePolygon([xp, yp]) {
        var cnt = 0;
        var online = false;
        polygon.forEach(([[x1, y1], [x2, y2]]) => {
            online = online || onLine(xp, yp, x1, y1, x2, y2);
            if (
                (yp < y1) !== (yp < y2) &&
                (xp < (x1 + ((yp - y1) / (y2 - y1)) * (x2 - x1)))
            ) {
                cnt++;
            }
        });
        return isOdd(cnt) || online;
    }

    function doesNotIntersect([[x1, y1], [x2, y2]]) {
        for (let [[x3, y3], [x4, y4]] of polygon) {
            if (!((y1 <= y3 && y2 <= y3 && y1 <= y4 && y2 <= y4) ||
                (y3 <= y1 && y3 <= y2 && y4 <= y1 && y4 <= y2) ||
                (x1 <= x3 && x2 <= x3 && x1 <= x4 && x2 <= x4) ||
                (x3 <= x1 && x3 <= x2 && x4 <= x1 && x4 <= x2))) {
                return false;
            }
        }
        return true;
    }

    while (rectangles.length > 0) {
        let [[x1, y1], [x2, y2], area] = rectangles.pop();
        let corners = [[x1, y1], [x1, y2], [x2, y2], [x2, y1]];
        let edges = [
            [corners[0], corners[1]],
            [corners[1], corners[2]],
            [corners[2], corners[3]],
            [corners[3], corners[0]]
        ];

        if (corners.every(isInsidePolygon) && edges.every(doesNotIntersect)) {
            return area;
        }
    }
}

var data = getData(PUZZLE_INPUT_PATH)(parser);
var p1 = max(data.map(([x1, y1]) => max(data.map(([x2, y2]) => (Math.abs(x2 - x1) + 1) * (Math.abs(y2 - y1) + 1)))));

var polygon = data.map((p, i) => i + 1 >= data.length ? [p, data[0]] : [p, data[i + 1]]);

// candidates sorted largest to smallest
var rectangles = data
    .flatMap(([x1, y1]) => data.map(([x2, y2]) => [[x1, y1], [x2, y2], (Math.abs(x2 - x1) + 1) * (Math.abs(y2 - y1) + 1)]))
    .sort(([p1, q1, a1], [p2, q2, a2]) => a1 - a2);

console.log('Part 1:', p1);
console.log('Part 2:', findLargestArea(polygon, rectangles));

