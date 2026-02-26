export class NasaApi {
  constructor({ baseUrl, apiKey }) {
    this._baseUrl = baseUrl;
    this._apiKey = apiKey;
  }

  _check(res) {
    if (res.ok) return res.json();
    return Promise.reject(`NASA API Error: ${res.status}`);
  }

  getApod() {
    const url = `${this._baseUrl}?api_key=${this._apiKey}`;
    return fetch(url).then((res) => this._check(res));
  }
}

export const nasaApi = new NasaApi({
  baseUrl: "https://api.nasa.gov/planetary/apod",
  apiKey: "Zr9gZRzFDRbX4MwTaaWEDtXMKPfgzk6nDe2Mfyo2",
});
