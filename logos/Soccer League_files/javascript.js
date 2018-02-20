var teams;
var idTeam;
var games;
var backSequence = [];

$(document).ready(function () {
	//////////////// get JSON ////////////////

	$.getJSON("json/teams.json", function (data) {
		teams = data;

		//MUSTACHE TEAMS
		mustacheFunction('#template_teamsList', '#teams');
		//MUSTACHE STADIUMS
		mustacheFunction('#template_stadiumsList', '#stadiumsSpace');

		selectedTeam();
		selectedStadium("stadiumNumberID");
	});

	$.getJSON("json/games.json", function (data) {
		matches = data.partidos;
		showMatches();
		selectedMatch();
	});

	///////////// when clicking menu icon /////////////
	$('#nav-icon').click(function () {
		//		show/hide the menu
		if ($(this).hasClass('open')) {
			closingSideNav();
		} else {
			$(this).addClass('open');
			$('.mainContainer').addClass('cropBody');
			document.getElementById("mainContainer").style.marginLeft = "200px";
			document.body.style.backgroundColor = "rgba(0,0,0)";
		}
	});

	/////// when clicking some A link in lateral menu ///////
	$("#mySidenav a").on('click', function (event) {
		event.preventDefault();
		var nextPage = $(event.target.hash);
		console.log(nextPage);
		transition(nextPage);
		backSequence.splice(0, backSequence.length + 1);
		console.log("I reset the backSequence");
		$("#mySidenav .active").removeClass("active");
		$(this).addClass("active");
		closingSideNav();
	});

	$("#userPageLink a").on('click', function (event) {
		event.preventDefault();
		var nextPage = $(event.target.hash);
		transition(nextPage);
		backSequence.splice(0, backSequence.length + 1);
		$("#mySidenav .active").removeClass("active");
		//		$(this).addClass("active");
		closingSideNav();
	});

	///////////// change page to game Detail /////////////
	$('.LOGPmatch').on("click", function () {
		internalButtons("page-gameDetail");
	});

	///////////// change page to maps /////////////
	$('.location').on("click", function () {
		internalButtons("page-maps");
	});

	/////////////// back button ////////////////
	$('.backSpace').on("click", function () {
		var previousPage = (backSequence[backSequence.length - 1]);
		internalButtons(previousPage);
		backSequence.splice(backSequence.length - 2, 2);
	});

	///////////// change page to team /////////////
	function selectedTeam() {
		$('[teamNumberID]').on("click", function () {
			idTeam = $(this).attr("teamNumberID");
			for (var i = 0; i < teams.equipos.length; i++) {
				if (teams.equipos[i].ID == idTeam) {
					var equipoConcreto = teams.equipos[i];
					var template3 = $('#template_specificTeam').html();
					var output3 = Mustache.render(template3, equipoConcreto);
					$('#teamSpace').html(output3);
				}
			}

			internalButtons("page-team");
			selectedStadium("stadiumnumberid2");
		});
	};

	///////////// change page to stadium /////////////
	function selectedStadium(estadi) {
		$('[' + estadi + ']').on("click", function () {
			idStadium = $(this).attr(estadi);
			for (var i = 0; i < teams.equipos.length; i++) {
				if (teams.equipos[i].ID == idStadium) {
					var equipoConcreto = teams.equipos[i];
					var template5 = $('#template_specificStadium').html();
					var output = Mustache.render(template5, equipoConcreto);
					$('#stadiumSpace').html(output);
				}
			}
			internalButtons("page-stadium");
		});
	};

	///////////// change page to specific match /////////////
	function selectedMatch() {
		$('[matchID]').on("click", function () {
			idMatch = $(this).attr("matchID");
			$('#matchContent').detach();
			for (var i = 0; i < matches.length; i++) {
				if (matches[i].id == idMatch) {
					var matchConcreto = matches[i];
					var teamStadiumID = matches[i].stadium
					var team1ID = matches[i].team1;
					var team2ID = matches[i].team2;
					for (var j = 0; j < teams.equipos.length; j++) {
						if (team1ID == teams.equipos[j].ID) {
							var team1Name = teams.equipos[j].nombre;
							var team1Logo = teams.equipos[j].logo;
							var stadiumName = teams.equipos[j].estadio;
						} else if (team2ID == teams.equipos[j].ID) {
							var team2Name = teams.equipos[j].nombre;
							var team2Logo = teams.equipos[j].logo;
						}
					}
					$('#matchSpace').append('<div class="textGame row align-items-center" id="matchContent">' +
																	'<div class="col-12 dayGameDetail">' +
																	'<p>' + matches[i].dia + '</p>' +
																	'<p class="biggerTime">' + matches[i].time + '</p>' +
																	'</div>' +
																	'<div class="equipos col-12">' +
																	'<div class="equipo row align-items-center" teamNumberID="' +
																	team1ID + '">' +
																	'<div class="col-3 escudo">' +
																	'<div class="escudos">' +
																	'<img src="' + team1Logo + '">' +
																	'</div>' +
																	'</div>' +
																	'<div class="col-9">' +
																	'<p class="text-left">' + team1Name + '</p>' +
																	'</div>' +
																	'</div>' +
																	'<div class="equipo row align-items-center" teamNumberID="' +
																	team2ID + '">' +
																	'<div class="col-3 escudo">' +
																	'<div class="escudos">' +
																	'<img src="' + team2Logo + '">' +
																	'</div>' +
																	'</div>' +
																	'<div class="col-9">' +
																	'<p class="text-left">' + team2Name + '</p>' +
																	'</div>' +
																	'</div>' +
																	'</div>' +
																	'<div class="container">' +
																	'<div class="row">' +
																	'<div class="col-12 location">' +
																	'<p class="text-center" stadiumNumberID3="' + teamStadiumID + '">' + 'Location: ' + stadiumName + '</p>' +
																	'</div>' +
																	'</div>' +
																	'</div>' +
																	'</div>');
				}
			}
			internalButtons("page-gameDetail");
			selectedStadium("stadiumNumberID3");
			selectedTeam();
		});
	};

	//move to another page ONLY for internal buttons//
	function internalButtons(whichPage) {
		event.preventDefault();
		var nextPage = $("#" + whichPage);
		transition(nextPage);
		backSequence.push(prevPage);
		//		console.log ("back sequence: " + backSequence);
		for (var i = 0; i < backSequence.length; i++) {
			if (backSequence.length > 1 && backSequence[i] == backSequence[i + 1]) {
				//				console.log ("*****I'M REPEATED***** " + backSequence);
				backSequence.splice(backSequence.length - 1, 1);
				//				console.log ("NEW BACKSEQUENCE!!! " + backSequence);
			}
			//					page-teamsList,page-team,page-team
		}
	};

	///////////////	closing lateral menu /////////////
	function closingSideNav() {
		document.getElementById("mainContainer").style.marginLeft = "0px";
		document.body.style.backgroundColor = "rgba(0,0,0)";
		$("#nav-icon").removeClass("open");
		$('.mainContainer').removeClass('cropBody');
	}

	////////////// transition pages effect //////////////
	function transition(toPage) {
		prevPage = $("#pages .current").attr("id");
		//		console.log ("prevPage: " + prevPage);
		var toPage = $(toPage),
				fromPage = $("#pages .current");
		fromPage.removeClass("current");
		toPage
			.addClass("current fade in")
			.one("webkitAnimationEnd", function () {
			fromPage.removeClass("fade out");
			toPage.removeClass("fade in");
		});
		fromPage.addClass("fade out");
	};

	////////////// search Matches and append //////////////
	function showMatches() {
		for (var i = 0; i < matches.length; i++) {
			var team1FromTeams = matches[i].team1;
			var team2FromTeams = matches[i].team2;
			var team1Name, team1Logo, team2Name, team2Logo;
			for (var j = 0; j < teams.equipos.length; j++) {
				if (teams.equipos[j].ID == team1FromTeams) {
					team1Name = teams.equipos[j].nombre;
					team1Logo = teams.equipos[j].logo;
				} else if (teams.equipos[j].ID == team2FromTeams) {
					team2Name = teams.equipos[j].nombre;
					team2Logo = teams.equipos[j].logo;
				}
			}
			if (i == 0 || matches[i - 1].dia != matches[i].dia) {
				$('#matchesSpace').append('<p class="daySchedule">' + matches[i].dia + '</p>').append(
					'<div id="' + matches[i].id + '" class="LOGPmatch row align-items-center" matchID="' + matches[i].id + '">' +
					'<div class="LOGPDtime col-3">' + matches[i].time + '</div>' +
					'<div class="col-7 ">' +
					'<div class="row">' +
					'<div class="LOGPlogo col-2">' +
					'<img src="' + team1Logo + '">' +
					'</div>' +
					'<div class="col-10 LOGPteam">' +
					'<p class="text-left align-middle">' + team1Name + '</p>' +
					'</div>' +
					'</div>' +
					'<div class="row team2">' +
					'<div class="LOGPlogo col-2">' +
					'<img src="' + team2Logo + '">' +
					'</div>' +
					'<div class="col-10 LOGPteam">' +
					'<p class="text-left align-middle">' + team2Name + '</p>' +
					'</div>' + '</div>' + '</div>' + '<div class="col-2 arrow">' + '<img src="../logos/arrow2.png">' + '</div>' + '</div>');
			} else {
				$('#matchesSpace').append(
					'<div id="' + matches[i].id + '" class="LOGPmatch row align-items-center" matchID="' + matches[i].id + '">' +
					'<div class="LOGPDtime col-3">' + matches[i].time + '</div>' +
					'<div class="col-7 ">' +
					'<div class="row">' +
					'<div class="LOGPlogo col-2">' +
					'<img src="' + team1Logo + '">' +
					'</div>' +
					'<div class="col-10 LOGPteam">' +
					'<p class="text-left align-middle">' + team1Name + '</p>' +
					'</div>' +
					'</div>' +
					'<div class="row team2">' +
					'<div class="LOGPlogo col-2">' +
					'<img src="' + team2Logo + '">' +
					'</div>' +
					'<div class="col-10 LOGPteam">' +
					'<p class="text-left align-middle">' + team2Name + '</p>' +
					'</div>' + '</div>' + '</div>' + '<div class="col-2 arrow">' + '<img src="../logos/arrow2.png">' + '</div>' + '</div>');
			}
		};
	};

	////////////// mustache with JSON TEAMS //////////////
	function mustacheFunction(templ, space) {
		var template = $(templ).html();
		var output = Mustache.render(template, teams);
		$(space).html(output);
	}

	////////////// CHAT //////////////
	var displayName

	container = $('#posts');
	//	container[0].scrollTop = container[0].scrollHeight;

	$('#inputSpace').keypress(function (e) {
		console.log ()
		if (e.which == 13) {
			writeNewPost();
		}
	});
	document.getElementById("login").addEventListener("click", login);
	document.getElementById("create-post").addEventListener("click", writeNewPost);
	document.getElementById("logout").addEventListener("click", signingOut);

	function signingOut() {
		firebase.auth().signOut().then(function () {
			$('#helloSpace').addClass("oculto");
			$('#log1').removeClass("oculto");
			$('#posts').addClass("oculto");
			alert('Sign Out Error', error);
			$('.chatSpace').addClass("oculto");
		});
	}

	firebase.auth().onAuthStateChanged(function (user) {
		if (user) {
			// User is signed in.
			displayName = user.displayName;
			var firstNameArr = displayName.split (" ",2);
			var firstName = firstNameArr[0];
			$('#helloSpace').removeClass("oculto");
			$('.chatSpace').removeClass("oculto");
			$('#log1').addClass("oculto");
			$('#posts').removeClass("oculto");
			$('#logout').removeClass("oculto");
			$('#helloName').append('<p id="actualGreeting" style="display-inline">Hola, '+ firstName + '!!!</p>');
			var email = user.email;
			var emailVerified = user.emailVerified;
			var photoURL = user.photoURL;
			var isAnonymous = user.isAnonymous;
			var uid = user.uid;
			var providerData = user.providerData;
			getPosts();
			// ...
		} else {
			// User is signed out.
			$('#helloSpace').addClass("oculto");
			$('.chatSpace').addClass("oculto");
			$('#logout').addClass("oculto");
			$('#log1').removeClass("oculto");
			$('#posts').addClass("oculto");
		}
	});


	function login() {
		var provider = new firebase.auth.GoogleAuthProvider();
		firebase.auth().signInWithPopup(provider);
		$('#actualGreeting').detach();
		getPosts();
	}

	function writeNewPost() {
		var text = document.getElementById("inputSpace").value;
		var userName = firebase.auth().currentUser.displayName;
		//	a post entry
		var postData = {
			name: userName,
			body: text
		};
		//	get key for every Post
		var newPostKey = firebase.database().ref().child('myMatch').push().key;

		var updates = {};
		updates[newPostKey] = postData;
		console.log ("updates: ");	
		console.log (updates);
		firebase.database().ref().child('myMatch').update(updates);
		$("#inputSpace").val("");
		container = $('#posts');
		console.log("animation:");
		container.animate({ scrollTop: container[0].scrollHeight }, "slow");

	}

	function getPosts() {
		firebase.database().ref('myMatch').on("value", function (data) {
			var espacio = document.getElementById("posts");
			espacio.innerHTML = "";
			var posts = data.val();
			for (var key in posts) {
				var text = document.createElement("div");
				text.className = "othersSMS";
				var element = posts[key];
				var everypost = text.append(element.body);
				espacio.append(text)
			}
			container = $('#posts');
			
			console.log("animation:");
			console.log (container);
			container.scrollTop = container.scrollHeight;
//			container.animate({scrollTop:container[0].scrollHeight}, "slow");
		});

	}


});
