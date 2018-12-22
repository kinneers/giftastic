$(document).ready(function() {
    var topics = ["Brad Pitt", "Angelina Jolie", "Jennifer Lawrence", "Tom Hanks", "Robert De Niro", "Johnny Depp", "Al Pacino", "Denzel Washington", "Russell Crowe", "Leonardo DiCaprio", "Tom Cruise", "John Travolta", "Arnold Schwarzenegger", "Kate Winslet", "Christian Bale", "Morgan Freeman", "Keanu Reeves", "Nicolas Cage", "Hugh Jackman", "Bruce Willis", "Will Smith", "Keira Knightly", "Vin Diesel", "Matt Damon", "Catherine Zeta-Jones", "George Clooney", "Scarlett Johansson", "Robert Downey, Jr.", "Sandra Bullock", "Meg Ryan", "Megan Fox", "Nicole Kidman", "Cameron Diaz", "Katherine Heigl"];
    var btns = 0;
    var selection='';

    $("#select-topic").on('click', function(event) {
        event.preventDefault();
        selection = $('#topic-input').val().trim();
        topics.push(selection);
        $('#topic-input').val('');
        $(".buttons").empty();
      
        //Checks that there is text in the form field
        for(var i = 0; i < topics.length; i++){
            renderButtons(topics[i]);
            btns++;
        }
        if (!selection) {
            $('#topic-input').after("Please enter a name to continue.");
            return false;
        }
        else {
            console.log(selection);
          
        }
        console.log(topics);
    })


    function renderButtons(topics) {
        var newButton = $("<input>").attr({
        type:"button",
        value: topics,
        id: "btn" + btns
        });
        newButton.addClass('topic')
        $(".buttons").append(newButton);
    }
    for(var i = 0; i < topics.length; i++){
        renderButtons(topics[i]);
        btns++;
    }
  

    $(document).on('click', '.topic', function(){
        var topic = $(this).attr('value');
        $.ajax({
            url: "https://api.giphy.com/v1/gifs/search?q=" + topic + "&api_key=HauhqwQL2R2AM9YsD534mHau5NQBTYe7&limit=10",
            method: "GET"
        }).then(function(response){
            console.log(response);
            $('.grid').html('<h2>Click an Image to Animate the GIF');
            displayImages(response);
        }) 
    })

/*
    $("button").on("click", function() {
        var choice = $(this).val();
  
        var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + choice + "&api_key=HauhqwQL2R2AM9YsD534mHau5NQBTYe7&limit=10";
*/
    //Change this to display the button clicked on
    function displayImages(response) {
        response.data.forEach(function(image) {
            var newDiv = $("<div>");
            
            //Both images work, but I need to trad the data attribute after appending to the page
            var newImage = $("<img>").attr("class", "gif grid-item").attr("data-state", "still").attr("src", image.images.fixed_width_still.url).attr("data-animate", image.images.fixed_width.url).attr("data-still", image.images.fixed_width_still.url);
            newDiv.append(newImage);
            $('.grid').append(newDiv);
           
        });   
        
        $(".gif").on("click", function() {
            var state = $(this).attr("data-state");
            console.log(state);
      
            if (state === "still") {
              $(this).attr("src", $(this).attr("data-animate"));
              $(this).attr("data-state", "animate");
            }
      
            else {
              $(this).attr("src", $(this).attr("data-still"));
              $(this).attr("data-state", "still");
            }
        });    
    }

  

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