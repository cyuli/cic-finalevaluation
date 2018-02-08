var tasks_array = []


function addTaskClear() {
    document.getElementById('test').innerText = "";
}


function addTask () {
    taskvalue = document.getElementById('test').value;

    console.log(taskvalue);

    // p = document.createElement("p");
    // p.innerHTML = taskvalue + "<br />";
    // p = '<p class="test col-10">'+taskvalue+'</p>';
    input = '<label class="test flex justify-content-start">'+ '<input type="checkbox" name="task" onclick="changeTaskState"> ' + taskvalue + '</label>';
    // document.getElementById('tasks').appendChild(p);

    tasks_array.push(input);
    console.log(tasks_array.length);

    // $(document).ready(function() {
    //     $(".tasks-box").append();
    // });

    if (typeof(Storage) !== "undefined") {

        localStorage.setItem("task", JSON.stringify(tasks_array));
        // document.getElementById("tasks").innerHTML = JSON.parse(localStorage.getItem("task"));
        $("#tasks").append(input);
    } else {
        document.getElementById("tasks").innerHTML = "Sorry, your browser does not support Web Storage...";
    }
}