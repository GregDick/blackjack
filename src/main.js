var API_URL = "http://deckofcardsapi.com/api/shuffle/?deck_count=";
var DRAW_URL = "http://deckofcardsapi.com/api/draw/"


function newDecks(deck_count){
	var url = API_URL + deck_count;
	getJSON(url, function(data){
		var id = data.deck_id;
		drawCards(id, 1);
	});
}

function drawCards(deck_id, card_count){
	var url = DRAW_URL + deck_id + "/?count=" + card_count;
	getJSON(url, function(data){
		data.cards.forEach(function(card){
			console.log(card.suit);
			console.log(card.value);
		})
	})
}

newDecks(1);



function getJSON(url, cb) {
  JSONP_PROXY = 'http://crossorigin.me/'
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