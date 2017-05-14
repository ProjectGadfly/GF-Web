
var submit = false;
function replace(submit) {
	if (submit == true) {
		$('div.newScriptPage').remove();
		$('div.hidden').removeClass('hidden');
	}
}

function retrieve(data) {
	console.log("In retrieve")
	var newContent = '';

	console.log(data);
	for (var i = 0; i <data.length;i++) {
	newContent += '<h3 class="text-center lead margin display-4"> <strong>Script Title</strong></h3>';
	newContent += '<iframe style="border:1px solid black;width:100%;display:block;height:400px">' + data.ticket +'</iframe>';   //script goes here!
	newContent += '<h3 class="text-center head"> <strong> Script URL:</strong> <a href="http://gadfly.mobi/script/' + data.id + '">View Script</a></h3> //common audience link goes here!';
	newContent += '<h3 class="head text-center"> <b> QR code:</b></h3>';
	newContent += '<button id="delete_button">Delete Script</button>';
	newContent += '<div align="center"> <div id="qrcode"></div>';
	console.log(newContent);
	return newContent;
	}
}

function editData(data) {
	$('#content').html(retrieve(data)).hide().fadeIn(400);
}
/*
// AJAX set up with custom header for api key
$.ajaxSetup({
    beforeSend: function(xhr) {
        xhr.setRequestHeader("APIKey", "v1key");
    }
});*/
$('#writescriptform').on('submit',function(e) {
	console.log("Begin submit funciont");
//	console.log("1");
	submit = true;
//	console.log("2");
	var link = 'http://gadfly.mobi/services/v1/script';

	console.log(data);

	$.ajax({
		type:"POST",
		url: link,
		//headers: {"APIKey":"v1key"},
		beforeSend: function(request) {
			request.setRequestHeader("APIKey","v1key");
			$('#content').append('<div id = "load">Loading</div>');
		},
		complete: function(data) {
			$('#load').remove();
		},
		success: function(data) {
			console.log(data);
			console.log(String(data));
			$('#content').html(retrieveReps(data).hide().fadeIn(400));
		},
		error: function() {
			$('#content').append('<div id="container">Please try again.</div>');
		}
	});
	replaceTemplate(submit);
	console.log("3");
//});

{
	if (submit ==true) {
		$('div.front-page').remove();
		$('div.hidden').removeClass('hidden');
	}

}
});
