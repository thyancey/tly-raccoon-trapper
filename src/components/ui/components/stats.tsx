import styled, { css } from 'styled-components';

import { useAppSelector } from '../../../app/hooks';
import { getColor } from '../../../themes';
import { selectStats, selectScore } from '../stats-slice';

type StatsProps = {
  statType: StatType;
}

type StatType = 'good' | 'bad' | 'neutral'

const statMap = {
  bowls: 'bad',
  hugs: 'good',
  bites: 'bad',
  captures: 'good',
  escapes: 'bad'
}

const getStatType = (statKey: string): StatType => {
  return statMap[statKey] || 'neutral';
}

const ScStats = styled.div`
  margin-top:1rem;
  text-align:right;
  padding-right:8rem;
`;

const ScStat = styled.div<StatsProps>`
  color:grey;
  ${p => p.statType === 'good' && css`
    color:${getColor('green')};
  `}
  ${p => p.statType === 'bad' && css`
  color:${getColor('pink')};
  `}
`

const ScScore = styled.div`
  span{
    font-size: 3rem;
  }
`;

function Stats() {
  const stats = useAppSelector(selectStats);
  const score = useAppSelector(selectScore);

  return (
    <ScStats>
      <h4>{'Score'}</h4>
      {stats.map((s, idx) => (
        <ScStat key={idx} statType={getStatType(s.key)}>
          <span>{`${s.key}:`}</span><span>{s.value}</span>
        </ScStat>
      ))}
      <ScScore>
        <span>{'Total:'}</span>
        <span>{score}</span>
      </ScScore>
    </ScStats>
  )
}

export default Stats;
