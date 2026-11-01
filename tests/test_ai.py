
import pytest

from game.ai_engine import get_best_move
from game.game_logic import create_board, get_winner


@pytest.mark.parametrize("algorithm", ["minimax", "alpha_beta"])
def test_ai_takes_winning_move(algorithm):
    board = ["O", "O", "",
             "X", "X", "",
             "", "", ""]

    move = get_best_move(board, algorithm)

    assert move == 2


@pytest.mark.parametrize("algorithm", ["minimax", "alpha_beta"])
def test_ai_blocks_human_winning_move(algorithm):
    board = ["X", "X", "",
             "O", "", "",
             "", "", ""]

    move = get_best_move(board, algorithm)

    assert move == 2


@pytest.mark.parametrize("algorithm", ["minimax", "alpha_beta"])
def test_ai_finds_a_valid_move(algorithm):
    board = create_board()

    move = get_best_move(board, algorithm)

    assert move in range(9)


def test_ai_does_not_change_original_board():
    board = ["X", "", "",
             "", "O", "",
             "", "", ""]

    original_board = board.copy()

    get_best_move(board)

    assert board == original_board


def test_ai_returns_none_after_winner():
    board = ["X", "X", "X",
             "O", "O", "",
             "", "", ""]

    assert get_best_move(board) is None


def test_ai_returns_none_when_board_is_full():
    board = ["X", "O", "X",
             "X", "O", "O",
             "O", "X", "X"]

    assert get_best_move(board) is None


def test_ai_rejects_unknown_algorithm():
    board = create_board()

    with pytest.raises(ValueError):
        get_best_move(board, "unknown")
