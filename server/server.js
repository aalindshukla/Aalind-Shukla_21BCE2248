// server.js

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path=require('path')

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

let board = [
    ['A-p1', null, null, null, 'B-p1'],
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null],
    ['A-p2', null, null, null, 'B-p2']
];

let currentPlayer = 'A';

// Serve static files from the public directory
// app.use(express.static('public'));
app.use(express.static(path.join(__dirname,'../client')))

io.on('connection', (socket) => {
    console.log('A user connected');

    // Send the initial state to the client
    socket.emit('initialize', { board, currentPlayer });

    socket.on('cellClick', ({ row, col }) => {
        if (isValidMove(row, col)) {
            makeMove(row, col);
            switchTurn();
            io.emit('update', { board, currentPlayer });
        }
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

function isValidMove(row, col) {
    const selectedCell = board[row][col];
    if (selectedCell && selectedCell.startsWith(currentPlayer)) {
        return true;
    }
    return false;
}

function makeMove(row, col) {
    const piece = board[row][col];
    const newRow = row + (currentPlayer === 'A' ? -1 : 1);
    if (newRow >= 0 && newRow < 5 && !board[newRow][col]) {
        board[newRow][col] = piece;
        board[row][col] = null;
    }
}

function switchTurn() {
    currentPlayer = currentPlayer === 'A' ? 'B' : 'A';
}

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
