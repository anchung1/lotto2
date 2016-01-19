import React, { Component, PropTypes } from 'react'


function log(msg) {
    //console.log(msg);
}

class TicketRow extends Component {

    render() {
        return (
            <div className="ticket-row">
                <input type="text" className="balls" placeholder="ball 1"/>
                <input type="text" className="balls" placeholder="ball 2"/>
                <input type="text" className="balls" placeholder="ball 3"/>
                <input type="text" className="balls" placeholder="ball 4"/>
                <input type="text" className="balls" placeholder="ball 5"/>
                <input type="text" className="balls qp" placeholder="QP"/>


            </div>
        )
    }
}

class Ticket extends Component {

    render() {

        let ticketRows = [];
        for (let i=0; i<this.props.rows; i++) {
            let elem = <TicketRow key={i}/>;
            ticketRows.push(elem);
        }

        let ticketID = this.props.children;
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
                <TicketRow />
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
        log('Game render called');
        log(this.props.tickets);

        let tickets = [];
        this.props.tickets.forEach( (ticket, i) => {
            let rows = ticket.rows;
            let elem = <Ticket key={i} rows={rows.length} onRowClick={this.props.onRowClick}>{i}</Ticket>;
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
                    <WinningNumbers />
                </div>
                {tickets}

            </div>
        )
    }
}

Game.propTypes = {
    onTicketClick: PropTypes.func.isRequired,
    onRowClick:    PropTypes.func.isRequired

}
