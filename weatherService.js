var WeatherService = (function () {
  var CACHE_MS = 5 * 60 * 1000; // 5 minutes
  var cache = null;

  // wind_from_direction: degrees the wind is coming FROM.
  // Arrow points in the direction the wind is blowing TO (opposite).
  var COMPASS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  var ARROWS  = ['↓', '↙',  '←', '↖',  '↑', '↗',  '→', '↘' ];

  function degreesToIndex(deg) {
    return Math.round(deg / 45) % 8;
  }

  function fetchWeather(lat, lon, callback) {
    var now = Date.now();
    if (
      cache &&
      Math.abs(cache.lat - lat) < 0.001 &&
      Math.abs(cache.lon - lon) < 0.001 &&
      now - cache.timestamp < CACHE_MS
    ) {
      callback(null, cache.data);
      return;
    }

    var url =
      'https://api.met.no/weatherapi/locationforecast/2.0/compact' +
      '?lat=' + lat.toFixed(4) +
      '&lon=' + lon.toFixed(4);

    // Note: browsers enforce User-Agent as a forbidden header and will
    // silently ignore attempts to set it. The browser's own User-Agent
    // is sent instead, which satisfies Met.no's identification requirement.
    window.fetch(url, {
      headers: { 'User-Agent': 'HuntingMap/1.0 andreaszahl@gmail.com' }
    })
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(function (json) {
        var ts = json.properties.timeseries[0];
        var instant = ts.data.instant.details;
        var next = ts.data.next_1_hours || ts.data.next_6_hours || {};
        var details = next.details || {};
        var summary = next.summary || {};

        var idx = degreesToIndex(instant.wind_from_direction);
        var data = {
          temperature:   instant.air_temperature,
          windSpeed:     instant.wind_speed,
          windCompass:   COMPASS[idx],
          windArrow:     ARROWS[idx],
          precipitation: details.precipitation_amount != null ? details.precipitation_amount : 0,
          symbolCode:    summary.symbol_code || 'cloudy'
        };

        cache = { lat: lat, lon: lon, timestamp: now, data: data };
        callback(null, data);
      })
      .catch(function (err) {
        callback(err, null);
      });
  }

  return { fetch: fetchWeather };
})();
