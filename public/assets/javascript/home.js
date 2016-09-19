//Tab logic
/*
<ul class="nav nav-tabs">
	<li class="active"><a data-toggle="tab" href="#activeBets" id="activeBets">Active</a></li>
	<li><a data-toggle="tab" href="#pendingBets" id="pendingBets">Pending</a></li>
	<li><a data-toggle="tab" href="#refBets" id="refBets">You're the Ref</a></li>
</ul>
*/
$('#activeBets').click(function (e) {
  e.preventDefault()
  $(this).tab('show')
});

$('#pendingBets').click(function (e) {
  e.preventDefault()
  $(this).tab('show')
});

$('#refBets').click(function (e) {
  e.preventDefault()
  $(this).tab('show')
});










// //Possibly unneeded modal function
// function modalIt(message){

// 	//Grab modal text area
// 	var modalTextDiv = $("#modalText");

// 	//Attach error message
// 	modalTextDiv.text(message);

// 	//Activate the modal
// 	console.log("go modal!");
// 	$("#errorModal").modal("show");
// }

//Check password matching
// $(document).ready(function(){
// 	$("#confirmPassword").onchange = matchPassword;
// });

// function matchPassword(){
// 	var inputPassword = $("#inputPassword").val();
// 	var confirmPassword = $("#confirmPassword").val();

// 	if (inputPassword != confirmPassword){
// 		confirmPassword.setCustomValidity("Passwords must match");
// 	} else {
// 		confirmPassword.setCustomValidity("");
// 	}
// };

$('.nav-tabs a[href="#profile"]').tab('profile')
$('.nav-tabs a[href="#messages"]').tab('messages')
$('.nav-tabs a[href="#profile"]').tab('profile')



