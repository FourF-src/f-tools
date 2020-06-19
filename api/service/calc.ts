function hist(data:number[], sep:number){
  const sorted = [...data].sort();
  const min = sorted[0];
  const yAix = [];
  const xAix = [];
  let current = min;
  let currentNum = 0;

  sorted.forEach(el=>{
    while (el > current) {
      yAix.push(currentNum);
      xAix.push(current);
      current += sep;
      currentNum = 0;
    }
    if (el <= current){
      currentNum += 1;
    }
  });

  yAix.push(currentNum);
  xAix.push(current);

  return {xAix: yAix, yAix: xAix};
}

function getInterval(xAix:number[], yAix:number[], val:number){
  const all = yAix.reduce((am, el)=>am+el);
  const newY = yAix.map(el=>Number((el/all).toFixed(3)));
  const idx = xAix.find(el=>el>val);
  if (idx !== undefined) {
    return {prob:newY[idx],interval: [xAix[idx-1], xAix[idx]]};
  }
}
function pcg(a:number, b:number){
  return Number((a/b-1).toFixed(3));
}
/**
 * 
最低pcg，回升pcg
 */
export function tProb(kdata:Array<any>, current:number, last:number){
  const lows = kdata.map(el=>pcg(Number(el.low),Number(el.preclose)));
  const reUp = kdata.map(el=>pcg(Number(el.close)-Number(el.low), Number(el.preclose)));
  const lowsp = hist(lows, 0.0002);
  const rep =  hist(reUp, 0.0002);
  return {lows:lowsp, reUp:rep, interval: getInterval(lowsp.xAix, lowsp.yAix, current/last-1)};
}