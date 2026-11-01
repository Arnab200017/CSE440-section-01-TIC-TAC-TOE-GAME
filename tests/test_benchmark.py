
import pytest

from benchmark import benchmark_algorithm


# A mid-game board keeps the tests relatively fast.
TEST_BOARD = [
    "X", "O", "X",
    "", "O", "",
    "", "", ""
]


@pytest.mark.parametrize("algorithm", ["minimax", "alpha_beta"])
def test_benchmark_returns_valid_results(algorithm):
    """Both algorithms should return execution time and a valid move."""

    execution_time, move = benchmark_algorithm(
        TEST_BOARD.copy(),
        algorithm,
        repetitions=2
    )

    assert execution_time >= 0
    assert move in range(9)


def test_benchmark_does_not_modify_original_board():
    """Benchmarking should preserve the original board."""

    original_board = TEST_BOARD.copy()

    benchmark_algorithm(
        TEST_BOARD,
        "alpha_beta",
        repetitions=2
    )

    assert TEST_BOARD == original_board


def test_benchmark_rejects_unknown_algorithm():
    """Unknown algorithms should raise ValueError."""

    with pytest.raises(ValueError):
        benchmark_algorithm(
            TEST_BOARD.copy(),
            "unknown",
            repetitions=1
        )
