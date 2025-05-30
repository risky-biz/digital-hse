import { legacy_createStore as createStore } from 'redux'

const initialState = {
  sidebarShow: true,
  sidebarUnfoldable: false,
  theme: 'light',
}

type AppState = typeof initialState

type Action = {
  type: 'set'
  sidebarShow?: boolean
  sidebarUnfoldable?: boolean
  theme?: string
}

const changeState = (state = initialState, action: Action): AppState => {
  switch (action.type) {
    case 'set':
      const { type, ...payload } = action
      return { ...state, ...payload }
    default:
      return state
  }
}

export const store = createStore(changeState)