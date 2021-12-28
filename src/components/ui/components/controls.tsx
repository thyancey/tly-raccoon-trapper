import { useEffect, useState } from 'react';
import styled from 'styled-components';

import { useAppSelector } from '../../../app/hooks';
import { selectActiveEnemies } from '../../game/store/metrics-slice';
import { external_setSpawnFrequency } from '../../../phaser/trapper/spawn';

const ScControls = styled.div`
`;

const ScEnemies = styled.div`
`;

function Controls() {
  const activeEnemies = useAppSelector(selectActiveEnemies);
  const [ spawnSpeed, setSpawnSpeed ] = useState(20);

  useEffect(() => {
    external_setSpawnFrequency(spawnSpeed);
  }, [ spawnSpeed ])

  return (
    <ScControls>
  {/* <button className="level-button" onClick="setLevel(0);">Set Level 1</button>
      <button className="level-button" onClick="setLevel(1);">Set Level 2</button> */}
      <p>{'spawn speed'}</p>
      
      <input id="spawn-slider" className="slider" type="range" min="0" max="100" value={spawnSpeed} onChange={e => setSpawnSpeed(e.target.value)}/>
      <p>{`spawn rate: ${spawnSpeed}%`}</p>
      <ScEnemies>
        <span>{'Enemies:'}</span>
        <span>{activeEnemies}</span>
      </ScEnemies>
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