SE440-section-01--TIC-TAC-TOE-GAME-
Console-based Tic-Tac-Toe game with single-player (vs AI) and two-player modes.

Course: CSE 440 — Artificial Intelligence
Group: 01 | Section: 02
Institution: North South University
Semester: Summer 2026

Group Members
#	Name	NSU ID
1 SADMAN SAKIB 2212009042
2	
3	
4	
Overview
This project is a console-based Tic-Tac-Toe game developed in Python. It provides users with two gameplay modes: single-player mode against a rule-based AI opponent and two-player mode for local multiplayer play.

The system features comprehensive input validation to prevent invalid or duplicate moves, automatic turn management between players, and real-time game-end detection after every move. In single-player mode, the AI employs strategic rule-based logic prioritizing winning opportunities, blocking opponent wins, controlling the center, and random fallback strategies.

Overall, this project demonstrates fundamental programming concepts such as modular design, conditional logic, loops, user interaction, and simple decision-based AI in an interactive terminal application.

Project Features
1. Main Menu
Displays a clear game title and menu when the program starts
Offers two modes:
1 Player — Play against the computer (AI)
2 Players — Play with a friend on the same computer
Validates user input; displays an error message if anything other than 1 or 2 is entered, then re-displays the menu
2. Game Board Display
Shows a clean text-based 3×3 grid using |, -, and spaces
Numbers positions 1 to 9 on empty cells so players know which number to enter
Updates the board after every move to reflect X and O placements
3. Two-Player Mode
Player 1 uses X, Player 2 uses O
Players alternate turns, entering a number from 1 to 9
If a spot is already occupied or the input is invalid, an error message displays and the same player can re-enter their move
4. Single-Player Mode (vs AI)
Human player uses X, AI uses O
AI employs rule-based logic with the following priority:
Win if possible
Block the player's winning move
Take the center square (position 5) if available
Otherwise, choose a random available spot
5. Win and Draw Detection
After every move, the game checks for a winner (three in a row horizontally, vertically, or diagonally)
If the board is full with no winner, the game declares a tie/draw
Displays the final board and announces the result before ending
6. Input Validation
Rejects non-numeric input
Rejects numbers outside the range 1–9
Rejects moves on already-occupied cells
Project Structure
tic_tac_toe/
├── main.py                 # Main entry point to run the game
├── README.md               # Project documentation
├── requirements.txt        # Project dependencies
├── data/                   # Dataset folder (if needed)
├── support/                # Supporting source files
│   ├── ai.py               # AI move logic and strategy
│   ├── board.py            # Board display and win detection
│   ├── constants.py        # Winning line definitions
│   ├── game.py             # Main game loop
│   ├── menu.py             # Menu and mode selection
│   └── player.py           # Player input handling
└── others/                 # Reports, presentation, and demo video
How to Run
Requirements
Python 3.x
No external dependencies (standard library only)
Installation and Execution
Clone the repository:

git clone https://github.com/simanto4321/CSE440-section-01--TIC-TAC-TOE-GAME-.git
cd tic_tac_toe
Run the game:

python main.py
Follow the on-screen menu to select a game mode (1 or 2 players)

Enter numbers 1–9 to place your move on the board

Game Rules
Objective: Get three of your marks (X or O) in a row—horizontally, vertically, or diagonally
Valid Moves: Enter a number from 1 to 9 corresponding to an empty cell on the board
Turn Order: Players alternate turns automatically
Game End: The game ends when a player wins or the board is full (draw)
Notes
This is an educational project for CSE 440 (Artificial Intelligence)
The AI opponent uses a simple rule-based strategy, not machine learning
All code is written in Python using only the standard library
