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