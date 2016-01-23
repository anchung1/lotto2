import React, { Component, PropTypes } from 'react';
import {FindPrize} from './PrizeEval';

function log(msg) {
    //console.log(msg);
}

class TicketRow extends Component {

    constructor(props) {
        super(props);
    }


    insertBalls(ballList, ball) {
        if (!parseInt(ball)) {
            return;
        }

        ballList.push(parseInt(ball));
    }

    //react sends 3 additional events after bind specified one
    //1) SyntheticFocusEvent
    //2) reactID
    //3) Event
    //blur(ref, event, reactid, a)

    blur(ref, event) {

        //TODO: LEFT OFF HERE

        //check if all 5 numbers are available
        let values = [];
        this.insertBalls (values, this.refs.ball1.value);
        this.insertBalls (values, this.refs.ball2.value);
        this.insertBalls (values, this.refs.ball3.value);
        this.insertBalls (values, this.refs.ball4.value);
        this.insertBalls (values, this.refs.ball5.value);
        this.insertBalls (values, this.refs.ballQP.value);

        if (values.length < 6) {
            return;
        }

        if (this.props.onRowDoneClick) {
            this.props.onRowDoneClick(values, this.props.ticket, this.props.row);
        }
        //console.log(event.target.value);
        //console.log(this.refs.ball1.value)
    }

    focus(ref, event) {
        //console.log(event);
        event.target.select();
    }

    keypress(event) {

        //if (event.which === 32) console.log('space key detected');
        //$(this.refs.ball1).next().focus();

        //$(this.refs.ball1).next().focus();
        //this.refs.ball2.focus();

    }

    render() {

        console.log(this.props.prize);
        let prize = <div></div>;
        if (this.props.prize && this.props.prize.val > 0) {
            prize = <span className="prize">{this.props.prize.prize}</span>
            //console.log(this.props.prize);
        }

        return (
            <div className="ticket-row">
                <input ref="ball1" type="text" className="balls"
                       onBlur={this.blur.bind(this, 'ball1')}
                       onFocus={this.focus.bind(this, 'ball1')}
                       placeholder="ball1"/>
                <input ref="ball2" type="text" className="balls"
                       onBlur={this.blur.bind(this, 'ball2')}
                       onFocus={this.focus.bind(this, 'ball2')}
                       placeholder="ball 2"/>
                <input ref="ball3" type="text" className="balls"
                       onBlur={this.blur.bind(this, 'ball3')}
                       onFocus={this.focus.bind(this, 'ball3')}
                       placeholder="ball 3"/>
                <input ref="ball4" type="text" className="balls"
                       onBlur={this.blur.bind(this, 'ball4')}
                       onFocus={this.focus.bind(this, 'ball4')}
                       placeholder="ball 4"/>
                <input ref="ball5" type="text" className="balls"
                       onBlur={this.blur.bind(this, 'ball5')}
                       onFocus={this.focus.bind(this, 'ball5')}
                       placeholder="ball 5"/>
                <input ref="ballQP" type="text" className="balls qp"
                       onBlur={this.blur.bind(this, 'ballQP')}
                       onFocus={this.focus.bind(this, 'ballQP')}
                       placeholder="QP"/>

                {prize}
            </div>
        )
    }
}

class Ticket extends Component {

    render() {
        let prizeArr = [];
        if (this.props.winningNumbers) {

            console.log(this.props.winningNumbers);
            this.props.rows.forEach( (row) => {

                let prize = FindPrize(this.props.winningNumbers, row);
                prizeArr.push(prize);
                //console.log(prize);
            });

        }


        let ticketID = this.props.children;
        let ticketRows = [];
        for (let i=0; i<this.props.rows.length; i++) {
            let elem = <TicketRow key={i} ticket={ticketID} row={i}
                                  prize = {prizeArr[i]}
                                  onRowDoneClick = {this.props.onRowNumberClick}/>;
            ticketRows.push(elem);
        }

        return (
            <div className="ticket">
                <div className="controls">
                    <span>Ticket {this.props.children + 1}</span>
                    <button onClick = { () => this.props.onRowClick('add', ticketID)} tabIndex="-1">+</button>
                    <button onClick = { () => this.props.onRowClick('remove', ticketID)} tabIndex="-1">-</button>
                </div>

                <div>
                    {ticketRows}
                </div>
            </div>
        )
    }
}


class WinningNumbers extends Component {
    render() {
        return (
            <div id="winner">
                <div>
                    <span>Winning Numbers</span>
                    <button>Evaluate</button>
                </div>
                <TicketRow
                    ticket={0} row={0}
                    onRowDoneClick = {this.props.onWinningNumberClick} />
            </div>
        );


    }
}

export default class Game extends Component {

    ticket(mode) {
        log('ticket ' + mode);
        if (mode === 'add') {
            //this.props.onAddTicketClick();
            this.props.onTicketClick('add');
        }

        if (mode === 'remove') {
            //this.props.onRemoveTicketClick();
            this.props.onTicketClick('remove');
        }


    }
    render() {
        console.log('Game render called');
        /*console.log(this.props.tickets);
        console.log(this.props.winningNumbers);*/


        //FindPrize('Tony');

        let tickets = [];
        this.props.tickets.forEach( (ticket, i) => {
            //let rows = ticket.rows;
            let elem =
                <Ticket key={i} rows={ticket.rows}
                        winningNumbers = {this.props.winningNumbers}
                        onRowClick={this.props.onRowClick}
                        onRowNumberClick = {this.props.onRowNumberClick}>
                    {i}
                </Ticket>;
            tickets.push(elem);
        });

        return (
            <div id="game">
                <div>
                    <span>Today's Game</span>

                    <button onClick={ () => this.props.onTicketClick('add') }>+</button>
                    <button onClick={ () => this.props.onTicketClick('remove')}>-</button>
                </div>

                <div>
                    <WinningNumbers onWinningNumberClick={this.props.onWinningNumberClick} />
                </div>
                {tickets}

            </div>
        )
    }
}

Game.propTypes = {
    onTicketClick: PropTypes.func.isRequired,
    onRowClick:    PropTypes.func.isRequired,
    onWinningNumberClick: PropTypes.func.isRequired,
    onRowNumberClick: PropTypes.func.isRequired

}
