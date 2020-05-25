import { renderHtml } from '../utils';

export const createHeader = () => {

  const logoHtml = `
    <h2>Phaser 3 test</h2>
  `;

  const controlsHtml = `
    <div id="controls">
      <h4>Controls</h4>
      <div class="control-group">
        <p>Game</p>
        <button id="start-game" onclick="startGame();">Start</button>
        <button id="stop-game" onclick="stopGame();">Stop</button>
      </div>
      <div class="control-group">
        <p>Spawn speed</p>
        <input id="spawn-slider" class="slider" type="range" min="0" max="100" value="50" />
        <span id="spawn-display">50%</span>
      </div>
    </div>
  `;

  const statusHtml = `
    <div id="status">
      <h4>Status</h4>
      <div class="control-group">
        <span>Spawned:</span><span id="spawn-count">0</span>
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