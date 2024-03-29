const top = 0;
const parent = (i) => ((i + 1) >>> 1) - 1;
const left = (i) => (i << 1) + 1;
const right = (i) => (i + 1) << 1;

export class HeapQ {
    constructor(idFn, comparator = (a, b) => a > b) {
        this._heap = [];
        this._comparator = comparator;
        this._ids = new Set();
        this._id = idFn;
    }
    includes(value) {
        return this._ids.has(this._id(value));
    }
    size() {
        return this._heap.length;
    }
    empty() {
        return this.size() == 0;
    }
    peek() {
        return this._heap[top];
    }
    push(value) {
        this._ids.add(this._id(value));
        this._heap.push(value);
        this._siftUp();
        return this.size();
    }
    pop() {
        const poppedValue = this.peek();
        const bottom = this.size() - 1;
        if (bottom > top) {
            this._swap(top, bottom);
        }
        this._heap.pop();
        this._siftDown();
        this._ids.delete(this._id(poppedValue));
        return poppedValue;
    }
    replace(value) {
        const replacedValue = this.peek();
        this._heap[top] = value;
        this._siftDown();
        return replacedValue;
    }
    _greater(i, j) {
        return this._comparator(this._heap[i], this._heap[j]);
    }
    _swap(i, j) {
        [this._heap[i], this._heap[j]] = [this._heap[j], this._heap[i]];
    }
    _siftUp() {
        let node = this.size() - 1;
        while (node > top && this._greater(node, parent(node))) {
            this._swap(node, parent(node));
            node = parent(node);
        }
    }
    _siftDown() {
        let node = top;
        while (
            (left(node) < this.size() && this._greater(left(node), node)) ||
            (right(node) < this.size() && this._greater(right(node), node))
        ) {
            let maxChild =
                right(node) < this.size() && this._greater(right(node), left(node)) ? right(node) : left(node);
            this._swap(node, maxChild);
            node = maxChild;
        }
    }
}
