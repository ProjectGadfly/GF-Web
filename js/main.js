/*var resultTemplateHead = '<meta charset="utf-8"> \
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"> \
        <title></title>\
        <meta name="description" content="">\
        <meta name="viewport" content="width=device-width, initial-scale=1">\
        <link rel="apple-touch-icon" href="apple-touch-icon.png">\
        <link rel="stylesheet" href="css/bootstrap.min.css">\
        <style>\
            body {\
                padding-top: 100px;\
                padding-bottom: 20px;\
            }\
      h2.ProjectName {\
        color: White;\
      }\
      .navbar-brand.click {\
        padding-right: 3%;\
              padding-top: 0.5%;\
              padding-left: 0px;\
      }\
      :after, :before {\
        webkit box sizing: border box;\
        moz box sizing: border box;\
        box-sizing: border-box;\
      }\
  </style>\
        <link rel="stylesheet" href="css/bootstrap-theme.min.css">\
        <link rel="stylesheet" href="css/main.css">\
        <script src="js/vendor/modernizr-2.8.3-respond-1.4.2.min.js"></script>'

var resultTemplateBody =  '<nav class="navbar navbar-inverse navbar-fixed-top" role="navigation">\
      <div class="container">\
        <div class="navbar-header">\
          <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">\
            <span class="sr-only">Toggle navigation</span>\
            <span class="icon-bar"></span>\
            <span class="icon-bar"></span>\
            <span class="icon-bar"></span>\
            </button>\
            <a class="navbar-brand" href="#">Project Gadfly </a>\
        </div>' +
        '<div id="navbar" class="navbar-collapse collapse">\
          <ul class="nav navbar-nav">\
            <li>\
              <a href="./index.html">Home</a>\
            </li>\
            <li>\
              <a href="./NewScriptPage.html">New Script</a>\
            </li>\
            <li>\
              <a href="./about_us.html">About Us</a>\
            </li>\
            <li>\
              <a href="#">Contact</a>\
            </li>\
          </ul>\
        </div>\ <!--/.nav-collapse -->\ 
      </div>\
    </nav>\
    <div class="jumbotron">\
      <div class="container">\
        <h1>Welcome to Gadfly</h1>\
        <p>This is where you start to change the world.</p>\
       </div>\
    </div>\
    <div class="container">\
    <div id="content">\
      <!-- Example row of columns -->\
      <div class="row">\
        <div class="col-md-6">\
          <h2>Representative1</h2>\
    <img class="img-circle" src="vikings.jpg" alt="cannot find image" width="200" height="200">\     
    <p>\ Jason Borne </p>\
          <p><a class="btn btn-default" href="#" role="button">View details &raquo;</a></p>\
        </div>\
        <div class="col-md-6">\
          <h2>Representative2</h2>\
    <img class="img-circle" src="lagertha.jpeg" alt="cannot find image" width="200" height="200" >\
          <p>James Bond </p>\
          <p><a class="btn btn-default" href="#" role="button">View details &raquo;</a></p>\
        </div>\
      </div>\
      <iframe src="https://www.w3schools.com/html/html_iframe.asp" width="100%" height="301"  name="iframe_a" ></iframe>\
      <hr>\
</div>\
      <footer>\
        <p>&copy; Project Gadfly 2017</p>\
      </footer>\
    </div>'*/

var submit = false;

function replaceTemplate(submit) {
    if (submit === true) {
        $('div.front-page').remove();
        $('div.hidden').removeClass('hidden');
    }
}

var testJSON = '{ "Results": [{ "party": "Republican", "phone": "202-224-3254", "tags": [3, 1], "picURL": "https://pbs.twimg.com/profile_images/817365634434695168/dHmvZNA2_400x400.jpg", "email": "", "name": "Joni Ernst" }, { "party": "Republican", "phone": "202-224-3744", "tags": [3, 1], "picURL": "https://pbs.twimg.com/profile_images/37902202/Official_Portrait__cropped__September_2007_400x400.jpg", "email": "", "name": "Charles Grassley" }, { "party": "Republican", "phone": "202-225-2911", "tags": [4, 1], "picURL": "https://pbs.twimg.com/profile_images/563377937609547776/QgjEd3ns_400x400.jpeg", "email": "", "name": "Rod Blum" }, { "party": "Republican", "phone": "515-281-3221", "tags": [4, 2], "picURL": "https://www.legis.iowa.gov/photo?action=getPhoto&ga=87&pid=10757", "email": "dave.maxwell@legis.iowa.gov", "name": "Dave Maxwell" }, { "party": "Republican", "phone": null, "tags": [3, 2], "picURL": "https://www.legis.iowa.gov/photo?action=getPhoto&ga=87&pid=6567", "email": "tim.kapucian@legis.iowa.gov", "name": "Tim L. Kapucian" }], "Status": "OK" }';

function retrieveReps(data) {
    console.log("In retrieveReps")
    var newContent = '';

    //$(function() {
        //e.preventDefault();
        var responseObject = JSON.parse(data);

        for (var i = 0; i < responseObject.Results.length; i++) {
            newContent += '<div class= "Representative' + i + '">';
            newContent += '<p> Representative Name:' + responseObject.Results[i].name + '</p>';
            newContent += '<img src="' + responseObject.Results[i].picURL + '">';
            newContent += '<p> Phone:' + responseObject.Results[i].phone + '</p>';
            newContent += '<p> Email:' + responseObject.Results[i].email + '</p>';
            newContent += '<p> Party:' + responseObject.Results[i].party + '</p>';
            newContent += '<p> Tags:' + responseObject.Results[i].tags.toString() + '</p>';
            newContent += '</div>';
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
    alert(address);
    var link = 'http://gadfly.mobi/services/v1/representatives?address=' + address; // URL to load
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
            var JSON = '' + JSON.stringify(data); 
            $('#content').html(retrieveReps(JSON)).hide().fadeIn(4000);
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
