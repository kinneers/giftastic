$(document).ready(function() {
    $('.prompt').hide();
    var topics = ["Brad Pitt", "Angelina Jolie", "Jennifer Lawrence", "Tom Hanks", "Robert De Niro", "Johnny Depp", "Al Pacino", "Denzel Washington", "Russell Crowe", "Leonardo DiCaprio", "Tom Cruise", "John Travolta", "Arnold Schwarzenegger", "Kate Winslet", "Christian Bale", "Morgan Freeman", "Keanu Reeves", "Nicolas Cage", "Hugh Jackman", "Bruce Willis", "Will Smith", "Keira Knightly", "Vin Diesel", "Matt Damon", "Catherine Zeta-Jones", "George Clooney", "Scarlett Johansson", "Robert Downey, Jr.", "Sandra Bullock", "Meg Ryan", "Megan Fox", "Nicole Kidman", "Cameron Diaz", "Katherine Heigl"];
    var btns = 0;
    var selection='';

    //Adds new user selection to array
    $("#select-topic").on('click', function(event) {
        event.preventDefault();
        selection = $('#topic-input').val().trim();
        topics.push(selection);
        $('#topic-input').val('');
        $(".buttons").empty();
      
        //Renders the buttons
        for(var i = 0; i < topics.length; i++){
            renderButtons(topics[i]);
            btns++;
        }

        //Checks that there is text in the form field
        if (!selection) {
            $('.prompt').show();
            return false;
        }
        else {
            console.log(selection);
            $('#topic-input').after().empty();
            $('.prompt').hide();
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
            $('.grid').before('<h2>Click an Image to Animate the GIF');
            displayImages(response);
        }) 
    })

    function displayImages(response) {
        response.data.forEach(function(image) {
            var newDiv = $("<div>");
            var newImage = $("<img>").attr("class", "gif grid-item").attr("data-state", "still").attr("src", image.images.fixed_width_still.url).attr("data-animate", image.images.fixed_width.url).attr("data-still", image.images.fixed_width_still.url);
            //NEED TO ADD RATING
            newDiv.append(newImage);
            $('.grid').append(newDiv);
           console.log(response);
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
})