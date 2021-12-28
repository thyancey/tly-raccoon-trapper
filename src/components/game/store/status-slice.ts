// slightly evolving from create-react-app example
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RootState } from '../../../app/store';


export interface StatsState {
  gameStatus: 'active' | 'inactive'
}

const initialState: StatsState = {
  gameStatus: 'inactive'
};

export const statusSlice = createSlice({
  name: 'status',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    startGame: state => {
      state.gameStatus = 'active';
    },
    exitGame: state => {
      state.gameStatus = 'inactive';
    },
  }
});

export const { startGame, exitGame } = statusSlice.actions;

export const selectGameStatus = (state: RootState) => state.game.status.gameStatus;
export default statusSlice.reducer;
