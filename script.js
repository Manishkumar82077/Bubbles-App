const circles = document.querySelectorAll(".circle");
const arrows = document.querySelectorAll(".arrow");
const resetBtn = document.getElementById("resetBtn");
const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const scoreBoard = document.getElementById("score");
const timerBoard = document.getElementById("timer");
const bestBoard = document.getElementById("best");

const demoPop = document.getElementById("demoPop");
const startDemoBtn = document.getElementById("startDemoBtn");

const initialColors = ["gray", "blue", "red", "green"];
const ARROW_HEAD = 18;

let score = 0;
let bestScore = localStorage.getItem("bestScore") || 0;
let timeLeft = 15; // 15 seconds
let timer = null;
let gameActive = false;

bestBoard.textContent = `Best Score: ${bestScore}`;

// Initialize circles
circles.forEach((circle, i) => {
  circle.dataset.count = 0;
  circle.style.background = initialColors[i];
  circle.textContent = "0";

  circle.addEventListener("click", () => {
    if (!gameActive) return;

    const arrow = arrows[i];
    const row = circle.closest(".row");

    const circleRect = circle.getBoundingClientRect();
    const rowRect = row.getBoundingClientRect();
    const circleRadius = circleRect.width / 2;

    const baseDistance = rowRect.right - circleRect.left;
    const distanceFromRight = baseDistance - circleRadius - 70 - ARROW_HEAD / 2;

    arrow.style.right = `${distanceFromRight}px`;

    setTimeout(() => {
      const newColor = getRandomColor(initialColors[i]);
      circle.style.background = newColor;

      circle.style.transform = "scale(1.2)";
      setTimeout(() => (circle.style.transform = "scale(1)"), 300);

      circle.dataset.count = parseInt(circle.dataset.count) + 1;
      circle.textContent = circle.dataset.count;

      updateScore();

      setTimeout(() => {
        arrow.style.right = "30px";
      }, 1000);
    }, 500);
  });
});

// Random color generator
function getRandomColor(exclude) {
  let color;
  do {
    color = "#" + Math.floor(Math.random() * 16777215).toString(16);
  } while (color.toLowerCase() === exclude.toLowerCase());
  return color;
}

function updateScore(points = 1) {
  score += points;
  scoreBoard.textContent = `Score: ${score}`;
}

function endGame() {
  gameActive = false;
  clearInterval(timer);
  startBtn.style.display = "inline-block"; // show start button again
  stopBtn.style.display = "none";          // hide stop button
  if (score > bestScore) {
    bestScore = score;
    localStorage.setItem("bestScore", bestScore);
  }
  bestBoard.textContent = `Best Score: ${bestScore}`;
  timerBoard.textContent = `Time: 15s`; // reset timer visually
}

 
// Start game manually via popup button
startDemoBtn.addEventListener("click", () => {
  demoPop.style.display = "none"; // hide popup
  startActualGame();               // start game
});

// Start the actual game
function startActualGame() {
  score = 0;
  timeLeft = 15; // game duration 15s
  gameActive = true;

  scoreBoard.textContent = `Score: ${score}`;
  timerBoard.textContent = `Time: ${timeLeft}s`;

  startBtn.style.display = "none";
  stopBtn.style.display = "inline-block";

  clearInterval(timer);
  timer = setInterval(() => {
    if (timeLeft > 0) {
      timeLeft--;
      timerBoard.textContent = `Time: ${timeLeft}s`;
    } else {
      endGame(); // button shows immediately after game ends
    }
  }, 1000);
}

// Stop Game
stopBtn.addEventListener("click", () => {
  gameActive = false;
  clearInterval(timer);
  startBtn.style.display = "inline-block";
  stopBtn.style.display = "none";
});

// Reset Game
resetBtn.addEventListener("click", () => {
  arrows.forEach(arrow => (arrow.style.right = "30px"));
  circles.forEach((circle, i) => {
    circle.dataset.count = 0;
    circle.style.background = initialColors[i];
    circle.textContent = "0";
  });
  score = 0;
  timeLeft = 15; // reset timer
  scoreBoard.textContent = "Score: 0";
  timerBoard.textContent = "Time: 15s";
  startBtn.style.display = "inline-block";
  stopBtn.style.display = "none";
});
startBtn.addEventListener("click", () => {
  demoPop.style.display = "block"; // show popup
  startBtn.style.display = "none"; // hide button while popup is open
});
