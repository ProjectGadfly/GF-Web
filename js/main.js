
var submit = false;
var tagDict = {};

function replaceTemplate(submit) {
    if (submit === true) {
        $('div.front-page').remove();
        $('div.hidden').removeClass('hidden');
    }
}

var testJSON = { "Results": [{ "party": "Republican", "phone": "202-224-3254", "tags": [3, 1], "picURL": "https://pbs.twimg.com/profile_images/817365634434695168/dHmvZNA2_400x400.jpg", "email": "", "name": "Joni Ernst" }, { "party": "Republican", "phone": "202-224-3744", "tags": [3, 1], "picURL": "https://pbs.twimg.com/profile_images/37902202/Official_Portrait__cropped__September_2007_400x400.jpg", "email": "", "name": "Charles Grassley" }, { "party": "Republican", "phone": "202-225-2911", "tags": [4, 1], "picURL": "https://pbs.twimg.com/profile_images/563377937609547776/QgjEd3ns_400x400.jpeg", "email": "", "name": "Rod Blum" }, { "party": "Republican", "phone": "515-281-3221", "tags": [4, 2], "picURL": "https://www.legis.iowa.gov/photo?action=getPhoto&ga=87&pid=10757", "email": "dave.maxwell@legis.iowa.gov", "name": "Dave Maxwell" }, { "party": "Republican", "phone": null, "tags": [3, 2], "picURL": "https://www.legis.iowa.gov/photo?action=getPhoto&ga=87&pid=6567", "email": "tim.kapucian@legis.iowa.gov", "name": "Tim L. Kapucian" }], "Status": "OK" };

function retrieveReps(data) {
    console.log("In retrieveReps")
    var newContent = '';

    //$(function() {
        //e.preventDefault();
        //var responseObject = JSON.parse(data);
        console.log(data);
        for (var i = 0; i < data.Results.length; i++) {
            newContent += '<div class= "Representative' + i + ' featurette">';
            if(i%2 === 0){
            newContent += '<img class="featurette-image pull-left img-circle" src="' + data.Results[i].picURL + '" + style="width: 400px; height: 400px">';
          }else{
            newContent += '<img class="featurette-image pull-right img-circle" src="' + data.Results[i].picURL + '" + style="width: 400px; height: 400px">';
          }
            //newContent += '<h2 class="featurette-heading"> <b> Representative Name </b>' + '</h2>';

            // Hacky fix to unwrap tags
            var parsedTags = ""
            for (tag of tags)
            {
                if (tag == 1)
                    parsedTags += "Federal"
                else if (tag == 2)
                    parsedTags += "State"
                else if (tag == 3)
                    parsedTags += "Senator"
                else
                    parsedTags += "Representative"
            }


            newContent += '<h2 class="featurette-heading"> <b>' + data.Results[i].name + '</b> </h2>';
            newContent += '<p class= "lead"> <b>Phone:</b> ' + data.Results[i].phone + '</p>';
            newContent += '<p class= "lead"> <b>Email:</b> ' + data.Results[i].email + '</p>';
            newContent += '<p class= "lead"> <b>Party:</b> ' + data.Results[i].party + '</p>';
            //newContent += '<p class= "lead"> <b>Tags:</b> ' + data.Results[i].tags.toString() + '</p>';
            newContent += '<p class= "lead"> <b>Tags:</b> ' + parsedTags + '</p>';
            newContent += '</div>';
            newContent += '<hr class="featurette-divider">';
        }
    //}
    //);
    console.log(newContent);
    return newContent;
}

function editData(data) {
    $('#content').html(retrieveReps(data)).hide().fadeIn(400);
}
$('#address-form').on('submit', function(e) {
    //e.preventDefault();
    console.log("1");
    submit = true;

    console.log("2");
    var address = $('#autocomplete').val();
    address = address.replace(/\ /g, '+');
    var link = 'http://gadfly.mobi/services/v1/representatives?address=' + address; // URL to load
    var alltagsLink = 'http://gadfly.mobi/services/v1/alltags'
    console.log($('#autocomplete').val())
        //var $content = $('#content'); // Cache selection


    $.ajax({
        type: "GET", // GET or POST
        url: link, // Path to file
        //headers:{'APIKey':'v1key'}, // Waiting time
        beforeSend: function(request) { // Before Ajax 
            request.setRequestHeader("APIKey", "v1key");
            $('#content').append('<div id="load">Loading</div>'); // Load message
             
        },
        complete: function(data) { // Once finished
            $('#load').remove(); // Clear message
        },
        success: function(data) { // Show content
            console.log(data);
            console.log(String(data)); 



            // Call API get all tags to parse tags returned in representative data
            $.ajax({
            console.log("Getting all tags");
            type: "GET", // GET or POST
            url: alltagsLink, // API path
            beforeSend: function(request) { // Before Ajax 
                request.setRequestHeader("APIKey", "v1key");
                $('#content').append('<div id="load">Loading</div>'); // Load message
                 
            },
            complete: function(tagData) { // Once finished
                $('#load').remove(); // Clear message
            },
            success: function(tagData) { // Show content
                console.log(tagData);
                console.log(String(tagData)); 
                tagDict = JSON.parse(tagData);
            },
            error: function() { // Show error msg 
                $('#content').append('<div id="container">Please try again soon.</div>');
            }});

            $('#content').html(retrieveReps(data)).hide().fadeIn(400);
        },
        error: function() { // Show error msg 
         
          //replaceTemplate(submit); //testing JSON parse
           //$('#content').html(retrieveReps(testJSON)).hide().fadeIn(400); //testing JSON parse
            $('#content').append('<div id="container">Please try again soon.</div>');
        }
    });
    
    replaceTemplate(submit);
    console.log("3");
}); {
    if (submit === true) {
        $('div.front-page').remove();
        $('div.hidden').removeClass('hidden');
    }
}
