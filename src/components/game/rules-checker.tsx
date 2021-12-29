export const evaluateExpression = (condition: StringCondition, criteria: number, value: number) => {
  switch(condition){
    case '=':
      return value === criteria;
    case '<':
      return value < criteria;
    case '<=':
      return value <= criteria;
    case '>':
      return value > criteria;
    case '>=':
      return value >= criteria;
    default: return false;
  }
}

export const checkMetricRules = (metricRules: Array<MetricRule>, stateMetrics: GameMetrics) => {
  return metricRules.map(m => {
    if(checkMetricRule(m, stateMetrics[m.metric])) return m.result;
    return null;
  }).filter(result => !!result) as Array<string>;
}

export const checkMetricRule = (metricRule: MetricRule, stateValue: number) => {
  return evaluateExpression(metricRule.condition, metricRule.value, stateValue)
}



export const evaluateGameConditions = (gameConditions: Array<GameCondition>, results: Array<string>) => {
  const resultObjs = [];
  for(let i = 0; i < gameConditions.length; i++){
    const passedCondition = evaluateGameCondition(gameConditions[i], results);
    if(passedCondition){
      resultObjs.push({
        action: passedCondition.then,
        reason: passedCondition.reason
      });
      if(passedCondition.halt){
        break;
      }
    }
  }

  return resultObjs;
}

export const evaluateGameCondition = (gameCondition: GameCondition, results: Array<string>) => {
  for(let i = 0; i < gameCondition.when.length; i++){
    if(!results.some(gc => gc === gameCondition.when[i])){
      return null;
    }
  }

  return gameCondition;
}