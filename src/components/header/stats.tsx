import styled from 'styled-components';
import { useAppSelector } from '../../app/hooks';
import { selectStats, selectScore } from './stats-slice';

const ScStats = styled.div`
`;

const ScStat = styled.div`
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
      {stats.map((s, idx) => (
        <ScStat key={idx}>
          <span>{`${s.key}:`}</span><span>{s.value}</span>
        </ScStat>
      ))}
      <ScScore>
        <span>{'Score:'}</span>
        <span>{score}</span>
      </ScScore>
    </ScStats>
  )
}

export default Stats;
