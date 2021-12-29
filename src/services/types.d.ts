type GameMetricKey = 'bowls' | 'hugs' | 'bites' | 'captures' | 'escapes' | 'activeEnemies';
type StringCondition = '=' | '<' | '<=' | '>' | '>=';

type GameMetrics = {
  bowls: number,
  hugs: number,
  bites: number,
  captures: number,
  escapes: number,
  activeEnemies: number
}

type GameMetric = {
  key: string,
  value: any,
  isGood: boolean
}

type RulesJson = {
  TRAPPER: RulesDefinition
}

// from rules JSON
type RulesDefinition = {
  title: string,
  metrics: Array<MetricRule>,
  conditions: Array<GameCondition>
}

type MetricRule = {
  metric: GameMetricKey,
  condition: StringCondition,
  value: number,
  result: string
}

type GameCondition = {
  when: Array<string>,
  then: string,
  reason: string,
  halt: boolean
}

type PlayStatusObj = {
  status: string,
  reason: string
}