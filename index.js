const board_dim = document.getElementsByClassName("board")[0].getBoundingClientRect(); 

const width = board_dim.width;
const height = board_dim.height;
const x_dim = Math.floor(width / 50); 
const y_dim = Math.floor(height / 50); 

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
      });
  }

  cells[convert_xy_coord(Math.floor(x_dim / 4), Math.floor(y_dim / 2))].is_start = true;
  cells[convert_xy_coord(Math.floor(3 * x_dim / 4), Math.floor(y_dim / 2))].is_end = true;

  return cells;
}

function clear_board() {
  for (let i = 0; i < cells.length; i++) {
    cells[i].is_wall = false;
  }
}

function change_start() {
  container.is_changing_start = true;
}

function change_end() {
  container.is_changing_end = true;
}

function convert_xy_coord(x, y) {
  return x_dim * y + x;
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
        container.is_changing_start = false;
      } else if (container.is_changing_end && !cell.is_start) {
        for (let i = 0; i < cells.length; i++) {
          cells[i].is_end = false;
        }
        cell.is_end = true;
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
    },
  }
});