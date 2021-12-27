import styled from 'styled-components';
export const ScHeader = styled.div`

  height:10rem;

  padding: 5px;

  display:flex;
  align-items:center;

/* 
  #game-container{
    position:absolute;
    top:$value_gameTop;
    height:calc(100% - #{$value_gameTop});
    width:100%;

    overflow:auto;

    >canvas{
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
  } */

  .header-left{
    border-radius: 20px;
    padding:0px 80px 0px 10px;

    height:100%;
  }
  .header-right{
    flex:1;
    height:100%;
    text-align:right;

    >*{
      display:inline-block;
      width:49%;
      vertical-align:top;

      padding:5px;
      height:100%;

      color: white;

      border-top: 3px solid grey;
      border-bottom: 3px solid grey;
      border-radius: 20px;
      padding-right:10px;
      
      h4{
        margin-top:-10px;
      }
    }
  }

  #controls{

    input{
      display:inline-block;
      vertical-align:middle;
      width:100px;
    }

    button{
      border-radius:10px;
      background-color:transparent;
      padding:4px;

      &#stop-game{
        border:2px solid red;
        color:red;
      }

      &#start-game{
        border:2px solid green;
        color:green;
      }
    }

    #spawn-counter{
      margin-top:10px;
      color: white;
    }
  }

  #status{
    .score-bowls{
      color: red;
    }
    .score-bites{
      color: red;
    }
    .score-hugs{
      color: green;
    }
    .score-total{
      color: white;
    }

    .good{
      color: green;
    }
    .bad{
      color: red;
    }
  }

  .control-group{
    width: 49%;
    display: inline-block;


    color: yellow;

    &:first-child{
      margin-top:0;
    }

    >p{
      margin-bottom:2px;
    }
  }


  .slider {
    -webkit-appearance: none;
    width: 100%;
    height: 15px;
    border-radius: 5px;  
    background: white;
    outline: none;
    opacity: 0.7;
    -webkit-transition: .2s;
    transition: opacity .2s;
  }

  .slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 25px;
    height: 25px;
    border-radius: 50%; 
    background: yellow;
    cursor: pointer;
  }

  .slider::-moz-range-thumb {
    width: 25px;
    height: 25px;
    border-radius: 50%;
    background: yellow;
    cursor: pointer;
  }

  .description{
    text-align:right;
    color: white;
    font-size:14px;
  }
`

export default function OldHeader() {
  return (
    <ScHeader>
      <div className="header-right">
        <div id="controls">
          <h4>Controls</h4>
          <div className="control-group">
            <p>Game</p>
            {/* <button id="start-game" onClick="startGame();">Start</button>
            <button id="stop-game" onClick="stopGame();">Stop</button>
            <button className="level-button" onClick="setLevel(0);">Set Level 1</button>
            <button className="level-button" onClick="setLevel(1);">Set Level 2</button> */}
          </div>
          <div className="control-group">
            <p>Spawn speed</p>
            <input id="spawn-slider" className="slider" type="range" min="0" max="100" value="20" onChange={() => {}}/>
            <span id="spawn-display">20%</span>
            <div id="spawn-counter"><span>Spawned:</span><span id="spawn-count">0</span></div>
          </div>
        </div>
        <div id="status">
          <h4>Status</h4>
          <div className="control-group">
            <div className="score score-bowls"><span>Lost bowls:</span><span id="score-bowls">0</span></div>
            <div className="score score-bites"><span>Bites:</span><span id="score-bites">0</span></div>
            <div className="score score-hugs"><span>Hugs:</span><span id="score-hugs">0</span></div>
            <div className="score score-captures"><span>Captures:</span><span id="score-captures">0</span></div>
            <div className="score score-escapes"><span>Escapes:</span><span id="score-escapes">0</span></div>
            <div className="score score-total"><span>Score:</span><span id="score-total">0</span></div>
          </div>
        </div>
      </div> 
    </ScHeader>
  );
}
