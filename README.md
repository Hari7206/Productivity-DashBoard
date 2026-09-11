# Productivity Dashboard

A single-page, browser-based dashboard for planning work, managing tasks, tracking focus time, and checking local weather. It has no build step or server-side code: open it in a modern browser to use it.

## Features

- **Task list:** Add tasks, mark priorities, and remove completed work. Tasks persist in browser storage.
- **Daily planner:** Plan every hour from 6 AM to 11 PM, add a daily note, and view the current-day progress indicator.
- **Daily goals:** Create goals across morning, afternoon, evening, and night. Mark each day of the week as complete; entries persist in browser storage.
- **Pomodoro timer:** Run focus, short-break, and long-break sessions. Includes 5-, 25-, and 100-minute presets, session counts, and automatic break selection after focus sessions.
- **Stopwatch:** Start, pause, reset, and record laps. The fastest and slowest laps are highlighted when applicable.
- **Weather search:** Uses browser geolocation when permitted and lets you search for another city. Displays temperature, conditions, humidity, wind, and precipitation.
- **Motivation and theme:** Loads a quote of the day and includes a light/dark theme toggle.

## Run locally

1. Download or clone this repository.
2. Open [index.html](index.html) in a modern browser.
3. Allow location access if you want weather for your current location. If you decline it, the dashboard falls back to Delhi.

No package installation, build command, or local server is required.

## Project structure

```text
productivity-dashboard/
├── index.html                 Application markup
├── style.css                  Layout, themes, and responsive styles
├── script.js                  Dashboard interactions and persistence
└── AeonikTRIAL-*.otf          Local display fonts
```

## Technologies and services

- HTML, CSS, and vanilla JavaScript
- [Remix Icon](https://remixicon.com/) icon font, loaded from jsDelivr
- [WeatherAPI.com](https://www.weatherapi.com/) for current weather and city search
- [ZenQuotes](https://zenquotes.io/) for the daily quote, accessed through AllOrigins
- `localStorage` for task, goal, planner, and note data

## Notes

The application makes client-side requests to third-party weather and quote services, so those widgets require an internet connection. Data saved through `localStorage` stays only in the current browser profile; clearing site data removes it.

## Author

Hari Thapa
