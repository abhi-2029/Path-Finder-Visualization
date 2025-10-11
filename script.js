// /* 🌐 Path Finder Visualizer – Polished Version (By Abhishek Singh) */

// // 🌍 Element References
// const gridElement = document.getElementById("grid");
// const algoSelect = document.getElementById("algoSelect");
// const statusBar = document.getElementById("status");
// const loader = document.getElementById("loader");
// const noPathPopup = document.getElementById("noPathPopup");

// // 📏 Grid Configuration (Auto Responsive)
// let rows = 15, cols = 15;
// function calculateGridSize() {
//   if (window.innerWidth < 800) rows = cols = 10;
//   else if (window.innerWidth > 1400) rows = cols = 20;
//   else rows = cols = 15;
// }
// calculateGridSize();

// // 🧠 Core Variables
// let grid = [];
// let start = null, end = null;
// let mode = "wall";
// let stepCount = 0;
// let showWeights = true;

// /* 🎨 Dynamic Theme */
// function applyRandomTheme() {
//   const themes = [
//     { bg: "#0f1116", accent: "#00ffc8" },
//     { bg: "#1a1c2c", accent: "#ffb700" },
//     { bg: "#0a192f", accent: "#64ffda" },
//     { bg: "#1f1f1f", accent: "#ff4d6d" },
//     { bg: "#0d1b2a", accent: "#00b4d8" },
//     { bg: "#101820", accent: "#00ffbb" },
//     { bg: "#2b2d42", accent: "#ffd60a" }
//   ];
//   const theme = themes[Math.floor(Math.random() * themes.length)];

//   document.body.style.backgroundColor = theme.bg;
//   document.querySelector("header h1").style.color = theme.accent;
//   document.querySelector("footer").style.color = theme.accent;
//   document.querySelectorAll("button, select").forEach(el => {
//     el.style.backgroundColor = theme.accent;
//     el.style.color = "#000";
//     el.style.boxShadow = `0 0 8px ${theme.accent}`;
//   });
// }

// /* ⏰ Digital Clock */
// function startClock() {
//   const clock = document.createElement("div");
//   clock.id = "clock";
//   clock.style.fontSize = "18px";
//   clock.style.fontWeight = "600";
//   clock.style.color = "#00ffc8";
//   clock.style.marginTop = "10px";
//   document.querySelector("header").appendChild(clock);

//   setInterval(() => {
//     clock.textContent = `🕒 ${new Date().toLocaleTimeString()}`;
//   }, 1000);
// }

// /* 📊 UI Updates */
// function updateStatus(algo, step, path = 0) {
//   statusBar.innerHTML = `
//     <span style="color:#00ffbb">Algorithm:</span> ${algo.toUpperCase()} 
//     | <span style="color:#ffd60a">Steps:</span> ${step} 
//     | <span style="color:#00ff88">Path Length:</span> ${path}
//   `;
// }

// function showLoader(show = true) {
//   loader.style.display = show ? "block" : "none";
// }

// /* 🧩 Grid Creation */
// function createGrid() {
//   gridElement.innerHTML = "";
//   grid = [];
//   stepCount = 0;
//   updateStatus(algoSelect.value, stepCount, 0);

//   for (let i = 0; i < rows; i++) {
//     const row = [];
//     for (let j = 0; j < cols; j++) {
//       const cell = document.createElement("div");
//       cell.classList.add("cell");
//       cell.dataset.row = i;
//       cell.dataset.col = j;
//       cell.dataset.weight = Math.floor(Math.random() * 9) + 1;
//       cell.textContent = showWeights ? cell.dataset.weight : "";
//       cell.addEventListener("click", handleCellClick);
//       gridElement.appendChild(cell);
//       row.push(cell);
//     }
//     grid.push(row);
//   }
// }

// /* 🎯 Cell Selection */
// function handleCellClick(e) {
//   const cell = e.target;
//   if (mode === "start") {
//     if (start) start.classList.remove("start");
//     start = cell;
//     cell.classList.add("start");
//   } else if (mode === "end") {
//     if (end) end.classList.remove("end");
//     end = cell;
//     cell.classList.add("end");
//   } else if (mode === "wall") {
//     cell.classList.toggle("wall");
//   }
// }

// /* 🧮 Helper Functions */
// function getNeighbors(r, c) {
//   const dirs = [[1,0],[-1,0],[0,1],[0,-1]];
//   return dirs
//     .map(([dr, dc]) => [r + dr, c + dc])
//     .filter(([nr, nc]) =>
//       nr >= 0 && nr < rows &&
//       nc >= 0 && nc < cols &&
//       !grid[nr][nc].classList.contains("wall")
//     )
//     .map(([nr, nc]) => grid[nr][nc]);
// }

// const sleep = (ms) => new Promise(res => setTimeout(res, ms));

// /* 🔍 BFS – Unweighted Shortest Path */
// async function bfs() {
//   const queue = [start];
//   const parent = new Map();
//   const visited = new Set([start]);

//   while (queue.length) {
//     const current = queue.shift();
//     if (current === end) break;

//     for (const neighbor of getNeighbors(+current.dataset.row, +current.dataset.col)) {
//       if (!visited.has(neighbor)) {
//         visited.add(neighbor);
//         parent.set(neighbor, current);
//         queue.push(neighbor);
//         if (neighbor !== end) neighbor.classList.add("visited-bfs");
//         stepCount++;
//         updateStatus("bfs", stepCount);
//         await sleep(10);
//       }
//     }
//   }
//   drawPath(parent, "bfs");
// }

// /* ⚙️ Dijkstra – Weighted Shortest Path */
// async function dijkstra() {
//   const dist = new Map();
//   const parent = new Map();
//   const pq = [];

//   grid.flat().forEach(cell => dist.set(cell, Infinity));
//   dist.set(start, 0);
//   pq.push([0, start]);

//   while (pq.length) {
//     pq.sort((a,b)=>a[0]-b[0]);
//     const [d, current] = pq.shift();
//     if (current === end) break;

//     for (const neighbor of getNeighbors(+current.dataset.row, +current.dataset.col)) {
//       const alt = d + +neighbor.dataset.weight;
//       if (alt < dist.get(neighbor)) {
//         dist.set(neighbor, alt);
//         parent.set(neighbor, current);
//         pq.push([alt, neighbor]);
//         if (neighbor !== end) neighbor.classList.add("visited-dijkstra");
//         stepCount++;
//         updateStatus("dijkstra", stepCount);
//         await sleep(25);
//       }
//     }
//   }
//   drawPath(parent, "dijkstra");
// }

// /* 🧭 Path Visualization */
// async function drawPath(parent, algo) {
//   let curr = end, pathLength = 0;

//   if (!parent.has(end)) {
//     noPathPopup.style.display = "block";
//     setTimeout(()=> noPathPopup.style.display = "none", 2500);
//     updateStatus(algo, stepCount, 0);
//     return;
//   }

//   while (curr && curr !== start) {
//     curr.classList.add(algo === "bfs" ? "path-bfs" : "path-dijkstra");
//     curr = parent.get(curr);
//     pathLength++;
//     await sleep(20);
//   }

//   updateStatus(algo, stepCount, pathLength);
// }

// /* 🖱️ Button Controls */
// document.getElementById("setStart").addEventListener("click", () => mode = "start");
// document.getElementById("setEnd").addEventListener("click", () => mode = "end");
// document.getElementById("addWalls").addEventListener("click", () => mode = "wall");
// document.getElementById("toggleWeights").addEventListener("click", () => {
//   showWeights = !showWeights;
//   grid.flat().forEach(c => c.textContent = showWeights ? c.dataset.weight : "");
// });
// document.getElementById("visualize").addEventListener("click", async () => {
//   if (!start || !end) return alert("Please set start and end!");
//   stepCount = 0;
//   updateStatus(algoSelect.value, stepCount);
//   showLoader(true);
//   if (algoSelect.value === "bfs") await bfs();
//   else await dijkstra();
//   showLoader(false);
// });
// document.getElementById("reset").addEventListener("click", createGrid);

// /* 🔄 Handle Resize */
// window.addEventListener("resize", () => {
//   calculateGridSize();
//   createGrid();
// });

// /* 🚀 Initialize App */
// applyRandomTheme();
// startClock();
// createGrid();



/* 🌐 Path Finder Visualizer – Polished Version (By Abhishek Singh) */

// 🌍 Element References
const gridElement = document.getElementById("grid");
const algoSelect = document.getElementById("algoSelect");
const statusBar = document.getElementById("status");
const loader = document.getElementById("loader");
const noPathPopup = document.getElementById("noPathPopup");

// 📏 Fully Dynamic Grid Configuration
let rows = 15, cols = 15;

function calculateGridSize() {
  const cellSize = 35; // px per cell
  const gridWidth = Math.floor(window.innerWidth * 0.6);
  const gridHeight = Math.floor(window.innerHeight * 0.5);

  cols = Math.max(10, Math.floor(gridWidth / cellSize));
  rows = Math.max(10, Math.floor(gridHeight / cellSize));

  // Update CSS variables for consistency
  gridElement.style.setProperty("--rows", rows);
  gridElement.style.setProperty("--cols", cols);
}

// 🧠 Core Variables
let grid = [];
let start = null, end = null;
let mode = "wall";
let stepCount = 0;
let showWeights = true;

/* 🎨 Dynamic Theme */
function applyRandomTheme() {
  const themes = [
    { bg: "#0f1116", accent: "#00ffc8" },
    { bg: "#1a1c2c", accent: "#ffb700" },
    { bg: "#0a192f", accent: "#64ffda" },
    { bg: "#1f1f1f", accent: "#ff4d6d" },
    { bg: "#0d1b2a", accent: "#00b4d8" },
    { bg: "#101820", accent: "#00ffbb" },
    { bg: "#2b2d42", accent: "#ffd60a" }
  ];
  const theme = themes[Math.floor(Math.random() * themes.length)];

  document.body.style.backgroundColor = theme.bg;
  document.querySelector("header h1").style.color = theme.accent;
  document.querySelector("footer").style.color = theme.accent;
  document.querySelectorAll("button, select").forEach(el => {
    el.style.backgroundColor = theme.accent;
    el.style.color = "#000";
    el.style.boxShadow = `0 0 8px ${theme.accent}`;
  });
}

/* ⏰ Digital Clock */
function startClock() {
  const clock = document.createElement("div");
  clock.id = "clock";
  clock.style.fontSize = "18px";
  clock.style.fontWeight = "600";
  clock.style.color = "#00ffc8";
  clock.style.marginTop = "10px";
  document.querySelector("header").appendChild(clock);

  setInterval(() => {
    clock.textContent = `🕒 ${new Date().toLocaleTimeString()}`;
  }, 1000);
}

/* 📊 UI Updates */
function updateStatus(algo, step, path = 0) {
  statusBar.innerHTML = `
    <span style="color:#00ffbb">Algorithm:</span> ${algo.toUpperCase()} 
    | <span style="color:#ffd60a">Steps:</span> ${step} 
    | <span style="color:#00ff88">Path Length:</span> ${path}
  `;
}

function showLoader(show = true) {
  loader.style.display = show ? "block" : "none";
}

/* 🧩 Grid Creation */
function createGrid() {
  calculateGridSize(); // 👈 dynamic grid sizing
  gridElement.innerHTML = "";
  grid = [];
  stepCount = 0;
  updateStatus(algoSelect.value, stepCount, 0);

  for (let i = 0; i < rows; i++) {
    const row = [];
    for (let j = 0; j < cols; j++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.row = i;
      cell.dataset.col = j;
      cell.dataset.weight = Math.floor(Math.random() * 9) + 1;
      cell.textContent = showWeights ? cell.dataset.weight : "";
      cell.addEventListener("click", handleCellClick);
      gridElement.appendChild(cell);
      row.push(cell);
    }
    grid.push(row);
  }
}

/* 🎯 Cell Selection */
function handleCellClick(e) {
  const cell = e.target;
  if (mode === "start") {
    if (start) start.classList.remove("start");
    start = cell;
    cell.classList.add("start");
  } else if (mode === "end") {
    if (end) end.classList.remove("end");
    end = cell;
    cell.classList.add("end");
  } else if (mode === "wall") {
    cell.classList.toggle("wall");
  }
}

/* 🧮 Helper Functions */
function getNeighbors(r, c) {
  const dirs = [[1,0],[-1,0],[0,1],[0,-1]];
  return dirs
    .map(([dr, dc]) => [r + dr, c + dc])
    .filter(([nr, nc]) =>
      nr >= 0 && nr < rows &&
      nc >= 0 && nc < cols &&
      !grid[nr][nc].classList.contains("wall")
    )
    .map(([nr, nc]) => grid[nr][nc]);
}

const sleep = (ms) => new Promise(res => setTimeout(res, ms));

/* 🔍 BFS – Unweighted Shortest Path */
async function bfs() {
  const queue = [start];
  const parent = new Map();
  const visited = new Set([start]);

  while (queue.length) {
    const current = queue.shift();
    if (current === end) break;

    for (const neighbor of getNeighbors(+current.dataset.row, +current.dataset.col)) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        parent.set(neighbor, current);
        queue.push(neighbor);
        if (neighbor !== end) neighbor.classList.add("visited-bfs");
        stepCount++;
        updateStatus("bfs", stepCount);
        await sleep(10);
      }
    }
  }
  drawPath(parent, "bfs");
}

/* ⚙️ Dijkstra – Weighted Shortest Path */
async function dijkstra() {
  const dist = new Map();
  const parent = new Map();
  const pq = [];

  grid.flat().forEach(cell => dist.set(cell, Infinity));
  dist.set(start, 0);
  pq.push([0, start]);

  while (pq.length) {
    pq.sort((a,b)=>a[0]-b[0]);
    const [d, current] = pq.shift();
    if (current === end) break;

    for (const neighbor of getNeighbors(+current.dataset.row, +current.dataset.col)) {
      const alt = d + +neighbor.dataset.weight;
      if (alt < dist.get(neighbor)) {
        dist.set(neighbor, alt);
        parent.set(neighbor, current);
        pq.push([alt, neighbor]);
        if (neighbor !== end) neighbor.classList.add("visited-dijkstra");
        stepCount++;
        updateStatus("dijkstra", stepCount);
        await sleep(25);
      }
    }
  }
  drawPath(parent, "dijkstra");
}

/* 🧭 Path Visualization */
async function drawPath(parent, algo) {
  let curr = end, pathLength = 0;

  if (!parent.has(end)) {
    noPathPopup.style.display = "block";
    setTimeout(()=> noPathPopup.style.display = "none", 2500);
    updateStatus(algo, stepCount, 0);
    return;
  }

  while (curr && curr !== start) {
    curr.classList.add(algo === "bfs" ? "path-bfs" : "path-dijkstra");
    curr = parent.get(curr);
    pathLength++;
    await sleep(20);
  }

  updateStatus(algo, stepCount, pathLength);
}

/* 🖱️ Button Controls */
document.getElementById("setStart").addEventListener("click", () => mode = "start");
document.getElementById("setEnd").addEventListener("click", () => mode = "end");
document.getElementById("addWalls").addEventListener("click", () => mode = "wall");
document.getElementById("toggleWeights").addEventListener("click", () => {
  showWeights = !showWeights;
  grid.flat().forEach(c => c.textContent = showWeights ? c.dataset.weight : "");
});
document.getElementById("visualize").addEventListener("click", async () => {
  if (!start || !end) return alert("Please set start and end!");
  stepCount = 0;
  updateStatus(algoSelect.value, stepCount);
  showLoader(true);
  if (algoSelect.value === "bfs") await bfs();
  else await dijkstra();
  showLoader(false);
});
document.getElementById("reset").addEventListener("click", createGrid);

/* 🔄 Handle Resize */
window.addEventListener("resize", () => {
  calculateGridSize();
  createGrid();
});

/* 🚀 Initialize App */
applyRandomTheme();
startClock();
createGrid();
