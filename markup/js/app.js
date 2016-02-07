myApp = {
    poses: [
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
    ],
    appContainer: document.getElementById('container'),
    intervalId: 0,
    poseIndex: 0,
    paused: false,
    timerContainer: '#timer element init',

    //Render template to elem
    loadPage: function(url, elem, func, funcContext) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (xhttp.readyState == 4 && xhttp.status == 200) {
                elem.innerHTML = xhttp.responseText;
                func.call(funcContext);
            }
        };
        xhttp.open("GET", url, true);
        xhttp.send();
    }
};

var homeScreen = {
    startButton: '',
    //Init logic for home template
    initHomeTemplate: function(){
        this.startButton = document.getElementById('startButton');
        this.startButton.addEventListener("click", function(){
            myApp.loadPage('templates/workout.html', myApp.appContainer, 
                workoutScreen.initWorkoutTemplate, workoutScreen);
        });
    }
};

var workoutScreen = {
    workoutContainer: '#workout element init',
    pauseButton: '#pause element init',
    skipButton: '#skip element init',
    //Set background, timer text to show and 1second interval
    setTimer: function (poses, startTime) {
        var self = this;//set for using in setinterval
        self.workoutContainer.style.backgroundImage = "url('images/" + myApp.poses[myApp.poseIndex].image + "')";
        myApp.timerContainer.innerText = myApp.poses[myApp.poseIndex].timer - startTime;

        var i = startTime;
        myApp.intervalId = setInterval(function(){
            i++;
            myApp.timerContainer.innerText = myApp.poses[myApp.poseIndex].timer - i;

            if (i==myApp.poses[myApp.poseIndex].timer) {
                clearInterval(myApp.intervalId);
                myApp.poseIndex++;
                if (myApp.poseIndex<myApp.poses.length) {
                    self.setTimer(myApp.poses, container, 0);
                } else {
                    myApp.loadPage('templates/done.html', myApp.appContainer, function(){});
                };
            };
        }, 1000);
    },
    //Init logic for workout template
    initWorkoutTemplate: function(){
        var self = this;//set for using in addeventlistener
        self.pauseButton = document.getElementById('pause');
        self.skipButton = document.getElementById('skip');
        self.workoutContainer = document.getElementById('workout');
        myApp.timerContainer = document.getElementById('timer');
        self.setTimer(myApp.poses, 0);

        //Pause button handling
        self.pauseButton.addEventListener("click", function(){
            console.log('pause');
            myApp.paused = !myApp.paused;
            if (myApp.paused) {
                clearInterval(myApp.intervalId);
            } else if (myApp.poseIndex<myApp.poses.length) {
                self.setTimer(myApp.poses, myApp.poses[myApp.poseIndex].timer - myApp.timerContainer.innerText);
            };
        });

        //Skip button handling
        self.skipButton.addEventListener("click", function(){
            clearInterval(myApp.intervalId);
            myApp.poseIndex++;
            if (myApp.poseIndex<myApp.poses.length) {
                myApp.paused = false;
                self.setTimer(myApp.poses, 0);
            } else {
                myApp.timerContainer.innerText = 0;
                myApp.loadPage('templates/done.html', myApp.appContainer, function(){});
            };
        });
    }
};


myApp.loadPage('templates/home.html', myApp.appContainer, homeScreen.initHomeTemplate, homeScreen);