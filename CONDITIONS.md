# Wrecks conditions screen

Inputs are official MSQ/BOM 2026 Tangalooma Jetty ten-minute tide-height predictions (LAT), Open-Meteo hourly wind forecasts, and Open-Meteo regional wave/current forecasts. The latter are approximately 5 km (waves) and 8 km (currents), not a reconstruction of flow through the wrecks. Map markers use the station or returned model grid coordinates.

The rules are transparent, conservative screening choices made for this application, **not validated hazard thresholds or swimming limits**: wind >=15 kn, gust >=20 kn, wave height >=1 m, regional current >=1 kn, absolute tide-height change >=0.30 m/hour, or thunderstorm weather codes 95/96/99. Any triggers produce “Elevated indicators”. No triggers never produces a “safe” label. Any missing required numeric input produces “Incomplete assessment”. Tide-height change is not converted to current velocity or slack-water timing.

Time selection uses AEST (UTC+10), hourly forecast records within 30 minutes, and a centred one-hour tide-height difference. Forecast retrieval older than six hours is rejected. The bundled fallback expires on the same basis; it is not perpetually live. Tide predictions are valid only within the supplied 2026 series. Forecasts refresh when the layer initializes or Refresh data is pressed; retrieval is not model issue time. Official alerts and local observations are not automatically incorporated in the score.

Run `node tests/conditions.cjs` for missingness, threshold, date-boundary, freshness and time-alignment checks.

Sources:
- https://www.data.qld.gov.au/dataset/tangalooma-tide-gauge-predicted-interval-data
- https://open-meteo.com/en/docs
- https://open-meteo.com/en/docs/marine-weather-api
- https://www.tangalooma.com/resort-info/general-resort-information/swim-safety

Source data are attributed to their respective providers under CC BY 4.0. API service terms also apply.
