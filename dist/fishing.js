'use strict';
const reefGuide={
 'North Moreton':{depth:'14m average',structure:'25 concrete fish boxes in three clusters.',method:'Designed mainly for pelagic spearfishing.',restriction:'Scuba diving prohibited without specific authorisation.'},
 'Wild Banks':{depth:'35m average',structure:'Steel fish caves, 11m high.',method:'Pelagics including mackerel, mahi mahi and wahoo; trolling or drifting.',restriction:'No anchoring; spearfishing limited to 12m depth, unless specifically authorised.'},
 'Harry Atkinson':{depth:'21m at Tiwi Pearl',structure:'Wrecks, rock and concrete pipes.',method:'Target individual structures.',restriction:'Spearfishing and recreational diving restricted.'},
 'West Peel':{depth:'Not provided here',structure:'341 reef balls across 19 clusters.',method:'Quiet drifts and casting for snapper.',restriction:'Spearfishing and scuba restricted.'},
 'East Coochie':{depth:'Not provided here',structure:'174 reef balls across 13 clusters.',method:'Quiet drifts across reef clusters.',restriction:'Spearfishing and scuba restricted.'},
 'Turner':{depth:'Approximately 6m',structure:'Six concrete-module clusters.',method:'Shallow artificial structure.',restriction:'Check current species and gear rules.'},
 'North Stradbroke':{depth:'10–12m',structure:'38 arrowhead modules across five clusters.',method:'Artificial reef habitat.',restriction:'Check current species and gear rules.'}
};
const reefSource='https://parks.qld.gov.au/parks/moreton-bay/zoning/trial_artificial_reef_program';
function fishingFeatureDetails(p,id){
 const row=(label,value)=>`<div class="attribute"><b>${label}</b>${esc(value)}</div>`;
 if(id==='reefs'){
  const r=reefGuide[p.reef_name];
  return '<h4>Fishing site information</h4>'+(r?row('Published depth',r.depth)+row('Seabed structure',r.structure)+row('Fishing approach / habitat',r.method)+row('Site restrictions',r.restriction):'<p>Detailed reef profile not available for this feature.</p>')+'<p>Published depths are descriptive, not charted clearances. The polygon marks the reef area, not individual fish structures. No live catch report or seabed survey is supplied.</p><p><a href="'+reefSource+'" target="_blank" rel="noopener">QPWS reef profile and activity notices</a> · checked 24 Oct 2026</p>';
 }
 if(id==='zones'){
 const t=p.zone_type||'';
 const rule=/National/.test(t)?'No fishing or collecting in this marine national park (green) zone. This applies to bait collection as well as taking fish.':/Conservation/.test(t)?'Limited fishing in this conservation park (yellow) zone. The Moreton Bay guidance allows two rods or lines per person, with two hooks or lures per line. Other gear and activity conditions still apply.':'Line fishing is generally provided for in this zone type, subject to fisheries rules and any overlapping designated areas or special activity notices. This is not clearance to fish at every point.';
 return '<h4>Fishing interpretation</h4>'+row('Zone',p.zone_id+' · '+p.zone_name)+row('Fishing & collecting',rule)+'<p>Check designated areas, species closures and current size/possession limits as well as this zone. The selected coordinate below is your click location, not a surveyed boundary point.</p><a href="https://parks.qld.gov.au/parks/moreton-bay/about" target="_blank" rel="noopener">QPWS fishing guidance · checked 24 Oct 2026</a>';
 }
 if(id==='fishhabitat'||id==='habitat')return '<h4>Fishing context</h4><p>Habitat mapping helps describe the environment; it does not identify a guaranteed fishing spot or establish fishing permission. Compare this layer with marine zoning and designated areas.</p>';
 return '';
}
async function setupFishing(){
 const panel=document.querySelector('#fishingPanel');
 panel.innerHTML=`<h3>Fishing information</h3><p>Explore reef structures, marine zones and coastal restrictions. Select a named area to zoom to its official geometry and read its details here.</p><div class="fish-tools"><button id="fishingLayers">Show fishing layers</button><button id="fishingExtent">Bay & offshore extent</button></div><details open><summary>Reefs & structures</summary><div id="fishingReefs">Loading official reef areas…</div></details><details><summary>Coastal & offshore zone details</summary><div id="fishingZones">Loading zones…</div></details><details><summary>Beach fishing & bait gathering</summary><p>Marine zones apply from the shore too. Mirapool is protected: fishing and collecting are prohibited. Freshwater fishing is prohibited on Moreton Island.</p><p>Beach gutters and sandbars move; this map does not represent current gutters or fish activity. Read the zone at your intended location and check tides, swell and beach access before setting out.</p><a href="https://parks.qld.gov.au/parks/gheebulum-kunungai-moreton-island/things-to-do" target="_blank" rel="noopener">QPWS island fishing guidance</a></details><details><summary>Read the fishing map</summary><p><strong>Green zones:</strong> no fishing or collecting.<br><strong>Yellow zones:</strong> limited fishing.<br><strong>Blue zones:</strong> other fisheries and designated-area rules still apply.</p><p>The 2008 habitat layer is historical. Reef depths are published descriptions, not a navigation chart. No fish abundance, current catch rate or live closure feed is implied.</p><p>Marine zoning, designated areas and reef coverage extends beyond the island to the northern and central bay. Habitat coverage remains the original island-area extract.</p></details><details><summary>Before keeping a catch</summary><p>Identify the species, then check minimum and maximum sizes, possession limits, closed seasons and gear rules. Those rules vary by species; a permitted marine zone does not override them.</p><a href="https://www.qld.gov.au/recreation/activities/boating-fishing/rec-fishing" target="_blank" rel="noopener">Current Queensland species rules</a></details><p class="fish-date">GIS snapshot and content review: 24 Oct 2026. Sources are attached to each feature.</p>`;
 const enable=async id=>{const c=document.querySelector('[data-layer="'+id+'"]');if(c&&!c.checked&&!c.disabled){c.checked=true;await c.onchange()}};
 document.querySelector('#fishingLayers').onclick=async()=>{for(const id of ['zones','designated','reefs'])await enable(id)};
 document.querySelector('#fishingExtent').onclick=()=>map.fitBounds([[-27.65,153],[-26.75,153.65]]);
 for(const [id,target,nameKey] of [['reefs','fishingReefs','reef_name'],['zones','fishingZones','zone_name']]){
  try{
   const response=await fetch('data/'+id+'.geojson',{cache:'no-cache'});if(!response.ok)throw Error();const data=await response.json();
   const features=data.features.sort((a,b)=>String(a.properties[nameKey]).localeCompare(String(b.properties[nameKey])));
   const el=document.getElementById(target);el.innerHTML=features.map((f,i)=>`<button class="fish-feature" data-fish-index="${i}"><strong>${esc(f.properties[nameKey])}</strong><small>${esc(id==='reefs'?'Artificial reef · structure & depth':f.properties.zone_id+' · '+f.properties.zone_type)}</small></button>`).join('');
   el.querySelectorAll('button').forEach(b=>b.onclick=async()=>{await enable(id);const f=features[Number(b.dataset.fishIndex)];map.fitBounds(L.geoJSON(f).getBounds(),{padding:[35,35],maxZoom:15});inspectFeature(f.properties,id);});
  }catch{document.getElementById(target).textContent='Information could not load. Reload to try again.'}
 }
}
