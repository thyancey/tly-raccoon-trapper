import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import menuReducer from '../components/menu/menu-slice';
import statsReducer from '../components/header/stats-slice';

export const store = configureStore({
  reducer: {
    menu: menuReducer,
    stats: statsReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
