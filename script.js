document.addEventListener('DOMContentLoaded', function() {

    // Helper functions for DOM selection
    function getElement(selector) {
        return document.querySelector(selector);
    }

    function getAllElements(selector) {
        return document.querySelectorAll(selector);
    }

    // ===== ENSURE MAIN PAGE IS VISIBLE ON LOAD =====
    // Make sure topbar and allElems are visible, fullElem are hidden
    var topbar = getElement('.topbar');
    var allElems = getElement('.allElems');
    var fullPages = getAllElements('.fullElem');
    
    if (topbar) topbar.style.display = 'flex';
    if (allElems) allElems.style.display = 'grid';
    
    fullPages.forEach(function(page) {
        page.style.setProperty('display', 'none', 'important');
    });

    // ===== DATE & TIME =====
    function updateDateTime() {
        var now = new Date();
        
        var dateElement = getElement('#today-date');
        if (dateElement) {
            dateElement.textContent = now.toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
            });
        }

        var timeElement = getElement('#today-time');
        if (timeElement) {
            var weekday = now.toLocaleDateString('en-US', { weekday: 'long' });
            var time = now.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
            });
            timeElement.textContent = weekday + ', ' + time;
        }
    }

    updateDateTime();
    setInterval(updateDateTime, 30000);

    // ===== THEME TOGGLE =====
    var themeButton = getElement('.theme');
    if (themeButton) {
        themeButton.addEventListener('click', function() {
            document.body.classList.toggle('light');
            var icon = themeButton.querySelector('i');
            if (document.body.classList.contains('light')) {
                icon.className = 'ri-moon-line';
            } else {
                icon.className = 'ri-sun-line';
            }
        });
    }

    // ===== TILE NAVIGATION =====
    var tiles = getAllElements('.elem');
    tiles.forEach(function(tile) {
        tile.addEventListener('click', function() {
            var pageIndex = Number(tile.id);
            var fullPages = getAllElements('.fullElem');
            var page = fullPages[pageIndex];
            
            if (page) {
                page.style.setProperty('display', 'block', 'important');
                
                // Initialize daily planner if it's the planner page (id 1)
                if (pageIndex === 1) {
                    setTimeout(function() {
                        initDailyPlanner();
                    }, 100);
                }
            }
            
            var topbar = getElement('.topbar');
            var allElems = getElement('.allElems');
            
            if (topbar) topbar.style.display = 'none';
            if (allElems) allElems.style.display = 'none';
        });
    });

    var backButtons = getAllElements('.back');
    backButtons.forEach(function(back) {
        back.addEventListener('click', function() {
            var pageIndex = Number(back.id);
            var fullPages = getAllElements('.fullElem');
            var page = fullPages[pageIndex];
            
            if (page) {
                page.style.setProperty('display', 'none', 'important');
            }
            
            var topbar = getElement('.topbar');
            var allElems = getElement('.allElems');
            
            if (topbar) topbar.style.display = 'flex';
            if (allElems) allElems.style.display = 'grid';
        });
    });

    // ===== WEATHER =====
    var apiKey = '167c55de2ebc4ccf84532347260203';

    function fetchWeather(query) {
        var weatherCondition = getElement('.weather-condition');
        
        fetch('https://api.weatherapi.com/v1/current.json?key=' + apiKey + '&q=' + encodeURIComponent(query))
            .then(function(response) {
                if (!response.ok) {
                    throw new Error('Weather fetch failed');
                }
                return response.json();
            })
            .then(function(data) {
                var tempElement = getElement('.weather-temp');
                if (tempElement) {
                    tempElement.textContent = Math.round(data.current.temp_c) + '°';
                }

                var conditionElement = getElement('.weather-condition');
                if (conditionElement) {
                    conditionElement.textContent = data.current.condition.text;
                }

                var cityElement = getElement('.weather-city');
                if (cityElement) {
                    var cityName = data.location.name;
                    var region = data.location.region;
                    if (region) {
                        cityName = cityName + ', ' + region;
                    }
                    cityElement.textContent = cityName;
                }

                var humidityElement = getElement('.Humidity');
                if (humidityElement) {
                    humidityElement.textContent = 'Humidity ' + data.current.humidity + '%';
                }

                var windElement = getElement('.Wind');
                if (windElement) {
                    windElement.textContent = 'Wind ' + data.current.wind_kph + ' km/h';
                }

                var rainElement = getElement('.Precipitation');
                if (rainElement) {
                    rainElement.textContent = 'Rain ' + data.current.precip_mm + ' mm';
                }
            })
            .catch(function() {
                var conditionElement = getElement('.weather-condition');
                if (conditionElement) {
                    conditionElement.textContent = 'Weather unavailable';
                }
            });
    }

    // Get user location or use default
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function(position) {
                var lat = position.coords.latitude;
                var lon = position.coords.longitude;
                fetchWeather(lat + ',' + lon);
            },
            function() {
                fetchWeather('Delhi');
            },
            { timeout: 8000 }
        );
    } else {
        fetchWeather('Delhi');
    }

    // ===== SEARCH =====
    var searchInput = getElement('#location-search');
    var suggestionsBox = getElement('#searchSuggestions');
    var searchButton = getElement('#search-location-btn');
    var searchTimer = null;

    if (searchInput) {
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimer);
            
            searchTimer = setTimeout(function() {
                var query = searchInput.value.trim();
                
                if (query.length < 2) {
                    suggestionsBox.style.display = 'none';
                    return;
                }

                fetch('https://api.weatherapi.com/v1/search.json?key=' + apiKey + '&q=' + encodeURIComponent(query))
                    .then(function(response) {
                        return response.json();
                    })
                    .then(function(places) {
                        if (!places || places.length === 0) {
                            suggestionsBox.style.display = 'none';
                            return;
                        }

                        var html = '';
                        places.forEach(function(place) {
                            html += '<div class="suggestion-item" data-q="' + place.lat + ',' + place.lon + '">';
                            html += place.name + ', ' + place.country;
                            html += '</div>';
                        });
                        suggestionsBox.innerHTML = html;
                        suggestionsBox.style.display = 'block';

                        var suggestionItems = getAllElements('.suggestion-item');
                        suggestionItems.forEach(function(item) {
                            item.addEventListener('click', function() {
                                fetchWeather(item.dataset.q);
                                searchInput.value = item.textContent;
                                suggestionsBox.style.display = 'none';
                            });
                        });
                    })
                    .catch(function() {
                        suggestionsBox.style.display = 'none';
                    });
            }, 350);
        });

        searchInput.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                searchButton.click();
            }
        });
    }

    if (searchButton) {
        searchButton.addEventListener('click', function() {
            var query = searchInput.value.trim();
            if (query) {
                fetchWeather(query);
                suggestionsBox.style.display = 'none';
            }
        });
    }

    // ===== TO-DO LIST =====
    var tasks = JSON.parse(localStorage.getItem('currentTask') || '[]');

    function saveTasks() {
        localStorage.setItem('currentTask', JSON.stringify(tasks));
        renderTasks();
    }

    function renderTasks() {
        var allTaskContainer = getElement('.allTask');
        if (!allTaskContainer) return;

        if (tasks.length === 0) {
            allTaskContainer.innerHTML = '<p class="eyebrow">No tasks yet — add your first priority.</p>';
            return;
        }

        var html = '';
        tasks.forEach(function(task, index) {
            var importantTag = '';
            if (task.imp) {
                importantTag = '<span>important</span>';
            }
            html += '<div class="task">';
            html += '<h4>' + task.task + ' ' + importantTag + '</h4>';
            html += '<button data-index="' + index + '">Completed</button>';
            html += '</div>';
        });
        allTaskContainer.innerHTML = html;

        var completeButtons = getAllElements('.task button');
        completeButtons.forEach(function(button) {
            button.addEventListener('click', function() {
                var index = Number(button.dataset.index);
                tasks.splice(index, 1);
                saveTasks();
            });
        });
    }

    renderTasks();

    var todoForm = getElement('.addTask form');
    if (todoForm) {
        todoForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            var taskInput = getElement('#text-input');
            var taskDetails = getElement('.addTask textarea');
            var importantCheck = getElement('#check');
            
            var taskText = taskInput.value.trim();
            if (!taskText) return;

            tasks.push({
                task: taskText,
                details: taskDetails.value,
                imp: importantCheck.checked
            });

            taskInput.value = '';
            taskDetails.value = '';
            importantCheck.checked = false;

            saveTasks();
        });
    }

    // ===== MOTIVATIONAL QUOTE =====
    var quoteElement = getElement('.motivation-2 h1');
    var authorElement = getElement('.motivation-3 h1');
    var homeQuote = getElement('#home-quote');
    var homeAuthor = getElement('#home-author');

    fetch('https://api.allorigins.win/raw?url=https://zenquotes.io/api/random')
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            var quoteText = data[0].q;
            var quoteAuthor = data[0].a;

            if (quoteElement) quoteElement.textContent = quoteText;
            if (authorElement) authorElement.textContent = quoteAuthor + ' ~';
            if (homeQuote) homeQuote.textContent = quoteText;
            if (homeAuthor) homeAuthor.textContent = '— ' + quoteAuthor;
        })
        .catch(function() {
            // Quote failed to load, keep default text
        });

    // ===== ROUTINE TRACKER (Daily Goals) =====
    var routineContainer = getElement('#routine-app');
    var timeSlots = ['Morning', 'Afternoon', 'Evening', 'Night'];
    var weekDays = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

    function renderRoutine() {
        if (!routineContainer) return;

        var routineHtml = '';
        timeSlots.forEach(function(time) {
            routineHtml += '<div class="section-block">';
            routineHtml += '<div class="section-header">';
            routineHtml += '<span class="section-title">' + time + '</span>';
            routineHtml += '<div class="days-labels">';
            weekDays.forEach(function(day) {
                routineHtml += '<span>' + day + '</span>';
            });
            routineHtml += '</div></div>';

            for (var i = 0; i < 4; i++) {
                var textKey = time + '-' + i + '-text';
                var savedText = localStorage.getItem(textKey) || '';

                routineHtml += '<div class="goal-row">';
                routineHtml += '<input class="goal-input" data-key="' + textKey + '" placeholder="Enter goal" value="' + savedText + '">';
                routineHtml += '<div class="checkbox-grid">';

                weekDays.forEach(function(_, dayIndex) {
                    var checkboxKey = time + '-' + i + '-' + dayIndex;
                    var isChecked = localStorage.getItem(checkboxKey) === 'true' ? 'checked' : '';
                    routineHtml += '<input type="checkbox" data-key="' + checkboxKey + '" ' + isChecked + '>';
                });

                routineHtml += '</div></div>';
            }
            routineHtml += '</div>';
        });
        routineContainer.innerHTML = routineHtml;

        // Update goal progress on the dashboard tile
        updateGoalProgress();

        // Add event listeners for saving
        routineContainer.addEventListener('input', function(event) {
            var target = event.target;
            if (target.dataset.key) {
                if (target.type === 'checkbox') {
                    localStorage.setItem(target.dataset.key, target.checked);
                } else {
                    localStorage.setItem(target.dataset.key, target.value);
                }
                updateGoalProgress();
            }
        });
    }

    function updateGoalProgress() {
        var totalChecked = 0;
        var totalGoals = 0;
        
        for (var t = 0; t < timeSlots.length; t++) {
            for (var g = 0; g < 4; g++) {
                for (var d = 0; d < weekDays.length; d++) {
                    var key = timeSlots[t] + '-' + g + '-' + d;
                    if (localStorage.getItem(key) === 'true') {
                        totalChecked++;
                    }
                    totalGoals++;
                }
            }
        }
        
        var progressElement = document.querySelector('.goal-progress b');
        if (progressElement) {
            progressElement.textContent = totalChecked;
        }
    }

    // Initialize routine
    renderRoutine();

    // ===== POMODORO TIMER =====
    var pomoSeconds = 1500; // 25 minutes
    var pomoInterval = null;
    var pomoRunning = false;
    var pomoMode = 'focus'; // 'focus', 'short-break', 'long-break'
    var pomoCompleted = 0;
    var pomoTotalFocus = 0;
    var pomoIsBreak = false;

    var pomoDisplay = getElement('#pomodoro-time');
    var pomoMainBtn = getElement('#pomodoro-main-btn');
    var pomoSessionMode = getElement('#session-mode');
    var pomoSessionCount = getElement('#session-count');

    var presetBtns = getAllElements('.preset-btn');
    var modeBtns = getAllElements('.mode-btn');

    function updatePomodoroDisplay() {
        var minutes = String(Math.floor(pomoSeconds / 60)).padStart(2, '0');
        var seconds = String(pomoSeconds % 60).padStart(2, '0');
        if (pomoDisplay) pomoDisplay.textContent = minutes + ':' + seconds;
    }

    function setPomodoroMode(mode) {
        pomoMode = mode;
        pomoIsBreak = (mode === 'short-break' || mode === 'long-break');
        
        // Update mode text
        var modeText = mode === 'focus' ? 'Focus' : mode === 'short-break' ? 'Short Break' : 'Long Break';
        if (pomoSessionMode) pomoSessionMode.textContent = modeText;
        
        // Set time based on mode
        if (mode === 'focus') {
            pomoSeconds = 25 * 60;
        } else if (mode === 'short-break') {
            pomoSeconds = 5 * 60;
        } else if (mode === 'long-break') {
            pomoSeconds = 15 * 60;
        }
        
        // Update active mode button
        modeBtns.forEach(function(btn) {
            btn.classList.remove('active');
            if (btn.dataset.mode === mode) {
                btn.classList.add('active');
            }
        });
        
        // Update preset button based on time
        var minutes = pomoSeconds / 60;
        presetBtns.forEach(function(btn) {
            btn.classList.remove('active');
            if (Number(btn.dataset.minutes) === minutes) {
                btn.classList.add('active');
            }
        });
        
        // Reset main button
        if (pomoMainBtn) {
            pomoMainBtn.textContent = 'START';
            pomoMainBtn.classList.remove('running', 'completed');
        }
        
        updatePomodoroDisplay();
        clearInterval(pomoInterval);
        pomoRunning = false;
    }

    function startPomodoro() {
        if (pomoRunning) return;
        
        // If timer is at 0, reset based on mode
        if (pomoSeconds <= 0) {
            setPomodoroMode(pomoMode);
        }
        
        pomoRunning = true;
        if (pomoMainBtn) {
            pomoMainBtn.textContent = 'STOP';
            pomoMainBtn.classList.add('running');
            pomoMainBtn.classList.remove('completed');
        }
        
        pomoInterval = setInterval(function() {
            if (pomoSeconds > 0) {
                pomoSeconds--;
                updatePomodoroDisplay();
                updatePomodoroTile();
            } else {
                // Timer completed
                clearInterval(pomoInterval);
                pomoRunning = false;
                
                if (pomoMode === 'focus') {
                    pomoCompleted++;
                    pomoTotalFocus++;
                    if (pomoSessionCount) {
                        pomoSessionCount.textContent = 'Completed: ' + pomoCompleted;
                    }
                    
                    // Show completion
                    if (pomoMainBtn) {
                        pomoMainBtn.textContent = "TIME'S UP! TAKE A BREAK";
                        pomoMainBtn.classList.remove('running');
                        pomoMainBtn.classList.add('completed');
                    }
                    
                    // Auto switch to break mode but don't auto-start
                    var breakMode = (pomoTotalFocus % 4 === 0) ? 'long-break' : 'short-break';
                    setPomodoroMode(breakMode);
                    
                } else {
                    // Break completed
                    if (pomoMainBtn) {
                        pomoMainBtn.textContent = 'BREAK OVER! START FOCUS';
                        pomoMainBtn.classList.remove('running');
                        pomoMainBtn.classList.add('completed');
                    }
                    
                    // Switch back to focus but don't auto-start
                    setPomodoroMode('focus');
                }
                updatePomodoroTile();
            }
        }, 1000);
    }

    function stopPomodoro() {
        clearInterval(pomoInterval);
        pomoRunning = false;
        if (pomoMainBtn) {
            pomoMainBtn.textContent = 'START';
            pomoMainBtn.classList.remove('running', 'completed');
        }
    }

    // Main button click
    if (pomoMainBtn) {
        pomoMainBtn.addEventListener('click', function() {
            if (pomoRunning) {
                stopPomodoro();
            } else {
                // If timer is at 0 and it's a break, reset to focus
                if (pomoSeconds <= 0 && pomoMode !== 'focus') {
                    setPomodoroMode('focus');
                }
                startPomodoro();
            }
        });
    }

    // Preset buttons
    presetBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            if (pomoRunning) return;
            
            var minutes = Number(btn.dataset.minutes);
            pomoSeconds = minutes * 60;
            
            presetBtns.forEach(function(b) { b.classList.remove('active'); });
            btn.classList.add('active');
            
            updatePomodoroDisplay();
            updatePomodoroTile();
        });
    });

    // Mode buttons
    modeBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            if (pomoRunning) return;
            setPomodoroMode(btn.dataset.mode);
            updatePomodoroTile();
        });
    });

    // Initialize
    setPomodoroMode('focus');

    // ===== UPDATE POMODORO PROGRESS IN DASHBOARD =====
    function updatePomodoroTile() {
        var tileOrb = document.querySelector('.pomodoro .timer-orb span');
        if (tileOrb) {
            var minutes = Math.floor(pomoSeconds / 60);
            tileOrb.textContent = minutes;
        }
    }

    // ===== STOPWATCH =====
    var watchSeconds = 0;
    var watchInterval = null;
    var lapCounter = 0;
    var laps = [];
    var lastLapTime = 0;

    // Get all the stopwatch display elements
    var hoursDisplay = getElement('#stopwatch-hours');
    var minutesDisplay = getElement('#stopwatch-minutes');
    var secondsDisplay = getElement('#stopwatch-seconds');
    var hoursLabel = getElement('#hours-label');
    var minutesLabel = getElement('#minutes-label');
    var secondsLabel = getElement('#seconds-label');
    var lapsList = getElement('#laps-list');

    function formatTime(seconds) {
        var h = Math.floor(seconds / 3600);
        var m = Math.floor((seconds % 3600) / 60);
        var s = Math.floor(seconds % 60);
        return {
            h: String(h).padStart(2, '0'),
            m: String(m).padStart(2, '0'),
            s: String(s).padStart(2, '0')
        };
    }

    function updateStopwatchDisplay() {
        var time = formatTime(watchSeconds);

        if (hoursDisplay) hoursDisplay.textContent = time.h;
        if (minutesDisplay) minutesDisplay.textContent = time.m;
        if (secondsDisplay) secondsDisplay.textContent = time.s;
        if (hoursLabel) hoursLabel.textContent = time.h;
        if (minutesLabel) minutesLabel.textContent = time.m;
        if (secondsLabel) secondsLabel.textContent = time.s;
    }

    function renderLaps() {
        if (!lapsList) return;

        if (laps.length === 0) {
            lapsList.innerHTML = '<div class="no-laps">No laps recorded</div>';
            return;
        }

        var html = '';
        var lapTimes = laps.map(function(lap) { return lap.time; });
        var bestLap = Math.min.apply(null, lapTimes);
        var worstLap = Math.max.apply(null, lapTimes);

        laps.forEach(function(lap, index) {
            var lapNumber = index + 1;
            var lapTime = formatTime(lap.time);
            var lapTimeStr = lapTime.h + ':' + lapTime.m + ':' + lapTime.s;
            
            var className = '';
            if (lap.time === bestLap && laps.length > 1) {
                className = 'lap-best';
            } else if (lap.time === worstLap && laps.length > 1 && bestLap !== worstLap) {
                className = 'lap-worst';
            }

            html += '<div class="lap-item ' + className + '">';
            html += '<span class="lap-number">Lap ' + lapNumber + '</span>';
            html += '<span class="lap-time">' + lapTimeStr + '</span>';
            html += '</div>';
        });

        lapsList.innerHTML = html;
    }

    function resetStopwatch() {
        clearInterval(watchInterval);
        watchInterval = null;
        watchSeconds = 0;
        lapCounter = 0;
        laps = [];
        lastLapTime = 0;
        updateStopwatchDisplay();
        renderLaps();
    }

    // Initialize stopwatch display
    updateStopwatchDisplay();
    renderLaps();

    // Stopwatch controls - using addEventListener
    var stopwatchStart = getElement('.stopwatch-start');
    if (stopwatchStart) {
        stopwatchStart.addEventListener('click', function() {
            if (watchInterval) return;
            watchInterval = setInterval(function() {
                watchSeconds++;
                updateStopwatchDisplay();
            }, 1000);
        });
    }

    var stopwatchPause = getElement('.stopwatch-pause');
    if (stopwatchPause) {
        stopwatchPause.addEventListener('click', function() {
            clearInterval(watchInterval);
            watchInterval = null;
        });
    }

    var stopwatchReset = getElement('.stopwatch-reset');
    if (stopwatchReset) {
        stopwatchReset.addEventListener('click', function() {
            resetStopwatch();
        });
    }

    var stopwatchLap = getElement('.stopwatch-lap');
    if (stopwatchLap) {
        stopwatchLap.addEventListener('click', function() {
            if (watchSeconds === 0) return;
            if (!watchInterval) return;
            
            var currentLapTime = watchSeconds - lastLapTime;
            laps.push({ time: currentLapTime });
            lastLapTime = watchSeconds;
            lapCounter++;
            renderLaps();
        });
    }

    // ===== DAILY PLANNER (Advanced - Time Grid with Progress Circle) =====
    var schedule = JSON.parse(localStorage.getItem('dayPlanData') || '{}');

    function initDailyPlanner() {
        generateTimeGrid();
        updateDailyNote();
        updateDateDisplay();

        // Update progress every minute
        setInterval(function() {
            var now = new Date();
            updateProgressCircle(now.getHours());
        }, 60000);
    }

    function generateTimeGrid() {
        var timeGrid = getElement('#time-grid');
        if (!timeGrid) return;

        var now = new Date();
        var currentHour = now.getHours();
        var currentMinutes = now.getMinutes();

        var gridHtml = '';
        for (var j = 6; j <= 23; j++) {
            var hourDisplay = j > 12 ? j - 12 : j;
            var periodDisplay = j >= 12 ? 'PM' : 'AM';
            var hourKey = j + ':00';
            var savedTask = schedule[hourKey] || '';

            var statusClass = '';
            if (j === currentHour) {
                statusClass = 'current-hour-block';
            } else if (j < currentHour) {
                statusClass = 'past-hour';
            } else {
                statusClass = 'future-hour';
            }

            gridHtml += '<div class="time-label-cell ' + statusClass + '">' + hourDisplay + ':00 ' + periodDisplay + '</div>';
            gridHtml += '<div class="time-input-cell ' + statusClass + '">';
            gridHtml += '<input type="text" data-hour="' + hourKey + '" placeholder="Add task..." value="' + savedTask + '">';
            gridHtml += '</div>';
        }

        timeGrid.innerHTML = gridHtml;

        // Save on input
        var inputs = timeGrid.querySelectorAll('input');
        inputs.forEach(function(input) {
            input.addEventListener('input', function() {
                schedule[input.dataset.hour] = input.value;
                localStorage.setItem('dayPlanData', JSON.stringify(schedule));
            });
        });

        // Update progress circle
        updateProgressCircle(currentHour);
    }

    function updateProgressCircle(currentHour) {
        var circle = getElement('.progress-ring-circle');
        var percentDisplay = getElement('#day-progress');
        var hourDisplay = getElement('#current-hour-display');
        var periodDisplay = getElement('#current-period-display');

        if (!circle || !percentDisplay) return;

        // Calculate progress from 6 AM to 11 PM (17 hours total)
        var startHour = 6;
        var endHour = 23;
        var totalHours = endHour - startHour;
        var hoursPassed = Math.max(0, Math.min(currentHour - startHour, totalHours));
        var minutes = new Date().getMinutes();
        var progress = ((hoursPassed + (minutes / 60)) / totalHours) * 100;
        var clampedProgress = Math.min(Math.max(progress, 0), 100);

        // Update circle
        var circumference = 326.73;
        var offset = circumference - (clampedProgress / 100) * circumference;
        circle.style.strokeDashoffset = offset;

        // Update percent
        percentDisplay.textContent = Math.round(clampedProgress) + '%';

        // Update time display
        var displayHour = currentHour > 12 ? currentHour - 12 : currentHour;
        if (displayHour === 0) displayHour = 12;
        var period = currentHour >= 12 ? 'PM' : 'AM';
        if (hourDisplay) hourDisplay.textContent = String(displayHour).padStart(2, '0');
        if (periodDisplay) periodDisplay.textContent = period;
    }

    function updateDailyNote() {
        var noteInput = getElement('#daily-note-input');
        if (!noteInput) return;

        noteInput.value = localStorage.getItem('dailyNote') || '';

        noteInput.addEventListener('input', function() {
            localStorage.setItem('dailyNote', noteInput.value);
        });
    }

    function updateDateDisplay() {
        var now = new Date();
        var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

        var dayElement = getElement('#planner-day');
        var dateElement = getElement('#planner-date');
        var monthElement = getElement('#planner-month');

        if (dayElement) dayElement.textContent = days[now.getDay()];
        if (dateElement) dateElement.textContent = String(now.getDate()).padStart(2, '0');
        if (monthElement) monthElement.textContent = months[now.getMonth()];
    }

});