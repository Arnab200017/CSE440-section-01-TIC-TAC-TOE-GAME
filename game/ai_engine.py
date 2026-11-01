
from game.game_logic import get_available_moves, get_winner, is_draw


def evaluate_board(board):
    """Evaluate the board from the AI's perspective."""
    winner = get_winner(board)

    if winner == "O":
        return 10

    if winner == "X":
        return -10

    return 0


def minimax(board, depth, is_maximizing):
    """Find the best possible outcome using Minimax."""

    winner = get_winner(board)

    if winner == "O":
        return 10 - depth

    if winner == "X":
        return depth - 10

    if is_draw(board):
        return 0

    if is_maximizing:
        best_score = float("-inf")

        for move in get_available_moves(board):
            board[move] = "O"

            score = minimax(board, depth + 1, False)

            board[move] = ""
            best_score = max(best_score, score)

        return best_score

    else:
        best_score = float("inf")

        for move in get_available_moves(board):
            board[move] = "X"

            score = minimax(board, depth + 1, True)

            board[move] = ""
            best_score = min(best_score, score)

        return best_score


def minimax_alpha_beta(board, depth, alpha, beta, is_maximizing):
    """Minimax algorithm with Alpha-Beta Pruning."""

    winner = get_winner(board)

    if winner == "O":
        return 10 - depth

    if winner == "X":
        return depth - 10

    if is_draw(board):
        return 0

    if is_maximizing:
        best_score = float("-inf")

        for move in get_available_moves(board):
            board[move] = "O"

            score = minimax_alpha_beta(
                board, depth + 1, alpha, beta, False
            )

            board[move] = ""
            best_score = max(best_score, score)
            alpha = max(alpha, best_score)

            if beta <= alpha:
                break

        return best_score

    else:
        best_score = float("inf")

        for move in get_available_moves(board):
            board[move] = "X"

            score = minimax_alpha_beta(
                board, depth + 1, alpha, beta, True
            )

            board[move] = ""
            best_score = min(best_score, score)
            beta = min(beta, best_score)

            if beta <= alpha:
                break

        return best_score


def get_best_move(board, algorithm="alpha_beta"):
    """Find the best move for AI (O)."""

    if get_winner(board) is not None or is_draw(board):
        return None

    best_score = float("-inf")
    best_move = None

    for move in get_available_moves(board):
        board[move] = "O"

        if algorithm == "minimax":
            score = minimax(board, 0, False)

        elif algorithm == "alpha_beta":
            score = minimax_alpha_beta(
                board, 0, float("-inf"), float("inf"), False
            )

        else:
            board[move] = ""
            raise ValueError("Unknown algorithm.")

        board[move] = ""

        if score > best_score:
            best_score = score
            best_move = move

    return best_move
