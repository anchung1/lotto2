import React, {Component, PropTypes} from 'react'
import { render } from 'react-dom'
import { Provider, connect } from 'react-redux'

import { createStore, combineReducers } from 'redux';

let userReducer = function (state = {}, action) {
    console.log('userReducer was called with state', state, 'and action', action)

    switch (action.type) {
        // etc.
        default:
            return state;
    }
};

let itemsReducer = function (state = [], action) {
    console.log('itemsReducer was called with state', state, 'and action', action)

    switch (action.type) {
        // etc.
        default:
            return state;
    }
};

let ticketReducer = function (state = 0, action) {
    console.log('ticketReducer was called with state', state, 'and action', action);

    switch(action.type) {
        case 'ADD_TICKET':
            return state + 1;
        default:
            return state;

    }
};

let reducer = combineReducers({
    /*user: userReducer,
    items: itemsReducer,*/
    ticket: ticketReducer
});

let store = createStore(reducer);


let setNameActionCreator = function (name) {
    return {
        type: 'SET_NAME',
        name: name
    }
}

let addTicketCreator = function() {
    return {
        type: 'ADD_TICKET'

    }
};

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
        return (
            <div className="ticket">
                <div className="controls">
                    <span>Ticket 1</span>
                    <button>+</button>
                    <button>-</button>
                </div>
                <TicketRow />

            </div>
        )
    }
}

class Game extends Component {

    addTicket() {
        console.log('add ticket');
        store.dispatch(
            addTicketCreator()
        );
    }
    render() {
        console.log('Game render called');

        return (
            <div id="game">
                <div>
                    <span>Today's Game</span>

                    <button onClick={ () => this.addTicket() }>+</button>
                    <button>-</button>
                </div>


                <Ticket />
                <Ticket />
                <Ticket />
            </div>
        )
    }
}

class App extends Component {
    handleClick(e) {
        console.log('handle click');
        /*store.dispatch( {
            type: 'AN_ACTION'
        })
        store.dispatch(
            setNameActionCreator('joe')
        );*/
    }

/*<button onClick={e => this.handleClick(e)}>
Cheech and Chong and Nick
</button>
    */

    render() {
        console.log('App render called');
        return (
            <div id="top">
                <Game />
            </div>
        );
    }
}

function select(state) {
    return {state};
}
connect(select)(App);

let rootElement = document.getElementById('root')
render(
    <Provider store={store}>
        <App />
    </Provider>,
    rootElement
);