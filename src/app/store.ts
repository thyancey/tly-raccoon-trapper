import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import menuReducer from '../components/menu/menu-slice';

export const store = configureStore({
  reducer: {
    menu: menuReducer,
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
