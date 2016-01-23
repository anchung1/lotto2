import {winTable} from './winTable';
import 'babel-polyfill';
import {assert} from 'chai';

// Returns a random integer between min (included) and max (excluded)
// Using Math.round() will give you a non-uniform distribution!
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

// Returns a random integer between min (included) and max (included)
// Using Math.round() will give you a non-uniform distribution!
function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

class RandomBalls {
    constructor(num) {
        this.numBalls = [];

        if (num) {
            this.setup(num);
        }
    }

    setup(num) {
        this.numBalls = [];
        for (let i=0; i< num; i++) {
            this.numBalls.push(i+1);
        }
    }

    draw() {
        let index = getRandomInt(0, this.numBalls.length);
        return this.numBalls.splice(index, 1).pop();
    }
}

class LottoEval {

    constructor() {
        this.numBalls = 5;
        this.RandomBalls = new RandomBalls();
    }

    static ticketCost() {
        return 2;
    }

    static createPBObject(balls, PB) {
        var row = {1: '', 2: '', 3: '', 4: '', 5: '', pb: ''};

        //verify that numbers are unique
        for (let i=0; i<balls.length; i++) {
            for (let j=0; j<balls.length; j++) {
                if (i === j) continue;

                assert(balls[i] !== balls[j]);
            }
        }

        let i = 0;
        for (let key in row) {
            row[key] = balls[i++];
        }

        row.pb = PB;


        return row;
    }

    static convert(rowData) {
        let retArr = [];
        for (let key in rowData) {
            if (key === 'pb') continue;
            retArr.push(rowData[key]);
        }

        //ensure this is last
        retArr.push(rowData.pb);
        return retArr;
    }

    static generatePB() {
        return (getRandomIntInclusive(1, 26));
    }

    generateBalls() {
        let balls = [];
        this.RandomBalls.setup(69);

        for (let i=0; i<this.numBalls; i++) {
            balls.push(this.RandomBalls.draw());
        }

        return balls;
    }

    generateRow() {
        let balls = this.generateBalls();
        let PB = LottoEval.generatePB();

        return LottoEval.createPBObject(balls, PB);
    }

    generateWinner() {
        return this.generateRow();
    }



    getValue(pattern)  {
        var value = 0;
        pattern.forEach(function(val, i) {
            if (val) {
                value += (1 << i);
            }
        });

        return value;
    };

    findPrize(pattern) {

        let prize = 'No Prize';
        let val = 0;

        for (let i=0; i<winTable.length; i++) {
            let winValue = this.getValue(winTable[i].pattern);
            let patValue = this.getValue(pattern);

            if (winValue === patValue) {
                prize = winTable[i].prize;
                val = winTable[i].val;
                break;
            }
        }

        return {prize: prize, val: val};

    };

    normalizePattern(pattern) {

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

    eval(winNum, rowNum) {


        let winArr = LottoEval.convert(winNum);
        let rowArr = LottoEval.convert(rowNum);


        let winPB = winArr.pop();
        let rowPB = rowArr.pop();

        let pattern = [];
        winArr.forEach((value, i) => {

            let found = rowArr.find((entry) => {
                return (entry === value);
            });


            if (found) {
                pattern.push(1)
            } else {
                pattern.push(0);
            }

        });

        let normPattern = this.normalizePattern(pattern);
        if (winNum.pb === rowNum.pb) {
            normPattern.push(1);
            pattern.push(1);
        } else {
            normPattern.push(0);
            pattern.push(0);
        }

        rowArr.push(rowNum.pb);

        let {prize, val} = this.findPrize(normPattern);
        return {prize: prize, val: val, ticket: rowArr, pattern: pattern};

    }


}

let evaluator = new LottoEval();

export function FindPrize(winNum, rowNum) {

    return evaluator.eval(winNum, rowNum);
}

function play(numRows) {


    let winner = evaluator.generateWinner();
    let rows = [];
    for (let i=0; i<numRows; i++) {
        rows.push(evaluator.generateRow());
    }

    /*winner = { '1': 47, '2': 35, '3': 45, '4': 37, '5': 34, pb: 9 };
    rows = [ { '1': 68, '2': 47, '3': 45, '4': 8, '5': 9, pb: 9 } ];*/
    //console.log(LottoEval.convert(winner));

    let totalWin = 0;
    let fourDollarWins = 0;
    let sevenDollarWins = 0;
    let hundredDollarWins = 0;

    rows.forEach( (row) => {
        let {prize, val, ticket, pattern} = FindPrize(winner, row);
        if (val !== 0) {

            if (val === 4) fourDollarWins++;
            if (val === 7) sevenDollarWins++;
            if (val === 100) hundredDollarWins++;
            if (val > 100) {
                console.log(LottoEval.convert(winner));

                console.log(prize);
                console.log("---" + ticket);
                console.log("---" + pattern);
            }

            totalWin += val;
        }

    });

    //console.log('\n');
    //console.log('$4 wins: ' + fourDollarWins + ', $7 wins: ' + sevenDollarWins + ', $100 wins: ' + hundredDollarWins);
    //console.log('Result: ' + totalWin + '/' + numRows * LottoEval.ticketCost());

    return totalWin;
}

//play(1000);

//play $20 for a year

let totalWin = 0;
let totalCost = 0;
let weeks = 0;

for (let i=0; ; i++) {
    let win = play(10);
    totalWin += win;
    totalCost += LottoEval.ticketCost() * 10;
    weeks ++;
    if (win >= 50000) break;
    if (i===10000) {
        console.log('.');
        i = 0;
    }
}

console.log('weeks: ' + weeks + ' - ' + totalWin + '/' + totalCost);



