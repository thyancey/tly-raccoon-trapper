import { setMetric } from '../../services/game/metrics-slice';
import { store } from '../../services/store';

export const createGameInterface = () => {
  if(!(global as any).gameInterface){
    (global as any).gameInterface = (event: string, payload: any) => {
      switch(event){
        case 'setMetric': 
          store.dispatch(setMetric(payload))
          break;
        default: console.error('invalid interface command', event);
      }
    }
  }
  return;
}
