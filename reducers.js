import { combineReducers } from 'redux'
import { ADD_TODO, COMPLETE_TODO, SET_VISIBILITY_FILTER, VisibilityFilters, ADD_TICKET, REMOVE_TICKET } from './actions'
import {ADD_ROW, REMOVE_ROW} from './actions'
const { SHOW_ALL } = VisibilityFilters

function visibilityFilter(state = SHOW_ALL, action) {
    switch (action.type) {
        case SET_VISIBILITY_FILTER:
            return action.filter
        default:
            return state
    }
}

function todo(state, action) {
    switch (action.type) {
        case ADD_TODO:
            return {
                id: action.id,
                text: action.text,
                completed: false
            }
        case COMPLETE_TODO:
            if (state.id !== action.id) {
                return state
            }

            return {
                id: state.id,
                text: state.text,
                completed: true
            }
        default:
            return state
    }
}

function todos(state = [], action) {
    switch (action.type) {
        case ADD_TODO:
            return [
                ...state,
                todo(undefined, action)
            ]
        case COMPLETE_TODO:
            return state.map(t =>
                todo(t, action)
            )
        default:
            return state
    }
}

function row (state, action) {
    switch(action.type) {
        case ADD_TICKET:
        case ADD_ROW:

            return ({1:'', 2:'', 3:'', 4:'', 5:'', qp:''})

        default:
            return state;
    }

}

function ticket (state, action) {
    switch (action.type) {
        case ADD_TICKET:
            return {
                rows: [row(state, action)]
            };
        default:
            return state;

    }
}


function tickets(state=[], action) {
    console.log('tickets was called with state', state, 'and action', action);
    console.log(state);
    switch(action.type) {
        case ADD_TICKET:

            return [
                ...state,
                ticket(undefined, action)

            ];
            //return state.card + 1;
        case REMOVE_TICKET:

            return (
                state.slice(0, state.length-1)
            );


        case ADD_ROW:
        {
            if (action.ticketID === undefined) return state;


            let thisTicket = state[action.ticketID];
            if (thisTicket.rows.length >= 5) return state;

            let rows = [];

            thisTicket.rows.forEach( (row) => {
                rows.push(row);
            });

            rows.push(row(state, action));
            let newTicket = {rows: rows};


            let newTickets = [];

            //modify only the ticket with delta row
            state.forEach( (ticket, i) => {
                if (i != action.ticketID) {
                    newTickets.push(ticket);
                } else {
                    newTickets.push(newTicket);
                }
            });

            return newTickets;
        }

        case REMOVE_ROW:
        {
            if (action.ticketID === undefined) return state;

            let thisTicket = state[action.ticketID];
            if (thisTicket.rows.length <= 1) return state;

            let rows = [];
            thisTicket.rows.forEach( (row) => {
                rows.push(row);
            });
            rows.pop();

            let newTicket = {rows: rows};

            let newTickets = [];
            state.forEach( (ticket, i) => {
                if (i != action.ticketID) {
                    newTickets.push(ticket);
                } else {
                    newTickets.push(newTicket);
                }
            });

            //return row(state, action);
            console.log('newtickets')
            console.log(newTickets);
            return newTickets;

        }

        default:
            return state;
    }

}


const todoApp = combineReducers({
    visibilityFilter,
    todos,
    tickets,
})

export default todoApp