function openfetures(){
    let allElem = document.querySelectorAll('.elem')
let fullElemPage = document.querySelectorAll('.fullElem')
let fullElemPageBtn = document.querySelectorAll('.fullElem .back')





fullElemPageBtn.forEach((back) =>{
back.addEventListener('click' , function(){
    fullElemPage[back.id].style.display = 'none'
})
})




allElem.forEach((elem) => {
elem.addEventListener('click' , function(){
fullElemPage[elem.id].style.display = 'block'
})
})
}
openfetures()