
//Id names of elements that will be affected by orientation changes
var elements = ["topMenu", "menuButton", "container", "botMenu", "sideMenu", "content"];

var menuVisible;

//Animation variables
var menuAnimation = 0; //Means no menuAnimation currently playing
var menuProgress = 0; //Number from 0 to 1, 0 means menu closed, 1 means menu open
var menuTarget = 0;
var menuWidth = 250;

//---------------------------------------------------- Media query handling


var portraitBool = true;
var desktopBool = false;
var orientation = "Portrait";

var portraitQuery = window.matchMedia("(orientation: portrait)");
var desktopQuery = window.matchMedia("(min-device-width: 800px)");

//Update functions set the bools that can be accessed at any time
function portraitUpdate(portraitQuery) {
	portraitBool = portraitQuery.matches;
	switchLayout();
}

function desktopUpdate(desktopQuery) {
	desktopBool = desktopQuery.matches;
	switchLayout();
}

portraitUpdate(portraitQuery); // Call update functions once at run time
desktopUpdate(desktopQuery);
menuProgress = menuTarget; //Prevent animation from running on load

portraitQuery.addListener(portraitUpdate); // Attach listeners to trigger updates on state changes
desktopQuery.addListener(desktopUpdate);

function switchLayout(){
	//Determines layout to switch to based on portraitBool and desktopBool, then switches to it
	if (portraitBool == true) { 	// Portrait phone mode
		currentOrientation = "Portrait";
	} else {
		if (desktopBool == false) { //Landscape iPad mode
			currentOrientation = "Landscape";
		} else if (desktopBool == true) { 			//Desktop mode
			currentOrientation = "Desktop";
		}
	}
	switchOrientation(currentOrientation);
}


function switchOrientation(mode) {
	//mode must be "Portrait", "Landscape", or "Desktop"
	//Switch classes
	for (i = 0; i < elements.length; i++){
		var divElement = document.getElementById(elements[i]); //Get id by name
		divElement.className = elements[i] + mode; //Set corresponding class by concatenating the name with mode
	}
	
	switch (mode) {
		case "Portrait": 
			hideMenu();
			//Other responsive anim tings go here
			break;
		case "Landscape":
			hideMenu();
			//Other responsive anim tings go here
			break;
		case "Desktop":
			showMenu();
			//Other responsive anim tings go here
			break;
	}
}



// ---------------------------------------------------- Menu Functions


function toggleMenu() {
	if(menuVisible){
		hideMenu();
	} else {
		showMenu();
	}
}

function showMenu() {
	menuVisible = true;
	
	menuTarget = 1;
	clearInterval(menuAnimation);                 //interrupt menu animation if it's already underway
	menuAnimation = setInterval(updateMenu, 15);
}

function hideMenu() {
	menuVisible = false;
	
	menuTarget = 0;
	clearInterval(menuAnimation);                 //interrupt menu animation if it's already underway
	menuAnimation = setInterval(updateMenu, 15);
}

function updateMenu(){
	//Math.do()
	
	if (Math.abs(menuProgress - menuTarget) < 0.005) { //Close enough to target, snap to target and stop animation
		menuProgress = menuTarget;
		clearInterval(menuAnimation);
		menuAnimation = 0;
	} else {
		menuProgress = (menuProgress * 9 + menuTarget) / 10; //Smooth animate function 
	}
	
	//Update CSS based on menuProgress and other variables
	
	document.getElementById("sideMenu").style.left = -menuWidth + menuProgress * menuWidth + 'px'; 
	
	if(currentOrientation == "Portrait"){
		document.getElementById("container").style.left	 = (menuProgress * menuWidth) / 2 + "px";
		document.getElementById("container").style.width = "100vw";
		document.getElementById("blackBox").style.opacity = menuProgress;
	}
	if(currentOrientation == "Landscape"){
		document.getElementById("container").style.left	 = (menuProgress * menuWidth) + "px";
		document.getElementById("container").style.width = "calc(100vw - " + (menuProgress * menuWidth) + "px)";
		document.getElementById("blackBox").style.opacity = 0;
	}
	if(currentOrientation == "Desktop"){
		document.getElementById("container").style.left	 = (menuProgress * menuWidth) + "px";
		document.getElementById("container").style.width = "calc(100vw - " + (menuProgress * menuWidth) + "px)";
		document.getElementById("blackBox").style.opacity = 0;
	}
	
}
