const board_dim = document.getElementsByClassName("board")[0].getBoundingClientRect();
const delay = ms => new Promise(res => setTimeout(res, ms));

const width = board_dim.width;
const height = board_dim.height;
const x_dim = Math.floor(width / 50);
const y_dim = Math.floor(height / 50);

const algorithm_timeout = 1;

let start_index = 0;
let end_index = 0;

function create_cells() {
  // const width = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
  // const height = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);

  const cell_cnt = x_dim * y_dim;
  console.log(`H: ${height} W: ${width} CellCnt: ${cell_cnt}`);

  let cells = [];
  for(let i = 0; i < cell_cnt; i++) {
    cells.push(
      { id: i,
        is_start: false,
        is_end: false,
        is_wall: false,
        is_in_solution: false,
        is_visited: false,
      });
  }

  start_index = convert_xy_coord(Math.floor(x_dim / 4), Math.floor(y_dim / 2));
  end_index = convert_xy_coord(Math.floor(3 * x_dim / 4), Math.floor(y_dim / 2));

  cells[start_index].is_start = true;
  cells[end_index].is_end = true;

  return cells;
}

function clear_board() {
  for (let i = 0; i < cells.length; i++) {
    cells[i].is_wall = false;
    cells[i].is_visited = false;
    cells[i].is_in_solution = false;
  }
}

function change_start() {
  container.is_changing_start = true;
}

function change_end() {
  container.is_changing_end = true;
}

function convert_xy_coord(x, y) {
  let mod_x = x;
  let mod_y = y;
  if(mod_x >= x_dim) {
    mod_x = x_dim - 1;
  }
  else if(mod_x < 0) {
    mod_x = 0;
  }
  if(mod_y >= y_dim) {
    mod_y = y_dim - 1;
  }
  else if(mod_y < 0) {
    mod_y = 0;
  }
  return x_dim * mod_y + mod_x;
}

function convert_linear_coord(id) {
  if(id < 0) {
    return { x: 0, y: 0 };
  } else if (id > cells.length) {
    return { x: x_dim - 1, y: y_dim - 1 };
  } else {
    return { x: id % x_dim, y: Math.floor(id / x_dim) }
  }
}

async function bfs() {
  for(let i = 0; i < cells.length; i++) {
    cells[i].is_in_solution = false;
    cells[i].is_visited = false;
  }

  let queue = [{ cell: cells[start_index], pred: NaN }];
  cells[start_index].is_visited = true;

  let current_cell;

  while(queue.length > 0) {
    current_cell = queue.shift();
    if(current_cell.cell === cells[end_index]) {
      break;
    }
    const coord = convert_linear_coord(current_cell.cell.id);
    const up = cells[convert_xy_coord(coord.x, coord.y + 1)];
    const down = cells[convert_xy_coord(coord.x, coord.y - 1)];
    const left = cells[convert_xy_coord(coord.x - 1, coord.y)];
    const right = cells[convert_xy_coord(coord.x + 1, coord.y)];
    await delay(algorithm_timeout);
    if(!up.is_visited && !up.is_wall) {
      queue.push({ cell: up, pred: current_cell });
      up.is_visited = true;
    }
    await delay(algorithm_timeout);
    if(!down.is_visited && !down.is_wall) {
      queue.push({ cell: down, pred: current_cell });
      // queue.push(down);
      down.is_visited = true;
    }
    await delay(algorithm_timeout);
    if(!left.is_visited && !left.is_wall) {
      queue.push({ cell: left, pred: current_cell });
      // queue.push(left);
      left.is_visited = true;
    }
    await delay(algorithm_timeout);
    if(!right.is_visited && !right.is_wall) {
      queue.push({ cell: right, pred: current_cell });
      // queue.push(right);
      right.is_visited = true;
    }
  }
  current_cell = current_cell.pred;
  while(current_cell.pred) {
    current_cell.cell.is_in_solution = true;
    current_cell = current_cell.pred;
  }
}

let cells = create_cells();

var container = new Vue({
  el: '.board',
  data: {
    cells: cells,
    is_placing_walls: false,
    is_changing_start: false,
    is_changing_end: false,
  },
  methods: {
    mouse_over: function(cell) {
      if(this.is_placing_walls && !cell.is_start && !cell.is_end) {
        cell.is_wall = !cell.is_wall;
      }
    },
    clicked_cell: function(cell) {
      if (container.is_changing_start && !cell.is_end) {
        for (let i = 0; i < cells.length; i++) {
          cells[i].is_start = false;
        }
        cell.is_start = true;
        start_index = cell.id;
        container.is_changing_start = false;
      } else if (container.is_changing_end && !cell.is_start) {
        for (let i = 0; i < cells.length; i++) {
          cells[i].is_end = false;
        }
        cell.is_end = true;
        end_index = cell.id;
        container.is_changing_end = false;
      } else if (!cell.is_start && !cell.is_end) {
        cell.is_wall = !cell.is_wall;
      }
    },
    mouse_down: function() {
      if (!this.is_changing_start && !this.is_changing_end){
        this.is_placing_walls = true;
      }
    },
    mouse_up: function() {
      this.is_placing_walls = false;
    }
  }
});