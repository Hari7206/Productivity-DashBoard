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

let currentTask = [
    {
        task: 'kurkure khao',
        details: 'abhi',
        imp: true
    },
    {
        task: 'kurkure khao',
        details: 'abhi',
        imp: true
    },
    {
        task: 'kurkure khao',
        details: 'abhi',
        imp: true
    },
]

let form = document.querySelector('.addTask form')
let taskInput = document.querySelector('form #text-input')
let taskDetails = document.querySelector('form  textarea')
let taskCheckbox = document.querySelector('form #check')

// let heading = document.querySelector('.task h4')





function renderTask() {
    let allTask = document.querySelector('.allTask')
    let sum = ''
    currentTask.forEach((elem) => {
        sum += `<div class="task">
                    <h4>${elem.task} <span class=${elem.imp}>imp</span> </h4>
                    <button>Mark as Completed</button>
                </div>`
    })
    allTask.innerHTML = sum;
}
renderTask()


form.addEventListener('submit', function (e) {
    e.preventDefault()
    currentTask.push({
        task: taskInput.value,
        details: taskDetails.value,
        imp: taskCheckbox.checked
    })
    renderTask()
        
})
