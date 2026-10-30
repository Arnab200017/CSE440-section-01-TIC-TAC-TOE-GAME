
import secrets

from flask import Flask, jsonify, render_template, request, session

from game.game_logic import (
    create_board,
    get_winner,
    is_draw,
    make_move,
)

from game.ai_engine import get_best_move


app = Flask(__name__)
app.secret_key = secrets.token_hex(32)


def initialize_game(mode="ai", algorithm="alpha_beta"):
    """Initialize a new game in the current browser session."""

    session["board"] = create_board()
    session["current_player"] = "X"
    session["mode"] = mode
    session["algorithm"] = algorithm


def get_game_state():
    """Return the current game information."""

    board = session.get("board", create_board())
    winner = get_winner(board)

    if winner:
        status = "won"
    elif is_draw(board):
        status = "draw"
    else:
        status = "playing"

    return {
        "board": board,
        "current_player": session.get("current_player", "X"),
        "mode": session.get("mode", "ai"),
        "algorithm": session.get("algorithm", "alpha_beta"),
        "winner": winner,
        "status": status,
    }


@app.route("/")
def home():
    """Display the main game page."""

    if "board" not in session:
        initialize_game()

    return render_template("index.html")


@app.route("/api/new-game", methods=["POST"])
def new_game():
    """Start a new game with the selected settings."""

    data = request.get_json(silent=True) or {}

    mode = data.get("mode", "ai")
    algorithm = data.get("algorithm", "alpha_beta")

    if mode not in ("ai", "human"):
        return jsonify({"error": "Invalid game mode."}), 400

    if algorithm not in ("minimax", "alpha_beta"):
        return jsonify({"error": "Invalid AI algorithm."}), 400

    initialize_game(mode, algorithm)

    return jsonify(get_game_state())


@app.route("/api/move", methods=["POST"])
def make_player_move():
    """Process a player's move and, if needed, the AI's response."""

    if "board" not in session:
        initialize_game()

    data = request.get_json(silent=True) or {}
    position = data.get("position")

    if isinstance(position, bool) or not isinstance(position, int):
        return jsonify({"error": "Position must be an integer."}), 400

    board = session["board"]

    if get_winner(board) or is_draw(board):
        return jsonify({"error": "The game is already finished."}), 400

    player = session["current_player"]

    try:
        if not make_move(board, position, player):
            return jsonify({"error": "Invalid or occupied position."}), 400

    except ValueError as error:
        return jsonify({"error": str(error)}), 400

    if get_winner(board) or is_draw(board):
        session["board"] = board
        return jsonify(get_game_state())

    if session["mode"] == "ai":
        ai_position = get_best_move(
            board,
            algorithm=session["algorithm"],
        )

        if ai_position is not None:
            make_move(board, ai_position, "O")

        session["board"] = board

    else:
        session["current_player"] = (
            "O" if player == "X" else "X"
        )

        session["board"] = board

    return jsonify(get_game_state())


if __name__ == "__main__":
    app.run(debug=True)
