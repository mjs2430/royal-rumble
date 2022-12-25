$(document).ready(function() {


/////***** Get data from Google Sheets *****////
    
 // Replace YOUR_API_KEY with your actual API key
const API_KEY = 'AIzaSyC-9cY7xA-_BsMvRieTFsO4thZp6jkkIKU';

  // Replace SPREADSHEET_ID with the ID of the spreadsheet you want to import
const SPREADSHEET_ID = '1NFjwvQqcK5Aa4NgC37nRg3Tp9TXdzy4tz03RwY_cuMQ';

//******* Define a function to retrieve data from a specific sheet. sheetName is an argument to be passed in later when calling this function. I use it to call in the year and range to skip the first row, the header row ***///
// Define a function to retrieve data from a specific sheet
const getSheetData = async (sheetName, range) => {
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
let entryTimes = [];
let exitTimes = [];
let timeInRing = [];
let showYear = 0; 
let deadCount = 0;
let addWrestlerRunning = false;
let removeWrestlerRunning = false;

    
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
	 $(".player-grid").append(`<div class="extra-wrestlers"><h2>Extra Wrestlers</h2><div class="list-of-wrestlers"></div></div>`);
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
getSheetData(showYear,"A2:F32").then(rows => {
  // Loop through the rows in the sheet
  for (const row of rows) {
    // Add the wrestler's name from the row to the names array
    names.push(row[1]);
    order.push(row[1]);
    timeInRing.push(row[4])
  }     
    
// Define the video element and the video source
const video = document.querySelector('video');
const src = showYear + '.mp4';
// Set the src attribute of the video element
video.setAttribute('src', src);
}) 
      
 // Use the name values from the sheet
setTimeout(function () {
    SHUFFLE(names); //run shuffle function, which includes function to create multidimensional array
    CREATE_WRESTLER_GRID(); // run function that puts wrestlers in DOM   
  $("#wrestler-assignment").removeClass("show").addClass("hidden");
    $("header").addClass("slideUp");
    $("#get-ready").removeClass("hidden").addClass("show");
    $("#start").html(`start the ${showYear} royal rumble`);
    $("#start").addClass(showYear);
}, 500);    
return showYear;
}); //end
    

 /********* "are you ready" section ******/
 $('#start').click(function() {
    $("#button-frame").removeClass("show").addClass("hidden");
    $("#top").removeClass("hidden").addClass("show");
     $("#bottom").removeClass("hidden").addClass("show");
     $("#get-ready").addClass("playing");
     $("#notification-container").prepend(`<button id="next-wrestler" type="button">ADD NEW</button>`);
     
// Define the DOM object to cut
const elementToCut = document.getElementById('player-grid');

// Cut the element by removing it from the DOM
elementToCut.remove();

// Define the DOM object to paste the cut element after
const referenceElement = document.getElementById('bottom');

// Paste the cut element after the reference element
referenceElement.append(elementToCut);

//add a comma to the wrestler list
const commas = document.querySelectorAll('.wrestler-card:not(:last-child) p');
commas.forEach(element => {
  element.innerHTML += ',';
});
     
//add a separator to the player name title
const hyphens = document.querySelectorAll('.player-grid h2');
hyphens.forEach(element => {
  element.innerHTML += ' - ';
});
     

	});    //end	
    
    
//******* shufle wrestlers again if needed *****//
$('#get-wrestlers').click(function() {

//get year from "start" button
const element = document.querySelector('#start');
const year = element.className;
console.log(year); // 'my-class'

// Clear the array
order.splice(0, order.length);
$(".wrestler-card").remove();   

// Call the google sheets function and pass in the selected year as the sheet name to get
getSheetData(year,"A2:F32").then(rows => {
  // Loop through the rows in the sheet
  for (const row of rows) {
    // Add the wrestler's name from the row to the names array
    names.push(row[1]);
    order.push(row[1]);
    timeInRing.push(row[4])
  }     
    
})     

 // reshuffle
setTimeout(function () {
    SHUFFLE(names); //run shuffle function, which includes function to create multidimensional array
    CREATE_WRESTLER_GRID(); // run function that puts wrestlers in DOM   
}, 500);    

 });
    
    
    
    
//add another wrestler to player when .addExtra is clicked
$('.player-grid').on('click', '.addExtra', function() { 
	 if (extra.length > 0) {
    let wrestlerClass = extra[0].replace(/^[^A-Z]+|[\W]+/ig, "")
	$(".extra-wrestlers .list-of-wrestlers ." + wrestlerClass).remove();
$(this).siblings(".list-of-wrestlers").append(`<div class='wrestler-card inactive ${wrestlerClass}'><p>${extra[0]}</p></div>`);
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
                          $(this).siblings(".list-of-wrestlers").append(`<div class='wrestler-card inactive ${addedWrestler}'><p>${merged[1]}</p></div>`);

         } else {
             $(this).siblings(".list-of-wrestlers").append(`<div class='wrestler-card inactive ${addedWrestler}'><p>${merged[0]}</p></div>`);
         }
     }
}); 
	
    
	
//**************** mark wrestlers as entered when click "add new" button ********/
$('#notification-container').on('click', '#next-wrestler', function() { 
  
let video = document.querySelector('video');// Get the video element
let timestamp = Math.round(video.currentTime);// Get the current timestamp of the video
entryTimes.push(timestamp); // add the entryTime to the entryTimes array

playAudio("http://matthewsasso.com/royalrumble/sounds/crowd.wav");
count++; //add to the count so we can use that integer to reference a position in the wrestler array
   
    
// Add timeInRing for this wrestler to their entry timestamp to determine their exitTime, push to exitTimes array
let exitTime = Number(timeInRing[count]) + timestamp;
exitTimes.push(exitTime);
console.log(exitTimes);
     
let wrestler = order[count]; // wrestler name, array position
let wrestlerClass = wrestler.replace(/^[^A-Z]+|[\W]+/ig, "") //remove spaces and special chars
	
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
    names = names.replace(/-/g, '');
    
 $(".inactive." + wrestlerClass).addClass("active");//change wrestler in grid to active colors

     
let notification = `<div class="notification noti-${wrestlerClass}"><h3><span>${wrestler}</span> entered the ring!</h3><h3 class="userName">Start drinking: <span>${names}</span></h3></div>`;//create a variable that is a fullscreen overlay
     $(notification).appendTo('#notification-container'); //append it to main area of html
	setTimeout(function(){ 
        $(".noti-" + wrestlerClass).addClass("reveal");
        //addWrestlerRunning = true; // lets us know this function is running so other functions won't run  
    }, 100); //after 100ms, fade in
    
  setTimeout(function(){ 
      $(".noti-" + wrestlerClass).removeClass("reveal").addClass("fade");
        }, 20000);
	setTimeout(function(){ 
        $(".noti-" + wrestlerClass).removeClass("fade").addClass("hide");      
        //addWrestlerRunning = false; //sets the value to false so other functions will be allowed to run 
 }, 21000);//after 20 seconds, hide overlay 
    
});   //end	 
    
    
    
    
/******* Listen for timestamp of video, find match in exitTimes, do things if matched. ***/
    
   // Get the video element
var video = document.querySelector('video');
    
// Set up an interval to call the getTime function every 1000 milliseconds (1 second)
setInterval(getTime, 1000);

function getTime() {
  // Check if the video is playing
  if (video.paused) {
    return;
  }

  // Get the current time of the video
  var videoTimestamp = Math.round(video.currentTime);

//Define the array we want to search as the exitTimes array    
const array = exitTimes;
        
//Search the exitTimes array for a match to the videoTimestamp
const found = array.find(number => number === videoTimestamp);

//Remove wrestler if found
if (found) {
    
    deadCount++ //count each time a wrestler exits so we can do stuff when all wrestlers are out
    var index = array.indexOf(found);  // Get the index of the closest number in the array
	wrestlerName = order[index];  //gets the wrestler name
	let wrestlerClass = wrestlerName.replace(/^[^A-Z]+|[\W]+/ig, "") //sets the wrestler class we are going to search for based on the name
    console.log(wrestlerClass);
    let nl = document.querySelectorAll(".list-of-wrestlers > ." + wrestlerClass); // select the wrestler card from the list based on their CSS class
    let arr = [];
    let names = [];
    for(let i = nl.length; i--; arr.unshift(nl[i])); // convert nodelist to array
    for (let x in arr) {
    let userName = $(arr[x]).parent().parent().find("h2").html(); // get player name who has this wrestler
    names.push(userName); 
    }  
    
    names = names.toString();
    names = names.replace(/,/g, ', ');
    names = names.replace('-', ''); //remove hyphen from end of player's name
    
    if (deadCount == 30) {
     console.log("entry times " + entryTimes);
     console.log("exit times " + exitTimes);
    }     
    
$(".list-of-wrestlers ." + wrestlerClass).removeClass("active").addClass("dead");
    
//Show wrestler is dead notification    
    let notification = `<div class="notification red noti-${wrestlerClass}"><h3><span>${wrestlerName}</span> is dead!</h3><h3 class="userName">Finish drinking: <span>${names}</span></h3></div>`;//create a variable that is a fullscreen overlay
     $(notification).appendTo('#notification-container'); //append it to main area of html
	setTimeout(function(){ 
        $(".noti-" + wrestlerClass).addClass("reveal");
        //addWrestlerRunning = true; // lets us know this function is running so other functions won't run  
    }, 100); //after 100ms, fade in
    
  setTimeout(function(){ 
      $(".noti-" + wrestlerClass).removeClass("reveal").addClass("fade");
        }, 20000);
	setTimeout(function(){ 
        $(".noti-" + wrestlerClass).removeClass("fade").addClass("hide");      
        //addWrestlerRunning = false; //sets the value to false so other functions will be allowed to run 
 }, 21000);//after 4 seconds, hide overlay 
    
} else { }

} //end find function  
    
    

    

	
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
			 	$(".player" + x +  " .list-of-wrestlers").append(`<div class='wrestler-card inactive ${wrestlerClass}'><p>${wrestlerNames[x][y]}</p></div>`);
		 }
	 };
	  
	//if not enough players 
	 if (numberOfPlayers * wrestlersPerPlayer < 30) {
		 for (let x = numberOfPlayers; x<=wrestlerNames.length; x++) {
			 for (let y in wrestlerNames[x]) {		 
				 let wrestlerClass = wrestlerNames[x][y].replace(/^[^A-Z]+|[\W]+/ig, "")
                 extra.push(wrestlerNames[x][y]); //add names to array that keeps extra unused wrestlers;
				 	$(".extra-wrestlers").removeClass('hidden');
			 	$(".extra-wrestlers .list-of-wrestlers").append(`<div class='wrestler-card inactive ${wrestlerClass}'><p>${wrestlerNames[x][y]}</p></div>`);
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
				 	$(".player" + z +  " .list-of-wrestlers").append(`<div class='wrestler-card inactive ${wrestlerClass}'><p>${excessWrestlers[x][y]}</p></div>`);
					 }
		 }
	 }
    
    
}//end
	

	


    
    
    
	
	});