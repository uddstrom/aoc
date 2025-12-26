import { column, index, matrix, min, multiply, range, setCartesian, size, subset, subtract } from 'mathjs';
import { rng } from './utils.js';

function constraint(x, A, b) {
    var col = column(matrix(A), x)._data.flat();
    var vals = col.map((v, i) => v === 0 ? Number.MAX_SAFE_INTEGER : b[i]);
    var max = min(...vals) + 1;
    return rng(max).map(i => ({ x, i }));
}

export function rref(A, b) {

    var M = b ? augment(A, b) : structuredClone(A);

    var rows = A.length;
    var cols = b ? A[0].length : M[0].length;

    var current_row_idx = 0;
    var non_pivot_columns = [];

    // 1. iterate over colums starting from left
    for (let c = 0; c < cols; c++) {

        // 2a. select pivot row
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

        // 2b. swap pivot row and current row
        if (current_row_idx !== pivot_row_idx) {
            [M[current_row_idx], M[pivot_row_idx]] = [M[pivot_row_idx], M[current_row_idx]];
        }

        // 3. Scale pivot row with pivot value.
        let pivot_value = M[current_row_idx][c];
        M[current_row_idx] = M[current_row_idx].map((val) => {
            var scaledVal = val / pivot_value;
            // console.log('scaling...', val, pivot_value, scaledVal);
            return scaledVal;
        });

        // 4. Eliminate values below and above pivot.
        for (let r = 0; r < rows; r++) {
            if (r === current_row_idx) {
                continue;
            }
            let lead_coefficient = M[r][c];
            M[r] = subtract(M[r], multiply(M[current_row_idx], lead_coefficient));
        }

        // 5. move to next column.
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

export function augment(A, x) {
    var [r, _] = size(matrix(A));
    var [rr, _] = size(matrix(x));
    if (r !== rr) throw new Error('sizes dont match');
    return A.map((row, i) => [...row, x[i]]);
}

// freeVars = map with key = variable index and value = variable value 
function backSubstitute(U, b, freeVars) {
    // console.log('backtracking', U, b, freeVars);
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
    // console.log('backsub solution', solution);
    return solution;
}

export function solve(A, b) {

    // console.log('Solving');
    // console.table(augment(A, b));

    var [U, nonPivots, bb] = rref(A, b);

    // console.table(augment(U, bb));
    // console.log(nonPivots);

    var freeVariableConstraints = nonPivots.map(x => constraint(x, A, b));

    // console.log(freeVariableConstraints);

    // if (freeVariableConstraints.length > 2) throw new Error("Too many free variables");

    var combinations = combine(...freeVariableConstraints)
    // console.log('combinations', combinations);
    var solutions = combinations.map((combo) => {
        var map = new Map(combo.map(({ x, i }) => [x, i]));
        // console.log(map);
        return backSubstitute(U, bb, map)
    });

    // console.log('Solutions', solutions);
    return solutions.filter(sln => sln.every(v => {
        // console.log(v);
        // return Number.isInteger(v) && v >= 0;
        return Math.abs(Math.round(v) - v) < 0.00001 && v >= -0.00001;
        //return v >= 0;
    }));
}

function combine(a, b, ...rest) {
    var combo = (a, b) => a.flatMap(el_a => b.map(el_b => Array.isArray(el_a) ? [...el_a, el_b] : [el_a, el_b]));
    if (!a) return [[]];
    if (a && !b) return a.map(el => [el]);
    if (rest.length === 0) return combo(a, b);
    return combine(combo(a, b), ...rest);
}

