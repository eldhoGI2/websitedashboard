import { CONFIG } from './config.js';

export async function fetchWeather() {
    try {
        const res = await fetch(CONFIG.WEATHER_API_URL);
        const data = await res.json();
        const temp = data.current_weather.temperature;
        
        // Simple code to text map
        const code = data.current_weather.weathercode;
        let condition = "Clear";
        if (code > 3) condition = "Cloudy";
        if (code > 50) condition = "Rainy";

        return { temp, condition };
    } catch (err) {
        return { temp: "--", condition: "Unavailable" };
    }
}