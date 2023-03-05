var d;
var searchusername;
var searchbutton;
var result;

var repos;
var zips;

function httpGet (url, index) {
	if (window.XMLHttpRequest) xmlhttp = new XMLHttpRequest();
	else xmlhttp=new ActiveXObject('Microsoft.XMLHTTP');    // for IE6, IE5
	
	xmlhttp.onreadystatechange = function () {
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) repos[index] = JSON.parse(xmlhttp.responseText);
		else return false;
	}
	
	xmlhttp.open('GET', url, false);
	xmlhttp.send();
}

function searchUserRepositories () {
	// Get user repositories data
	repos = [];
	for (var i = 0; ; i++) {
		var url = 'https://api.github.com/users/' + searchusername.value + '/repos?per_page=100&page=' + (i + 1);
		httpGet(url, i);
		if (repos[i].length < 100) break;
	}
	
	// Construct result string and store zips url
	var string = '';
	if (repos[0] === undefined) string = 'Error: Failed to get user repositories.';
	else {
		zips = [];
		var repoCount = 0;
		for (var i = 0; i < repos.length; i++) {
			for (var j = 0; j < repos[i].length; j++) {
				var name = repos[i][j].full_name;
				var zip = 'https://github.com/' + name + '/archive/refs/heads/main.zip';
				zips.push(zip);
				string += '<a href="' + zip + '">' + name + '</a><br />';
				repoCount++;
			}
		}
		string = '<input type="button" id="downloadbutton" onclick="downloadAll()" value="Download All ' + repoCount + ' Repositories"><br /><br />' + string;
	}
	
	result.innerHTML = string;
}

function downloadAll () {
	for (var i = 0; i < zips.length; i++) {
		window.open(zips[i], '_blank');
	}
}

window.onload = function () {
	d = document;
	searchusername = d.getElementById('searchusername');
	searchbutton = d.getElementById('searchbutton');
	result = d.getElementById('result');
	
	searchusername.focus();
}