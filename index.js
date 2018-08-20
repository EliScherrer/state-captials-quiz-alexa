/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/

'use strict';
const Alexa = require('alexa-sdk');

//=========================================================================================================================================
// Global Data
//=========================================================================================================================================

const APP_ID = 'amzn1.ask.skill.f3656c04-186d-4ba6-b62f-294c2f1a9db8';

const flashcardsDictionary = [
  { state: "Alabama", capital: "Montgomery" },
  { state: "Alaska", capital: "Juneau"},
  { state: "Arizona", capital: "Phoenix"},
  { state: "Arkansas", capital: "Little Rock"},
  { state: "California", capital: "Sacramento"},
  { state: "Colorado", capital: "Denver"},
  { state: "Connecticut", capital: "Hartford"},
  { state: "Delaware", capital: "Dover"},
  { state: "Florida", capital: "Tallahassee"},
  { state: "Georgia", capital: "Atlanta"},
  { state: "Hawaii", capital: "Honolulu"},
  { state: "Idaho", capital: "Boise"},
  { state: "Illinois", capital: "Springfield"},
  { state: "Indiana", capital: "Indianapolis"},
  { state: "Iowa", capital: "Des Moines"},
  { state: "Kansas", capital: "Topeka"},
  { state: "Kentucky", capital: "Frankfort"},
  { state: "Louisiana", capital: "Baton Rouge"},
  { state: "Maine", capital: "Augusta"},
  { state: "Maryland", capital: "Annapolis"},
  { state: "Massachusetts", capital: "Boston"},
  { state: "Michigan", capital: "Lansing"},
  { state: "Minnesota", capital: "Saint Paul"},
  { state: "Mississippi", capital: "Jackson"},
  { state: "Missouri", capital: "Jefferson City"},
  { state: "Montana", capital: "Helena"},
  { state: "Nebraska", capital: "Lincoln"},
  { state: "Nevada", capital: "Carson City"},
  { state: "New Hampshire", capital: "Concord"},
  { state: "New Jersey", capital: "Trenton"},
  { state: "New Mexico", capital: "Santa Fe"},
  { state: "New York", capital: "Albany"},
  { state: "North Carolina", capital: "Raleigh"},
  { state: "North Dakota", capital: "Bismarck"},
  { state: "Ohio", capital: "Columbus"},
  { state: "Oklahoma", capital: "Oklahoma City"},
  { state: "Oregon", capital: "Salem"},
  { state: "Pennsylvania", capital: "Harrisburg"},
  { state: "Rhode Island", capital: "Providence"},
  { state: "South Carolina", capital: "Columbia"},
  { state: "South Dakota", capital: "Pierre"},
  { state: "Tennessee", capital: "Nashville"},
  { state: "Texas", capital: "Austin"},
  { state: "Utah", capital: "Salt Lake City"},
  { state: "Vermont", capital: "Montpelier"},
  { state: "Virginia", capital: "Richmond"},
  { state: "Washington", capital: "Olympia"},
  { state: "West Virginia", capital: "Charleston"},
  { state: "Wisconsin", capital: "Madison"},
  { state: "Wyoming", capital: "Cheyenne" }
];

var DECK_LENGTH = flashcardsDictionary.length;

const SKILL_NAME = 'State Capitals Quiz';
const HELP_MESSAGE = 'You can say... fuck, ask the dev what to say'; // TODO
const HELP_REPROMPT = 'What can I help you with?';
const STOP_MESSAGE = 'Peace out my dude!';

//=========================================================================================================================================
// Do logic here
//=========================================================================================================================================

var handlers = {

  // Open Codecademy Flashcards
  'LaunchRequest': function() {
    //new user
    if (Object.keys(this.attributes).length === 0) {
      this.attributes = {
        'numberCorrect': 0,
        'currentFlashcardIndex': 0
      };
      this.response.speak().listen(AskQuestion);
    }
    else {
      var currentIndex = this.attributes.currentFlashcardIndex;
      var numberCorrect = this.attributes.numberCorrect;
      this.response
        .speak('Welcome back to Flashcards. You are on question' + currentIndex + 
              'and have answered' + numberCorrect + ' correctly.' +
              'the next question is... ' + AskQuestion(this.attributes))
        .listen(AskQuestion(this.attributes));
    }
  },

  // User gives an answer
  'AnswerIntent': function() {
    var currentFlashcardIndex = this.attributes.currentFlashcardIndex;
    var currentState = flashcardsDictionary[currentFlashcardIndex]['state'];
    var userAnswer = this.event.request.intent.slots.answer.value;
    var correctAnswer = flashcardsDictionary[currentFlashcardIndex]['capital'];

    // user is correct
    if (userAnswer === correctAnswer) {
      this.attributes.currentFlashcardIndex++;
      this.attributes.numberCorrect++;
      this.response
        .speak("Great Job! Next question... " + AskQuestion(this.attributes))
        .listen(AskQuestion(this.attributes));
    }
    //user is wrong
    else {
      this.attributes.currentFlashcardIndex++;
      this.response
        .speak("Ohhh, sorry, the capital of " + currentState + " is " + correctAnswer +
          '. The next question is... ' + AskQuestion(this.attributes)) 
        .listen(AskQuestion(this.attributes));
    }
    
    this.emit(':responseReady');
  },

  // Stop
  'AMAZON.StopIntent': function() {
      this.response.speak('Ok, let\'s play again soon.');
      this.emit(':responseReady');
  },

  // Cancel
  'AMAZON.CancelIntent': function() {
      this.response.speak('Ok, let\'s play again soon.');
      this.emit(':responseReady');
  },

  // Save state
  'SessionEndedRequest': function() {
    console.log('session ended!');
    this.emit(':saveState', true);
  }

};

var AskQuestion = function(attributes) {
    var currentFlashcardIndex = attributes.currentFlashcardIndex;
    var currentState = flashcardsDictionary[currentFlashcardIndex].state;

    return 'What is the capital of ' + currentState + '?';
};

exports.handler = function(event, context, callback){
    var alexa = Alexa.handler(event, context, callback);
    alexa.APP_ID = APP_ID;
    alexa.dynamoDBTableName = 'StateCapitalsQuiz';
    alexa.registerHandlers(handlers);
    alexa.execute();
};
