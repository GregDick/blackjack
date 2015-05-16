var API_URL = "http://deckofcardsapi.com/api/shuffle/?deck_count=";
var DRAW_URL = "http://deckofcardsapi.com/api/draw/";
var back = "http://fc09.deviantart.net/fs71/f/2010/128/8/4/84e41dc8cec4d2f388ca9c1a96d4de46.jpg";
var deck_id;

var $newGame = $(".new-game");
var $dealer = $(".dealer div");
var $player = $(".player div");

var dealerScore = [];
var playerScore = [];
var dealerStay = false;
var playerStay = false;
var $dealerScoreBoard = $(".dealer span");
var num = 0;


$newGame.on('click', function(){
	newDecks(6);
	$(".deal").removeAttr("disabled");
});

$(".deal").on('click', function(){
	drawCards(1, "dealer");
	drawCards(1, "dealer");
	drawCards(2, "player");
});

$(".dealer-hit").on('click', function(){
	drawCards(1, "dealer");
});

$(".player-hit").on('click', function(){
	drawCards(1, "player");
});

$(".dealer-stay").on('click', function(){
	dealerStay = true;
	check("dealer");
});

$(".player-stay").on('click', function(){
	playerStay = true;
	$dealerScoreBoard.show();
	var $hiddenCard = $(".dealer .card-space img:first");
	$hiddenCard.attr("src", replace);
	check("player");
});


//creates new decks
function newDecks(deck_count){
	 var link = API_URL + deck_count;
	getJSON(link, function(data){
		$(".head div").remove();
		$dealer.empty();
		dealerScore.length = 0;
		dealerStay = false;
		addScore("dealer");
		$dealerScoreBoard.hide();
		$player.empty();
		playerScore.length = 0;
		playerStay = false;
		addScore("player");
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
			addScore(who);
			check(who);
		});
	});
}


//appends cards to player or dealer hand
function addHand(who, card){
	var $target = $("." + who + " div");
	if(who==="dealer" && dealerScore.length===0){
		$target.append("<img src="+ back +"></img>");
		replace = card.image;
	}
	else{
		var card = card.image==="http://deckofcardsapi.com/static/img/AD.png" ? "/img/aceDiamond.png" : card.image
		$target.append("<img src="+ card +"></img>");
	}
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
}

//checks to see if someone wins or busts
function check(who){
	var $target = $(".head");
	var score = who === "dealer" ? dealerScore : playerScore;
	var other = who === "dealer" ? "player" : "dealer";
	if(_.sum(score) > 21){
		if(score.indexOf(11)=== -1){
			$target.append("<div class='h1'>" + who + " bust... "+  other +" wins!</div>");
			$(".deal").attr("disabled", "disabled");
		}else{
			var where = score.indexOf(11);
			score.splice(where, 1, 1);
			addScore(who);
		}
	} else if(_.sum(score) === 21){
		$target.append("<div class='h1'>BLACKJACK! " + who + " wins!</div>");
		$(".deal").attr("disabled", "disabled");
	} else if(dealerStay===true && playerStay===true){
		var winner = _.sum(dealerScore) >= _.sum(playerScore) ? "Dealer" : "Player";
		$target.append("<div class='h1'>Both players stay... " + winner + " wins!</div>");
		$(".deal").attr("disabled", "disabled");
	} else {}
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