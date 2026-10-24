function setupTerrain(){
 const overlays={},busy={};
 const base='https://spatial-gis.information.qld.gov.au/arcgis/rest/services/Elevation/Contours/MapServer';
 function update(kind){
  const control=document.getElementById(kind);if(!control.checked){if(overlays[kind])map.removeLayer(overlays[kind]);delete overlays[kind];return}
  const b=map.getBounds(),bounds=[[b.getSouth(),b.getWest()],[b.getNorth(),b.getEast()]],size=map.getSize();
  const args=new URLSearchParams({f:'image',bbox:[b.getWest(),b.getSouth(),b.getEast(),b.getNorth()].join(','),bboxSR:'4326',imageSR:'3857',size:Math.min(1800,Math.round(size.x))+','+Math.min(1800,Math.round(size.y)),format:'png32',transparent:'true'});
  let url;if(kind==='hillshade'){args.set('renderingRule',JSON.stringify({rasterFunction:'Hillshade'}));url='https://spatial-img.information.qld.gov.au/arcgis/rest/services/Elevation/DEM_TimeSeries_AllUsers/ImageServer/exportImage?'+args}else{const z=map.getZoom(),id=z>=17?30:z>=16?20:10;args.set('layers','show:'+id);args.set('dpi','96');url=base+'/export?'+args;document.getElementById('terrainStatus').textContent=(id===10?'10 m SRTM contours':id===20?'5 m LiDAR contours':'1 m LiDAR contours')+' · source scale limits and coverage apply. Zoom in for finer detail.'}
  const token={};busy[kind]=token;const image=L.imageOverlay(url,bounds,{opacity:kind==='hillshade'?.65:1,interactive:false});image.on('load',()=>{if(busy[kind]!==token||!control.checked){map.removeLayer(image);return}if(overlays[kind])map.removeLayer(overlays[kind]);overlays[kind]=image;if(overlays.contours)overlays.contours.bringToFront();if(selected.has('roads'))selected.get('roads').bringToFront()});image.on('error',()=>{map.removeLayer(image);document.getElementById('terrainStatus').textContent='Terrain image unavailable. Retry or inspect the source service; blank coverage is not zero elevation.'});image.addTo(map);
 }
 ['hillshade','contours'].forEach(k=>document.getElementById(k).onchange=()=>update(k));map.on('moveend',()=>['hillshade','contours'].forEach(k=>{if(document.getElementById(k).checked)update(k)}));
}
