// slightly evolving from create-react-app example
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

export interface StatsState {
  gameStatus: 'active' | 'inactive',
  playStatus: 'inactive' | 'playing' | 'won' | 'lost' | 'paused',
  playStatusReason: string
}

const initialState: StatsState = {
  gameStatus: 'inactive',
  playStatus: 'inactive',
  playStatusReason: ''
};

export const statusSlice = createSlice({
  name: 'status',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    startGame: state => {
      state.gameStatus = 'active';
      state.playStatus = 'playing';
      state.playStatusReason = '';
    },
    exitGame: state => {
      state.gameStatus = 'inactive';
      state.playStatus = 'inactive';
      state.playStatusReason = '';
    },
    winRound: (state, reason: PayloadAction<string>) => {
      state.playStatus = 'won';
      state.playStatusReason = reason.payload;
    },
    loseRound: (state, reason: PayloadAction<string>) => {
      state.playStatus = 'lost';
      state.playStatusReason = reason.payload;
    }
  }
});



export const { startGame, exitGame, winRound, loseRound } = statusSlice.actions;

export const selectGameStatus = (state: RootState) => state.game.status.gameStatus;
export const selectPlayStatus = (state: RootState) => state.game.status.playStatus;
export const selectPlayStatusReason = (state: RootState) => state.game.status.playStatusReason;

const getModalFromGameStatus = createSelector(
  [
    selectGameStatus,
    selectPlayStatus, 
    selectPlayStatusReason
  ],
  (gameStatus, playStatus, reason) => {
    if(gameStatus === 'active'){
      if(['paused', 'lost', 'won'].some(s => s === playStatus)){
        return {
          status: playStatus,
          reason
        } as PlayStatusObj
      }
    }

    return null;    
  }
)
export const ReselectModalFromGameStatus = () => {
  return useSelector(getModalFromGameStatus)
}

export default statusSlice.reducer;