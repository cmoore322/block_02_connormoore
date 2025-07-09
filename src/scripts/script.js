$(document).ready(function () {
    const $gameBoard = $('#gameBoard');
    const $scoreDisplay = $('#score');
    const $resetButton = $('#resetButton');
    const $welcomeBtn = $('#welcomeBtn');
    const $greeting = $('#greeting');
    const $usernameInput = $('#usernameInput');
    const $gameOverMsg = $('#gameOverMsg');

    let board = [];
    let score = 0;
    const size = 4;

    // Easter egg: cheat code
    $(document).on('keydown', function (e) {
        if (e.key === '🦄') {
            cheatMode();
        }
    });

    function cheatMode() {
        board = [
            [1024, 1024, 0, 0],
            [512, 512, 0, 0],
            [256, 256, 0, 0],
            [128, 128, 0, 0]
        ];
        score = 4096;
        updateBoard();
        updateScore();
        alert("Easter Egg! 🥚 You've unlocked cheat mode!");
    }

    function greetUser() {
        const name = $usernameInput.val().trim();
        if (name) {
            $greeting.text(`Hello, ${name}! Good luck!`);
        }
    }

    $welcomeBtn.on('click', greetUser);

    function initBoard() {
        board = Array.from({ length: size }, () => Array(size).fill(0));
        addRandomTile();
        addRandomTile();
        score = 0;
        updateBoard();
        updateScore();
        $gameOverMsg.addClass('d-none');
    }

    function addRandomTile() {
        const empty = [];
        for (let r = 0; r < size; r++) {
            for (let c = 0; c < size; c++) {
                if (board[r][c] === 0) empty.push([r, c]);
            }
        }
        if (empty.length === 0) return;
        const [r, c] = empty[Math.floor(Math.random() * empty.length)];
        board[r][c] = Math.random() < 0.9 ? 2 : 4;
    }

    function updateBoard() {
        $gameBoard.empty();
        for (let r = 0; r < size; r++) {
            for (let c = 0; c < size; c++) {
                const $tile = $('<div></div>');
                $tile.addClass('tile');
                if (board[r][c] === 0) {
                    $tile.addClass('empty');
                } else {
                    $tile.attr('data-value', board[r][c]);
                    $tile.text(board[r][c]);
                }
                $gameBoard.append($tile);
            }
        }
    }

    function updateScore() {
        $scoreDisplay.text(score);
    }

    function slide(row) {
        let arr = row.filter(val => val);
        for (let i = 0; i < arr.length - 1; i++) {
            if (arr[i] === arr[i + 1]) {
                arr[i] *= 2;
                score += arr[i];
                arr[i + 1] = 0;
            }
        }
        arr = arr.filter(val => val);
        while (arr.length < size) arr.push(0);
        return arr;
    }

    function rotateLeft(matrix) {
        return matrix[0].map((_, i) => matrix.map(row => row[size - 1 - i]));
    }

    function rotateRight(matrix) {
        return matrix[0].map((_, i) => matrix.map(row => row[i]).reverse());
    }

    function move(direction) {
        let oldBoard = JSON.stringify(board);
        if (direction === 'left') {
            board = board.map(row => slide(row));
        } else if (direction === 'right') {
            board = board.map(row => slide(row.reverse()).reverse());
        } else if (direction === 'up') {
            board = rotateLeft(board);
            board = board.map(row => slide(row));
            board = rotateRight(board);
        } else if (direction === 'down') {
            board = rotateLeft(board);
            board = board.map(row => slide(row.reverse()).reverse());
            board = rotateRight(board);
        }
        if (JSON.stringify(board) !== oldBoard) {
            addRandomTile();
            updateBoard();
            updateScore();
            if (isGameOver()) {
                showGameOver();
            }
        }
    }

    $(document).on('keydown', function (e) {
        if (['ArrowLeft', 'a', 'A'].includes(e.key)) move('left');
        if (['ArrowRight', 'd', 'D'].includes(e.key)) move('right');
        if (['ArrowUp', 'w', 'W'].includes(e.key)) move('up');
        if (['ArrowDown', 's', 'S'].includes(e.key)) move('down');
    });

    $resetButton.on('click', function () {
        initBoard();
        $greeting.text('');
        $usernameInput.val('');
        $gameOverMsg.addClass('d-none');
    });

    function isGameOver() {
        for (let r = 0; r < size; r++) {
            for (let c = 0; c < size; c++) {
                if (board[r][c] === 0) return false;
                if (c < size - 1 && board[r][c] === board[r][c + 1]) return false;
                if (r < size - 1 && board[r][c] === board[r + 1][c]) return false;
            }
        }
        return true;
    }

    function showGameOver() {
        $gameOverMsg
            .removeClass('d-none')
            .text(`Uh oh, you ran out of space! Final score: ${score}`);
    }

    // Initialize game
    initBoard();

    // Console hint for easter egg
    console.log("Hint: Type 🦄 in the console for a surprise!");
});