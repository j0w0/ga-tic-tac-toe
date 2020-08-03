/* ----- constants -----*/
const COLORS = {
    null: 'transparent',
    '1': 'rgb(255 0 95 / 65%)',
    '-1': 'rgb(99 3 253 / 65%)'
};

const PLAYERS = {
    '1': '🤖',
    '-1': '👶🏼'
};

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

/* ----- app's state (variables) -----*/
let board;
let turn;
let winner;

/* ----- cached element references -----*/
const boardEl = document.querySelector('#board');
const buttonEls = document.querySelectorAll('.square');
const msgEl = document.querySelector('#msg');
const replayEl = document.querySelector('#replay');
const titleEl = document.querySelector('#title');

/* ----- event listeners -----*/
boardEl.addEventListener('click', handleSquareSelect);
replayEl.addEventListener('click', replay);

/* ----- functions -----*/
init();

function init() {
    board = [null, null, null, null, null, null, null, null, null];
    // or can also be done as -> board = new Array(9).fill(null);
    turn = 1;
    winner = null;

    
    render();
}

function render() {
    // loop through board array / buttons and map color based on owner
    buttonEls.forEach((btn, idx) => {
        btn.dataset.idx = idx;
        btn.style.backgroundColor = COLORS[board[idx]];

        if(board[idx] !== null) {
            btn.innerText = PLAYERS[board[idx]];
        } else {
            btn.innerText = '';
        }
    });

    // render message / status
    if(!board.includes(1)) {
        msgEl.innerText = `${PLAYERS[1]}s or ${PLAYERS[-1]}s?`;
    } else if(winner === null) {
        msgEl.innerText = `${PLAYERS[turn]}'s Turn`;
        msgEl.style.color = COLORS[turn];
        //msgEl.style.textTransform = 'uppercase';
    } else if(winner === 'T') {
        msgEl.innerText = `Yikes! Robot-baby hybrids!`;
        msgEl.style.color = 'inherit';
        //msgEl.style.textTransform = 'initial';
    } else {
        msgEl.innerText = `${PLAYERS[winner]} have defeated and conquered!`;
        msgEl.style.color = COLORS[winner];
        //msgEl.style.textTransform = 'uppercase';
    }

    console.log(board);

    // hide or show replay button based on if there is a winner or not
    replayEl.style.visibility = winner !== null || winner === 'T' ? 'visible' : 'hidden';
}

function handleSquareSelect(event) {
    const btn = event.target;
    const btnIdx = btn.dataset.idx;

    currentSquareValue = board[btnIdx];

    // return if square is already taken
    if(currentSquareValue !== null) return;

    // return if there is already a winner
    if(winner !== null) return;

    // update board array with player who just took it
    board[btnIdx] = turn;

    // flip turn to other user
    turn *= -1;

    // loop through winning combinations to determine if winner
    WINNING_COMBINATIONS.forEach((combo) => {

        let comboSum = 0;

        // add up board array values for each combo
        combo.forEach((num) => {
            comboSum += board[num];
        });

        // if 3 in a row, set winner to owner of first square in combo
        if(Math.abs(comboSum) === 3) {
            let firstComboSquareIdx = combo[0];
            winner = board[firstComboSquareIdx];
            return;
        }
    });

    // if no winner and no more squares available, set a tie
    if(winner === null && !board.includes(null)) {
        winner = 'T';
    }

    // now re-render and update dom
    render();
}

function replay() {
    init();
    render();
}