# evulpo_test
Single Choice Exercise Viewer

# Run the projet server
http-server -p 8000 
http://127.0.0.1:8000

The code in this article uses modern JavaScript syntax (ES6+),

# The Basic Structure
To set up the structure of our JavaScript quiz, we’ll need to start with the following HTML:

       <p id="question" class="question"> Which is the correct option? </p>
        <div class="quiz-container">
            <div id="quiz"></div>
        </div>

Next, we need to add a div element with class
slide to hold the question and answer on the main.js:

    output.push(
        `<div class="slide">
                <div class="text">Topic :  ${object.topic} </div>
                <div class="question"> ${object.question} </div>
                <div class="answers"> ${answers.join("")} </div>
              </div>`
    );


Next, we can use some CSS positioning to make the slides sit as layers on top of one another.
In this example, you’ll notice we’re using z-indexes and opacity transitions to allow our slides to fade in and out.
Here’s what that CSS might look like:

      .slide{
        position: absolute;
        left: 0px;
        top: 0px;
        width: 100%;
        z-index: 1;
        opacity: 0;
        transition: opacity 0.5s;
      }
     .active-slide{
        opacity: 1;
        z-index: 2;
     }


# Screens test
![img_2.png](img_2.png)



![img_6.png](img_6.png)
