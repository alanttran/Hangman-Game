$( document ).ready(function() {
    console.log( "ready!" ); //ready check

    // current set of words for the game
    var wordArray = ["monitor", "program", "application", "keyboard", "javascript", "gaming", "network", "hamburger", "sandwich", "steak", "chicken"];

    var currentWordPosition = 0;

    // current word
    var currentWord = wordArray[currentWordPosition];

    // current word letter array
    var currentWordLetters = [];

    // user key press
    var userKeyPress;

    // letters that don't match
    var nonMatchingLetters = [];

    // matching letters
    var matchingLetters = [];
    var usedLetters = []; 
    var guesses = 10;
    var wins = 0;
    var blanksRemaining = null;
    var playerWinOrLose = false;

    wordArray = shuffle(wordArray);
    initialWordBlanks();
    

    // Record keypress using keyup event and assigns it to 
    // userKeyPress variable
    $('body').on('keyup', function(e){
    	//logs key to check

    	// if player still has guesses and has not won or lost
    	// this is to ignore keys press after winning/losing
        if(guesses > 0 && !playerWinOrLose){
            log(e.key);
            userKeyPress = e.key;

            var usedLetterMatch = false;        

            $.each(usedLetters, function(i, val){

                if(userKeyPress === val){
                    usedLetterMatch = true;
                }
            });

            if(usedLetterMatch){
                $('.js-already-used-warning').html(userKeyPress + " is already used!");
            }
            else{
                $('.js-already-used-warning').html("");

                var matchingPositions = compare(userKeyPress, currentWord);

                // if array returned has length (has matching positions) - update the current word
                if(matchingPositions.length > 0){
                    updateWordLetters(currentWordLetters, userKeyPress, matchingPositions )
                }

                updateUsedWords();

                updateGuesses();
            }

              // checks to see if the player has won or lost yet
            winOrLose();    
        }
        
    });

    $('#newGame').on('click', function(){
        reset();
    });


    /**
	 * Updates used words in the HTML
	 */
    function updateUsedWords(){
    	$('.js-used-words').html("");

        $.each(usedLetters, function(i, val){
			$('.js-used-words').append(val + " ");
    	});
    } 

    /**
	 * Updates guesses in the HTML
	 */
    function updateGuesses(){
    	$('.js-remaining-guesses').html(guesses);
    }    

    /**
	 * Updates the underscores with matching letters and writes in HTML
	 * @param {Array}  currentWordLetters - current word letter array
	 * @param {String} keypress - player key press
	 * @param {Array}  matchingPositions - position(s) of matching letter
	 */
    function updateWordLetters(currentWordLetters, keypress, matchingPositions ){
    	
    	blanksRemaining = 0;

    	// resets innerHTML
    	$('.js-current-word').html("");    	
    	
    	// goes though matching positions array updates 
    	// currentWordLetters array with updated letters
    	$.each(matchingPositions, function(i, val){
    		currentWordLetters[val] = keypress;
        });

    	// updates HTML with new letters
        $.each(currentWordLetters, function(i, val){
    		$('.js-current-word').append(val + " ");

    		if(val === "_"){
    			blanksRemaining++;
    		}
        });

         
    }    

    /**
	 * Compares user keypress to each letter in current word
	 * @param {String} key press from player
	 * @param {String} current word in the game
	 * @return {Array} matching letter positions array
	 */
    function compare(keyPress, currentWord){

    	log('compare function!');

    	var matchingLetterPosition = [];

    	// loops through each letter of currentWord
    	for (var i = 0, len = currentWord.length; i < len; i++) {
		  
		  // if match, add to matchingLetterPosition array
		  if(keyPress === currentWord[i]){
		  	log(keyPress + ' match!');
		  	matchingLetterPosition.push(i);
		  }
		}

		// if matchingLetterPosition array has no length (no match)
		//    push keypress letter to nonMatchingLetters array
		// else push keypress to matching letter array
		if(matchingLetterPosition.length === 0){
			nonMatchingLetters.push(keyPress);
			guesses--;
		}
		else{
			matchingLetters.push(keyPress);
		}

		usedLetters = nonMatchingLetters.concat(matchingLetters);
        usedLetters.sort();

		// return array
		return matchingLetterPosition;
    }

    /**
	 * sets initial blank underscores in HTML
	 */

    function initialWordBlanks(){

    	
    	$('.js-current-word').html("");

    	// loops through each letter in the current word
	    // and pushes blanks to the array
	    for(var i = 0; i < currentWord.length; i++){
	    	currentWordLetters.push('_');
	    }
	    // initiates the first set of blank underscores in the HTML
	    $.each(currentWordLetters, function(i, val){
	    	$('.js-current-word').append(val + " ");
	    });
    }


    // shuffles the array upon start
    function shuffle(array) {

    	console.log('shuffle!');
	  var currentIndex = array.length, temporaryValue, randomIndex;

	  // While there remain elements to shuffle...
	  while (0 !== currentIndex) {

	    // Pick a remaining element...
	    randomIndex = Math.floor(Math.random() * currentIndex);
	    currentIndex -= 1;

	    // And swap it with the current element.
	    temporaryValue = array[currentIndex];
	    array[currentIndex] = array[randomIndex];
	    array[randomIndex] = temporaryValue;
	  }

	  return array;
	}


    /**
	 * checks to see if the player has won or lost
	 * to win, the blank spaces in the word array has to be 0
	 * to lose the guesses are down to 0
	 */
    function winOrLose(){
    	if(blanksRemaining === 0){
        	$('.js-win-or-lose').html("You Won! :)");
        	$('.modal-body').html("The word is " + "<b>" + currentWord + "</b>").append("<img src='http://www.clipartbest.com/cliparts/9c4/oEr/9c4oErjyi.png' alt='hangman'>");
        	$('#myModal').modal('show');
        	wins++;
        	$('.js-win-counter').html(wins);
            playerWinOrLose = true;
        }

        if(guesses === 0){
        	$('#myModal').modal('show');
        	$('.js-win-or-lose').html("You Lose :(" );
        	$('.modal-body').html("The word was " + "<b>" + currentWord + "</b>").append("<img src='http://static.fjcdn.com/pictures/Hangman+family+http+2fun2quitcom_3675ce_3604407.jpg' alt='hangman'>");
            playerWinOrLose = true;
        }
        
    }

    
    /**
	 * resets the game with a new word
	 */
    function reset(){
    	nonMatchingLetters = [];
	    // matching letters
	    matchingLetters = [];
	    usedLetters = []; 
	    guesses = 10;
	    currentWordPosition++;
	    currentWord = wordArray[currentWordPosition];
	    currentWordLetters = [];
        playerWinOrLose = false;
        blanksRemaining = null;

	    initialWordBlanks();

	    updateUsedWords();

	    updateGuesses();

	    $('.js-win-or-lose').html("");
	    $('.js-already-used-warning ').html("");

	    log('currentWordPosition = ' + currentWordPosition);
    }


    //console.log function for convenience
    function log(a){
    	console.log(a);
    }

});