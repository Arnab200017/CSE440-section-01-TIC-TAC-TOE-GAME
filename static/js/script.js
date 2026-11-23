/* ================= ELEMENTS ================= */
const cells = document.querySelectorAll(".cell");
const gameMode = document.getElementById("game-mode");
const algorithm = document.getElementById("algorithm");
const algoBox = document.getElementById("algorithm-box");
const namesBox = document.getElementById("names");
const p1Input = document.getElementById("p1-name");
const p2Input = document.getElementById("p2-name");
const tagline = document.getElementById("tagline");
const newGameButton = document.getElementById("new-game-btn");
const soundButton = document.getElementById("sound-btn");
const statusText = document.getElementById("status");
const messageText = document.getElementById("message");
const gameInfo = document.querySelector(".game-info");

const humanCard = document.querySelector(".character.human");
const robotCard = document.querySelector(".character.robot");
const humanPic = document.getElementById("human-pic");
const robotPic = document.getElementById("robot-pic");
const humanName = document.getElementById("human-name");
const robotName = document.getElementById("robot-name");
const humanSub = document.getElementById("human-sub");
const robotSub = document.getElementById("robot-sub");

const welcome = document.getElementById("welcome");
const welcomeCard = document.getElementById("welcome-card");
const startButton = document.getElementById("start-btn");

const result = document.getElementById("result");
const resultCard = document.getElementById("result-card");
const resultEmoji = document.getElementById("result-emoji");
const resultTitle = document.getElementById("result-title");
const resultText = document.getElementById("result-text");
const resultHuman = document.getElementById("result-human");
const resultRobot = document.getElementById("result-robot");
const playAgainButton = document.getElementById("play-again-btn");
const fx = document.getElementById("fx");

let gameState = null;
let isRequesting = false;
let resultTimer = null;

/* ================= SOUND ================= */
let soundOn = true;
let audioCtx = null;

try { soundOn = localStorage.getItem("ttt-sound") !== "off"; } catch (e) {}

function refreshSoundButton() {
    soundButton.textContent = soundOn ? "🔊 Sound: On" : "🔇 Sound: Off";
}

function getAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === "suspended") audioCtx.resume();
    return audioCtx;
}

function tone(freqStart, delay, duration, type = "sine", volume = 0.15, freqEnd = null) {
    if (!soundOn) return;

    const ctx = getAudio();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const t = ctx.currentTime + delay;

    osc.type = type;
    osc.frequency.setValueAtTime(freqStart, t);
    if (freqEnd) osc.frequency.exponentialRampToValueAtTime(freqEnd, t + duration);

    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(volume, t + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + duration + 0.05);
}

function speak(text) {
    if (!soundOn || !("speechSynthesis" in window)) return;
    try {
        window.speechSynthesis.cancel();
        const voice = new SpeechSynthesisUtterance(text);
        voice.rate = 0.95;
        voice.pitch = 1.3;
        voice.volume = 1;
        window.speechSynthesis.speak(voice);
    } catch (e) {}
}

const sounds = {
    click: () => tone(600, 0, 0.07, "triangle", 0.1),
    X:     delay => tone(520, delay, 0.16, "triangle"),
    O:     delay => tone(330, delay, 0.2, "sine"),
    pop:   () => tone(900, 0, 0.1, "square", 0.08, 120),

    // BIG welcome: drum hit, rising run, then a full held chord
    welcomeBig: () => {
        tone(160, 0, 0.35, "sine", 0.35, 40);
        tone(200, 0.45, 0.3, "sine", 0.3, 50);

        [392, 440, 494, 523, 587, 659, 784, 880, 1047].forEach(
            (f, i) => tone(f, 0.2 + i * 0.09, 0.22, "triangle", 0.16)
        );

        [523, 659, 784, 1047].forEach(f => {
            tone(f, 1.1, 1.3, "triangle", 0.14);
            tone(f / 2, 1.1, 1.3, "sine", 0.1);
        });
        tone(1568, 1.1, 1.0, "sine", 0.08);

        [1319, 1568, 1760, 2093].forEach(
            (f, i) => tone(f, 1.5 + i * 0.1, 0.25, "sine", 0.07)
        );
    },

    win: () => {
        [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.14, 0.28, "triangle", 0.16));
        tone(1047, 0.6, 0.6, "triangle", 0.14);
        tone(1319, 0.6, 0.6, "sine", 0.1);
    },

    lose: () => {
        tone(392, 0,    0.3, "sawtooth", 0.09, 370);
        tone(370, 0.35, 0.3, "sawtooth", 0.09, 349);
        tone(349, 0.7,  0.3, "sawtooth", 0.09, 330);
        tone(330, 1.05, 0.9, "sawtooth", 0.09, 196);
    },

    draw: () => {
        tone(330, 0, 0.2, "sine");
        tone(294, 0.22, 0.35, "sine");
    }
};

soundButton.addEventListener("click", () => {
    soundOn = !soundOn;
    try { localStorage.setItem("ttt-sound", soundOn ? "on" : "off"); } catch (e) {}
    refreshSoundButton();
    sounds.click();
});

refreshSoundButton();

/* ================= EFFECTS ================= */
const PARTY_COLORS = ["#f2a6b5", "#ed9b78", "#7d91d7", "#a28acb", "#8fd3b6", "#f5d36b"];

function clearFx() {
    fx.innerHTML = "";
}

function launchBalloons(count = 20) {
    for (let i = 0; i < count; i++) {
        const balloon = document.createElement("div");
        const delay = Math.random() * 1.5;
        const duration = 4 + Math.random() * 3;

        balloon.className = "balloon";
        balloon.style.left = Math.random() * 94 + "%";
        balloon.style.background = PARTY_COLORS[i % PARTY_COLORS.length];
        balloon.style.animationDuration = duration + "s";
        balloon.style.animationDelay = delay + "s";
        fx.appendChild(balloon);

        if (i % 3 === 0) {
            setTimeout(() => sounds.pop(), (delay + duration * 0.4) * 1000);
        }
    }

    for (let i = 0; i < 40; i++) {
        const piece = document.createElement("div");
        piece.className = "confetti";
        piece.style.left = Math.random() * 100 + "%";
        piece.style.background = PARTY_COLORS[i % PARTY_COLORS.length];
        piece.style.animationDuration = 2.5 + Math.random() * 2.5 + "s";
        piece.style.animationDelay = Math.random() * 1.5 + "s";
        fx.appendChild(piece);
    }

    setTimeout(clearFx, 9000);
}

function startRain() {
    for (let i = 0; i < 28; i++) {
        const drop = document.createElement("div");
        drop.className = "drop";
        drop.textContent = "💧";
        drop.style.left = Math.random() * 100 + "%";
        drop.style.animationDuration = 1.8 + Math.random() * 1.8 + "s";
        drop.style.animationDelay = Math.random() * 2 + "s";
        fx.appendChild(drop);
    }
    setTimeout(clearFx, 6000);
}

/* floating decorations behind the welcome card */
(function buildWelcomeDecor() {
    const items = ["⭐", "✨", "♡", "❌", "⭕", "🎈", "💜", "🎉"];

    for (let i = 0; i < 22; i++) {
        const deco = document.createElement("span");
        deco.className = "float-deco";
        deco.textContent = items[i % items.length];
        deco.style.left = Math.random() * 100 + "%";
        deco.style.fontSize = 18 + Math.random() * 28 + "px";
        deco.style.animationDuration = 7 + Math.random() * 8 + "s";
        deco.style.animationDelay = -Math.random() * 12 + "s";
        deco.style.opacity = 0.7;
        welcome.appendChild(deco);
    }
})();

/* ================= NAMES ================= */
function isHumanMode() {
    return gameMode.value === "human";
}

// returns the display name for each side (X = left card, O = right card)
function getNames() {
    if (isHumanMode()) {
        return {
            x: p1Input.value.trim() || "Player 1",
            o: p2Input.value.trim() || "Player 2"
        };
    }
    return { x: "Human", o: "Robot" };
}

function renderNames() {
    const human = isHumanMode();
    const n = getNames();

    namesBox.classList.toggle("hidden", !human);
    algoBox.classList.toggle("hidden", human);
    tagline.textContent = human ? "Two players, one board!" : "Can you beat the robot?";

    humanPic.textContent = "👦🏻";
    robotPic.textContent = human ? "👧🏻" : "🤖";
    resultHuman.textContent = humanPic.textContent;
    resultRobot.textContent = robotPic.textContent;

    humanName.textContent = n.x;
    robotName.textContent = n.o;

    if (human) {
        humanSub.textContent = p1Input.value.trim() ? "Player 1" : "Human";
        robotSub.textContent = p2Input.value.trim() ? "Player 2" : "Human";
    } else {
        humanSub.textContent = "Player X";
        robotSub.textContent = "Player O";
    }
}

function onNameTyping() {
    renderNames();
    if (gameState && gameState.status === "playing") updateGameInfo();
}

p1Input.addEventListener("input", onNameTyping);
p2Input.addEventListener("input", onNameTyping);

/* ================= RESULT POPUP ================= */
function showResult() {
    const n = getNames();
    const nameOf = s => (s === "X" ? n.x : n.o);

    resultCard.classList.remove("win", "lose");

    if (gameState.status === "draw") {
        resultEmoji.textContent = "🤝";
        resultTitle.textContent = "It's a Draw!";
        resultText.textContent = "Great match! Nobody wins this time.";
        sounds.draw();

    } else if (isHumanMode()) {
        resultEmoji.textContent = "🏆";
        resultTitle.textContent = `${nameOf(gameState.winner)} Wins!`;
        resultText.textContent = "Congratulations! Well played, both of you.";
        resultCard.classList.add("win");
        sounds.win();
        launchBalloons();

    } else if (gameState.winner === "X") {
        resultEmoji.textContent = "🎉";
        resultTitle.textContent = "Congratulations!";
        resultText.textContent = "You beat the robot. Amazing!";
        resultCard.classList.add("win");
        sounds.win();
        launchBalloons();

    } else {
        resultEmoji.textContent = "😢";
        resultTitle.textContent = "Oh no! You lost";
        resultText.textContent = "The robot won this time. Want to try again?";
        resultCard.classList.add("lose");
        sounds.lose();
        startRain();
    }

    result.classList.remove("hidden");
}

function hideResult() {
    clearTimeout(resultTimer);
    result.classList.add("hidden");
    clearFx();
}

/* ================= API ================= */
async function postJSON(url, body) {
    const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Something went wrong.");
    return data;
}

async function startNewGame() {
    if (isRequesting) return;

    isRequesting = true;
    newGameButton.disabled = true;
    hideResult();
    renderNames();

    try {
        gameState = await postJSON("/api/new-game", {
            mode: gameMode.value,
            algorithm: algorithm.value
        });

        cells.forEach(cell => { cell.textContent = ""; });
        updateGameInfo();
    } catch (error) {
        messageText.textContent = error.message;
    } finally {
        isRequesting = false;
        newGameButton.disabled = false;
        updateBoard();
    }
}

async function makeMove(position) {
    if (isRequesting || !gameState) return;
    if (gameState.status !== "playing") return;
    if (gameState.board[position] !== "") return;

    isRequesting = true;

    if (gameState.mode === "ai") {
        gameInfo.classList.add("thinking");
        messageText.textContent = "Robot is thinking... 🤖";
        robotCard.classList.add("active");
        humanCard.classList.remove("active");
    }
    updateBoard();

    try {
        gameState = await postJSON("/api/move", { position });
    } catch (error) {
        messageText.textContent = error.message;
    } finally {
        isRequesting = false;
        gameInfo.classList.remove("thinking");
        updateBoard();
        if (gameState) updateGameInfo();
    }
}

/* ================= UI ================= */
function updateBoard() {
    if (!gameState) return;

    let newMarks = 0;

    cells.forEach((cell, index) => {
        const value = gameState.board[index];
        const wasEmpty = cell.textContent === "";

        cell.textContent = value;
        cell.classList.remove("mark-x", "mark-o");

        cell.disabled =
            isRequesting ||
            value !== "" ||
            gameState.status !== "playing";

        if (value === "X") cell.classList.add("mark-x");
        if (value === "O") cell.classList.add("mark-o");

        if (value !== "" && wasEmpty) {
            cell.classList.remove("pop");
            void cell.offsetWidth;
            cell.classList.add("pop");

            sounds[value](newMarks * 0.3);
            newMarks++;
        }
    });
}

function updateGameInfo() {
    const n = getNames();
    const nameOf = s => (s === "X" ? n.x : n.o);

    gameInfo.classList.remove("finished");
    humanCard.classList.remove("active");
    robotCard.classList.remove("active");

    if (gameState.status === "won") {
        statusText.textContent = `${nameOf(gameState.winner)} Wins!`;
        messageText.textContent = "Congratulations! 🎉";
        gameInfo.classList.add("finished");
        (gameState.winner === "X" ? humanCard : robotCard).classList.add("active");
        resultTimer = setTimeout(showResult, 900);
        return;
    }

    if (gameState.status === "draw") {
        statusText.textContent = "It's a Draw!";
        messageText.textContent = "Good game! Try again.";
        gameInfo.classList.add("finished");
        resultTimer = setTimeout(showResult, 900);
        return;
    }

    statusText.textContent = `${nameOf(gameState.current_player)}'s Turn`;
    (gameState.current_player === "X" ? humanCard : robotCard).classList.add("active");

    messageText.textContent =
        gameState.mode === "ai"
            ? "Your turn! Choose a box."
            : `${nameOf(gameState.current_player)}, choose a box!`;
}

/* ================= EVENTS ================= */
cells.forEach(cell => {
    cell.addEventListener("click", () => makeMove(Number(cell.dataset.position)));
});

newGameButton.addEventListener("click", () => { sounds.click(); startNewGame(); });
playAgainButton.addEventListener("click", () => { sounds.click(); startNewGame(); });
gameMode.addEventListener("change", startNewGame);
algorithm.addEventListener("change", startNewGame);

// Welcome: big sound + voice + balloons, then enter the game
startButton.addEventListener("click", () => {
    startButton.disabled = true;

    sounds.welcomeBig();
    speak("Welcome to Tic Tac Toe! Let's play!");
    welcomeCard.classList.add("party");
    launchBalloons(24);

    setTimeout(() => {
        welcome.classList.add("leaving");
        setTimeout(() => welcome.classList.add("hidden"), 600);
    }, 2400);
});

renderNames();
startNewGame();