# 🎨 The Daily Canvas OS

![Version](https://img.shields.io/badge/version-2.0-blue.svg)
![Vanilla JS](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?logo=javascript&logoColor=black)
![API](https://img.shields.io/badge/API-Google_Gemini_2.5-orange)

A modular, productivity-focused browser dashboard featuring an integrated Large Language Model (LLM) assistant, dynamic visual theming, and persistent state management. Built entirely with Vanilla JavaScript, this project functions as a lightweight "Web OS" designed to optimize daily workflows.

## ✨ Core Features

* **🤖 Integrated AI Command Router:** A custom input parser that intercepts `/ai` commands to query the **Google Gemini 2.5 Flash** API, delivering instant, formatted responses without leaving the dashboard.
* **🎨 The "Chameleon" Visual Engine:** Utilizes the `ColorThief` library to programmatically extract the dominant RGB values from the daily background artwork, dynamically updating CSS root variables to theme the entire UI.
* **🪟 Custom Window Management:** A native drag-and-drop physics engine that allows users to freely position informational widgets across the screen. Coordinates are saved to local memory.
* **🔥 Consistency Heatmap:** A visual data structure that tracks daily task completions, rendering a GitHub-style activity grid.
* **⏱️ Deep Focus Mode:** A distraction-free Pomodoro timer that takes over the center stage for deep work sessions.
* **💾 Data Portability:** All local state (notes, widget positions, saved links, and heatmap arrays) can be managed via the Arc-style sidebar and exported as a UTF-8 encoded JSON backup.

## 🛠️ Technology Stack

* **Frontend:** HTML5, CSS3 (Glassmorphism UI, Flexbox/Grid)
* **Logic:** Vanilla JavaScript (ES6 Modules, Async/Await, DOM Manipulation)
* **Data Storage:** Browser `localStorage` API, Blob/File API
* **External Integrations:** * Google Generative AI (Gemini 2.5 Flash)
  * Open-Meteo API (Zero-auth weather data)
  * CoinGecko API (Cryptocurrency market data)
  * Wikimedia Commons (High-resolution, public domain art assets)

## 🚀 Installation & Setup

Because this project utilizes ES6 JavaScript Modules (`import`/`export`), it **must** be run through a local web server to bypass strict browser CORS policies.

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/yourusername/daily-canvas-os.git](https://github.com/yourusername/daily-canvas-os.git)
   cd daily-canvas-os
Configure the AI Assistant:

Obtain a free API key from Google AI Studio.

Open /modules/ai-api.js.

Replace the placeholder string with your actual API key:
const API_KEY = "YOUR_API_KEY_HERE";

Note: Never commit your active API key to a public repository.

Run the Application:

Using VS Code: Right-click index.html and select "Open with Live Server".

Using Python: Run python -m http.server in your terminal and navigate to http://localhost:8000.

Using Node.js: Run npx serve . and navigate to the provided localhost URL.

💻 Usage Guide
The central input box acts as a smart command router. It listens for specific flags to execute different functions:

Ask the AI: Type /ai [your question] (e.g., /ai Explain polymorphism in OOP).

Set a Goal: Type /task [your goal] or /t [your goal] to lock a focus task to the screen and update your activity heatmap.

Web Search: Type any standard query to execute a Google Search.

Quick Links: Type youtube or github to instantly redirect to those platforms.

📁 File Architecture
The codebase is engineered using a strict Separation of Concerns (SoC) principle.

Plaintext
/daily-canvas-os
 ├── index.html           # View: DOM structure and layout
 ├── style.css            # Visuals: Glassmorphism and animations
 └── /modules             # Controllers
      ├── main.js         # System boot, event listeners, state management
      ├── ai-api.js       # LLM integration and prompt handling
      ├── art-api.js      # Background asset fetching
      ├── weather-api.js  # Geolocation and temperature logic
      └── finance-api.js  # Market data polling
👨‍💻 Author
Eldho
Computer Engineering Student

Disclaimer: This project was built for educational purposes to demonstrate advanced DOM manipulation, API integration, and modular frontend architecture.