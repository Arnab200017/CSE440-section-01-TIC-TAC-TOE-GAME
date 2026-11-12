import pytest

from app import app


@pytest.fixture
def client():
    """Create a Flask test client for API testing."""

    app.config["TESTING"] = True

    with app.test_client() as test_client:
        yield test_client


def test_homepage_loads(client):
    """Check whether the homepage loads successfully."""

    response = client.get("/")

    assert response.status_code == 200
    assert b"Tic Tac Toe" in response.data


def test_new_game_starts_successfully(client):
    """Check whether a new AI game starts correctly."""

    response = client.post(
        "/api/new-game",
        json={
            "mode": "ai",
            "algorithm": "alpha_beta"
        }
    )

    data = response.get_json()

    assert response.status_code == 200
    assert data["board"] == [""] * 9
    assert data["current_player"] == "X"
    assert data["mode"] == "ai"
    assert data["status"] == "playing"


def test_new_human_game(client):
    """Check whether Human vs Human mode starts."""

    response = client.post(
        "/api/new-game",
        json={
            "mode": "human",
            "algorithm": "minimax"
        }
    )

    data = response.get_json()

    assert response.status_code == 200
    assert data["mode"] == "human"
    assert data["current_player"] == "X"


def test_invalid_game_mode(client):
    """Reject an unsupported game mode."""

    response = client.post(
        "/api/new-game",
        json={
            "mode": "invalid",
            "algorithm": "minimax"
        }
    )

    assert response.status_code == 400


def test_invalid_algorithm(client):
    """Reject an unsupported AI algorithm."""

    response = client.post(
        "/api/new-game",
        json={
            "mode": "ai",
            "algorithm": "invalid"
        }
    )

    assert response.status_code == 400


def test_player_can_make_move(client):
    """Check whether a player can make a valid move."""

    client.post("/api/new-game", json={"mode": "human"})

    response = client.post(
        "/api/move",
        json={"position": 4}
    )

    data = response.get_json()

    assert response.status_code == 200
    assert data["board"][4] == "X"
    assert data["current_player"] == "O"


def test_ai_responds_to_player_move(client):
    """Check whether AI makes a move after the human."""

    client.post(
        "/api/new-game",
        json={
            "mode": "ai",
            "algorithm": "alpha_beta"
        }
    )

    response = client.post(
        "/api/move",
        json={"position": 0}
    )

    data = response.get_json()

    assert response.status_code == 200
    assert data["board"][0] == "X"
    assert data["board"].count("O") == 1
    assert data["board"].count("") == 7


def test_invalid_position_type(client):
    """Reject a non-integer move position."""

    client.post("/api/new-game", json={"mode": "human"})

    response = client.post(
        "/api/move",
        json={"position": "center"}
    )

    assert response.status_code == 400


def test_out_of_range_position(client):
    """Reject a position above the board."""

    client.post("/api/new-game", json={"mode": "human"})

    response = client.post(
        "/api/move",
        json={"position": 9}
    )

    assert response.status_code == 400


def test_negative_position(client):
    """Reject a position below the board."""

    client.post("/api/new-game", json={"mode": "human"})

    response = client.post(
        "/api/move",
        json={"position": -1}
    )

    assert response.status_code == 400

def test_boolean_position(client):
    """Reject a boolean move position."""

    client.post("/api/new-game", json={"mode": "human"})

    response = client.post(
        "/api/move",
        json={"position": True}
    )

    assert response.status_code == 400


def test_occupied_cell_cannot_be_used_again(client):
    """Prevent a player from using an occupied cell."""

    client.post("/api/new-game", json={"mode": "human"})

    client.post("/api/move", json={"position": 0})

    response = client.post(
        "/api/move",
        json={"position": 0}
    )

    assert response.status_code == 400


def test_human_players_take_alternating_turns(client):
    """Check whether X and O alternate in Human vs Human mode."""

    client.post("/api/new-game", json={"mode": "human"})

    first_response = client.post(
        "/api/move",
        json={"position": 0}
    )

    second_response = client.post(
        "/api/move",
        json={"position": 1}
    )

    first_data = first_response.get_json()
    second_data = second_response.get_json()

    assert first_data["current_player"] == "O"
    assert second_data["board"][0] == "X"
    assert second_data["board"][1] == "O"
    assert second_data["current_player"] == "X"