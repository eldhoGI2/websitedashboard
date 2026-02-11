export const CONFIG = {
    // Art Institute of Chicago API
    ART_API_URL: "https://api.artic.edu/api/v1/artworks/search?q=impressionism&fields=id,title,artist_display,image_id,date_display&limit=50",
    
    // Open-Meteo (No Key Required!)
    WEATHER_API_URL: "https://api.open-meteo.com/v1/forecast?latitude=12.91&longitude=79.13&current_weather=true", // Coordinates for Vellore (or change to yours)
    
    // CoinGecko
    CRYPTO_API_URL: "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd"
};