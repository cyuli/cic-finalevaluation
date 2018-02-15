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
    render() {
        const checkbox = $(`<input class="task-check-box" type="checkbox" name="task" id="${this.id}">`);
        const removeButton = $('<button>&#10060;</button>');
        checkbox.prop('checked', this.state);
        
        return $(`<div class="test flex justify-content-start"></div>`).html([
            checkbox.click(() => {
                eventsHandler.dispatch('changeTask', this);
            }),
            this.title,
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
// var id = 0;
// var n = 0;

eventsHandler.subscribe('updateUI', function updateUI() {
    if (typeof(localStorage) !== "undefined") {  
        x = tasks_array.map(function(val) {
            return val.render();
        });
        $("#tasks").html(x);
        $("#test").val("");
    } else {
        document.getElementById("tasks").innerHTML = "Sorry, your browser does not support Web Storage...";
    }
});

eventsHandler.subscribe('addTask', function addTask (title) {
    if (title.length > 0) {

        var task_test = new Task(title); // {id: 0, content: "", state: null };
        // console.log(taskvalue);
        // localStorage.removeItem('id_max', n);
        // localStorage.setItem('id_max', n);
        
        // p = document.createElement("p");
        // p.innerHTML = taskvalue + "<br />";
        // p = '<p class="test col-10">'+taskvalue+'</p>';
        // let n = (localStorage.getItem('id_max') || 0) + 1;
        
        
        
        
        // document.getElementById('tasks').appendChild(p);
        //// task_test.id = (parseInt(localStorage.getItem('id_max'), 10) || 0) + 1;
        //// input = '<label class="test flex justify-content-start">' 
        //// + '<input class="task-check-box" type="checkbox" name="task" id='+ task_test.id.toString() 
        //// + 'onclick="eventsHandler.dispatch(\'changeTask\', { id: task_test.id });"> ' + taskvalue + '<button onclick="deleteTask('+ task_test.id +');"> X </button>' +'</label>';
        //// task_test.content = input;
        // n+=1;
        tasks_array.push(task_test);
        //// localStorage.setItem('id_max', task_test.id);
        // $(document).ready(function() {
            //     $(".tasks-box").append();
            // });
            
            
        if (typeof(localStorage) !== "undefined") {
            localStorage.setItem("task", JSON.stringify(tasks_array));
            // document.getElementById("tasks").innerHTML = JSON.parse(localStorage.getItem("task"));
            $("#tasks").append(task_test.render());
        } else {
            document.getElementById("tasks").innerHTML = "Sorry, your browser does not support Web Storage...";
        }
        
        eventsHandler.dispatch('updateUI');
    }
});

eventsHandler.subscribe('deleteTask', function deleteTask(id) {
    tasks_array = tasks_array.filter(function(val){
        return val.id !== id;
    });
    // localStorage.removeItem("task", JSON.stringify(tasks_array));
    // localStorage.setItem("task", JSON.stringify(tasks_array));
    
    eventsHandler.dispatch('updateLocalStorage');
    eventsHandler.dispatch('updateUI');
    // console.log(this);
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
    e.preventDefault();
    eventsHandler.dispatch('addTask', document.getElementById('test').value);
}

eventsHandler.dispatch('updateUI');