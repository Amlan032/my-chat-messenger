$(document).ready(function(){
	var $chat = $("#chat");
	var $messageform = $("#messageform");
	var $message = $("#message");
	var $userform = $("#userform");
	var $user = $("#user");
	var socket = io.connect();
	//message writing and sending
	$messageform.on("submit",function(e){
		e.preventDefault();
		socket.emit("send message",$message.val());
		
		$message.val("");
	});
	
	//group message
	socket.on("new message",function(data){
		$chat.append('<div class="well">'+'<strong>'+data.user+'</strong>'+": "+data.msg+'</div>');
		$("#chat").animate({ scrollTop: $("#chat").height() }, "slow");
	});

	//private messaging
	socket.on("private",function(data){
		$chat.append('<div class="well personal">'+'<strong>'+data.user+'</strong>'+": "+data.msg+'</div>');
		 $("#chat").animate({ scrollTop: $("#chat").height() }, "slow");
	});
	
	//login form submission
	$userform.on("submit",function(d){
		d.preventDefault();
		if($user.val() && $("#useremail").val()){
			$userform.hide();
			$("#chatbox").show();
		}
		$("#baba").append(" : "+$user.val());
		socket.emit("user",$user.val());
		$user.val("");
	});

	//new user entry updation
	socket.on("new babu",function(name){
		onliners = name;
		var online="";
		for(var i=0;i<name.length;i++){
			online += '<li class="list-group-item onliners">'+name[i]+'</li>';
			
		}
		$("ul").html(online);
	});

	//private msg
	$("#personalmessageform").on("submit",function(a){
		a.preventDefault();
		$chat.append('<div class="well personal">'+$("#personalmessage").val()+" :"+'<strong>'+$("#recipient").val()+'</strong>'+'</div>');
		socket.emit("chatmsg",{recepient: $("#recipient").val(), txt : $("#personalmessage").val()});
		$("#recipient").val("");
		$("#personalmessage").val("");
	});

	//error handling
	socket.on("error",function(data){
		$("#error").html(data.err);
	});


	
});