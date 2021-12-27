// slightly evolving from create-react-app example
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RootState } from '../../app/store';


export interface StatsState {
  bowls: number,
  hugs: number,
  bites: number,
  total: number,
  captures: number,
  escapes: number,
  score: number,
  activeEnemies: number
}

const initialState: StatsState = {
  bowls: 0,
  hugs: 0,
  bites: 0,
  total: 0,
  captures: 0,
  escapes: 0,
  score: 0,
  activeEnemies: 0
};

const scoreModifiers = {
  bowls: -.25,
  hugs: 5,
  bites: -10,
  captures: 10,
  escapes: -5
};

export const statsSlice = createSlice({
  name: 'stats',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setStat: (state, action: PayloadAction<any>) => {
      const key = action.payload?.key;
      if(state[key] !== undefined){
        state[key] = action.payload?.value;
      }else{
        console.error('invalid stat called in reducer:', action.payload.key)
      }

      state.score = getScore(state);
    }
  }
});

export const getScore = stats => {
  let total = 0;
  Object.keys(stats).forEach(k => {
    // ignore 'score' or other unwanted values
    if(scoreModifiers[k]){
      total += stats[k] * scoreModifiers[k];
    }
  })

  return total;
}

export const { setStat } = statsSlice.actions;
export const selectStats = (state: RootState) => {
  return Object.keys(state.stats).map(k => ({
    key: k,
    value: state.stats[k]
  })).filter(s => scoreModifiers[s.key] !== undefined);
};
export const selectScore = (state: RootState) => state.stats.score;
export const selectActiveEnemies = (state: RootState) => state.stats.activeEnemies;
export default statsSlice.reducer;
