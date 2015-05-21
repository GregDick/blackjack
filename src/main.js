var API_URL  = "http://deckofcardsapi.com/api/shuffle/?deck_count=";
var DRAW_URL = "http://deckofcardsapi.com/api/draw/";
var back     = "http://fc09.deviantart.net/fs71/f/2010/128/8/4/84e41dc8cec4d2f388ca9c1a96d4de46.jpg";
var deck_id;

var $newGame = $(".new-game");
var $dealButton = $(".deal");
var $dealerCardArea  = $(".dealer div");
var $playerCardArea  = $(".player div");
var $betArea = $(".bet");
var $betButtons = $(".bet-buttons");


var dealerScore = [];
var playerScore = [];
var dealerStay = false;
var playerStay = false;
var $hit = $(".hit");
var $stay = $(".stay");
var $dealerScoreBoard = $(".dealer span");
var $playerScoreBoard = $(".player span");
var num = 0;

var cash = 500;
var bet = 0;

// --------on page load-----------
hideStuff();


/*------functions for button clicks------*/

$newGame.on('click', function(){
	newDecks(6);
	resetGame();
  showStuff();
  checkCash();
  $hit.attr("disabled", "disabled");
  $stay.attr("disabled", "disabled");
});

$dealButton.on('click', function(){
	drawCards(1, "dealer", wat);
	drawCards(1, "dealer", wat);
	drawCards(2, "player", check);
	$dealButton.attr("disabled", "disabled");
  $betButtons.attr("disabled", "disabled");
  $hit.removeAttr("disabled");
  $stay.removeAttr("disabled");
});

$hit.on('click', function(){
	drawCards(1, "player", check);
});

$stay.on('click', function(){
	playerStay = true;
	$hiddenCard.attr("src", replace);
	autoDealer();
});

$(".plus-hundred").on('click', function(){
  bet = bet<cash ? bet+100 : bet
})

$(".plus-ten").on('click', function(){
  bet = bet<cash ? bet+10 : bet
})

$(".plus-five").on('click', function(){
  bet = bet<cash ? bet+5 : bet
})

$(".clear-bet").on('click', function(){
  bet = 0;
})

$betButtons.click(function(){
  addBetToPage();
})


// ---------under the hood-----------

//hides stuff
function hideStuff(){
  $(".dealer").hide();
  $(".player").hide();
  $betArea.hide();
}

//shows stuff
function showStuff(){
  $(".dealer").show();
  $(".player").show();
  $betArea.show();
  addBetToPage();
}

//automates dealer play
function autoDealer(){
	if(_.sum(dealerScore) < 17) {
		drawCards(1, "dealer", autoDealer);
	} else{
	dealerStay = true;
	check();
	}
}

//literally does nothing cause javascript is weird
function wat(){}

//resets game variables
function resetGame(){
	$dealButton.removeAttr("disabled");
  $(".bet button").removeAttr("disabled");
  $hit.removeAttr("disabled");
  $stay.removeAttr("disabled");
	$(".head div").remove();
	$dealerCardArea.empty();
	dealerScore.length = 0;
	dealerStay = false;
	addScore("dealer");
	$dealerScoreBoard.hide();
	$playerCardArea.empty();
	playerScore.length = 0;
	playerStay = false;
	addScore("player");
	$playerScoreBoard.hide();
  bet = 0;
}

//creates new decks
function newDecks(deck_count){
	 var link = API_URL + deck_count;
	getJSON(link, function(data){
		deck_id = data.deck_id;
	});
}


//draws cards from deck
function drawCards(card_count, who, callback){
	var address = DRAW_URL + deck_id + "/?count=" + card_count;
	getJSON(address, function(data){
		data.cards.forEach(function(card){
			addHand(who, card);
			sum(who, card);
			addScore(who);
		});
		callback();
	});
}


//appends cards to player or dealer hand
function addHand(who, card){
	var $target = $("." + who + " div");
	var card = card.image==="http://deckofcardsapi.com/static/img/AD.png" ? "/img/aceDiamond.png" : card.image
	if(who==="dealer" && dealerScore.length===0){
		$target.append("<img src="+ back +"></img>");
		replace = card
	}
	else{
		$target.append("<img src="+ card +"></img>");
	}
	$hiddenCard = $(".dealer .card-space img:first");
}

//calculates dealer and player score
function sum(who, card){
	switch(card.value.length){
		case 5:
		case 4: num = 10;
		break;
		case 3: num = 11;
		break;
		default: num = parseInt(card.value);
	}
	if(who === "dealer"){
		dealerScore.push(num);
	}else{
		playerScore.push(num);
	}
}


//appends score to page
function addScore(who){
	var $scoreBoard = $("."+ who +" span");
	var score = who === "dealer" ? _.sum(dealerScore) : _.sum(playerScore);
	$scoreBoard.html(score);
	if(score > 21){
		color = "text-danger";
	}else if(score===21){
		color = "text-success";
	}else{
		color = "";
	}
	$scoreBoard.attr("class", color);
}

//checks to see if someone wins or busts
function check(){
	var $target = $(".head");
	var sumDealer = _.sum(dealerScore);
	var sumPlayer = _.sum(playerScore);
	if(sumDealer > 21){
		//check for ace and convert to 1 if ace is present
		var where = dealerScore.indexOf(11);
		if(where === -1){
			$target.append("<div class='h1'>Dealer bust... Player wins! +$"+ bet +"</div>");
			reveal();
      cash += bet;
		}else{
			dealerScore.splice(where, 1, 1);
 			addScore("dealer");
 			autoDealer();
		}
	} else if(sumPlayer > 21){
		//check for ace and convert to 1 if ace is present
		var where = playerScore.indexOf(11);
		if(where === -1){
			$target.append("<div class='h1'>Player bust... Dealer wins! -$"+ bet +"</div>");
			reveal();
      cash -= bet;
		}else{
			playerScore.splice(where, 1, 1);
 			addScore("player");
		}
	} else if(playerScore.length === 5){
    $target.append("<div class='h1'>FIVE CARD CHARLIE! Player wins! +$"+ bet +"</div>");
    reveal();
    cash += bet;
  } else if(sumDealer===21 && sumPlayer===21){
		//add function to check to see who has the realest blackjack
		$target.append("<div class='h1'>BLACKJACK tie! Dealer wins! Bet is pushed.</div>");
		reveal();
	} else if(sumPlayer===21){
		$target.append("<div class='h1'>BLACKJACK! Player wins! +$"+ bet +"</div>");
		reveal();
    cash += bet;
	} else if(sumDealer===21 && playerStay===true){
		$target.append("<div class='h1'>BLACKJACK! Dealer wins! -$"+ bet +"</div>");
		reveal();
    cash -= bet;
	} else if(dealerStay===true && playerStay===true){
		var winner = sumDealer >= sumPlayer ? "Dealer" : "Player";
    cash = sumDealer >= sumPlayer ? cash-bet : cash+bet;
    plusMinus = sumDealer >= sumPlayer ? "-" : "+";
 		$target.append("<div class='h1'>Both players stay... " + winner + " wins! "+ plusMinus +"$"+ bet +"</div>");
 		reveal();
	} else if(dealerScore.length === 5){
    $target.append("<div class='h1'>FIVE CARD CHARLIE! Dealer wins! -$"+ bet +"</div>");
    reveal();
    cash -= bet;
  } else{}
}

//shows dealers card and score and disables hit/stay buttons
function reveal(){
  $dealerScoreBoard.show();
  $playerScoreBoard.show();
  $hiddenCard.attr("src", replace);
  $hit.attr("disabled", "disabled");
  $stay.attr("disabled", "disabled");
}

//adds bet to page
function addBetToPage(){
  var $cashSpace = $(".cash-space");
  var $currentBetSpace = $(".current-bet-space");
  $cashSpace.text("$"+cash);
  $currentBetSpace.text("$"+bet);
}

//check cash
function checkCash(){
  var $target = $(".head");
  if(cash===0){
    $target.append("<div class='h1'>You have no money! Go home!</div>");
  }
}

function getJSON(url, cb) {
	JSONP_PROXY = 'https://jsonp.afeld.me/?url=';
	 // THIS WILL ADD THE CROSS ORIGIN HEADERS
	var request = new XMLHttpRequest();

	request.open('GET', JSONP_PROXY + url);

	request.onload = function() {
	  if (request.status >= 200 && request.status < 400) {
	    cb(JSON.parse(request.responseText));
	  }else{console.log("fail");}
	};

   request.send();
}
