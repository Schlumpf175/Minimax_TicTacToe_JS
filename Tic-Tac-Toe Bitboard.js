players = [0, 1];
start = 0;

function setBits(bits) {
    result = 0;
    bits.forEach(bit => {
        result = result | 1 << bit;
    });
    return result;
};

function setBit(bit) {
    return 1 << bit;
};

function power(base, exponent) {
    return Math.pow(base, exponent);
};

function toBoard(state) {
    let result = "+-+-+-+\n";
    for (let i = 0; i < 9; i++) {
        if ((state & power(2, i)) !== 0) {
            result += "|X";
        }
        else if ((state & power(2, (i + 9))) !== 0) {
            result += '|O';
        }
        else {
            result += '| ';
        }
        if (((i + 1) % 3) == 0) {
            result += '|\n+-+-+-+\n';
        }
    }
    return result;
};

function allFree(state) {
    let freeCells = [];
    for (let i = 0; i < 9; i++) {
        if ((state & (power(2, i) + power(2, (i + 9)) ) ) === 0) {
            freeCells.push(i);
        }
    }
    return freeCells;
};

function nextStates(state, player) {
    empty = allFree(state);
    result = [];
    empty.forEach(i => {
        nextState = state | setBit((player * 9) + i);
        result.push(nextState);
    });
    return result;
};

/** state = setBits([2,3,5,10,13,15]);
console.log("current state: \n" + toBoard(state));

console.log("nextStates: \n");
nextStates(state, 0).forEach(i => {
    console.log(toBoard(i));
}); **/

AllLines = [  setBits([0,1,2]), // 1st row
              setBits([3,4,5]), // 2nd row
              setBits([6,7,8]), // 3rd row
              setBits([0,3,6]), // 1st column
              setBits([1,4,7]), // 2nd column
              setBits([2,5,8]), // 3rd column
              setBits([0,4,8]), // falling diagonal
              setBits([2,4,6]), // rising diagonal
            ];

/**
AllLines.forEach(i => {
    console.log(toBoard(i));
});
**/

function utility(state, player) {
    for (let i = 0; i < AllLines.length; i++) {
        const mask = AllLines[i];
        if ((state & mask) == mask) {
            return 1 - (2 * player);
        }
        if (((state >> 9) & mask) == mask) {
            return -1 + (2 * player);
        }
    };
    if (((state & 511) | (state >> 9)) !== 511) {
        return null;
    }
    return 0;
};

/**
s1 = setBits([0, 2, 5, 6, 7, 1+9, 3+9, 4+9, 8+9]);
console.log(toBoard(s1));
console.log(utility(s1, 0));
**/

function heuristic(state, player) {
    return 0;
};

function finished(state) {
    return (utility(state, 0) !== null);
};

/**
s = setBits([0, 2, 5, 6, 7, 1+9, 3+9, 4+9, 8+9]);
console.log(toBoard(s));
console.log(finished(s));
**/

const readline = require('readline-sync');

function getMove(state) {
    move = readline.question("Enter move here: ");
    move = move.split(",");
    row = parseInt(move[0]);
    col = parseInt(move[1]);
    mask = setBit(9 + row * 3 + col);
    if ((state & mask) === 0) {
        return state | mask;
    }
    else {
        console.log("Illegal input. Please try again.")
        return getMove(state);
    }
};

/**
console.log(getMove(0));
**/

function finalMsg(state) {
    if (finished(state) === true) {
        if (utility(state, 1) === 1) {
            console.log("You have won!");
        }
        else if (utility(state, 1) === -1){
            console.log("You have lost!");
        }
        else {
            console.log("It's a draw.");
        }
        return true;
    };
    return false;
};

/**
finalMsg(setBits([0, 2, 3, 6, 1+9,  4+9, 5+9]));
**/
