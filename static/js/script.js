const cells = document.querySelectorAll(".cell");
const gameMode = document.getElementById("game-mode");
const algorithm = document.getElementById("algorithm");
const newGameButton = document.getElementById("new-game-btn");
const statusText = document.getElementById("status");
const messageText = document.getElementById("message");

let gameState = null;
let isRequesting = false;


async function startNewGame() {
    if (isRequesting) {
        return;
    }

    isRequesting = true;

    try {
        const response = await fetch("/api/new-game", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                mode: gameMode.value,
                algorithm: algorithm.value
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Could not start a new game.");
        }

        gameState = data;
        updateBoard();
        updateGameInfo();

    } catch (error) {
        messageText.textContent = error.message;
    } finally {
        isRequesting = false;
    }
}


async function makeMove(position) {
    if (isRequesting || !gameState) {
        return;
    }

    if (gameState.status !== "playing") {
        return;
    }

    if (gameState.board[position] !== "") {
        return;
    }

    isRequesting = true;

    try {
        const response = await fetch("/api/move", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                position: position
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Invalid move.");
        }

        gameState = data;
        updateBoard();
        updateGameInfo();

    } catch (error) {
        messageText.textContent = error.message;
    } finally {
        isRequesting = false;
    }
}


function updateBoard() {
    cells.forEach((cell, index) => {
        const value = gameState.board[index];

        cell.textContent = value;

        cell.disabled =
            value !== "" ||
            gameState.status !== "playing";

        if (value === "X") {
            cell.style.color = "#60a5fa";
        } else if (value === "O") {
            cell.style.color = "#f87171";
        } else {
            cell.style.color = "white";
        }
    });
}


function updateGameInfo() {
    if (gameState.status === "won") {
        statusText.textContent = `Player ${gameState.winner} Wins!`;
        messageText.textContent = "Congratulations!";
        return;
    }

    if (gameState.status === "draw") {
        statusText.textContent = "It's a Draw!";
        messageText.textContent = "No more empty cells.";
        return;
    }

    statusText.textContent = `Player ${gameState.current_player}'s Turn`;

    if (gameState.mode === "ai") {
        if (gameState.current_player === "X") {
            messageText.textContent = "Choose an empty cell to make your move.";
        } else {
            messageText.textContent = "AI is thinking...";
        }
    } else {
        messageText.textContent = "Choose an empty cell to make your move.";
    }
}


cells.forEach((cell) => {
    cell.addEventListener("click", () => {
        const position = Number(cell.dataset.position);
        makeMove(position);
    });
});


newGameButton.addEventListener("click", startNewGame);

gameMode.addEventListener("change", startNewGame);
algorithm.addEventListener("change", startNewGame);


startNewGame();