import styled from 'styled-components';
import { getColor } from '../../themes/';

const ScControls = styled.div`
`;

function Controls() {
  return (
    <ScControls>
      <p>{'spawn speed'}</p>
      <p>{'spawn count:0'}</p>
    </ScControls>
  )
}

export default Controls;

/*
<div className="control-group">
<p>Spawn speed</p>
<input id="spawn-slider" className="slider" type="range" min="0" max="100" value="20" onChange={() => {}}/>
<span id="spawn-display">20%</span>
<div id="spawn-counter"><span>Spawned:</span><span id="spawn-count">0</span></div>
</div>
*/