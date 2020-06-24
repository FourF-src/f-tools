function hist(data:number[], sep:number){
  const sorted = [...data].sort((a,b)=>a-b);
  const min = sorted[0];
  const yAix = [];
  let xAix = [];
  let xVal = min;
  let count = 0;
  sorted.forEach(el=>{
    while (el > xVal) {
      yAix.push(count);
      xAix.push(xVal);
      xVal += sep;
      count = 0;
    }
    count += 1; // el <= xVal
  });

  yAix.push(count);
  xAix.push(xVal);

  xAix = xAix.map(el=>Number(el.toFixed(4)));

  return {yAix, xAix};
}

function getInterval(xAix:number[], yAix:number[], val:number){
  const all = yAix.reduce((am, el)=>am+el);
  const newY = yAix.map(el=>Number((el/all).toFixed(3)));
  const idx = xAix.findIndex(el=>el>val);
  if (idx !== undefined) {
    return {prob:newY[idx],interval: [xAix[idx-1], xAix[idx]]};
  }
}
function pcg(a:number, b:number){
  return Number((a/b).toFixed(3));
}
/**
 * 
最低pcg，回升pcg
 */
export function tProb(kdata:Array<any>, current:number, last:number){
  const lows = kdata.map(el=>pcg(Number(el.low),Number(el.preclose))-1);
  const reUp = kdata.map(el=>pcg(Number(el.close)-Number(el.low), Number(el.preclose)));
  const lowsp = hist(lows, 0.001);
  const rep =  hist(reUp, 0.001);
  return {lows:lowsp, reUp:rep, interval: getInterval(lowsp.xAix, lowsp.yAix, current/last-1)};
}