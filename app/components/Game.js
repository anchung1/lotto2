import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import {FindPrize} from './PrizeEval';
import {EntryObj} from './EntryObj';
//import classNames from 'classnames';
import {ajax} from '../actions';

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
        this.insertBalls (values, this.refs.ballPB.value);

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

        /*console.log('keypress');
        console.log(event.target);*/
        //if (event.which === 32) console.log('space key detected');
        //$(this.refs.ball1).next().focus();

        //$(this.refs.ball1).next().focus();
        //this.refs.ball2.focus();

    }

    render() {


        let value = ["", "", "", "", "", ""];
        if (this.props.data) {

            //this sets the default values for input fields
            //ticket number case
            value = Object.keys(this.props.data).map( (key) => {
                return this.props.data[key];
            });

            //Object.keys(this.props.data).forEach() - loops through all the keys

            //for already mounted component, set the input value
            //winning number case
            if (Object.keys(this.props.data).length) {
                let vals = Object.keys(this.props.data).map( (key) => {
                    return this.props.data[key];
                });

                let i=0;
                //this guy iterates all the refs on this object
                for (var ref in this.refs) {
                    this.refs[ref].value = vals[i++];
                }
            }
        }

        let cl = {balls: 1};
        let cls = [];

        let prize = <div></div>;
        if (this.props.prize && this.props.prize.val > 0) {
            prize = <span className="prize">{this.props.prize.prize}</span>
            this.props.prize.pattern.forEach( (val) => {
                if (val === 1) {
                    cls.push('balls inhigh');
                } else {
                    cls.push('balls');
                }
            });

            //console.log(this.props.prize.pattern);
        } else {
            cls.push('balls');
            cls.push('balls');
            cls.push('balls');
            cls.push('balls');
            cls.push('balls');
            cls.push('balls');
        }

        return (
            <div className="ticket-row">
                <input ref="ball1" type="text" className={cls[0]}
                       onBlur={this.blur.bind(this, 'ball1')}
                       onFocus={this.focus.bind(this, 'ball1')}
                       defaultValue={value[0]}
                       placeholder="ball 1"/>
                <input ref="ball2" type="text" className={cls[1]}
                       onBlur={this.blur.bind(this, 'ball2')}
                       onFocus={this.focus.bind(this, 'ball2')}
                       defaultValue={value[1]}
                       placeholder="ball 2" />
                <input ref="ball3" type="text" className={cls[2]}
                       onBlur={this.blur.bind(this, 'ball3')}
                       onFocus={this.focus.bind(this, 'ball3')}
                       defaultValue={value[2]}
                       placeholder="ball 3"/>
                <input ref="ball4" type="text" className={cls[3]}
                       onBlur={this.blur.bind(this, 'ball4')}
                       onFocus={this.focus.bind(this, 'ball4')}
                       defaultValue={value[3]}
                       placeholder="ball 4"/>
                <input ref="ball5" type="text" className={cls[4]}
                       onBlur={this.blur.bind(this, 'ball5')}
                       onFocus={this.focus.bind(this, 'ball5')}
                       defaultValue={value[4]}
                       placeholder="ball 5"/>
                <input ref="ballPB" type="text" className={cls[5] + ' pb'}
                       onBlur={this.blur.bind(this, 'ballPB')}
                       onFocus={this.focus.bind(this, 'ballPB')}
                       defaultValue={value[5]}
                       placeholder="PB"/>



                {prize}
            </div>
        )
    }
}

class Ticket extends Component {

    render() {
        let prizeArr = [];
        if (this.props.winningNumbers) {

            //console.log(this.props.winningNumbers);
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
                                  data = {this.props.rows[i]}
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

                {ticketRows}
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
                    onRowDoneClick = {this.props.onWinningNumberClick}
                    data = {this.props.data}
                    //debug = {1}
                />
            </div>
        );


    }
}

class Footer extends Component {

    constructor(props) {
        super(props);
        this._init = true;
    }

    changeClick() {
        //console.log(this.refs.select.value);
        this.props.onDBFetchItem(this.refs.select.value);
    }

    render() {
        //make it go read available DB entries
        if (this._init === true) {
            this.props.onDBLoadClick();
            this._init = false;
            return <div></div>;
        }

        //console.log('Footer', this.props.fileNames);
        let select = <div></div>;

        let optionsAfter = this.props.fileNames.map( (obj, i) => {
            return (
                <option key={'option'+(i+1)} value={obj._id}>{obj._id}</option>
            )
        });

        let option = <option key={'option'+0}>Pick a File to Load</option>;
        let options = [option, ...optionsAfter];

        select =
            <select ref='select' onChange={ () => {this.changeClick()}}>
                {options}
        </select>;

        //select =
        //    <select onClick={ () => {this.props.onDBLoadClick()}}>
        //        {options}
        //    </select>;
        return (
            <div id="footer">
                <div>
                    <input ref='fname' type="text" placeholder="file name"/>
                    <button onClick={ () => this.props.onDBSaveClick(this.refs.fname.value)}>Save</button>
                </div>

                {select}

            </div>
        );
    }
}

export default class Game extends Component {

    ajaxTest() {
        console.log('in ajax test');
        ajax().getCookieID();
    }
    injectTicket() {
        //console.log('inject Ticket');

        let data = [];
        let rows = [];
        rows.push(EntryObj([1, 2, 3, 4, 5, 6]));
        rows.push(EntryObj([1, 2, 3, 4, 5, 7]));
        rows.push(EntryObj([1, 2, 3, 4, 5, 8]));

        let newTicket = {rows: rows};


        let rows1 = [];
        rows1.push(EntryObj([11, 22, 3, 4, 5, 6]));
        rows1.push(EntryObj([11, 22, 3, 4, 5, 7]));
        rows1.push(EntryObj([11, 22, 3, 4, 5, 8]));

        let newTicket1 = {rows: rows1};

        data.push(newTicket);
        data.push(newTicket1);

        this.props.onInjectTicketsClick(data);

        let winner = EntryObj([1, 2, 33, 44, 55, 6]);
        this.props.onInjectWinnerClick(winner);
        //console.log(data);
    }
    render() {
        console.log('Game render called');
        //console.log(this.props.tickets);
        //console.log(this.props.winningNumbers);


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
                    <button className="inject"

                        onClick={ () => this.injectTicket()} >
                        Inject Data
                    </button>


                </div>

                <div>
                    <WinningNumbers onWinningNumberClick={this.props.onWinningNumberClick}
                        data={this.props.winningNumbers}
                    />
                </div>
                {tickets}

                <div>
                    <Footer fileNames={this.props.fileNames} onDBSaveClick={this.props.onDBSaveClick}
                        onDBLoadClick={this.props.onDBLoadClick}
                        onDBFetchItem={this.props.onDBFetchItem}
                    />
                </div>

            </div>
        )
    }
}

Game.propTypes = {
    onTicketClick: PropTypes.func.isRequired,
    onRowClick:    PropTypes.func.isRequired,
    onWinningNumberClick: PropTypes.func.isRequired,
    onRowNumberClick: PropTypes.func.isRequired,
    onDBSaveClick: PropTypes.func.isRequired,
    onDBLoadClick: PropTypes.func.isRequired,
    onDBFetchItem: PropTypes.func.isRequired
};
