var API_URL = "http://deckofcardsapi.com/api/shuffle/?deck_count=";
var DRAW_URL = "http://deckofcardsapi.com/api/draw/";
var deck_id;

var $newGame = $(".new-game");
var $dealer = $(".dealer div");
var $player = $(".player div");
var $dealerHit = $(".dealer-hit");
var $playerHit = $(".player-hit");

var num = 0;
var dealerScore = 0;
var playerScore = 0;


$newGame.on('click', function(){
	newDecks(6);
})

$dealerHit.on('click', function(){
	drawCards(1, $dealer);
})

$playerHit.on('click', function(){
	drawCards(1, $player);
})


//creates new decks
function newDecks(deck_count){
	 var link = API_URL + deck_count;
	getJSON(link, function(data){
		$dealer.empty();
		$player.empty();
		deck_id = data.deck_id;
	});
}


//draws cards from deck
function drawCards(card_count, who){
	 var address = DRAW_URL + deck_id + "/?count=" + card_count;
	getJSON(address, function(data){
		data.cards.forEach(function(card){
			addHand(who, card);
			sum(who, card);
			console.log(dealerScore);
			console.log(playerScore);
			check();
		})
	})
}


//appends cards to player or dealer hand
function addHand(who, card){
var $target = $(who);
$target.append("<img src="+ card.image +"></img>");
}


function sum(who, card){
	switch(card.value.length){
		case 4: num = 10;
		break;
		case 3: num = 11;
		break;
		default: num = parseInt(card.value);
	}
	if(who === $dealer){
		dealerScore += num;
	}else{
		playerScore += num;
	}
}

function check(){
	if(dealerScore > 21){
		alert("Dealer bust... Players wins!");
	} else if(dealerScore === 21){
		alert("dealer wins");
	} else{}

	if(playerScore > 21){
		alert("player bust");
	} else if(playerScore === 21){
		alert("player wins");
	} else{}
}


function getJSON(url, cb) {
	JSONP_PROXY = 'https://jsonp.afeld.me/?url='
	 // THIS WILL ADD THE CROSS ORIGIN HEADERS
	 
	var request = new XMLHttpRequest();
	 
	request.open('GET', JSONP_PROXY + url);

	request.onload = function() {
	  if (request.status >= 200 && request.status < 400) {
	    cb(JSON.parse(request.responseText));
	  } 
	};

   request.send();
}