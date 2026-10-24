/* Display CRS: WGS 84 / UTM zone 56S, EPSG:32756. */
(function(root){
 const projection='+proj=utm +zone=56 +south +datum=WGS84 +units=m +no_defs';
 function toUTM(lat,lng){const [easting,northing]=proj4('EPSG:4326',projection,[lng,lat]);return {easting,northing};}
 function formatUTM(lat,lng){const p=toUTM(lat,lng);return 'UTM 56S · E '+Math.round(p.easting)+' m · N '+Math.round(p.northing)+' m · WGS84';}
 root.toUTM=toUTM;root.formatUTM=formatUTM;
})(globalThis);
