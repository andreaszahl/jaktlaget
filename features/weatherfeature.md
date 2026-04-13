# Feature: Weather Forecast from Met.no

## Overview
Integrate a live weather forecast panel into the hunting map using the **Met.no Locationforecast 2.0 API**. The forecast should reflect the map's current center coordinates, giving hunters relevant weather conditions for their planned hunt location.

## API Details
- **Endpoint:** `https://api.met.no/weatherapi/locationforecast/2.0/compact`
- **Method:** GET
- **Parameters:** `lat` (latitude), `lon` (longitude), `altitude` (optional, meters)
- **Authentication:** None required — free and open
- **Required header:** `User-Agent` must be set to identify the application, e.g. `HuntingMap/1.0 contact@example.com`
- **Response format:** JSON

## Implementation Tasks

### 1. Weather Service Module
- Create a `weatherService.js` module responsible for fetching forecast data
- Fetch from Locationforecast using the map's current center coordinates (`map.getCenter()`)
- Parse the first time series entry from `properties.timeseries` for the current hour
- Extract the following fields:
  - `instant.details.air_temperature` — temperature in °C
  - `instant.details.wind_speed` — wind speed in m/s
  - `instant.details.wind_from_direction` — wind direction in degrees
  - `next_1_hours.details.precipitation_amount` — precipitation in mm
  - `next_1_hours.summary.symbol_code` — weather symbol (e.g. `clearsky_day`, `rain`)

### 2. Weather Panel UI
- Add a small **weather panel** overlay on the map (bottom-left or top-right corner)
- Display the following in a clean, readable format:
  - Temperature (°C)
  - Wind speed (m/s) and direction (as a compass arrow or cardinal direction, e.g. NW)
  - Precipitation next hour (mm)
  - Weather symbol icon (use Met.no's hosted weather icons from `https://api.met.no/images/weathericons/`)
- Panel should update automatically when the map is moved or panned (on `moveend` event)

### 3. Wind Direction Indicator
- Convert `wind_from_direction` degrees to a compass arrow (↑↗→↘↓↙←↖) or cardinal label (N, NE, E, etc.)
- Display prominently since wind direction is critical for driven hunt planning

### 4. Error Handling
- Show a fallback message in the panel if the API call fails (e.g. network offline)
- Respect Met.no's rate limiting — cache the last response and avoid refetching more often than once every 5 minutes for the same coordinates

## Acceptance Criteria
- [ ] Weather panel is visible on map load
- [ ] Forecast reflects the current map center coordinates
- [ ] Wind speed and direction are clearly displayed
- [ ] Panel updates on map pan/move (with 5-minute cache)
- [ ] Graceful error state if API is unreachable
- [ ] User-Agent header is correctly set on all requests

## Notes
- Locationforecast does not require an API key but **does require a valid User-Agent** — requests without one may be blocked
- Data is updated approximately every hour by Met.no
- For altitude-accurate forecasts in mountainous terrain, pass the `altitude` parameter using an elevation API or a hardcoded value
