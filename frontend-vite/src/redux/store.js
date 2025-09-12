import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // localStorage
import { combineReducers } from 'redux';

import authReducer from './slices/authSlice';
import countriesBranchesReducer from './slices/countriesBranchesSlice';
import usersReducer from './slices/usersSlice';
import employeeReducer from './slices/employeeSlice';
import attendanceReducer from './slices/attendanceSlice';
import leaveManagementReducer from './features/leaveManagementSlice';

// Configure persistence for each reducer
const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['user', 'token'] // only persist these fields from auth
};

const countriesBranchesPersistConfig = {
  key: 'countriesBranches',
  storage,
  whitelist: ['countries'] // only persist countries data
};

const usersPersistConfig = {
  key: 'users',
  storage,
  whitelist: ['users', 'assignmentStats'] // persist users and assignment stats
};

const employeePersistConfig = {
  key: 'employees',
  storage,
  whitelist: ['employees', 'departments', 'currentEmployee'] // persist employees, departments, and currentEmployee data
};

const attendancePersistConfig = {
  key: 'attendance',
  storage,
  whitelist: ['attendanceData'] // persist attendance data
};

const leaveManagementPersistConfig = {
  key: 'leaveManagement',
  storage,
  whitelist: ['leaveTypes', 'leaveBalances'] // persist leave types and balances data
};

// Create persisted reducers
const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);
const persistedCountriesBranchesReducer = persistReducer(countriesBranchesPersistConfig, countriesBranchesReducer);
const persistedUsersReducer = persistReducer(usersPersistConfig, usersReducer);
const persistedEmployeeReducer = persistReducer(employeePersistConfig, employeeReducer);
const persistedAttendanceReducer = persistReducer(attendancePersistConfig, attendanceReducer);
const persistedLeaveManagementReducer = persistReducer(leaveManagementPersistConfig, leaveManagementReducer);

// Combine reducers
const rootReducer = combineReducers({
  auth: persistedAuthReducer,
  countriesBranches: persistedCountriesBranchesReducer,
  users: persistedUsersReducer,
  employees: persistedEmployeeReducer,
  attendance: persistedAttendanceReducer,
  leaveManagement: persistedLeaveManagementReducer,
});

// Create store
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

// Create persistor
export const persistor = persistStore(store);
