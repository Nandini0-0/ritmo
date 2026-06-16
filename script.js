class habit_obj {
    constructor(i) {
        let selector_name = document.querySelector('.regular-habits').querySelectorAll('span');
        this.habit_name = selector_name[i].innerHTML;
        let selector_class = document.querySelector('.regular-habits').querySelectorAll('input[type="checkbox"]')[i];
        this.habit_isChecked = selector_class.checked;
    }
}
class task_obj {
    constructor(i) {
        let selector_name = document.querySelector('.todays-tasks').querySelectorAll('span');
        this.task_name = selector_name[i].innerHTML;
        let selector_class = document.querySelector('.todays-tasks').querySelectorAll('input[type="checkbox"]')[i];
        this.task_isChecked = selector_class.checked;
    }
}



const todays_habits = document.querySelector(".regular-habits");
//1.
const todays_tasks = document.querySelector(".todays-tasks");
const progress_fill_style = document.querySelector(".progress-fill").style;


const saved_habits = JSON.parse(localStorage.getItem("habits")) || [];
const todayStr = new Date().toDateString();
const lastVisited = localStorage.getItem("lastVisited");

if (lastVisited !== todayStr) {
    localStorage.setItem("lastVisited", todayStr);
    resetForNewDay();
}


const saved_tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let isLoading = true;
saved_habits.forEach((habit) => {
    let hab = add_habit(habit.habit_name);
    const checkbox = hab.querySelector('input');
    const habit_name = hab.querySelector('span');
    checkbox.checked = habit.habit_isChecked;
    if (habit.habit_isChecked) {
        hab.className = "completed";
        habit_name.style.textDecoration = "line-through"
    }
})
saved_tasks.forEach((task) => {

    let tas = add_task(task.task_name);
    const checkbox = tas.querySelector('input');
    const task_name = tas.querySelector('span');
    checkbox.checked = task.task_isChecked;
    if (task.task_isChecked) {
        tas.className = "completed";
        task_name.style.textDecoration = "line-through"
    }
})
isLoading = false;

console.log(document.querySelector(".regular-habits"));

update_progress();




// Listener to add_habit_button
document.querySelector('#add_habit_button').addEventListener("click", () => { add_habit(input_box_value()) });
//Listener to input box (when enter pressed)
document.querySelector(".add-habit").querySelector("input").addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        add_habit(input_box_value());
    }
})

//3.
// Listener to add_task_button
document.querySelector('#add_task_button').addEventListener("click", () => { add_task(input_box_value_task()) });
//Listener to input box (when enter pressed)
document.querySelector(".add-task").querySelector("input").addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        add_task(input_box_value_task());
    }
})


//new habit-card former and inserter 
function new_card(name) {
    const newChild = document.createElement("div");
    newChild.className = "habit-card";
    const habit = document.createElement('span');
    habit.textContent = name;
    const new_checkbox = document.createElement("input");
    new_checkbox.type = "checkbox";
    newChild.appendChild(new_checkbox);
    newChild.appendChild(habit);
    //Delete button
    const delete_btn = document.createElement("button");
    delete_btn.textContent = "🗑️";
    delete_btn.className = "delete-btn"
    newChild.appendChild(delete_btn);

    // //Edit button
    // const edit_btn = document.createElement("button");
    // edit_btn.textContent = "✏️";
    // edit_btn.className = "edit-btn"
    // newChild.appendChild(edit_btn)
    newChild.appendChild(delete_btn);

    return newChild;
}

function input_box_value() {
    let input = document.querySelector(".add-habit").querySelector("input");
    return input.value;
}
function input_box_value_task() {
    let input = document.querySelector(".add-task").querySelector("input");
    return input.value;
}
//adding habit
function add_habit(value) {
    value = value.trim();
    if (value === "") return;
    const habits = todays_habits.querySelectorAll("span");
    const habit_exists = [...habits].some((habit_span) =>
        habit_span.textContent.trim().toUpperCase() === value.toUpperCase()
    );
    if (habit_exists) {
        alert("The habit already exists, try adding a different habit");
        document.querySelector(".add-habit input").value = "";
        return;
    }
    const habit_card = new_card(value);
    document.querySelector(".add-habit input").value = "";
    const container = document.querySelector(".regular-habits");
    if (isLoading) {
        container.appendChild(habit_card);
    }
    else {
        const completed_cards =
            container.querySelectorAll(".completed");

        if (completed_cards.length > 0) {
            container.insertBefore(
                habit_card,
                completed_cards[0]
            );
        }
        else {
            container.appendChild(habit_card);
        }

        save_habits_array();
        update_progress();
    }

    return habit_card;
}
//2.
function add_task(value) {
    value = value.trim();
    if (value === "") return;
    const tasks = todays_tasks.querySelectorAll("span");
    const task_exists = [...tasks].some((task_span) =>
        task_span.textContent.trim().toUpperCase() === value.toUpperCase()
    );
    if (task_exists) {
        alert("The task already exists, try adding a different task");
        document.querySelector(".add-task input").value = "";
        return;
    }
    const task_card = new_card(value);
    document.querySelector(".add-task input").value = "";
    const container = document.querySelector(".todays-tasks");
    if (isLoading) {
        container.appendChild(task_card);
    }
    else {
        const completed_cards =
            container.querySelectorAll(".completed");

        if (completed_cards.length > 0) {
            container.insertBefore(
                task_card,
                completed_cards[0]
            );
        }
        else {
            container.appendChild(task_card);
        }
        save_tasks_array();
        update_progress();
    }


    return task_card;
}




// Checkboxes event listener
todays_habits.addEventListener("change", function (event) {
    update_progress();
    // todays_habits.querySelectorAll('input[type="checkbox"]').forEach((checkbox)=>{          
    if (event.target.checked) {
        const card = event.target.parentElement;
        let card_name = card.querySelector('span');
        const container = document.querySelector(".regular-habits");
        const habit_to_move = event.target.parentElement;
        //striking-through
        card_name.style.textDecoration = "line-through"
        card.className = "completed";
        if (completed_habits() <= 1) {
            // moving checked-habit to the end   
            container.appendChild(habit_to_move);
        }
        else {
            const to_move_above_it = container.querySelectorAll('.completed')[1];
            container.insertBefore(habit_to_move, to_move_above_it);

        }
    }
    else {
        const card = event.target.parentElement;
        let card_name = card.querySelector('span');
        const container = document.querySelector(".regular-habits");
        const habit_to_move = event.target.parentElement;
        //unstrinking-through       
        card_name.style.textDecoration = "none";
        card.className = "habit-card"
        //moving it to top
        const heading = todays_habits.querySelector('h2');
        // heading.after(habit_to_move)
        const to_move_above_it = container.querySelectorAll('.completed')[0];
        container.insertBefore(habit_to_move, to_move_above_it);

    }
    if (!isLoading) { save_habits_array(); };
    console.log(event.target);
})

//4.
// Checkboxes event listener for tasks
todays_tasks.addEventListener("change", function (event) {

    if (event.target.checked) {
        const card = event.target.parentElement;
        let card_name = card.querySelector('span');
        const container = document.querySelector(".todays-tasks");
        const task_to_move = event.target.parentElement;
        //striking-through
        console.log(card_name);
        card_name.style.textDecoration = "line-through"
        card.className = "completed";
        if (completed_tasks() <= 1) {
            // moving checked-habit to the end   
            container.appendChild(task_to_move);
        }
        else {
            const to_move_above_it = container.querySelectorAll('.completed')[1];
            container.insertBefore(task_to_move, to_move_above_it);

        }
    }
    else {
        const card = event.target.parentElement;
        let card_name = card.querySelector('span');
        const container = document.querySelector(".todays-tasks");
        const task_to_move = event.target.parentElement;
        //unstrinking-through       
        card_name.style.textDecoration = "none";
        card.className = "habit-card"
        //moving it to top
        const heading = todays_tasks.querySelector('h2');
        // heading.after(habit_to_move)
        const to_move_above_it = container.querySelectorAll('.completed')[0];
        container.insertBefore(task_to_move, to_move_above_it);
    }
    update_progress();
    if (!isLoading) { save_tasks_array(); };

})


todays_habits.addEventListener("click", (event) => {
    if (event.target.classList.contains("delete-btn")) {
        const card = event.target.parentElement;
        card.remove();
        update_progress();
        save_habits_array();
    }
})
todays_tasks.addEventListener("click", (event) => {
    if (event.target.classList.contains("delete-btn")) {
        const card = event.target.parentElement;
        card.remove();
        update_progress();
        save_tasks_array();
    }
})




//finding total habits
function total_habits() {
    let total_habits = todays_habits.querySelectorAll('input[type="checkbox"]').length;

    return total_habits;
}
//6.
function total_tasks() {
    let total_tasks = todays_tasks.querySelectorAll('input[type="checkbox"]').length;

    return total_tasks;
}


//finding completed habits
function completed_habits() {
    let completed_habits = 0;
    if (total_habits() != 0) {
        todays_habits.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
            if (checkbox.checked) {
                completed_habits++;
            }
        })
        return completed_habits;
    }
    else {
        return 0;
    }
}
//5.
function completed_tasks() {
    let completed_tasks = 0;
    if (total_tasks() != 0) {
        todays_tasks.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
            if (checkbox.checked) {
                completed_tasks++;
            }
        })
        return completed_tasks;
    }
    else {
        return 0;
    }


}

//finding calculated progress percentage
function calculate_progress() {
    if ((total_habits() + total_tasks()) === 0) {
        return 0;
    }
    let progress = (((completed_habits() + completed_tasks()) / ((total_habits() + total_tasks()))) * 100);
    return progress;
}


//LOCAL STORAGE THING

// create save habit function
function save_habits_array() {
    habits_Arr = [];
    for (let i = 0; i < total_habits(); i++) {
        habits_Arr.push(new habit_obj(i));
    }
    localStorage.setItem(
        "habits",
        JSON.stringify(habits_Arr)
    );
}
function save_tasks_array() {
    tasks_Arr = [];
    for (let i = 0; i < total_tasks(); i++) {
        tasks_Arr.push(new task_obj(i));
    }
    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks_Arr)
    );
}

document.getElementById("hero-date").textContent = `Today is ${todayStr}`;

// updating progress
function update_progress() {
    const fill = document.querySelector(".progress-fill");
    if (calculate_progress() === 100) {
        fill.classList.add("complete");
    } else {
        fill.classList.remove("complete");
    }
    const motiv = document.querySelector(".motivational");
    if (calculate_progress() === 0) {
        motiv.textContent = "Every master was once a beginner. Start.";
    } else if (calculate_progress() <= 25) {
        motiv.textContent = "The first step is always the hardest. Keep going.";
    } else if (calculate_progress() <= 50) {
        motiv.textContent = "Halfway there. Your future self is watching.";
    } else if (calculate_progress() <= 75) {
        motiv.textContent = "More done than left. Don't stop now.";
    } else if (calculate_progress() < 100) {
        motiv.textContent = "Almost. Finish what you started.";
    } else {
        motiv.textContent = "You showed up. That's everything.";
    }
    let progress = calculate_progress();
    let progress_percentage = progress + "%";
    progress_fill_style.width = progress_percentage;
    if (total_habits() + total_tasks() === 0) {
        document.getElementById("prog").innerHTML = `Add your first ritual to begin ✦`
    }
    else {
        document.getElementById("prog").innerHTML = `🎵 Your rhythm today - ${Math.round(calculate_progress())}%`
    }
    const hue = (progress / 100) * 120;
    progress_fill_style.backgroundColor = `hsl(${hue},70%,45%)`;
    if (total_tasks()) {
        document.querySelector(".task_prog").innerHTML = `${completed_tasks()} / ${total_tasks()}`
    }
    else {
        document.querySelector(".task_prog").innerHTML = `None yet`
    }
    if (total_habits()) {
        document.querySelector(".habit_prog").innerHTML = `${completed_habits()}/${total_habits()}`
    }
    else {
        document.querySelector(".habit_prog").innerHTML = `None yet`

    }


}

function edit_habit() {

}

const guideSteps = [
    {
        emoji: '🔥',
        title: 'Welcome!',
        desc: 'This site is built on one idea - <b/>small rituals, repeated faithfully, become the architecture of who you are.</b> Let me show you how it works.'
    },
    {
        emoji: '✦',
        title: 'Your rituals',
        desc: 'These are your <b>daily non-negotiables</b> - things worth doing every single day. Add them once and they live here permanently. <b>They reset every midnight</b>, ready to be kept again tomorrow.'
    },
    {
        emoji: '◈',
        title: 'Today\'s intentions',
        desc: 'These are your <b>one-day missions</b> - specific to today. The list <b>resets at midnight</b> so you always wake up to a clean slate.'
    },
    {
        emoji: '🎵',
        title: 'Your rhythm today',
        desc: 'One bar tracks everything - rituals and intentions combined. <b>Watch it shift from red to green</b> as your day takes shape.'
    }
];

let currentStep = 0;
function renderGuideStep() {
    const s = guideSteps[currentStep];
    document.getElementById('step-label').textContent = `Step ${currentStep + 1} of ${guideSteps.length}`;
    document.getElementById('step-title').textContent = s.title;
    document.getElementById('step-desc').innerHTML = s.desc;
    document.getElementById('step-emoji').textContent = s.emoji;

    const dotsE1 = document.getElementById('dots');
    dotsE1.innerHTML = guideSteps.map((_, i) =>
        `<div class="dot ${i === currentStep ? 'active' : ''}"></div>`
    ).join('');

    document.getElementById('btn-prev').style.display = currentStep === 0 ? 'none' : 'inline-block';
    document.getElementById('btn-next').textContent = currentStep === guideSteps.length - 1 ? 'Got it ✓' : 'Next →';
}

function openGuide() {
    currentStep = 0;
    renderGuideStep();
    document.getElementById('overlay').classList.add('active');
}

function closeGuide() {
    document.getElementById('overlay').classList.remove('active');
}

function nextStep() {
    if (currentStep < guideSteps.length - 1) { currentStep++; renderGuideStep(); }
    else closeGuide();
}

function prevStep() {
    if (currentStep > 0) { currentStep--; renderGuideStep(); }
}

function handleOverlayClick(event) {
    if (event.target === document.getElementById('overlay')) closeGuide();
}
function resetForNewDay() {

    // Clear tasks
    localStorage.removeItem("tasks");

    // Reset habits
    let habits = JSON.parse(localStorage.getItem("habits")) || [];

    habits.forEach(habit => {
        habit.habit_isChecked = false;
    });

    localStorage.setItem("habits", JSON.stringify(habits));
    localStorage.setItem("lastVisited", new Date().toDateString());

    // Update UI without reload
    document.querySelectorAll(".regular-habits input").forEach(cb => cb.checked = false);
    document.querySelectorAll(".regular-habits span").forEach(span => span.style.textDecoration = "none");
    document.querySelectorAll(".regular-habits .completed").forEach(card => card.className = "habit-card");

    document.querySelectorAll(".todays-tasks .habit-card, .todays-tasks .completed")
        .forEach(card => card.remove());

    update_progress();
    save_habits_array();
}

function scheduleMidnightReset() {
    const now = new Date();

    const nextMidnight = new Date();
    nextMidnight.setDate(nextMidnight.getDate() + 1);
    nextMidnight.setHours(0, 0, 0, 0);

    const msUntilMidnight = nextMidnight - now;

    setTimeout(() => {
        resetForNewDay();
        scheduleMidnightReset(); // Schedule next day
    }, msUntilMidnight);
}

scheduleMidnightReset();

