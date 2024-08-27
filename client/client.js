document.addEventListener('DOMContentLoaded', () => {
    const boardSize = 5;
    const gameBoard = document.getElementById('game-board');
    const turnDisplay = document.getElementById('turn-display');
    const moveHistoryDiv = document.getElementById('move-history'); // Get the history div
    const moveHistory = []; // Array to store the history of moves
    let selectedCell = null;
    let currentPlayer = 'A'; // Start with Player A

    // Initialize the game board
    for (let i = 0; i < boardSize * boardSize; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.index = i;
        gameBoard.appendChild(cell);
    }

    // Define initial positions and names for each player
    const initialPositions = {
        A: { indices: [0, 1, 2, 3, 4], names: ['A-p1', 'A-p2', 'A-h1', 'A-h2', 'A-h3'] },
        B: { indices: [20, 21, 22, 23, 24], names: ['B-p1', 'B-p2', 'B-h1', 'B-h2', 'B-h3'] }
    };

    // Place pieces on the board for Player A and Player B
    initialPositions.A.indices.forEach((index, i) => {
        const cell = gameBoard.children[index];
        cell.textContent = initialPositions.A.names[i];
        cell.classList.add('occupied-a');
        cell.dataset.player = 'A';
    });

    initialPositions.B.indices.forEach((index, i) => {
        const cell = gameBoard.children[index];
        cell.textContent = initialPositions.B.names[i];
        cell.classList.add('occupied-b');
        cell.dataset.player = 'B';
    });

    // Handle cell click
    gameBoard.addEventListener('click', (event) => {
        const cell = event.target;
        if (!cell.classList.contains('cell')) return;

        if (selectedCell) {
            if (cell !== selectedCell && !cell.classList.contains('occupied-a') && !cell.classList.contains('occupied-b')) {
                if (movePiece(selectedCell, cell)) {
                    recordMove(selectedCell, cell); // Record the move in history
                    updateHistoryDisplay(); // Update the displayed history
                    changeTurn();
                }
            }
            selectedCell.classList.remove('selected');
            selectedCell = null;
        } else {
            if ((cell.classList.contains('occupied-a') && currentPlayer === 'A') ||
                (cell.classList.contains('occupied-b') && currentPlayer === 'B')) {
                selectedCell = cell;
                selectedCell.classList.add('selected');
            }
        }
    });

    // Move piece from one cell to another
    function movePiece(fromCell, toCell) {
        toCell.textContent = fromCell.textContent;
        toCell.classList.add(fromCell.classList.contains('occupied-a') ? 'occupied-a' : 'occupied-b');
        toCell.dataset.player = fromCell.dataset.player;
        fromCell.textContent = '';
        fromCell.classList.remove('occupied-a', 'occupied-b');
        fromCell.removeAttribute('data-player');
        return true;
    }

    // Record the move in the move history
    function recordMove(fromCell, toCell) {
        const move = {
            player: currentPlayer,
            piece: fromCell.textContent,
            from: fromCell.dataset.index,
            to: toCell.dataset.index
        };
        moveHistory.push(move);
    }

    // Update the history display
    function updateHistoryDisplay() {
        moveHistoryDiv.innerHTML = ''; // Clear the current history display
        moveHistory.forEach((move, index) => {
            const moveEntry = document.createElement('div');
            moveEntry.textContent = `${index + 1}. Player ${move.player} moved ${move.piece} from ${move.from} to ${move.to}`;
            moveHistoryDiv.appendChild(moveEntry);
        });
    }

    // Change turn
    function changeTurn() {
        currentPlayer = currentPlayer === 'A' ? 'B' : 'A';
        turnDisplay.textContent = `Current Turn: Player ${currentPlayer}`;
    }
});
