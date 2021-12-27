import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import uiReducer from '../components/ui/ui-slice';
import statsReducer from '../components/ui/stats-slice';

export const store = configureStore({
  reducer: {
    ui: uiReducer,
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
