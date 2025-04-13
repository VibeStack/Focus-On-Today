const checkBoxList = document.querySelectorAll('.custon-checkbox');
const inputFields= document.querySelectorAll('.goal-input');
const errorLabel = document.querySelector('.error-label');
const progressBar = document.querySelector('.progress-bar');
const progressvalue = document.querySelector('.progress-value');
const progressText = document.querySelector('.progress-text');
const progressLabel = document.querySelector('.progress-label');

const allGoals = JSON.parse(localStorage.getItem('allGoals')) || {
    first: {
        data: "",
        completed: false,
    },
    second: {
        data: "",
        completed: false,
    },
    third: {
        data: "",
        completed: false,
    },
}
let goalCompleted = Object.values(allGoals).filter((goal)=>goal.completed).length;
progressvalue.style.width = `${(goalCompleted/3)*100}%`;
progressText.innerText = `${goalCompleted}/3 completed`;
progressText.innerText = `${goalCompleted}/3 completed`;
progressLabel.innerText = localStorage.progressLabel || 'Raise the bar by completing your goals!';


checkBoxList.forEach((checkbox)=>{
    checkbox.addEventListener('click',(e)=>{
        const allGoalsAdded = [...inputFields].every((input)=>{
            return input.value;
        })
        if(allGoalsAdded){
            checkbox.parentElement.classList.toggle('completed');
            const inputID = checkbox.nextElementSibling.id;
            allGoals[inputID].completed = !allGoals[inputID].completed;
            goalCompleted = Object.values(allGoals).filter((goal)=>goal.completed).length;
            progressvalue.style.width = `${(goalCompleted/3)*100}%`;
            progressText.innerText = `${goalCompleted}/3 completed`;
            if(goalCompleted === 0){
                progressLabel.innerText = 'Raise the bar by completing your goals!'
            }
            else if(goalCompleted === 1){
                progressLabel.innerText = 'Well Begun is half done!';
            }
            else if(goalCompleted === 2){
                progressLabel.innerText = 'Just a step away,keep going!';
            }
            else if(goalCompleted === 3){
                progressLabel.innerText = 'Whoa! you just completed all the goals, time for chill :D';
            }
            localStorage.setItem('allGoals',JSON.stringify(allGoals));
            const progressString = progressLabel.innerText;
            localStorage.setItem('progressString',JSON.stringify(progressString));
        }
        else{
            progressBar.classList.add('show-error');
        }
    })
})

inputFields.forEach((input)=>{
    input.value = allGoals[input.id].data;
    if(allGoals[input.id].completed){
        input.parentElement.classList.add('completed');
    }
    input.addEventListener('focus',()=>{
        progressBar.classList.remove('show-error');
    })
    input.addEventListener('input',(e)=>{
        if(allGoals[input.id].completed){
            input.value = allGoals[input.id].data;
            return;
        }
        allGoals[input.id] = {
            data: input.value,
            completed: false,
        }
        localStorage.setItem('allGoals',JSON.stringify(allGoals));
        progressString = progressLabel.innerText;
        localStorage.setItem('progressString',JSON.stringify(progressString));
    })
})
