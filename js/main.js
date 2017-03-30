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
		headers: { "APIKey": "v1key"},
		beforeSend: function() {
			$content.append('<div id="load">Loading</div>');
		},
		complete: function() {
			$('#load').remove();
		},
		success: function(data) {
			$content.html(retrieveResponse(data) );
		},
		fail: function() {
			$content.html( '<div class="loading">Post failed. Please try again soon.</div>');
		}
	});
});

//contact with API

function retrieveResponse(data) {
	var newContent = '';
	var script_url = '';
	var ticket = '';
	event.preventDefault();
	var responseObject = JSON.parse(data);				
	var urlid = responseObject.split(',')[2];
	var ticket = responseObject.split(',')[1];
	script_url= "http://gadfly.mobi/services/v1/script?id="+ urlid;                    
	$.ajax({
		type:'GET',
		url:script_url,   
		headers: { "APIKey": "v1key"},
		beforeSend: function() {
			$content.append('<div id="load">Loading</div>');
		},
		complete: function() {
			$('#load').remove();
		},
		success: function(data) {
			$("#newScriptPage").remove();
			$("div.hidden").removeClass();
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
		delete_url= "http://gadfly.mobi/services/v1/script?ticket=" + ticket ;
		$.ajax({
			type:'DELETE',
			url:delete_url,
			headers: { "APIKey": "v1key"},
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
	});
	return newContent;
};


	






