import { fetchArt } from './art-api.js';
import { fetchWeather } from './weather-api.js';
import { fetchFinance } from './finance-api.js';
import { askGemini } from './ai-api.js';

let focusInterval;
let timeLeft = 25 * 60; 
let activityData = JSON.parse(localStorage.getItem('heatmap-data')) || Array(10).fill(false);
let taskList = JSON.parse(localStorage.getItem('sticky-tasks')) || [];
let customBgs = JSON.parse(localStorage.getItem('custom-bgs')) || [];
let flashcards = JSON.parse(localStorage.getItem('flashcards')) || [
    { q: "What is Polymorphism?", a: "Ability of different objects to respond to the same method call." }
];
let currentCardIndex = 0;

const rgbToHex = (r, g, b) => '#' + [r, g, b].map(x => { const hex = x.toString(16); return hex.length === 1 ? '0' + hex : hex; }).join('');

async function init() {
    console.log("Booting OS...");

    // 1. Load Backgrounds (Custom or Art)
    try {
        let imageUrl, title, artist;

        if (customBgs.length > 0) {
            imageUrl = customBgs[Math.floor(Math.random() * customBgs.length)];
            title = "Custom Workspace";
            artist = "Uploaded by User";
        } else {
            const art = await fetchArt();
            imageUrl = art.image;
            title = art.title;
            artist = art.artist;
        }

        document.getElementById('art-title').innerText = title;
        document.getElementById('art-artist').innerText = artist;
        
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = imageUrl;
        
        img.onload = () => {
            document.getElementById('app-background').style.backgroundImage = `url('${imageUrl}')`;
            try {
                const colorThief = new ColorThief();
                const domColor = colorThief.getColor(img);
                document.documentElement.style.setProperty('--chameleon-color', `rgb(${domColor[0]}, ${domColor[1]}, ${domColor[2]})`);
                
                const palette = colorThief.getPalette(img, 5);
                const tracker = document.getElementById('color-tracker');
                tracker.innerHTML = '';
                palette.forEach(color => {
                    const hex = rgbToHex(color[0], color[1], color[2]);
                    const swatch = document.createElement('div');
                    swatch.className = 'color-swatch';
                    swatch.style.backgroundColor = hex;
                    swatch.setAttribute('data-hex', hex.toUpperCase());
                    tracker.appendChild(swatch);
                });
            } catch (err) { console.warn("ColorThief bypassed for custom image."); }
        };
    } catch (e) { console.error("Image Error:", e); }

    const weather = await fetchWeather();
    document.getElementById('temp').innerText = `${weather.temp}°C`;
    document.getElementById('condition').innerText = weather.condition;
    const finance = await fetchFinance();
    if(finance) {
        document.getElementById('btc').innerText = `BTC: $${finance.btc}`;
        document.getElementById('eth').innerText = `ETH: $${finance.eth}`;
    }

    setInterval(updateClock, 1000);
    updateClock();
    setupFocusMode();
    renderHeatmap();
    setupSidebar();
    makeDraggable();
    setupDataExport();
    setupQuickLinks();
    setupWidgetManager();
    renderTasks();
    setupFlashcards();
    setupZenMode();
    setupFloatingNotes();
    setupBackgroundManager(); // RESTORED
}

function updateClock() {
    const now = new Date();
    document.getElementById('clock').innerText = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

document.getElementById('focus-input').addEventListener('keypress', async (e) => {
    if(e.key === 'Enter' && e.target.value) {
        const query = e.target.value.trim();
        if(query.startsWith('/ai')) {
            const question = query.replace('/ai', '').trim();
            const modal = document.getElementById('ai-modal');
            const content = document.getElementById('ai-content');
            modal.classList.remove('hidden');
            content.innerHTML = "<em>Analyzing...</em>";
            e.target.value = ""; 
            const answer = await askGemini(question);
            content.innerHTML = answer.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        } else if (query.startsWith('/t ') || query.startsWith('/task')) {
            const task = query.replace(/^\/t|^\/task/, '').trim();
            activityData[activityData.length - 1] = true;
            localStorage.setItem('heatmap-data', JSON.stringify(activityData));
            renderHeatmap();
            taskList.push(task);
            localStorage.setItem('sticky-tasks', JSON.stringify(taskList));
            renderTasks();
            document.getElementById('sticky-note').classList.remove('hidden');
            e.target.value = "";
        } else {
            if (query.toLowerCase() === 'youtube') window.location.href = 'https://youtube.com';
            else if (query.toLowerCase() === 'github') window.location.href = 'https://github.com';
            else window.location.href = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
        }
    }
});

document.getElementById('close-modal').addEventListener('click', () => { document.getElementById('ai-modal').classList.add('hidden'); });

function setupFocusMode() {
    const btn = document.getElementById('start-focus-btn');
    const timerDisplay = document.getElementById('focus-timer');
    const clock = document.getElementById('clock');
    btn.addEventListener('click', () => {
        if (btn.innerText === "Start Deep Focus") {
            btn.innerText = "Stop Focus"; clock.classList.add('hidden'); timerDisplay.classList.remove('hidden');
            focusInterval = setInterval(() => {
                timeLeft--;
                const minutes = Math.floor(timeLeft / 60); const seconds = timeLeft % 60;
                timerDisplay.innerText = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
                if(timeLeft <= 0) clearInterval(focusInterval);
            }, 1000);
        } else {
            clearInterval(focusInterval); btn.innerText = "Start Deep Focus"; clock.classList.remove('hidden'); timerDisplay.classList.add('hidden'); timeLeft = 25 * 60; 
        }
    });
}

function renderHeatmap() {
    const grid = document.getElementById('heatmap-grid'); grid.innerHTML = ''; 
    activityData.forEach(isActive => {
        const square = document.createElement('div'); square.className = `heatmap-square ${isActive ? 'active' : ''}`; grid.appendChild(square);
    });
}

function setupZenMode() {
    const zenBtn = document.getElementById('zen-mode-btn');
    const toggleZen = () => document.body.classList.toggle('zen-mode');
    zenBtn.addEventListener('click', toggleZen);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') toggleZen(); });
}

// RESTORED: Background Manager
function setupBackgroundManager() {
    document.getElementById('add-bg-btn').addEventListener('click', () => {
        const url = document.getElementById('bg-url-input').value;
        if (url) {
            customBgs.push(url);
            localStorage.setItem('custom-bgs', JSON.stringify(customBgs));
            alert("Image added! Refresh the page to see it.");
            document.getElementById('bg-url-input').value = "";
        }
    });

    document.getElementById('clear-bg-btn').addEventListener('click', () => {
        customBgs = [];
        localStorage.removeItem('custom-bgs');
        alert("Custom backgrounds cleared. Returning to art museum on next refresh.");
    });
}

function setupFlashcards() {
    const widget = document.getElementById('flashcard-widget');
    const qDisplay = document.getElementById('fc-q-display'); const aDisplay = document.getElementById('fc-a-display');
    const nextBtn = document.getElementById('fc-next-btn'); const inner = document.getElementById('fc-inner');

    const updateCard = () => {
        if (flashcards.length === 0) {
            qDisplay.innerText = "No cards available.";
            aDisplay.innerText = "Add cards in the sidebar!";
            return;
        }
        qDisplay.innerText = flashcards[currentCardIndex].q; aDisplay.innerText = flashcards[currentCardIndex].a;
    };
    
    inner.addEventListener('click', (e) => { if (e.target.id !== 'fc-next-btn') widget.classList.toggle('is-flipped'); });
    nextBtn.addEventListener('click', (e) => {
        e.stopPropagation(); widget.classList.remove('is-flipped');
        setTimeout(() => { currentCardIndex = (currentCardIndex + 1) % flashcards.length; updateCard(); }, 300); 
    });
    
    document.getElementById('add-fc-btn').addEventListener('click', () => {
        const q = document.getElementById('fc-new-q').value; const a = document.getElementById('fc-new-a').value;
        if(q && a) {
            flashcards.push({q, a}); localStorage.setItem('flashcards', JSON.stringify(flashcards));
            document.getElementById('fc-new-q').value = ''; document.getElementById('fc-new-a').value = '';
            updateCard(); alert("Flashcard Saved!");
        }
    });

    // NEW: Clear All Flashcards Logic
    document.getElementById('clear-fc-btn').addEventListener('click', () => {
        if(confirm("Are you sure you want to delete all flashcards?")) {
            flashcards = [];
            localStorage.removeItem('flashcards');
            currentCardIndex = 0;
            updateCard();
            widget.classList.remove('is-flipped');
        }
    });

    updateCard();
}

function setupSidebar() {
    const sidebar = document.getElementById('command-sidebar');
    document.getElementById('toggle-sidebar').addEventListener('click', () => sidebar.classList.toggle('collapsed'));
}

function renderTasks() {
    const list = document.getElementById('task-list'); list.innerHTML = '';
    taskList.forEach((task, index) => {
        const li = document.createElement('li'); li.innerText = task;
        li.addEventListener('click', () => { taskList.splice(index, 1); localStorage.setItem('sticky-tasks', JSON.stringify(taskList)); renderTasks(); });
        list.appendChild(li);
    });
    if(taskList.length === 0) document.getElementById('sticky-note').classList.add('hidden');
}

function setupFloatingNotes() {
    const notepad = document.getElementById('floating-notes');
    notepad.value = localStorage.getItem('os-notes') || '';
    notepad.addEventListener('input', (e) => localStorage.setItem('os-notes', e.target.value));
    document.getElementById('export-notes-btn').addEventListener('click', () => {
        const text = notepad.value;
        if (!text) { alert("Notes are empty!"); return; }
        const blob = new Blob([text], { type: "text/plain" });
        const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
        a.download = "My_Study_Notes.txt"; a.click();
    });
}

function setupDataExport() {
    document.getElementById('export-btn').addEventListener('click', () => {
        const systemData = {
            notes: localStorage.getItem('os-notes'),
            heatmap: localStorage.getItem('heatmap-data'),
            layout: localStorage.getItem('widget-positions'),
            links: localStorage.getItem('user-links'),
            tasks: localStorage.getItem('sticky-tasks'),
            flashcards: localStorage.getItem('flashcards'),
            customBgs: localStorage.getItem('custom-bgs')
        };
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(systemData, null, 2));
        const a = document.createElement('a'); a.href = dataStr; a.download = "daily_canvas_backup.json";
        document.body.appendChild(a); a.click(); a.remove();
    });
}

function setupQuickLinks() {
    const container = document.getElementById('custom-links-container');
    const nameInput = document.getElementById('link-name'); const urlInput = document.getElementById('link-url');
    let links = JSON.parse(localStorage.getItem('user-links')) || [{ name: "GitHub", url: "https://github.com" }];

    function renderLinks() {
        container.innerHTML = '';
        links.forEach((link, index) => {
            const div = document.createElement('div'); div.className = 'link-item';
            div.innerHTML = `<a href="${link.url}" target="_blank">🔗 ${link.name}</a><button class="delete-link" data-index="${index}">×</button>`;
            container.appendChild(div);
        });
        document.querySelectorAll('.delete-link').forEach(btn => {
            btn.addEventListener('click', (e) => { links.splice(e.target.getAttribute('data-index'), 1); localStorage.setItem('user-links', JSON.stringify(links)); renderLinks(); });
        });
    }
    document.getElementById('add-link-btn').addEventListener('click', () => {
        let url = urlInput.value;
        if(nameInput.value && url) {
            if (!url.startsWith('http')) url = 'https://' + url;
            links.push({ name: nameInput.value, url }); localStorage.setItem('user-links', JSON.stringify(links));
            nameInput.value = ''; urlInput.value = ''; renderLinks();
        }
    });
    renderLinks();
}

function setupWidgetManager() {
    const checkboxes = document.querySelectorAll('.widget-toggle');
    let activeWidgets = JSON.parse(localStorage.getItem('active-widgets')) || ['weather-widget', 'finance-widget'];

    function updateWidgets() {
        document.querySelectorAll('.draggable').forEach(el => {
            if (el.id !== 'sticky-note') el.classList.add('hidden');
        });
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
                box.disabled = (checkedCount >= 4); 
                box.parentElement.style.opacity = box.disabled ? "0.5" : "1";
            } else { box.disabled = false; box.parentElement.style.opacity = "1"; }
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

function makeDraggable() {
    const GRID_SIZE = 20;
    document.querySelectorAll('.draggable').forEach(elmnt => {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        elmnt.onmousedown = (e) => {
            if(e.target.tagName === 'TEXTAREA' || e.target.tagName === 'BUTTON') return; 
            e.preventDefault(); pos3 = e.clientX; pos4 = e.clientY;
            document.onmouseup = closeDragElement; document.onmousemove = elementDrag; elmnt.style.zIndex = 1000; 
        };
        function elementDrag(e) {
            e.preventDefault(); pos1 = pos3 - e.clientX; pos2 = pos4 - e.clientY; pos3 = e.clientX; pos4 = e.clientY;
            elmnt.style.top = (elmnt.offsetTop - pos2) + "px"; elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
        }
        function closeDragElement() {
            document.onmouseup = null; document.onmousemove = null; elmnt.style.zIndex = 50;
            const finalTop = Math.round(elmnt.offsetTop / GRID_SIZE) * GRID_SIZE;
            const finalLeft = Math.round(elmnt.offsetLeft / GRID_SIZE) * GRID_SIZE;
            elmnt.style.top = finalTop + "px"; elmnt.style.left = finalLeft + "px";
            const positions = JSON.parse(localStorage.getItem('widget-positions')) || {};
            positions[elmnt.id] = { top: elmnt.style.top, left: elmnt.style.left };
            localStorage.setItem('widget-positions', JSON.stringify(positions));
        }
        const savedPos = JSON.parse(localStorage.getItem('widget-positions'));
        if (savedPos && savedPos[elmnt.id]) { elmnt.style.top = savedPos[elmnt.id].top; elmnt.style.left = savedPos[elmnt.id].left; }
    });
}

init();