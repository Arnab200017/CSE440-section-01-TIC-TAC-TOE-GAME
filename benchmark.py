
from time import perf_counter
from statistics import median

from game.ai_engine import get_best_move


# Different board situations for testing
test_boards = {
    "Empty Board": ["", "", "", "", "", "", "", "", ""],

    "Mid Game": ["X", "O", "X",
                 "", "O", "", "", "", ""],

    "Blocking Move": ["X", "X", "",
                      "O", "", "", "", "", ""]
}


def benchmark_algorithm(board, algorithm, repetitions=5):
    """Measure the execution time of an AI algorithm."""

    # Warm up the algorithm
    get_best_move(board.copy(), algorithm)

    execution_times = []

    for _ in range(repetitions):
        start_time = perf_counter()

        move = get_best_move(board.copy(), algorithm)

        end_time = perf_counter()

        execution_times.append(end_time - start_time)

    # Median reduces the effect of unusually slow or fast runs
    average_time = median(execution_times)

    return average_time * 1000, move


def run_benchmarks():

    algorithms = ["minimax", "alpha_beta"]

    for board_name, board in test_boards.items():

        print(f"\n--- {board_name} ---")

        results = {}

        for algorithm in algorithms:

            execution_time, move = benchmark_algorithm(
                board, algorithm
            )

            results[algorithm] = execution_time

            print(
                f"{algorithm}: "
                f"{execution_time:.4f} ms | "
                f"Best move: {move}"
            )

        # Compare execution speed
        if results["alpha_beta"] > 0:
            speedup = (
                results["minimax"] / results["alpha_beta"]
            )

            print(f"Speedup: {speedup:.2f}x")


if __name__ == "__main__":
    run_benchmarks()
