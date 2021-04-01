function create_cells() {
  const width = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
  const height = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);

  const cell_cnt = Math.floor(height / 50) * Math.floor(width * 8 / 10 / 50);
  console.log(`H: ${height} W: ${width}`);
  console.log(cell_cnt);

  let cells = [];
  for(let i = 0; i < cell_cnt; i++) {
    cells.push(
      { id: i,
        is_start: false,
        is_end: false,
        is_wall: false,
      });
  }

  return cells;
}

function reset_board() {
  for (let i = 0; i < cells.length; i++) {
    cells[i].is_wall = false;
  }
}


let cells = create_cells();

cells[1].is_start = true;
cells[2].is_end = true;

var container = new Vue({
  el: '.board',
  data: {
    cells: cells,
    is_placing_walls: false,
  },
  methods: {
    mouse_over: function(cell){
      if(this.is_placing_walls) {
        cell.is_wall = !cell.is_wall;
      }
    },
    mouse_down: function(){
      this.is_placing_walls = true;   
    },
    mouse_up: function(){
      this.is_placing_walls = false;   
    }
  }
});