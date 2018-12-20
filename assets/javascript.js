$(document).ready(function() {
    var topics = ["Brad Pitt", "Angelina Jolie", "Jennifer Lawrence", "Tom Hanks", "Robert De Niro", "Johnny Depp", "Al Pacino", "Denzel Washington", "Russell Crowe", "Leonardo DiCaprio", "Tom Cruise", "John Travolta", "Arnold Schwarzenegger", "Kate Winslet", "Christian Bale", "Morgan Freeman", "Keanu Reeves", "Nicolas Cage", "Hugh Jackman", "Bruce Willis", "Will Smith", "Keira Knightly", "Vin Diesel", "Matt Damon", "Catherine Zeta-Jones", "George Clooney", "Scarlett Johansson", "Robert Downey, Jr.", "Sandra Bullock", "Meg Ryan", "Megan Fox", "Nicole Kidman", "Cameron Diaz", "Katherine Heigl"];
    var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + topics + "&api_key=HauhqwQL2R2AM9YsD534mHau5NQBTYe7&limit=10";
    var btns = 0;
    //I need some kind of search like: var search = prompt("enter a search for GIFs");

    function renderButtons(topics) {
        var newButton = $("<input>").attr({
        type:"button",
        value: topics,
        id: "btn" + btns
        });
        $("body").append(newButton);
    }

    for(var i = 0; i < topics.length; i++){
        renderButtons(topics[i]);
        btns++;
    }

    //Change this to display the button clicked on
    function displayImages(response) {
        response.data.forEach(function(image) {
            var newDiv = $("body").append("<div>");
            var newImage = $("<img>").attr("src", image.images.fixed_height_downsampled.url);
            $(newDiv).append(newImage);          
        });
    }

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response){
        console.log(response);
        displayImages(response);
    })

/* 
Pseudocode:
When the user clicks on a button, the page should grab 10 static, non-animated gif images from the GIPHY API and place them on the page.
When the user clicks one of the still GIPHY images, the gif should animate. If the user clicks the gif again, it should stop playing.
Under every gif, display its rating (PG, G, so on).
    This data is provided by the GIPHY API.
    Only once you get images displaying with button presses should you move on to the next step.
Add a form to your page takes the value from a user input box and adds it into your topics array. Then make a function call that takes each topic in the array remakes the buttons on the page.
*/
    
})