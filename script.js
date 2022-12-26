$(document).ready(function() {


     
     
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

//show loading icon while call is running
$("#loader").removeClass("hidden").addClass("show");
    
// Call the google sheets function and pass in the selected year as the sheet name to get
getSheetData(showYear,"A2:G31").then(rows => {
 
// Loop through the rows in the sheet
  for (const row of rows) {
    // Add the wrestler's name from the row to the names array
    names.push(row[1]);
    order.push(row[1]);
    timeInRing.push(row[4])
  }     
    
    
// emby URL setting based on the year
let emby;

switch (showYear) {
  case '1988':
    emby = 'http://66.10.240.172:8096/emby/Items/51979/Download?api_key=bd95d73a55bf434c93f38f64cbf28996&mediaSourceId=f57410d4a6de6ac12791cd9af7cbbb63';
    break;
  case '1989':
    emby = 'http://66.10.240.172:8096/emby/Items/53179/Download?api_key=bd95d73a55bf434c93f38f64cbf28996&mediaSourceId=8c4ccc4616434c2a0cf4e68652d20e11';
    break;
  case '1990':
    emby = 'http://66.10.240.172:8096/emby/Items/53180/Download?api_key=bd95d73a55bf434c93f38f64cbf28996&mediaSourceId=3d384597ea2685162093ec878c842db3';
    break;
  case '1991':
    emby = 'http://66.10.240.172:8096/emby/Items/53181/Download?api_key=bd95d73a55bf434c93f38f64cbf28996&mediaSourceId=333a2df9e95638b96e0e353dd9ebbccd';
    break;
  case '1992':
    emby = 'http://66.10.240.172:8096/emby/Items/51976/Download?api_key=bd95d73a55bf434c93f38f64cbf28996&mediaSourceId=2adb70a732f4b63eda1ba61a2338f836';
    break;
//WE ARE HERE
  case '1993':
    emby = 'http://66.10.240.172:8096/emby/Items/53182/Download?api_key=bd95d73a55bf434c93f38f64cbf28996&mediaSourceId=0d515eac6492066a981d01c45ccba2f8';
    break;
  case '1994':
    emby = 'http://66.10.240.172:8096/emby/Items/53183/Download?api_key=bd95d73a55bf434c93f38f64cbf28996&mediaSourceId=eb8128261658fcbe99ffecf4ac60e48c';
    break;
  case '1995':
    emby = 'http://66.10.240.172:8096/emby/Items/53184/Download?api_key=bd95d73a55bf434c93f38f64cbf28996&mediaSourceId=91ca9315f1b56fffd94652530a5573c1';
    break;
  case '1996':
    emby = 'http://66.10.240.172:8096/emby/Items/53185/Download?api_key=bd95d73a55bf434c93f38f64cbf28996&mediaSourceId=85690b4a4d19d12f71bdf901b035d768';
    break;
  case '1997':
    emby = 'http://66.10.240.172:8096/emby/Items/51980/Download?api_key=bd95d73a55bf434c93f38f64cbf28996&mediaSourceId=c7995858dabb94405a88da0b1559ffc8';
    break;
  case '1998':
    emby = 'http://66.10.240.172:8096/emby/Items/53186/Download?api_key=bd95d73a55bf434c93f38f64cbf28996&mediaSourceId=f0ae05efb146717dfe1a9321cc569b5a';
    break;
  case '1999':
    emby = 'http://66.10.240.172:8096/emby/Items/53187/Download?api_key=bd95d73a55bf434c93f38f64cbf28996&mediaSourceId=305b8a99f9f8402fd38bd282846b8368';
    break;
  case '2000':
    emby = 'http://66.10.240.172:8096/emby/Items/51977/Download?api_key=bd95d73a55bf434c93f38f64cbf28996&mediaSourceId=a61c633116b23ae6a97eda3f2ca835b0';
    break;
  case '2001':
    emby = 'http://66.10.240.172:8096/emby/Items/51978/Download?api_key=bd95d73a55bf434c93f38f64cbf28996&mediaSourceId=697d5b13c99a16d99050fdf8b78d3764';
    break;
  case '2002':
    emby = 'http://66.10.240.172:8096/emby/Items/51981/Download?api_key=bd95d73a55bf434c93f38f64cbf28996&mediaSourceId=11fad60adead0f350a469e3776829816';
    break;
  case '2003':
    emby = 'http://66.10.240.172:8096/emby/Items/51982/Download?api_key=bd95d73a55bf434c93f38f64cbf28996&mediaSourceId=239802ced7c1de325846199c5365495c';
    break;
  case '2004':
    emby = 'http://66.10.240.172:8096/emby/Items/51983/Download?api_key=bd95d73a55bf434c93f38f64cbf28996&mediaSourceId=7adc297c364a3546fd68a590c551042e';
    break;
  case '2005':
    emby = 'http://66.10.240.172:8096/emby/Items/51984/Download?api_key=bd95d73a55bf434c93f38f64cbf28996&mediaSourceId=743b38c8f3639d137ab2699d75dc488d';
    break;
  case '2006':
    emby = 'http://66.10.240.172:8096/emby/Items/51985/Download?api_key=bd95d73a55bf434c93f38f64cbf28996&mediaSourceId=3bfd5a26f826a86ff3d0e0f34efd308e';
    break;
  case '2007':
    emby = 'http://66.10.240.172:8096/emby/Items/53188/Download?api_key=bd95d73a55bf434c93f38f64cbf28996&mediaSourceId=79dafaaab4336b24f71be1187fb8cbb1';
    break;
  case '2008':
    emby = 'http://66.10.240.172:8096/emby/Items/53189/Download?api_key=bd95d73a55bf434c93f38f64cbf28996&mediaSourceId=05a8b14d3d639e1b466021c9414cdcf4';
    break;
  case '2009':
    emby = 'http://66.10.240.172:8096/emby/Items/53190/Download?api_key=bd95d73a55bf434c93f38f64cbf28996&mediaSourceId=78d689c2716c80ae4ebf3f72a1ca21df';
    break;
  case '2010':
    emby = 'http://66.10.240.172:8096/emby/Items/53191/Download?api_key=bd95d73a55bf434c93f38f64cbf28996&mediaSourceId=697f21661d331cada29e0b2c259761a2';
    break;
  default:
    emby = null;
}
// Define the video element and the video source
const video = document.querySelector('video');
// Set the src attribute of the video element
video.setAttribute('src', emby);

//Promise is used to make sure this is done running before we call it again to make sure the network call is done before we actually try to use the data
return Promise.resolve();
}); //done
      
    
//calling getSheetdata again in order to check to make sure if the first time we called it is finished, so then we can't do everything inside this function until the network call is done.  
  getSheetData().then(() => {
    
    $("#loader").removeClass("show").addClass("hidden");
      
 // Use the name values from the sheet
     setTimeout(function () {   
  

    SHUFFLE(names); //run shuffle function, which includes function to create multidimensional array
    CREATE_WRESTLER_GRID(); // run function that puts wrestlers in DOM   
    $("#wrestler-assignment").removeClass("show").addClass("hidden");
    $("header").addClass("slideUp");
    $("#get-ready").removeClass("hidden").addClass("show");
    $("#start").html(`start the ${showYear} royal rumble`);
    $("#start").addClass(showYear);
    return showYear;
     }, 800); 
}); //end
    

 /********* "are you ready" section ******/
 $('#start').click(function() {
    $("#button-frame").removeClass("show").addClass("hidden");
    $("#top").removeClass("hidden").addClass("show");
     $("#bottom").removeClass("hidden").addClass("show");
     $("#get-ready").addClass("playing");
     $("#notification-container").prepend(`<button id="next-wrestler" type="button">ADD NEW</button>`);
     const htmlElement = document.querySelector('html');
     setTimeout(function () {   
     $("body").addClass("playing");
     $(".wrestler-card p").addClass("playing");
    $(".extra-wrestlers").remove();
 }, 800); 
     
// Define the DOM object to cut
const elementToCut = document.getElementById('player-grid');

// Cut the element by removing it from the DOM
elementToCut.remove();

// Define the DOM object to paste the cut element after
const referenceElement = document.getElementById('bottom');

// Paste the cut element after the reference element
referenceElement.append(elementToCut);

/*** add a comma to the wrestler list
const commas = document.querySelectorAll('.wrestler-card:not(:last-child) p');
commas.forEach(element => {
  element.innerHTML += ',';
}); **/
     
/*add a separator to the player name title
const hyphens = document.querySelectorAll('.player-grid h2');
hyphens.forEach(element => {
  element.innerHTML += ' - ';
}); */
     
//get height of bottom section and use it to size the top sections
const topSection = document.querySelector('#top');
const vid = document.querySelector('video');
const notificationContainer = document.querySelector('#notification-container');
const bottom = document.querySelector('.player-section');

topSection.style.height = `calc(100vh - ${bottom.offsetHeight}px  - 4px)`;
vid.style.height = `calc(100vh - ${bottom.offsetHeight}px  - 4px)`;
notificationContainer.style.height = `calc(100vh - ${bottom.offsetHeight}px) - 4px`;
   });
	});    //end	
    
    
//******* shufle wrestlers again if needed *****//
$('#get-wrestlers').click(function() {

// Clear the cards
$(".wrestler-card").remove(); 

 // reshuffle
setTimeout(function () {
    SHUFFLE(names); //run shuffle function, which includes function to create multidimensional array
    CREATE_WRESTLER_GRID(); // run function that puts wrestlers in DOM   
}, 500);    

 }); //end reshuffle
    
    
    
    
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
     
let wrestler = order[count]; // wrestler name, array position
let wrestlerClass = wrestler.replace(/^[^A-Z]+|[\W]+/ig, "") //remove spaces and special chars
	
    let nl = document.querySelectorAll(".list-of-wrestlers > ." + wrestlerClass); // get nodelist
    let arr = [];
    let playerNames = ["Extra Wrestlers"];
    for(let i = nl.length; i--; arr.unshift(nl[i])); // convert nodelist to array
    for (let x in arr) {
    let userName = $(arr[x]).parent().parent().find("h2").html();
    playerNames.push(userName);
    }   
    
    playerNames = playerNames.toString();
    playerNames = playerNames.replace(/,/g, ', ');
    playerNames = playerNames.replace(/-/g, '');
    
    $(".inactive." + wrestlerClass).addClass("active");//change wrestler in grid to active colors
  
    
    let notification; 
    
// do not tell extra wrestlers user to drink
    if (playerNames == 'Extra Wrestlers') {
         notification = `<div class="notification noti-${wrestlerClass}"><h3><span>${wrestler}</span> entered!</h3><h3 class="userName">Everyone take a sip!</h3></div>`;//create a notification variable
    } else {
        const realPlayerNames = playerNames.slice(17);
        notification = `<div class="notification noti-${wrestlerClass}"><h3><span>${wrestler}</span> entered!</h3><h3 class="userName">Start drinking: <span>${realPlayerNames}</span></h3></div>`;//create a notification variable
    } //end if statement
    
    $(notification).appendTo('#notification-container'); //append it to notification area of html
    
	setTimeout(function(){ 
        $(".noti-" + wrestlerClass).addClass("reveal");
    }, 100); //after 100ms, slide-in
    
  setTimeout(function(){ 
      $(".noti-" + wrestlerClass).removeClass("reveal").addClass("slide-out");
        }, 20000);
	setTimeout(function(){ 
        $(".noti-" + wrestlerClass).removeClass("slide-out").addClass("hide");      
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
    let nl = document.querySelectorAll(".list-of-wrestlers > ." + wrestlerClass); // select the wrestler card from the list based on their CSS class
    let arr = [];
    let playerNames = ["Extra Wrestlers"];
    for(let i = nl.length; i--; arr.unshift(nl[i])); // convert nodelist to array
    for (let x in arr) {
    let userName = $(arr[x]).parent().parent().find("h2").html(); // get player name who has this wrestler
    playerNames.push(userName); 
    }  
    
    playerNames = playerNames.toString();
    playerNames = playerNames.replace(/,/g, ', ');
    playerNames = playerNames.replace(/-/g, ''); //remove hyphen from end of player's name
    if (deadCount == 30) {
     console.log("entry times " + entryTimes);
     console.log("exit times " + exitTimes);
    }     
    
$(".list-of-wrestlers ." + wrestlerClass).removeClass("active").addClass("dead");
    
    let notification; 
    
//Show wrestler is dead notification 
     if (playerNames == 'Extra Wrestlers') {
          notification = `<div class="notification red noti-${wrestlerClass}"><h3><span>${wrestlerName}</span> is dead!</h3><h3 class="userName">Everyone take a sip!</h3></div>`;
     } else {
        const realPlayerNames = playerNames.slice(17); 
         notification = `<div class="notification red noti-${wrestlerClass}"><h3><span>${wrestlerName}</span> is dead!</h3><h3 class="userName">Finish drinking: <span>${realPlayerNames}</span></h3></div>`;//create a variable that is a fullscreen overlay
     }
    
     $(notification).appendTo('#notification-container'); //append it to main area of html
	setTimeout(function(){ 
        $(".noti-" + wrestlerClass).addClass("reveal");
        //addWrestlerRunning = true; // lets us know this function is running so other functions won't run  
    }, 100); //after 100ms, slide-in
    
  setTimeout(function(){ 
      $(".noti-" + wrestlerClass).removeClass("reveal").addClass("slide-out");
        }, 20000);
	setTimeout(function(){ 
        $(".noti-" + wrestlerClass).removeClass("slide-out").addClass("hide");      
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
	 } else { //if too many players
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

    
    
    
	
	});