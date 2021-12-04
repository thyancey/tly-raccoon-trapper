import React, { useState } from 'react';
import styled from 'styled-components';
import { getColor } from '../themes';

export const Container = styled.div`
  width:5rem;
  height:5rem;
  background-color: ${getColor('purple')};
`

export function Template() {
  return (
    <Container>
      
    </Container>
  );
}
