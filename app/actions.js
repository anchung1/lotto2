/*
 * action types
 */

export const ADD_TODO = 'ADD_TODO'
export const COMPLETE_TODO = 'COMPLETE_TODO'
export const SET_VISIBILITY_FILTER = 'SET_VISIBILITY_FILTER'
export const ADD_TICKET = 'ADD_TICKET';
export const REMOVE_TICKET = 'REMOVE_TICKET';
export const ADD_ROW = 'ADD_ROW';
export const REMOVE_ROW = 'REMOVE_ROW';
export const ADD_CELL = 'ADD_CELL';
export const ROW_DATA = 'ROW_DATA';
export const INJECT_TICKETS = 'INJECT_TICKETS';
export const INJECT_WINNER = 'INJECT_WINNER';


/*
 * other constants
 */
export const EntryType = {
    WINNING_ENTRY: 'WINNING_ENTRY',
    ROW_ENTRY: 'ROW_ENTRY'
};

export const VisibilityFilters = {
    SHOW_ALL: 'SHOW_ALL',
    SHOW_COMPLETED: 'SHOW_COMPLETED',
    SHOW_ACTIVE: 'SHOW_ACTIVE'
}


/*
 * action creators
 */

let nextTodoId = 0;

export function addTodo(text) {
    return {
        type: ADD_TODO,
        id: nextTodoId++,
        text
    };
}

export function completeTodo(id) {
    return { type: COMPLETE_TODO, id }
}

export function setVisibilityFilter(filter) {
    return { type: SET_VISIBILITY_FILTER, filter }
}

export function addTicket() {
    return {
        type: ADD_TICKET
    }
}

export function removeTicket() {
    return {
        type: REMOVE_TICKET
    }
}

export function addRow(t) {
    return {
        type: ADD_ROW,
        ticketID: t
    }
}

export function removeRow(t) {
    return {
        type: REMOVE_ROW,
        ticketID: t
    }
}

export function rowData(entryType, ticket, row, data) {
    return {
        type: ROW_DATA,
        entryType: entryType,
        ticketID: ticket,
        rowID: row,
        entryData: data
    }
}


export function addCell(ticket, row, cell) {
    return {
        type: ADD_CELL,
        ticketID: ticket,
        rowID: row,
        cell: {key: cell.key, value: cell.value}
    }
}

export function injectTickets(data) {
    return {
        type: INJECT_TICKETS,
        data: data
    }
}

export function injectWinner(data) {
    return {
        type: INJECT_WINNER,
        data: data
    }
}


//AJAX calls
class restAPI {
    constructor(url) {
        this._url = url;
    }

    getGreet() {
        var url = this._url + 'api/greet';
        $.get(url).then(
            function(data) {
                console.log(data);
            }
        )
    }

    getCookieID() {
        var baseUrl = this._url;
        var url = this._url + 'api/setCookie';
        $.get(url).then(
            function(data) {
                console.log(data);

            }
        ).always( () => {
            var url = this._url + 'api/getCookie';
            $.get(url).then(
                function(data) {
                    console.log(data);
                }
            );
        });

    }


};

let restUrl = 'https://localhost:3001/';
let restObj = new restAPI(restUrl);
export function ajax() {
    return restObj;
}


