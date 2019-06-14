import * as p5 from 'p5';
import { CANVAS_SIZE } from '../dimensions';

export namespace Mazes {

  export function initSketch(p: p5): void {

    let rows = 40;
    let cols = 40;
    let h = CANVAS_SIZE.DEFAULT;
    let w = CANVAS_SIZE.DEFAULT;
    let cell_h = h / rows;
    let cell_w = w / cols;

    let cells = [];
    let cur = null;
    let stack = [];

    let visited_color: p5.Color;    // purple
    let exploring_color: p5.Color;  // blue
    let dead_end_color: p5.Color;   // red
    let path_color: p5.Color;       // green

    let generated = false;

    p.setup = function() {
      p.createCanvas(w, h);
      // frameRate(5);
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          cells.push(new Cell(i, j));
        }
      }
      cur = cells[0];
      cur.visited = true;
      while (!generated) {
        if (cur) {
          let n = cur.getRandomNeighbor();
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
      }
      visited_color = p.color('#333');
      exploring_color = p.color('#448');
      dead_end_color = p.color('#844');
      path_color = p.color('#484');
    }

    function getIndex(i: number, j: number): number {
      if (i < 0 || j < 0 || i >= rows || j >= cols) return undefined;
      return i * rows + j;
    }

    p.draw = function() {
      p.background(51);
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          cells[getIndex(i, j)].show();
        }
      }
      if (cur) {
        p.fill(150);
        p.noStroke();
        p.rect(cur.j * cell_w, cur.i * cell_h, cell_w, cell_h);
        p.noFill();
      }

      if (!generated) {
        if (cur) {
          let n = cur.getRandomNeighbor();
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
        if (cur.i == rows - 1 && cur.j == cols - 1) {
          cur.path = true;
          for (let i = 0; i < stack.length; i++) {
            stack[i].path = true;
          }
        } else {
          let next = cur.getValidNeighbor();
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

    function Cell(i: number, j: number) {
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
          p.fill(path_color);
        } else if (this.dead_end) {
          p.fill(dead_end_color);
        } else if (this.exploring) {
          p.fill(exploring_color);
        } else if (this.visited) {
          p.fill(visited_color);
        } else {
          p.noFill();
        }
        p.noStroke();
        p.rect(this.j * cell_w, this.i * cell_h, cell_w, cell_h);
        p.stroke(255);
        if (this.walls[0]) {
          // stroke(255,0,0);
          this.drawLine(1, 0, 0, 0);
        }
        if (this.walls[1]) {
          // stroke(0,255,0);
          this.drawLine(1, 1, 1, 0);
        }
        if (this.walls[2]) {
          // stroke(0,0,255);
          this.drawLine(0, 1, 1, 1);
        }
        if (this.walls[3]) {
          // stroke(255);
          this.drawLine(0, 0, 0, 1);
        }
      }

      this.drawLine = function(xo: number, yo: number, x: number, y: number) {
        p.line((this.j + xo) * cell_w, (this.i + yo) * cell_h,
          (this.j + x) * cell_w, (this.i + y) * cell_h);
      }

      this.getRandomNeighbor = function() {
        let ns = [[0, 1], [0, -1], [1, 0], [-1, 0]];
        let neighbors = []
        for (let i = 0; i < ns.length; i++) {
          let c = ns[i];
          let n = cells[getIndex(this.i + c[0], this.j + c[1])];
          if (n && !n.visited) {
            neighbors.push(n);
          }
        }
        if (neighbors.length > 0) {
          let neighbor = neighbors[p.floor(p.random(0, neighbors.length))];
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

        if (!this.walls[1] && !this.marks[1]) {
          this.marks[1] = true;
          let n = cells[getIndex(this.i, this.j + 1)];
          if (n && !n.exploring) return n;
        }
        if (!this.walls[3] && !this.marks[3]) {
          this.marks[3] = true;
          let n = cells[getIndex(this.i, this.j - 1)];
          if (n && !n.exploring) return n;
        }
        if (!this.walls[2] && !this.marks[2]) {
          this.marks[2] = true;
          let n = cells[getIndex(this.i + 1, this.j)];
          if (n && !n.exploring) return n;
        }
        if (!this.walls[0] && !this.marks[0]) {
          this.marks[0] = true;
          let n = cells[getIndex(this.i - 1, this.j)];
          if (n && !n.exploring) return n;
        }
        return undefined;
      }

      this.getNeighbor = function(dir: 'ArrowUp' | 'ArrowLeft' | 'ArrowDown' | 'ArrowRight') {
        this.exploring = true;

        if (dir === "ArrowRight" && !this.walls[1] && !this.marks[1]) {
          this.marks[1] = true;
          let n = cells[getIndex(this.i, this.j + 1)];
          if (n && !n.exploring) return n;
        } else if (dir === "ArrowLeft" && !this.walls[3] && !this.marks[3]) {
          this.marks[3] = true;
          let n = cells[getIndex(this.i, this.j - 1)];
          if (n && !n.exploring) return n;
        } else if (!this.walls[2] && !this.marks[2]) {
          this.marks[2] = true;
          let n = cells[getIndex(this.i + 1, this.j)];
          if (n && !n.exploring) return n;
        } else if (!this.walls[0] && !this.marks[0]) {
          this.marks[0] = true;
          let n = cells[getIndex(this.i - 1, this.j)];
          if (n && !n.exploring) return n;
        }
        return undefined;
      }
    }
  }
}
