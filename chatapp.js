var express= require('express');
var app=express();
var http=require('http');
var server=http.createServer(app);
var users={}
server.listen(8080);
var io=require('socket.io').listen(server);
app.get('/',function (req,res) {
console.log('Co nguoi ket noi !!!');
res.sendFile(__dirname+'/views/chatui.html');
});
io.sockets.on('connection',function (socket){
socket.on('newUser',function(name,data){
    console.log("New user, Nickname: ",name);
    socket.nickname=name;
    users[name]=this.socket;
    io.sockets.emit("updateName",Object.keys(users));
});
socket.on('sendMessage',function(data){
    console.log(data);
    console.log("New Message From",socket.nickname,", Message:",data.message);
    io.sockets.emit("newMessage",{"from":socket.nickname,"message":data.message})
});
socket.on('disconnect',function(data){
    console.log("Username: ",socket.nickname," had disconnected !");
    delete users[socket.nickname];
    io.sockets.emit('updateName',Object.keys(users));
})
});
