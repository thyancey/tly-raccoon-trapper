import styled, { css } from 'styled-components';

import { useAppSelector } from '../../../services/hooks';
import { getColor } from '../../../themes';
import { selectGoodMetrics, selectScore, selectBadMetrics } from '../../../services/game/metrics-slice';

type StatsProps = {
  statType: StatType;
}

type StatType = 'good' | 'bad' | 'neutral'

const ScStats = styled.div`
  position:absolute;
  bottom:0;
  left:0;
  width:100%;
  background-color: ${getColor('brown')};

  color: ${getColor('white')};
  padding: 1rem;
  text-align:center;

  >h4{
    text-align:left;
  }
`;

const ScStatGroup = styled.div<StatsProps>`
  vertical-align:top;
  text-align:right;
  display:inline-block;
  width:calc(50% - .5rem);
  margin-top:1rem;
  padding:.5rem;
  color: ${getColor('grey_dark')};

  ${p => p.statType === 'good' && css`
    background-color:${getColor('green')};
  `}
  ${p => p.statType === 'bad' && css`
    background-color:${getColor('pink')};
    margin-left:1rem;
  `}

  h4{
    text-align:center;
  }
`;

const ScStat = styled.div`
  display:block;
`

const ScDebug = styled.div`
  display:inline-block;
  height:100%;
  width:100%;
  
  span { font-size: 3rem; }
  font-weight: bold;
  text-align:right;
  color: white;
`

export function DebugStats() {
  const goodStats = useAppSelector(selectGoodMetrics);
  const badStats = useAppSelector(selectBadMetrics);
  const score = useAppSelector(selectScore);

  return (
    <ScStats>
      <h4>{'Debug and score'}</h4>
      <ScStatGroup statType={'good'}>
        <h4>{'Good Stuff'}</h4>
        {goodStats.map((s, idx) => (
          <ScStat key={idx} >
            <span>{`${s.key}:`}</span><span>{s.value}</span>
          </ScStat>
        ))}
      </ScStatGroup>
      <ScStatGroup statType={'bad'}>
        <h4>{'Bad Stuff'}</h4>
        {badStats.map((s, idx) => (
          <ScStat key={idx} >
            <span>{`${s.key}:`}</span><span>{s.value}</span>
          </ScStat>
        ))}
      </ScStatGroup>
      <ScDebug>
        <span>{'Score:'}</span>
        <span>{score}</span>
      </ScDebug>
    </ScStats>
  )
}