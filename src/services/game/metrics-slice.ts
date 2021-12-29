// slightly evolving from create-react-app example
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RootState } from '../store';


export interface StatsState {
  bowls: number,
  hugs: number,
  bites: number,
  captures: number,
  escapes: number,
  activeEnemies: number
}

const initialState: StatsState = {
  bowls: 0,
  hugs: 0,
  bites: 0,
  captures: 0,
  escapes: 0,
  activeEnemies: 0
};

const scoreModifiers = {
  bowls: -.25,
  hugs: 5,
  bites: -10,
  captures: 10,
  escapes: -5
};

export const metricsSlice = createSlice({
  name: 'metrics',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setMetric: (state, action: PayloadAction<any>) => {
      const key = action.payload?.key;
      if(state[key] !== undefined){
        state[key] = action.payload?.value;
      }else{
        console.error('invalid stat called in reducer:', action.payload.key)
      }

      // state.score = getScore(state);
    }
  }
});

export const getScore = metrics => {
  let total = 0;
  Object.keys(metrics).forEach(k => {
    // ignore 'score' or other unwanted values
    if(scoreModifiers[k]){
      total += metrics[k] * scoreModifiers[k];
    }
  })

  return total;
}



export const { setMetric } = metricsSlice.actions;
export const selectMetrics = (state: RootState): Array<GameMetric> => {
  return Object.keys(state.game.metrics)
  .filter(sKey => scoreModifiers[sKey] !== undefined)
  .map(k => ({
    key: k,
    value: state.game.metrics[k],
    isGood: scoreModifiers[k] > 0
  }));
};

export const selectMetricsMap = (state: RootState): GameMetrics => {
  return state.game.metrics;
};

export const selectGoodMetrics = (state: RootState) => {
  return selectMetrics(state).filter(s => s.isGood);
};
export const selectBadMetrics = (state: RootState) => {
  return selectMetrics(state).filter(s => !s.isGood);
};
export const selectScore = (state: RootState) => getScore(state.game.metrics);
export const selectActiveEnemies = (state: RootState) => state.game.metrics.activeEnemies;
export default metricsSlice.reducer;
