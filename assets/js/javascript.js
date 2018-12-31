$(document).ready(function() {
    $('.prompt').hide();
    $('.clickPrompt').hide();
    var topics = ["Brad Pitt", "Angelina Jolie", "Jennifer Lawrence", "Tom Hanks", "Robert De Niro", "Johnny Depp", "Al Pacino", "Denzel Washington", "Russell Crowe", "Leonardo DiCaprio", "Tom Cruise", "John Travolta", "Arnold Schwarzenegger", "Kate Winslet", "Christian Bale", "Morgan Freeman", "Keanu Reeves", "Nicolas Cage", "Hugh Jackman", "Bruce Willis", "Will Smith", "Keira Knightly", "Vin Diesel", "Matt Damon", "Catherine Zeta-Jones", "George Clooney", "Scarlett Johansson", "Robert Downey, Jr.", "Sandra Bullock", "Meg Ryan", "Megan Fox", "Nicole Kidman", "Cameron Diaz", "Katherine Heigl"];
    var btns = 0;
    var selection='';
    var topic;
    var offset = 10;

    //Adds new user selection to array
    $("#select-topic").on('click', function(event) {
        event.preventDefault();
        selection = $('#topic-input').val().trim();
        $('#topic-input').val('');
        $(".buttons").empty();

        //Checks that there is text in the form field prior to pushing selection to topics array
        if (!selection) {
            $('.prompt').show();
            return false;
        }
        else {
            console.log(selection);
            $('#topic-input').after().empty();
            $('.prompt').hide();
            topics.push(selection);
        }

        //Renders the buttons
        for(var i = 0; i < topics.length; i++){
            renderButtons(topics[i]);
            btns++;
        }
    })

    //Function to create a button
    function renderButtons(topics) {
        var newButton = $("<input>").attr({
        type:"button",
        value: topics,
        id: "btn" + btns
        });
        newButton.addClass('topic')
        $(".buttons").append(newButton);
    }

    //For loop to display each selection button
    for(var i = 0; i < topics.length; i++){
        renderButtons(topics[i]);
        btns++;
    }

    //ajax call to Giphy
    $(document).on('click', '.topic', function(){
        topic = $(this).attr('value');
        $.ajax({
            url: "https://api.giphy.com/v1/gifs/search?q=" + topic + "&api_key=HauhqwQL2R2AM9YsD534mHau5NQBTYe7&limit=10",
            method: "GET"
        }).then(function(response){
            console.log(response);
            displayImages(response);
        })
        $('.promptsToChoose').text("");
    })

    //displays each gif retrieved in the results section
    function displayImages(response) {
        $('.grid').empty(); //clears previous content
        $('.clickPrompt').show(); //Shows prompt to click the image to animate
        response.data.forEach(function(image) {
            //Checks that gif is appropriate for audience prior to adding to page
            if (image.rating !== "r" && image.rating !== "pg-13") {
                var newDiv = $("<div>");
                var newImage = $("<img>").attr("class", "gif grid-item").attr("data-state", "still").attr("src", image.images.fixed_width_still.url).attr("data-animate", image.images.fixed_width.url).attr("data-still", image.images.fixed_width_still.url);
                var imageRating = $('<p>').text("Rating: " + image.rating.toUpperCase());
                var imageTitle = $('<p>').text("Title: " + image.title.toUpperCase());
                var imageImportDateTime =$('<p>').text("Imported: " + image.import_datetime);
                var favoriteButton = $(`<button class=addFavorite>&#10084;</button>`)
                newDiv.append(newImage).append(imageTitle).append(imageRating).append(imageImportDateTime).append(favoriteButton);
                $('#results').append(newDiv);
            }
        });
        $('.grid').append(`<button class='more'>Get 10 More!</button>`); //Appends button to retrieve 10 more gifs on this topic
        $(document).on('click', '.more', function(){
            $.ajax({
                url: "https://api.giphy.com/v1/gifs/search?q=" + topic + "&api_key=HauhqwQL2R2AM9YsD534mHau5NQBTYe7&limit=10&offset=" + offset,
                method: "GET"
            }).then(function(response){
                response.data.forEach(function(image) {
                    //Checks that gif is appropriate for audience prior to adding to page
                    //This code is not DRY, but this is because the event listener is now on the add more button instead of the topic button
                    if (image.rating !== "r" && image.rating !== "pg-13") {
                        var newDiv = $("<div>");
                        var newImage = $("<img>").attr("class", "gif grid-item").attr("data-state", "still").attr("src", image.images.fixed_width_still.url).attr("data-animate", image.images.fixed_width.url).attr("data-still", image.images.fixed_width_still.url);
                        var imageRating = $('<p>').text("Rating: " + image.rating.toUpperCase());
                        var imageTitle = $('<p>').text("Title: " + image.title.toUpperCase());
                        var imageImportDateTime =$('<p>').text("Imported: " + image.import_datetime);
                        var favoriteButton = $(`<button class=addFavorite>&#10084;</button>`)
                        newDiv.append(newImage).append(imageTitle).append(imageRating).append(imageImportDateTime).append(favoriteButton);
                        $('#results').append(newDiv);
                    }
                });
                $('.more').hide(); //Hides the previous Add More button
                $('.grid').append(`<button class='more'>Get 10 More!</button>`); //Appends button to retrieve 10 more gifs on this topic to the end of the div
                offset += 10; //Increments the offset to collect the next 10 gifs on the same topic
            })
        })
    } 
    
    //Function to animate or unanimate gifs on click (or tap)
    $(document).on("click tap", ".gif", function() {
        var state = $(this).attr("data-state");
        if (state === "still") {
          $(this).attr("src", $(this).attr("data-animate"));
          $(this).attr("data-state", "animate");
        }
        else {
          $(this).attr("src", $(this).attr("data-still"));
          $(this).attr("data-state", "still");
        }
    });

    //Moves favorited gifs to favorites area on click of heart button
    $(document).on('click tap','.addFavorite', function(event){
        event.preventDefault();
        var saveFavorite = $(this).parent(); //grabs the div associated with clicked button
        $(this).hide(); //hides the heart (favorite) button
        saveFavorite.append(`<button class='remove'>Remove</button>`); //adds a button to enable the user to remove the favorited gif from favorites
        $('.sidebar').append(saveFavorite); //appends the favorited gif to the sidebar
    })

    //Removes a gif from the favorites upon button click and returns it to the results area
    $(document).on('click tap','.remove', function(event){
        event.preventDefault();
        var removeFavorite = $(this).parent(); //grabs the div associated with clicked button
        $(this).hide();  //hides the remove button
        $('#results').append(removeFavorite); //appends the unfavorited gif back to the results section
        $('#results .addFavorite').show(); //shows the heart button in the returned results
        $('.sidebar .addFavorite').hide();  //keeps the other heart buttons hidden
    })
})