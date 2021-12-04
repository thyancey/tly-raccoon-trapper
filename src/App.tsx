import { Counter } from './examples/counter/Counter';
import { Template } from './experiments/template';
import { getColor } from './themes/';
import styled from 'styled-components';

export const GroupContainer = styled.div`
  background-color: ${getColor('blue')};
  border: 2rem solid ${getColor('black')};
  border-radius: 5rem;
  margin: 5rem;
  padding: 5rem;
`

function App() {
  return (
    <div>
      <GroupContainer>
        <h2>{'Experiments'}</h2>
        <Template />
      </GroupContainer>
      <GroupContainer>
        <h2>{'Examples'}</h2>
        <Counter />
      </GroupContainer>
    </div>
  );
}

export default App;
