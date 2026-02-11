import { fetchArt } from './art-api.js';
import { fetchWeather } from './weather-api.js';
import { fetchFinance } from './finance-api.js';
import { Storage } from './storage.js';

// --- Initialization ---
async function init() {
    console.log("Initializing App...");

    // 1. Load Art (SIMPLIFIED: No Pre-loader to avoid Security Errors)
    const art = await fetchArt();
    
    // Set the background directly
    document.getElementById('app-background').style.backgroundImage = `url('${art.image}')`;
    
    // Hide the spinner immediately (since we aren't waiting anymore)
    const loader = document.getElementById('bg-loader');
    if (loader) loader.classList.add('hidden');

    // Update Text
    document.getElementById('art-title').innerText = art.title;
    document.getElementById('art-artist').innerText = art.artist;
    
    generatePalette();

    // 2. Load Weather
    const weather = await fetchWeather();
    document.getElementById('temp').innerText = `${weather.temp}°C`;
    document.getElementById('condition').innerText = weather.condition;

    // 3. Load Finance
    const finance = await fetchFinance();
    if(finance) {
        document.getElementById('btc').innerText = `BTC: $${finance.btc}`;
        document.getElementById('eth').innerText = `ETH: $${finance.eth}`;
    }

    // 4. Load Saved Focus
    const savedFocus = Storage.get('daily-focus');
    if(savedFocus) showFocus(savedFocus);

    // 5. Start Clock
    setInterval(updateClock, 1000);
    updateClock();
}

// --- Features ---

function updateClock() {
    const now = new Date();
    document.getElementById('clock').innerText = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    const hour = now.getHours();
    let greeting = "Good Evening";
    if (hour < 12) greeting = "Good Morning";
    else if (hour < 18) greeting = "Good Afternoon";
    document.getElementById('greeting').innerText = greeting;
}

const input = document.getElementById('focus-input');
const display = document.getElementById('focus-display');
const focusText = document.getElementById('focus-text');
const deleteBtn = document.getElementById('focus-delete');

input.addEventListener('keypress', (e) => {
    if(e.key === 'Enter') {
        const task = e.target.value;
        Storage.save('daily-focus', task);
        showFocus(task);
    }
});

deleteBtn.addEventListener('click', () => {
    Storage.remove('daily-focus');
    display.classList.add('hidden');
    input.classList.remove('hidden');
    input.value = "";
});

function showFocus(task) {
    focusText.innerText = task;
    input.classList.add('hidden');
    display.classList.remove('hidden');
}

function generatePalette() {
    const container = document.getElementById('color-palette');
    container.innerHTML = ''; // Clear previous colors
    const colors = ['#E63946', '#F1FAEE', '#A8DADC', '#457B9D', '#1D3557'];
    
    colors.forEach(color => {
        const circle = document.createElement('div');
        circle.className = 'color-circle';
        circle.style.backgroundColor = color;
        circle.addEventListener('click', () => {
            navigator.clipboard.writeText(color);
            alert(`Color ${color} Copied!`);
        });
        container.appendChild(circle);
    });
}

// Run App
init();