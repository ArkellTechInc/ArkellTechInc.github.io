//Id names of elements that will be affected by orientation changes
var elements = ["topMenu", "menuButton", "container", "sideMenu", "content", "topTitle", "sideMenuTitle", "sideMenuPhone", "blackBox"];

var mySwiper = undefined;
var menuVisible;

//Animation variables
var menuAnimation = 0; //Means no menuAnimation currently playing
var menuProgress = 0; //Number from 0 to 1, 0 means menu closed, 1 means menu open
var menuTarget = 0;
var menuWidth = 300;


//-- Media query handling -------------------------------------------------

var portraitBool = true;
var widthBool = true;
var currentOrientation = "Portrait";
var portraitQuery = window.matchMedia("(orientation: portrait)");
var widthQuery = window.matchMedia("(min-width: 800px)");

//-- Call Back Check -----
var callBackOff = true;
var xMark = "\u2716";

//-- Document is ready :0 ---------------
$(document).ready(function(){
	// Attach listeners to trigger updates on state changes
	portraitQuery.addListener(portraitUpdate);
	widthQuery.addListener(widthUpdate);
	
	
	// Call update functions once at run time, Swiper is now initialized here
	portraitUpdate(portraitQuery);
	updateMenu(); 
	//Prevent animation from running if site is loaded on desktop
	menuProgress = menuTarget;
	


});

function initSwiper(){
	mySwiper = new Swiper ('.swiper-container', {
		// Optional parameters
		direction: 'horizontal',
		longSwipesRatio: 0.35,
		keyboard: {
			enabled: true,
		},
		mousewheel: true,
		// If we need pagination
		pagination: {
		  el: '.swiper-pagination',
		},
		

	});
}

function portraitUpdate(portraitQuery) {
	portraitBool = portraitQuery.matches;
	switchLayout();
}
function widthUpdate(widthQuery) {
	widthBool = widthQuery.matches;
	switchLayout();
}


function switchLayout(){
	console.log(widthBool);
	//Determines layout to switch to based on portraitBool, then switches to it
	if (portraitBool && widthBool) { 	// Portrait phone mode
		currentOrientation = "Portrait";
	} else if (!widthBool){
		currentOrientation = "Portrait";
	} else
		currentOrientation = "Landscape";

	switchOrientation(currentOrientation);
}

function switchOrientation(mode) {
	//mode must be "Portrait" or "Landscape"
	//Switch classes
	for (i = 0; i < elements.length; i++){
		if ($("#" + elements[i]).length > 0){
			$("#" + elements[i]).removeClass();
			$("#" + elements[i]).addClass(elements[i] + mode);//Set corresponding class by concatenating the name with mode
		} else {
			console.log(elements[i] + " doesn't exist");
		}

	}
	
	switch (mode) {
		case "Portrait": 
			//Responsive anim tings go here
			hideMenu();
			
			window.scrollTo(0, 0); //scrolls to top
			// window.scrollTo(0,$(document).height()-$(window).height()); //scrolls to bottom
			$(".swiperFix1").addClass("swiper-container");
			$(".swiperFix2").addClass("swiper-wrapper");
			//Enable pagination
			if(mySwiper == undefined){
				initSwiper();
			}
			
			//Prevent vertical scrolling
			//$("body").css("overflow-y", "hidden");
			
			togglePaginationClasses(mode);
			
			
			break;
		case "Landscape":
			//Responsive anim tings go here
			showMenu();
			$(".swiperFix1").removeClass("swiper-container");
			$(".swiperFix2").removeClass("swiper-wrapper");
			
			//Disable pagination
			if(mySwiper != undefined){
				mySwiper.destroy();	
			}
			mySwiper = undefined;
			
			//Allow vertical scrolling
			$("body").css("overflow-y", "auto");
			
			togglePaginationClasses(mode);
			
			break;
	}
	
}

function togglePaginationClasses(mode){
	//pages must have id "page1", "page2", etc
	var pageNum = 1;
	while($("#page" + pageNum).length > 0) { //while there exists a page
		switch(mode){
			case "Portrait": 
				$("#page" + pageNum).removeClass();
				$("#page" + pageNum).addClass("swiper-slide");
				break;
			case "Landscape":
				$("#page" + pageNum).removeClass();
				$("#page" + pageNum).addClass("pageLandscape");
				break;
		}
		pageNum++;
	}
}


// -- Menu Functions ------------------------------------------------------

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
	
	if (Math.abs(menuProgress - menuTarget) < 0.005) { //Close enough to target, snap to target and stop animation
		menuProgress = menuTarget;
		clearInterval(menuAnimation);
		menuAnimation = 0;
	} else {
		menuProgress = (menuProgress * 9 + menuTarget) / 10; //Smooth animate function 
	}
	
	//Update CSS based on menuProgress and other variables
	
	$("#sideMenu").css("left", -menuWidth + menuProgress * menuWidth + 'px'); 
	
	if (menuProgress > 0.5){
		$("#blackBox").css("pointer-events","auto");
	} else {
		$("#blackBox").css("pointer-events","none");
	}
	
	
	if(currentOrientation == "Portrait"){
		
		$("#container").css("left", (menuProgress * menuWidth) / 2 + "px");
		$("#container").css("width", 100 + "vw");
		$("#blackBox").css("opacity",menuProgress);
		
	}
	if(currentOrientation == "Landscape"){
		$("#container").css("left", (menuProgress * menuWidth) + "px");
		$("#container").css("width", "calc(100vw - " + (menuProgress * menuWidth) + "px)");
		$("#blackBox").css("opacity",0);
		$("#blackBox").css("pointer-events","none");
	}
	
	if(mySwiper != undefined){
		mySwiper.update();
	}
}
function goToDir() {
	if(mySwiper != undefined){
				mySwiper.slideTo(2);
			}
			else
				document.getElementById("page3").scrollIntoView({behavior: "smooth"}); 
			
}


// -- Pagination Functions ------------------------------------------------


//switches between pagination and scrolling page styles depending on orientation
function pageStyleUpdate() {
	switch (currentOrientation) {
		case "Portrait":
		
			break;
		case "Landscape":
		
			break;
	}
}
function toggleCallBack() {
	$("#getStarted").toggleClass("seeMore");
	$("#iconContainer").toggle(400);
	$("#callBackForm").toggle(400);
	if($("#getStarted").hasClass("seeMore")){
		$("#getStarted").text(xMark);
	} else {
		$("#getStarted").text("Click Here to Get Started");
	}
	
}
// Makes the boxes all animated and stuff
function toggleBox(index){
	//check to see if the icon box or content is animating
	if($(".iconBox").is(":animated") || $(".iconContent").is(":animated")){
		return false;
	} else {
		//quick disappear if toggling off
		if($(".iconContent").is(":visible")){
			$(".iconContent").toggle();
		} else {
			//slow appear
			$(".iconContent").delay(500).fadeToggle(400);
		}
		//toggles the boxes that aren't clicked, and show the neccessary content the other content
		switch(index){
			case 1: 
				$(".iconContent").css("backgroundColor", $("#carelessDrivingBox").css("backgroundColor"));
				$("#carelessDrivingBox").show(400);
				$("#impairedDrivingBox").toggle(400);
				$("#streetRacingBox").toggle(400);
				$("#trafficTicketsBox").toggle(400);
				$("#carelessDrivingContent").show();
				$("#impairedDrivingContent").hide();
				$("#streetRacingContent").hide();
				$("#trafficTicketsContent").hide();
				break;
			case 2: 
				$("#carelessDrivingBox").toggle(400);
				$("#impairedDrivingBox").show(400);
				$(".iconContent").css("backgroundColor", $("#impairedDrivingBox").css("backgroundColor"));
				$("#streetRacingBox").toggle(400);
				$("#trafficTicketsBox").toggle(400);
				$("#carelessDrivingContent").hide();
				$("#impairedDrivingContent").show();
				$("#streetRacingContent").hide();
				$("#trafficTicketsContent").hide();
				break;
			case 3: 
				$("#carelessDrivingBox").toggle(400);
				$("#impairedDrivingBox").toggle(400);
				$("#streetRacingBox").show(400);
				$(".iconContent").css("backgroundColor", $("#streetRacingBox").css("backgroundColor"));
				$("#trafficTicketsBox").toggle(400);
				$("#carelessDrivingContent").hide();
				$("#impairedDrivingContent").hide();
				$("#streetRacingContent").show();
				$("#trafficTicketsContent").hide();
				break;
			case 4: 
				$("#carelessDrivingBox").toggle(400);
				$("#impairedDrivingBox").toggle(400);
				$("#streetRacingBox").toggle(400);
				$("#trafficTicketsBox").show(400);
				$(".iconContent").css("backgroundColor", $("#trafficTicketsBox").css("backgroundColor"));
				$("#carelessDrivingContent").hide();
				$("#impairedDrivingContent").hide();
				$("#streetRacingContent").hide();
				$("#trafficTicketsContent").show();
				
				break;
		}
	}
}
$(":input").focus(function() {
    var height = $(":input").css('height');
    $(":input").css('height', height);
});