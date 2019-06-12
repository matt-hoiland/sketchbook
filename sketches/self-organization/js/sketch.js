function initSketch(p) {
  const cnv_size = CANVAS_SIZE.DEFAULT;
  const cell_num = cnv_size/2;
  const bg_color = '#ff8888';
  const border_color = '#ff8888';
  const hl_color = border_color // 'red'
  const a_color = '#aaaaff';
  const b_color = '#aaffaa';
  // const c_color = 0x44;
  const fn_max = 4;

  const cell_size = cnv_size / cell_num;
  const cell_strokeWeight = Math.floor(cell_size / 10);
  const vacancy_num = Math.floor(cell_num**2 * 0.013);

  let rate = 10000;
  let grid = Array(cell_num).fill(null).map(() => Array(cell_num).fill(null));
  let vacancies = new class extends Array {
    remove(i) {
      let entry = this[i];
      let last = this[this.length - 1];
      this[this.length - 1] = entry;
      this[i] = last;
      this.pop();
      return entry;
    }
  }


  p.setup = function() {
    p.createCanvas(cnv_size, cnv_size);
    p.background(bg_color);
    // frameRate(60);
    p.strokeWeight(cell_strokeWeight);

    let a_count = p.floor((cell_num ** 2 - vacancy_num) / 2);
    // let c_count = floor((cell_num ** 2 - vacancy_num) / 3);
    let b_count = cell_num ** 2 - a_count - vacancy_num // - c_count;
    let v_count = vacancy_num;

    for (let i = 0; i < grid.length; ++i) {
      for (let j = 0; j < grid[i].length; ++j) {
        let n = p.floor(p.random(a_count + b_count + v_count));
        if (n < a_count) {
          grid[i][j] = a_color;
          --a_count;
        } else if (n < a_count + b_count) {
          grid[i][j] = b_color;
          --b_count;
        // } else if (n < a_count + b_count + c_count) {
        //   grid[i][j] = c_color;
        //   --c_count;
        } else {
          vacancies.push([i, j]);
          --v_count;
        }
      }
    }

    for (let i = 0; i < grid.length; ++i) {
      for (let j = 0; j < grid[i].length; ++j) {
        if (i == row && j == col) {
          // strokeWeight(2 * cell_strokeWeight);
          p.stroke(hl_color);
        } else {
          p.stroke(border_color);
        }
        if (grid[i][j] !== null) {
          p.fill(p.color(grid[i][j]));
        } else {
          p.fill(bg_color);
        }
        p.rect(j * cell_size, i * cell_size, cell_size, cell_size);
      }
    }

    // console.log(grid);
    // console.log(vacancies);
  }

  let row = 0;
  let col = 0;

  p.draw = function() {
    p.noFill();
    p.stroke(border_color);
    if (col === 0) {
      if (row > 0) {
        p.rect((cell_num - 1) * cell_size, (row - 1) * cell_size, cell_size, cell_size);
      } else {
        p.rect((cell_num - 1) * cell_size, (cell_num - 1) * cell_size, cell_size, cell_size);
      }
    } else {
      p.rect((col - 1) * cell_size, row * cell_size, cell_size, cell_size);
    }
    p.stroke(hl_color);
    p.rect(col * cell_size, row * cell_size, cell_size, cell_size);

    for (let i = 0; i < rate; ++i) {
      update(row, col);

      col++;
      if (col >= cell_num) {
        row++;
        col = 0;
      }
      if (row >= cell_num) {
        row = 0;
      }
    }
  }

  function update(i, j) {
    // for (let i = 0; i < grid.length; ++i) {
    //   for (let j = 0; j < grid[i].length; ++j) {
        let fn = countForeignNeighbors(i, j);
        if (fn >= fn_max) {
          let [i_n, j_n] = vacancies.remove(p.floor(p.random(vacancies.length)));
          grid[i_n][j_n] = grid[i][j];
          grid[i][j] = null;
          p.stroke(border_color);
          p.fill(bg_color);
          p.rect(j * cell_size, i * cell_size, cell_size, cell_size);
          p.fill(p.color(grid[i_n][j_n]));
          p.rect(j_n * cell_size, i_n * cell_size, cell_size, cell_size);
          vacancies.push([i, j]);
        }
    //   }
    // }
  }

  function countForeignNeighbors(i, j) {
    let my_team = grid[i][j];
    // console.log(my_team);
    if (my_team === null) {
      return 0;
    }

    let fn = 0;
    if (        i > 0       &&          j > 0        ) {
      // console.log(`${i - 1}, ${j - 1}: ${grid[i - 1][j - 1]}`);
      fn += grid[i - 1][j - 1] !== my_team && grid[i - 1][j - 1] !== null ? 1 : 0;
    }
    if (        i > 0       &&           true        ) {
      // console.log(`${i - 1}, ${  j  }: ${grid[i - 1][  j  ]}`);
      fn += grid[i - 1][  j  ] !== my_team && grid[i - 1][  j  ] !== null ? 1 : 0;
    }
    if (        i > 0       && j < grid[i].length - 1) {
      // console.log(`${i - 1}, ${j + 1}: ${grid[i - 1][j + 1]}`);
      fn += grid[i - 1][j + 1] !== my_team && grid[i - 1][j + 1] !== null ? 1 : 0;
    }

    if (        true        &&          j > 0        ) {
      // console.log(`${  i  }, ${j - 1}: ${grid[  i  ][j - 1]}`);
      fn += grid[  i  ][j - 1] !== my_team && grid[  i  ][j - 1] !== null ? 1 : 0;
    }
    // if (true  &&  true) { fn += grid[  i  ][  j  ] !== my_team ? 1 : 0 }
    if (        true        && j < grid[i].length - 1) {
      // console.log(`${  i  }, ${j + 1}: ${grid[  i  ][j + 1]}`);
      fn += grid[  i  ][j + 1] !== my_team && grid[  i  ][j + 1] !== null ? 1 : 0;
    }

    if (i < grid.length - 1 &&          j > 0        ) {
      // console.log(`${i + 1}, ${j - 1}: ${grid[i + 1][j - 1]}`);
      fn += grid[i + 1][j - 1] !== my_team && grid[i + 1][j - 1] !== null ? 1 : 0;
    }
    if (i < grid.length - 1 &&           true        ) {
      // console.log(`${i + 1}, ${  j  }: ${grid[i + 1][  j  ]}`);
      fn += grid[i + 1][  j  ] !== my_team && grid[i + 1][  j  ] !== null ? 1 : 0;
    }
    if (i < grid.length - 1 && j < grid[i].length - 1) {
      // console.log(`${i + 1}, ${j + 1}: ${grid[i + 1][j + 1]}`);
      fn += grid[i + 1][j + 1] !== my_team && grid[i + 1][j + 1] !== null ? 1 : 0;
    }
    return fn;
  }
}
