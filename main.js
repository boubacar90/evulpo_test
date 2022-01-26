// this is a basic connection schema to the corresponding data for the table provided.
// this API KEY will expire after January 2022
// Written by GSoosalu & ndr3svt
const API_KEY = 'AIzaSyDQNwROozFi8edyHduP79ZLnoMS6rWLy8E';
const DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];
const SCOPES = "https://www.googleapis.com/auth/spreadsheets.readonly";
let exerciseIndex;
let exerciseData;
let options;
let states = [];
let correct_answer_index;
let chosen_answer_index;
let currentSlide;

// Variables
function handleClientLoad() {
    gapi.load('client', initClient);
}

function initClient() {
    gapi.client.init({
        apiKey: API_KEY,
        discoveryDocs: DISCOVERY_DOCS
    }).then(function () {
        getExerciseData();
    }, function (error) {
        console.log(JSON.stringify(error, null, 2));
    });
}

function shuffle(array) {
    let currentIndex = array.length, randomIndex;
    exerciseIndex = currentIndex - 1;
    // While there remain elements to shuffle...
    while (currentIndex != 0) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}


function getExerciseData() {

    const output = [];
    gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: '1hzA42BEzt2lPvOAePP6RLLRZKggbg0RWuxSaEwd5xLc',
        range: 'Learning!A1:F10',
    }).then(function (response) {
        //  console.log(response);
        // console.log(response.result.values);
        const stringItem = ['a', 'b', 'c', 'd', 'e', 'f'];
        let dataFilter = Object.values(response.result.values).filter(function (e) {
            return e[0] != 'topic';
        });
        exerciseData = shuffle(dataFilter);
        // for each question...
        exerciseData.forEach((currentQuestion, questionNumber) => {
                // variable to store the list of possible answers
                const answers = [];
                var object = Object.fromEntries(Object.entries(currentQuestion).map(([key, value]) => [response.result.values[0][key], value]));
                console.log(object);
                var answerOptions = object.answerOptions.split(";");
                Array.from(answerOptions);
                Object.assign([], answerOptions);
                // and for each available answer...
                answerOptions.forEach((item, index) => {
                    // ...add an HTML radio button
                    answers.push(
                        `<div class="custom-control custom-radio ">
                                    <input type="radio" class="custom-control-input" id="questionid${item}" name="question${questionNumber}"  value="${index}">
                                    <label class="custom-control-label" for="questionid${item}">   ${stringItem[index]} : ${item}</label>
                                </div>`
                    );

                })
                // add this question and its answers to the output
                output.push(
                    `<div class="slide">
                            <div class="text">Topic :  ${object.topic} </div>
                            <div class="question"> ${object.question} </div>
                            <div class="answers"> ${answers.join("")} </div>
                          </div>`
                );
            }
        );
        // finally combine our output list into one string of HTML and put it on the page
        document.getElementById("quiz").innerHTML = output.join('');

    }, function (response) {
        console.log('Error: ' + response.result.error.message);
    });
}

setTimeout(function () {

    $(".nextStep").click(function () {
        showNextSlide();
    });

    // Show the first slide
    function toggleChoice(index) {
        slides[currentSlide].classList.remove('active-slide');
        slides[index].classList.add('active-slide');
        linkbar[index].classList.add('active');
        currentSlide = index;
        if (exerciseIndex <= currentSlide) {
            document.querySelectorAll(".nextStep").forEach(a => a.style.display = "none");
        }

    }

    function showNextSlide() {
        toggleChoice(currentSlide + 1);
    }

    const slides = document.querySelectorAll(".slide");
    const linkbar = document.querySelectorAll(".linkbar");
    currentSlide = 0;
    toggleChoice(currentSlide);
}, 2000);

function myEvaluation() {
    // gather answer containers from our quiz
    const bar = document.querySelectorAll(".linkbar");
    // keep track of user's answers
    let numCorrect = 0;
    exerciseData.forEach((currentQuestion, questionNumber) => {
            // variable to store the list of possible answers
            var checkedRadio = document.querySelector(`input[name=question${questionNumber}]:checked`);
            // if answer is correct
            if (checkedRadio != null) {
                if (checkedRadio.value === currentQuestion[4]) {
                    // add to the number of correct answers
                    numCorrect += parseInt(currentQuestion[5]);
                    // console.error('yes');
                    document.getElementById("results").innerHTML = 'Score :' + numCorrect;
                    // color the answers green
                }
                // if answer is wrong or blank
                else {
                    // color the answers red
                    // console.error('no');
                    bar[questionNumber].classList.remove('active');
                    bar[questionNumber].classList.add('wrongAnswer');
                    document.getElementById("results").innerHTML = 'Not right';
                }

            }

        }
    );

    if (exerciseIndex <= currentSlide) {
        document.querySelectorAll(".randomQuestion").forEach(a => a.style.display = "inline-block");
        document.querySelectorAll(".evaluation-message").forEach(a => a.style.display = "inline-block");
        document.querySelectorAll(".evaluate").forEach(a => a.style.display = "none");
        document.getElementById("results").innerHTML = 'Score :' + numCorrect;
        document.getElementById("quiz").innerHTML = '';
        document.getElementById("question").innerHTML = '';
    }

}


