import { fetchArt } from './art-api.js';
import { fetchWeather } from './weather-api.js';
import { fetchFinance } from './finance-api.js';
import { askGemini } from './ai-api.js';

// --- STATE MANAGEMENT ---
let focusInterval;
let timeLeft = 25 * 60; // 25 minutes
let activityData = JSON.parse(localStorage.getItem('heatmap-data')) || Array(10).fill(false);

async function init() {
    console.log("Booting OS...");

    // 1. Load Art & Chameleon Colors
    try {
        const art = await fetchArt();
        document.getElementById('art-title').innerText = art.title;
        document.getElementById('art-artist').innerText = art.artist;
        
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = art.image;
        
        img.onload = () => {
            document.getElementById('app-background').style.backgroundImage = `url('${art.image}')`;
            try {
                const colorThief = new ColorThief();
                const domColor = colorThief.getColor(img);
                document.documentElement.style.setProperty('--chameleon-color', `rgb(${domColor[0]}, ${domColor[1]}, ${domColor[2]})`);
            } catch (err) {
                console.warn("ColorThief calculation bypassed.");
            }
        };
    } catch (e) {
        console.error("Art Error:", e);
    }

    // 2. Load Data Widgets
    const weather = await fetchWeather();
    document.getElementById('temp').innerText = `${weather.temp}°C`;
    document.getElementById('condition').innerText = weather.condition;

    const finance = await fetchFinance();
    if(finance) {
        document.getElementById('btc').innerText = `BTC: $${finance.btc}`;
        document.getElementById('eth').innerText = `ETH: $${finance.eth}`;
    }

    // 3. Initialize All Sub-Systems
    setInterval(updateClock, 1000);
    updateClock();
    setupFocusMode();
    renderHeatmap();
    setupSidebar();
    makeDraggable();
    setupDataExport();
    setupQuickLinks();
    setupWidgetManager();
}

// --- CLOCK & AI LAUNCHER ---
function updateClock() {
    const now = new Date();
    document.getElementById('clock').innerText = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// --- SMART COMMAND ROUTER ---
document.getElementById('focus-input').addEventListener('keypress', async (e) => {
    if(e.key === 'Enter' && e.target.value) {
        const query = e.target.value.trim();
        
        // ROUTE 1: AI Assistant
        if(query.startsWith('/ai')) {
            const question = query.replace('/ai', '').trim();
            const modal = document.getElementById('ai-modal');
            const content = document.getElementById('ai-content');
            
            modal.classList.remove('hidden');
            content.innerHTML = "<em>Analyzing...</em>";
            e.target.value = ""; 
            
            const answer = await askGemini(question);
            content.innerHTML = answer.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            
        // ROUTE 2: Task & Heatmap (e.g., "/task Read Chapter 4")
        } else if (query.startsWith('/task') || query.startsWith('/t ')) {
            const task = query.replace(/^\/task|^\/t/, '').trim();
            
            // Mark heatmap active
            activityData[activityData.length - 1] = true;
            localStorage.setItem('heatmap-data', JSON.stringify(activityData));
            renderHeatmap();
            
            // Show task on screen
            document.getElementById('focus-text').innerText = task;
            e.target.classList.add('hidden');
            document.getElementById('focus-display').classList.remove('hidden');
            
        // ROUTE 3: Standard Web Search & Shortcuts
        } else {
            // Quick URL Shortcuts
            if (query.toLowerCase() === 'youtube') {
                window.location.href = 'https://youtube.com';
            } else if (query.toLowerCase() === 'github') {
                window.location.href = 'https://github.com';
            } else {
                // Default Google Search
                window.location.href = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
            }
        }
    }
});

document.getElementById('focus-delete').addEventListener('click', () => {
    document.getElementById('focus-display').classList.add('hidden');
    document.getElementById('focus-input').classList.remove('hidden');
    document.getElementById('focus-input').value = "";
});

document.getElementById('close-modal').addEventListener('click', () => {
    document.getElementById('ai-modal').classList.add('hidden');
});

// --- FOCUS MODE (POMODORO) ---
function setupFocusMode() {
    const btn = document.getElementById('start-focus-btn');
    const timerDisplay = document.getElementById('focus-timer');
    const clock = document.getElementById('clock');

    btn.addEventListener('click', () => {
        if (btn.innerText === "Start Deep Focus") {
            btn.innerText = "Stop Focus";
            clock.classList.add('hidden');
            timerDisplay.classList.remove('hidden');
            
            focusInterval = setInterval(() => {
                timeLeft--;
                const minutes = Math.floor(timeLeft / 60);
                const seconds = timeLeft % 60;
                timerDisplay.innerText = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
                if(timeLeft <= 0) clearInterval(focusInterval);
            }, 1000);
        } else {
            clearInterval(focusInterval);
            btn.innerText = "Start Deep Focus";
            clock.classList.remove('hidden');
            timerDisplay.classList.add('hidden');
            timeLeft = 25 * 60; 
        }
    });
}

// --- HEATMAP ---
function renderHeatmap() {
    const grid = document.getElementById('heatmap-grid');
    grid.innerHTML = ''; 
    activityData.forEach(isActive => {
        const square = document.createElement('div');
        square.className = `heatmap-square ${isActive ? 'active' : ''}`;
        grid.appendChild(square);
    });
}

// --- SIDEBAR & SCRATCHPAD ---
function setupSidebar() {
    const sidebar = document.getElementById('command-sidebar');
    const toggleBtn = document.getElementById('toggle-sidebar');
    const scratchpad = document.getElementById('scratchpad');

    toggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
    });

    scratchpad.value = localStorage.getItem('os-notes') || '';
    scratchpad.addEventListener('input', (e) => {
        localStorage.setItem('os-notes', e.target.value);
    });
}

// --- DATA EXPORT ---
function setupDataExport() {
    document.getElementById('export-btn').addEventListener('click', () => {
        const systemData = {
            notes: localStorage.getItem('os-notes'),
            heatmap: localStorage.getItem('heatmap-data'),
            layout: localStorage.getItem('widget-positions'),
            links: localStorage.getItem('user-links')
        };
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(systemData, null, 2));
        const a = document.createElement('a');
        a.href = dataStr;
        a.download = "daily_canvas_backup.json";
        document.body.appendChild(a);
        a.click();
        a.remove();
    });
}

// --- QUICK LINKS ---
function setupQuickLinks() {
    const container = document.getElementById('custom-links-container');
    const nameInput = document.getElementById('link-name');
    const urlInput = document.getElementById('link-url');
    let links = JSON.parse(localStorage.getItem('user-links')) || [
        { name: "GitHub", url: "https://github.com" },
        { name: "ChatGPT", url: "https://chatgpt.com" }
    ];

    function renderLinks() {
        container.innerHTML = '';
        links.forEach((link, index) => {
            const div = document.createElement('div');
            div.className = 'link-item';
            div.innerHTML = `<a href="${link.url}" target="_blank">🔗 ${link.name}</a><button class="delete-link" data-index="${index}">×</button>`;
            container.appendChild(div);
        });
        document.querySelectorAll('.delete-link').forEach(btn => {
            btn.addEventListener('click', (e) => {
                links.splice(e.target.getAttribute('data-index'), 1);
                localStorage.setItem('user-links', JSON.stringify(links));
                renderLinks();
            });
        });
    }

    document.getElementById('add-link-btn').addEventListener('click', () => {
        let url = urlInput.value;
        if(nameInput.value && url) {
            if (!url.startsWith('http')) url = 'https://' + url;
            links.push({ name: nameInput.value, url });
            localStorage.setItem('user-links', JSON.stringify(links));
            nameInput.value = ''; urlInput.value = '';
            renderLinks();
        }
    });
    renderLinks();
}

// --- WIDGET APP STORE ---
function setupWidgetManager() {
    const checkboxes = document.querySelectorAll('.widget-toggle');
    let activeWidgets = JSON.parse(localStorage.getItem('active-widgets')) || ['weather-widget', 'finance-widget'];

    function updateWidgets() {
        document.querySelectorAll('.draggable').forEach(el => el.classList.add('hidden'));
        activeWidgets.forEach(id => {
            const widget = document.getElementById(id);
            if(widget) widget.classList.remove('hidden');
        });

        let checkedCount = 0;
        checkboxes.forEach(box => {
            box.checked = activeWidgets.includes(box.value);
            if(box.checked) checkedCount++;
        });

        checkboxes.forEach(box => {
            if(!box.checked) {
                box.disabled = (checkedCount >= 2);
                box.parentElement.style.opacity = box.disabled ? "0.5" : "1";
            } else {
                box.disabled = false;
                box.parentElement.style.opacity = "1";
            }
        });
    }

    checkboxes.forEach(box => {
        box.addEventListener('change', (e) => {
            if(e.target.checked) activeWidgets.push(e.target.value);
            else activeWidgets = activeWidgets.filter(id => id !== e.target.value);
            localStorage.setItem('active-widgets', JSON.stringify(activeWidgets));
            updateWidgets();
        });
    });
    updateWidgets();
}

// --- DRAG PHYSICS ---
function makeDraggable() {
    document.querySelectorAll('.draggable').forEach(elmnt => {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        elmnt.onmousedown = (e) => {
            e.preventDefault();
            pos3 = e.clientX; pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
            elmnt.style.zIndex = 1000; 
        };
        function elementDrag(e) {
            e.preventDefault();
            pos1 = pos3 - e.clientX; pos2 = pos4 - e.clientY;
            pos3 = e.clientX; pos4 = e.clientY;
            elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
            elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
        }
        function closeDragElement() {
            document.onmouseup = null; document.onmousemove = null; elmnt.style.zIndex = 50;
            const positions = JSON.parse(localStorage.getItem('widget-positions')) || {};
            positions[elmnt.id] = { top: elmnt.style.top, left: elmnt.style.left };
            localStorage.setItem('widget-positions', JSON.stringify(positions));
        }
        const savedPos = JSON.parse(localStorage.getItem('widget-positions'));
        if (savedPos && savedPos[elmnt.id]) {
            elmnt.style.top = savedPos[elmnt.id].top;
            elmnt.style.left = savedPos[elmnt.id].left;
        }
    });
}

// Boot System
init();