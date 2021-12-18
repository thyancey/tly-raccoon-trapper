import { renderHtml } from '../utils';

export const createHeader = () => {

  const logoHtml = `
    <h2>Raccoon Trapper</h2>
    <div class="description">
      <p>Feed the raccoons and give them hugs!</p>
      <p>Kick the ones who don't love you!</p>
      <p>Arrow Up/Down: Change langes</p>
      <p>Arrow Left: Hug</p>
      <p>Arrow Right: Charge kick</p>
      <p>Space: Throw food</p>
      <p>... you can't win or lose right now</p>
    </div>
  `;

  const controlsHtml = `
    <div id="controls">
      <h4>Controls</h4>
      <div class="control-group">
        <p>Game</p>
        <button id="start-game" onclick="startGame();">Start</button>
        <button id="stop-game" onclick="stopGame();">Stop</button>
        <button class="level-button" onclick="setLevel(0);">Set Level 1</button>
        <button class="level-button" onclick="setLevel(1);">Set Level 2</button>
      </div>
      <div class="control-group">
        <p>Spawn speed</p>
        <input id="spawn-slider" class="slider" type="range" min="0" max="100" value="20" />
        <span id="spawn-display">20%</span>
        <div id="spawn-counter"><span>Spawned:</span><span id="spawn-count">0</span></div>
      </div>
    </div>
  `;

  const statusHtml = `
    <div id="status">
      <h4>Status</h4>
      <div class="control-group">
        <div class="score score-bowls"><span>Lost bowls:</span><span id="score-bowls">0</span></div>
        <div class="score score-bites"><span>Bites:</span><span id="score-bites">0</span></div>
        <div class="score score-hugs"><span>Hugs:</span><span id="score-hugs">0</span></div>
        <div class="score score-total"><span>Score:</span><span id="score-total">0</span></div>
      </div>
    </div>
  `;

  renderHtml('#header', `
    <div class="header-left">
      ${logoHtml}
    </div>
    <div class="header-right">
      ${controlsHtml}
      ${statusHtml}
    </div>
  `);
}