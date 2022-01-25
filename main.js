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

function getExerciseData() {
    const output = [];
    gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: '1hzA42BEzt2lPvOAePP6RLLRZKggbg0RWuxSaEwd5xLc',
        range: 'Learning!A1:F10',
    }).then(function (response) {
        //  console.log(response);
        // console.log(response.result.values);
        // for each question...
        const stringItem = ['a','b','c','d','e','f']
        response.result.values.forEach((currentQuestion, questionNumber) => {
                // variable to store the list of possible answers
                if (questionNumber > 0) {
                    const answers = [];
                    var object = Object.fromEntries(Object.entries(currentQuestion).map(([key, value]) => [response.result.values[0][key], value]));
                    console.log(object, questionNumber);
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
                            <div class="question"> ${object.question} </div>
                            <div class="answers"> ${answers.join("")} </div>
                          </div>`
                    );

                }

            }
        );
        // finally combine our output list into one string of HTML and put it on the page
        document.getElementById("quiz").innerHTML += output.join('');

    }, function (response) {
        console.log('Error: ' + response.result.error.message);
    });
}


setTimeout(function (){

    $(".nextStep").click(function () {
        showNextSlide();
    });

// Variables
    const resultsContainer = document.getElementById('results');
    const submitButton = document.getElementById('submit');
    // Show the first slide
    function toggleChoice(index) {
        slides[currentSlide].classList.remove('active-slide');
        slides[index].classList.add('active-slide');
        linkbar[index].classList.add('active');
        currentSlide = index;
    }
    function showNextSlide() {
        toggleChoice(currentSlide + 1);
    }
    const slides = document.querySelectorAll(".slide");
    const linkbar = document.querySelectorAll(".linkbar");
    let currentSlide = 0;
    toggleChoice(currentSlide);



    // Event listeners
   // submitButton.addEventListener('click', showResults);
},2000);





function myEvaluation(){
    // Variables
    // gather answer containers from our quiz
    const quizContainer = document.getElementById('quiz');
    const answerContainers = quizContainer.querySelectorAll('.answers');
    console.error(answerContainers,'okay boo');
    // keep track of user's answers
    let numCorrect = 0;
    gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: '1hzA42BEzt2lPvOAePP6RLLRZKggbg0RWuxSaEwd5xLc',
        range: 'Learning!A1:F10',
    }).then(function (response) {
        response.result.values.forEach((currentQuestion, questionNumber) => {
                // variable to store the list of possible answers
                if (questionNumber > 0) {
                    var  checkedRadio = document.querySelector(`input[name=question${questionNumber}]:checked`);
                    if(checkedRadio == null){
                        alert('Please choose an answer !!!');
                    }
                    const userAnswer =   checkedRadio.value;
                    // if answer is correct

                    if(userAnswer === currentQuestion[4]){
                        // add to the number of correct answers
                        numCorrect++;
                        console.error('yes');
                        // color the answers green
                        answerContainers[questionNumber].style.color = 'lightgreen';
                    }
                    // if answer is wrong or blank
                    else{
                        // color the answers red
                        console.error('no');
                        answerContainers[questionNumber].style.color = 'red';
                    }
                }
            }
        );

    }, function (response) {
        console.log('Error: ' + response.result.error.message);
    });

    // show number of correct answers out of total
    // resultsContainer.innerHTML = `${numCorrect} out of ${myQuestions.length}`;
}


