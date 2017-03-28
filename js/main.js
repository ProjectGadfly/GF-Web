
var resultTemplateHead = '<meta charset="utf-8"> \
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
        </div>\
        <div id="navbar" class="navbar-collapse collapse">\
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
    <!-- jumbotron  -->\
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
    </div>'

var submit = false;

function replaceTemplate(submit){
    if(submit === true){
    $('div.site-wrapper').html(resultTemplateBody);
  }
}

function retrieveReps(data){
var newContent = '';

  $(function(){
e.preventDefault();
var responseObject = JSON.parse(data);

for (var i = 0; i< responseObject.events.length; i++){
  newContent += '<div class= "Representative' + i + '">';
  newContent += '<p> Representative Name:' + responseObject.event[i].name + '</p>';
  newContent += '<img src="' + responseObject.event[i].picURL + '">';
  newContent += '<p> Phone:' + responseObject.event[i].phone + '</p>';
  newContent += '<p> Email:' + responseObject.event[i].email + '</p>';
  newContent += '<p> Party:' + responseObject.event[i].party + '</p>';
  newContent += '<p> Tags:' + responseObject.event[i].tags.toString() + '</p>';
  newContent += '</div>';
}
    });
  return newContent;
}

$('#address-form').on('submit', function(e) {
  e.preventDefault();
    var link = 'http://gfserver/services/v1/representatives/'; // URL to load
    //var $content = $('#content'); // Cache selection

    $.ajax({
        type: "POST", // GET or POST
        url: link, // Path to file
        timeout : 2000,
        headers: { 'APIKey': 'b9ae3e78eb1c94ee7d7c4cb0cfa0bd889e900f2abefdf75f418c79f133aee28f468f18194b3ce1cd54f1850c332d7b6fd096ee50068cc5cb542efd0bd07cd6f3' } // Waiting time
        beforeSend: function() { // Before Ajax 
            $('#content').append('<div id="load">Loading</div>'); // Load message
          },
        complete: function() { // Once finished
            $('#load').remove(); // Clear message
          },
        success: function(data) { // Show content
          $('#content').html(retrieveReps(data)).hide().fadeIn(400);
        },
        error: function() { // Show error msg 
          $('#content').html('<div id="container">Please try again soon.</div>');
        }
      });

  });

