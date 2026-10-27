//ai written implementation of conways game of life
//
(function () {
  const canvas = document.getElementById("canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  const CELL_SIZE = 10;
  const TICK_MS = 80;
  const SEED_DENSITY = 0.50;
  const CELL_COLOR = "rgba(0, 0, 0, 0.03)";

  let cols, rows;
  let grid;

  function randomGrid() {
    const g = new Uint8Array(cols * rows);
    for (let i = 0; i < g.length; i++) {
      g[i] = Math.random() < SEED_DENSITY ? 1 : 0;
    }
    return g;
  }

  // "Alternate wickstretcher 1" (Paul Tooke, 2003) -- a slightly smaller
  // form of wickstretcher 1, 38x20. Coordinates decoded from the RLE at
  // https://conwaylife.appspot.com/pattern/alternatewickstretcher1
  const ALTERNATE_WICK_STRETCHER_1 = {
    width: 38,
    height: 20,
    cells: [
      [26, 0], [28, 0], [26, 1], [29, 1], [10, 2], [26, 2], [30, 2], [9, 3], [11, 3], [30, 3],
      [31, 3], [2, 4], [7, 4], [8, 4], [9, 4], [11, 4], [17, 4], [32, 4], [1, 5], [3, 5],
      [6, 5], [11, 5], [12, 5], [16, 5], [18, 5], [26, 5], [27, 5], [30, 5], [32, 5], [33, 5],
      [1, 6], [3, 6], [6, 6], [8, 6], [9, 6], [13, 6], [17, 6], [26, 6], [27, 6], [28, 6],
      [31, 6], [32, 6], [33, 6], [37, 6], [0, 7], [1, 7], [3, 7], [4, 7], [6, 7], [8, 7],
      [10, 7], [11, 7], [20, 7], [33, 7], [36, 7], [37, 7], [1, 8], [6, 8], [7, 8], [12, 8],
      [13, 8], [17, 8], [19, 8], [20, 8], [33, 8], [34, 8], [37, 8], [1, 9], [3, 9], [4, 9],
      [7, 9], [11, 9], [13, 9], [15, 9], [16, 9], [19, 9], [21, 9], [22, 9], [24, 9], [25, 9],
      [26, 9], [2, 10], [6, 10], [7, 10], [8, 10], [10, 10], [12, 10], [15, 10], [20, 10], [24, 10],
      [25, 10], [26, 10], [3, 11], [4, 11], [8, 11], [10, 11], [13, 11], [19, 11], [20, 11], [33, 11],
      [34, 11], [37, 11], [5, 12], [6, 12], [8, 12], [10, 12], [11, 12], [13, 12], [15, 12], [19, 12],
      [33, 12], [36, 12], [37, 12], [5, 13], [7, 13], [8, 13], [10, 13], [13, 13], [15, 13], [16, 13],
      [21, 13], [26, 13], [27, 13], [28, 13], [31, 13], [32, 13], [33, 13], [37, 13], [11, 14], [12, 14],
      [20, 14], [21, 14], [26, 14], [27, 14], [30, 14], [32, 14], [33, 14], [32, 15], [30, 16], [31, 16],
      [26, 17], [30, 17], [26, 18], [29, 18], [26, 19], [28, 19],
    ],
  };

  // "ak94" -- 38x25. Coordinates decoded from the RLE at
  // https://conwaylife.appspot.com/pattern/ak94
  const AK94 = {
    width: 38,
    height: 25,
    cells: [
      [7, 0], [15, 0], [23, 0], [24, 0], [7, 1], [8, 1], [9, 1], [15, 1], [16, 1], [17, 1],
      [23, 1], [24, 1], [10, 2], [18, 2], [9, 3], [10, 3], [17, 3], [18, 3], [35, 3], [36, 3],
      [30, 4], [31, 4], [34, 4], [37, 4], [30, 5], [32, 5], [35, 5], [36, 5], [33, 6], [34, 6],
      [5, 7], [34, 7], [5, 8], [6, 8], [7, 8], [34, 8], [36, 8], [37, 8], [8, 9], [31, 9],
      [32, 9], [34, 9], [37, 9], [7, 10], [8, 10], [31, 10], [32, 10], [34, 10], [35, 10], [17, 13],
      [2, 14], [3, 14], [5, 14], [6, 14], [16, 14], [18, 14], [29, 14], [30, 14], [0, 15], [3, 15],
      [5, 15], [6, 15], [15, 15], [19, 15], [29, 15], [0, 16], [1, 16], [3, 16], [15, 16], [19, 16],
      [30, 16], [31, 16], [32, 16], [3, 17], [15, 17], [19, 17], [32, 17], [3, 18], [4, 18], [16, 18],
      [18, 18], [1, 19], [2, 19], [5, 19], [7, 19], [17, 19], [0, 20], [3, 20], [6, 20], [7, 20],
      [1, 21], [2, 21], [19, 21], [20, 21], [19, 22], [13, 23], [14, 23], [20, 23], [21, 23], [22, 23],
      [13, 24], [14, 24], [22, 24],
    ],
  };

  // "Weekender tagalong" -- 37x24. Coordinates decoded from the RLE at
  // https://conwaylife.appspot.com/pattern/weekendertagalong
  const WEEKENDER_TAGALONG = {
    width: 37,
    height: 24,
    cells: [
      [1, 0], [14, 0], [22, 0], [35, 0], [1, 1], [14, 1], [22, 1], [35, 1], [0, 2], [2, 2],
      [13, 2], [15, 2], [21, 2], [23, 2], [34, 2], [36, 2], [1, 3], [14, 3], [22, 3], [35, 3],
      [1, 4], [14, 4], [22, 4], [35, 4], [2, 5], [6, 5], [7, 5], [8, 5], [9, 5], [13, 5],
      [23, 5], [27, 5], [28, 5], [29, 5], [30, 5], [34, 5], [6, 6], [7, 6], [8, 6], [9, 6],
      [18, 6], [27, 6], [28, 6], [29, 6], [30, 6], [2, 7], [3, 7], [4, 7], [5, 7], [10, 7],
      [11, 7], [12, 7], [13, 7], [16, 7], [17, 7], [18, 7], [19, 7], [20, 7], [23, 7], [24, 7],
      [25, 7], [26, 7], [31, 7], [32, 7], [33, 7], [34, 7], [15, 8], [17, 8], [19, 8], [21, 8],
      [4, 9], [11, 9], [25, 9], [32, 9], [5, 10], [6, 10], [9, 10], [10, 10], [17, 10], [19, 10],
      [26, 10], [27, 10], [30, 10], [31, 10], [14, 11], [17, 11], [19, 11], [22, 11], [14, 12], [17, 12],
      [19, 12], [22, 12], [14, 13], [16, 13], [20, 13], [22, 13], [14, 16], [15, 16], [21, 16], [22, 16],
      [14, 17], [15, 17], [21, 17], [22, 17], [16, 19], [17, 19], [19, 19], [20, 19], [15, 20], [17, 20],
      [19, 20], [21, 20], [15, 21], [17, 21], [19, 21], [21, 21], [17, 22], [19, 22], [15, 23], [16, 23],
      [20, 23], [21, 23],
    ],
  };

  // Stamps a pattern's live cells onto an existing grid at (offsetX, offsetY),
  // wrapping with modulo so it still lands somewhere sensible if the
  // viewport is smaller than the pattern's bounding box.
  function stampPattern(g, pattern, offsetX, offsetY) {
    for (const [x, y] of pattern.cells) {
      const gx = (x + offsetX + cols) % cols;
      const gy = (y + offsetY + rows) % rows;
      g[gy * cols + gx] = 1;
    }
  }

  function seededGrid() {
    const g = new Uint8Array(cols * rows);
    stampPattern(
      g,
      ALTERNATE_WICK_STRETCHER_1,
      Math.floor((cols - ALTERNATE_WICK_STRETCHER_1.width) / 2),
      Math.floor((rows - ALTERNATE_WICK_STRETCHER_1.height) / 2)
    );
    // ak94 anchored to the top-left corner of the screen, nudged 1 cell right.
    stampPattern(g, AK94, 1, 0);
    // Weekender tagalong anchored to the bottom-right corner of the screen, nudged 1 cell left.
    stampPattern(g, WEEKENDER_TAGALONG, cols - WEEKENDER_TAGALONG.width - 2, rows - WEEKENDER_TAGALONG.height);
    return g;
  }

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    cols = Math.ceil(canvas.width / CELL_SIZE);
    rows = Math.ceil(canvas.height / CELL_SIZE);
    grid = randomGrid();
  }

  function countNeighbors(g, x, y) {
    let count = 0;
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dx === 0 && dy === 0) continue;
        // Wrap at the edges so the pattern reads as a continuous field.
        const nx = (x + dx + cols) % cols;
        const ny = (y + dy + rows) % rows;
        count += g[ny * cols + nx];
      }
    }
    return count;
  }

  function step() {
    const next = new Uint8Array(cols * rows);
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const i = y * cols + x;
        const alive = grid[i] === 1;
        const neighbors = countNeighbors(grid, x, y);
        next[i] = alive
          ? (neighbors === 2 || neighbors === 3 ? 1 : 0)
          : (neighbors === 3 ? 1 : 0);
      }
    }
    grid = next;
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = CELL_COLOR;
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        if (grid[y * cols + x] === 1) {
          ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        }
      }
    }
  }

  function tick() {
    step();
    draw();
  }

  resize();
  draw();
  setInterval(tick, TICK_MS);

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 200);
  });
})();
