/* ----- constants -----*/
const PLAYERS = {
    '1': {
        name: 'Robots',
        character: '🤖',
        color: 'rgb(255 0 95 / 65%)'
    },
    '-1': {
        name: 'Babies',
        character: '👶🏼',
        color: 'rgb(99 3 253 / 65%)'
    },
    null: {
        name: null,
        character: null,
        color: 'rgb(255 255 255 / 15%)'
    },
};

/* ----- app's state (variables) -----*/
let board, turn, winner;

/* ----- cached element references -----*/
const boardEl = document.querySelector('#board');
const buttonEls = document.querySelectorAll('.square');
const msgEl = document.querySelector('#msg');
const replayEl = document.querySelector('#replay');
const titleEl = document.querySelector('#title');

/* ----- event listeners -----*/
boardEl.addEventListener('click', handleSquareSelect);
replayEl.addEventListener('click', init);

/* ----- functions -----*/
init();

function init() {
    board = new Array(9).fill(null);
    turn = 1;
    winner = getWinner();
    titleEl.innerText = `Who will take over the world?`;
    render();
}

function render() {
    // loop through buttons and update appearance
    buttonEls.forEach((btn, idx) => {
        btn.dataset.idx = idx;
        btn.style.backgroundColor = PLAYERS[board[idx]].color;
        btn.innerText = board[idx] !== null ? PLAYERS[board[idx]].character : '';
    });

    // render message / status
    if(!board.includes(1)) {
        msgEl.innerText = `${PLAYERS[1].name} or ${PLAYERS[-1].name}?`;
    } else if(winner === null) {
        msgEl.innerText = `${PLAYERS[turn].character}`;
    } else if(winner === 'T') {
        msgEl.innerText = `Yikes! Robot-baby hybrids!`;
    } else {
        msgEl.innerText = `Bow down! ${PLAYERS[winner].name} have defeated and conquered!`;
    }

    // hide or show replay button based on if there is a winner or not
    replayEl.style.visibility = winner !== null || winner === 'T' ? 'visible' : 'hidden';
}

function handleSquareSelect(event) {
    const btnIdx = event.target.dataset.idx;

    // return if square is already taken or if there's a winner
    if(board[btnIdx] !== null || winner !== null) return;

    // update state
    board[btnIdx] = turn;
    turn *= -1;
    winner = getWinner();

    // re-render and update dom
    render();
}

function getWinner() {
    const WINNING_COMBINATIONS = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    // loop through winning combinations
    for(i = 0; i < WINNING_COMBINATIONS.length; i++) {
        if(Math.abs(
            board[WINNING_COMBINATIONS[i][0]] +
            board[WINNING_COMBINATIONS[i][1]] +
            board[WINNING_COMBINATIONS[i][2]]
        ) === 3) {
            return board[WINNING_COMBINATIONS[i][0]];
        }
    };
    if(!board.includes(null)) return 'T';
    return null;
}