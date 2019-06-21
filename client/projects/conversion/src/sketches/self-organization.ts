import * as p5 from 'p5';
import { CANVAS_SIZE } from '../dimensions';

export namespace SelfOrganization {
  export function initSketch(p: p5): void {
    const CNV_SIZE = CANVAS_SIZE.DEFAULT;
    const CNUM = CNV_SIZE/2;
    const BG = '#ff8888';
    const A = '#aaaaff';
    const B = '#aaffaa';
    const FN_MAX = 4;

    const CSIZE = CNV_SIZE / CNUM;
    const CSTRWT = CSIZE / 8;
    const VACANCY_NUM = Math.floor(CNUM**2 * 0.02);

    const MAX_RATE = 2**13;

    let rate = 1;
    let grid = new Array<Array<string>|null>(CNUM)
      .fill(null)
      .map(() => new Array<string|null>(CNUM).fill(null));
    let vacancies = new class extends Array<[number, number]> {
      remove(i: number): [number, number] {
        [ this[i], this[this.length - 1] ] = [ this[this.length - 1], this[i] ];
        return this.pop();
      }
    }();

    let setting_up: boolean;
    let a_count: number;
    let b_count: number;
    let v_count: number;

    let i: number;
    let j: number;

    p.setup = function() {
      p.createCanvas(CNV_SIZE, CNV_SIZE);
      p.background(BG);
      p.noStroke();

      setting_up = true;
      a_count = Math.floor((CNUM**2 - VACANCY_NUM)/2);
      b_count = CNUM**2 - a_count - VACANCY_NUM;
      v_count = VACANCY_NUM;

      i = 0;
      j = 0;
    }

    p.draw = function() {

      for (let count = 0; count < rate; ++count) {
        if (setting_up) {
          let n = p.floor(p.random(a_count + b_count + v_count));
          if (n < a_count) {
            grid[i][j] = A;
            --a_count;
            p.fill(p.color(A));
          } else if (n < a_count + b_count) {
            grid[i][j] = B;
            --b_count;
            p.fill(p.color(B));
          } else {
            vacancies.push([i, j]);
            --v_count;
            p.fill(p.color(BG));
          }
          p.rect(j*CSIZE, i*CSIZE, CSIZE, CSIZE);
          j++;
          if (j >= CNUM) {
            i++;
            j = 0;
          }
          if (i >= CNUM) {
            i = 0;
            setting_up = false;
            rate = 1;
          }
        } else {
          update(i, j);

          j++;
          if (j >= CNUM) {
            i++;
            j = 0;
          }
          if (i >= CNUM) {
            i = 0;
          }
        }
      }
      if (rate < MAX_RATE) {
        rate++;
      }
    }

    function update(i: number, j: number): void {
      let fn = countForeignNeighbors(i, j);
      if (fn >= FN_MAX) {
        let [i_n, j_n] = vacancies.remove(p.floor(p.random(vacancies.length)));
        grid[i_n][j_n] = grid[i][j];
        grid[i][j] = null;
        p.fill(BG);
        p.rect(j*CSIZE, i*CSIZE, CSIZE, CSIZE);
        p.fill(p.color(grid[i_n][j_n]));
        p.rect(j_n*CSIZE, i_n*CSIZE, CSIZE, CSIZE);
        vacancies.push([i, j]);
      }
    }

    function countForeignNeighbors(i: number, j: number) {
      let my_team = grid[i][j];
      // console.log(my_team);
      if (my_team === null) {
        return 0;
      }

      let fn = 0;
      if (        i > 0       &&          j > 0        ) {
        fn += grid[i - 1][j - 1] !== my_team && grid[i - 1][j - 1] !== null ? 1 : 0;
      }
      if (        i > 0       &&           true        ) {
        fn += grid[i - 1][  j  ] !== my_team && grid[i - 1][  j  ] !== null ? 1 : 0;
      }
      if (        i > 0       && j < grid[i].length - 1) {
        fn += grid[i - 1][j + 1] !== my_team && grid[i - 1][j + 1] !== null ? 1 : 0;
      }

      if (        true        &&          j > 0        ) {
        fn += grid[  i  ][j - 1] !== my_team && grid[  i  ][j - 1] !== null ? 1 : 0;
      }
      // if (true  &&  true) { fn += grid[  i  ][  j  ] !== my_team ? 1 : 0 }
      if (        true        && j < grid[i].length - 1) {
        fn += grid[  i  ][j + 1] !== my_team && grid[  i  ][j + 1] !== null ? 1 : 0;
      }

      if (i < grid.length - 1 &&          j > 0        ) {
        fn += grid[i + 1][j - 1] !== my_team && grid[i + 1][j - 1] !== null ? 1 : 0;
      }
      if (i < grid.length - 1 &&           true        ) {
        fn += grid[i + 1][  j  ] !== my_team && grid[i + 1][  j  ] !== null ? 1 : 0;
      }
      if (i < grid.length - 1 && j < grid[i].length - 1) {
        fn += grid[i + 1][j + 1] !== my_team && grid[i + 1][j + 1] !== null ? 1 : 0;
      }
      return fn;
    }
  }
}
