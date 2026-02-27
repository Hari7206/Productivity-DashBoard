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

function todo(){
    let currentTask = []
// localStorage.clear();
if(localStorage.getItem('currentTask')){
   

} else {
    console.log('Task list is Empty');
    
}
let form = document.querySelector('.addTask form')
let taskInput = document.querySelector('form #text-input')
let taskDetails = document.querySelector('form  textarea')
let taskCheckbox = document.querySelector('form #check')


function renderTask() {
        localStorage.setItem('currentTask' , JSON.stringify(currentTask))
    let allTask = document.querySelector('.allTask')
    let sum = '' 
    currentTask.forEach((elem , idx) => {
        sum += `<div class="task">
                    <h4>${elem.task} <span class=${elem.imp}>imp</span> </h4>
                    <button id=${idx}>Mark as Completed</button>
                </div>`
    })
    allTask.innerHTML = sum;
     currentTask = JSON.parse(localStorage.getItem('currentTask'))
document.querySelectorAll('.task button').forEach((btn) => {
        btn.addEventListener('click' , function(){
            currentTask.splice(btn.id , 1)
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


let dayPlanData =  JSON.parse(localStorage.getItem('dayPlanData')) || {}


let hours = Array.from({length:18} , (elem , idx) => {
        return `${6+idx}:00 - ${7+idx}:00`
})


let sum = ''
hours.forEach(function(elem , idx){

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
    elem.addEventListener('input' , () => {
dayPlanData[elem.id] = elem.value
localStorage.setItem('dayPlanData' , JSON.stringify(dayPlanData))
    })
})
}
dailyPlanner()




