const width = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
const height = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)

const cell_cnt = Math.floor(height / 50) * Math.floor(width * 8 / 10 / 50)
console.log(`H: ${height} W: ${width}`)
console.log(cell_cnt)

let cells = [];
for(let i = 0; i < cell_cnt; i++) {
  cells.push(
    { id: i,
      is_start: false,
      is_end: false,
      is_wall: false,
    });
} 

cells[1].is_start = true;
cells[350].is_end = true;

Vue.component('cell', {
  props: ['is_start', 'is_end', 'is_wall'],
  template: '<div class="cell" v-bind:class="{start_cell: is_start, end_cell: is_end, wall_cell: is_wall}" v-on:click="is_wall = !is_wall"></div>'
});

var container = new Vue({
  el: '.board',
  data: {
    cells: cells
  }
});