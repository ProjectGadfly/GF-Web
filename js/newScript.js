var submit = false;
var objResponse;
function replace(submit) {
	if (submit == true) {
		$('div.newScriptPage').remove();
		document.getElementById("newScriptPage").textContent = "";
		$('div.hidden').removeClass('hidden');
	}
}

function retrieve(data) {
	// for (var i = 0; i <data.length;i++) {
	// 	newContent += '<h3 class="text-center lead margin display-4"> <strong>Script Title</strong></h3>';
	//     newContent += '<iframe style="border:1px solid black;width:100%;display:block;height:400px">' + data.ticket +'</iframe>';   //script goes here!
	//     newContent += '<h3 class="text-center head"> <strong> Script URL:</strong> <a href="http://gadfly.mobi/script/' + data.id + '">View Script</a></h3>;
	//     newContent += '<h3 class="head text-center"> <b> QR code:</b></h3>';
	//     newContent += '<button id="delete_button">Delete Script</button>';
	//     newContent += '<div align="center"> <div id="qrcode"></div>';
	//     console.log(newContent);
	//     return newContent;
	// }
	var doc = document.getElementById('iframeTest').contentWindow.document;
	doc.open();
	doc.write(objResponse.token);
	doc.close();

}

function editData(data) {
	$('#content').html(retrieve(data)).hide().fadeIn(400);
}

$('#SubmitButton').on('click',function(e) {
	console.log("Begin submit funcion");
	submit = true;
	//var link = 'http://gadfly.mobi/services/v1/script';
	var link = 'https://reqres.in/api/register';
	console.log("begins function");

	$.ajax({
		type:"POST",
		url: link,
		data: {"email": "sydney@fife", "password": "pistol"},
		//headers: {"APIKey":"v1key"},
		beforeSend: function(request) {
			//request.setRequestHeader("APIKey","v1key");
		},
		complete: function(data) {
		},
		success: function(response) {
			alert("success!");
			console.log(response);
			submit == true;
			objResponse = response;
			replace(submit);
			retrieve(objResponse);
			// console.log(String(data));
			// $('#content').html(retrieveReps(data).hide().fadeIn(400));
		},
		error: function() {
			alert(":( posting failed, please try again later");
			//$('#content').append('<div id="container">Please try again.</div>');
		},
	})
});
