import {winTable} from './winTable';
import 'babel-polyfill';
import {assert} from 'chai';
import {EntryObj} from './EntryObj';

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
        var row = EntryObj();

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
        rowArr.forEach((value, i) => {

            let found = winArr.find((entry) => {
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
