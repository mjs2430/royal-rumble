$(document).ready(function() {


/////***** Get data from Google Sheets *****////
    
 // Replace YOUR_API_KEY with your actual API key
const API_KEY = 'AIzaSyC-9cY7xA-_BsMvRieTFsO4thZp6jkkIKU';

  // Replace SPREADSHEET_ID with the ID of the spreadsheet you want to import
const SPREADSHEET_ID = '1NFjwvQqcK5Aa4NgC37nRg3Tp9TXdzy4tz03RwY_cuMQ';

//******* Define a function to retrieve data from a specific sheet. sheetName is an argument to be passed in later when calling this function. I use it to call in the year and the range (columns or rows) ***///
// Define a function to retrieve data from a specific sheet
const getSheetData = async (sheetName,range) => {
  // Build the API request URL to get the data from the sheet, skipping the first row
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${sheetName}!${range}?key=${API_KEY}`;

  // Make the API request to get the data from the sheet
  const response = await fetch(url);
  const data = await response.json();

  // data.values is an array of rows, where each row is an array of cells
  return data.values;
    
};






    
     
     
//setup variables   
let wrestlersPerPlayer;
let numberOfPlayers;
let playerNames; 
let wrestlerNames;
let wrestlerName;
let extra = [];
let count = -1;
let names = [];
let order = [];
let exitTimes = [];
let timeInRing = [];
let showYear = 0; 

//Get player names from input field, split into an array
  $('#players').keyup(function() {
  let string =  $('#players').val();
	playerNames = string.split('\n');
	}); 


//assign names to players
 $('#submit-players').click(function() {
	
	 for (let x in playerNames) {
			 $(".player-grid").append(`<div class="player${x} player-section"><h2>${playerNames[x]}</h2><div class="list-of-wrestlers"></div><button class="addExtra">Add extra wrestler</button></div>`);
	 }   
	 //create extra player space
	 $(".player-grid").append(`<div class="extra-wrestlers hidden"><h2>Extra Wrestlers</h2><div class="list-of-wrestlers"></div></div>`);
	  numberOfPlayers = playerNames.length;//set number of players integer
	 	$("#names").val("");	//clear the names input field when done
    $("#player-amount").removeClass("show").addClass("hidden");
	 $("#wrestler-amount").removeClass("hidden").addClass("show");
	});    //end




//get number of wrestlers per player. function triggers on change of wrestlers each select dropdown
$("#wrestlers").change(function () {
$(".list-of-wrestlers").html("");//clear grid
let wrestlers = $('#wrestlers').val(); // get value of drodown
wrestlersPerPlayer = parseInt(wrestlers); //convert value string to integer
	$("#wrestler-amount").removeClass("show").addClass("hidden");
	$("#wrestler-assignment").removeClass("hidden").addClass("show");
    });
 
	

//get array of wrestlers by picking a year in the dropdown
$("#year").change(function () { 
let showYear = $('#year option:selected').text();

// Call the google sheets function and pass in the selected year as the sheet name to get
getSheetData(showYear,"A2:E40").then(rows => {
  // Loop through the rows in the sheet
  for (const row of rows) {
    // Add the wrestler's name from the row to the names array
    names.push(row[1]);
    order.push(row[1]);
    timeInRing.push(row[4])
  }
});

// Use the name values from the sheet
setTimeout(function () {
    SHUFFLE(names); //run shuffle function, which includes function to create multidimensional array
    CREATE_WRESTLER_GRID(); // run function that puts wrestlers in DOM   
    $("#wrestler-assignment").removeClass("show").addClass("hidden");
    $(".player-grid").removeClass("hidden").addClass("show");
    $("header").addClass("slideUp");
    $("#in-the-ring").removeClass("hidden").addClass("show");
    //$(".new-button").removeClass("hidden").addClass("show");
    $("#show-year").append(`<h3>${showYear}</h3>`);
    setTimeout(function () {
        $("#show-year").removeClass("hidden").addClass("show")
    }, 1000);
    return showYear;

}, 500);

}); //end
    

	
    
    
//add another wrestler to player when .addExtra is clicked
$('.player-grid').on('click', '.addExtra', function() { 
	 if (extra.length > 0) {
    let wrestlerClass = extra[0].replace(/^[^A-Z]+|[\W]+/ig, "")
	$(".extra-wrestlers .list-of-wrestlers ." + wrestlerClass).remove();
$(this).siblings(".list-of-wrestlers").append(`<div class='wrestler-card inactive ${wrestlerClass}'><button type='button' class=''></button><p>${extra[0]}</p></div>`);
extra.shift();
	 } else {   
         let  merged = [].concat.apply([], wrestlerNames); // merge our multidimensional array to one
		 merged = merged.map((a) => [Math.random(),a]).sort((a,b) => a[0]-b[0]).map((a) => a[1]);	//shuffle that array
         let excessWrestlers = [];
         let addedWrestler;
         addedWrestler = merged[0].replace(/^[^A-Z]+|[\W]+/ig, "") // addedWrestler is the first name in array
         excessWrestlers.push(addedWrestler); //push to an array to check against
         if (excessWrestlers.includes(addedWrestler)) { //if array includes new wrestler name
             addedWrestler = merged[1].replace(/^[^A-Z]+|[\W]+/ig, "") //get next wrestler name
                          $(this).siblings(".list-of-wrestlers").append(`<div class='wrestler-card inactive ${addedWrestler}'><button type='button' class=''></button><p>${merged[1]}</p></div>`);

         } else {
             $(this).siblings(".list-of-wrestlers").append(`<div class='wrestler-card inactive ${addedWrestler}'><button type='button' class=''></button><p>${merged[0]}</p></div>`);
         }
     }
}); 
	
    
	
//mark wrestlers as entered when click "add new" button
$('#in-the-ring').on('click', '#next-wrestler', function() { 
    
let video = document.querySelector('video');// Get the video element
let timestamp = Math.round(video.currentTime);// Get the current timestamp of the video
    
playAudio("http://matthewsasso.com/royalrumble/sounds/crowd.wav");
count++; //add to the count so we can use that integer to reference a position in the wrestler array
   
    
// Add timeInRing for this wrestler to their entry timestamp to determine their exitTime, push to exitTimes array
let exitTime = Number(timeInRing[count]) + timestamp;
exitTimes.push(exitTime);
console.log(exitTimes);
     
let wrestler = order[count]; // wrestler name, array position
let wrestlerClass = wrestler.replace(/^[^A-Z]+|[\W]+/ig, "") //remove spaces and special chars
 $("#in-the-ring").append(`<span class="${wrestlerClass} pill">${wrestler}</span>`);//add the wrestler to the top bar
	
    let nl = document.querySelectorAll(".list-of-wrestlers > ." + wrestlerClass); // get nodelist
    let arr = [];
    let names = [];
    for(let i = nl.length; i--; arr.unshift(nl[i])); // convert nodelist to array
    for (let x in arr) {
    let userName = $(arr[x]).parent().parent().find("h2").html();
    names.push(userName);
    }   
    
    names = names.toString();
    names = names.replace(/,/g, ', ');
    
    let fullscreen = `<div class="fullscreen"><h3>Now entering the ring</h3><h2 class="${wrestlerClass}">${wrestler}!</h2><p class="userName">Start drinking: <span>${names}</span></p></div>`;//create a variable that is a fullscreen overlay
     $(fullscreen).appendTo('main'); //append it to main area of html
	setTimeout(function(){ $(".fullscreen").addClass("reveal") }, 100); //after 100ms, fade in
	 $(".inactive." + wrestlerClass).addClass("active");//change wrestler in grid to active colors
  setTimeout(function(){ $(".fullscreen").removeClass("reveal").addClass("fade") }, 4000);
	setTimeout(function(){ $(".fullscreen").removeClass("fade").addClass("hide") }, 5000);//after 4 seconds, hide overlay
});   //end	 
    
    

//mark wrestlers as exited when pill clicked on
$('#in-the-ring').on('click', '.pill', function() { 
		playAudio("http://matthewsasso.com/royalrumble/sounds/explosion.wav");

 $(this).remove();
	wrestlerName = $(this).html(); 
	let wrestlerClass = wrestlerName.replace(/^[^A-Z]+|[\W]+/ig, "")
    let nl = document.querySelectorAll(".list-of-wrestlers > ." + wrestlerClass); // get nodelist
    let arr = [];
    let names = [];
    for(let i = nl.length; i--; arr.unshift(nl[i])); // convert nodelist to array
    for (let x in arr) {
    let userName = $(arr[x]).parent().parent().find("h2").html();
    names.push(userName);
    }   
    
    names = names.toString();
    names = names.replace(/,/g, ', ');
    
    $(".list-of-wrestlers ." + wrestlerClass).removeClass("active").addClass("dead");
 let fullscreen = `<div class="fullscreen red"><h2>${wrestlerName}</h2><h3>Is dead!</h3><p class="userName">Finish drinking: <span>${names}!</span></p></div>`;//create a variable that is a fullscreen overlay
     $(fullscreen).appendTo('main'); //append it to main area of html
	setTimeout(function(){ $(".fullscreen").addClass("reveal") }, 100); //after 100ms, fade in
	 $(".inactive." + wrestlerClass).addClass("active");//change wrestler in grid to active colors
	setTimeout(function(){ $(".fullscreen").removeClass("reveal").addClass("fade") }, 4000);
	setTimeout(function(){ $(".fullscreen").removeClass("fade").addClass("hide") }, 5000);//after 4 seconds, hide overlay
});
	
	
//revive accidental deaths
$('section').on('click', '.dead', function() { 
 $(this).removeClass("dead").addClass("active");
$(this).find("p").removeClass("dead");
	wrestlerName = $(this).find("p").html(); 
	let wrestlerClass = wrestlerName.replace(/^[^A-Z]+|[\W]+/ig, "")
	$("#in-the-ring").append(`<span class="${wrestlerClass} pill">${wrestlerName}</span>`);
}); 
    
    

	
/********************
reusable functions 
*******************/
	
///play audio
	function playAudio(url) {
  new Audio(url).play();
}
	
//take an array and make it a multidimensional array based on how many wrestlers per player we set	
let squash = (arr, num) => {
 let results = [];
 let start, end;
 for (let i = 1; i < arr.length; i++) {
  start = (i - 1) * num;
  end = i * num;
  let sliced = arr.slice(start, end);
  if (start >= arr.length) { // need to make sure we don't go passed the end
   break;
  }
  results.push(sliced);
 }
 return results;
}; //end
	

//shuffle wrestler list array
const SHUFFLE = (names) => {
  wrestlerNames = names;    
	wrestlerNames = wrestlerNames.map((a) => [Math.random(),a]).sort((a,b) => a[0]-b[0]).map((a) => a[1]);	
  wrestlerNames = squash(wrestlerNames, wrestlersPerPlayer);// runs function that creates multidimensional array
	return wrestlerNames;
}; //end
	
	  

 //loop through the array of wrestler names to get x which is an integer, loop through the sub arrays to get strings which is y
const CREATE_WRESTLER_GRID = () => {
    for (let x in wrestlerNames) {
		 for (let y in wrestlerNames[x]) {
		let wrestlerClass = wrestlerNames[x][y].replace(/^[^A-Z]+|[\W]+/ig, "")
			 	$(".player" + x +  " .list-of-wrestlers").append(`<div class='wrestler-card inactive ${wrestlerClass}'><button type='button' class=''></button><p>${wrestlerNames[x][y]}</p></div>`);
		 }
	 };
	  
	//if not enough players 
	 if (numberOfPlayers * wrestlersPerPlayer < 30) {
		 for (let x = numberOfPlayers; x<=wrestlerNames.length; x++) {
			 for (let y in wrestlerNames[x]) {		 
				 let wrestlerClass = wrestlerNames[x][y].replace(/^[^A-Z]+|[\W]+/ig, "")
                 extra.push(wrestlerNames[x][y]); //add names to array that keeps extra unused wrestlers;
				 	$(".extra-wrestlers").removeClass('hidden');
			 	$(".extra-wrestlers .list-of-wrestlers").append(`<div class='wrestler-card inactive ${wrestlerClass}'><button type='button' class=''></button><p>${wrestlerNames[x][y]}</p></div>`);
			 }
		 }
	 } else if (numberOfPlayers * wrestlersPerPlayer > 30){ //if too many players
		 let  merged = [].concat.apply([], wrestlerNames); // merge our multidimensional array to one
		 merged = merged.map((a) => [Math.random(),a]).sort((a,b) => a[0]-b[0]).map((a) => a[1]);	//shuffle that array
		  let excessWrestlers = [];

       excessWrestlers = squash(merged, wrestlersPerPlayer);//call remerge array function
		 
		    let startLoop = Math.ceil(30/wrestlersPerPlayer); // divide the total num of wrestlers by WPP, round up.
		    let stopLoop = numberOfPlayers - startLoop; //stop after number of players minus start. basically get how many iterations we need to do
		 		//loop through our new array, stop after we finish adding wrestlers to the remaining players
		 		 for (let x = 0; x <= excessWrestlers.length && x <= stopLoop; x++) {
					 let z = x + startLoop; // get an integer based on the remaining players so we can assign them the proper class in css
					 for (let y in excessWrestlers[x]) {
						 let wrestlerClass = excessWrestlers[x][y].replace(/^[^A-Z]+|[\W]+/ig, "")
				 	$(".player" + z +  " .list-of-wrestlers").append(`<div class='wrestler-card inactive ${wrestlerClass}'><button type='button' class=''></button><p>${excessWrestlers[x][y]}</p></div>`);
					 }
		 }
	 }
    
    
}//end
	

	
/******* Listen for timestamp of video, find match in exitTimes, do things if matched. ***/
  // Get the video element
  const video = document.querySelector('video');

  // Add an event listener for the 'play' event
  video.addEventListener('play', () => {
    // Set an interval to run every 1000 milliseconds (1 second)
    const interval = setInterval(() => {
      // Get the current timestamp of the video
      const videoTimestamp = Math.round(video.currentTime);
 

//Define the array we want to search as the exitTimes array    
const array = exitTimes;
        
//Search the exitTimes array for a match to the videoTimestamp
const found = array.find(number => number === videoTimestamp);

if (found) {
  console.log(`WOOOOO!!! The value "${videoTimestamp}" was found in the array.`);
} else {
  console.log(`The value "${videoTimestamp}" was not found in the array.`);
}
//end find function   
        
        
    }, 1000);

    // Clear the interval when the video stops playing
    video.addEventListener('ended', () => {
      clearInterval(interval);
    });
  });   
    //end video functions
  
    
	
	});