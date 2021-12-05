import styled from 'styled-components';
import { getColor } from '../themes';
import { Button } from '../components/button';

export const Container = styled.div`
  position:absolute;
  left:0;
  top:0;
  bottom:0;
  right:0;
  background-color: ${getColor('purple')};
  z-index:-1;
  padding-top:10rem;
`

export function Template() {
  return (
    <Container>
      <h1>{'Experiment 1'}</h1>
      <Button text="hello" onClick={e => console.log('AHH!', e)} />
    </Container>
  );
}
