export class WeatherApi {
  constructor({ baseUrl }) {
    this._baseUrl = baseUrl;
  }

  _check(res) {
    if (res.ok) return res.json();
    return Promise.reject(`Weather API Error: ${res.status}`);
  }

  getCurrentWeather({ lat, lon }) {
    const url =
      `${this._baseUrl}?latitude=${lat}&longitude=${lon}` +
      `&current=temperature_2m,relative_humidity_2m,wind_speed_10m` +
      `&timezone=auto`;

    return fetch(url).then(this._check);
  }
}

export const weatherApi = new WeatherApi({
  baseUrl: "https://api.open-meteo.com/v1/forecast",
});
