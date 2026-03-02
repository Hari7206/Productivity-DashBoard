function openfetures() {
    let allElem = document.querySelectorAll('.elem')
    let fullElemPage = document.querySelectorAll('.fullElem')
    let fullElemPageBtn = document.querySelectorAll('.fullElem .back')





    fullElemPageBtn.forEach((back) => {
        back.addEventListener('click', function () {
            fullElemPage[back.id].style.display = 'none'
        })
    })




    allElem.forEach((elem) => {
        elem.addEventListener('click', function () {
            fullElemPage[elem.id].style.display = 'block'
        })
    })
}
openfetures()

function todo() {
    let currentTask = []
    // localStorage.clear();
    if (localStorage.getItem('currentTask')) {


    } else {
        console.log('Task list is Empty');

    }
    let form = document.querySelector('.addTask form')
    let taskInput = document.querySelector('form #text-input')
    let taskDetails = document.querySelector('form  textarea')
    let taskCheckbox = document.querySelector('form #check')


    function renderTask() {
        localStorage.setItem('currentTask', JSON.stringify(currentTask))
        let allTask = document.querySelector('.allTask')
        let sum = ''
        currentTask.forEach((elem, idx) => {
            sum += `<div class="task">
                    <h4>${elem.task} <span class=${elem.imp}>imp</span> </h4>
                    <button id=${idx}>Mark as Completed</button>
                </div>`
        })
        allTask.innerHTML = sum;
        currentTask = JSON.parse(localStorage.getItem('currentTask'))
        document.querySelectorAll('.task button').forEach((btn) => {
            btn.addEventListener('click', function () {
                currentTask.splice(btn.id, 1)
                renderTask()
            })
        })
    }
    renderTask()


    form.addEventListener('submit', function (e) {
        e.preventDefault()
        currentTask.push({
            task: taskInput.value,
            details: taskDetails.value,
            imp: taskCheckbox.checked
        })

        taskInput.value = '';
        taskDetails.value = '';
        taskCheckbox.checked = false
        renderTask()

    })

}

todo()


function dailyPlanner() {
    let dayPlanner = document.querySelector('.day-planner')


    let dayPlanData = JSON.parse(localStorage.getItem('dayPlanData')) || {}


    let hours = Array.from({ length: 18 }, (elem, idx) => {
        return `${6 + idx}:00 - ${7 + idx}:00`
    })


    let sum = ''
    hours.forEach(function (elem, idx) {

        let savedData = dayPlanData[idx] || ''

        sum += `   <div class="day-planner-time">
            <p>
               ${elem}
            </p>
            <input type="text" placeholder="..." id=${idx}  value=${savedData} >
        </div>`
    })


    dayPlanner.innerHTML = sum


    let dayPlannerInput = document.querySelectorAll('.day-planner input')
    dayPlannerInput.forEach((elem) => {
        elem.addEventListener('input', () => {
            dayPlanData[elem.id] = elem.value
            localStorage.setItem('dayPlanData', JSON.stringify(dayPlanData))
        })
    })
}
dailyPlanner()



function motivationalQuote() {
    let motivationOfDay = document.querySelector('.motivation-2 h1')
    let motivationalAuthor = document.querySelector('.motivation-3 h1')
    async function fetchQuote() {

        try {
            const response = await fetch(
                "https://api.allorigins.win/raw?url=https://zenquotes.io/api/random"
            );
            const data = await response.json();

            console.log(data);

            const quote = data[0].q;
            const author = data[0].a;

            motivationOfDay.innerHTML = quote
            motivationalAuthor.innerHTML = `${author}  ~ `

        } catch (error) {
            console.log("Error:", error);
        }
    }
    fetchQuote()
}
motivationalQuote()



function pomodoroTimer() {
    
let startBtn = document.querySelector('.start-timer')
let pauseBtn = document.querySelector('.pause-timer')
let resetBtn = document.querySelector('.reset-timer')

let totalSeconds = 25 * 60
let timerIntervel = null
let timer = document.querySelector('.pomo-timer h1')
let isWorkSession = true;
let session = document.querySelector('.session')
function updateTimer() {
    let minutes = Math.floor(totalSeconds / 60)
    let seconds = totalSeconds % 60;

    timer.innerHTML = `${String(minutes).padStart('2', '0')}:${String(seconds).padStart('2', '0')}`
}


updateTimer()

function startTimer() {


    clearInterval(timerIntervel)

    if (isWorkSession) {

        session.innerHTML = 'Work Session'
        session.style.backgroundColor = 'var(--green)'
        timerIntervel = setInterval(() => {
            if (totalSeconds > 0) {
                totalSeconds--;
                updateTimer()
            }
            else {
                isWorkSession = false
                clearInterval(timerIntervel)
                timer.innerHTML = '05:00'
                        session.innerHTML = 'Break'
        session.style.backgroundColor = 'var(--blue)'
                totalSeconds = 5 * 60
            }
        }, 1000);
    }
    else {


        timerIntervel = setInterval(() => {
            if (totalSeconds > 0) {
                totalSeconds--;
                updateTimer()
            }
            else {
                isWorkSession = true
                clearInterval(timerIntervel)
                timer.innerHTML = '25:00'
                session.innerHTML = 'Work Session'
                session.style.backgroundColor = 'var(--green)'
                        totalSeconds = 25 * 60
            }
        }, 1000);
    }
}

function stopTimer() {
    clearInterval(timerIntervel)

}
function resetTimer() {
    clearInterval(timerIntervel)

    totalSeconds = 25 * 60
    updateTimer()
}

startBtn.addEventListener('click', function () {
    startTimer()
})
pauseBtn.addEventListener('click', function () {
    stopTimer()
})
resetBtn.addEventListener('click', function () {
      session.innerHTML = 'Start Session'
                session.style.backgroundColor = 'rgb(255, 0, 0)'
    resetTimer()
})
}

 pomodoroTimer()