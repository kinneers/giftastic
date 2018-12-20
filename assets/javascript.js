$(document).ready(function() {
    var topics = ["Add topic array here"]
/* 
Pseudocode:
//Create buttons for each of the topics in the topics array (use a forEach)
When the user clicks on a button, the page should grab 10 static, non-animated gif images from the GIPHY API and place them on the page.
When the user clicks one of the still GIPHY images, the gif should animate. If the user clicks the gif again, it should stop playing.
Under every gif, display its rating (PG, G, so on).
    This data is provided by the GIPHY API.
    Only once you get images displaying with button presses should you move on to the next step.
Add a form to your page takes the value from a user input box and adds it into your topics array. Then make a function call that takes each topic in the array remakes the buttons on the page.

// My API Key    HauhqwQL2R2AM9YsD534mHau5NQBTYe7

    var queryURL = "http://api.giphy.com/v1/gifs/search?q=ducks&api_key=HauhqwQL2R2AM9YsD534mHau5NQBTYe7&limit=10"

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) {
        console.log(response);
        displayImages(response);
    })
    
    function displayImages(response) {
        response.data.forEach(function(image) {
            var newDiv = $("body").append("<div>");
            var newImg = $("<img>").attr("src", image.images.original.url);
            $(newDiv).append(newImg);
        })
    }

FROM EXAMPLE CODE DONE IN CLASS:
    var search = prompt("enter a search for GIFs");
    var limit = parseInt(prompt("how many GIFs do you want?"));
    var queryURL = "http://api.giphy.com/v1/gifs/search?q=" + search + "&api_key=0r2J0GtSqRoCktl3A01SEFoCffJRRGOT&limit=" + limit;

    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(response) {
      console.log(response);
      displayImages(response);
    });

function displayImages(response) {
    
  response.data.forEach(function(image) {
    
    var newDiv = $("body").append("<div>");
    var newImg = $("<img>").attr("src", image.images.original.url);
    $(newDiv).append(newImg);

*/
    
})