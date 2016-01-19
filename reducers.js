import { combineReducers } from 'redux'
import { ADD_TODO, COMPLETE_TODO, SET_VISIBILITY_FILTER, VisibilityFilters, ADD_TICKET, REMOVE_TICKET } from './actions'
import {ADD_ROW, REMOVE_ROW, ADD_CELL} from './actions'
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

function copyRows (state, action) {

    let ticketRows = state[action.ticketID].rows;
    let rows = [];

    ticketRows.forEach( (row) => {
        rows.push(row);
    });

    return rows;
}

function packageTickets (state, action, newTicket) {

    let newTickets = [];
    state.forEach( (ticket, i) => {
        if (i != action.ticketID) {
            newTickets.push(ticket);
        } else {
            newTickets.push(newTicket);
        }
    });

    console.log(newTickets);
    return newTickets;
}

function tickets(state=[], action) {
    console.log('tickets was called with state', state, 'and action', action);
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

            let rows = copyRows(state, action);
            if (rows.length === 5) return state;

            rows.push(row(state, action));

            let newTicket = {rows: rows};
            let newTickets = [];
            return packageTickets(state, action, newTicket);

        }

        case REMOVE_ROW:
        {
            if (action.ticketID === undefined) return state;

            let rows = copyRows(state, action);
            if (rows.length === 1) return state;

            rows.pop();

            let newTicket = {rows: rows};
            return packageTickets(state, action, newTicket);

        }

        case ADD_CELL:
        {
            if (action.ticketID === undefined || action.rowID === undefined || action.cell === undefined) {
                return state;
            }

            if (action.rowID >= 5 || action.rowID < 0) return state;

            let rows = copyRows(state, action);
            let row = rows[action.rowID];
            row[action.cell.key] = action.cell.value;


            let newTicket = {rows: rows};
            return packageTickets(state, action, newTicket);

        }


        default:
            return state;
    }

}


const todoApp = combineReducers({
    visibilityFilter,
    todos,
    tickets
})

export default todoApp