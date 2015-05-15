var API_URL = "http://deckofcardsapi.com/api/shuffle/?deck_count=";
var DRAW_URL = "http://deckofcardsapi.com/api/draw/"


newDecks(6);


//creates new decks
function newDecks(deck_count){
	var url = API_URL + deck_count;
	getJSON(url, function(data){
		var id = data.deck_id;
		drawCards(id, 2, ".dealer");
		drawCards(id, 2, ".player");
	});
}


//draws cards from deck
function drawCards(deck_id, card_count, who){
	var url = DRAW_URL + deck_id + "/?count=" + card_count;
	getJSON(url, function(data){
		data.cards.forEach(function(card){
			addHand(who, card);
		})
	})
}


//appends cards to player or dealer hand
function addHand(who, card){
var $target = $(who);
$target.append("<img src="+ card.image +"></img>");
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