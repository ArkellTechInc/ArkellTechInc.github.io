//Id names of elements that will be affected by orientation changes
var elements = ["topMenu", "menuButton", "container", "sideMenu", "content", "topTitle", "sideMenuTitle", "sideMenuPhone", "blackBox"];

var mySwiper = undefined;
var menuVisible;
var menuAnimating = false;

//Animation variables
var menuAnimation = 0; //Means no menuAnimation currently playing
var menuProgress = 0; //Number from 0 to 1, 0 means menu closed, 1 means menu open
var menuTarget = 0;
var menuWidth = 300;

//-- Media query handling -------------------------------------------------
var isMobile;
var widthBool = true;
var currentOrientation = "Portrait";
var widthQuery = window.matchMedia("(min-width: 860px)");

//-- Call Back Check -----
var callBackOff = true;
var xMark = "\u2716";

//-- Document is ready :0 ---------------
$(document).ready(function(){
	// checks if mobile
	isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ? true : false;
	// Attach listeners to trigger updates on state changes
	widthQuery.addListener(widthUpdate);
	
	// Call update functions once at run time, Swiper is now initialized here
	widthUpdate(widthQuery);
	//updateMenu(); 
	if(mySwiper != undefined){
		mySwiper.update();
	}
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

function widthUpdate(widthQuery) {
	widthBool = widthQuery.matches;
	switchLayout();
}


function switchLayout(){
	//Determines layout to switch to based on portraitBool, then switches to it
	if (!widthBool) { 	// Portrait phone mode
		currentOrientation = "Portrait";
	} else {
		enableScroll();
		currentOrientation = "Landscape";
	}
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
	pageStyleUpdate();
	switch (mode) {
		case "Portrait": 
			//Responsive anim tings go here
			hideMenuInstantly();
			
			window.scrollTo(0, 0); //scrolls to top
			$(".swiperFix1").addClass("swiper-container");
			$(".swiperFix2").addClass("swiper-wrapper");
			//Enable pagination
			if(mySwiper == undefined){
				initSwiper();
			}
			//Prevent vertical scrolling
			$("body").css("overflow-y", "hidden");
			$("body").css("-webkit-overflow-scrolling", "hidden");
			
			togglePaginationClasses(mode);
			break;
		case "Landscape":
			//Responsive anim tings go here
			showMenuInstantly();
			$(".swiperFix1").removeClass("swiper-container");
			$(".swiperFix2").removeClass("swiper-wrapper");
			//Disable pagination
			if(mySwiper != undefined){
				mySwiper.destroy();	
			}
			mySwiper = undefined;
			
			//Allow vertical scrolling
			$("body").css("overflow-y", "auto");
			$("body").css("-webkit-overflow-scrolling", "auto");
			
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
	if(!menuAnimating){
		menuAnimating = true;
		//prevent spam of menubutton making jquery lose its marbles
		setTimeout(function(){ menuAnimating = false; }, 400);
		if(menuVisible){
			hideMenu();
		} else {
			showMenu();
		}
	}

}

function showMenu() {
	menuVisible = true;
	disableScroll();
	
	$("#sideMenu").animate({left: '0px'}, 400); 
	$("#blackBox").css("pointer-events","auto");
	
	if(currentOrientation == "Portrait"){
		
		$("#container").animate({left: (1 * menuWidth) / 2 + "px",
		width: 100 + "vw"}, 400);
		$("#blackBox").animate({opacity: 1}, 400);
		
	}
	if(currentOrientation == "Landscape"){
		$("#container").css("left", (1 * menuWidth) + "px");
		$("#container").css("width", "calc(99vw - " + (1 * menuWidth) + "px)");
		$("#blackBox").css("opacity",0);
		$("#blackBox").css("pointer-events","none");
	}
	if(mySwiper != undefined){
		mySwiper.update();
	}
	
	/* Old smoothAnimate menu code
	menuTarget = 1;
	clearInterval(menuAnimation);                 //interrupt menu animation if it's already underway
	menuAnimation = setInterval(updateMenu, 15);
	*/
}
function showMenuInstantly() {
	menuVisible = true;
	disableScroll();
	menuAnimating = false;
	
	$("#sideMenu").css("left", '0px'); 
	$("#blackBox").css("pointer-events","auto");
	
	if(currentOrientation == "Portrait"){
		
		$("#container").css("left", (1 * menuWidth) / 2 + "px");
		$("#container").css("width", 100 + "vw");
		$("#blackBox").css("opacity",1);
		
	}
	if(currentOrientation == "Landscape"){
		$("#container").css("left", (1 * menuWidth) + "px");
		$("#container").css("width", "calc(99vw - " + (1 * menuWidth) + "px)");
		$("#blackBox").css("opacity",0);
		$("#blackBox").css("pointer-events","none");
	}
	if(mySwiper != undefined){
		mySwiper.update();
	}
}

function hideMenu() {
	menuVisible = false;
	enableScroll();
	
	$("#sideMenu").animate({left: -menuWidth + 'px'}, 400); 
	$("#blackBox").css("pointer-events","none");
	
	
	
	if(currentOrientation == "Portrait"){
		
		$("#container").animate({left: "0px", 
								width: 100 + "vw"}, 400);
		$("#blackBox").animate({opacity:0}, 400);
		
	}
	if(currentOrientation == "Landscape"){
		$("#container").animate({left: (0 * menuWidth) + "px"}, 400);
		$("#container").animate({width: "calc(99vw - " + (0 * menuWidth) + "px)"}, 400);
		$("#blackBox").css("opacity",0);
		$("#blackBox").css("pointer-events","none");
	}
	if(mySwiper != undefined){
		mySwiper.update();
	}
}
function hideMenuInstantly() {
	menuVisible = false;
	enableScroll();
	menuAnimating = false;
	
	$("#sideMenu").css("left", -menuWidth + 'px'); 
	$("#blackBox").css("pointer-events","none");
	if(currentOrientation == "Portrait"){
		
		$("#container").css("left", (0 * menuWidth) / 2 + "px");
		$("#container").css("width", 100 + "vw");
		$("#blackBox").css("opacity",0);
		
	}
	if(currentOrientation == "Landscape"){
		$("#container").css("left", (0 * menuWidth) + "px");
		$("#container").css("width", "calc(99vw - " + (0 * menuWidth) + "px)");
		$("#blackBox").css("opacity",0);
		$("#blackBox").css("pointer-events","none");
	}
	if(mySwiper != undefined){
		mySwiper.update();
	}
}

/*
function updateMenu(){
	// This function is now unused
	
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
		$("#container").css("width", "calc(99vw - " + (menuProgress * menuWidth) + "px)");
		$("#blackBox").css("opacity",0);
		$("#blackBox").css("pointer-events","none");
	}
	if(mySwiper != undefined){
		mySwiper.update();
	}
}*/
function goToDir() {
	if (mySwiper != undefined) {
		mySwiper.slideTo(2);
	} else
		document.getElementById("page3").scrollIntoView({behavior: "smooth"}); 
			
}


// -- Pagination Functions ------------------------------------------------


//switches between pagination and scrolling page styles depending on orientation
function pageStyleUpdate() {
	switch (currentOrientation) {
		case "Portrait":
			$(".contentContainer").css("border-bottom","none");
			$(".contentContainer").css("min-height","100vh");
			break;
		case "Landscape":
			$(".contentContainer").css("border-bottom","1px dotted #CCC");
			$(".contentContainer").css("min-height","150%");
			break;
	}
}
function toggleCallBack() {
	//adds a bit of space to allow for smoother animating
	$("#iconContainer").css("min-height", "auto");
	//check to see if the icon box or content is animating
	if($("#getStarted").is(":animated") || $("#callBackForm").is(":animated")){
		return false;
	} else {
		//shrink the box if the form is active
		if(!$("#iconContainer").is(":hidden")){
			$(".getStarted").animate({ width: "20%" }).text(xMark);
			$("#iconContainer").animate({ height: '0px' }, 400, function() {
                $(this).hide();
             });
			$("#callBackForm").show().css("visibility", "visible").css("height",'0px').animate({
				height: $('#callBackForm').get(0).scrollHeight
			}, 400, function(){
				$(this).height('auto').height();
			});
		} else {
			$(".getStarted").animate({
				width: "60%" 
			}, {
			complete: function(){
				$(".getStarted").text("Click Here to Get Started")
				}
			});
			$("#iconContainer").show().animate({
				height: $('#iconContainer').get(0).scrollHeight
			}, 400, function(){
				$(this).height('auto');
			});
			$("#callBackForm").animate({ height: '0' }, 400, function() {
                $(this).css("display", "none");
             });
		}
		//swap the hide/show states of the classes
		//$("#getStarted").toggleClass("seeMore");
		//$("#iconContainer").toggle(400);
		//swaps the text

	}
}
// Makes the boxes all animated and stuff
function toggleBox(index){
	//adds a bit of space to allow for smoother animating
	$("#iconContainer").css("min-height", "31vmin");
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
				//clicks careless driving
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
				//clicks impaired driving
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
				//clicks street racing
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
				//clicks traffic tickets
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
$(':input').on('focus', function() {
	if(isMobile){
		$("body").css("overflow-y", "visible");
		$("body").css("-webkit-overflow-scrolling", "auto");
		$("body").css("height","150%");
		document.body.scrollTop += this.getBoundingClientRect().top - 10;
	} else return false;
});
$(':input').on('blur', function() {
	if(isMobile){
		window.scrollTo(0,0);
		$("body").css("overflow-y", "hidden");
		$("body").css("-webkit-overflow-scrolling", "hidden");
		$("body").css("height","100%");
	} else return false;
});
var keys = {37: 1, 38: 1, 39: 1, 40: 1};

function preventDefault(e) {
  e = e || window.event;
  if (e.preventDefault)
      e.preventDefault();
  e.returnValue = false;  
}

function preventDefaultForScrollKeys(e) {
    if (keys[e.keyCode]) {
        preventDefault(e);
        return false;
    }
}

function disableScroll() {
	if(currentOrientation == "Landscape"){
		return false;
	} else {
	  if (window.addEventListener) // older FF
		  window.addEventListener('DOMMouseScroll', preventDefault, false);
	  window.onwheel = preventDefault; // modern standard
	  window.onmousewheel = document.onmousewheel = preventDefault; // older browsers, IE
	  window.ontouchmove  = preventDefault; // mobile
	  document.onkeydown  = preventDefaultForScrollKeys;
	}

}

function enableScroll() {
    if (window.removeEventListener)
        window.removeEventListener('DOMMouseScroll', preventDefault, false);
    window.onmousewheel = document.onmousewheel = null; 
    window.onwheel = null; 
    window.ontouchmove = null;  
    document.onkeydown = null;  
}