var teams;
var idTeam;
var games;
var backSequence = [];
var teamsSortABC;
var teamsSortStadium;

//$('#mainContainer').addClass('nonScroll');

$(document).ready(function () {

	setTimeout(function(){
		$('#loader').addClass('oculto');
		$('#mainSchedule').removeClass('oculto');

	}, 2000);
	//////////////// get JSON ////////////////

	$.getJSON("json/teams.json", function (data) {
		teams = data;

		teamsSortABC = {
			"equipos": teams.equipos.concat().sort(comparebyName)
		};
		teamsSortStadium = {
			"equipos": teams.equipos.concat().sort(comparebyStadium)
		};
		//MUSTACHE TEAMS
		mustacheFunction('#template_teamsList', '#teams', teamsSortABC);
		//MUSTACHE STADIUMS
		mustacheFunction('#template_stadiumsList', '#stadiumsSpace', teamsSortStadium);

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
		var xP = event.target.hash;
		if (xP == "#page-teamsList" || xP == "#page-User" || xP == "#page-teamsLists" || xP == "#page-stadiums") {
			$('#mainContainer').addClass('nonScroll');
		} else {
			$('#mainContainer').removeClass('nonScroll');
		}
		var nextPage = $(event.target.hash);
		transition(nextPage);
		backSequence.splice(0, backSequence.length + 1);
		$("#mySidenav .active").removeClass("active");
		$(this).addClass("active");
		closingSideNav();
	});

	$("#userPageLink a").on('click', function (event) {
		$('#mainContainer').addClass('nonScroll');
		event.preventDefault();
		var nextPage = $(event.target.hash);
		transition(nextPage);
		backSequence.splice(0, backSequence.length + 1);
		$("#mySidenav .active").removeClass("active");
		$("#mySidenav #chatSideNav").addClass("active");
		closingSideNav();
	});

	///////////// change page to game Detail /////////////
	$('.LOGPmatch').on("click", function () {
		internalButtons("page-gameDetail");
		closingSideNav();
	});

	///////////// change page to maps /////////////
	$('.location').on("click", function () {
		internalButtons("page-maps");
		closingSideNav();
	});

	/////////////// back button ////////////////
	$('.backSpace').on("click", function () {

		var previousPage = (backSequence[backSequence.length - 1]);
		//        console.log (previousPage);
		internalButtons(previousPage);
		backSequence.splice(backSequence.length - 2, 2);
		closingSideNav();
	});

	$('.backSpaceChat').on("click", function () {
		var previousPage = "page-User";
		internalButtons(previousPage);
		console.log ("backSequence");
		console.log (backSequence);
		backSequence.splice(backSequence.length - 2, 2);
		closingSideNav();
	});

	/////////////// sorting ////////////////
	function comparebyName(a, b) {
		if (a.nombre < b.nombre)
			return -1;
		if (a.nombre > b.nombre)
			return 1;
		return 0;
	};

	function comparebyStadium(a, b) {
		if (a.estadio < b.estadio)
			return -1;
		if (a.estadio > b.estadio)
			return 1;
		return 0;
	};

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

			$('#mainContainer').removeClass('nonScroll');
			internalButtons("page-team");
			selectedStadium("stadiumnumberid2");
			closingSideNav();
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
			$('#mainContainer').removeClass('nonScroll');
			internalButtons("page-stadium");
			closingSideNav();
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
			closingSideNav();
		});
	};

	//move to another page ONLY for internal buttons//
	function internalButtons(whichPage) {
		event.preventDefault();
		var nextPage = $("#" + whichPage);
		transition(nextPage);
		backSequence.push(prevPage);
		console.log (backSequence);
		//        		console.log ("back sequence: " + backSequence);
		for (var i = 0; i < backSequence.length; i++) {
			if (backSequence.length > 1 && backSequence[i] == backSequence[i + 1]) {
				//                console.log ("is bigger and repeated");
				//                console.log (backSequence);
				backSequence.splice(backSequence.length - 1, 1);
				//                console.log ("backSequence after split");
				//                console.log (backSequence);
			}
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
				console.log ("prevPage: " + prevPage);
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
			if (teams == null){
				alert ("ERROR: DATA NOT FOUND");
			}
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
	function mustacheFunction(templ, space, teamsSorted) {
		var template = $(templ).html();
		var output = Mustache.render(template, teamsSorted);
		$(space).html(output);
	}

	//////CHAT SELECTOR//////
	$('#match1Chat a').on("click",function (event) {
		$('#mainContainer').addClass('nonScroll');
		event.preventDefault();
		var nextPage = $(event.target.hash);
		transition(nextPage);
		backSequence.splice(0, backSequence.length + 1);
		closingSideNav();
		scrollDownCH1();
		getPosts(); 
	});

	$('#match2Chat a').on("click",function (event) {
		$('#mainContainer').addClass('nonScroll');
		event.preventDefault();
		var nextPage = $(event.target.hash);
		transition(nextPage);
		backSequence.splice(0, backSequence.length + 1);
		closingSideNav();
		scrollDownCH2();
		getPostsCH2();
	});
	////////////// CHAT1 //////////////
	var displayName;
	var photoURL;
	var ix = 12;
	container = $('#posts');
	var actualDate;

	$("#login").on("click", login);
	$("#logout").on("click", signingOut);
	$("#create-post").on("click", writeNewPost);
	$('#inputSpace').keypress(function (e) {
		if (e.which == 13) {
			writeNewPost();
		}
	});

	//	$("#logoutCH1").on("click", signingOut);
	//	$("#logoutCH2").on("click", signingOut);
	$('.morePosts').on("click", getMorePosts);

	function scrollDownCH2() {
		containerCH2 = $('#messagesSpaceCH2');
		containerCH2.animate({
			scrollTop: containerCH2[0].scrollHeight
		}, "slow");
	}

	function scrollDownCH1() {
		containerCH1 = $('#messagesSpaceCH1');
		containerCH1.animate({
			scrollTop: containerCH1[0].scrollHeight
		}, "slow");
	}

	firebase.auth().onAuthStateChanged(function (user) {
		if (user) {
			// User is signed in.
			displayName = user.displayName;
			var firstNameArr = displayName.split(" ", 2);
			var firstName = firstNameArr[0];
			$('#helloSpace').removeClass("oculto");
			$('.chatSpace').removeClass("oculto");
			$('#log1').addClass("oculto");
			$('#morePosts').removeClass("oculto");
			$('#posts').removeClass("oculto");
			$('#logout').removeClass("oculto");
			$('#helloName').append('<p id="actualGreeting" style="display-inline">Hola, ' + firstName + '!!!</p>');
			var email = user.email;
			var emailVerified = user.emailVerified;
			var photoURL = user.photoURL;
			var isAnonymous = user.isAnonymous;
			var uid = user.uid;
			var providerData = user.providerData;
			getPosts();
			getPostsCH2();
			$('#chatSelector').removeClass("oculto");
		} else {
			// User is signed out.
			$('#helloSpace').addClass("oculto");
			$('.chatSpace').addClass("oculto");
			$('#logout').addClass("oculto");
			$('#log1').removeClass("oculto");
			$('#morePosts').addClass("oculto");
			$('#posts').addClass("oculto");
		}
	});

	function login() {
		var provider = new firebase.auth.GoogleAuthProvider();
		firebase.auth().signInWithPopup(provider);
		$('#actualGreeting').detach();
		getPosts();
		getPostsCH2();
	}

	function getTodayDay(){
		var d = new Date();
		//GET DATE
		var numberDay = d.getDate();
		var year = d.getFullYear();
		//GET THE MONTH
		var numArrayMonth = d.getMonth();
		var months = ["January", "February", "February", "March", "April","May","June","July","August","September","October","November","December"];
		var monthName = months[numArrayMonth];
		//GET TOTAL DATE
		actualDate =monthName + " " + numberDay+", "+year;
	}

	function signingOut() {
		firebase.auth().signOut().then(function () {
			$('#helloSpace').addClass("oculto");
			$('#log1').removeClass("oculto");
			$('#posts').addClass("oculto");
			$('.chatSpace').addClass("oculto");
			$('#chatSelector').addClass("oculto");
			$('#mainContainer').addClass('nonScroll');
			var nextPage = $("#page-User");
			transition(nextPage);
			backSequence.splice(0, backSequence.length + 1);
			$("#mySidenav .active").removeClass("active");
			closingSideNav();
		});
	}

	function writeNewPost() {
		var text = document.getElementById("inputSpace").value;
		var d = new Date();
		//GET TIME
		var n = d.getHours();
		var m = d.getMinutes();

		//GET DATE
		var numberDay = d.getDate();
		var year = d.getFullYear();

		//GET THE MONTH
		var numArrayMonth = d.getMonth();
		var months = ["January", "February", "February", "March", "April","May","June","July","August","September","October","November","December"];
		var monthName = months[numArrayMonth];
		//GET TOTAL DATE
		var totalDate =monthName + " " + numberDay+", "+year;
		if (m < 10) {
			m = "0" + d.getMinutes();
		};
		var realTime = n + ":" + m;
		if (text == " " || text == "  " || text.length == 0) {
			alert ("say something");
		} else {
			var userName = firebase.auth().currentUser.displayName;
			//	a post entry
			var postData = {
				name: userName,
				body: text,
				time: realTime,
				date: totalDate
			};
			//	get key for every Post
			var newPostKey = firebase.database().ref().child('myMatch').push().key;
			var updates = {};
			updates[newPostKey] = postData;
			firebase.database().ref().child('myMatch').update(updates);
			$("#inputSpace").val("");
		}
		getPosts();
	}

	function getPosts() {
		$('#morePosts').removeClass("oculto");
		getTodayDay();
		firebase.database().ref('myMatch').on("value", function (data) {
			var espacio = document.getElementById("posts");
			espacio.innerHTML = "";
			var posts = data.val();
			var lastKeys = [];
			for (var key in posts) {
				lastKeys.push(posts[key]);
			}
			for (var i = lastKeys.length - 10; i < lastKeys.length; i++) {
				var element = lastKeys[i];
				var textDiv = document.createElement("div");
				var textPName = document.createElement("p");
				textPName.className = "maxWidth";
				var textPSMS = document.createElement("p");
				textPSMS.className = "namePost";
				var textPTime = document.createElement("p");
				if (element.date == actualDate){
					if (element.date != lastKeys[i - 1].date || i == lastKeys.length - 10) {
						var dateDiv = document.createElement("div");
						dateDiv.className = "dateChatBack";
						var dateP = document.createElement ("p");
						dateP.className = "dateChat";
						var datePost = dateP.append("Today");
						espacio.append (dateDiv);
						dateDiv.append(dateP);
					}
				} else{
					if (element.date != lastKeys[i - 1].date || i == lastKeys.length - 10) {
						var dateDiv = document.createElement("div");
						dateDiv.className = "dateChatBack";
						var dateP = document.createElement ("p");
						dateP.className = "dateChat";
						var datePost = dateP.append(element.date);
						espacio.append (dateDiv);
						dateDiv.append(dateP);
					}
				}
				if (element.name == displayName) {
					textDiv.className = "mySMS";
					textPTime.className = "mytimePost";
				} else {
					textDiv.className = "othersSMS";
					textPTime.className = "timePostOthers";
					if (element.name != lastKeys[i - 1].name || i == lastKeys.length - 10) {
						var namePost = textPSMS.append(element.name);
						espacio.append(textPSMS);
					}
				};
				var actualPost = textPName.append(element.body);
				var timePost = textPTime.append(element.time);
				espacio.append(textDiv);
				textDiv.append(textPName);
				textDiv.append(textPTime);
			}
			scrollDownCH1();
		});
	}

	function getMorePosts() {
		//		console.log ("gettingMorePosts");
		firebase.database().ref('myMatch').on("value", function (data) {
			var espacio = document.getElementById("posts");
			espacio.innerHTML = "";
			var posts = data.val();
			var lastKeys = [];
			for (var key in posts) {
				lastKeys.push(posts[key]);
			}
			for (var i = lastKeys.length - ix; i < lastKeys.length; i++) {
				var element = lastKeys[i];
				if (element!=null){
					var textDiv = document.createElement("div");
					var textPName = document.createElement("p");
					textPName.className = "maxWidth";
					var textPSMS = document.createElement("p");
					textPSMS.className = "namePost";
					var textPTime = document.createElement("p");
					if (element.date == actualDate){
						if (element.date != lastKeys[i - 1].date || i == lastKeys.length - ix) {
							var dateDiv = document.createElement("div");
							dateDiv.className = "dateChatBack";
							var dateP = document.createElement ("p");
							dateP.className = "dateChat";
							var datePost = dateP.append("Today");
							espacio.append (dateDiv);
							dateDiv.append(dateP);
						}
					} else{
						if (i == lastKeys.length - ix || element.date != lastKeys[i - 1].date) {
							var dateDiv = document.createElement("div");
							dateDiv.className = "dateChatBack";
							var dateP = document.createElement ("p");
							dateP.className = "dateChat";
							var datePost = dateP.append(element.date);
							espacio.append (dateDiv);
							dateDiv.append(dateP);
						}
					};
					if (element.name == displayName) {
						textDiv.className = "mySMS";
						textPTime.className = "mytimePost";
					} else {
						textDiv.className = "othersSMS";
						textPTime.className = "timePostOthers";
						if (element.name != lastKeys[i - 1].name || i==lastKeys.length - ix) {
							var namePost = textPSMS.append(element.name);
							espacio.append(textPSMS);
						}
					};
					var actualPost = textPName.append(element.body);
					var timePost = textPTime.append(element.time);
					espacio.append(textDiv);
					textDiv.append(textPName);
					textDiv.append(textPTime);
				}
			}
			ix++;
			var posts = data.val();
			var lastKeys = [];
			for (var key in posts) {
				lastKeys.push(posts[key]);
			}
			for (var i = lastKeys.length - ix; i < lastKeys.length; i++) {
				var element = lastKeys[i];
				if (element == null){
					$('#morePosts').detach();
				}
			}
			ix++;
			var posts = data.val();
			var lastKeys = [];
			for (var key in posts) {
				lastKeys.push(posts[key]);
			}
			for (var i = lastKeys.length - ix; i < lastKeys.length; i++) {
				var element = lastKeys[i];
				if (element == null){
					$('#morePosts').detach();
				}
			}
		});

	}

	////////////// CHAT2 //////////////
	var ixCH2 = 12;
	container2 = $('#postsCH2');

	$("#create-postCH2").on("click", writeNewPostCH2);
	$('#inputSpaceCH2').keypress(function (e) {
		if (e.which == 13) {
			writeNewPostCH2();
		}
	});
	$('#morePostsCH2').on("click", getMorePostsCH2);

	function writeNewPostCH2() {
		var text = document.getElementById("inputSpaceCH2").value;
		var d = new Date();
		//GET TIME
		var n = d.getHours();
		var m = d.getMinutes();

		//GET DATE
		var numberDay = d.getDate();
		var year = d.getFullYear();

		//GET THE MONTH
		var numArrayMonth = d.getMonth();
		var months = ["January", "February", "February", "March", "April","May","June","July","August","September","October","November","December"];
		var monthName = months[numArrayMonth];
		//GET TOTAL DATE
		var totalDate =monthName + " " + numberDay+", "+year;
		if (m < 10) {
			m = "0" + d.getMinutes();
		};
		var realTime = n + ":" + m;
		if (text == " " || text == "  " || text.length == 0) {
			alert ("say something");
		} else {
			var userName = firebase.auth().currentUser.displayName;
			//	a post entry
			var postData = {
				name: userName,
				body: text,
				time: realTime,
				date: totalDate
			};
			//	get key for every Post
			var newPostKey = firebase.database().ref().child('myMatch2').push().key;
			var updates = {};
			updates[newPostKey] = postData;
			firebase.database().ref().child('myMatch2').update(updates);
			$("#inputSpaceCH2").val("");
		}
		getPostsCH2()
	}

	function getPostsCH2() {
		getTodayDay();
		firebase.database().ref('myMatch2').on("value", function (data) {
			var espacio = document.getElementById("postsCH2");
			var espaciomorePosts = document.getElementById("morePostsCH2");
			espacio.innerHTML = "";
			espaciomorePosts.innerHTML = "";
			var posts = data.val();
			var lastKeys = [];
			//add three dots for more Messages
			var morePostsDiv = document.createElement("div");
			morePostsDiv.className = "morePosts";
			var morePostsP = document.createElement("p");
			espaciomorePosts.append(morePostsDiv);
			var threeDots = morePostsP.append("...");
			morePostsDiv.append(morePostsP);
			for (var key in posts) {
				lastKeys.push(posts[key]);
			}
			for (var i = lastKeys.length - 10; i < lastKeys.length; i++) {
				var element = lastKeys[i];
				var textDiv = document.createElement("div");
				var textPName = document.createElement("p");
				textPName.className = "maxWidth";
				var textPSMS = document.createElement("p");
				textPSMS.className = "namePost";
				var textPTime = document.createElement("p");
				if (element.date == actualDate){
					if (element.date != lastKeys[i - 1].date || i == lastKeys.length - 10) {
						var dateDiv = document.createElement("div");
						var dateP = document.createElement ("p");
						dateP.className = "dateChat";
						var datePost = dateP.append("Today");
						espacio.append (dateDiv);
						dateDiv.append(dateP);
					}
				} else{
					if (element.date != lastKeys[i - 1].date || i == lastKeys.length - 10) {
						var dateDiv = document.createElement("div");
						var dateP = document.createElement ("p");
						dateP.className = "dateChat";
						var datePost = dateP.append(element.date);
						espacio.append (dateDiv);
						dateDiv.append(dateP);
					}
				}

				if (element.name == displayName) {
					textDiv.className = "mySMS";
					textPTime.className = "mytimePost";
				} else {
					textDiv.className = "othersSMS";
					textPTime.className = "timePostOthers";
					if (element.name != lastKeys[i - 1].name || i == lastKeys.length - 10) {
						var namePost = textPSMS.append(element.name);
						espacio.append(textPSMS);
					}
				};
				var actualPost = textPName.append(element.body);
				var timePost = textPTime.append(element.time);
				espacio.append(textDiv);
				textDiv.append(textPName);
				textDiv.append(textPTime);
			}
			scrollDownCH2();
		});
	}

	function getMorePostsCH2() {
		firebase.database().ref('myMatch2').on("value", function (data) {
			var espacio = document.getElementById("postsCH2");
			espacio.innerHTML = "";
			var posts = data.val();
			var lastKeys = [];
			for (var key in posts) {
				lastKeys.push(posts[key]);
			}
			for (var i = lastKeys.length - ixCH2; i < lastKeys.length; i++) {
				var element = lastKeys[i];
				if (element!=null){
					var textDiv = document.createElement("div");
					var textPName = document.createElement("p");
					textPName.className = "maxWidth";
					var textPSMS = document.createElement("p");
					textPSMS.className = "namePost";
					var textPTime = document.createElement("p");
					if (element.date == actualDate){
						if (element.date != lastKeys[i - 1].date || i == lastKeys.length - ixCH2) {
							var dateDiv = document.createElement("div");
							var dateP = document.createElement ("p");
							dateP.className = "dateChat";
							var datePost = dateP.append("Today");
							espacio.append (dateDiv);
							dateDiv.append(dateP);
						}
					} else{
						if (i == lastKeys.length - ixCH2 || element.date != lastKeys[i - 1].date) {
							var dateDiv = document.createElement("div");
							var dateP = document.createElement ("p");
							dateP.className = "dateChat";
							var datePost = dateP.append(element.date);
							espacio.append (dateDiv);
							dateDiv.append(dateP);
						}
					};
					if (element.name == displayName) {
						textDiv.className = "mySMS";
						textPTime.className = "mytimePost";
					} else {
						textDiv.className = "othersSMS";
						textPTime.className = "timePostOthers";
						if (element.name != lastKeys[i - 1].name || i==lastKeys.length - ixCH2) {
							var namePost = textPSMS.append(element.name);
							espacio.append(textPSMS);
						}
					};
					var actualPost = textPName.append(element.body);
					var timePost = textPTime.append(element.time);
					espacio.append(textDiv);
					textDiv.append(textPName);
					textDiv.append(textPTime);
				}
			}
			ixCH2++;
			var posts = data.val();
			var lastKeys = [];
			for (var key in posts) {
				lastKeys.push(posts[key]);
			}
			for (var i = lastKeys.length - ixCH2; i < lastKeys.length; i++) {
				var element = lastKeys[i];
				if (element == null){
					$('#morePostsCH2').detach();
				}
			}
			ixCH2++;
			var posts = data.val();
			var lastKeys = [];
			for (var key in posts) {
				lastKeys.push(posts[key]);
			}
			for (var i = lastKeys.length - ix; i < lastKeys.length; i++) {
				var element = lastKeys[i];
				if (element == null){
					$('#morePosts').detach();
				}
			}
		});

	}

});
