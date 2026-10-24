# Moreton Explorer

An interactive GIS and visitor guide to Moreton Island, Queensland.

## Run locally

Requires Python 3. No build or package installation is needed.

```sh
python3 -m http.server 8765 --bind 127.0.0.1
```

Open http://127.0.0.1:8765/dist/ in a browser. Internet access is required for basemaps and external services.

## Features

- Topographic, satellite, grey and OpenStreetMap basemaps
- UTM zone 56S coordinate display and distance measurement
- Camping, heritage, WWII, fishing and visitor information
- Queensland GIS layers, marine zoning, reef profiles and terrain overlays
- Documented Tangalooma Wrecks current hazard and official alert viewers
- Trip notes and saved places stored locally in the browser

## Files

`dist/` is the deployable static site. `dist/data/sources.json` records GIS sources, extraction dates and coverage. `.openai/hosting.json` identifies the existing Sites deployment.

## Data limitations and attribution

This is a planning guide, not a navigation chart or a live safety service. GIS extracts and visitor information have differing dates. Current strength at the wrecks is not measured by this app. Unverified place positions are withheld; reference pins are not surveyed boundaries or access permissions.

Spatial data includes © State of Queensland and OpenStreetMap contributors. Basemap attribution is shown on the map. Leaflet and Proj4js are vendored with their source notices; upstream licences apply. Dataset and third-party licensing must be checked at the linked sources before reuse. No additional licence is granted by this repository.
