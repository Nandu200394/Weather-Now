
const GEOCODING = "https://geocoding-api.open-meteo.com/v1/search";
const FORECAST = "https://api.open-meteo.com/v1/forecast";

export async function geocodeCity(name) {
  const url = `${GEOCODING}?name=${encodeURIComponent(name)}&count=1&language=en`;
  const r = await fetch(url);
  if (!r.ok) throw new Error("Geocoding failed");
  const j = await r.json();
  if (!j.results || j.results.length === 0) {
    const err = new Error("City not found");
    err.code = "NO_CITY";
    throw err;
  }
  const p = j.results[0];
  return {
    name: p.name,
    country: p.country,
    latitude: p.latitude,
    longitude: p.longitude,
    timezone: p.timezone
  };
}

export async function fetchWeatherByCoords({ latitude, longitude, name, country, timezone }, unit = "c") {
  const tempUnit = unit === "f" ? "fahrenheit" : "celsius";

  const params = new URLSearchParams({
    latitude,
    longitude,
    timezone: timezone || "auto",
    current_weather: "true",
    temperature_unit: tempUnit,
    hourly: "temperature_2m,relativehumidity_2m,apparent_temperature,winddirection,windspeed,dewpoint_2m,surface_pressure",
    daily: "temperature_2m_max,temperature_2m_min,apparent_temperature_max,sunrise,sunset,weathercode,uv_index_max",
  });

  const url = `${FORECAST}?${params.toString()}`;
  const r = await fetch(url);
  if (!r.ok) throw new Error("Weather fetch failed");
  const j = await r.json();

  return {
    place: { name: name, country: country },
    timezone: j.timezone,
    _coords: { latitude, longitude },
    current: {
      temperature: j.current_weather?.temperature ?? null,
      windspeed: j.current_weather?.windspeed ?? null,
      winddirection: j.current_weather?.winddirection ?? null,
      weathercode: j.current_weather?.weathercode ?? null,
      time: j.current_weather?.time ?? null,
    },
    hourly: {
      time: j.hourly?.time ?? [],
      temperature_2m: j.hourly?.temperature_2m ?? [],
      relativehumidity_2m: j.hourly?.relativehumidity_2m ?? [],
      apparent_temperature: j.hourly?.apparent_temperature ?? [],
      windspeed: j.hourly?.windspeed ?? [],
      winddirection: j.hourly?.winddirection ?? [],
      dewpoint_2m: j.hourly?.dewpoint_2m ?? [],
      surface_pressure: j.hourly?.surface_pressure ?? []
    },
    daily: {
      time: j.daily?.time ?? [],
      temperature_2m_max: j.daily?.temperature_2m_max ?? [],
      temperature_2m_min: j.daily?.temperature_2m_min ?? [],
      apparent_temperature_max: j.daily?.apparent_temperature_max ?? [],
      sunrise: j.daily?.sunrise ?? [],
      sunset: j.daily?.sunset ?? [],
      weathercode: j.daily?.weathercode ?? [],
      uv_index_max: j.daily?.uv_index_max ?? []
    }
  };
}

export async function fetchWeatherByCityName(city, unit = "c") {
  const place = await geocodeCity(city);
  return fetchWeatherByCoords(place, unit);
}

