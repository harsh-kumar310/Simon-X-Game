// --- Element Selectors ---
const gameOverScreen = document.querySelector("#game-over-screen");
const finalScoreSpan = document.querySelector("#final-score");
const finalHighScoreSpan = document.querySelector("#final-high-score");
const playAgainBtn = document.querySelector("#play-again-btn");
const h2 = document.querySelector("h2");
const highScoreP = document.querySelector("#high-score-p");
const allBtns = document.querySelectorAll(".btn");
const themeButtons = document.querySelectorAll(".theme-switcher button");
const body = document.querySelector("body");
const overlay = document.querySelector("#background-overlay");

// --- New Elements for Username + Leaderboard ---
const nameBox = document.querySelector("#name-input-box");
const startBtn = document.querySelector("#start-btn");
const usernameInput = document.querySelector("#username");
const leaderboardDiv = document.querySelector("#leaderboard");
const leaderboardList = document.querySelector("#leaderboard-list");

// ✅ New: Clear Leaderboard Button
const clearLeaderboardBtn = document.createElement("button");
clearLeaderboardBtn.id = "clear-leaderboard-btn";
clearLeaderboardBtn.innerText = "Clear Leaderboard";
document.querySelector("#leaderboard-box").appendChild(clearLeaderboardBtn);

// --- Game Variables ---
let gameSeq = [];
let userSeq = [];
let btns = ["red", "yellow", "green", "purple"];
let started = false;
let level = 0;
let highScore = 0;
let currentUser = "";

// --- Event Listeners ---
window.addEventListener("load", () => {
  nameBox.style.display = "flex";
});

startBtn.addEventListener("click", () => {
  const name = usernameInput.value.trim();
  if (name === "") {
    alert("Please enter your name!");
    return;
  }
  currentUser = name;
  nameBox.style.display = "none";
  leaderboardDiv.classList.remove("hidden");
  started = false;
  highScore = getUserHighScore(name);
  highScoreP.innerText = `${name}'s Highest Score: ${highScore}`;
  h2.innerText = "Press any key to start the Game";
  displayLeaderboard();
});

document.addEventListener("keypress", function () {
  if (!started && currentUser !== "") {
    started = true;
    h2.innerText = "3";
    setTimeout(() => { h2.innerText = "2"; }, 1000);
    setTimeout(() => { h2.innerText = "1"; }, 2000);
    setTimeout(() => { levelUp(); }, 3000);
  }
});

for (let btn of allBtns) {
  btn.addEventListener("click", btnPress);
}

playAgainBtn.addEventListener("click", function () {
  gameOverScreen.classList.add("hidden");
  reset();
  h2.innerHTML = `Press any key to start`;
});

// Theme switcher
themeButtons.forEach((button) => {
  button.addEventListener("click", function () {
    const theme = this.dataset.theme;
    body.classList.remove("light-theme", "dark-theme");
    if (theme === "dark") {
      body.classList.add("dark-theme");
    }
  });
});

// ✅ Clear Leaderboard Functionality
clearLeaderboardBtn.addEventListener("click", () => {
  if (confirm("Are you sure you want to clear all leaderboard data?")) {
    localStorage.removeItem("users");
    leaderboardList.innerHTML = "";
    alert("Leaderboard cleared!");
  }
});

// --- Game Functions ---
function gameFlash(btn) {
  btn.classList.add("flash");
  setTimeout(() => btn.classList.remove("flash"), 250);
}

function userFlash(btn) {
  btn.classList.add("userflash");
  setTimeout(() => btn.classList.remove("userflash"), 250);
}

function levelUp() {
  userSeq = [];
  level++;
  h2.innerText = `Level ${level}`;

  let newOpacity = level * 0.05;
  if (newOpacity > 0.7) newOpacity = 0.7;
  overlay.style.opacity = newOpacity;

  let randIdx = Math.floor(Math.random() * btns.length);
  let randColor = btns[randIdx];
  let randBtn = document.querySelector(`.${randColor}`);
  gameSeq.push(randColor);
  gameFlash(randBtn);
}

function checkAns(idx) {
  if (userSeq[idx] === gameSeq[idx]) {
    if (userSeq.length === gameSeq.length) {
      setTimeout(levelUp, 1000);
    }
  } else {
    let score = level - 1;
    finalScoreSpan.innerText = score;
    finalHighScoreSpan.innerText = highScore;

    if (score > highScore) {
      highScore = score;
      updateUserHighScore(currentUser, score);
      highScoreP.innerText = `${currentUser}'s Highest Score: ${highScore}`;
      finalHighScoreSpan.innerText = highScore;
    }

    gameOverScreen.classList.remove("hidden");
  }
}

function btnPress() {
  if (!started) return;
  let btn = this;
  userFlash(btn);
  let userColor = btn.getAttribute("id");
  userSeq.push(userColor);
  checkAns(userSeq.length - 1);
}

function reset() {
  started = false;
  gameSeq = [];
  userSeq = [];
  level = 0;
  overlay.style.opacity = 0;
}

// --- User Score Management ---
function getUserHighScore(name) {
  const users = JSON.parse(localStorage.getItem("users")) || {};
  return users[name] || 0;
}

function updateUserHighScore(name, score) {
  const users = JSON.parse(localStorage.getItem("users")) || {};
  if (!users[name] || score > users[name]) {
    users[name] = score;
    localStorage.setItem("users", JSON.stringify(users));
  }
  displayLeaderboard();
}

function displayLeaderboard() {
  const users = JSON.parse(localStorage.getItem("users")) || {};
  leaderboardList.innerHTML = "";
  for (let user in users) {
    const li = document.createElement("li");
    li.textContent = `${user}: ${users[user]}`;
    leaderboardList.appendChild(li);
  }
}
