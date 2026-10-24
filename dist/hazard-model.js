'use strict';
function assessWrecks(v){
 const finite=x=>typeof x==='number'&&Number.isFinite(x);
 const flags=[];const missing=[];
 for(const k of ['wind','gust','wave','current','tideRate'])if(!finite(v[k]))missing.push(k);
 if(finite(v.wind)&&v.wind>=15)flags.push('Wind ≥15 kn');
 if(finite(v.gust)&&v.gust>=20)flags.push('Gusts ≥20 kn');
 if(finite(v.wave)&&v.wave>=1)flags.push('Regional waves ≥1 m');
 if(finite(v.current)&&v.current>=1)flags.push('Regional current ≥1 kn');
 if(finite(v.tideRate)&&Math.abs(v.tideRate)>=.3)flags.push('Tide changing ≥0.30 m/h');
 if([95,96,99].includes(v.code))flags.push('Thunderstorm forecast');
 return {flags,missing,title:missing.length?'Incomplete assessment':flags.length?'Elevated indicators':'No screening triggers',color:missing.length?'#687d8c':flags.length?'#ae5428':'#697a87'};
}
if(typeof module!=='undefined')module.exports={assessWrecks};
