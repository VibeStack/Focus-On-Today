const allGoalsContainer = document.querySelector('.all-goals-container');
const addNewTaskButton = document.querySelector('.add-new-task-button');
const progressBar = document.querySelector('.progress-bar');
const progressValue = document.querySelector('.progress-value');
const progressText = document.querySelector('.progress-text');
const errorGoalCount = document.querySelector('.error-label span');


let numberOfgoals = parseInt(localStorage.getItem('numberOfgoals'));
let allGoals = {};
let goalsCompletedCount = 0;


// function to create each task/goal space
function eachTaskSpace(taskID){
    const goalContainer = document.createElement('div');
    goalContainer.classList.add('goal-container');
    const html = `  <div class="custom-checkbox">
                        <img class="check-icon" src="./assets/img/Vector 1.svg" alt="">
                    </div>
                    <input id="task-${taskID}" class="goal-input" placeholder="Add new goal... " type="text">
                    <i class="fa-solid fa-trash delete-icon"></i>`;
    goalContainer.innerHTML = html;
    allGoalsContainer.append(goalContainer)
}
// function for progress update
function progressUpdate(){
    goalsCompletedCount = 0;
    for(let goal in allGoals){
        if(allGoals[goal].completed == true){
            const element = document.querySelector(`#${goal}`);
            element.parentElement.classList.add('completed');
            element.readOnly = true;
            goalsCompletedCount++;
        }
    }
    progressValue.style.width = `${(goalsCompletedCount/numberOfgoals)*100}%`;
    progressText.innerText = `${goalsCompletedCount}/${numberOfgoals} Completed`;
}

// create localstorage variable and update
function createAndStoreInLS(numberOfgoals){
    for(let i=0;i<numberOfgoals;i++){
        eachTaskSpace(i+1);
        let eachTaskObject = {};
        if(localStorage.getItem('allGoals')){
            eachTaskObject = {
                data: JSON.parse(localStorage.getItem('allGoals'))[`task-${i+1}`].data,
                completed: JSON.parse(localStorage.getItem('allGoals'))[`task-${i+1}`].completed,
            }
            const allInputFields = document.querySelectorAll('.goal-input');
            allInputFields.forEach((input)=>{
                input.value = JSON.parse(localStorage.getItem('allGoals'))[`${input.id}`].data;
            })
        }
        else{
            eachTaskObject = {
                data: "",
                completed: false,
            }
        }
        allGoals[`task-${i+1}`] = eachTaskObject;
    }
    localStorage.setItem('numberOfgoals',numberOfgoals);
    localStorage.setItem('allGoals',JSON.stringify(allGoals));

    progressUpdate();
}

if(!numberOfgoals){
    numberOfgoals = 3;
    createAndStoreInLS(numberOfgoals,'',false);
}
else{
    createAndStoreInLS(numberOfgoals)
}

allGoalsContainer.addEventListener('click',(e)=>{

    if(e.target.classList.contains('custom-checkbox')){

        const allGoalsAdded = [...document.querySelectorAll('.goal-input')].every((input)=> input.value);
        if(allGoalsAdded){
            const parentElement = e.target.parentElement;
            parentElement.classList.toggle('completed');
    
            const input = e.target.nextElementSibling;
            if(parentElement.classList.contains('completed')){
                allGoals[input.id].completed = true;
                input.readOnly = true;
                progressUpdate();
            }
            else{
                allGoals[input.id].completed = false;
                input.readOnly = false;
                goalsCompletedCount = 0;
                progressUpdate();
            }
            localStorage.setItem('allGoals',JSON.stringify(allGoals));
        }
        else{
            errorGoalCount.innerText = numberOfgoals;
            progressBar.classList.add('show-error');
        }
    }

    if(e.target.classList.contains('goal-input')){

        e.target.innerText = JSON.parse(localStorage.getItem('allGoals'))[`${e.target.id}`].data;
        e.target.addEventListener('input',()=>{
            progressBar.classList.remove('show-error');
            allGoals[e.target.id].data = e.target.value;
            localStorage.setItem('allGoals',JSON.stringify(allGoals));
        })
        e.target.addEventListener('focus',()=>{
            progressBar.classList.remove('show-error');
        })
    }
    if(e.target.classList.contains('delete-icon')){

        const id = e.target.previousElementSibling.id;
        delete allGoals[`${id}`];
        localStorage.setItem('allGoals',JSON.stringify(allGoals));  
        numberOfgoals--;
        localStorage.setItem('numberOfgoals',numberOfgoals);

        progressUpdate();

        // const keysLeft = Object.keys(allGoals);
        // console.log(keysLeft);
        // keysLeft.forEach((key,index)=>{
        //     const eachTaskObject = {
        //         data: JSON.parse(localStorage.getItem('allGoals'))[`${key}`].data,
        //         completed: JSON.parse(localStorage.getItem('allGoals'))[`${key}`].completed,
        //     }
        //     allGoals[`task-${index+1}`] = eachTaskObject;
        // })
        // localStorage.setItem('allGoals',JSON.stringify(allGoals));
        e.target.parentElement.remove();

    }
})


addNewTaskButton.addEventListener('click',()=>{

    numberOfgoals++;
    localStorage.setItem('numberOfgoals',numberOfgoals);
    eachTaskSpace(numberOfgoals);
    const eachTaskObject = {
        data: "",
        completed: false,
    }
    allGoals[`task-${numberOfgoals}`] = eachTaskObject;
    localStorage.setItem('allGoals',JSON.stringify(allGoals));

    progressUpdate();
})

