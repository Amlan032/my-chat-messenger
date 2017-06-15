var express= require("express");
var app=express();
var server=require("http").createServer(app);
var io=require("socket.io").listen(server);

users=[];
connections=[];
peoples={};

server.listen(3000);
console.log("Chat messenger is running...");
app.get("/",function(req,resp){
	resp.sendFile("chat.html",{root:__dirname});
});

app.use("/css",express.static(__dirname));
app.use("/js",express.static(__dirname));

//connecting and disconnecting users
io.sockets.on("connection",function(entry){
	connections.push(entry);
	//console.log(entry.id +" connected");
	console.log("Connected: "+connections.length+" users connected.");

	//disconnecting
	entry.on("disconnect",function(){
		//console.log(entry.id +" disconnected.");
		users.splice(users.indexOf(entry.nam),1);
		console.log(entry.nam);
		updateUsers();
		connections.splice(connections.indexOf(entry),1);
		console.log(connections.length+" users connected.");
	});

	//msg sending
	entry.on("send message",function(data){
		//console.log(data);
		io.sockets.emit("new message",{msg:data,user:entry.nam});
	
	});

	entry.on("chatmsg",function(data){
		receiver = data.recepient;
		if(receiver in peoples){
				mssg = data.txt;
				peoples[receiver].emit("private",{msg:mssg,user:entry.nam});
				
			}
		//error callback to be added
		
	});

	entry.on("user",function(name){
		users.push(name);
		entry.nam=name;
		peoples[name]=entry;
		//console.log(peoples);
		console.log(users);
		updateUsers();
	});
	function updateUsers(){
		io.sockets.emit("new babu",users);
	}
})