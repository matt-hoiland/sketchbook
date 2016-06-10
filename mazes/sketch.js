var rows = 40;
var cols = 40;
var h = 600;
var w = 600;
var cell_h = h/rows;
var cell_w = w/cols;

var cells = [];
var cur = null;
var stack = [];

var generated = false;

function setup() {
    createCanvas(w, h);
    // frameRate(10);
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            cells.push(new Cell(i, j));
        }
    }
    cur = cells[0];
    cur.visited = true;
    // while(!generated) {
    //
    // }
}

function getIndex(i, j) {
    if (i < 0 || j < 0 || i >= rows || j >= cols) return undefined;
    return i * rows + j;
}

function draw() {
    background(51);
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            cells[getIndex(i,j)].show();
        }
    }
    if (cur) {
        fill(150);
        noStroke();
        rect(cur.j*cell_w, cur.i*cell_h, cell_w, cell_h);
        noFill();
    }

    if (!generated) {
        if (cur) {
            var n  = cur.getRandomNeighbor();
            if (n) {
                stack.push(cur);
                cur = n
                cur.visited = true;
            } else if (stack.length > 0) {
                cur = stack.pop();
            } else {
                generated = true;
            }
        }
    } else {
        if (cur.i == rows - 1 && cur.j == cols -1) {
            cur.path = true;
            for  (var i = 0; i < stack.length; i++) {
                stack[i].path = true;
            }
        } else {
            var next = cur.getValidNeighbor();
            if (next) {
                stack.push(cur);
                cur = next;
                cur.exploring = true;
            } else {
                cur.dead_end = true;
                cur = stack.pop();
            }
        }
    }
}

function Cell(i, j) {
    this.i = i;
    this.j = j;
    this.visited = false;
    this.path = false;
    this.exploring = false;
    this.dead_end = false;
    this.walls = [true, true, true, true]
    this.marks = [false, false, false, false]

    this.show = function() {
        if (this.path) {
            fill(0,150,0);
        } else if (this.dead_end) {
            fill(150,0,0);
        } else if (this.exploring){
            fill(0,0,150);
        } else if (this.visited) {
            fill(150,0,150);
        } else {
            noFill();
        }
        noStroke();
        rect(this.j*cell_w, this.i*cell_h, cell_w, cell_h);
        stroke(255);
        if (this.walls[0]) {
            // stroke(255,0,0);
            this.drawLine(1,0, 0,0);
        }
        if (this.walls[1]) {
            // stroke(0,255,0);
            this.drawLine(1,1, 1,0);
        }
        if (this.walls[2]) {
            // stroke(0,0,255);
            this.drawLine(0,1, 1,1);
        }
        if (this.walls[3]) {
            // stroke(255);
            this.drawLine(0,0, 0,1);
        }
    }

    this.drawLine = function(xo, yo, x, y) {
        line((this.j + xo) * cell_w, (this.i + yo) * cell_h,
             (this.j +  x) * cell_w, (this.i +  y) * cell_h);
    }

    this.getRandomNeighbor = function() {
        var ns = [[0,1], [0,-1],[1,0],[-1,0]];
        var neighbors = []
        for (var i = 0; i < ns.length; i++) {
            var c = ns[i];
            var n = cells[getIndex(this.i + c[0], this.j + c[1])];
            if (n && !n.visited) {
                neighbors.push(n);
            }
        }
        if (neighbors.length > 0) {
            var neighbor = neighbors[floor(random(0,neighbors.length))];
            if (neighbor.i - this.i == -1) {
                this.walls[0] = false;
                neighbor.walls[2] = false;
            }
            if (neighbor.i - this.i == 1) {
                this.walls[2] = false;
                neighbor.walls[0] = false;
            }
            if (neighbor.j - this.j == -1) {
                this.walls[3] = false;
                neighbor.walls[1] = false;
            }
            if (neighbor.j - this.j == 1) {
                this.walls[1] = false;
                neighbor.walls[3] = false;
            }
            return neighbor;
        } else {
            return undefined;
        }
    }

    this.getValidNeighbor = function() {
        this.exploring = true;
        if (!this.walls[0] && !this.marks[0]) {
            this.marks[0] = true;
            var n = cells[getIndex(this.i - 1, this.j)];
            if (n && !n.exploring) return n;
        }
        if (!this.walls[1] && !this.marks[1]) {
            this.marks[1] = true;
            var n = cells[getIndex(this.i, this.j + 1)];
            if (n && !n.exploring) return n;
        }
        if (!this.walls[2] && !this.marks[2]) {
            this.marks[2] = true;
            var n = cells[getIndex(this.i + 1, this.j)];
            if (n && !n.exploring) return n;
        }
        if (!this.walls[3] && !this.marks[3]) {
            this.marks[3] = true;
            var n = cells[getIndex(this.i, this.j - 1)];
            if (n && !n.exploring) return n;
        }
        return undefined;
    }
}
