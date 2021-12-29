import { useEffect } from 'react';
import styled from 'styled-components';
import { selectMetricsMap } from '../../services/game/metrics-slice';
import { selectGameStatus, loseRound, winRound, selectPlayStatus } from '../../services/game/status-slice';
import { useAppSelector } from '../../services/hooks';
import RulesJson from './rules.json';
import { checkMetricRules, evaluateGameConditions } from './rules-checker';
import { useDispatch } from 'react-redux';

const getRulesObj = () => {
  return RulesJson.TRAPPER as RulesDefinition;
}

export function Brain() {
  const dispatch = useDispatch();
  const metrics = useAppSelector(selectMetricsMap);
  const playStatus = useAppSelector(selectPlayStatus);

  useEffect(() => {
    // if game isnt running, no need to check win conditions
    if(playStatus === 'playing'){
      const rules = getRulesObj();
      // get back a list of conditions based on rules, like "you slang too many bowls!"
      const results = checkMetricRules(rules.metrics, metrics);
  
      const resultActions = evaluateGameConditions(rules.conditions, results);
      resultActions.forEach(resultAction => {
        switch(resultAction.action){
          case 'LOSE': dispatch(loseRound(resultAction.reason)); break;
          case 'WIN': dispatch(winRound(resultAction.reason)); break;
          default: break;
        }
      })
    }
  }, [ metrics, playStatus, dispatch ])

  return null;
}
