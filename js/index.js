const EventEmitters = function() {
    var events = {};

    this.subscribe = function(eventName, callback) {
        if (!events[eventName]) {
            events[eventName] = [];
        }

        events[eventName].push(callback);
    };

    this.dispatch = function(eventName, payload) {
        if (!events[eventName]) {
            throw new Error(`not event listener with name ${eventName}`);
            return;
        }

        events[eventName].forEach((callback) => {
            callback(payload);
        });
    }
}

const eventsHandler = new EventEmitters(); 

class Task {
    constructor(title, state=false, id=null) {
        this.id = id || Number(new Date()) + Math.floor(Math.random() * 100000);
        this.title = title;
        this.state = state;
    }

    checked() {
        return this.state ? 'checked' : '';
    }

    render() {
        const checkbox = $(`<input class="task-check-box" type="checkbox" name="check" id="${this.id}">`);
        const newcheckbox = $(`<section title=".newCheckbox"><section>`).html(() => {
            return $(`<div class="newCheckbox"> </div>`)
        .html(`<input type="checkbox" value="None" id="newCheckbox-${this.id}" name="check" ${this.checked()}/><label for="newCheckbox-${this.id}"></label>`);
        });
        const removeButton = $('<button class="btn btn-danger">&#10060;</button>');

        return $(`<div class="test flex justify-content-between"></div>`).html([
            newcheckbox.click(() => {
                eventsHandler.dispatch('changeTask', this);
                console.log(this);
            }),
            `<p>${this.title}</p>`,
            removeButton.click(() => {
                eventsHandler.dispatch('deleteTask', this.id);
            })
        ]);
    }
}



var tasks_array = JSON.parse(localStorage.getItem('task') || null) || [];
tasks_array = tasks_array.map(function(val) {
    return  new Task(val.title, val.state, val.id)
});

eventsHandler.subscribe('updateUI', function updateUI() {
    if (typeof(localStorage) !== "undefined") {  
        x = tasks_array.map(function(val) {
            return val.render();
        });
        $("#tasks").html(x);
    } else {
        document.getElementById("tasks").innerHTML = "Sorry, your browser does not support Web Storage...";
    }
    $("#test").val("");
});

eventsHandler.subscribe('addTask', function addTask (title, e) {
    if (title.length > 0) {
        
        var task_test = new Task(title);
        tasks_array.push(task_test);

        if (typeof(localStorage) !== "undefined") {
            localStorage.setItem("task", JSON.stringify(tasks_array));
            // document.getElementById("tasks").innerHTML = JSON.parse(localStorage.getItem("task"));
            $("#tasks").append(task_test.render());
        } else {
            document.getElementById("tasks").innerHTML = "Sorry, your browser does not support Web Storage...";
        }
        e.preventDefault();
        
        eventsHandler.dispatch('updateUI');
        
    }else {

    }
});

eventsHandler.subscribe('deleteTask', function deleteTask(id) {
    tasks_array = tasks_array.filter(function(val){
        return val.id !== id;
    });
    
    eventsHandler.dispatch('updateLocalStorage');
    eventsHandler.dispatch('updateUI');
});

eventsHandler.subscribe('changeTask', function changeTaskState(task) {
    console.group("State")
    console.log(task);
    task.state = !task.state;
    console.log(task);
    console.groupEnd();
    eventsHandler.dispatch('updateLocalStorage');
    eventsHandler.dispatch('updateUI');
});

eventsHandler.subscribe('updateLocalStorage', function updateLocalStorage() {
    localStorage.setItem("task", JSON.stringify(tasks_array));
});

document.getElementById('buttonAdd').onclick = function(e) {

    eventsHandler.dispatch('addTask', document.getElementById('test').value);
    
}

eventsHandler.dispatch('updateUI');