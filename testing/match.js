import 'babel-polyfill';

import {winTable} from './winTable';
//import {numbers, winningNumbers} from './result1';
import {numbers, winningNumbers} from './result3';


const getValue = (pattern) => {
    var value = 0;
    pattern.forEach(function(val, i) {
        if (val) {
            value += (1 << i);
        }
    });

    return value;
};

const findPrize = (pattern) => {

    let prize = '';

    for (let i=0; i<winTable.length; i++) {
        let winValue = getValue(winTable[i].pattern);
        let patValue = getValue(pattern);

        if (winValue === patValue) {
            prize = winTable[i].prize;
            break;
        }
    }

    return prize;

};

const normalizePattern = (pattern) => {

    let norm = [];
    pattern.forEach( elem => {
        if (elem > 0) {
            norm.push(1);
        }
    });


    let count = pattern.length - norm.length;
    for (let i=0; i<count; i++) {
        norm.push(0);
    }

    return norm;
};

const findWinningPattern = (row, winner, verbose) => {

    let pattern = [];


    winner.num.forEach(function(value, i) {

        let found = row.num.find( function(entry) {
            return (entry === value);
        });


        if (found) {
            pattern.push(1)
        } else {
            pattern.push(0);
        }

    });


    let normPattern = normalizePattern(pattern);
    if (row.qp === winner.qp) {
        normPattern.push(1);
        pattern.push(1);
    } else {
        normPattern.push(0);
        pattern.push(0);
    }

    if (verbose) {
        console.log('\n');
        console.log(pattern);
        console.log(row);
        console.log(winner);
    }

    return {pattern, normPattern};
};

const EvalTickets = () => {

    let result = [];
    numbers.forEach( number => {

        //console.log('scanning card: ' + number.card);
        for (let prop in number) {
            if (prop === 'card') continue;

            let {pattern, normPattern} = findWinningPattern(number[prop], winningNumbers, 1);
            let prize = findPrize(normPattern);

            if (prize.length) {
                result.push('In card: ' + number.card + ': ' + prize);
                result.push(pattern);
                result.push(number[prop]);
                result.push(winningNumbers);

            }

        }
    });

    result.forEach( text => {
        console.log(text);
    });

};

EvalTickets();



