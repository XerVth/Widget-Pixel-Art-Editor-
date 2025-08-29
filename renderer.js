const gridContainer = document.getElementById("grid");
const canvasSizeSelect = document.getElementById("canvasSize");
const colorPicker = document.getElementById("colorPicker");
const eraserBtn = document.getElementById("eraserBtn");
const clearBtn = document.getElementById("clearBtn");
const saveBtn = document.getElementById("saveBtn");

let currentColor = colorPicker.value;
let gridSize = parseInt(canvasSizeSelect.value);
let pixels = [];
let isDrawing = false;
let tool = "brush"; // "brush" or "eraser"

// -------------------------------
// Create grid
// -------------------------------
function createGrid(size) {
  gridContainer.innerHTML = "";
  pixels = [];

  gridContainer.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
  gridContainer.style.gridTemplateRows = `repeat(${size}, 1fr)`;

  for (let i = 0; i < size * size; i++) {
    const pixel = document.createElement("div");
    pixel.classList.add("pixel");

    // Paint or erase on click
    pixel.addEventListener("mousedown", () => {
      isDrawing = true;
      paintPixel(pixel);
    });

    // Paint or erase while dragging
    pixel.addEventListener("mouseover", () => {
      if (isDrawing) {
        paintPixel(pixel);
      }
    });

    gridContainer.appendChild(pixel);
    pixels.push(pixel);
  }

  document.addEventListener("mouseup", () => {
    isDrawing = false;
  });
}

// -------------------------------
// Paint or erase a pixel
// -------------------------------
function paintPixel(pixel) {
  if (tool === "eraser") {
    pixel.style.backgroundColor = "transparent";    // set to transparent for eraser
  } else {
    pixel.style.backgroundColor = currentColor;
    addRecentColor(currentColor); // add to recent colors only when painting
  }
}

// -------------------------------
// Color picker
// -------------------------------
colorPicker.addEventListener("input", (e) => {
  currentColor = e.target.value;
  tool = "brush"; // switch to brush
});
// Automatically switch to brush even if the same color is clicked
colorPicker.addEventListener("mousedown", () => {
  tool = "brush";
});
// -------------------------------
// Eraser button
// -------------------------------
eraserBtn.addEventListener("click", () => {
  tool = "eraser";
});

// -------------------------------
// Recent colors palette
// -------------------------------
const recentColorsContainer = document.getElementById("recentColors");
let recentColors = []; // store last N colors
const maxRecentColors = 13; // number of recent colors to show

// -------------------------------
// Update recent colors palette
// -------------------------------
function addRecentColor(color) {
  // remove duplicate
  recentColors = recentColors.filter(c => c !== color);
  recentColors.unshift(color); // add new color at start

  // limit size
  if (recentColors.length > maxRecentColors) {
    recentColors.pop();
  }

  // redraw palette
  recentColorsContainer.innerHTML = "";
  recentColors.forEach(c => {
    const colorDiv = document.createElement("div");
    colorDiv.style.backgroundColor = c;
    colorDiv.style.width = "30px";
    colorDiv.style.height = "30px";
    colorDiv.style.border = "1px solid #333";
    colorDiv.style.cursor = "pointer";

    colorDiv.addEventListener("click", () => {
      currentColor = c;
      tool = "brush"; // switch to brush when clicking recent color
    });

    recentColorsContainer.appendChild(colorDiv);
  });
}

// -------------------------------
// Update color picker logic to add to recent
// -------------------------------
colorPicker.addEventListener("input", (e) => {
  currentColor = e.target.value;
  tool = "brush"; // switch to brush
  addRecentColor(currentColor);
});

// -------------------------------
// Change grid size
// -------------------------------
canvasSizeSelect.addEventListener("change", (e) => {
  gridSize = parseInt(e.target.value);
  createGrid(gridSize);
});

// -------------------------------
// Clear canvas
// -------------------------------
clearBtn.addEventListener("click", () => {
  pixels.forEach(p => p.style.backgroundColor = "white");
});

// -------------------------------
// Save as SVG
// -------------------------------
saveBtn.addEventListener("click", () => {
  const svgParts = [];
  const pixelSize = 20;

  svgParts.push(`<svg xmlns="http://www.w3.org/2000/svg" width="${gridSize * pixelSize}" height="${gridSize * pixelSize}">`);

  pixels.forEach((p, i) => {
    const color = p.style.backgroundColor || "white";
    if (color !== "white" && color !== "") {
      const x = (i % gridSize) * pixelSize;
      const y = Math.floor(i / gridSize) * pixelSize;
      svgParts.push(`<rect x="${x}" y="${y}" width="${pixelSize}" height="${pixelSize}" fill="${color}" />`);
    }
  });

  svgParts.push("</svg>");

  const blob = new Blob([svgParts.join("")], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "pixel-art.svg";
  a.click();

  URL.revokeObjectURL(url);
});

// -------------------------------
// Init
// -------------------------------
createGrid(gridSize);
