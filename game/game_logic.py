
# Tic Tac Toe - Game Logic

WINNING_COMBINATIONS = [
    (0, 1, 2),
    (3, 4, 5),
    (6, 7, 8),
    (0, 3, 6),
    (1, 4, 7),
    (2, 5, 8),
    (0, 4, 8),
    (2, 4, 6)
]


def create_board():
    """Create an empty Tic Tac Toe board."""
    return [""] * 9


def get_available_moves(board):
    """Return all empty cell positions."""
    return [
        index for index, cell in enumerate(board)
        if cell == ""
    ]


def get_winner(board):
    """Check whether X or O has won."""
    for a, b, c in WINNING_COMBINATIONS:
        if board[a] and board[a] == board[b] == board[c]:
            return board[a]

    return None


def is_draw(board):
    """Check whether the game is a draw."""
    return get_winner(board) is None and "" not in board


def make_move(board, position, player):
    """Place a player's symbol on the board."""
    if player not in ("X", "O"):
        raise ValueError("Player must be X or O.")

    if not isinstance(position, int) or not 0 <= position < 9:
        raise ValueError("Position must be between 0 and 8.")

    if board[position] != "":
        return False

    if get_winner(board) is not None or is_draw(board):
        return False

    board[position] = player
    return True
