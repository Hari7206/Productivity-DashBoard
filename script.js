


function changingTheme(){
    let rootElement = document.documentElement
let theme = document.querySelector('.theme i')

theme.addEventListener('click' , function(){

rootElement.style.setProperty('--pri' ,'yellow')

console.log(rootElement);
})
}
changingTheme()
















function openfetures() {
    let allElem = document.querySelectorAll('.elem')
    let fullElemPage = document.querySelectorAll('.fullElem')
    let fullElemPageBtn = document.querySelectorAll('.fullElem .back')
    let nav = document.querySelector('.nav-in')
    let allElems = document.querySelector('.allElems')





    fullElemPageBtn.forEach((back) => {
        back.addEventListener('click', function () {
            fullElemPage[back.id].style.display = 'none'
               nav.style.display = 'flex'
                allElems.style.display = 'flex'

            //    new changes of back
       
        })
    })




    allElem.forEach((elem) => {
        elem.addEventListener('click', function () {
            fullElemPage[elem.id].style.display = 'block'   
            nav.style.display = 'none'
            allElems.style.display = 'none'

            //new change of elems
            
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






function weatherFuntion(){
    




let header2Temp = document.querySelector('.header2 h2')
let header2Condition = document.querySelector('.header2 h4')
let Precipitation = document.querySelector('.header2 .Precipitation')
let Humidity = document.querySelector('.Humidity')
let Wind = document.querySelector('.header2 .Wind')


let data = null;
let city = 'hisar'
let apiKey = '167c55de2ebc4ccf84532347260203'
async function weatherApiCall() {

    let response = await fetch(`http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`)

    data = await response.json()
    console.log(data);
    header2Condition.innerHTML = `${data.current.condition.text}`
    Precipitation.innerHTML = `Precipitation: ${data.current.precip_in} %`
    Humidity.innerHTML = `Humidity: ${data.current.humidity} %`

    Wind.innerHTML = `Wind: ${data.current.wind_kph} km/h`;
    header2Temp.innerHTML = `${data.current.temp_c} °C`

}
weatherApiCall()




let header1Time = document.querySelector('.header1 h1')
let header1Date = document.querySelector('.header1 h2')


function timeDate() {
    let week = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ];
    let date = new Date();

let hours = date.getHours();
let minutes = date.getMinutes();
let todayDate = date.getDate();
let month = months[date.getMonth()];
let year = date.getFullYear();

header1Date.innerHTML = `${String(todayDate).padStart('2' , '0')} ${month}, ${year}`;

minutes = String(minutes).padStart(2, "0");

if (hours > 12) {
    header1Time.innerHTML = `${week[date.getDay()]} ${String(hours - 12).padStart(2, "0")}:${minutes} PM`;
} else if (hours === 12) {
    header1Time.innerHTML = `${week[date.getDay()]} 12:${minutes} PM`;
} else if (hours === 0) {
    header1Time.innerHTML = `${week[date.getDay()]} 12:${minutes} AM`;
} else {
    header1Time.innerHTML = `${week[date.getDay()]} ${String(hours).padStart(2, "0")}:${minutes} AM`;
}

}

timeDate();
}
weatherFuntion()