// Global variables for the game setup
let tilemap = []; // Array representing the tile map (1 for walls, 0 for open spaces)
let tileSize = 40; // Size of each tile in pixels
let player = { x: 2, y: 2 }; // Player's starting position
let items = []; // Array to store positions of collectible items
let score = 0; // Player's score
let isGameOver = false; // Flag to indicate if the game is over
const mapRows = 50; // Number of rows in the tilemap
const mapCols = 50; // Number of columns in the tilemap
let gameTime = 300; // Total game time in seconds (5 minutes)
let startTime; // Variable to store the start time of the game

// Setup function runs once when the program starts
function setup() {
    createCanvas(windowWidth, windowHeight); // Create a canvas that fills the window
    frameRate(30); // Set the frame rate
    generateTilemap(); // Generate the initial tilemap
    generateItems(20); // Place 20 collectible items on the map
    startTime = millis(); // Record the start time
}

// Draw function runs in a loop and is used for rendering
function draw() {
    if (isGameOver) {
        displayGameOver(); // Display the game over or victory message
    } else {
        updateGameTime(); // Update the remaining game time
        background(220); // Set the background color
        // Center the view on the player
        translate(width / 2 - player.x * tileSize, height / 2 - player.y * tileSize);
        drawTilemap(); // Draw the tilemap
        drawPlayer(); // Draw the player
        collectItems(); // Handle item collection
        displayScoreAndTime(); // Display the remaining time
    }
}

// Update the game time and check if the game is over
function updateGameTime() {
    let elapsed = (millis() - startTime) / 1000; // Calculate elapsed time in seconds
    gameTime = max(300 - elapsed, 0); // Update remaining game time
    
    if (gameTime <= 0) { // If time runs out, end the game
        isGameOver = true;
    }
}

// Function to display the game over or victory message
function displayGameOver() {
    background(0); // Set background color to black for contrast
    fill('red'); // Set text color to red
    textSize(50); // Set text size
    textAlign(CENTER, CENTER); // Center the text
    // Display appropriate message based on whether the player won or lost
    let message = gameTime <= 0 ? "Time's Up - Game Over" : "You Found the Gate - Victory!";
    text(message, width / 2, height / 2);
}

// Function to display the score and remaining time
function displayScoreAndTime() {
    resetMatrix(); // Reset transformations to display UI elements correctly
    fill(0); // Set text color to black
    textSize(24); // Set text size for UI
    text(`Time: ${Math.floor(gameTime)}`, 10, 30); // Display the remaining time
}

// keyPressed function to update player position based on keyboard input
function keyPressed() {
    if (isGameOver) return; // Ignore input if the game is over
    
    // Update player position based on arrow keys, preventing movement out of bounds
    if (keyCode === LEFT_ARROW && player.x > 0) player.x--;
    if (keyCode === RIGHT_ARROW && player.x < mapCols - 1) player.x++;
    if (keyCode === UP_ARROW && player.y > 0) player.y--;
    if (keyCode === DOWN_ARROW && player.y < mapRows - 1) player.y++;
    
    // Check if the player has found a gate
    if (isGate(player.y, player.x)) {
        isGameOver = true; // End the game successfully
    }
}

// Function to check if a specified position is a gate
function isGate(y, x) {
    return (x === 0 || x === mapCols - 1 || y === 0 || y === mapRows - 1) && tilemap[y][x] === 0;
}

// generateTilemap, generateItems, drawTilemap, drawPlayer, collectItems, createGates functions remain the same as previously described
// Generates items at random positions on the map
function generateItems(numItems) {
  for (let i = 0; i < numItems; i++) {
      let placed = false;
      while (!placed) {
          let x = Math.floor(random(1, mapCols - 1));
          let y = Math.floor(random(1, mapRows - 1));
          if (tilemap[y][x] === 0 && !(x === player.x && y === player.y)) {
              items.push({x: x, y: y});
              placed = true;
          }
      }
  }
}

// Draws the tilemap on the canvas
function drawTilemap() {
  for (let y = 0; y < tilemap.length; y++) {
      for (let x = 0; x < tilemap[y].length; x++) {
          fill(tilemap[y][x] === 1 ? 'black' : 'green');
          noStroke();
          rect(x * tileSize, y * tileSize, tileSize, tileSize);
      }
  }
  // Draw items as yellow dots
  fill('yellow');
  items.forEach(item => {
      ellipse(item.x * tileSize + tileSize / 2, item.y * tileSize + tileSize / 2, tileSize / 2, tileSize / 2);
  });
}

function drawPlayer() {
  fill('white'); // Set the color of the heart to white
  noStroke();
  // Calculate the center position of the player
  let centerX = player.x * tileSize + tileSize / 2;
  let centerY = player.y * tileSize + tileSize / 2;

  push(); // Save the current drawing style settings and transformations
  translate(centerX, centerY - tileSize * 0.2); // Adjust drawing position for the heart

  // Start drawing the heart shape
  beginShape();
  vertex(0, -tileSize * 0.2);
  bezierVertex(-tileSize * 0.2, -tileSize * 0.3, -tileSize * 0.4, -tileSize * 0.1, -tileSize * 0.4, tileSize * 0.1);
  bezierVertex(-tileSize * 0.4, tileSize * 0.3, -tileSize * 0.2, tileSize * 0.5, 0, tileSize * 0.6);
  bezierVertex(tileSize * 0.2, tileSize * 0.5, tileSize * 0.4, tileSize * 0.3, tileSize * 0.4, tileSize * 0.1);
  bezierVertex(tileSize * 0.4, -tileSize * 0.1, tileSize * 0.2, -tileSize * 0.3, 0, -tileSize * 0.2);
  endShape(CLOSE);

  pop(); // Restore the previous drawing style settings and transformations
}

// Checks for and handles item collection, updating the score
function collectItems() {
  items = items.filter(item => {
      if (item.x === player.x && item.y === player.y) {
          // Increase score or perform other actions here
          return false; // Item is collected and removed from the array
      }
      return true; // Item remains in the array if not collected
  });
}

// Creates gates in the map by setting specific edge positions to 0
function createGates() {
  tilemap[0][Math.floor(random(1, mapCols - 1))] = 0; // Top gate
  tilemap[Math.floor(random(1, mapRows - 1))][mapCols - 1] = 0; // Right gate
  tilemap[mapRows - 1][Math.floor(random(1, mapCols - 1))] = 0; // Bottom gate
}

// Generates the tilemap with borders, random obstacles, and gates
function generateTilemap() {
  for (let y = 0; y < mapRows; y++) {
      let row = [];
      for (let x = 0; x < mapCols; x++) {
          // Generate walls around the map and random obstacles inside
          let tile = (x === 0 || y === 0 || x === mapCols - 1 || y === mapRows - 1 || random() > 0.8) ? 1 : 0;
          row.push(tile);
      }
      tilemap.push(row);
  }
  createGates(); // Call the function to create gates in the tilemap
}
