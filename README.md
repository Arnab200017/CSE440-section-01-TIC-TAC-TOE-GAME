# CSE440-section-01-TIC-TAC-TOE-GAME

A CSE440 Artificial Intelligence project that uses Minimax and Alpha-Beta Pruning to choose moves in Tic-Tac-Toe. The Flask backend manages the game board, validates moves, and provides JSON API routes.

## Features

- Minimax and Alpha-Beta Pruning AI algorithms
- Human vs AI and Human vs Human game modes
- Win, draw, and available-move detection
- API validation for invalid, occupied, and out-of-range moves
- Automated tests for routes, game logic, and AI decisions

## How the AI Works

The AI plays as **O** and the human player plays as **X** in Human vs AI mode. Both algorithms search possible future moves and select a move based on the game outcome. Alpha-Beta Pruning skips search branches that cannot change the final decision.

## Requirements

- Python
- Packages listed in `requirements.txt`

## Setup and Run

Open PowerShell in the project folder and run:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python app.py
```

Then open this address in your browser:

```text
http://127.0.0.1:5000
```

## Run the Tests

With the virtual environment activated, run:

```powershell
python -m pytest -q
```

## API Routes

### Start a new game

`POST /api/new-game`

Example request:

```json
{
  "mode": "ai",
  "algorithm": "alpha_beta"
}
```

Supported modes are `ai` and `human`. Supported algorithms are `minimax` and `alpha_beta`.

### Make a move

`POST /api/move`

Example request:

```json
{
  "position": 4
}
```

Positions range from `0` to `8`:

```text
0 | 1 | 2
---------
3 | 4 | 5
---------
6 | 7 | 8
```

The API returns the board, current player, game mode, selected algorithm, winner, and game status. Invalid positions and occupied cells are rejected.

## Project Structure

```text
.
├── app.py                 # Flask application and API routes
├── game/
│   ├── ai_engine.py       # Minimax and Alpha-Beta Pruning
│   └── game_logic.py      # Board, move, win, and draw logic
├── templates/
│   └── index.html         # Game page
├── static/
│   └── css/
│       └── style.css      # Page styling
├── tests/
│   ├── test_ai.py
│   ├── test_game_logic.py
│   └── test_routes.py
└── requirements.txt
```

## Current Branch Note

The game page refers to `static/js/script.js` for browser interactions. That file is not present in this backend branch, so the page's controls need the frontend JavaScript integration before the browser game can be played end to end.
