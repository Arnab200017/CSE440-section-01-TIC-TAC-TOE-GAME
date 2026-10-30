
import pytest

from game.game_logic import (
    create_board,
    get_available_moves,
    get_winner,
    is_draw,
    make_move
)


def test_create_board():
    board = create_board()

    assert len(board) == 9
    assert board == [""] * 9


def test_available_moves():
    board = ["X", "", "O", "", "", "", "", "", ""]

    moves = get_available_moves(board)

    assert moves == [1, 3, 4, 5, 6, 7, 8]


def test_make_valid_move():
    board = create_board()

    result = make_move(board, 0, "X")

    assert result is True
    assert board[0] == "X"


def test_prevent_occupied_cell():
    board = ["X"] + [""] * 8

    result = make_move(board, 0, "O")

    assert result is False
    assert board[0] == "X"


def test_horizontal_winner():
    board = ["X", "X", "X",
             "O", "O", "",
             "", "", ""]

    assert get_winner(board) == "X"


def test_vertical_winner():
    board = ["O", "X", "",
             "O", "X", "",
             "O", "", ""]

    assert get_winner(board) == "O"


def test_diagonal_winner():
    board = ["X", "O", "",
             "", "X", "O",
             "", "", "X"]

    assert get_winner(board) == "X"


def test_no_winner():
    board = ["X", "O", "X",
             "O", "X", "O",
             "O", "X", "O"]

    assert get_winner(board) is None


def test_draw():
    board = ["X", "O", "X",
             "X", "O", "O",
             "O", "X", "X"]

    assert is_draw(board) is True


def test_invalid_player():
    board = create_board()

    with pytest.raises(ValueError):
        make_move(board, 0, "A")


def test_invalid_position():
    board = create_board()

    with pytest.raises(ValueError):
        make_move(board, 9, "X")


def test_cannot_move_after_winner():
    board = ["X", "X", "X",
             "O", "O", "",
             "", "", ""]

    assert make_move(board, 5, "O") is False
