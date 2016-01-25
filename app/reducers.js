import { combineReducers } from 'redux'
import { ADD_TODO, COMPLETE_TODO, SET_VISIBILITY_FILTER, VisibilityFilters, ADD_TICKET, REMOVE_TICKET } from './actions'
import {ADD_ROW, REMOVE_ROW, ADD_CELL, ROW_DATA, EntryType, INJECT_TICKETS, INJECT_WINNER} from './actions'
import {EntryObj} from './components/EntryObj';


const { SHOW_ALL } = VisibilityFilters
const { WINNING_ENTRY, ROW_ENTRY} = EntryType;

function log(msg) {
    console.log(msg);
}

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

//===========================
function checkEntries(keys, checkThis) {

    for (let key in keys) {
        if (checkThis[key] === undefined) {
            return false;
        }
    }

    return true;
}

function emptyRow() {
    return (EntryObj());
}

function row (state, action) {
    switch(action.type) {
        case ADD_TICKET:
        case ADD_ROW:

            return (emptyRow())

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

    //console.dir(newTickets);
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
            if (!checkEntries({ticketID: 1}, action)) return state;

            let rows = copyRows(state, action);
            if (rows.length === 5) return state;

            rows.push(row(state, action));

            let newTicket = {rows: rows};
            let newTickets = [];
            return packageTickets(state, action, newTicket);

        }

        case REMOVE_ROW:
        {
            if (!checkEntries({ticketID: 1}, action)) return state;

            let rows = copyRows(state, action);
            if (rows.length === 1) return state;

            rows.pop();

            let newTicket = {rows: rows};
            return packageTickets(state, action, newTicket);

        }

        case ADD_CELL:
        {
            //TODO: test this
            if (!checkEntries({ticketID: 1, rowID: 1, cell: 1} , action)) return state;


            if (action.rowID >= 5 || action.rowID < 0) return state;

            let rows = copyRows(state, action);
            let row = rows[action.rowID];
            row[action.cell.key] = action.cell.value;


            let newTicket = {rows: rows};
            return packageTickets(state, action, newTicket);

        }

        case ROW_DATA:
        {
            if (!checkEntries({ticketID: 1, rowID: 1, entryType: 1}, action)) return state;
            if (action.entryType === WINNING_ENTRY) return state;

            console.log('have ROW_DATA');

            let rows = copyRows(state, action);
            let row = rows[action.rowID];

            let i = 0;
            for (let key in row) {
                row[key] = action.entryData[i++];
            }

            let newTicket = {rows: rows};
            return packageTickets(state, action, newTicket);
        }

        case INJECT_TICKETS:
        {
            return action.data;
        }

        default:
            return state;
    }

}

function winningNumbers(state={}, action) {

    console.log('winningNUmbers was called with state', state, 'and action', action);
    switch( action.type) {
        case ROW_DATA:
        {
            if (!checkEntries({ticketID: 1, rowID: 1, entryType: 1}, action)) return state;
            if  (action.entryType === ROW_ENTRY) return state;

            let row = emptyRow();
            let i=0;
            for (let key in row) {
                row[key] = action.entryData[i++];
            }

            return row;
        }

        case INJECT_WINNER: {
            return action.data;
        }


        default:
            return state;
    }


}


const todoApp = combineReducers({
    visibilityFilter,
    todos,
    tickets,
    winningNumbers
})

export default todoApp