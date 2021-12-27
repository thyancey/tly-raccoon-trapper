import styled from 'styled-components';
import { getColor } from '../../themes/';

const ScStats = styled.div`
`;

const ScStat = styled.div`
`

function Stats() {
  const stats = [
    {
      name: 'Lost bowls',
      value: 0
    },{
      name: 'Bites',
      value: 10
    },{
      name: 'Hugs',
      value: 0
    },{
      name: 'Captures',
      value: 0
    },{
      name: 'Score',
      value: 0
    },
  ]

  return (
    <ScStats>
      {stats.map((s, idx) => (
        <ScStat key={idx}>
          <span>{`${s.name}:`}</span><span>{s.value}</span>
        </ScStat>
      ))}
    </ScStats>
  )
}

export default Stats;
