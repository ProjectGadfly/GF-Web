
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
		script_url= "http://www.gadfly.mobi/services/v1/id?ticket={"+urlid+"}";
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
			delete_url= "http://www.gadfly.mobi/services/v1/script?ticket={" + ticket +"}"
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





