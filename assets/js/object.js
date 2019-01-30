$(document).ready(function() {
    $('.prompt').hide();
    $('.clickPrompt').hide();
    var topics = ["Brad Pitt", "Angelina Jolie", "Jennifer Lawrence", "Tom Hanks", "Robert De Niro", "Johnny Depp", "Al Pacino", "Denzel Washington", "Russell Crowe", "Leonardo DiCaprio", "Tom Cruise", "John Travolta", "Arnold Schwarzenegger", "Kate Winslet", "Christian Bale", "Morgan Freeman", "Keanu Reeves", "Nicolas Cage", "Hugh Jackman", "Bruce Willis", "Will Smith", "Keira Knightly", "Vin Diesel", "Matt Damon", "Catherine Zeta-Jones", "George Clooney", "Scarlett Johansson", "Robert Downey, Jr.", "Sandra Bullock", "Meg Ryan", "Megan Fox", "Nicole Kidman", "Cameron Diaz", "Katherine Heigl"];
    var btns = 0;
    var selection='';
    var topic;
    var offset = 10;
    var favArray = [];

    function populateDiv(image, placement) {
        //Checks that gif is appropriate for audience prior to adding to page (this is called in the API call now and could be refactored, but I left it as an extra precaution)
        if (image.rating !== "r" && image.rating !== "pg-13") {
            var id = image.id;
            console.log(image.id);
            var newDiv = $(`<div id=${id}>`);
            var newImage = $("<img>")
                        .attr("class", "gif grid-item")
                        .attr("data-state", "still")
                        .attr("src", image.images.fixed_width_still.url)
                        .attr("data-animate", image.images.fixed_width.url)
                        .attr("data-still", image.images.fixed_width_still.url);
            var imageRating = $('<p class="itemContent">').text("Rating: " + image.rating.toUpperCase());
            var imageTitle = $('<p class="itemContent">').text("Title: " + image.title.toUpperCase());
            var imageImportDateTime =$('<p class="itemContent">').text("Imported: " + image.import_datetime);
            var favoriteButton = $(`<button class=addFavorite>&#10084;</button>`)
            newDiv.append(newImage)
                    .append(imageTitle)
                    .append(imageRating)
                    .append(imageImportDateTime)
                    .append(favoriteButton);
            placement.append(newDiv);
            console.log(image);
        }
    }

    //Adds new user selection to topics array
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
            $('#topic-input').after().empty();
            $('.prompt').hide();
            topics.push(selection);
        }
        //Re-renders the buttons after a topic has been added
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

    //For loop to display each selection button initially
    for(var i = 0; i < topics.length; i++){
        renderButtons(topics[i]);
        btns++;
    }

    //ajax call to Giphy
    $(document).on('click tap', '.topic', function(event){
        event.preventDefault();
        topic = $(this).attr('value');
        $.ajax({
            url: "https://api.giphy.com/v1/gifs/search?q=" + topic + "&api_key=HauhqwQL2R2AM9YsD534mHau5NQBTYe7&limit=10&rating=g&rating=pg",
            method: "GET"
        }).then(function(response){
            displayImages(response);
        })
        $('.promptsToChoose').text("");
        offset = 10; //Ensures that the offset returns to 10 when a new topic button is pushed if it has previously been changed by the more button (otherwise less popular gifs will populate on the next call for more gifs)
    })

    //displays each gif retrieved in the results section
    function displayImages(response) {
        $('.grid').empty(); //clears previous content
        $('.clickPrompt').show(); //Shows prompt to click the image to animate
        response.data.forEach(function(image) {
            populateDiv(image, $('#results')); //Appends 10 appropriate images
        });
        $('.grid').append(`<button class='more'>Get More!</button>`); //Appends button to retrieve 10 more gifs on this topic
        
        //Since 10 images have already been populated, the event listener for the call for the next 10 is now on the more button
        $(document).on('click tap', '.more', function(event){
            event.preventDefault();
            $.ajax({
                url: "https://api.giphy.com/v1/gifs/search?q=" + topic + "&api_key=HauhqwQL2R2AM9YsD534mHau5NQBTYe7&limit=10&rating=g&rating=pg&offset=" + offset,
                method: "GET"
            }).then(function(response){
                response.data.forEach(function(image) {
                    populateDiv(image, $('#results')); //Appends next 10 images (fewer if some are inappropriately rated)
                });
                $('.more').hide(); //Hides the previous Add More button
                $('.grid').append(`<button class='more'>Get More!</button>`); //Appends button to retrieve 10 more gifs on this topic to the end of the div
                offset += 10; //Increments the offset to collect the next 10 gifs on the same topic
            })
        })
    } 
    
    //Function to switch between animated or still on click (or tap)
    $(document).on("click tap", ".gif", function(event) {
        event.preventDefault();
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
        var getId = $('.addFavorite').parent().prop('id');
        var makeVal = $('.addFavorite').parent().prop('id');
        favArray.push(makeVal);
        localStorage.setItem(getId, makeVal);
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
        $('.more').hide(); //Hides the previous Add More button
        $('.grid').append(`<button class='more'>Get More!</button>`); //Appends button to retrieve 10 more gifs on this topic to the end of the div
    })

    
    //ajax call to Giphy for favorites
    for ( var i = 0, len = localStorage.length; i < len; ++i ) {
        favArray.push( localStorage.getItem( localStorage.key( i ) ) );
      }
    console.log(favArray);

    for (var i = 0; i < favArray.length; i++) {
        var id = favArray[i];
        console.log(id);

        //Okay, I can get an image of the right person to persist... but it is not necessarily the chosen image... so weird
        $.ajax({
            url: "https://api.giphy.com/v1/gifs/" + id + "?api_key=HauhqwQL2R2AM9YsD534mHau5NQBTYe7",
            method: "GET"
        }).then(function(image){
            console.log(image.data);
            populateDiv(image.data, $('#favs'));
        })
    }   
})