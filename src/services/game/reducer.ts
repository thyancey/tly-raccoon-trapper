import { combineReducers } from 'redux'
import metricsReducer from './metrics-slice';
import statusReducer from './status-slice';

export default combineReducers({
  metrics: metricsReducer,
  status: statusReducer
})