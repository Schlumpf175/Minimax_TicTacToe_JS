//import { finished, nextStates, players, utility } from "./Tic-Tac-Toe Bitboard";

const game = require("./Tic-Tac-Toe Bitboard");

let numValueCalls = 0;
let cache = {};

function other(player) {
    for (let i = 0; i < game.players.length; i++) {
        if (game.players[i] !== player) {
            return game.players[i];
        }
    }
};

function cacheValue(state, player) {
    if (cache[[state, player]] !== undefined) {
        return cache[[state, player]];
    }
    let val = value(state, player);
    cache[[state, player]] = val;
    return val;
};

function value(state, player) {
    numValueCalls += 1;
    if (game.finished(state)) {
        return game.utility(state, player);
    }
    let o = other(player);
    let result = -1;
    game.nextStates(state, player).forEach(ns => {
        let nextValue = (-cacheValue(ns, o));
        if (nextValue > result) {
            result = nextValue;
        }
    });
    return result;
};

function bestMove(state, player) {
    let ns = game.nextStates(state, player);
    let bestValue = cacheValue(state, player);
    let bestMoves = [];
    ns.forEach(nextState => {
        if ((-cacheValue(nextState, other(player))) === bestValue) {
            bestMoves.push(nextState);
        }
    });
    let rand = Math.floor(Math.random() * bestMoves.length);
    let bestState = bestMoves[rand];
    return [bestValue, bestState];
};

function playGame() {
    let state = game.start;
    while (true) {
        let firstPlayer = game.players[0];
        let bm = bestMove(state, firstPlayer);
        let val = bm[0];
        state = bm[1];
        console.log(game.toBoard(state));
        console.log("For me, the game has the value " + val);
        if (game.finished(state)) {
            game.finalMsg(state);
            return;
        }
        state = game.getMove(state);
        console.log(game.toBoard(state));
        if (game.finished(state)) {
            game.finalMsg(state);
            return;
        }
    }
};

//console.time("Cachetime");

val = cacheValue(game.start, 0);

//console.timeEnd("Cachetime");
console.log(numValueCalls);
console.log(Object.keys(cache).length);


playGame();