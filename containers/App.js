import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { addTodo, completeTodo, setVisibilityFilter, VisibilityFilters, addTicket, removeTicket } from '../actions'
import {addRow, removeRow, addCell} from '../actions'
import AddTodo from '../components/AddTodo'
import TodoList from '../components/TodoList'
import Footer from '../components/Footer'
import Game from '../components/Game'


class App extends Component {
    render() {
        // Injected by connect() call:
        const { dispatch, visibleTodos, visibilityFilter, tickets } = this.props;
        return (
            <div>
                <Game
                    tickets={tickets}
                    onTicketClick = { (mode) => {
                        if (mode==='add') {
                            dispatch(addTicket());
                        }
                        if (mode==='remove') {
                            dispatch(removeTicket());
                        }
                    }}
                    onRowClick = { (mode, t) => {
                        if (mode==='add') {
                            dispatch(addRow(t));
                        }
                        if (mode==='remove') {
                            dispatch(removeRow(t));
                        }
                    }}



                />
            </div>
        )
    }
}

App.propTypes = {
    visibleTodos: PropTypes.arrayOf(PropTypes.shape({
        text: PropTypes.string.isRequired,
        completed: PropTypes.bool.isRequired
    }).isRequired).isRequired,
    visibilityFilter: PropTypes.oneOf([
        'SHOW_ALL',
        'SHOW_COMPLETED',
        'SHOW_ACTIVE'
    ]).isRequired
}

function selectTodos(todos, filter) {
    switch (filter) {
        case VisibilityFilters.SHOW_ALL:
            return todos
        case VisibilityFilters.SHOW_COMPLETED:
            return todos.filter(todo => todo.completed)
        case VisibilityFilters.SHOW_ACTIVE:
            return todos.filter(todo => !todo.completed)
    }
}

// Which props do we want to inject, given the global state?
// Note: use https://github.com/faassen/reselect for better performance.
function select(state) {
    return {
        visibleTodos: selectTodos(state.todos, state.visibilityFilter),
        visibilityFilter: state.visibilityFilter,
        tickets: state.tickets
    }
}

// Wrap the component to inject dispatch and state into it
export default connect(select)(App)