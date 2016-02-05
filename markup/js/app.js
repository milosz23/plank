//Initialization--------------------------------------------------
var poses = [
    {
        name:'basic',
        image:'basic.jpg',
        timer: 3
    },
    {
        name:'shoulder',
        image:'shoulder.jpg',
        timer: 5
    },
];
var containerEl = document.getElementById('container');

var intervalId = 0;
var poseIndex = 0;
var paused = false;
var timerEl = '#timer element init';

loadPage('templates/home.html', containerEl, initHomeTemplate);


//Render template to elem
function loadPage(url, elem, initTemplateFunction) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            elem.innerHTML = xhttp.responseText;
            initTemplateFunction();
        }
    };
    xhttp.open("GET", url, true);
    xhttp.send();
}


//Set background, timer text to show and 1second interval
function setTimer(poses, container, timerEl, startTime) {
    container.style.backgroundImage = "url('images/" + poses[poseIndex].image + "')";
    timerEl.innerText = poses[poseIndex].timer - startTime;

    var i = startTime;
    intervalId = setInterval(function(){
        i++;
        timerEl.innerText = poses[poseIndex].timer - i;

        if (i==poses[poseIndex].timer) {
            clearInterval(intervalId);
            poseIndex++;
            if (poseIndex<poses.length) {
                setTimer(poses, container, timerEl, 0);
            } else {
                loadPage('templates/done.html', containerEl, function(){});
            };
        };
    }, 1000);
}


//Init logic for home template
function initHomeTemplate(){
    var startButton = document.getElementById('startButton');
    startButton.addEventListener("click", function(){
        loadPage('templates/workout.html', containerEl, initWorkoutTemplate);
    });
}

//Init logic for workout template
function initWorkoutTemplate(){
    var pauseButton = document.getElementById('pause');
    var skipButton = document.getElementById('skip');
    var workoutEl = document.getElementById('workout');
    timerEl = document.getElementById('timer');
    setTimer(poses, workoutEl, timerEl, 0);

    //Pause button handling
    pauseButton.addEventListener("click", function(){
        paused = !paused;
        if (paused) {
            clearInterval(intervalId);
        } else if (poseIndex<poses.length) {
            setTimer(poses, workoutEl, timerEl, poses[poseIndex].timer - timerEl.innerText);
        };
    });

    //Skip button handling
    skipButton.addEventListener("click", function(){
        clearInterval(intervalId);
        poseIndex++;
        if (poseIndex<poses.length) {
            setTimer(poses, workoutEl, timerEl, 0);
        } else {
            timerEl.innerText = 0;
            loadPage('templates/done.html', containerEl, function(){});
        };
    });
}
