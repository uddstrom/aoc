import { column, index, matrix, min, multiply, range, size, subset, subtract } from 'mathjs';
import { rng } from '../lib/utils.js';

// Solves Ax = b
export function solve(A, b) {
    var [U, nonPivots, bb] = rref(A, b);
    var freeVariableConstraints = nonPivots.map(x => constraint(x, A, b));
    var combinations = combine(...freeVariableConstraints)

    var solutions = combinations.map((combo) => {
        var freeVarsMap = new Map(combo.map(({ x, i }) => [x, i]));
        return backSubstitute(U, bb, freeVarsMap)
    });

    return solutions.filter(sln => sln.every(v => {
        // WTF!? JavaScript and numbers...
        return Math.abs(Math.round(v) - v) < 0.00001 && v >= -0.00001;
    }));
}

// Calculates reduced row echelon form for a matrix A
// augmented with output vector b.
function rref(A, b) {

    var M = augment(A, b);

    var rows = A.length;
    var cols = b ? A[0].length : M[0].length;

    var current_row_idx = 0;
    var non_pivot_columns = [];

    // 1. iterate over colums starting from left
    for (let c = 0; c < cols; c++) {

        // 2. select pivot row
        let pivot_row_idx = -1;
        for (let r = current_row_idx; r < rows; r++) {
            if (M[r][c] !== 0) {
                pivot_row_idx = r;
                break;
            }
        }
        if (pivot_row_idx === -1) {
            non_pivot_columns.push(c);
            continue;
        }

        // 3. swap pivot row and current row
        if (current_row_idx !== pivot_row_idx) {
            [M[current_row_idx], M[pivot_row_idx]] = [M[pivot_row_idx], M[current_row_idx]];
        }

        // 4. scale pivot row with pivot value.
        let pivot_value = M[current_row_idx][c];
        M[current_row_idx] = M[current_row_idx].map((val) => val / pivot_value);

        // 5. eliminate values below and above pivot.
        for (let r = 0; r < rows; r++) {
            if (r === current_row_idx) continue;
            let lead_coefficient = M[r][c];
            M[r] = subtract(M[r], multiply(M[current_row_idx], lead_coefficient));
        }

        // 6. move to next column.
        current_row_idx++;
    }

    return b
        ? [
            subset(matrix(M), index(range(0, rows), range(0, cols)))._data,
            non_pivot_columns,
            column(matrix(M), cols)._data.flat()
        ]
        : [M, non_pivot_columns];
}

function constraint(x, A, b) {
    var col = column(matrix(A), x)._data.flat();
    var vals = col.map((v, i) => v === 0 ? Number.MAX_SAFE_INTEGER : b[i]);
    var max = min(...vals) + 1;
    return rng(max).map(i => ({ x, i }));
}

function augment(A, x) {
    var [r, _] = size(matrix(A));
    var [rr, _] = size(matrix(x));
    if (r !== rr) throw new Error('sizes dont match');
    return A.map((row, i) => [...row, x[i]]);
}

function backSubstitute(U, b, freeVars) {
    // freeVars = map with key = variable index and value = variable value 
    var U_reversed = U.toReversed();
    var b_reversed = b.toReversed();
    var n = U[0].length; // number of variables
    var solution = Array(n).fill(0);

    freeVars.forEach((value, key) => solution[key] = value);

    U_reversed.forEach((eq, idx) => {
        var var_index = eq.indexOf(1);
        if (var_index >= 0) {
            var ans = b_reversed[idx] - eq.reduce((acc, curr, i) => i === var_index ? acc : acc + curr * solution[i], 0);
            solution[var_index] = ans;
        }
    });

    return solution;
}

function combine(a, b, ...rest) {
    var combo = (a, b) => a.flatMap(el_a => b.map(el_b => Array.isArray(el_a) ? [...el_a, el_b] : [el_a, el_b]));
    if (!a) return [[]];
    if (a && !b) return a.map(el => [el]);
    if (rest.length === 0) return combo(a, b);
    return combine(combo(a, b), ...rest);
}

