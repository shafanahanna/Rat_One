import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import thunk from 'redux-thunk';

// Import reducers (will be created next)
import countriesReducer from './slices/countriesSlice';
import branchesReducer from './slices/branchesSlice';
import usersReducer from './slices/usersSlice';
import employeesReducer from './slices/employeesSlice';

const rootReducer = combineReducers({
  countries: countriesReducer,
  branches: branchesReducer,
  users: usersReducer,
  employees: employeesReducer,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
  devTools: import.meta.env.DEV,
});

export default store;
