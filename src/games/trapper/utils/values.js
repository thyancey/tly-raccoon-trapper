
export const Values = {
  zindex:{
    BACKGROUND: 0,
    LANE_1: 10,
    LANE_2: 20,
    LANE_3: 30,
    LANE_4: 40,
    FOREGROUND: 50
  }
}


export const getDepthOfLane = (laneIdx, offset = 0) => {
  try{
    const idx = Values.zindex[`LANE_${laneIdx + 1}`] + offset;
    if(!isNaN(idx)) return idx;
  }catch(e){
  }

  return 0;
}

export default Values;