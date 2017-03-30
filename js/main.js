var $content = $('entirecontent');


// to post the contents 

$("#writescriptform").on('submit',function(event) {        
	event.preventDefault();
	var contentstr = $('#writescriptform').serialize();
	var $content = $("#writescriptform");      
	var api_post_url = 'http://gadfly.mobi/services/v1/script';

	$.ajax({
		type:"POST",
		url:api_post_url,
		beforeSend: function() {
			$content.append('<div id="load">Loading</div>');
		},
		complete: function() {
			$('#load').remove();
		},
		success: function(data) {
			$content.html(retrieveResponse(data) );
			//whether it is correct to load the returned data like this???
		},
		fail: function() {
			$content.html( '<div class="loading">Post failed. Please try again soon.</div>');
		}
	});
});

                   //deal with tags or not???

//contact with API

function retrieveResponse(data) {
	var newContent = '';
	var script_url = '';
	var ticket = '';
	$(function(event) {
		event.preventDefault();
		var responseObject = JSON.parse(data);				
		var urlid = responseObject.split(',')[1];
		var ticket = responseObject.split(',')[0];
		script_url= "http://gadfly.mobi/services/v1/id?ticket={"+urlid+"}";
	}                       //not really need to return another id int.!!!
		$.ajax({
			type:'GET',
			url:script_url,                                          
			beforeSend: function() {
				$content.append('<div id="load">Loading</div>');
			},
			complete: function() {
				$('#load').remove();
			},
			success: function(data) {
				newContent += top_part;
				newContent += '<iframe src=' + url +'style="border:1px solid black;width:100%;display:block;height:400px"></iframe>';
				newContent += '<h3 id="scripturl"class="text-center head"> <b> Script URL:</b> <a href=' + url + '</h3>';
				newContent += '<button id="delete_button">Delete Script</button>' 
				newContent += middle;
				newContent += '<div id="qrcode"></div>';
				newContent += bottom;
			},
			fail: function() {
				$content.html( '<div class="loading">Please try again soon.</div>');
			}
		});
		var qrcode = new QRCode("qrcode", {
  			  text: script_url,
    			  width: 128,
 			  height: 128,
  			  colorDark : "#000000",
  			  colorLight : "#ffffff",
  			  correctLevel : QRCode.CorrectLevel.H
		}); 
		$("#delete_button").on('click',function(event) {
			event.preventDefault();
			delete_url= "http://gadfly.mobi/services/v1/script?ticket={" + ticket +"}"
			$.ajax({
				type:'DELETE',
				url:delete_url,
				beforeSend: function() {
					$content.append('<div id="load">Loading</div>');
				},
				complete: function() {
					$('#load').remove();
				},
				success: function(data) {
					newContent = '<p> You have successfully deleted the script!</p>';
				},
				fail: function() {
					$content.html( '<div class="loading">Delete failed. Please try again soon.</div>');
				}
			});
	);
	return newContent;
};


	

//
//successPage.html code

var top_part = '<div class=  \"alert alert-success\" role=\"alert\">\
        <div class="container">\
            <h2 class="alert-heading padding-top"> <strong>Well done!</strong></h2>\
            <h4 class="lead display-4">You just submitted your script!</h4>\
        </div>\
    </div>\
    <div class="container">\
        <h3 class="text-center lead margin display-4> <b>Script Title</b></h3>\
	';
var delete_part = '<button onclick="deletefunction(data)">Delete me</button>'
var middle = '<h3 class=\"head text-center"> <b> QR code:</b></h3>\
        <div align="center">\';
var bottom = '</div>\  
        <div style="width:50vw;margin:0 auto" align="center">\
            <p class="text-center lead margin"> Share the script on social media!</p>\
            <div class="btn-group btn-group-lg" role="group">\
                <a class="btn btn-social-icon btn-facebook" onclick="_gaq.push(['_trackEvent", "btn-social-icon", 'click', 'btn-facebook']);"><span class="fa fa-facebook"></span></a>\
                <a class="btn btn-social-icon btn-twitter" onclick="_gaq.push(['_trackEvent', 'btn-social-icon', 'click', 'btn-twitter']);"><span class="fa fa-twitter"></span></a>\
                <a class="btn btn-social-icon btn-google" onclick="_gaq.push(['_trackEvent', 'btn-social-icon', 'click', 'btn-google']);"><span class="fa fa-google"></span></a>\
            </div>\
        </div>\
    </div>' ;

// ' or "???





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

function replaceTemplate(submit){
    if(submit === true){
    $('div.front-page').remove();
    $('div.hidden').removeClass('hidden');
  }
}

function retrieveReps(data){
var newContent = '';

  $(function(){
e.preventDefault();
var responseObject = JSON.parse(data);

for (var i = 0; i< responseObject.Results.length; i++){
  newContent += '<div class= "Representative' + i + '">';
  newContent += '<p> Representative Name:' + responseObject.event[i].name + '</p>';
  newContent += '<img src="' + responseObject.Results[i].picURL + '">';
  newContent += '<p> Phone:' + responseObject.Results[i].phone + '</p>';
  newContent += '<p> Email:' + responseObject.Results[i].email + '</p>';
  newContent += '<p> Party:' + responseObject.Results[i].party + '</p>';
  newContent += '<p> Tags:' + responseObject.Results[i].tags.toString() + '</p>';
  newContent += '</div>';
}
    });
  return newContent;
}

$('#address-form').on('submit', function(e) {
  e.preventDefault();
  console.log("1");
  submit = true;

  console.log("2");
    var link = 'http://gadfly.mobi/services/v1/representatives?address=' + $('#autocomplete').val(); // URL to load
    console.log($('#autocomplete').val())
    //var $content = $('#content'); // Cache selection

    $.ajax({
        type: "GET", // GET or POST
        url: link, // Path to file
        headers:{'APIKey':'v1key'}, // Waiting time
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
  replaceTemplate(submit);
console.log("3");
  });

