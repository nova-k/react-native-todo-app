import React, { useReducer, useContext } from 'react'
import { Alert } from 'react-native'

import { TodoContext } from './todoContext'
import { todoReducer } from './todoReducer'
import { ADD_TODO, REMOVE_TODO, UPDATE_TODO, SHOW_LOADER, HIDE_LOADER, SHOW_ERROR, CLEAR_ERROR, FETCH_TODOS } from '../types'
import { ScreenContext } from '../screen/screenContext'

export const TodoState = ({ children }) => {
	const initialState = {
		todos: [],
		loading: false,
		error: null
	}

	const { changeScreen } = useContext(ScreenContext)

	const [state, dispatch] = useReducer(todoReducer, initialState)

	const addTodo = async title => {
		const response = await fetch('https://react-native-todo-app-91b23.firebaseio.com/todos.json', {
			method: 'POST',
			headers: { 'Content-type': 'application/json' },
			body: JSON.stringify({ title })
		})
		const data = await response.json()
		dispatch({ type: ADD_TODO, title, id: data.name })
	}

	const removeTodo = id => {
		const todo = state.todos.find(t => t.id === id)

		Alert.alert(
			'Удаление элемента',
			`Вы уверенны, что хотите удалить "${todo.title}" ?`,
			[
				{
					text: 'Отмена',
					style: 'cancel'
				},
				{
					text: 'Удалить',
					style: 'destructive',
					onPress: async () => {
						changeScreen(null)
						await fetch(`https://react-native-todo-app-91b23.firebaseio.com/todos/${id}.json`, {
							method: 'DELETE',
							headers: { 'Content-type': 'application/json' },
						})
						dispatch({ type: REMOVE_TODO, id })
					}
				}
			],
			{ cancelable: false }
		);
	}

	const updateTodo = async (id, title) => {
		clearError()
		try {
			await fetch(`https://react-native-todo-app-91b23.firebaseio.com/todos/${id}.json`, {
				method: 'PATCH',
				headers: { 'Content-type': 'application/json' },
				body: JSON.stringify({ title })
			})
			dispatch({ type: UPDATE_TODO, id, title })
		} catch (e) {
			showError('Что-то пошло не так...')
			console.log(e)
		}
	}

	// Server
	const fetchTodos = async () => {
		showLoader()
		clearError()
		try {
			const response = await fetch('https://react-native-todo-app-91b23.firebaseio.com/todos.json',
				{
					method: 'GET',
					headers: { 'Content-type': 'application/json' },
				}
			)
			const data = await response.json()
			const todos = Object.keys(data).map(key => ({ ...data[key], id: key }))
			
			dispatch({ type: FETCH_TODOS, todos })
		} catch (e) {
			showError('Что-то пошло не так...')
			console.log(e)
		} finally {
			hideLoader()
		}
	}

	const showLoader = () => dispatch({ type: SHOW_LOADER })

	const hideLoader = () => dispatch({ type: HIDE_LOADER })

	const showError = (error) => dispatch({ type: SHOW_ERROR, error })

	const clearError = () => dispatch({ type: CLEAR_ERROR })


	return (
		<TodoContext.Provider value={{
			todos: state.todos,
			loading: state.loading,
			error: state.error,
			addTodo,
			removeTodo,
			updateTodo,
			fetchTodos
		}}
		>
			{children}
		</TodoContext.Provider>
	)
}